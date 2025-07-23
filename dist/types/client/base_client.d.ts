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
     * Wraps any error into a CrowdHandlerError
     */
    private wrapError;
    errorHandler(error: any): Promise<never>;
    httpDELETE(path: string, body: object): Promise<z.objectOutputType<{}, z.ZodAny, "strip"> | undefined>;
    httpGET(path?: string, params?: object): Promise<z.objectOutputType<{}, z.ZodAny, "strip"> | undefined>;
    httpPOST(path: string, body?: Record<string, any>, headers?: Record<string, any>, schema?: z.Schema): Promise<any>;
    httpPUT(path: string, body: object): Promise<z.objectOutputType<{}, z.ZodAny, "strip">>;
}
