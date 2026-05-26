"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
var client_1 = require("./client/client");
var requestContext_1 = require("./request/requestContext");
var gatekeeper_1 = require("./gatekeeper/gatekeeper");
var errors_1 = require("./common/errors");
var runtime_1 = require("./common/runtime");
var logger_1 = require("./common/logger");
// Implementation
function init(config) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    // Validate configuration
    if (!config.publicKey) {
        throw new errors_1.CrowdHandlerError(errors_1.ErrorCodes.INVALID_CONFIG, 'publicKey is required', 'Provide your public key from the CrowdHandler dashboard: crowdhandler.init({ publicKey: "YOUR_KEY" })');
    }
    // Apply the Workers runtime override before constructing the Client, because
    // BaseClient's constructor reads isCloudflareWorkers() to decide whether to
    // touch axios.defaults. Unconditionally sync the module-level override so
    // repeated init() calls don't bleed state from prior invocations — omission
    // resets to null (navigator inference) rather than retaining a previously
    // forced value.
    (0, runtime_1.setCloudflareWorkersOverride)(((_a = config.options) === null || _a === void 0 ? void 0 : _a.forceCloudflareWorkers) === true ? true : null);
    // When a Workers context is provided, surface which signal drove the runtime
    // decision so debug logs can distinguish forced overrides from navigator
    // inference. Only emitted in debug mode.
    if (config.cloudflareWorkersRequest) {
        var source = (0, runtime_1.getCloudflareWorkersOverride)() !== null ? "override" : "navigator inference";
        (0, logger_1.logger)(!!((_b = config.options) === null || _b === void 0 ? void 0 : _b.debug), "info", "[CH] Cloudflare Workers runtime: ".concat((0, runtime_1.isCloudflareWorkers)(), " (via ").concat(source, ")"));
    }
    // Create unified client
    var client = new client_1.Client({
        publicKey: config.publicKey,
        privateKey: config.privateKey,
        options: config.options
    });
    // Check if context was provided
    var hasContext = !!((config.request && config.response) ||
        config.lambdaEdgeEvent ||
        config.cloudflareWorkersRequest ||
        (typeof window !== 'undefined' && !config.request && !config.response && !config.lambdaEdgeEvent && !config.cloudflareWorkersRequest));
    // Create gatekeeper if context provided
    var gatekeeper;
    if (hasContext) {
        // Create RequestContext
        var context = void 0;
        if (config.lambdaEdgeEvent) {
            context = new requestContext_1.RequestContext({ lambdaEvent: config.lambdaEdgeEvent });
        }
        else if (config.cloudflareWorkersRequest) {
            context = new requestContext_1.RequestContext({ cloudflareWorkersRequest: config.cloudflareWorkersRequest });
        }
        else if (config.request && config.response) {
            context = new requestContext_1.RequestContext({ request: config.request, response: config.response });
        }
        else if (typeof window !== 'undefined') {
            context = new requestContext_1.RequestContext({});
        }
        else {
            throw new errors_1.CrowdHandlerError(errors_1.ErrorCodes.INVALID_CONTEXT, 'Invalid context configuration', 'Provide either:\n' +
                '- { request, response } for Express/Node.js\n' +
                '- { lambdaEdgeEvent } for Lambda@Edge\n' +
                '- { cloudflareWorkersRequest } for Cloudflare Workers\n' +
                '- Nothing for browser environment');
        }
        // Auto-detect mode
        var mode = detectMode(config);
        // Prepare gatekeeper options
        var gatekeeperOptions = __assign(__assign({ mode: mode, debug: (_c = config.options) === null || _c === void 0 ? void 0 : _c.debug, timeout: (_d = config.options) === null || _d === void 0 ? void 0 : _d.timeout }, (((_e = config.options) === null || _e === void 0 ? void 0 : _e.trustOnFail) !== undefined && { trustOnFail: config.options.trustOnFail })), { fallbackSlug: (_f = config.options) === null || _f === void 0 ? void 0 : _f.fallbackSlug, cookieName: (_g = config.options) === null || _g === void 0 ? void 0 : _g.cookieName, cookieMaxAgeSeconds: (_h = config.options) === null || _h === void 0 ? void 0 : _h.cookieMaxAgeSeconds, liteValidator: (_j = config.options) === null || _j === void 0 ? void 0 : _j.liteValidator, roomsConfig: (_k = config.options) === null || _k === void 0 ? void 0 : _k.roomsConfig, waitingRoom: (_l = config.options) === null || _l === void 0 ? void 0 : _l.waitingRoom, testError: (_m = config.options) === null || _m === void 0 ? void 0 : _m.testError });
        // Create gatekeeper using the public client from our unified client
        gatekeeper = new gatekeeper_1.Gatekeeper(client.getPublicClient(), context, {
            publicKey: config.publicKey,
            privateKey: config.privateKey
        }, gatekeeperOptions);
    }
    return { client: client, gatekeeper: gatekeeper };
}
exports.init = init;
/**
 * Detect the appropriate mode based on configuration and environment
 */
function detectMode(config) {
    var _a;
    // Explicit mode takes precedence
    if (((_a = config.options) === null || _a === void 0 ? void 0 : _a.mode) && config.options.mode !== 'auto') {
        // Validate mode requirements
        if (config.options.mode === 'hybrid' && !config.privateKey) {
            throw new errors_1.CrowdHandlerError(errors_1.ErrorCodes.INVALID_MODE, 'Hybrid mode requires a privateKey', 'Either provide a privateKey or use "full" mode');
        }
        return config.options.mode;
    }
    // Auto-detect based on environment
    if (typeof window !== 'undefined') {
        return 'clientside';
    }
    // Default to 'full' mode for server environments
    // (hybrid mode must be explicitly chosen)
    return 'full';
}
