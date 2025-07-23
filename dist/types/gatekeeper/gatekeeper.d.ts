import { Signature } from "./signature";
import { Timer } from "../common/timer";
import "../common/types";
import { z } from "zod";
import { GatekeeperOptions, GatekeeperKeyPair, RoomMetaObject, CookieObject, SessionStatusWrapper, RecordPerformanceOptions, SignatureSourceObject, LocalStorageObject, LocalStorageOptions } from "../common/types";
export declare class Gatekeeper {
    PublicClient: any;
    private WAIT_URL;
    readonly STORAGE_NAME: string;
    readonly REQUEST: any;
    inWaitingRoom: boolean;
    private ignore;
    private hashedPrivateKey;
    private publicKey;
    private readonly privateKey;
    private options;
    activeConfig: z.infer<typeof RoomMetaObject>;
    cookies: Array<string>;
    cookieValue: z.infer<typeof CookieObject> | undefined;
    simpleCookieValue: string | undefined;
    localStorageValue: z.infer<typeof LocalStorageObject> | null | undefined;
    storageKey: string | undefined;
    private cookieSignatureObject;
    private cookieTokenObject;
    private signatureType;
    private simpleSignature;
    private complexSignature;
    token: string;
    responseID: string | undefined;
    timer: Timer;
    host: string;
    path: string;
    agent: string | undefined;
    ip: string | undefined;
    lang: string | undefined;
    sessionStatus: z.infer<typeof SessionStatusWrapper> | undefined;
    private requested;
    private deployment;
    private specialParameters;
    targetURL: string | undefined;
    constructor(PublicClient: any, request: any, keyPair: z.infer<typeof GatekeeperKeyPair>, options: z.infer<typeof GatekeeperOptions>);
    /**
     * Override the request host for testing or special routing needs.
     *
     * @param {string} host - The host to use (e.g., 'example.com')
     */
    overrideHost(host: string): void;
    overridePath(path: string): void;
    overrideIP(ip: string): void;
    overrideLang(lang: string): void;
    overrideUserAgent(agent: string): void;
    overrideCookie(cookie: Array<string>): void;
    /**
     * Overrides the default CrowdHandler waiting room with your custom URL.
     *
     * @param {string} url - The custom waiting room URL
     *
     * @example
     * // Redirect to your custom queue page
     * gatekeeper.overrideWaitingRoomUrl('https://mysite.com/custom-queue');
     */
    overrideWaitingRoomUrl(url: string): void;
    setIgnoreUrls(regExp: RegExp): void;
    getConfig(): Promise<void>;
    /**
     * Retrieves the current session status using GET call if a token is available, or POST call otherwise.
     * @returns {Promise<void>} A Promise that resolves when the method has completed.
     */
    getSessionStatus(): Promise<void>;
    /**
     * Processes the URL from the request to extract the target URL and any special parameters.
     */
    processURL(): void;
    /**
     * Extracts the signature from the given signature source.
     * @param signatureSource - The source from which to extract the signature.
     */
    getSignature(signatureSource: z.infer<typeof SignatureSourceObject>): void;
    /**
     * Extracts and sets the token from various sources (URL params, cookies, etc).
     * This is an internal method used during request validation.
     * @param options - The options for extracting the token.
     */
    private extractToken;
    /**
     * Verifies if the given token is valid based on its format.
     * @param token - The token to be validated.
     * @returns True if the token is valid, false otherwise.
     */
    private isValidToken;
    /**
     * Extracts and sets the token from the provided chID if it's valid.
     * @param chID - The chID to extract the token from.
     * @throws {Error} When the token format is invalid.
     */
    private extractTokenFromChID;
    /**
     * Extracts and sets the token from a complex cookie value if it's valid.
     * @param crowdhandlerCookieValue - The crowdhandler cookie value to extract the token from.
     * @throws {Error} When the token format is invalid.
     */
    private extractTokenFromComplexCookie;
    /**
     * Extracts and sets the token from a simple cookie value if it's valid.
     * @param simpleCookieValue - The simple cookie value to extract the token from.
     * @throws {Error} When the token format is invalid.
     */
    private extractTokenFromSimpleCookie;
    /**
     * Determines whether to use the slug or the domain to store the token, setting the storageKey accordingly.
     */
    private findStorageKey;
    /**
     * Retrieves the token from local storage if possible.
     * @throws {Error} When the storage key or local storage value is undefined.
     */
    getTokenFromLocalStorage(): void;
    /**
     * Validates the signature.
     *
     * @returns the result of signature validation
     */
    validateSignature(): ReturnType<Signature["validateSignature"]>;
    /**
     * Convenience method that handles the complete redirect flow for non-promoted users.
     * Automatically manages cookies and redirects.
     *
     * @returns {string} Success message after redirect
     * @throws {Error} If unable to determine redirect URL
     *
     * @example
     * if (!result.promoted) {
     *   return gatekeeper.redirectIfNotPromoted();
     * }
     */
    redirectIfNotPromoted(): string;
    /**
     * Redirects the request to the decoded target URL.
     *
     * @param targetURL The target URL to redirect to.
     * @throws {Error} If decoding or redirecting fails.
     */
    /**
     * Removes CrowdHandler tracking parameters from URLs. Use when result.stripParams is true
     * to keep URLs clean.
     *
     * @param {string} targetURL - The encoded URL to clean and redirect to (from result.targetURL)
     * @throws {Error} If the decoded URL is not a valid HTTP(S) URL
     *
     * @example
     * if (result.stripParams) {
     *   return gatekeeper.redirectToCleanUrl(result.targetURL);
     * }
     */
    redirectToCleanUrl(targetURL: string): void;
    /**
     * Generates a redirect URL based on multiple fallback conditions.
     *
     * @throws {Error} If targetURL, token, or publicKey is missing or invalid.
     * @returns The generated redirect URL.
     */
    getRedirectUrl(): string;
    /**
     * Generates token and signature objects for cookies.
     *
     * @throws {Error} If token generation fails.
     */
    private generateCookieObjects;
    updateLocalStorageToken(token: string): void;
    /**
     * Retrieves and processes cookies from request or override.
     */
    private getCookie;
    generateCookie(tokens: any[], deployment?: string): {
        integration: string;
        tokens: any[];
        deployment: string;
    };
    /**
     * Sets the CrowdHandler session cookie. Always call this when result.setCookie is true
     * to maintain the user's queue position.
     *
     * @param {string} value - The cookie value to set (from result.cookieValue)
     * @returns {boolean} True if the cookie was successfully set, false otherwise
     *
     * @example
     * if (result.setCookie) {
     *   gatekeeper.setCookie(result.cookieValue);
     * }
     */
    setCookie(value: string): boolean;
    /**
     * Set a local storage item.
     *
     * @param options - Optional. An object containing the storage name and the local storage value.
     *
     * @throws If an error occurs while setting the local storage item, an Error is thrown and caught, logged with the logger,
     * and the function returns false.
     *
     * @returns True if the local storage item was successfully set, false otherwise.
     */
    setLocalStorage(options?: z.infer<typeof LocalStorageOptions>): boolean;
    /**
     * Get a local storage item.
     *
     * @throws If an error occurs while getting or parsing the local storage item,
     * an Error is thrown and caught, logged with the logger, and the function returns null.
     *
     * @returns The value from local storage parsed as a LocalStorageObject, or null if an error occurs or if the item does not exist.
     */
    getLocalStorage(): z.infer<typeof LocalStorageObject> | null;
    /**
     * Records performance metrics to help CrowdHandler optimize queue flow and capacity.
     *
     * @param {RecordPerformanceOptions} options - Optional performance recording options:
     * - `sample` {number} - Sample rate (0-1). Default: 0.2 (20% of requests)
     * - `statusCode` {number} - HTTP status code. Default: 200
     * - `overrideElapsed` {number} - Override elapsed time in ms
     * - `responseID` {string} - Specific response ID to record
     *
     * @example
     * // Simple usage (recommended)
     * await gatekeeper.recordPerformance();
     *
     * @example
     * // With custom options
     * await gatekeeper.recordPerformance({
     *   sample: 0.2,  // Sample 20% of requests
     *   statusCode: 200
     * });
     */
    recordPerformance(options?: z.infer<typeof RecordPerformanceOptions>): Promise<void>;
    /**
     * Extracts the creation date from a token's base60 encoded timestamp
     */
    private tokenCreationDate;
    /**
     * Checks if a token is older than 12 hours
     */
    private isOldToken;
    /**
     * Checks if the current request matches any configured room patterns
     * Rooms are pre-ordered by precedence (regex → contains → all)
     * First match wins
     */
    private matchRoomConfig;
    /**
     * Pattern checking logic - matches reference implementation
     */
    private patternCheck;
    /**
     * Determines if the request should be redirected to the lite validator
     */
    private shouldRedirectToLiteValidator;
    /**
     * Builds the lite validator redirect URL
     */
    private buildLiteValidatorUrl;
    /**
     * The primary method for validating requests against CrowdHandler's queue system.
     * Determines whether a user should be granted access to your protected resource or sent to a waiting room.
     *
     * @returns {Promise<ValidateRequestObject>} Instructions on how to handle the request:
     * - `promoted` {boolean} - true = grant access, false = send to waiting room
     * - `setCookie` {boolean} - true = update the user's session cookie
     * - `cookieValue` {string} - The session token to store in the cookie
     * - `stripParams` {boolean} - true = remove CrowdHandler URL parameters
     * - `targetURL` {string} - Where to redirect (clean URL or waiting room)
     * - `slug` {string} - The waiting room slug (when not promoted)
     * - `responseID` {string} - Response ID for performance tracking (when promoted)
     * - `deployment` {string} - Deployment identifier from the API
     * - `token` {string} - The session token
     * - `hash` {string | null} - Signature hash for validation (when available)
     * - `liteValidatorRedirect` {boolean} - Whether to redirect for lite validation
     * - `liteValidatorUrl` {string} - URL for lite validator redirect
     *
     * @example
     * const result = await gatekeeper.validateRequest();
     * if (!result.promoted) {
     *   return gatekeeper.redirectIfNotPromoted();
     * }
     *
     * @throws {CrowdHandlerError} When API connection fails (check error.code === 'API_CONNECTION_FAILED')
     */
    validateRequest(): Promise<{
        promoted: boolean;
        stripParams: boolean;
        setCookie: boolean;
        setLocalStorage: boolean;
        cookieValue?: string | undefined;
        localStorageValue?: string | undefined;
        responseID?: string | undefined;
        slug?: string | undefined;
        targetURL?: string | undefined;
        deployment?: string | undefined;
        hash?: string | null | undefined;
        token?: string | undefined;
        liteValidatorRedirect?: boolean | undefined;
        liteValidatorUrl?: string | undefined;
    } | undefined>;
    /**
     * Validate request in a client-side mode.
     *
     * This method checks for a CrowdHandler cookie and gets the session status for the request.
     * It works the same as full mode but runs in browser environments.
     *
     * @return {Promise<z.infer<typeof validateRequestObject>>} Result of the validation process.
     */
    private validateRequestClientSideMode;
    /**
     * Validates the request by making full use of CrowdHandler API.
     * It handles the request and sets the necessary response based on the session status and API response.
     * @return {Promise<z.infer<typeof ValidateRequestObject>>} - The resulting status after validating the request.
     */
    private validateRequestFullMode;
    /**
     * Validate request using signature and/or Crowdhandler API when required
     */
    private validateRequestHybridMode;
}
