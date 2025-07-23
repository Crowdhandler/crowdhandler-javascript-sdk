"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessURL = void 0;
var query_string_1 = __importDefault(require("query-string"));
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
        //Extract query string from this.path
        function extractQueryString(path) {
            var queryString;
            if (path.includes("?")) {
                queryString = path.split("?")[1];
            }
            return queryString;
        }
        function formatQueryString(q) {
            if (q) {
                return query_string_1.default.parse(q, { sort: false });
            }
        }
        var unprocessedQueryString;
        unprocessedQueryString = extractQueryString(this.path);
        if (unprocessedQueryString) {
            this.queryString = formatQueryString(unprocessedQueryString);
        }
        //Destructure special params from query string if they are present
        var _a = this.queryString || {}, chCode = _a["ch-code"], chID = _a["ch-id"], chIDSignature = _a["ch-id-signature"], chPublicKey = _a["ch-public-key"], chRequested = _a["ch-requested"];
        //Override chCode value if the current one is unusable
        if (!chCode || chCode === "undefined" || chCode === "null") {
            chCode = "";
        }
        this.specialParameters.chCode = chCode;
        //Override chID value if the current one is unusable
        if (!chID || chID === "undefined" || chID === "null") {
            chID = "";
        }
        this.specialParameters.chID = chID;
        //Override chIDSignature value if the current one is unusable
        if (!chIDSignature ||
            chIDSignature === "undefined" ||
            chIDSignature === "null") {
            chIDSignature = "";
        }
        this.specialParameters.chIDSignature = chIDSignature;
        //Override chPublicKey value if the current one is unusable
        if (!chPublicKey || chPublicKey === "undefined" || chPublicKey === "null") {
            chPublicKey = "";
        }
        this.specialParameters.chPublicKey = chPublicKey;
        //Override chRequested value if the current one is unusable
        if (!chRequested || chRequested === "undefined" || chRequested === "null") {
            chRequested = "";
        }
        this.specialParameters.chRequested = chRequested;
        // Process the query string
        var processedQueryString = this.processQueryString(this.queryString);
        //URL encode the targetURL to be used later in redirects
        var targetURL;
        //We no longer need the query string in the path
        this.path = this.path.split("?")[0];
        if (processedQueryString) {
            this.targetURL = encodeURIComponent("https://".concat(this.host).concat(this.path, "?").concat(processedQueryString));
        }
        else {
            this.targetURL = encodeURIComponent("https://".concat(this.host).concat(this.path));
        }
        return {
            targetURL: this.targetURL,
            specialParameters: this.specialParameters,
        };
    };
    ProcessURL.prototype.processQueryString = function (queryString) {
        var processedQueryString;
        if (queryString) {
            delete queryString["ch-code"];
            delete queryString["ch-fresh"];
            delete queryString["ch-id"];
            delete queryString["ch-id-signature"];
            delete queryString["ch-public-key"];
            delete queryString["ch-requested"];
        }
        //Convert to usable querystring format
        if (queryString && Object.keys(queryString).length !== 0) {
            processedQueryString = query_string_1.default.stringify(queryString, { sort: false });
        }
        else {
            processedQueryString = "";
        }
        return processedQueryString;
    };
    return ProcessURL;
}());
exports.ProcessURL = ProcessURL;
