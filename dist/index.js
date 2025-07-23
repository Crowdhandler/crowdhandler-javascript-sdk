"use strict";
/**
 * CrowdHandler JavaScript SDK
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modes = exports.CROWDHANDLER_ERRORS = exports.ErrorCodes = exports.CrowdHandlerError = exports.Client = exports.init = void 0;
// Polyfill for async/await in ES5 environments
require("regenerator-runtime/runtime");
// Main API
/**
 * Initialize CrowdHandler with configuration.
 * This is the main entry point for the SDK.
 */
var init_1 = require("./init");
Object.defineProperty(exports, "init", { enumerable: true, get: function () { return init_1.init; } });
/**
 * Unified API client for all CrowdHandler operations.
 * Usually obtained from init(), but can be instantiated directly.
 */
var client_1 = require("./client/client");
Object.defineProperty(exports, "Client", { enumerable: true, get: function () { return client_1.Client; } });
// Error handling
var errors_1 = require("./common/errors");
Object.defineProperty(exports, "CrowdHandlerError", { enumerable: true, get: function () { return errors_1.CrowdHandlerError; } });
Object.defineProperty(exports, "ErrorCodes", { enumerable: true, get: function () { return errors_1.ErrorCodes; } });
// Export individual error codes for better autocomplete
exports.CROWDHANDLER_ERRORS = {
    // Configuration errors
    INVALID_CONFIG: 'INVALID_CONFIG',
    INVALID_MODE: 'INVALID_MODE',
    INVALID_CONTEXT: 'INVALID_CONTEXT',
    MISSING_PRIVATE_KEY: 'MISSING_PRIVATE_KEY',
    // API errors
    API_CONNECTION_FAILED: 'API_CONNECTION_FAILED',
    API_TIMEOUT: 'API_TIMEOUT',
    API_INVALID_RESPONSE: 'API_INVALID_RESPONSE',
    INVALID_API_KEY: 'INVALID_API_KEY',
    RATE_LIMITED: 'RATE_LIMITED',
    // Resource errors
    RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
    DOMAIN_NOT_FOUND: 'DOMAIN_NOT_FOUND',
    ROOM_NOT_FOUND: 'ROOM_NOT_FOUND',
    SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',
    // Generic errors
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};
// Mode constants for better IntelliSense
var types_1 = require("./common/types");
Object.defineProperty(exports, "Modes", { enumerable: true, get: function () { return types_1.Modes; } });
