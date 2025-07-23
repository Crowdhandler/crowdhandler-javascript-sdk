"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaRequestHandler = void 0;
var LambdaRequestHandler = /** @class */ (function () {
    function LambdaRequestHandler(event /*context: any, callback: any*/) {
        this.request = event;
    }
    LambdaRequestHandler.prototype.getHeader = function (headername) {
        var headers = this.request.headers;
        var headerValue = headers[headername.toLowerCase()];
        if (!headerValue) {
            return "";
        }
        return headerValue[0].value;
    };
    LambdaRequestHandler.prototype.getCookies = function () {
        var headers = this.request.headers;
        var cookies = headers.cookie;
        if (!cookies) {
            return "";
        }
        return cookies[0].value;
    };
    LambdaRequestHandler.prototype.getHost = function () {
        return this.request.headers.host[0].value;
    };
    LambdaRequestHandler.prototype.getProtocol = function () {
        return this.request.headers["cloudfront-forwarded-proto"][0].value;
    };
    LambdaRequestHandler.prototype.getPath = function () {
        if (!this.request.querystring) {
            return this.request.uri;
        }
        else {
            return "".concat(this.request.uri, "?").concat(this.request.querystring);
        }
    };
    LambdaRequestHandler.prototype.getAbsoluteUri = function () {
        var protocol = this.getProtocol();
        var host = this.getHost();
        var path = this.getPath();
        return "".concat(protocol, "://").concat(host).concat(path);
    };
    LambdaRequestHandler.prototype.getUserHostAddress = function () {
        return this.request.clientIp;
    };
    LambdaRequestHandler.prototype.setHeader = function (headerName, headerValue) {
        this.request.headers[headerName] = [
            {
                key: headerName,
                value: headerValue,
            },
        ];
    };
    LambdaRequestHandler.prototype.redirect = function (url) {
        var response = {
            status: "302",
            statusDescription: "Found",
            headers: {
                location: [
                    {
                        key: "Location",
                        value: url,
                    },
                ],
                /*"set-cookie": [
                    {
                      key: "Set-Cookie",
                      value: `crowdhandler=${token}; path=/; Secure; HttpOnly`,
                    },
                  ],*/
                "cache-control": [
                    {
                        key: "Cache-Control",
                        value: "no-cache, no-store, must-revalidate",
                    },
                ],
                expires: [
                    {
                        key: "Expires",
                        value: "Fri, 01 Jan 1970 00:00:00 GMT",
                    },
                ],
                pragma: [
                    {
                        key: "Pragma",
                        value: "no-cache",
                    },
                ],
            },
        };
        return response;
    };
    return LambdaRequestHandler;
}());
exports.LambdaRequestHandler = LambdaRequestHandler;
