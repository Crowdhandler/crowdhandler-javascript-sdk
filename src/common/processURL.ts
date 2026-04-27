import { z } from "zod";
import { CH_PARAM_KEYS, RequestObject, SpecialParametersObject } from "./types";
import { logger } from "./logger";

export class ProcessURL {
  private host: string | undefined;
  private path: string | undefined;
  private rawQueryString: string | undefined;
  private specialParameters!: z.infer<typeof SpecialParametersObject>;
  private targetURL: string | undefined;
  debug: boolean;

  constructor(request: z.infer<typeof RequestObject>, debug: boolean = false) {
    this.host = request.getHost();
    this.path = request.getPath();
    this.specialParameters = {
      chCode: "",
      chID: "",
      chIDSignature: "",
      chPublicKey: "",
      chRequested: "",
    };

    this.debug = debug;
  }

  public parseURL() {
    if (!this.host) {
      logger(this.debug, "warn", "No host found in request object.");
      return {
        targetURL: "",
        specialParameters: this.specialParameters,
      };
    }

    if (!this.path) {
      logger(this.debug, "warn", "No path found in request object.");
      return {
        targetURL: "",
        specialParameters: this.specialParameters,
      };
    }

    // Extract raw query string from path (preserving original encoding)
    if (this.path.includes("?")) {
      this.rawQueryString = this.path.split("?")[1];
    }

    // Extract ch-* parameter values using regex (decode for actual use)
    const chCode = this.extractParamValue("ch-code");
    const chID = this.extractParamValue("ch-id");
    const chIDSignature = this.extractParamValue("ch-id-signature");
    const chPublicKey = this.extractParamValue("ch-public-key");
    const chRequested = this.extractParamValue("ch-requested");

    // Set special parameters (with validation)
    this.specialParameters.chCode = this.sanitizeParam(chCode);
    this.specialParameters.chID = this.sanitizeParam(chID);
    this.specialParameters.chIDSignature = this.sanitizeParam(chIDSignature);
    this.specialParameters.chPublicKey = this.sanitizeParam(chPublicKey);
    this.specialParameters.chRequested = this.sanitizeParam(chRequested);

    // Remove ch-* params from query string while preserving everything else
    const processedQueryString = this.removeChParams(this.rawQueryString);

    // Extract path without query string
    const cleanPath = this.path.split("?")[0];

    // Construct targetURL
    if (processedQueryString) {
      this.targetURL = encodeURIComponent(
        `https://${this.host}${cleanPath}?${processedQueryString}`
      );
    } else {
      this.targetURL = encodeURIComponent(`https://${this.host}${cleanPath}`);
    }

    return {
      targetURL: this.targetURL,
      specialParameters: this.specialParameters,
    };
  }

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
  private extractParamValue(paramName: string): string {
    if (!this.rawQueryString) return "";

    // Match the parameter in the query string
    const regex = new RegExp(`(?:^|&)${paramName}=([^&]*)`, "i");
    const match = this.rawQueryString.match(regex);

    if (match && match[1]) {
      const normalized = match[1].replace(/\+/g, "%20");
      try {
        return decodeURIComponent(normalized);
      } catch {
        // Malformed percent-encoding. Still honour the `+` → space convention
        // on the fallback path so output stays consistent with URLSearchParams.
        return match[1].replace(/\+/g, " ");
      }
    }
    return "";
  }

  /**
   * Sanitize a parameter value - return empty string for unusable values.
   */
  private sanitizeParam(value: string): string {
    if (!value || value === "undefined" || value === "null") {
      return "";
    }
    return value;
  }

  /**
   * Remove ch-* parameters from the query string while preserving
   * the original encoding of all other parameters.
   */
  private removeChParams(queryString: string | undefined): string {
    if (!queryString) return "";

    // Split into individual params, filter out ch-* params, rejoin
    const params = queryString.split("&");
    const filteredParams = params.filter((param) => {
      const key = param.split("=")[0];
      return !CH_PARAM_KEYS.includes(key.toLowerCase());
    });

    return filteredParams.join("&");
  }
}
