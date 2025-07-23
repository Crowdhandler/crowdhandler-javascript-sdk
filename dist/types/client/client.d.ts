import { PublicClient } from "./public_client";
/**
 * Configuration for the unified Client
 */
interface ClientConfig {
    /** Your CrowdHandler public key */
    publicKey: string;
    /** Your CrowdHandler private key (required for private API access) */
    privateKey?: string;
    /** Additional client options */
    options?: {
        /** API request timeout in milliseconds (default: 5000) */
        timeout?: number;
        /** Enable debug logging (default: false) */
        debug?: boolean;
        /** Custom API URL (default: https://api.crowdhandler.com) */
        apiUrl?: string;
    };
}
/**
 * Unified CrowdHandler API client that combines public and private API access.
 *
 * This client provides a single interface to all CrowdHandler API endpoints,
 * with intelligent error messages when attempting to use private endpoints
 * without a private key.
 *
 * @example
 * // Public API only
 * const client = new Client({ publicKey: 'pk_xyz' });
 * const rooms = await client.rooms().get();
 *
 * @example
 * // Public and Private API
 * const client = new Client({
 *   publicKey: 'pk_xyz',
 *   privateKey: 'sk_xyz'
 * });
 * const domains = await client.domains().get();
 */
export declare class Client {
    private publicClient;
    private privateClient?;
    private hasPrivateAccess;
    constructor(config: ClientConfig);
    /**
     * Access request resources
     * @returns Resource instance for request operations
     *
     * @example
     * const request = await client.requests().get('req_123');
     */
    requests(): import("./resource").Resource;
    /**
     * Access response resources
     * @returns Resource instance for response operations
     *
     * @example
     * const response = await client.responses().get('res_123');
     */
    responses(): import("./resource").Resource;
    /**
     * Access room resources
     * @returns Resource instance for room operations
     *
     * @example
     * const rooms = await client.rooms().get();
     * const room = await client.rooms().get('room_123');
     */
    rooms(): import("./resource").Resource;
    /**
     * Access account information (requires private key)
     * @returns Resource instance for account operations
     * @throws {CrowdHandlerError} When no private key is configured
     *
     * @example
     * const account = await client.account().get();
     */
    account(): import("./resource").Resource;
    accountPlan(): import("./resource").Resource;
    codes(): import("./resource").Resource;
    /**
     * Access domain resources (requires private key)
     * @returns Resource instance for domain operations
     * @throws {CrowdHandlerError} When no private key is configured
     *
     * @example
     * const domains = await client.domains().get();
     * const domain = await client.domains().get('dom_123');
     * const newDomain = await client.domains().post({ domain: 'example.com' });
     */
    domains(): import("./resource").Resource;
    domainIPs(): import("./resource").Resource;
    domainReports(): import("./resource").Resource;
    domainRequests(): import("./resource").Resource;
    domainRooms(): import("./resource").Resource;
    domainURLs(): import("./resource").Resource;
    groups(): import("./resource").Resource;
    groupBatch(): import("./resource").Resource;
    groupCodes(): import("./resource").Resource;
    ips(): import("./resource").Resource;
    reports(): import("./resource").Resource;
    roomReports(): import("./resource").Resource;
    roomSessions(): import("./resource").Resource;
    /**
     * Access session resources (requires private key)
     * @returns Resource instance for session operations
     * @throws {CrowdHandlerError} When no private key is configured
     *
     * @example
     * const sessions = await client.sessions().get();
     * const session = await client.sessions().get('ses_123');
     */
    sessions(): import("./resource").Resource;
    templates(): import("./resource").Resource;
    /**
     * Get the internal PublicClient instance (used by Gatekeeper)
     */
    getPublicClient(): PublicClient;
    /**
     * Check if private API access is available
     */
    hasPrivateAPIAccess(): boolean;
    private requirePrivateAccess;
}
export {};
