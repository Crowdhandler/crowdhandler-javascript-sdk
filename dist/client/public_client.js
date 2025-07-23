"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicClient = void 0;
var base_client_1 = require("./base_client");
var resource_1 = require("./resource");
var PublicClient = /** @class */ (function (_super) {
    __extends(PublicClient, _super);
    function PublicClient(key, options) {
        if (options === void 0) { options = {}; }
        var _a = options !== null && options !== void 0 ? options : {}, _b = _a.timeout, timeout = _b === void 0 ? 5000 : _b, _c = _a.debug, debug = _c === void 0 ? false : _c, _d = _a.apiUrl, apiUrl = _d === void 0 ? "https://api.crowdhandler.com" : _d;
        return _super.call(this, apiUrl, key, options) || this;
    }
    PublicClient.prototype.requests = function () {
        return new resource_1.Resource(this.key, "/v1/requests/ID_PLACEHOLDER", { timeout: this.timeout, debug: this.debug, apiUrl: this.apiUrl });
    };
    PublicClient.prototype.responses = function () {
        return new resource_1.Resource(this.key, "/v1/responses/ID_PLACEHOLDER", { timeout: this.timeout, debug: this.debug, apiUrl: this.apiUrl });
    };
    PublicClient.prototype.rooms = function () {
        return new resource_1.Resource(this.key, "/v1/rooms/", { timeout: this.timeout, debug: this.debug, apiUrl: this.apiUrl });
    };
    return PublicClient;
}(base_client_1.BaseClient));
exports.PublicClient = PublicClient;
