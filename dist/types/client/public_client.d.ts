import { BaseClient } from "./base_client";
import { Resource } from "./resource";
export declare class PublicClient extends BaseClient {
    constructor(key: string, options?: {
        timeout?: number;
        debug?: boolean;
        apiUrl?: string;
    });
    requests(): Resource;
    responses(): Resource;
    rooms(): Resource;
}
