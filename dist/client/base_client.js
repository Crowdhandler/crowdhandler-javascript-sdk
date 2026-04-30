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
var runtime_1 = require("../common/runtime");
// axios 0.27.2 has no fetch adapter and requires Node's http module, so it
// crashes inside Workers. When isCloudflareWorkers is true we route HTTP
// through native fetch instead — preserved error shape so errorHandler keeps
// working.
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
        if (!runtime_1.isCloudflareWorkers) {
            // axios.defaults is process-global state and is meaningless in Workers
            // (we don't use axios there). Skip in Workers to avoid touching axios's
            // internal config which can drag in Node-only deps during import.
            axios_1.default.defaults.timeout = this.timeout;
        }
    }
    /**
     * Issue an HTTP request. Routes through axios in Node/Lambda environments
     * and native fetch in Cloudflare Workers. Both paths return / throw
     * axios-compatible shapes so errorHandler() and the response.data parsing
     * downstream work unchanged.
     */
    BaseClient.prototype.httpRequest = function (method, url, options) {
        var _a;
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var requestTimeout, response_1, finalUrl, search, _i, _b, _c, k, v, init, hasContentType, controller, timeoutId, response, err_1, wrapped, contentType, data, _d, text, headersObj_1, wrapped, headersObj;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        requestTimeout = (_a = options.timeout) !== null && _a !== void 0 ? _a : this.timeout;
                        if (!!runtime_1.isCloudflareWorkers) return [3 /*break*/, 2];
                        return [4 /*yield*/, axios_1.default.request({
                                method: method,
                                url: url,
                                params: options.params,
                                data: options.body,
                                headers: options.headers,
                                timeout: requestTimeout,
                            })];
                    case 1:
                        response_1 = _e.sent();
                        return [2 /*return*/, { data: response_1.data, status: response_1.status, headers: response_1.headers }];
                    case 2:
                        finalUrl = url;
                        if (options.params && Object.keys(options.params).length > 0) {
                            search = new URLSearchParams();
                            for (_i = 0, _b = Object.entries(options.params); _i < _b.length; _i++) {
                                _c = _b[_i], k = _c[0], v = _c[1];
                                if (v !== undefined && v !== null)
                                    search.append(k, String(v));
                            }
                            finalUrl += (finalUrl.includes("?") ? "&" : "?") + search.toString();
                        }
                        init = {
                            method: method,
                            headers: options.headers,
                        };
                        if (options.body !== undefined && method !== "GET" && method !== "DELETE") {
                            init.body = typeof options.body === "string" ? options.body : JSON.stringify(options.body);
                            hasContentType = options.headers && Object.keys(options.headers)
                                .some(function (h) { return h.toLowerCase() === "content-type"; });
                            if (!hasContentType) {
                                init.headers = __assign(__assign({}, (options.headers || {})), { "content-type": "application/json" });
                            }
                        }
                        controller = new AbortController();
                        timeoutId = setTimeout(function () { return controller.abort(); }, requestTimeout);
                        init.signal = controller.signal;
                        _e.label = 3;
                    case 3:
                        _e.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, fetch(finalUrl, init)];
                    case 4:
                        response = _e.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _e.sent();
                        clearTimeout(timeoutId);
                        wrapped = new Error((err_1 === null || err_1 === void 0 ? void 0 : err_1.message) || "Network request failed");
                        if (controller.signal.aborted || (err_1 === null || err_1 === void 0 ? void 0 : err_1.name) === "AbortError") {
                            wrapped.code = "ECONNABORTED";
                        }
                        wrapped.request = { url: finalUrl, method: method };
                        wrapped.config = { url: finalUrl, method: method };
                        throw wrapped;
                    case 6:
                        clearTimeout(timeoutId);
                        contentType = response.headers.get("content-type") || "";
                        if (!contentType.includes("application/json")) return [3 /*break*/, 11];
                        _e.label = 7;
                    case 7:
                        _e.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, response.json()];
                    case 8:
                        data = _e.sent();
                        return [3 /*break*/, 10];
                    case 9:
                        _d = _e.sent();
                        data = null;
                        return [3 /*break*/, 10];
                    case 10: return [3 /*break*/, 13];
                    case 11: return [4 /*yield*/, response.text()];
                    case 12:
                        text = _e.sent();
                        try {
                            data = JSON.parse(text);
                        }
                        catch (_f) {
                            data = text;
                        }
                        _e.label = 13;
                    case 13:
                        if (response.status < 200 || response.status >= 300) {
                            headersObj_1 = {};
                            response.headers.forEach(function (v, k) { headersObj_1[k] = v; });
                            wrapped = new Error("Request failed with status ".concat(response.status));
                            wrapped.response = { status: response.status, data: data, headers: headersObj_1 };
                            wrapped.config = { url: finalUrl, method: method };
                            throw wrapped;
                        }
                        headersObj = {};
                        response.headers.forEach(function (v, k) { headersObj[k] = v; });
                        return [2 /*return*/, { data: data, status: response.status, headers: headersObj }];
                }
            });
        });
    };
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
    /**
     * Provides generic suggestion based on HTTP status code
     */
    BaseClient.prototype.getGenericSuggestion = function (status) {
        switch (status) {
            case 400: return 'Check your request parameters';
            case 401: return 'Check your authentication credentials';
            case 403: return 'You do not have permission for this action';
            case 404: return 'The requested resource was not found';
            case 429: return 'Too many requests - please slow down';
            case 500:
            case 502:
            case 503:
            case 504:
                return 'Server error - please try again later';
            default:
                return status >= 500
                    ? 'This appears to be a server error. Please try again later or contact support@crowdhandler.com'
                    : 'Please check your request parameters and try again';
        }
    };
    BaseClient.prototype.errorHandler = function (error) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var status_1, data, errorMessage, retryAfter;
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
                    errorMessage = (data === null || data === void 0 ? void 0 : data.error) || (data === null || data === void 0 ? void 0 : data.message) || "API request failed with status ".concat(status_1);
                    // Special handling for rate limiting to include retry-after
                    if (status_1 === 429) {
                        retryAfter = error.response.headers['retry-after'];
                        throw new errors_1.CrowdHandlerError(errors_1.ErrorCodes.RATE_LIMITED, errorMessage, retryAfter
                            ? "Wait ".concat(retryAfter, " seconds before retrying")
                            : 'Reduce the frequency of API calls', status_1, {
                            url: (_a = error.config) === null || _a === void 0 ? void 0 : _a.url,
                            method: (_b = error.config) === null || _b === void 0 ? void 0 : _b.method,
                            apiResponse: data,
                            retryAfter: retryAfter
                        });
                    }
                    // Pass through the API error with full response data
                    throw new errors_1.CrowdHandlerError(errors_1.ErrorCodes.API_INVALID_RESPONSE, errorMessage, this.getGenericSuggestion(status_1), status_1, {
                        url: (_c = error.config) === null || _c === void 0 ? void 0 : _c.url,
                        method: (_d = error.config) === null || _d === void 0 ? void 0 : _d.method,
                        apiResponse: data // Full API response, not truncated
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
                        return [4 /*yield*/, this.httpRequest("DELETE", this.apiUrl + path, {
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
                        return [4 /*yield*/, this.httpRequest("GET", this.apiUrl + path, {
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
                        return [4 /*yield*/, this.httpRequest("POST", this.apiUrl + path, {
                                body: body,
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
    BaseClient.prototype.httpPUT = function (path, body, options) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.httpRequest("PUT", this.apiUrl + path, {
                                body: body,
                                headers: {
                                    "x-api-key": this.key,
                                },
                                timeout: options === null || options === void 0 ? void 0 : options.timeout,
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
