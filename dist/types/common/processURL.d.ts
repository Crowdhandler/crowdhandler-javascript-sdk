import { z } from "zod";
import { RequestObject } from "./types";
export declare class ProcessURL {
    private host;
    private path;
    private rawQueryString;
    private specialParameters;
    private targetURL;
    debug: boolean;
    constructor(request: z.infer<typeof RequestObject>, debug?: boolean);
    parseURL(): {
        targetURL: string;
        specialParameters: {
            chCode: string;
            chID: string;
            chIDSignature: string;
            chPublicKey: string;
            chRequested: string;
        };
    };
    /**
     * Extract a parameter value from the raw query string using regex.
     * Decodes the value for actual use.
     *
     * Treats `+` as a space before percent-decoding — this is the HTML
     * form-encoding convention used by URLSearchParams and the legacy
     * query-string library, and by every other CrowdHandler integration
     * (Cloudflare Worker, CloudFront). `decodeURIComponent` alone does not
     * do this. Keeping it consistent matters for signature validation: any
     * divergence in how the SDK and the edge decode ch-* values produces
     * mismatched signatures.
     */
    private extractParamValue;
    /**
     * Sanitize a parameter value - return empty string for unusable values.
     */
    private sanitizeParam;
    /**
     * Remove ch-* parameters from the query string while preserving
     * the original encoding of all other parameters.
     */
    private removeChParams;
}
