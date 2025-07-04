import axios, { AxiosInstance } from "axios";
import { z, ZodError } from "zod";
import { logger } from "../common/logger";
import { CrowdHandlerError, createError, ErrorCodes } from "../common/errors";

const APIResponse = z.object({}).catchall(z.any());

const APIErrorResponse = z
  .object({
    error: z.string().optional(),
    message: z.string().optional(),
    statusCode: z.number().optional(),
  })
  .catchall(z.any());

export class BaseClient {
  protected debug: boolean;
  protected apiUrl: string;
  protected key: string;
  protected timeout: number;

  constructor(
    apiUrl: string,
    key: string,
    options: { timeout?: number; debug?: boolean; apiUrl?: string } = {}
  ) {
    this.debug = options.debug || false;
    this.apiUrl = options.apiUrl || apiUrl;
    this.key = key;
    this.timeout = options.timeout || 5000;
    axios.defaults.timeout = this.timeout;
  }

  /**
   * Wraps any error into a CrowdHandlerError
   */
  private wrapError(error: any): CrowdHandlerError {
    // Already a CrowdHandlerError
    if (error instanceof CrowdHandlerError) {
      return error;
    }

    // Zod validation error
    if (error.name === 'ZodError') {
      return new CrowdHandlerError(
        ErrorCodes.API_INVALID_RESPONSE,
        'Invalid response format from API',
        'This might be a temporary issue. If it persists, contact support@crowdhandler.com',
        undefined,
        { parseError: error.message }
      );
    }

    // Generic unknown error
    return new CrowdHandlerError(
      ErrorCodes.UNKNOWN_ERROR,
      error.message || 'An unexpected error occurred',
      'Please try again. If the problem persists, contact support@crowdhandler.com',
      undefined,
      { 
        errorType: error.constructor?.name,
        stack: error.stack
      }
    );
  }

  async errorHandler(error: any): Promise<never> {
    // If it's already a CrowdHandlerError, just re-throw it
    if (error instanceof CrowdHandlerError) {
      throw error;
    }
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status;
      const data = error.response.data;
      
      logger(this.debug, "error", `API Error - Status: ${status} - ${JSON.stringify(data)}`);
      logger(this.debug, "error", `Response headers: ${JSON.stringify(error.response.headers)}`);

      // Handle specific HTTP status codes
      if (status === 401) {
        throw createError.invalidApiKey('public');
      }
      
      if (status === 429) {
        const retryAfter = error.response.headers['retry-after'];
        throw createError.rateLimited(retryAfter);
      }
      
      if (status === 404) {
        // Try to extract resource type from URL
        const urlMatch = error.config?.url?.match(/\/v1\/(\w+)\/(\w+)/);
        if (urlMatch) {
          const [, resourceType, resourceId] = urlMatch;
          throw createError.resourceNotFound(resourceType, resourceId);
        }
      }
      
      // Generic API error
      const errorMessage = data?.error || data?.message || `API request failed with status ${status}`;
      throw new CrowdHandlerError(
        ErrorCodes.API_INVALID_RESPONSE,
        errorMessage,
        status >= 500 
          ? 'This appears to be a server error. Please try again later or contact support@crowdhandler.com'
          : 'Please check your request parameters and try again',
        status,
        { 
          url: error.config?.url,
          method: error.config?.method,
          responseData: JSON.stringify(data).substring(0, 200)
        }
      );
      
    } else if (error.request) {
      // The request was made but no response was received
      logger(this.debug, "error", `No response received: ${error.message}`);
      
      throw createError.apiConnection(error);
      
    } else {
      // Something happened in setting up the request
      logger(this.debug, "error", `Request setup error: ${error.message}`);
      
      // Use wrapError to ensure we always throw CrowdHandlerError
      throw this.wrapError(error);
    }
  }

  async httpDELETE(path: string, body: object) {
    try {
      const response = await axios.delete(this.apiUrl + path, {
        headers: {
          "x-api-key": this.key,
        },
      });

      try {
        return APIResponse.parse(response.data);
      } catch (parseError: any) {
        throw this.wrapError(parseError);
      }
    } catch (error: any) {
      await this.errorHandler(error);
    }
  }

  async httpGET(path?: string, params?: object) {
    try {
      const response = await axios.get(this.apiUrl + path, {
        params: params,
        headers: {
          "x-api-key": this.key,
        },
      });
      
      try {
        return APIResponse.parse(response.data);
      } catch (parseError: any) {
        throw this.wrapError(parseError);
      }
    } catch (error) {
      await this.errorHandler(error);
    }
  }

  async httpPOST(
    path: string,
    body?: Record<string, any>,
    headers?: Record<string, any>,
    schema: z.Schema = APIResponse
  ) {
    try {
      const response = await axios.post(this.apiUrl + path, body, {
        headers: {
          "x-api-key": this.key,
          ...headers,
        },
      });
      
      try {
        return schema.parse(response.data);
      } catch (parseError: any) {
        throw this.wrapError(parseError);
      }
    } catch (error) {
      await this.errorHandler(error);
    }
  }

  async httpPUT(path: string, body: object) {
    try {
      const response = await axios.put(this.apiUrl + path, body, {
        headers: {
          "x-api-key": this.key,
        },
      });
      return APIResponse.parse(response.data);
    } catch (error) {
      return this.errorHandler(error);
    }
  }
}
