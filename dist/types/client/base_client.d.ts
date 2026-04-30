import { z } from "zod";
export declare class BaseClient {
    protected debug: boolean;
    protected apiUrl: string;
    protected key: string;
    protected timeout: number;
    constructor(apiUrl: string, key: string, options?: {
        timeout?: number;
        debug?: boolean;
        apiUrl?: string;
    });
    /**
     * Issue an HTTP request. Routes through axios in Node/Lambda environments
     * and native fetch in Cloudflare Workers. Both paths return / throw
     * axios-compatible shapes so errorHandler() and the response.data parsing
     * downstream work unchanged.
     */
    private httpRequest;
    /**
     * Wraps any error into a CrowdHandlerError
     */
    private wrapError;
    /**
     * Provides generic suggestion based on HTTP status code
     */
    private getGenericSuggestion;
    errorHandler(error: any): Promise<never>;
    httpDELETE(path: string, body: object): Promise<z.objectOutputType<{}, z.ZodAny, "strip"> | undefined>;
    httpGET(path?: string, params?: object): Promise<z.objectOutputType<{}, z.ZodAny, "strip"> | undefined>;
    httpPOST(path: string, body?: Record<string, any>, headers?: Record<string, any>, schema?: z.Schema): Promise<any>;
    httpPUT(path: string, body: object, options?: {
        timeout?: number;
    }): Promise<z.objectOutputType<{}, z.ZodAny, "strip">>;
}
