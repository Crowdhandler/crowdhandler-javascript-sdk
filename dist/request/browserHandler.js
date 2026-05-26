"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserHandler = void 0;
var BrowserHandler = /** @class */ (function () {
    function BrowserHandler() {
    }
    BrowserHandler.prototype.getCookies = function () {
        return document.cookie;
    };
    BrowserHandler.prototype.getHost = function () {
        return window.location.host;
    };
    BrowserHandler.prototype.getProtocol = function () {
        return window.location.protocol;
    };
    BrowserHandler.prototype.getPath = function () {
        if (!window.location.search) {
            return window.location.pathname;
        }
        else {
            return "".concat(window.location.pathname).concat(window.location.search);
        }
    };
    BrowserHandler.prototype.getAbsoluteUri = function () {
        return window.location.href;
    };
    BrowserHandler.prototype.setCookie = function (value, cookieName, domain, maxAgeSeconds) {
        if (cookieName === void 0) { cookieName = "crowdhandler"; }
        var cookieOptions = {
            path: "/",
            secure: true, // cookie will only be sent over HTTPS
        };
        // Add domain if provided
        if (domain) {
            cookieOptions.domain = domain;
        }
        // Opt-in persistence — when maxAgeSeconds is omitted, the cookie is a
        // session cookie (browsers drop it when closed). Max-Age is preferred
        // over Expires because it's not affected by client clock skew.
        if (maxAgeSeconds) {
            cookieOptions["Max-Age"] = maxAgeSeconds;
        }
        document.cookie = "".concat(cookieName, "=").concat(value, "; ").concat(Object.keys(cookieOptions)
            .map(function (key) { return "".concat(key, "=").concat(cookieOptions[key]); })
            .join("; "));
    };
    BrowserHandler.prototype.getLocalStorageItem = function (key) {
        return localStorage.getItem(key);
    };
    BrowserHandler.prototype.setLocalStorageItem = function (key, value) {
        localStorage.setItem(key, value);
    };
    BrowserHandler.prototype.redirect = function (url) {
        window.location.href = url;
    };
    return BrowserHandler;
}());
exports.BrowserHandler = BrowserHandler;
