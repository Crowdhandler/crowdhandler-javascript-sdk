"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeJSHandler = void 0;
var NodeJSHandler = /** @class */ (function () {
    function NodeJSHandler(req, res) {
        // Handle data in a non-Lambda environment
        this.request = req;
        this.response = res;
    }
    NodeJSHandler.prototype.getHeader = function (headername) {
        var headerValue = this.request.header(headername);
        if (!headerValue) {
            return "";
        }
        return headerValue;
    };
    NodeJSHandler.prototype.getCookies = function () {
        return this.request.get("cookie");
    };
    NodeJSHandler.prototype.getHost = function () {
        return this.request.get("host");
    };
    NodeJSHandler.prototype.getProtocol = function () {
        return this.request.protocol;
    };
    NodeJSHandler.prototype.getPath = function () {
        return this.request.originalUrl;
    };
    NodeJSHandler.prototype.getAbsoluteUri = function () {
        return (this.request.protocol +
            "://" +
            this.request.get("host") +
            this.request.originalUrl);
    };
    NodeJSHandler.prototype.getUserHostAddress = function () {
        return this.request.ip;
    };
    NodeJSHandler.prototype.setCookie = function (value, cookieName, domain) {
        if (cookieName === void 0) { cookieName = "crowdhandler"; }
        var cookieOptions = {
            path: "/",
            secure: true, // cookie will only be sent over HTTPS
        };
        // Add domain if provided
        if (domain) {
            cookieOptions.domain = domain;
        }
        //Append cookie to response header
        return this.response.setHeader("Set-Cookie", "".concat(cookieName, "=").concat(value, "; ").concat(Object.keys(cookieOptions)
            .map(function (key) { return "".concat(key, "=").concat(cookieOptions[key]); })
            .join("; ")));
    };
    NodeJSHandler.prototype.redirect = function (url) {
        this.response.setHeader("Cache-Control", "no-cache, no-store, max-age=0");
        this.response.setHeader("Pragma", "no-cache");
        this.response.setHeader("Expires", 0);
        this.response.setHeader("Location", url);
        this.response.statusCode = 302;
        return this.response.end();
    };
    return NodeJSHandler;
}());
exports.NodeJSHandler = NodeJSHandler;
