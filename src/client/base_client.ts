import axios, { AxiosInstance } from "axios";
import { z, ZodError } from "zod";
import { logger } from "../common/logger";
import { CrowdHandlerError, createError, ErrorCodes } from "../common/errors";

/**
 * Detect if we're running in the Cloudflare Workers (workerd) runtime.
 * Workers sets navigator.userAgent to "Cloudflare-Workers" — this is the
 * documented and stable detection signal:
 * https://developers.cloudflare.com/workers/runtime-apis/web-standards/
 *
 * axios 0.27.2 has no fetch adapter and requires Node's http module, so it
 * crashes inside Workers. When we detect Workers, route HTTP through native
 * fetch instead — preserved error shape so errorHandler keeps working.
 */
const isCloudflareWorkers =
  typeof navigator !== "undefined" &&
  (navigator as any).userAgent === "Cloudflare-Workers";

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
    if (!isCloudflareWorkers) {
      // axios.defaults is process-global state and is meaningless in Workers
      // (we don't use axios there). Skip in Workers to avoid touching axios's
      // internal config which can drag in Node-only deps during import.
      axios.defaults.timeout = this.timeout;
    }
  }

  /**
   * Issue an HTTP request. Routes through axios in Node/Lambda environments
   * and native fetch in Cloudflare Workers. Both paths return / throw
   * axios-compatible shapes so errorHandler() and the response.data parsing
   * downstream work unchanged.
   */
  private async httpRequest(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    options: {
      params?: Record<string, any>;
      body?: any;
      headers?: Record<string, string>;
    } = {}
  ): Promise<{ data: any; status: number; headers: any }> {
    if (!isCloudflareWorkers) {
      // Node/Lambda path — preserve existing axios behaviour exactly.
      const response = await axios.request({
        method,
        url,
        params: options.params,
        data: options.body,
        headers: options.headers,
      });
      return { data: response.data, status: response.status, headers: response.headers };
    }

    // Workers path — native fetch with a manual timeout via AbortController.
    let finalUrl = url;
    if (options.params && Object.keys(options.params).length > 0) {
      const search = new URLSearchParams();
      for (const [k, v] of Object.entries(options.params)) {
        if (v !== undefined && v !== null) search.append(k, String(v));
      }
      finalUrl += (finalUrl.includes("?") ? "&" : "?") + search.toString();
    }

    const init: RequestInit = {
      method,
      headers: options.headers as any,
    };

    if (options.body !== undefined && method !== "GET" && method !== "DELETE") {
      init.body = typeof options.body === "string" ? options.body : JSON.stringify(options.body);
      const hasContentType = options.headers && Object.keys(options.headers)
        .some((h) => h.toLowerCase() === "content-type");
      if (!hasContentType) {
        init.headers = { ...(options.headers || {}), "content-type": "application/json" };
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    init.signal = controller.signal;

    let response: Response;
    try {
      response = await fetch(finalUrl, init);
    } catch (err: any) {
      clearTimeout(timeoutId);
      // Mirror axios's "no response received" error shape so errorHandler's
      // `else if (error.request)` branch fires.
      const wrapped: any = new Error(err?.message || "Network request failed");
      wrapped.request = { url: finalUrl, method };
      wrapped.config = { url: finalUrl, method };
      throw wrapped;
    }
    clearTimeout(timeoutId);

    // Read body — try JSON first, fall back to text.
    const contentType = response.headers.get("content-type") || "";
    let data: any;
    if (contentType.includes("application/json")) {
      try { data = await response.json(); } catch { data = null; }
    } else {
      const text = await response.text();
      try { data = JSON.parse(text); } catch { data = text; }
    }

    if (response.status < 200 || response.status >= 300) {
      // Mirror axios's error.response shape so errorHandler's
      // `if (error.response)` branch fires unchanged.
      const headersObj: Record<string, string> = {};
      response.headers.forEach((v, k) => { headersObj[k] = v; });
      const wrapped: any = new Error(`Request failed with status ${response.status}`);
      wrapped.response = { status: response.status, data, headers: headersObj };
      wrapped.config = { url: finalUrl, method };
      throw wrapped;
    }

    const headersObj: Record<string, string> = {};
    response.headers.forEach((v, k) => { headersObj[k] = v; });
    return { data, status: response.status, headers: headersObj };
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

  /**
   * Provides generic suggestion based on HTTP status code
   */
  private getGenericSuggestion(status: number): string {
    switch (status) {
      case 400: return 'Check your request parameters';
      case 401: return 'Check your authentication credentials';
      case 403: return 'You do not have permission for this action';
      case 404: return 'The requested resource was not found';
      case 429: return 'Too many requests - please slow down';
      case 500: 
      case 502:
      case 503:
      case 504:
        return 'Server error - please try again later';
      default: 
        return status >= 500 
          ? 'This appears to be a server error. Please try again later or contact support@crowdhandler.com'
          : 'Please check your request parameters and try again';
    }
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

      // Extract the error message from the API response
      const errorMessage = data?.error || data?.message || `API request failed with status ${status}`;
      
      // Special handling for rate limiting to include retry-after
      if (status === 429) {
        const retryAfter = error.response.headers['retry-after'];
        throw new CrowdHandlerError(
          ErrorCodes.RATE_LIMITED,
          errorMessage,
          retryAfter 
            ? `Wait ${retryAfter} seconds before retrying`
            : 'Reduce the frequency of API calls',
          status,
          {
            url: error.config?.url,
            method: error.config?.method,
            apiResponse: data,
            retryAfter
          }
        );
      }
      
      // Pass through the API error with full response data
      throw new CrowdHandlerError(
        ErrorCodes.API_INVALID_RESPONSE,
        errorMessage,
        this.getGenericSuggestion(status),
        status,
        { 
          url: error.config?.url,
          method: error.config?.method,
          apiResponse: data  // Full API response, not truncated
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
      const response = await this.httpRequest("DELETE", this.apiUrl + path, {
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
      const response = await this.httpRequest("GET", this.apiUrl + path, {
        params: params as Record<string, any>,
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
      const response = await this.httpRequest("POST", this.apiUrl + path, {
        body,
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
      const response = await this.httpRequest("PUT", this.apiUrl + path, {
        body,
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
