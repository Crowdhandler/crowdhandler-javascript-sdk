import { BaseClient } from "./base_client";
import { Resource } from "./resource";
export declare class PrivateClient extends BaseClient {
    constructor(key: string, options?: {
        timeout?: number;
        debug?: boolean;
        apiUrl?: string;
    });
    account(): Resource;
    accountPlan(): Resource;
    codes(): Resource;
    domains(): Resource;
    domainIPs(): Resource;
    domainReports(): Resource;
    domainRequests(): Resource;
    domainRooms(): Resource;
    domainURLs(): Resource;
    groups(): Resource;
    groupBatch(): Resource;
    groupCodes(): Resource;
    ips(): Resource;
    reports(): Resource;
    rooms(): Resource;
    roomReports(): Resource;
    roomSessions(): Resource;
    sessions(): Resource;
    templates(): Resource;
}
