"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudflareWorkersHandler = void 0;
/**
 * Handler for Cloudflare Workers (workerd) runtime.
 *
 * Mirrors the shape of LambdaRequestHandler — the Worker model is request-in /
 * response-out (no mutable response object), so:
 *   - read methods source from the Workers-native Request
 *   - redirect() returns a Workers Response (caller returns it from fetch)
 *   - setCookie() returns the Set-Cookie header value (caller appends it
 *     to the outgoing Response)
 *
 * Cookie format and no-cache redirect headers mirror the existing
 * crowdhandler-cloudflare-integration Worker so behaviour stays consistent
 * across both deployment styles.
 */
var CloudflareWorkersHandler = /** @class */ (function () {
    function CloudflareWorkersHandler(request) {
        this.request = request;
        this.url = new URL(request.url);
    }
    CloudflareWorkersHandler.prototype.getHeader = function (name) {
        return this.request.headers.get(name) || "";
    };
    CloudflareWorkersHandler.prototype.getCookies = function () {
        return this.request.headers.get("cookie") || "";
    };
    CloudflareWorkersHandler.prototype.getHost = function () {
        // URL.host includes port when non-standard — matches Host header
        // semantics used by the other handlers (Lambda/NodeJS/Browser).
        return this.url.host;
    };
    CloudflareWorkersHandler.prototype.getProtocol = function () {
        // URL.protocol includes the trailing ":" — strip it so the value matches
        // the other handlers (which return "https" / "http").
        return this.url.protocol.replace(/:$/, "");
    };
    CloudflareWorkersHandler.prototype.getPath = function () {
        return this.url.pathname + this.url.search;
    };
    CloudflareWorkersHandler.prototype.getAbsoluteUri = function () {
        return this.request.url;
    };
    CloudflareWorkersHandler.prototype.getUserHostAddress = function () {
        // CF-Connecting-IP is the canonical client IP header on Workers
        // (matches crowdhandler-cloudflare-integration/index.js).
        return this.request.headers.get("cf-connecting-ip") || "";
    };
    CloudflareWorkersHandler.prototype.setCookie = function (value, cookieName, domain) {
        if (cookieName === void 0) { cookieName = "crowdhandler"; }
        // Returns the Set-Cookie header value — caller appends it to their
        // outgoing Response. Format mirrors the existing CF integration.
        var parts = ["".concat(cookieName, "=").concat(value), "path=/", "Secure"];
        if (domain) {
            parts.push("domain=".concat(domain));
        }
        return parts.join("; ");
    };
    CloudflareWorkersHandler.prototype.redirect = function (url) {
        // Header casing and values mirror helpers.noCacheHeaders in
        // crowdhandler-cloudflare-integration/helpers/misc.js.
        return new Response(null, {
            status: 302,
            headers: {
                Location: url,
                "Cache-Control": "no-cache, no-store, must-revalidate",
                Expires: "Fri, 01 Jan 1970 00:00:00 GMT",
                Pragma: "no-cache",
            },
        });
    };
    return CloudflareWorkersHandler;
}());
exports.CloudflareWorkersHandler = CloudflareWorkersHandler;
