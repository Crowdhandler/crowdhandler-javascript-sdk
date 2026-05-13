"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCloudflareWorkers = exports.getCloudflareWorkersOverride = exports.setCloudflareWorkersOverride = void 0;
/**
 * Detect if we're running in the Cloudflare Workers (workerd) runtime.
 * Workers sets navigator.userAgent to "Cloudflare-Workers" — this is the
 * documented and stable detection signal:
 * https://developers.cloudflare.com/workers/runtime-apis/web-standards/
 *
 * The override (set via init({ options: { forceCloudflareWorkers } }) or
 * setCloudflareWorkersOverride directly) takes precedence over the navigator
 * check so callers that already know they are on Workers can bypass inference.
 */
var cloudflareWorkersOverride = null;
function detectCloudflareWorkers() {
    return (typeof navigator !== "undefined" &&
        navigator.userAgent === "Cloudflare-Workers");
}
function setCloudflareWorkersOverride(value) {
    cloudflareWorkersOverride = value;
}
exports.setCloudflareWorkersOverride = setCloudflareWorkersOverride;
function getCloudflareWorkersOverride() {
    return cloudflareWorkersOverride;
}
exports.getCloudflareWorkersOverride = getCloudflareWorkersOverride;
function isCloudflareWorkers() {
    if (cloudflareWorkersOverride !== null)
        return cloudflareWorkersOverride;
    return detectCloudflareWorkers();
}
exports.isCloudflareWorkers = isCloudflareWorkers;
