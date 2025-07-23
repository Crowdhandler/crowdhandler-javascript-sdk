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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseClient = void 0;
var axios_1 = __importDefault(require("axios"));
var zod_1 = require("zod");
var logger_1 = require("../common/logger");
var errors_1 = require("../common/errors");
var APIResponse = zod_1.z.object({}).catchall(zod_1.z.any());
var APIErrorResponse = zod_1.z
    .object({
    error: zod_1.z.string().optional(),
    message: zod_1.z.string().optional(),
    statusCode: zod_1.z.number().optional(),
})
    .catchall(zod_1.z.any());
var BaseClient = /** @class */ (function () {
    function BaseClient(apiUrl, key, options) {
        if (options === void 0) { options = {}; }
        this.debug = options.debug || false;
        this.apiUrl = options.apiUrl || apiUrl;
        this.key = key;
        this.timeout = options.timeout || 5000;
        axios_1.default.defaults.timeout = this.timeout;
    }
    /**
     * Wraps any error into a CrowdHandlerError
     */
    BaseClient.prototype.wrapError = function (error) {
        var _a;
        // Already a CrowdHandlerError
        if (error instanceof errors_1.CrowdHandlerError) {
            return error;
        }
        // Zod validation error
        if (error.name === 'ZodError') {
            return new errors_1.CrowdHandlerError(errors_1.ErrorCodes.API_INVALID_RESPONSE, 'Invalid response format from API', 'This might be a temporary issue. If it persists, contact support@crowdhandler.com', undefined, { parseError: error.message });
        }
        // Generic unknown error
        return new errors_1.CrowdHandlerError(errors_1.ErrorCodes.UNKNOWN_ERROR, error.message || 'An unexpected error occurred', 'Please try again. If the problem persists, contact support@crowdhandler.com', undefined, {
            errorType: (_a = error.constructor) === null || _a === void 0 ? void 0 : _a.name,
            stack: error.stack
        });
    };
    BaseClient.prototype.errorHandler = function (error) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var status_1, data, retryAfter, urlMatch, resourceType, resourceId, errorMessage;
            return __generator(this, function (_e) {
                // If it's already a CrowdHandlerError, just re-throw it
                if (error instanceof errors_1.CrowdHandlerError) {
                    throw error;
                }
                if (error.response) {
                    status_1 = error.response.status;
                    data = error.response.data;
                    (0, logger_1.logger)(this.debug, "error", "API Error - Status: ".concat(status_1, " - ").concat(JSON.stringify(data)));
                    (0, logger_1.logger)(this.debug, "error", "Response headers: ".concat(JSON.stringify(error.response.headers)));
                    // Handle specific HTTP status codes
                    if (status_1 === 401) {
                        throw errors_1.createError.invalidApiKey('public');
                    }
                    if (status_1 === 429) {
                        retryAfter = error.response.headers['retry-after'];
                        throw errors_1.createError.rateLimited(retryAfter);
                    }
                    if (status_1 === 404) {
                        urlMatch = (_b = (_a = error.config) === null || _a === void 0 ? void 0 : _a.url) === null || _b === void 0 ? void 0 : _b.match(/\/v1\/(\w+)\/(\w+)/);
                        if (urlMatch) {
                            resourceType = urlMatch[1], resourceId = urlMatch[2];
                            throw errors_1.createError.resourceNotFound(resourceType, resourceId);
                        }
                    }
                    errorMessage = (data === null || data === void 0 ? void 0 : data.error) || (data === null || data === void 0 ? void 0 : data.message) || "API request failed with status ".concat(status_1);
                    throw new errors_1.CrowdHandlerError(errors_1.ErrorCodes.API_INVALID_RESPONSE, errorMessage, status_1 >= 500
                        ? 'This appears to be a server error. Please try again later or contact support@crowdhandler.com'
                        : 'Please check your request parameters and try again', status_1, {
                        url: (_c = error.config) === null || _c === void 0 ? void 0 : _c.url,
                        method: (_d = error.config) === null || _d === void 0 ? void 0 : _d.method,
                        responseData: JSON.stringify(data).substring(0, 200)
                    });
                }
                else if (error.request) {
                    // The request was made but no response was received
                    (0, logger_1.logger)(this.debug, "error", "No response received: ".concat(error.message));
                    throw errors_1.createError.apiConnection(error);
                }
                else {
                    // Something happened in setting up the request
                    (0, logger_1.logger)(this.debug, "error", "Request setup error: ".concat(error.message));
                    // Use wrapError to ensure we always throw CrowdHandlerError
                    throw this.wrapError(error);
                }
                return [2 /*return*/];
            });
        });
    };
    BaseClient.prototype.httpDELETE = function (path, body) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 4]);
                        return [4 /*yield*/, axios_1.default.delete(this.apiUrl + path, {
                                headers: {
                                    "x-api-key": this.key,
                                },
                            })];
                    case 1:
                        response = _a.sent();
                        try {
                            return [2 /*return*/, APIResponse.parse(response.data)];
                        }
                        catch (parseError) {
                            throw this.wrapError(parseError);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        error_1 = _a.sent();
                        return [4 /*yield*/, this.errorHandler(error_1)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    BaseClient.prototype.httpGET = function (path, params) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 4]);
                        return [4 /*yield*/, axios_1.default.get(this.apiUrl + path, {
                                params: params,
                                headers: {
                                    "x-api-key": this.key,
                                },
                            })];
                    case 1:
                        response = _a.sent();
                        try {
                            return [2 /*return*/, APIResponse.parse(response.data)];
                        }
                        catch (parseError) {
                            throw this.wrapError(parseError);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        error_2 = _a.sent();
                        return [4 /*yield*/, this.errorHandler(error_2)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    BaseClient.prototype.httpPOST = function (path, body, headers, schema) {
        if (schema === void 0) { schema = APIResponse; }
        return __awaiter(this, void 0, void 0, function () {
            var response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 4]);
                        return [4 /*yield*/, axios_1.default.post(this.apiUrl + path, body, {
                                headers: __assign({ "x-api-key": this.key }, headers),
                            })];
                    case 1:
                        response = _a.sent();
                        try {
                            return [2 /*return*/, schema.parse(response.data)];
                        }
                        catch (parseError) {
                            throw this.wrapError(parseError);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        error_3 = _a.sent();
                        return [4 /*yield*/, this.errorHandler(error_3)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    BaseClient.prototype.httpPUT = function (path, body) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.put(this.apiUrl + path, body, {
                                headers: {
                                    "x-api-key": this.key,
                                },
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, APIResponse.parse(response.data)];
                    case 2:
                        error_4 = _a.sent();
                        return [2 /*return*/, this.errorHandler(error_4)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return BaseClient;
}());
exports.BaseClient = BaseClient;
