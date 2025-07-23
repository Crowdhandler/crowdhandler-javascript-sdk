import { Client } from "./client/client";
import { Gatekeeper } from "./gatekeeper/gatekeeper";
import { Mode } from "./common/types";
/**
 * Configuration options for initializing CrowdHandler
 */
export interface InitConfig {
    /** Your CrowdHandler public key (required) */
    publicKey: string;
    /** Your CrowdHandler private key (optional - required for private API access) */
    privateKey?: string;
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
export declare type InitResult = InitResultWithoutGatekeeper | InitResultWithGatekeeper;
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
export declare function init(config: InitConfig & {
    request: any;
    response: any;
}): InitResultWithGatekeeper;
export declare function init(config: InitConfig & {
    lambdaEdgeEvent: any;
}): InitResultWithGatekeeper;
export declare function init(config: InitConfig): InitResult;
