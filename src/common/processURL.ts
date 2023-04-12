import { z } from "zod";
import qparse from "query-string";
import { QueryObject, RequestObject, SpecialParametersObject } from "./types";
import { logger } from "./logger";

export class ProcessURL {
  private host: string | undefined;
  private path: string | undefined;
  private queryString: z.infer<typeof QueryObject> | undefined;
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

    //Extract query string from this.path
    function extractQueryString(path: string) {
      let queryString: string | undefined;
      if (path.includes("?")) {
        queryString = path.split("?")[1];
      }
      return queryString;
    }

    function formatQueryString(q: string) {
      if (q) {
        return qparse.parse(q, { sort: false });
      }
    }

    let unprocessedQueryString: string | undefined;
    unprocessedQueryString = extractQueryString(this.path);

    if (unprocessedQueryString) {
      this.queryString = formatQueryString(unprocessedQueryString);
    }

    //Destructure special params from query string if they are present
    let {
      "ch-code": chCode,
      "ch-id": chID,
      "ch-id-signature": chIDSignature,
      "ch-public-key": chPublicKey,
      "ch-requested": chRequested,
    } = this.queryString || {};

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
    if (
      !chIDSignature ||
      chIDSignature === "undefined" ||
      chIDSignature === "null"
    ) {
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
    let processedQueryString = this.processQueryString(this.queryString);
    //URL encode the targetURL to be used later in redirects
    let targetURL;

    //We no longer need the query string in the path
    this.path = this.path.split("?")[0];

    if (processedQueryString) {
      //console.log(`targetURL has query string: ${this.queryString}`)
      this.targetURL = encodeURIComponent(
        `https://${this.host}${this.path}?${processedQueryString}`
      );
    } else {
      this.targetURL = encodeURIComponent(`https://${this.host}${this.path}`);
    }

    return {
      targetURL: this.targetURL,
      specialParameters: this.specialParameters,
    };
  }

  private processQueryString(
    queryString: z.infer<typeof QueryObject> | undefined
  ) {
    let processedQueryString: string | null | undefined;
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
      processedQueryString = qparse.stringify(queryString, { sort: false });
    } else {
      processedQueryString = "";
    }

    return processedQueryString;
  }
}
