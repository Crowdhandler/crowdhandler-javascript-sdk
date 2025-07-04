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
export class CrowdHandlerError extends Error {
  public code: string;
  public statusCode?: number;
  public suggestion?: string;
  public context?: Record<string, any>;

  constructor(
    code: string,
    message: string,
    suggestion?: string,
    statusCode?: number,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'CrowdHandlerError';
    this.code = code;
    this.statusCode = statusCode;
    this.suggestion = suggestion;
    this.context = context;

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CrowdHandlerError);
    }
  }

  /**
   * Returns a formatted error message with all context
   */
  toString(): string {
    let errorMsg = `${this.name} [${this.code}]: ${this.message}`;
    
    if (this.suggestion) {
      errorMsg += `\n💡 Suggestion: ${this.suggestion}`;
    }
    
    if (this.statusCode) {
      errorMsg += `\n📊 Status Code: ${this.statusCode}`;
    }
    
    if (this.context && Object.keys(this.context).length > 0) {
      errorMsg += `\n🔍 Context: ${JSON.stringify(this.context, null, 2)}`;
    }
    
    return errorMsg;
  }
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
export const ErrorCodes = {
  // Network errors
  API_CONNECTION_FAILED: 'API_CONNECTION_FAILED',
  API_TIMEOUT: 'API_TIMEOUT',
  API_INVALID_RESPONSE: 'API_INVALID_RESPONSE',
  
  // Authentication errors
  INVALID_PUBLIC_KEY: 'INVALID_PUBLIC_KEY',
  INVALID_PRIVATE_KEY: 'INVALID_PRIVATE_KEY',
  MISSING_PRIVATE_KEY: 'MISSING_PRIVATE_KEY',
  AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
  
  // Configuration errors
  INVALID_CONFIG: 'INVALID_CONFIG',
  INVALID_MODE: 'INVALID_MODE',
  MISSING_CONTEXT: 'MISSING_CONTEXT',
  INVALID_CONTEXT: 'INVALID_CONTEXT',
  
  // Validation errors
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  SIGNATURE_MISMATCH: 'SIGNATURE_MISMATCH',
  
  // API response errors
  RATE_LIMITED: 'RATE_LIMITED',
  DOMAIN_NOT_FOUND: 'DOMAIN_NOT_FOUND',
  ROOM_NOT_FOUND: 'ROOM_NOT_FOUND',
  SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',
  
  // Runtime errors
  METHOD_NOT_AVAILABLE: 'METHOD_NOT_AVAILABLE',
  BROWSER_ONLY: 'BROWSER_ONLY',
  SERVER_ONLY: 'SERVER_ONLY',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

/**
 * Factory functions for creating common CrowdHandler errors.
 * Used internally by the SDK to ensure consistent error messages.
 * @internal
 */
export const createError = {
  apiConnection: (originalError: any) => {
    const isTimeout = originalError.code === 'ECONNABORTED' || originalError.code === 'ETIMEDOUT';
    const isRefused = originalError.code === 'ECONNREFUSED';
    
    if (isTimeout) {
      return new CrowdHandlerError(
        ErrorCodes.API_TIMEOUT,
        'Request to CrowdHandler API timed out',
        'Try increasing the timeout option or check your network connection',
        undefined,
        { originalError: originalError.message }
      );
    }
    
    if (isRefused) {
      return new CrowdHandlerError(
        ErrorCodes.API_CONNECTION_FAILED,
        'Could not connect to CrowdHandler API',
        'Check your internet connection and firewall settings. If the problem persists, check https://status.crowdhandler.com',
        undefined,
        { originalError: originalError.message }
      );
    }
    
    return new CrowdHandlerError(
      ErrorCodes.API_CONNECTION_FAILED,
      `Network error: ${originalError.message}`,
      'Check your network connection and try again',
      undefined,
      { originalError: originalError.message }
    );
  },

  invalidApiKey: (keyType: 'public' | 'private') => {
    const code = keyType === 'public' ? ErrorCodes.INVALID_PUBLIC_KEY : ErrorCodes.INVALID_PRIVATE_KEY;
    
    return new CrowdHandlerError(
      code,
      `Invalid ${keyType} key`,
      `Check your CrowdHandler dashboard for the correct ${keyType} key`,
      401
    );
  },

  missingPrivateKey: (method: string) => {
    return new CrowdHandlerError(
      ErrorCodes.MISSING_PRIVATE_KEY,
      `${method} requires a private key`,
      `Initialize with: crowdhandler.init({ publicKey, privateKey })`,
      403
    );
  },

  missingContext: (method: string) => {
    const example = typeof window !== 'undefined' 
      ? 'crowdhandler.init({ publicKey })'
      : 'crowdhandler.init({ publicKey, request: req, response: res })';
    
    return new CrowdHandlerError(
      ErrorCodes.MISSING_CONTEXT,
      `${method} requires request context`,
      `Initialize with: ${example}`,
      400
    );
  },

  invalidResponse: (response: any) => {
    return new CrowdHandlerError(
      ErrorCodes.API_INVALID_RESPONSE,
      'Received invalid response from CrowdHandler API',
      'This might be a temporary issue. If it persists, contact support@crowdhandler.com',
      502,
      { response: JSON.stringify(response).substring(0, 200) }
    );
  },

  rateLimited: (retryAfter?: string) => {
    return new CrowdHandlerError(
      ErrorCodes.RATE_LIMITED,
      'API rate limit exceeded',
      retryAfter 
        ? `Wait ${retryAfter} seconds before retrying`
        : 'Reduce the frequency of API calls',
      429,
      { retryAfter }
    );
  },

  resourceNotFound: (resourceType: string, resourceId: string) => {
    const errorCode = {
      domain: ErrorCodes.DOMAIN_NOT_FOUND,
      room: ErrorCodes.ROOM_NOT_FOUND,
      session: ErrorCodes.SESSION_NOT_FOUND,
    }[resourceType] || ErrorCodes.API_INVALID_RESPONSE;
    
    return new CrowdHandlerError(
      errorCode,
      `${resourceType} not found: ${resourceId}`,
      `Check that the ${resourceType} ID is correct and that you have access to it`,
      404,
      { resourceType, resourceId }
    );
  }
};