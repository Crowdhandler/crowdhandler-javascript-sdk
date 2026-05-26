import { z } from "zod";
import { Client } from "./client/client";
import { RequestContext } from "./request/requestContext";
import { Gatekeeper } from "./gatekeeper/gatekeeper";
import { GatekeeperOptions, Mode, Modes } from "./common/types";
import { CrowdHandlerError, createError, ErrorCodes } from "./common/errors";
import {
  getCloudflareWorkersOverride,
  isCloudflareWorkers,
  setCloudflareWorkersOverride,
} from "./common/runtime";
import { logger } from "./common/logger";

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

  /** Cloudflare Workers Request object (workerd runtime) */
  cloudflareWorkersRequest?: any;

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

    /**
     * Persist the CrowdHandler cookie for this many seconds via Max-Age.
     * Omit (default) to write a session cookie that the browser drops on
     * close. Set e.g. 86400 to keep the queue token across browser restarts.
     */
    cookieMaxAgeSeconds?: number;
    
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
    
    /** Test error simulation for integrator testing */
    testError?: {
      statusCode: number;
      message?: string;
    };

    /**
     * Force the SDK to treat the current runtime as Cloudflare Workers, skipping
     * the navigator.userAgent inference. Only `true` is accepted; omit the option
     * to fall back to auto-detection. Useful for environments where the navigator
     * check could mis-fire (custom workerd builds, bundlers that strip globals,
     * test harnesses) or where you simply want the transport decision to be
     * explicit rather than inferred.
     */
    forceCloudflareWorkers?: true;
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
 * @example
 * // Cloudflare Workers with explicit override (skips navigator inference)
 * const { client, gatekeeper } = crowdhandler.init({
 *   publicKey: 'pk_xyz',
 *   cloudflareWorkersRequest: request,
 *   options: { forceCloudflareWorkers: true }
 * });
 *
 * @throws {CrowdHandlerError} When configuration is invalid
 */
// Function overloads for better type inference
export function init(config: InitConfig & { request: any; response: any }): InitResultWithGatekeeper;
export function init(config: InitConfig & { lambdaEdgeEvent: any }): InitResultWithGatekeeper;
export function init(config: InitConfig & { cloudflareWorkersRequest: any }): InitResultWithGatekeeper;
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

  // Apply the Workers runtime override before constructing the Client, because
  // BaseClient's constructor reads isCloudflareWorkers() to decide whether to
  // touch axios.defaults. Unconditionally sync the module-level override so
  // repeated init() calls don't bleed state from prior invocations — omission
  // resets to null (navigator inference) rather than retaining a previously
  // forced value.
  setCloudflareWorkersOverride(
    config.options?.forceCloudflareWorkers === true ? true : null
  );

  // When a Workers context is provided, surface which signal drove the runtime
  // decision so debug logs can distinguish forced overrides from navigator
  // inference. Only emitted in debug mode.
  if (config.cloudflareWorkersRequest) {
    const source = getCloudflareWorkersOverride() !== null ? "override" : "navigator inference";
    logger(
      !!config.options?.debug,
      "info",
      `[CH] Cloudflare Workers runtime: ${isCloudflareWorkers()} (via ${source})`
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
    config.cloudflareWorkersRequest ||
    (typeof window !== 'undefined' && !config.request && !config.response && !config.lambdaEdgeEvent && !config.cloudflareWorkersRequest)
  );
  
  // Create gatekeeper if context provided
  let gatekeeper: Gatekeeper | undefined;
  
  if (hasContext) {
    // Create RequestContext
    let context: RequestContext;
    
    if (config.lambdaEdgeEvent) {
      context = new RequestContext({ lambdaEvent: config.lambdaEdgeEvent });
    } else if (config.cloudflareWorkersRequest) {
      context = new RequestContext({ cloudflareWorkersRequest: config.cloudflareWorkersRequest });
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
        '- { cloudflareWorkersRequest } for Cloudflare Workers\n' +
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
      ...(config.options?.trustOnFail !== undefined && { trustOnFail: config.options.trustOnFail }),
      fallbackSlug: config.options?.fallbackSlug,
      cookieName: config.options?.cookieName,
      cookieMaxAgeSeconds: config.options?.cookieMaxAgeSeconds,
      liteValidator: config.options?.liteValidator,
      roomsConfig: config.options?.roomsConfig,
      waitingRoom: config.options?.waitingRoom,
      testError: config.options?.testError
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