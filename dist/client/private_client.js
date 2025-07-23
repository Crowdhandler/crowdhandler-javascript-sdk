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
exports.PrivateClient = void 0;
var base_client_1 = require("./base_client");
var resource_1 = require("./resource");
var PrivateClient = /** @class */ (function (_super) {
    __extends(PrivateClient, _super);
    function PrivateClient(key, options) {
        if (options === void 0) { options = {}; }
        var _a = options !== null && options !== void 0 ? options : {}, _b = _a.timeout, timeout = _b === void 0 ? 5000 : _b, _c = _a.debug, debug = _c === void 0 ? false : _c, _d = _a.apiUrl, apiUrl = _d === void 0 ? "https://api.crowdhandler.com" : _d;
        return _super.call(this, apiUrl, key, options) || this;
    }
    PrivateClient.prototype.account = function () {
        return new resource_1.Resource(this.key, "/v1/account/", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.accountPlan = function () {
        return new resource_1.Resource(this.key, "/v1/account/plan", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.codes = function () {
        return new resource_1.Resource(this.key, "/v1/codes/ID_PLACEHOLDER", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.domains = function () {
        return new resource_1.Resource(this.key, "/v1/domains/ID_PLACEHOLDER", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.domainIPs = function () {
        return new resource_1.Resource(this.key, "/v1/domains/ID_PLACEHOLDER/ips", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.domainReports = function () {
        return new resource_1.Resource(this.key, "/v1/domains/ID_PLACEHOLDER/reports", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.domainRequests = function () {
        return new resource_1.Resource(this.key, "/v1/domains/ID_PLACEHOLDER/requests", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.domainRooms = function () {
        return new resource_1.Resource(this.key, "/v1/domains/ID_PLACEHOLDER/rooms", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.domainURLs = function () {
        return new resource_1.Resource(this.key, "/v1/domains/ID_PLACEHOLDER/urls", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.groups = function () {
        return new resource_1.Resource(this.key, "/v1/groups/ID_PLACEHOLDER", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.groupBatch = function () {
        return new resource_1.Resource(this.key, "/v1/groups/ID_PLACEHOLDER/batch", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.groupCodes = function () {
        return new resource_1.Resource(this.key, "/v1/groups/ID_PLACEHOLDER/codes", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.ips = function () {
        return new resource_1.Resource(this.key, "/v1/ips/ID_PLACEHOLDER", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.reports = function () {
        return new resource_1.Resource(this.key, "/v1/reports/ID_PLACEHOLDER", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.rooms = function () {
        return new resource_1.Resource(this.key, "/v1/rooms/ID_PLACEHOLDER", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.roomReports = function () {
        return new resource_1.Resource(this.key, "/v1/rooms/ID_PLACEHOLDER/reports", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.roomSessions = function () {
        return new resource_1.Resource(this.key, "/v1/rooms/ID_PLACEHOLDER/sessions", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.sessions = function () {
        return new resource_1.Resource(this.key, "/v1/sessions/ID_PLACEHOLDER", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    PrivateClient.prototype.templates = function () {
        return new resource_1.Resource(this.key, "/v1/templates/ID_PLACEHOLDER", {
            timeout: this.timeout,
            debug: this.debug,
            apiUrl: this.apiUrl,
        });
    };
    return PrivateClient;
}(base_client_1.BaseClient));
exports.PrivateClient = PrivateClient;
