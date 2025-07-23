"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaResponseHandler = void 0;
var LambdaResponseHandler = /** @class */ (function () {
    function LambdaResponseHandler(requestEvent, responseEvent) {
        // Handle data in a Lambda@Edge environment
        this.request = requestEvent;
        this.response = responseEvent;
    }
    LambdaResponseHandler.prototype.getHeader = function (headername) {
        var headers = this.request.headers;
        var headerValue = headers[headername.toLowerCase()];
        if (!headerValue) {
            return "";
        }
        return headerValue[0].value;
    };
    LambdaResponseHandler.prototype.getHost = function () {
        return this.request.headers.host[0].value;
    };
    LambdaResponseHandler.prototype.getProtocol = function () {
        return this.request.headers["cloudfront-forwarded-proto"][0].value;
    };
    LambdaResponseHandler.prototype.getPath = function () {
        return this.request.uri;
    };
    LambdaResponseHandler.prototype.setCookie = function (value, cookieName) {
        if (cookieName === void 0) { cookieName = "crowdhandler"; }
        var cookieOptions = {
            path: "/",
            secure: true, // cookie will only be sent over HTTPS
        };
        // Append cookie to response header
        var cookieHeader = "".concat(cookieName, "=").concat(value, "; ").concat(Object.keys(cookieOptions)
            .map(function (key) { return "".concat(key, "=").concat(cookieOptions[key]); })
            .join("; "));
        var setCookieHeader = this.response.headers["set-cookie"] || [];
        setCookieHeader.push({ key: "Set-Cookie", value: cookieHeader });
        this.response.headers["set-cookie"] = setCookieHeader;
        return this.response;
    };
    return LambdaResponseHandler;
}());
exports.LambdaResponseHandler = LambdaResponseHandler;
