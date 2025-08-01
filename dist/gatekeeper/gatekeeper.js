"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gatekeeper = void 0;
var configParse_1 = require("./configParse");
var processURL_1 = require("../common/processURL");
var signature_1 = require("./signature");
var tokenObject_1 = require("./tokenObject");
var logger_1 = require("../common/logger");
var ipDiscover_1 = require("../common/ipDiscover");
var languageDiscover_1 = require("../common/languageDiscover");
var userAgentDiscover_1 = require("../common/userAgentDiscover");
var timer_1 = require("../common/timer");
var ignoredPatternsCheck_1 = require("../common/ignoredPatternsCheck");
require("../common/types");
var types_1 = require("../common/types");
var hash_1 = require("../common/hash");
var Gatekeeper = /** @class */ (function () {
    function Gatekeeper(PublicClient, request, keyPair, options) {
        this.WAIT_URL = "https://wait.crowdhandler.com";
        this.ignore = /^((?!.*\?).*(\.(avi|css|eot|gif|ico|jpg|jpeg|js|json|mov|mp4|mpeg|mpg|og[g|v]|pdf|png|svg|ttf|txt|wmv|woff|woff2|xml))$)/;
        this.options = {
            debug: false,
            fallbackSlug: "",
            mode: "full",
            timeout: 5000,
            trustOnFail: true,
            waitingRoom: false,
        };
        this.cookies = [];
        this.simpleSignature = [];
        this.complexSignature = [];
        this.specialParameters = {
            chCode: "",
            chID: "",
            chIDSignature: "",
            chPublicKey: "",
            chRequested: "",
        };
        this.PublicClient = PublicClient;
        this.REQUEST = request;
        this.publicKey = keyPair.publicKey;
        this.privateKey = keyPair.privateKey;
        //Merge provided options with defaults
        this.options = Object.assign({}, this.options, options);
        // Set cookie name from options or use default
        this.STORAGE_NAME = this.options.cookieName || "crowdhandler";
        //Hash the private key if mode is set to hybrid
        //Check if privateKey is provided when mode is set to "hybrid"
        if (this.options.mode === "hybrid" &&
            (this.privateKey === undefined || this.privateKey === "")) {
            throw new Error("privateKey must be provided when mode is set to 'hybrid'");
        }
        if (this.options.mode === "hybrid" && this.privateKey !== undefined) {
            try {
                this.hashedPrivateKey = (0, hash_1.generateSignature)(this.privateKey);
            }
            catch (error) {
                (0, logger_1.logger)(this.options.debug, "Error generating private key hash: ", error);
            }
        }
        this.host = this.REQUEST.getHost();
        this.path = this.REQUEST.getPath();
        if (this.options.mode === "full" || this.options.mode === "hybrid") {
            this.ip = (0, ipDiscover_1.getIP)(this.REQUEST);
            this.lang = (0, languageDiscover_1.getLang)(this.REQUEST);
            this.agent = (0, userAgentDiscover_1.getUserAgent)(this.REQUEST);
        }
        //Start the timer
        this.timer = new timer_1.Timer();
        // Extract slug if this is a waiting room implementation
        if (this.options.waitingRoom) {
            this.extractSlugFromPath();
        }
    }
    //Set the host using your own method if you're not happy with the default
    /**
     * Override the request host for testing or special routing needs.
     *
     * @param {string} host - The host to use (e.g., 'example.com')
     */
    Gatekeeper.prototype.overrideHost = function (host) {
        this.host = host;
    };
    //Set the path using your own method if you're not happy with the default
    Gatekeeper.prototype.overridePath = function (path) {
        this.path = path;
    };
    //Set the IP using your own method if you're not happy with the default
    Gatekeeper.prototype.overrideIP = function (ip) {
        this.ip = ip;
    };
    //Set the language using your own method if you're not happy with the default
    Gatekeeper.prototype.overrideLang = function (lang) {
        this.lang = lang;
    };
    //Set the user agent using your own method if you're not happy with the default
    Gatekeeper.prototype.overrideUserAgent = function (agent) {
        this.agent = agent;
    };
    //Set the cookie using your own method if you're not happy with the default
    Gatekeeper.prototype.overrideCookie = function (cookie) {
        this.cookies = cookie;
    };
    /**
     * Overrides the default CrowdHandler waiting room with your custom URL.
     *
     * @param {string} url - The custom waiting room URL
     *
     * @example
     * // Redirect to your custom queue page
     * gatekeeper.overrideWaitingRoomUrl('https://mysite.com/custom-queue');
     */
    Gatekeeper.prototype.overrideWaitingRoomUrl = function (url) {
        this.WAIT_URL = url;
    };
    /* If you have your own regular expression for urls to ignore set it here
     * @param string $regExp Regular Expression
     */
    Gatekeeper.prototype.setIgnoreUrls = function (regExp) {
        this.ignore = regExp;
    };
    /*
     * Fetch the room config feed
     * @return object
     */
    Gatekeeper.prototype.getConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, configParse, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.PublicClient.rooms().get()];
                    case 1:
                        response = _a.sent();
                        configParse = new configParse_1.ConfigParse(response.result, this.host, this.path, this.ignore);
                        result = configParse.parse();
                        this.activeConfig = types_1.RoomMetaObject.parse(result);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieves the current session status using GET call if a token is available, or POST call otherwise.
     * @returns {Promise<void>} A Promise that resolves when the method has completed.
     */
    Gatekeeper.prototype.getSessionStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            var requestConfig, url, _a, error_1, _b, error_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        requestConfig = {};
                        // Always include these if they exist
                        if (this.agent)
                            requestConfig.agent = this.agent;
                        if (this.ip)
                            requestConfig.ip = this.ip;
                        if (this.lang)
                            requestConfig.lang = this.lang;
                        // Include either slug OR url, but not both
                        if (this.slug) {
                            requestConfig.slug = this.slug;
                            (0, logger_1.logger)(this.options.debug, "info", "Using slug in request: ".concat(this.slug));
                        }
                        else {
                            url = "https://".concat(this.host).concat(this.path);
                            requestConfig.url = url;
                            (0, logger_1.logger)(this.options.debug, "info", "Using URL in request: ".concat(url));
                        }
                        if (!this.token) return [3 /*break*/, 5];
                        (0, logger_1.logger)(this.options.debug, "info", "Token found, performing a session GET call.");
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, this.PublicClient.requests().get(this.token, requestConfig)];
                    case 2:
                        _a.sessionStatus = _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _c.sent();
                        (0, logger_1.logger)(this.options.debug, "error", "Session GET call failed with error: ".concat(error_1));
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 9];
                    case 5:
                        (0, logger_1.logger)(this.options.debug, "info", "Token not found, performing a session POST call.");
                        _c.label = 6;
                    case 6:
                        _c.trys.push([6, 8, , 9]);
                        _b = this;
                        return [4 /*yield*/, this.PublicClient.requests().post(requestConfig)];
                    case 7:
                        _b.sessionStatus = _c.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        error_2 = _c.sent();
                        (0, logger_1.logger)(this.options.debug, "error", "Session POST call failed with error: ".concat(error_2));
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Processes the URL from the request to extract the target URL and any special parameters.
     */
    Gatekeeper.prototype.processURL = function () {
        try {
            var processURLInstance = new processURL_1.ProcessURL(this.REQUEST);
            var result = processURLInstance.parseURL();
            if (result) {
                // If this is a waiting room implementation, check for url parameter
                if (this.options.waitingRoom) {
                    var urlFromQuery = this.extractUrlFromWaitingRoomQuery();
                    if (urlFromQuery) {
                        (0, logger_1.logger)(this.options.debug, "info", "[WaitingRoom] Using url from query parameter: ".concat(urlFromQuery));
                        this.targetURL = urlFromQuery;
                        this.specialParameters = result.specialParameters;
                        return;
                    }
                    // If no url param, targetURL will be set from API response urlRedirect
                    (0, logger_1.logger)(this.options.debug, "info", "[WaitingRoom] No url query parameter found, will use urlRedirect from API response");
                    this.targetURL = ""; // Empty until we get API response
                    this.specialParameters = result.specialParameters;
                    return;
                }
                // Standard behavior - use the current URL as targetURL
                this.targetURL = result.targetURL;
                this.specialParameters = result.specialParameters;
            }
            else {
                throw new Error("Failed to parse URL.");
            }
        }
        catch (error) {
            (0, logger_1.logger)(this.options.debug, "error", "Error while processing URL: ".concat(error));
        }
    };
    /**
     * Extracts the signature from the given signature source.
     * @param signatureSource - The source from which to extract the signature.
     */
    Gatekeeper.prototype.getSignature = function (signatureSource) {
        try {
            if (signatureSource.chIDSignature) {
                // Simple signature case
                this.simpleSignature = [signatureSource.chIDSignature];
                this.signatureType = "simple";
            }
            else if (signatureSource.crowdhandlerCookieValue) {
                // Complex signature case
                this.cookieValue = types_1.CookieObject.parse(signatureSource.crowdhandlerCookieValue);
                // Assuming that the last token's signatures are needed
                this.complexSignature =
                    this.cookieValue.tokens[this.cookieValue.tokens.length - 1].signatures;
                this.signatureType = "complex";
            }
        }
        catch (error) {
            (0, logger_1.logger)(this.options.debug, "error", "Failed to get signature: ".concat(error));
        }
    };
    /**
     * Extracts and sets the token from various sources (URL params, cookies, etc).
     * This is an internal method used during request validation.
     * @param options - The options for extracting the token.
     */
    Gatekeeper.prototype.extractToken = function (options) {
        var _a, _b, _c, _d;
        // Use option values if provided, else fall back to constructor values
        var chID = (_a = options === null || options === void 0 ? void 0 : options.chID) !== null && _a !== void 0 ? _a : this.specialParameters.chID;
        var crowdhandlerCookieValue = (_b = options === null || options === void 0 ? void 0 : options.crowdhandlerCookieValue) !== null && _b !== void 0 ? _b : this.cookieValue;
        var localStorageValue = (_c = options === null || options === void 0 ? void 0 : options.localStorageValue) !== null && _c !== void 0 ? _c : this.localStorageValue;
        var simpleCookieValue = (_d = options === null || options === void 0 ? void 0 : options.simpleCookieValue) !== null && _d !== void 0 ? _d : this.simpleCookieValue;
        if (chID) {
            (0, logger_1.logger)(this.options.debug, "info", "chID parameter found");
            this.extractTokenFromChID(chID);
        }
        else if (crowdhandlerCookieValue && this.options.mode === "hybrid") {
            (0, logger_1.logger)(this.options.debug, "info", "complex cookie found");
            this.extractTokenFromComplexCookie(crowdhandlerCookieValue);
        }
        else if (simpleCookieValue) {
            (0, logger_1.logger)(this.options.debug, "info", "simple cookie found");
            this.extractTokenFromSimpleCookie(simpleCookieValue);
        }
        else {
            (0, logger_1.logger)(this.options.debug, "info", "Token not found or invalid format");
        }
    };
    /**
     * Verifies if the given token is valid based on its format.
     * @param token - The token to be validated.
     * @returns True if the token is valid, false otherwise.
     */
    Gatekeeper.prototype.isValidToken = function (token) {
        var tokenPattern = /^tok.*/;
        return tokenPattern.test(token);
    };
    /**
     * Extracts and sets the token from the provided chID if it's valid.
     * @param chID - The chID to extract the token from.
     * @throws {Error} When the token format is invalid.
     */
    Gatekeeper.prototype.extractTokenFromChID = function (chID) {
        if (!this.isValidToken(chID)) {
            throw new Error("Invalid token format: ".concat(chID));
        }
        this.token = chID;
    };
    /**
     * Extracts and sets the token from a complex cookie value if it's valid.
     * @param crowdhandlerCookieValue - The crowdhandler cookie value to extract the token from.
     * @throws {Error} When the token format is invalid.
     */
    Gatekeeper.prototype.extractTokenFromComplexCookie = function (crowdhandlerCookieValue) {
        try {
            this.cookieValue = types_1.CookieObject.parse(crowdhandlerCookieValue);
            // Ensure tokens array is not empty
            if (this.cookieValue.tokens.length === 0) {
                throw new Error("No tokens found in the cookie value.");
            }
            var extractedToken = this.cookieValue.tokens[this.cookieValue.tokens.length - 1].token;
            if (!this.isValidToken(extractedToken)) {
                throw new Error("Invalid token format: ".concat(extractedToken));
            }
            this.token = extractedToken;
        }
        catch (error) {
            (0, logger_1.logger)(this.options.debug, "error", "Failed to extract token from complex cookie: ".concat(error));
        }
    };
    /**
     * Extracts and sets the token from a simple cookie value if it's valid.
     * @param simpleCookieValue - The simple cookie value to extract the token from.
     * @throws {Error} When the token format is invalid.
     */
    Gatekeeper.prototype.extractTokenFromSimpleCookie = function (simpleCookieValue) {
        try {
            if (!this.isValidToken(simpleCookieValue)) {
                throw new Error("Invalid token format: ".concat(simpleCookieValue));
            }
            this.token = simpleCookieValue;
        }
        catch (error) {
            (0, logger_1.logger)(this.options.debug, "error", "Failed to extract token from simple cookie: ".concat(error));
        }
    };
    /**
     * Extracts the slug from the URL path when in waiting room mode.
     * If the first path segment is 'ch', the slug is in the second segment.
     * Otherwise, the slug is the first path segment.
     */
    Gatekeeper.prototype.extractSlugFromPath = function () {
        try {
            // Remove leading slash and query string, then split by /
            var pathWithoutQuery = this.path.split('?')[0];
            var cleanPath = pathWithoutQuery.startsWith('/') ? pathWithoutQuery.slice(1) : pathWithoutQuery;
            var segments = cleanPath.split('/').filter(function (s) { return s.length > 0; });
            if (segments.length === 0) {
                (0, logger_1.logger)(this.options.debug, "info", "[WaitingRoom] No path segments found for slug extraction");
                return;
            }
            var slugIndex = 0;
            // If first segment is 'ch', slug is in the second segment
            if (segments[0] === 'ch') {
                slugIndex = 1;
                if (segments.length <= 1) {
                    (0, logger_1.logger)(this.options.debug, "info", "[WaitingRoom] Path starts with /ch/ but no slug segment found");
                    return;
                }
            }
            this.slug = segments[slugIndex];
            (0, logger_1.logger)(this.options.debug, "info", "[WaitingRoom] Extracted slug from path: ".concat(this.slug));
        }
        catch (error) {
            (0, logger_1.logger)(this.options.debug, "error", "[WaitingRoom] Failed to extract slug from path: ".concat(error));
        }
    };
    /**
     * Extracts the target URL from query parameters when in waiting room mode.
     * Returns the encoded URL value if found, otherwise returns empty string.
     */
    Gatekeeper.prototype.extractUrlFromWaitingRoomQuery = function () {
        try {
            // Get the full URL including query parameters
            var fullPath = this.REQUEST.getPath();
            if (!fullPath || !fullPath.includes('?')) {
                return "";
            }
            // Extract query string
            var queryString = fullPath.split('?')[1];
            if (!queryString) {
                return "";
            }
            // Parse query parameters manually to avoid automatic decoding
            // URLSearchParams.get() automatically decodes values, which we don't want
            var urlMatch = queryString.match(/(?:^|&)url=([^&]*)/);
            if (urlMatch && urlMatch[1]) {
                var urlParam = urlMatch[1];
                // The URL parameter value is encoded, return as-is without decoding
                (0, logger_1.logger)(this.options.debug, "info", "[WaitingRoom] Found url parameter (encoded): ".concat(urlParam));
                return urlParam;
            }
            return "";
        }
        catch (error) {
            (0, logger_1.logger)(this.options.debug, "error", "[WaitingRoom] Failed to extract url from query: ".concat(error));
            return "";
        }
    };
    /**
     * Retrieves the token from local storage if possible.
     * @throws {Error} When the storage key or local storage value is undefined.
     */
    Gatekeeper.prototype.getTokenFromLocalStorage = function () {
        try {
            if (!this.storageKey) {
                throw new Error("Storage key is not defined.");
            }
            if (!this.localStorageValue || !this.localStorageValue.token) {
                throw new Error("Local storage value is not defined or does not contain a token.");
            }
            var token = this.localStorageValue.token[this.storageKey];
            if (!this.isValidToken(token)) {
                throw new Error("Invalid token format: ".concat(token));
            }
            this.token = token;
        }
        catch (error) {
            (0, logger_1.logger)(this.options.debug, "error", "Failed to get token from local storage: ".concat(error));
        }
    };
    /**
     * Validates the signature.
     *
     * @returns the result of signature validation
     */
    Gatekeeper.prototype.validateSignature = function () {
        var signature = new signature_1.Signature(this.activeConfig, this.hashedPrivateKey, this.signatureType, this.simpleSignature, this.complexSignature, this.token, this.cookieValue, this.requested, this.specialParameters, this.options.debug);
        return signature.validateSignature();
    };
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
    Gatekeeper.prototype.redirectIfNotPromoted = function () {
        try {
            var redirectUrl = this.getRedirectUrl();
            if (!redirectUrl) {
                throw new Error("Unable to determine redirect URL");
            }
            return this.REQUEST.redirect(redirectUrl);
        }
        catch (error) {
            (0, logger_1.logger)(this.options.debug, "error", "Failed to redirect: ".concat(error));
            return "Redirect failed: ".concat(error.message);
        }
    };
    /**
     * Redirects promoted users from waiting room to target site with fresh CrowdHandler parameters.
     * Used when waitingRoom option is true and user is promoted.
     *
     * @returns {string} Success message after redirect
     * @throws {Error} If unable to determine redirect URL
     *
     * @example
     * if (result.promoted && config.waitingRoom) {
     *   return gatekeeper.redirectIfPromoted();
     * }
     */
    Gatekeeper.prototype.redirectIfPromoted = function () {
        var _a, _b, _c, _d, _e, _f;
        try {
            // Get target URL from either this.targetURL or API response
            var destinationUrl = this.targetURL;
            // If no targetURL and we have session status with urlRedirect, use that
            if (!destinationUrl && ((_b = (_a = this.sessionStatus) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b.urlRedirect)) {
                destinationUrl = encodeURIComponent(this.sessionStatus.result.urlRedirect);
                (0, logger_1.logger)(this.options.debug, "info", "[WaitingRoom] Using urlRedirect from API: ".concat(this.sessionStatus.result.urlRedirect));
            }
            if (!destinationUrl) {
                throw new Error("Unable to determine destination URL for promoted redirect");
            }
            // Decode once to get the actual URL
            var decodedURL = decodeURIComponent(destinationUrl);
            // Parse URL to handle parameters properly
            var urlParts = decodedURL.split('?');
            var baseUrl = urlParts[0];
            var queryString = urlParts[1] || '';
            // Parse existing parameters while preserving their values
            var existingParams = [];
            if (queryString) {
                var params = queryString.split('&');
                for (var _i = 0, params_1 = params; _i < params_1.length; _i++) {
                    var param = params_1[_i];
                    var key = param.split('=')[0];
                    // Skip CrowdHandler parameters
                    if (!['ch-id', 'ch-id-signature', 'ch-requested', 'ch-code', 'ch-fresh'].includes(key)) {
                        existingParams.push(param);
                    }
                }
            }
            // Build new CrowdHandler parameters
            var chParams = [
                "ch-id=".concat(encodeURIComponent(this.token || '')),
                "ch-id-signature=".concat(encodeURIComponent(((_d = (_c = this.sessionStatus) === null || _c === void 0 ? void 0 : _c.result) === null || _d === void 0 ? void 0 : _d.hash) || '')),
                "ch-requested=".concat(encodeURIComponent(((_f = (_e = this.sessionStatus) === null || _e === void 0 ? void 0 : _e.result) === null || _f === void 0 ? void 0 : _f.requested) || this.requested || this.specialParameters.chRequested || '')),
                "ch-code=".concat(encodeURIComponent(this.specialParameters.chCode || '')),
                "ch-fresh=true"
            ];
            // Construct final URL
            var allParams = existingParams.concat(chParams);
            var finalUrl = baseUrl + (allParams.length > 0 ? '?' + allParams.join('&') : '');
            (0, logger_1.logger)(this.options.debug, "info", "[WaitingRoom] Redirecting promoted user to: ".concat(finalUrl));
            return this.REQUEST.redirect(finalUrl);
        }
        catch (error) {
            (0, logger_1.logger)(this.options.debug, "error", "Failed to redirect promoted user: ".concat(error));
            return "Redirect failed: ".concat(error.message);
        }
    };
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
    Gatekeeper.prototype.redirectToCleanUrl = function (targetURL) {
        try {
            var decodedUrl = decodeURIComponent(targetURL);
            // If decodedUrl is not a valid URL, throw an error.
            if (!/^http[s]?:\/\/.*/.test(decodedUrl)) {
                throw new Error("Decoded URL is not a valid URL");
            }
            this.REQUEST.redirect(decodedUrl);
        }
        catch (error) {
            (0, logger_1.logger)(this.options.debug, "error", "Failed to redirect to clean URL: ".concat(error));
            throw error;
        }
    };
    /**
     * Generates a redirect URL based on multiple fallback conditions.
     *
     * @throws {Error} If targetURL, token, or publicKey is missing or invalid.
     * @returns The generated redirect URL.
     */
    Gatekeeper.prototype.getRedirectUrl = function () {
        var _a, _b, _c;
        try {
            var slug = ((_b = (_a = this.sessionStatus) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b.slug) ||
                ((_c = this.activeConfig) === null || _c === void 0 ? void 0 : _c.slug) ||
                this.options.fallbackSlug ||
                "";
            (0, logger_1.logger)(this.options.debug, "info", "Generating redirect URL with slug: ".concat(slug));
            (0, logger_1.logger)(this.options.debug, "info", "Target URL: ".concat(this.targetURL));
            (0, logger_1.logger)(this.options.debug, "info", "Token: ".concat(this.token));
            (0, logger_1.logger)(this.options.debug, "info", "Public Key: ".concat(this.publicKey));
            var redirectUrl = "".concat(this.WAIT_URL, "/").concat(slug, "?url=").concat(this.targetURL, "&ch-code=&ch-id=").concat(this.token, "&ch-public-key=").concat(this.publicKey);
            (0, logger_1.logger)(this.options.debug, "info", "Generated redirect URL: ".concat(redirectUrl));
            return redirectUrl;
        }
        catch (error) {
            (0, logger_1.logger)(this.options.debug, "error", "Failed to generate redirect URL: ".concat(error));
            throw error;
        }
    };
    /**
     * Generates token and signature objects for cookies.
     *
     * @throws {Error} If token generation fails.
     */
    Gatekeeper.prototype.generateCookieObjects = function () {
        try {
            var tokenDatestamp = new Date().getTime();
            var signatureGenerated = "";
            // Prioritise API response data over parameter data.
            signatureGenerated = this.requested || this.specialParameters.chRequested;
            var cookieObject = new tokenObject_1.GenerateCookieObject({
                tokenDatestamp: tokenDatestamp,
                tokenDatestampSignature: (0, hash_1.generateSignature)("".concat(this.hashedPrivateKey).concat(tokenDatestamp)),
                tokenSignature: this.simpleSignature[0],
                tokenSignatureGenerated: signatureGenerated,
                tokenSignatures: this.complexSignature,
                tokenValue: this.token,
            });
            this.cookieSignatureObject = cookieObject.signatureObject();
            this.cookieTokenObject = cookieObject.tokenObject();
        }
        catch (error) {
            (0, logger_1.logger)(this.options.debug, "error", "Failed to generate cookie objects: ".concat(error));
            throw error;
        }
    };
    // //TODO: Convert to an independent class for full local storage functionality
    // /**
    //  * Updates the token in the local storage object.
    //  * If no local storage object exists, creates a new one.
    //  * @param token - The new token to update in local storage.
    //  */
    Gatekeeper.prototype.updateLocalStorageToken = function (token) {
        var _a;
        try {
            if (this.localStorageValue && this.storageKey) {
                // Update the existing LocalStorageObject token field.
                this.localStorageValue.token[this.storageKey] = token;
            }
            else if (this.storageKey) {
                // Create a new LocalStorageObject if it doesn't exist.
                this.localStorageValue = {
                    countdown: {},
                    positions: {},
                    token: (_a = {}, _a[this.storageKey] = token, _a),
                };
            }
        }
        catch (error) {
            (0, logger_1.logger)(this.options.debug, "error", "Failed to update local storage token: ".concat(error));
        }
    };
    /**
     * Retrieves and processes cookies from request or override.
     */
    Gatekeeper.prototype.getCookie = function () {
        try {
            // Get cookies from request or override.
            var cookies = this.cookies.length === 0 ? this.REQUEST.getCookies() : this.cookies;
            // If no cookies, there is no further processing needed.
            if (!cookies) {
                (0, logger_1.logger)(this.options.debug, "info", "No cookies found.");
                return;
            }
            // Split the cookies string into individual cookie strings.
            var cookieArray = cookies.split(";");
            for (var _i = 0, cookieArray_1 = cookieArray; _i < cookieArray_1.length; _i++) {
                var cookieStr = cookieArray_1[_i];
                var _a = cookieStr.trim().split("="), cookieName = _a[0], cookieValueParts = _a.slice(1);
                var cookieValue = cookieValueParts.join("=");
                // If this is the cookie we're interested in, process it.
                if (cookieName === this.STORAGE_NAME) {
                    if (this.options.mode === "hybrid") {
                        var decodedCookie = decodeURIComponent(cookieValue);
                        var processedCookie = JSON.parse(decodedCookie);
                        this.cookieValue = processedCookie;
                    }
                    else {
                        this.simpleCookieValue = cookieValue;
                    }
                }
            }
        }
        catch (error) {
            (0, logger_1.logger)(this.options.debug, "error", "Failed to get or process cookies: ".concat(error));
        }
    };
    //TODO: Improve this method alongside refactor of validateRequestHybridMode
    Gatekeeper.prototype.generateCookie = function (tokens, deployment) {
        return {
            integration: "JSDK",
            tokens: tokens,
            deployment: deployment || "",
        };
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
    Gatekeeper.prototype.setCookie = function (value) {
        try {
            // Set the cookie with the provided value and options
            this.REQUEST.setCookie(value, this.STORAGE_NAME);
            return true;
        }
        catch (error) {
            (0, logger_1.logger)(this.options.debug, "error", error);
            return false;
        }
    };
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
    Gatekeeper.prototype.setLocalStorage = function (options) {
        try {
            // determine the name to use
            var nameToUse = (options === null || options === void 0 ? void 0 : options.storageName) || this.STORAGE_NAME;
            // determine the value to use
            var valueToUse = (options === null || options === void 0 ? void 0 : options.localStorageValue) || JSON.stringify(this.localStorageValue);
            // set the local storage item
            this.REQUEST.setLocalStorageItem(nameToUse, valueToUse);
            return true;
        }
        catch (error) {
            (0, logger_1.logger)(this.options.debug, "error", error);
            return false;
        }
    };
    /**
     * Get a local storage item.
     *
     * @throws If an error occurs while getting or parsing the local storage item,
     * an Error is thrown and caught, logged with the logger, and the function returns null.
     *
     * @returns The value from local storage parsed as a LocalStorageObject, or null if an error occurs or if the item does not exist.
     */
    Gatekeeper.prototype.getLocalStorage = function () {
        try {
            var crowdhandler = localStorage.getItem(this.STORAGE_NAME);
            if (crowdhandler) {
                var localStorageValue = types_1.LocalStorageObject.parse(JSON.parse(crowdhandler));
                this.localStorageValue = localStorageValue; // still assign it to the class property if you need
                return localStorageValue;
            }
            (0, logger_1.logger)(this.options.debug, "Info: No data found in local storage for key:", this.STORAGE_NAME);
            return null;
        }
        catch (error) {
            (0, logger_1.logger)(this.options.debug, "Error reading from local storage:", error);
            return null;
        }
    };
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
    Gatekeeper.prototype.recordPerformance = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var validatedOptions, statusCode, sample, overrideElapsed, responseID, lottery, currentResponseID, elapsed;
            return __generator(this, function (_a) {
                try {
                    validatedOptions = options
                        ? types_1.RecordPerformanceOptions.parse(options)
                        : {
                            statusCode: 200,
                            sample: 0.2,
                            overrideElapsed: undefined,
                            responseID: undefined, // no responseID
                        };
                    statusCode = validatedOptions.statusCode, sample = validatedOptions.sample, overrideElapsed = validatedOptions.overrideElapsed, responseID = validatedOptions.responseID;
                    lottery = Math.random();
                    currentResponseID = responseID || this.responseID;
                    // If there's no responseID or if the random number is higher than the sample rate, return early
                    if (!currentResponseID || lottery >= sample) {
                        return [2 /*return*/];
                    }
                    elapsed = overrideElapsed !== undefined ? overrideElapsed : this.timer.elapsed();
                    // Asynchronously send the performance data to CrowdHandler, no need to await the promise
                    this.PublicClient.responses().put(currentResponseID, {
                        httpCode: statusCode,
                        time: elapsed,
                    });
                }
                catch (error) {
                    (0, logger_1.logger)(this.options.debug, "Error recording performance:", error);
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Extracts the creation date from a token's base60 encoded timestamp
     */
    Gatekeeper.prototype.tokenCreationDate = function (token) {
        var base60 = "0123456789ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz";
        var tok_meta = token.slice(4, 10);
        var year = base60.indexOf(tok_meta[0]);
        var month = base60.indexOf(tok_meta[1]) - 1;
        var day = base60.indexOf(tok_meta[2]);
        var hour = base60.indexOf(tok_meta[3]);
        var minute = base60.indexOf(tok_meta[4]);
        var second = base60.indexOf(tok_meta[5]);
        return Date.UTC(2000 + year, month, day, hour, minute, second);
    };
    /**
     * Checks if a token is older than 12 hours
     */
    Gatekeeper.prototype.isOldToken = function (token) {
        (0, logger_1.logger)(this.options.debug, "info", "[Lite Validator] Checking token age for: ".concat(token));
        if (!token || !token.startsWith("tok")) {
            (0, logger_1.logger)(this.options.debug, "info", "[Lite Validator] Token not in a format that we can timestamp.");
            return false;
        }
        // Only handle tok0 format tokens
        if (!token.startsWith("tok0")) {
            (0, logger_1.logger)(this.options.debug, "info", "[Lite Validator] Token format '".concat(token.substring(0, 4), "' not supported for age checking"));
            return false;
        }
        var dateStampUTC = new Date().getTime();
        var tokenCreated = this.tokenCreationDate(token);
        var tokenCreatedDate = new Date(tokenCreated);
        var differenceInHours = (dateStampUTC - tokenCreated) / (1000 * 60 * 60);
        (0, logger_1.logger)(this.options.debug, "info", "[Lite Validator] Token created: ".concat(tokenCreatedDate.toISOString(), ", Age: ").concat(differenceInHours.toFixed(2), " hours"));
        if (differenceInHours > 12) {
            (0, logger_1.logger)(this.options.debug, "info", "[Lite Validator] Token is older than 12 hours - will trigger redirect");
            return true;
        }
        (0, logger_1.logger)(this.options.debug, "info", "[Lite Validator] Token is fresh (< 12 hours old)");
        return false;
    };
    /**
     * Checks if the current request matches any configured room patterns
     * Rooms are pre-ordered by precedence (regex → contains → all)
     * First match wins
     */
    Gatekeeper.prototype.matchRoomConfig = function () {
        var _this = this;
        var roomMeta = {
            domain: null,
            patternType: null,
            queueActivatesOn: null,
            slug: null,
            status: false,
            timeout: null,
        };
        if (!this.options.roomsConfig || this.options.roomsConfig.length === 0) {
            (0, logger_1.logger)(this.options.debug, "info", "[Lite Validator] No rooms config provided or empty array");
            return roomMeta;
        }
        var host = this.host;
        // Note: this.path already includes query string from all REQUEST handlers
        var path = this.path;
        var fullDomain = "https://".concat(host);
        (0, logger_1.logger)(this.options.debug, "info", "[Lite Validator] Checking rooms for domain: ".concat(fullDomain, ", path: ").concat(path));
        (0, logger_1.logger)(this.options.debug, "info", "[Lite Validator] Total rooms in config: ".concat(this.options.roomsConfig.length));
        // Filter rooms by domain
        var filteredResults = this.options.roomsConfig.filter(function (item) {
            var matches = item.domain === fullDomain;
            if (matches) {
                (0, logger_1.logger)(_this.options.debug, "info", "[Lite Validator] Domain match found: ".concat(item.slug));
            }
            return matches;
        });
        (0, logger_1.logger)(this.options.debug, "info", "[Lite Validator] Rooms matching domain: ".concat(filteredResults.length));
        // Find first match - rooms are pre-ordered by precedence
        for (var _i = 0, filteredResults_1 = filteredResults; _i < filteredResults_1.length; _i++) {
            var item = filteredResults_1[_i];
            (0, logger_1.logger)(this.options.debug, "info", "[Lite Validator] Testing room '".concat(item.slug, "' with pattern '").concat(item.urlPattern, "' (type: ").concat(item.patternType, ")"));
            if (this.patternCheck(item, path) === true) {
                (0, logger_1.logger)(this.options.debug, "info", "[Lite Validator] MATCH FOUND: Room '".concat(item.slug, "' matches current path"));
                // First match is the best match
                roomMeta.domain = item.domain;
                roomMeta.patternType = item.patternType;
                roomMeta.queueActivatesOn = item.queueActivatesOn;
                roomMeta.slug = item.slug;
                roomMeta.status = true;
                roomMeta.timeout = item.timeout;
                break; // Stop at first match
            }
        }
        if (!roomMeta.status) {
            (0, logger_1.logger)(this.options.debug, "info", "[Lite Validator] No matching room found for current path");
        }
        return roomMeta;
    };
    /**
     * Pattern checking logic - matches reference implementation
     */
    Gatekeeper.prototype.patternCheck = function (item, path) {
        switch (item.patternType) {
            case "regex":
                if (!item.urlPattern)
                    return false;
                var regex = new RegExp(item.urlPattern);
                return regex.test(path);
            case "contains":
                if (!item.urlPattern)
                    return false;
                return path.includes(item.urlPattern);
            case "all":
                return true;
            default:
                return false;
        }
    };
    /**
     * Determines if the request should be redirected to the lite validator
     */
    Gatekeeper.prototype.shouldRedirectToLiteValidator = function () {
        (0, logger_1.logger)(this.options.debug, "info", "[Lite Validator] === Starting lite validator check ===");
        (0, logger_1.logger)(this.options.debug, "info", "[Lite Validator] Lite validator enabled: ".concat(this.options.liteValidator));
        (0, logger_1.logger)(this.options.debug, "info", "[Lite Validator] Rooms config provided: ".concat(!!this.options.roomsConfig));
        (0, logger_1.logger)(this.options.debug, "info", "[Lite Validator] Current token: ".concat(this.token || 'NO TOKEN'));
        if (!this.options.liteValidator || !this.options.roomsConfig) {
            (0, logger_1.logger)(this.options.debug, "info", "[Lite Validator] Lite validator disabled or no rooms config - skipping");
            return { redirect: false };
        }
        // Check if current path matches any protected room
        var roomMatch = this.matchRoomConfig();
        if (!roomMatch.status) {
            (0, logger_1.logger)(this.options.debug, "info", "[Lite Validator] No room match - skipping lite validator");
            return { redirect: false };
        }
        (0, logger_1.logger)(this.options.debug, "info", "[Lite Validator] Room matched: ".concat(roomMatch.slug || 'match found'));
        // Check if token is missing or old
        var tokenMissing = !this.token;
        var tokenIsOld = this.token ? this.isOldToken(this.token) : false;
        (0, logger_1.logger)(this.options.debug, "info", "[Lite Validator] Token missing: ".concat(tokenMissing, ", Token old: ").concat(tokenIsOld));
        if (tokenMissing || tokenIsOld) {
            var redirectUrl = this.buildLiteValidatorUrl();
            (0, logger_1.logger)(this.options.debug, "info", "[Lite Validator] REDIRECT REQUIRED to: ".concat(redirectUrl));
            return { redirect: true, url: redirectUrl };
        }
        (0, logger_1.logger)(this.options.debug, "info", "[Lite Validator] Token is valid - no redirect needed");
        return { redirect: false };
    };
    /**
     * Builds the lite validator redirect URL
     */
    Gatekeeper.prototype.buildLiteValidatorUrl = function () {
        var apiUrl = this.PublicClient.apiUrl || 'https://api.crowdhandler.com';
        var baseUrl = "".concat(apiUrl, "/v1/redirect/requests");
        // targetURL is already encoded by ProcessURL
        var targetUrl = this.targetURL || '';
        var code = this.specialParameters.chCode || '';
        var params = "ch-public-key=".concat(this.publicKey, "&url=").concat(targetUrl, "&ch-code=").concat(code);
        return this.token
            ? "".concat(baseUrl, "/").concat(this.token, "?").concat(params)
            : "".concat(baseUrl, "?").concat(params);
    };
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
    Gatekeeper.prototype.validateRequest = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.options.mode;
                        switch (_a) {
                            case "hybrid": return [3 /*break*/, 1];
                            case "full": return [3 /*break*/, 3];
                            case "clientside": return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 7];
                    case 1: return [4 /*yield*/, this.validateRequestHybridMode()];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3: return [4 /*yield*/, this.validateRequestFullMode()];
                    case 4: return [2 /*return*/, _b.sent()];
                    case 5: return [4 /*yield*/, this.validateRequestClientSideMode()];
                    case 6: return [2 /*return*/, _b.sent()];
                    case 7:
                        "full";
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Validate request in a client-side mode.
     *
     * This method checks for a CrowdHandler cookie and gets the session status for the request.
     * It works the same as full mode but runs in browser environments.
     *
     * @return {Promise<z.infer<typeof validateRequestObject>>} Result of the validation process.
     */
    Gatekeeper.prototype.validateRequestClientSideMode = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var result, liteCheck, sessionStatusType, _b, promoted, slug, token, responseID, deployment, hash, requested, error_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        result = {
                            promoted: false,
                            stripParams: false,
                            setCookie: false,
                            setLocalStorage: false,
                            cookieValue: "",
                            responseID: "",
                            slug: "",
                            targetURL: "",
                            deployment: "",
                            hash: null,
                            token: "",
                            requested: "",
                        };
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        // Log details for debugging
                        (0, logger_1.logger)(this.options.debug, "info", "IP: ".concat(this.ip));
                        (0, logger_1.logger)(this.options.debug, "info", "Agent: ".concat(this.agent));
                        (0, logger_1.logger)(this.options.debug, "info", "Host: ".concat(this.host));
                        (0, logger_1.logger)(this.options.debug, "info", "Path: ".concat(this.path));
                        (0, logger_1.logger)(this.options.debug, "info", "Lang: ".concat(this.lang));
                        // Skip paths that match the ignore pattern
                        if ((0, ignoredPatternsCheck_1.ignoredPatternsCheck)(this.path, this.ignore)) {
                            (0, logger_1.logger)(this.options.debug, "info", "Ignored path: ".concat(this.path));
                            result.promoted = true;
                            return [2 /*return*/, result];
                        }
                        this.processURL();
                        result.targetURL = this.targetURL || "";
                        this.getCookie();
                        this.extractToken();
                        // Lite validator check - EARLY EXIT
                        (0, logger_1.logger)(this.options.debug, "info", "[Lite Validator] Performing lite validator check in validateRequestClientSideMode");
                        liteCheck = this.shouldRedirectToLiteValidator();
                        if (liteCheck.redirect) {
                            (0, logger_1.logger)(this.options.debug, "info", "[Lite Validator] Lite validator redirect triggered in clientside mode");
                            result.liteValidatorRedirect = true;
                            result.liteValidatorUrl = liteCheck.url;
                            result.promoted = false;
                            return [2 /*return*/, result];
                        }
                        (0, logger_1.logger)(this.options.debug, "info", "[Lite Validator] Continuing with normal validation");
                        return [4 /*yield*/, this.getSessionStatus()];
                    case 2:
                        _c.sent();
                        sessionStatusType = types_1.HttpErrorWrapper.safeParse(this.sessionStatus);
                        // Handle session status errors
                        if (sessionStatusType.success) {
                            if (((_a = this.sessionStatus) === null || _a === void 0 ? void 0 : _a.result.status) !== 200) {
                                // Can't process the request but we can trust it if trustOnFail is set to true
                                result.promoted = this.options.trustOnFail;
                                if (!this.options.trustOnFail)
                                    result.slug = this.options.fallbackSlug;
                                return [2 /*return*/, result];
                            }
                        }
                        // Processing based on promotion status
                        if (this.sessionStatus) {
                            _b = this.sessionStatus.result, promoted = _b.promoted, slug = _b.slug, token = _b.token, responseID = _b.responseID, deployment = _b.deployment, hash = _b.hash, requested = _b.requested;
                            result.promoted = promoted === 1;
                            result.slug = slug || result.slug;
                            this.token = token || this.token;
                            result.token = token || result.token;
                            result.deployment = deployment || result.deployment;
                            result.hash = hash || null;
                            result.requested = requested || result.requested;
                            // Always set cookie if we have a token (for both promoted and non-promoted users)
                            if (token) {
                                result.setCookie = true;
                                result.cookieValue = token;
                            }
                            if (promoted === 1) {
                                result.responseID = responseID || result.responseID;
                                this.responseID = responseID || "";
                                if (this.specialParameters.chRequested) {
                                    result.stripParams = true;
                                }
                            }
                        }
                        return [2 /*return*/, result];
                    case 3:
                        error_3 = _c.sent();
                        (0, logger_1.logger)(this.options.debug, "error", "An error occurred during request validation: ".concat(error_3));
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Validates the request by making full use of CrowdHandler API.
     * It handles the request and sets the necessary response based on the session status and API response.
     * @return {Promise<z.infer<typeof ValidateRequestObject>>} - The resulting status after validating the request.
     */
    Gatekeeper.prototype.validateRequestFullMode = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var result, liteCheck, sessionStatusType, _b, promoted, slug, token, responseID, deployment, hash, requested, error_4;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        result = {
                            promoted: false,
                            stripParams: false,
                            setCookie: false,
                            setLocalStorage: false,
                            cookieValue: "",
                            responseID: "",
                            slug: "",
                            targetURL: "",
                            deployment: "",
                            hash: null,
                            token: "",
                            requested: "",
                        };
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        // Log details for debugging
                        (0, logger_1.logger)(this.options.debug, "info", "IP: ".concat(this.ip));
                        (0, logger_1.logger)(this.options.debug, "info", "Agent: ".concat(this.agent));
                        (0, logger_1.logger)(this.options.debug, "info", "Host: ".concat(this.host));
                        (0, logger_1.logger)(this.options.debug, "info", "Path: ".concat(this.path));
                        (0, logger_1.logger)(this.options.debug, "info", "Lang: ".concat(this.lang));
                        // Skip paths that match the ignore pattern
                        if ((0, ignoredPatternsCheck_1.ignoredPatternsCheck)(this.path, this.ignore)) {
                            (0, logger_1.logger)(this.options.debug, "info", "Ignored path: ".concat(this.path));
                            result.promoted = true;
                            return [2 /*return*/, result];
                        }
                        this.processURL();
                        result.targetURL = this.targetURL;
                        this.getCookie();
                        this.extractToken();
                        // Lite validator check - EARLY EXIT
                        (0, logger_1.logger)(this.options.debug, "info", "[Lite Validator] Performing lite validator check in validateRequestClientSideMode");
                        liteCheck = this.shouldRedirectToLiteValidator();
                        if (liteCheck.redirect) {
                            (0, logger_1.logger)(this.options.debug, "info", "[Lite Validator] Lite validator redirect triggered in clientside mode");
                            result.liteValidatorRedirect = true;
                            result.liteValidatorUrl = liteCheck.url;
                            result.promoted = false;
                            return [2 /*return*/, result];
                        }
                        (0, logger_1.logger)(this.options.debug, "info", "[Lite Validator] Continuing with normal validation");
                        return [4 /*yield*/, this.getSessionStatus()];
                    case 2:
                        _c.sent();
                        sessionStatusType = types_1.HttpErrorWrapper.safeParse(this.sessionStatus);
                        // Handle session status errors
                        if (sessionStatusType.success) {
                            if (((_a = this.sessionStatus) === null || _a === void 0 ? void 0 : _a.result.status) !== 200) {
                                // Can't process the request but we can trust it if trustOnFail is set to true
                                result.promoted = this.options.trustOnFail;
                                if (!this.options.trustOnFail)
                                    result.slug = this.options.fallbackSlug;
                                return [2 /*return*/, result];
                            }
                        }
                        // Processing based on promotion status
                        if (this.sessionStatus) {
                            _b = this.sessionStatus.result, promoted = _b.promoted, slug = _b.slug, token = _b.token, responseID = _b.responseID, deployment = _b.deployment, hash = _b.hash, requested = _b.requested;
                            result.promoted = promoted === 1;
                            result.slug = slug || result.slug;
                            this.token = token || this.token;
                            result.token = token || result.token;
                            result.deployment = deployment || result.deployment;
                            result.hash = hash || null;
                            result.requested = requested || result.requested;
                            // Always set cookie if we have a token (for both promoted and non-promoted users)
                            if (token) {
                                result.setCookie = true;
                                result.cookieValue = token;
                            }
                            if (promoted === 1) {
                                result.responseID = responseID || result.responseID;
                                this.responseID = responseID || "";
                                if (this.specialParameters.chRequested) {
                                    result.stripParams = true;
                                }
                            }
                        }
                        return [2 /*return*/, result];
                    case 3:
                        error_4 = _c.sent();
                        (0, logger_1.logger)(this.options.debug, "error", "An error occurred during request validation: ".concat(error_4));
                        throw error_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //TODO: This method is a complex beast and needs refactoring
    /**
     * Validate request using signature and/or Crowdhandler API when required
     */
    Gatekeeper.prototype.validateRequestHybridMode = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var signatures, tokens, freshToken, freshSignature, processedCookie, result, liteCheck, configStatusType, sessionStatusType, token, hash, requested, error_5, validationResult, sessionStatusType, hash, requested, token, error_6, _i, _c, item, _d, _e, item;
            var _this = this;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        signatures = [];
                        tokens = [];
                        result = {
                            promoted: false,
                            stripParams: false,
                            setCookie: false,
                            setLocalStorage: false,
                            cookieValue: "",
                            responseID: "",
                            slug: "",
                            targetURL: "",
                            deployment: "",
                            hash: null,
                            token: "",
                            requested: "",
                        };
                        (0, logger_1.logger)(this.options.debug, "info", "IP: " + this.ip);
                        (0, logger_1.logger)(this.options.debug, "info", "Agent: " + this.agent);
                        (0, logger_1.logger)(this.options.debug, "info", "Host: " + this.host);
                        (0, logger_1.logger)(this.options.debug, "info", "Path: " + this.path);
                        (0, logger_1.logger)(this.options.debug, "info", "Lang: " + this.lang);
                        //Bypass paths that match the ignore patterns
                        if ((0, ignoredPatternsCheck_1.ignoredPatternsCheck)(this.path, this.ignore)) {
                            (0, logger_1.logger)(this.options.debug, "info", "Ignored path: " + this.path);
                            result.promoted = true;
                            return [2 /*return*/, result];
                        }
                        this.processURL();
                        result.targetURL = this.targetURL;
                        this.getCookie();
                        this.extractToken();
                        liteCheck = this.shouldRedirectToLiteValidator();
                        if (liteCheck.redirect) {
                            result.liteValidatorRedirect = true;
                            result.liteValidatorUrl = liteCheck.url;
                            result.promoted = false;
                            return [2 /*return*/, result];
                        }
                        return [4 /*yield*/, this.getConfig()];
                    case 1:
                        _f.sent();
                        configStatusType = types_1.HttpErrorWrapper.safeParse(this.activeConfig);
                        if (configStatusType.success) {
                            if (this.activeConfig && this.activeConfig.result.status !== 200) {
                                //Can't process the request but we can trust it if trustOnFail is set to true
                                if (this.options.trustOnFail) {
                                    result.promoted = true;
                                }
                                else {
                                    result.promoted = false;
                                    result.slug = this.options.fallbackSlug;
                                }
                                return [2 /*return*/, result];
                            }
                        }
                        //Working with a real config file from here
                        if (this.activeConfig.status === false) {
                            (0, logger_1.logger)(this.options.debug, "info", "Config succesfully fetched but no check required.");
                            result.promoted = true;
                            return [2 /*return*/, result];
                        }
                        //Attempt to retrieve crowdhandler cookie
                        this.getCookie();
                        (0, logger_1.logger)(this.options.debug, "info", "Cookie: " + this.cookieValue);
                        // Extract deployment from cookie if available
                        if (this.cookieValue && this.cookieValue.deployment) {
                            result.deployment = this.cookieValue.deployment;
                        }
                        this.getSignature({
                            chIDSignature: this.specialParameters.chIDSignature,
                            crowdhandlerCookieValue: this.cookieValue,
                        });
                        this.extractToken();
                        (0, logger_1.logger)(this.options.debug, "info", "Signature: " + this.simpleSignature);
                        (0, logger_1.logger)(this.options.debug, "info", "Complex Signature: " + this.complexSignature);
                        (0, logger_1.logger)(this.options.debug, "info", "Token: " + this.token);
                        if (!((this.simpleSignature.length === 0 ||
                            this.complexSignature.length === 0) &&
                            !this.token)) return [3 /*break*/, 5];
                        (0, logger_1.logger)(this.options.debug, "info", "Missing signature and/or token, doing a check.");
                        _f.label = 2;
                    case 2:
                        _f.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.getSessionStatus()];
                    case 3:
                        _f.sent();
                        sessionStatusType = types_1.HttpErrorWrapper.safeParse(this.sessionStatus);
                        if (sessionStatusType.success) {
                            if (this.sessionStatus && this.sessionStatus.result.status !== 200) {
                                //Can't process the request but we can trust it if trustOnFail is set to true
                                if (this.options.trustOnFail) {
                                    result.promoted = true;
                                }
                                else {
                                    result.promoted = false;
                                    result.slug = this.options.fallbackSlug;
                                }
                                return [2 /*return*/, result];
                            }
                        }
                        token = void 0;
                        if (this.sessionStatus && this.sessionStatus.result.promoted === 0) {
                            if (this.sessionStatus.result.token) {
                                token = this.sessionStatus.result.token;
                                result.token = token;
                                this.extractToken({ chID: token });
                            }
                            result.promoted = false;
                            return [2 /*return*/, result];
                        }
                        else if (this.sessionStatus &&
                            this.sessionStatus.result.promoted === 1) {
                            result.promoted = true;
                            result.setCookie = true;
                            hash = void 0;
                            requested = void 0;
                            if (this.sessionStatus.result.requested) {
                                this.requested = this.sessionStatus.result.requested;
                            }
                            if (this.sessionStatus.result.deployment) {
                                this.deployment = this.sessionStatus.result.deployment;
                                result.deployment = this.deployment;
                            }
                            if (this.sessionStatus.result.hash) {
                                hash = this.sessionStatus.result.hash;
                                result.hash = hash;
                                this.getSignature({ chIDSignature: hash });
                            }
                            if (this.sessionStatus.result.token) {
                                token = this.sessionStatus.result.token;
                                result.token = token;
                                this.extractToken({ chID: token });
                            }
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_5 = _f.sent();
                        (0, logger_1.logger)(this.options.debug, "error", error_5);
                        return [3 /*break*/, 5];
                    case 5:
                        (0, logger_1.logger)(this.options.debug, "info", "Signature and token found. Validating...");
                        validationResult = this.validateSignature();
                        if (!(validationResult.success === false)) return [3 /*break*/, 9];
                        (0, logger_1.logger)(this.options.debug, "info", "Signature not valid. Checking against API.");
                        _f.label = 6;
                    case 6:
                        _f.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, this.getSessionStatus()];
                    case 7:
                        _f.sent();
                        sessionStatusType = types_1.HttpErrorWrapper.safeParse(this.sessionStatus);
                        if (sessionStatusType.success) {
                            if (this.sessionStatus && this.sessionStatus.result.status !== 200) {
                                //Can't process the request but we can trust it if trustOnFail is set to true
                                if (this.options.trustOnFail) {
                                    result.promoted = true;
                                }
                                else {
                                    result.promoted = false;
                                    result.slug = this.options.fallbackSlug;
                                }
                                return [2 /*return*/, result];
                            }
                        }
                        if (this.sessionStatus && this.sessionStatus.result.promoted === 0) {
                            result.promoted = false;
                            return [2 /*return*/, result];
                        }
                        else if (this.sessionStatus &&
                            this.sessionStatus.result.promoted === 1) {
                            hash = void 0;
                            requested = void 0;
                            token = void 0;
                            if (this.sessionStatus.result.requested) {
                                this.requested = this.sessionStatus.result.requested;
                            }
                            if (this.sessionStatus.result.deployment) {
                                this.deployment = this.sessionStatus.result.deployment;
                                result.deployment = this.deployment;
                            }
                            if (this.sessionStatus.result.hash) {
                                hash = this.sessionStatus.result.hash;
                                result.hash = hash;
                                this.getSignature({ chIDSignature: hash });
                            }
                            if (this.sessionStatus.result.token) {
                                token = this.sessionStatus.result.token;
                                result.token = token;
                                this.extractToken({ chID: token });
                            }
                        }
                        return [3 /*break*/, 9];
                    case 8:
                        error_6 = _f.sent();
                        (0, logger_1.logger)(this.options.debug, "error", error_6);
                        return [3 /*break*/, 9];
                    case 9:
                        //part 2 here
                        //We've established that we have a valid signature at this point
                        (0, logger_1.logger)(this.options.debug, "info", "Signature is valid.");
                        try {
                            // Only parse cookieValue if it exists
                            if (this.cookieValue) {
                                this.cookieValue = types_1.CookieObject.parse(this.cookieValue);
                                if (this.cookieValue) {
                                    for (_i = 0, _c = this.cookieValue.tokens; _i < _c.length; _i++) {
                                        item = _c[_i];
                                        tokens.push(item);
                                    }
                                }
                            }
                        }
                        catch (error) {
                            (0, logger_1.logger)(this.options.debug, "error", error);
                        }
                        //Determine if we're working with a new token or a previously seen one
                        if ((Array.isArray(tokens) && tokens.length === 0) ||
                            (Array.isArray(tokens) && tokens[tokens.length - 1].token !== this.token)) {
                            freshToken = true;
                        }
                        else {
                            freshToken = false;
                            //We want to work with the most recent array of signatures
                            for (_d = 0, _e = tokens[tokens.length - 1].signatures; _d < _e.length; _d++) {
                                item = _e[_d];
                                signatures.push(item);
                            }
                        }
                        this.generateCookieObjects();
                        if (this.signatureType === "simple" &&
                            signatures.some(function (item) { return item.sig === _this.simpleSignature; }) === false) {
                            signatures.push(this.cookieSignatureObject);
                            freshSignature = true;
                        }
                        if (freshToken) {
                            //Reset the array. It's important we don't allow the PMUSER_CREDENTIALS variable exceed the byte limit.
                            tokens = [];
                            if (this.cookieTokenObject) {
                                this.cookieTokenObject.signatures = signatures;
                            }
                            tokens.push(this.cookieTokenObject);
                        }
                        else {
                            tokens[tokens.length - 1].signatures = signatures;
                            tokens[tokens.length - 1].touched = (_a = this.cookieTokenObject) === null || _a === void 0 ? void 0 : _a.touched;
                            tokens[tokens.length - 1].touchedSig = (_b = this.cookieTokenObject) === null || _b === void 0 ? void 0 : _b.touchedSig;
                        }
                        try {
                            this.cookieValue = this.generateCookie(tokens, this.deployment);
                        }
                        catch (error) {
                            (0, logger_1.logger)(this.options.debug, "error", error);
                            // Handle the error as appropriate for your application...
                        }
                        result.cookieValue = JSON.stringify(this.cookieValue);
                        if (freshSignature && this.specialParameters.chRequested) {
                            result.stripParams = true;
                        }
                        //If we made it all the way here, we can assume the user is promoted and a cookie should be set.
                        result.promoted = true;
                        result.setCookie = true;
                        result.token = this.token;
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return Gatekeeper;
}());
exports.Gatekeeper = Gatekeeper;
