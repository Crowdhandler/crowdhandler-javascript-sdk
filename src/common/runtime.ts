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
let cloudflareWorkersOverride: boolean | null = null;

function detectCloudflareWorkers(): boolean {
  return (
    typeof navigator !== "undefined" &&
    (navigator as any).userAgent === "Cloudflare-Workers"
  );
}

export function setCloudflareWorkersOverride(value: boolean | null): void {
  cloudflareWorkersOverride = value;
}

export function getCloudflareWorkersOverride(): boolean | null {
  return cloudflareWorkersOverride;
}

export function isCloudflareWorkers(): boolean {
  if (cloudflareWorkersOverride !== null) return cloudflareWorkersOverride;
  return detectCloudflareWorkers();
}
