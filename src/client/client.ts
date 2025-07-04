import { PublicClient } from "./public_client";
import { PrivateClient } from "./private_client";
import { createError } from "../common/errors";

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
export class Client {
  private publicClient: PublicClient;
  private privateClient?: PrivateClient;
  private hasPrivateAccess: boolean;

  constructor(config: ClientConfig) {
    this.publicClient = new PublicClient(config.publicKey, config.options);
    this.hasPrivateAccess = !!config.privateKey;
    
    if (config.privateKey) {
      this.privateClient = new PrivateClient(config.privateKey, config.options);
    }
  }

  // ===== Public API Methods (always available) =====
  
  /**
   * Access request resources
   * @returns Resource instance for request operations
   * 
   * @example
   * const request = await client.requests().get('req_123');
   */
  requests() {
    return this.publicClient.requests();
  }

  /**
   * Access response resources
   * @returns Resource instance for response operations
   * 
   * @example
   * const response = await client.responses().get('res_123');
   */
  responses() {
    return this.publicClient.responses();
  }

  /**
   * Access room resources
   * @returns Resource instance for room operations
   * 
   * @example
   * const rooms = await client.rooms().get();
   * const room = await client.rooms().get('room_123');
   */
  rooms() {
    return this.publicClient.rooms();
  }

  // ===== Private API Methods (require privateKey) =====
  
  /**
   * Access account information (requires private key)
   * @returns Resource instance for account operations
   * @throws {CrowdHandlerError} When no private key is configured
   * 
   * @example
   * const account = await client.account().get();
   */
  account() {
    this.requirePrivateAccess('account()');
    return this.privateClient!.account();
  }

  accountPlan() {
    this.requirePrivateAccess('accountPlan()');
    return this.privateClient!.accountPlan();
  }

  codes() {
    this.requirePrivateAccess('codes()');
    return this.privateClient!.codes();
  }

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
  domains() {
    this.requirePrivateAccess('domains()');
    return this.privateClient!.domains();
  }

  domainIPs() {
    this.requirePrivateAccess('domainIPs()');
    return this.privateClient!.domainIPs();
  }

  domainReports() {
    this.requirePrivateAccess('domainReports()');
    return this.privateClient!.domainReports();
  }

  domainRequests() {
    this.requirePrivateAccess('domainRequests()');
    return this.privateClient!.domainRequests();
  }

  domainRooms() {
    this.requirePrivateAccess('domainRooms()');
    return this.privateClient!.domainRooms();
  }

  domainURLs() {
    this.requirePrivateAccess('domainURLs()');
    return this.privateClient!.domainURLs();
  }

  groups() {
    this.requirePrivateAccess('groups()');
    return this.privateClient!.groups();
  }

  groupBatch() {
    this.requirePrivateAccess('groupBatch()');
    return this.privateClient!.groupBatch();
  }

  groupCodes() {
    this.requirePrivateAccess('groupCodes()');
    return this.privateClient!.groupCodes();
  }

  ips() {
    this.requirePrivateAccess('ips()');
    return this.privateClient!.ips();
  }

  reports() {
    this.requirePrivateAccess('reports()');
    return this.privateClient!.reports();
  }

  roomReports() {
    this.requirePrivateAccess('roomReports()');
    return this.privateClient!.roomReports();
  }

  roomSessions() {
    this.requirePrivateAccess('roomSessions()');
    return this.privateClient!.roomSessions();
  }

  /**
   * Access session resources (requires private key)
   * @returns Resource instance for session operations
   * @throws {CrowdHandlerError} When no private key is configured
   * 
   * @example
   * const sessions = await client.sessions().get();
   * const session = await client.sessions().get('ses_123');
   */
  sessions() {
    this.requirePrivateAccess('sessions()');
    return this.privateClient!.sessions();
  }

  templates() {
    this.requirePrivateAccess('templates()');
    return this.privateClient!.templates();
  }

  // ===== Internal Methods =====
  
  /**
   * Get the internal PublicClient instance (used by Gatekeeper)
   */
  getPublicClient(): PublicClient {
    return this.publicClient;
  }

  /**
   * Check if private API access is available
   */
  hasPrivateAPIAccess(): boolean {
    return this.hasPrivateAccess;
  }

  // ===== Helper Methods =====
  private requirePrivateAccess(method: string): void {
    if (!this.hasPrivateAccess) {
      throw createError.missingPrivateKey(method);
    }
  }
}