"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessURL = void 0;
var types_1 = require("./types");
var logger_1 = require("./logger");
var ProcessURL = /** @class */ (function () {
    function ProcessURL(request, debug) {
        if (debug === void 0) { debug = false; }
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
    ProcessURL.prototype.parseURL = function () {
        if (!this.host) {
            (0, logger_1.logger)(this.debug, "warn", "No host found in request object.");
            return {
                targetURL: "",
                specialParameters: this.specialParameters,
            };
        }
        if (!this.path) {
            (0, logger_1.logger)(this.debug, "warn", "No path found in request object.");
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
        var chCode = this.extractParamValue("ch-code");
        var chID = this.extractParamValue("ch-id");
        var chIDSignature = this.extractParamValue("ch-id-signature");
        var chPublicKey = this.extractParamValue("ch-public-key");
        var chRequested = this.extractParamValue("ch-requested");
        // Set special parameters (with validation)
        this.specialParameters.chCode = this.sanitizeParam(chCode);
        this.specialParameters.chID = this.sanitizeParam(chID);
        this.specialParameters.chIDSignature = this.sanitizeParam(chIDSignature);
        this.specialParameters.chPublicKey = this.sanitizeParam(chPublicKey);
        this.specialParameters.chRequested = this.sanitizeParam(chRequested);
        // Remove ch-* params from query string while preserving everything else
        var processedQueryString = this.removeChParams(this.rawQueryString);
        // Extract path without query string
        var cleanPath = this.path.split("?")[0];
        // Construct targetURL
        if (processedQueryString) {
            this.targetURL = encodeURIComponent("https://".concat(this.host).concat(cleanPath, "?").concat(processedQueryString));
        }
        else {
            this.targetURL = encodeURIComponent("https://".concat(this.host).concat(cleanPath));
        }
        return {
            targetURL: this.targetURL,
            specialParameters: this.specialParameters,
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
    ProcessURL.prototype.extractParamValue = function (paramName) {
        if (!this.rawQueryString)
            return "";
        // Match the parameter in the query string
        var regex = new RegExp("(?:^|&)".concat(paramName, "=([^&]*)"), "i");
        var match = this.rawQueryString.match(regex);
        if (match && match[1]) {
            var normalized = match[1].replace(/\+/g, "%20");
            try {
                return decodeURIComponent(normalized);
            }
            catch (_a) {
                // Malformed percent-encoding. Still honour the `+` → space convention
                // on the fallback path so output stays consistent with URLSearchParams.
                return match[1].replace(/\+/g, " ");
            }
        }
        return "";
    };
    /**
     * Sanitize a parameter value - return empty string for unusable values.
     */
    ProcessURL.prototype.sanitizeParam = function (value) {
        if (!value || value === "undefined" || value === "null") {
            return "";
        }
        return value;
    };
    /**
     * Remove ch-* parameters from the query string while preserving
     * the original encoding of all other parameters.
     */
    ProcessURL.prototype.removeChParams = function (queryString) {
        if (!queryString)
            return "";
        // Split into individual params, filter out ch-* params, rejoin
        var params = queryString.split("&");
        var filteredParams = params.filter(function (param) {
            var key = param.split("=")[0];
            return !types_1.CH_PARAM_KEYS.includes(key.toLowerCase());
        });
        return filteredParams.join("&");
    };
    return ProcessURL;
}());
exports.ProcessURL = ProcessURL;
