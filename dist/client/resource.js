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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resource = void 0;
var base_client_1 = require("./base_client");
var Resource = /** @class */ (function (_super) {
    __extends(Resource, _super);
    function Resource(key, path, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        var _a = options !== null && options !== void 0 ? options : {}, _b = _a.timeout, timeout = _b === void 0 ? 5000 : _b, _c = _a.debug, debug = _c === void 0 ? false : _c, _d = _a.apiUrl, apiUrl = _d === void 0 ? "https://api.crowdhandler.com" : _d;
        _this = _super.call(this, apiUrl, key, options) || this;
        _this.path = path;
        return _this;
    }
    Resource.prototype.formatPath = function (path, id) {
        // If id is not provided, replace it with an empty string.
        id = id || "";
        //this.path may contain a placeholder for the id. replace it with the actual id.
        path = path.replace("ID_PLACEHOLDER", id);
        return path;
    };
    Resource.prototype.delete = function (id, body) {
        this.path = this.formatPath(this.path, id);
        return _super.prototype.httpDELETE.call(this, this.path, body);
    };
    Resource.prototype.get = function (id, params) {
        //Handle id being an optional parameter
        if (!id) {
            id = "";
        }
        this.path = this.formatPath(this.path, id);
        // Extract custom parameters and spread them with other params
        var _a = params || {}, custom = _a.custom, standardParams = __rest(_a, ["custom"]);
        var requestParams = __assign(__assign({}, standardParams), custom // Spread custom parameters at the root level
        );
        return _super.prototype.httpGET.call(this, this.path, requestParams);
    };
    Resource.prototype.post = function (body) {
        this.path = this.formatPath(this.path, "");
        // Extract custom parameters and spread them with other body params
        var _a = body || {}, custom = _a.custom, standardBody = __rest(_a, ["custom"]);
        var requestBody = __assign(__assign({}, standardBody), custom // Spread custom parameters at the root level
        );
        return _super.prototype.httpPOST.call(this, this.path, requestBody);
    };
    Resource.prototype.put = function (id, body) {
        this.path = this.formatPath(this.path, id);
        return _super.prototype.httpPUT.call(this, this.path, body);
    };
    return Resource;
}(base_client_1.BaseClient));
exports.Resource = Resource;
