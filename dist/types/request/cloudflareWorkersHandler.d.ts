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
export declare class CloudflareWorkersHandler {
    private request;
    private url;
    constructor(request: Request);
    getHeader(name: string): string;
    getCookies(): string;
    getHost(): string;
    getProtocol(): string;
    getPath(): string;
    getAbsoluteUri(): string;
    getUserHostAddress(): string;
    setCookie(value: string, cookieName?: string, domain?: string): string;
    redirect(url: string): Response;
}
