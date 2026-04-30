/**
 * Detect if we're running in the Cloudflare Workers (workerd) runtime.
 * Workers sets navigator.userAgent to "Cloudflare-Workers" — this is the
 * documented and stable detection signal:
 * https://developers.cloudflare.com/workers/runtime-apis/web-standards/
 */
export declare const isCloudflareWorkers: boolean;
