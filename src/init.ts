import { z } from "zod";
import { Client } from "./client/client";
import { RequestContext } from "./request/requestContext";
import { Gatekeeper } from "./gatekeeper/gatekeeper";
import { GatekeeperOptions, Mode, Modes } from "./common/types";
import { CrowdHandlerError, createError, ErrorCodes } from "./common/errors";

/**
 * Configuration options for initializing CrowdHandler
 */
export interface InitConfig {
  /** Your CrowdHandler public key (required) */
  publicKey: string;
  
  /** Your CrowdHandler private key (optional - required for private API access) */
  privateKey?: string;
  
  // Context options - provide one of these
  /** Express/Node.js request object */
  request?: any;
  
  /** Express/Node.js response object */
  response?: any;
  
  /** AWS Lambda@Edge event object */
  lambdaEdgeEvent?: any;
  
  /** Additional configuration options */
  options?: {
    /** 
     * Validation mode
     * - 'full': Server-side validation (default for server environments)
     * - 'hybrid': Uses signature method to reduce API calls, offloads non-critical processes to browser
     * - 'clientside': Browser-only validation (default for browser)
     * - 'auto': Automatically detect based on environment
     */
    mode?: Mode;
    
    /** API request timeout in milliseconds (default: 5000) */
    timeout?: number;
    
    /** Enable debug logging (default: false) */
    debug?: boolean;
    
    /** Custom API URL (default: https://api.crowdhandler.com) */
    apiUrl?: string;
    
    /** Trust users on API failure (default: true) */
    trustOnFail?: boolean;
    
    /** Fallback room slug if none matches */
    fallbackSlug?: string;
    
    /** Custom cookie name (default: 'crowdhandler') */
    cookieName?: string;
    
    /** Enable lite validator mode */
    liteValidator?: boolean;
    
    /** Room configuration for lite validator - array of room configs */
    roomsConfig?: Array<{
      domain: string;
      slug: string;
      urlPattern?: string;
      patternType?: 'regex' | 'contains' | 'all';
      queueActivatesOn?: number;
      timeout?: number;
    }>;
    
    /** Whether this is a waiting room implementation (default: false) */
    waitingRoom?: boolean;
  };
}

/**
 * Result when init is called without context (API-only mode)
 */
export interface InitResultWithoutGatekeeper {
  /** Unified API client for making CrowdHandler API calls */
  client: Client;
  
  /** Gatekeeper is not available in API-only mode */
  gatekeeper?: never;
}

/**
 * Result when init is called with context (protection mode)
 */
export interface InitResultWithGatekeeper {
  /** Unified API client for making CrowdHandler API calls */
  client: Client;
  
  /** Gatekeeper instance for request validation */
  gatekeeper: Gatekeeper;
}

/**
 * Result returned from the init() function
 */
export type InitResult = InitResultWithoutGatekeeper | InitResultWithGatekeeper;

/**
 * Initialize CrowdHandler with the provided configuration.
 * Returns a client for API access and optionally a gatekeeper for request validation.
 * 
 * @param config - Configuration object containing keys and optional context
 * @returns An object containing the API client and optional gatekeeper
 * 
 * @example
 * // API-only usage
 * const { client } = crowdhandler.init({ 
 *   publicKey: 'pk_xyz' 
 * });
 * 
 * @example
 * // Full protection with Express
 * const { client, gatekeeper } = crowdhandler.init({
 *   publicKey: 'pk_xyz',
 *   privateKey: 'sk_xyz',
 *   request: req,
 *   response: res
 * });
 * 
 * @example
 * // Browser usage
 * const { client, gatekeeper } = crowdhandler.init({
 *   publicKey: 'pk_xyz',
 *   options: { mode: 'clientside' }
 * });
 * 
 * @example
 * // Lambda@Edge usage
 * const { client, gatekeeper } = crowdhandler.init({
 *   publicKey: 'pk_xyz',
 *   privateKey: 'sk_xyz',
 *   lambdaEdgeEvent: event
 * });
 * 
 * @throws {CrowdHandlerError} When configuration is invalid
 */
// Function overloads for better type inference
export function init(config: InitConfig & { request: any; response: any }): InitResultWithGatekeeper;
export function init(config: InitConfig & { lambdaEdgeEvent: any }): InitResultWithGatekeeper;
export function init(config: InitConfig): InitResult;

// Implementation
export function init(config: InitConfig): InitResult {
  // Validate configuration
  if (!config.publicKey) {
    throw new CrowdHandlerError(
      ErrorCodes.INVALID_CONFIG,
      'publicKey is required',
      'Provide your public key from the CrowdHandler dashboard: crowdhandler.init({ publicKey: "YOUR_KEY" })'
    );
  }
  
  // Create unified client
  const client = new Client({
    publicKey: config.publicKey,
    privateKey: config.privateKey,
    options: config.options
  });
  
  // Check if context was provided
  const hasContext = !!(
    (config.request && config.response) || 
    config.lambdaEdgeEvent || 
    (typeof window !== 'undefined' && !config.request && !config.response && !config.lambdaEdgeEvent)
  );
  
  // Create gatekeeper if context provided
  let gatekeeper: Gatekeeper | undefined;
  
  if (hasContext) {
    // Create RequestContext
    let context: RequestContext;
    
    if (config.lambdaEdgeEvent) {
      context = new RequestContext({ lambdaEvent: config.lambdaEdgeEvent });
    } else if (config.request && config.response) {
      context = new RequestContext({ request: config.request, response: config.response });
    } else if (typeof window !== 'undefined') {
      context = new RequestContext({});
    } else {
      throw new CrowdHandlerError(
        ErrorCodes.INVALID_CONTEXT,
        'Invalid context configuration',
        'Provide either:\n' +
        '- { request, response } for Express/Node.js\n' +
        '- { lambdaEdgeEvent } for Lambda@Edge\n' +
        '- Nothing for browser environment'
      );
    }
    
    // Auto-detect mode
    const mode = detectMode(config);
    
    // Prepare gatekeeper options
    const gatekeeperOptions: z.infer<typeof GatekeeperOptions> = {
      mode,
      debug: config.options?.debug,
      timeout: config.options?.timeout,
      trustOnFail: config.options?.trustOnFail,
      fallbackSlug: config.options?.fallbackSlug,
      cookieName: config.options?.cookieName,
      liteValidator: config.options?.liteValidator,
      roomsConfig: config.options?.roomsConfig,
      waitingRoom: config.options?.waitingRoom
    };
    
    // Create gatekeeper using the public client from our unified client
    gatekeeper = new Gatekeeper(
      client.getPublicClient(),
      context,
      {
        publicKey: config.publicKey,
        privateKey: config.privateKey
      },
      gatekeeperOptions
    );
  }
  
  return { client, gatekeeper };
}

/**
 * Detect the appropriate mode based on configuration and environment
 */
function detectMode(config: InitConfig): Exclude<Mode, 'auto'> {
  // Explicit mode takes precedence
  if (config.options?.mode && config.options.mode !== 'auto') {
    // Validate mode requirements
    if (config.options.mode === 'hybrid' && !config.privateKey) {
      throw new CrowdHandlerError(
        ErrorCodes.INVALID_MODE,
        'Hybrid mode requires a privateKey',
        'Either provide a privateKey or use "full" mode'
      );
    }
    return config.options.mode;
  }
  
  // Auto-detect based on environment
  if (typeof window !== 'undefined') {
    return 'clientside';
  }
  
  // Default to 'full' mode for server environments
  // (hybrid mode must be explicitly chosen)
  return 'full';
}