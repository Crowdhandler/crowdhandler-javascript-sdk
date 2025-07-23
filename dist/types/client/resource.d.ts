import { BaseClient } from "./base_client";
export declare class Resource extends BaseClient {
    path: string;
    constructor(key: string, path: string, options?: {
        timeout?: number;
        debug?: boolean;
        apiUrl?: string;
    });
    private formatPath;
    delete(id: string, body: object): Promise<import("zod").objectOutputType<{}, import("zod").ZodAny, "strip"> | undefined>;
    get(id?: string, params?: object): Promise<import("zod").objectOutputType<{}, import("zod").ZodAny, "strip"> | undefined>;
    post(body: object): Promise<any>;
    put(id: string, body: object): Promise<import("zod").objectOutputType<{}, import("zod").ZodAny, "strip">>;
}
