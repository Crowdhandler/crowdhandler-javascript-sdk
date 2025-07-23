/**
 * Custom error class for CrowdHandler SDK with actionable error messages.
 * All SDK errors are instances of this class, providing consistent error handling.
 *
 * @example
 * try {
 *   const { client } = crowdhandler.init({ publicKey: 'invalid' });
 * } catch (error) {
 *   // error is always a CrowdHandlerError
 *   console.log(error.code);       // 'INVALID_API_KEY'
 *   console.log(error.message);    // Human-readable message
 *   console.log(error.suggestion); // Helpful next steps
 *   console.log(error.statusCode); // HTTP status if applicable
 * }
 */
export declare class CrowdHandlerError extends Error {
    code: string;
    statusCode?: number;
    suggestion?: string;
    context?: Record<string, any>;
    constructor(code: string, message: string, suggestion?: string, statusCode?: number, context?: Record<string, any>);
    /**
     * Returns a formatted error message with all context
     */
    toString(): string;
}
/**
 * Common error codes used throughout the SDK.
 * Use these constants to handle specific error conditions.
 *
 * @example
 * try {
 *   await client.domains().get();
 * } catch (error) {
 *   if (error.code === ErrorCodes.MISSING_PRIVATE_KEY) {
 *     console.log('Need to initialize with private key');
 *   }
 * }
 */
export declare const ErrorCodes: {
    readonly API_CONNECTION_FAILED: "API_CONNECTION_FAILED";
    readonly API_TIMEOUT: "API_TIMEOUT";
    readonly API_INVALID_RESPONSE: "API_INVALID_RESPONSE";
    readonly INVALID_PUBLIC_KEY: "INVALID_PUBLIC_KEY";
    readonly INVALID_PRIVATE_KEY: "INVALID_PRIVATE_KEY";
    readonly MISSING_PRIVATE_KEY: "MISSING_PRIVATE_KEY";
    readonly AUTHENTICATION_FAILED: "AUTHENTICATION_FAILED";
    readonly INVALID_CONFIG: "INVALID_CONFIG";
    readonly INVALID_MODE: "INVALID_MODE";
    readonly MISSING_CONTEXT: "MISSING_CONTEXT";
    readonly INVALID_CONTEXT: "INVALID_CONTEXT";
    readonly VALIDATION_FAILED: "VALIDATION_FAILED";
    readonly INVALID_TOKEN: "INVALID_TOKEN";
    readonly SIGNATURE_MISMATCH: "SIGNATURE_MISMATCH";
    readonly RATE_LIMITED: "RATE_LIMITED";
    readonly DOMAIN_NOT_FOUND: "DOMAIN_NOT_FOUND";
    readonly ROOM_NOT_FOUND: "ROOM_NOT_FOUND";
    readonly SESSION_NOT_FOUND: "SESSION_NOT_FOUND";
    readonly METHOD_NOT_AVAILABLE: "METHOD_NOT_AVAILABLE";
    readonly BROWSER_ONLY: "BROWSER_ONLY";
    readonly SERVER_ONLY: "SERVER_ONLY";
    readonly UNKNOWN_ERROR: "UNKNOWN_ERROR";
};
/**
 * Factory functions for creating common CrowdHandler errors.
 * Used internally by the SDK to ensure consistent error messages.
 * @internal
 */
export declare const createError: {
    apiConnection: (originalError: any) => CrowdHandlerError;
    invalidApiKey: (keyType: 'public' | 'private') => CrowdHandlerError;
    missingPrivateKey: (method: string) => CrowdHandlerError;
    missingContext: (method: string) => CrowdHandlerError;
    invalidResponse: (response: any) => CrowdHandlerError;
    rateLimited: (retryAfter?: string) => CrowdHandlerError;
    resourceNotFound: (resourceType: string, resourceId: string) => CrowdHandlerError;
};
