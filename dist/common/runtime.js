"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCloudflareWorkers = void 0;
/**
 * Detect if we're running in the Cloudflare Workers (workerd) runtime.
 * Workers sets navigator.userAgent to "Cloudflare-Workers" — this is the
 * documented and stable detection signal:
 * https://developers.cloudflare.com/workers/runtime-apis/web-standards/
 */
exports.isCloudflareWorkers = typeof navigator !== "undefined" &&
    navigator.userAgent === "Cloudflare-Workers";
