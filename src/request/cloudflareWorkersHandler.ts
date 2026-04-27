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
export class CloudflareWorkersHandler {
  private request: Request;
  private url: URL;

  constructor(request: Request) {
    this.request = request;
    this.url = new URL(request.url);
  }

  public getHeader(name: string): string {
    return this.request.headers.get(name) || "";
  }

  public getCookies(): string {
    return this.request.headers.get("cookie") || "";
  }

  public getHost(): string {
    // URL.host includes port when non-standard — matches Host header
    // semantics used by the other handlers (Lambda/NodeJS/Browser).
    return this.url.host;
  }

  public getProtocol(): string {
    // URL.protocol includes the trailing ":" — strip it so the value matches
    // the other handlers (which return "https" / "http").
    return this.url.protocol.replace(/:$/, "");
  }

  public getPath(): string {
    return this.url.pathname + this.url.search;
  }

  public getAbsoluteUri(): string {
    return this.request.url;
  }

  public getUserHostAddress(): string {
    // CF-Connecting-IP is the canonical client IP header on Workers
    // (matches crowdhandler-cloudflare-integration/index.js).
    return this.request.headers.get("cf-connecting-ip") || "";
  }

  public setCookie(
    value: string,
    cookieName: string = "crowdhandler",
    domain?: string
  ): string {
    // Returns the Set-Cookie header value — caller appends it to their
    // outgoing Response. Format mirrors the existing CF integration.
    const parts = [`${cookieName}=${value}`, "path=/", "Secure"];
    if (domain) {
      parts.push(`domain=${domain}`);
    }
    return parts.join("; ");
  }

  public redirect(url: string): Response {
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
  }
}
