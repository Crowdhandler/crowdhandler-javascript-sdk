"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
var public_client_1 = require("./public_client");
var private_client_1 = require("./private_client");
var errors_1 = require("../common/errors");
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
var Client = /** @class */ (function () {
    function Client(config) {
        this.publicClient = new public_client_1.PublicClient(config.publicKey, config.options);
        this.hasPrivateAccess = !!config.privateKey;
        if (config.privateKey) {
            this.privateClient = new private_client_1.PrivateClient(config.privateKey, config.options);
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
    Client.prototype.requests = function () {
        return this.publicClient.requests();
    };
    /**
     * Access response resources
     * @returns Resource instance for response operations
     *
     * @example
     * const response = await client.responses().get('res_123');
     */
    Client.prototype.responses = function () {
        return this.publicClient.responses();
    };
    /**
     * Access room resources
     * @returns Resource instance for room operations
     *
     * @example
     * const rooms = await client.rooms().get();
     * const room = await client.rooms().get('room_123');
     */
    Client.prototype.rooms = function () {
        return this.publicClient.rooms();
    };
    // ===== Private API Methods (require privateKey) =====
    /**
     * Access account information (requires private key)
     * @returns Resource instance for account operations
     * @throws {CrowdHandlerError} When no private key is configured
     *
     * @example
     * const account = await client.account().get();
     */
    Client.prototype.account = function () {
        this.requirePrivateAccess('account()');
        return this.privateClient.account();
    };
    Client.prototype.accountPlan = function () {
        this.requirePrivateAccess('accountPlan()');
        return this.privateClient.accountPlan();
    };
    Client.prototype.codes = function () {
        this.requirePrivateAccess('codes()');
        return this.privateClient.codes();
    };
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
    Client.prototype.domains = function () {
        this.requirePrivateAccess('domains()');
        return this.privateClient.domains();
    };
    Client.prototype.domainIPs = function () {
        this.requirePrivateAccess('domainIPs()');
        return this.privateClient.domainIPs();
    };
    Client.prototype.domainReports = function () {
        this.requirePrivateAccess('domainReports()');
        return this.privateClient.domainReports();
    };
    Client.prototype.domainRequests = function () {
        this.requirePrivateAccess('domainRequests()');
        return this.privateClient.domainRequests();
    };
    Client.prototype.domainRooms = function () {
        this.requirePrivateAccess('domainRooms()');
        return this.privateClient.domainRooms();
    };
    Client.prototype.domainURLs = function () {
        this.requirePrivateAccess('domainURLs()');
        return this.privateClient.domainURLs();
    };
    Client.prototype.groups = function () {
        this.requirePrivateAccess('groups()');
        return this.privateClient.groups();
    };
    Client.prototype.groupBatch = function () {
        this.requirePrivateAccess('groupBatch()');
        return this.privateClient.groupBatch();
    };
    Client.prototype.groupCodes = function () {
        this.requirePrivateAccess('groupCodes()');
        return this.privateClient.groupCodes();
    };
    Client.prototype.ips = function () {
        this.requirePrivateAccess('ips()');
        return this.privateClient.ips();
    };
    Client.prototype.reports = function () {
        this.requirePrivateAccess('reports()');
        return this.privateClient.reports();
    };
    Client.prototype.roomReports = function () {
        this.requirePrivateAccess('roomReports()');
        return this.privateClient.roomReports();
    };
    Client.prototype.roomSessions = function () {
        this.requirePrivateAccess('roomSessions()');
        return this.privateClient.roomSessions();
    };
    /**
     * Access session resources (requires private key)
     * @returns Resource instance for session operations
     * @throws {CrowdHandlerError} When no private key is configured
     *
     * @example
     * const sessions = await client.sessions().get();
     * const session = await client.sessions().get('ses_123');
     */
    Client.prototype.sessions = function () {
        this.requirePrivateAccess('sessions()');
        return this.privateClient.sessions();
    };
    Client.prototype.templates = function () {
        this.requirePrivateAccess('templates()');
        return this.privateClient.templates();
    };
    // ===== Internal Methods =====
    /**
     * Get the internal PublicClient instance (used by Gatekeeper)
     */
    Client.prototype.getPublicClient = function () {
        return this.publicClient;
    };
    /**
     * Check if private API access is available
     */
    Client.prototype.hasPrivateAPIAccess = function () {
        return this.hasPrivateAccess;
    };
    // ===== Helper Methods =====
    Client.prototype.requirePrivateAccess = function (method) {
        if (!this.hasPrivateAccess) {
            throw errors_1.createError.missingPrivateKey(method);
        }
    };
    return Client;
}());
exports.Client = Client;
