import { ConfigParse } from "./configParse";
import { ProcessURL } from "../common/processURL";
import { Signature } from "./signature";
import { GenerateCookieObject } from "./tokenObject";
import { logger } from "../common/logger";
import { getIP } from "../common/ipDiscover";
import { getLang } from "../common/languageDiscover";
import { getUserAgent } from "../common/userAgentDiscover";
import { Timer } from "../common/timer";
import { ignoredPatternsCheck } from "../common/ignoredPatternsCheck";
import "../common/types";
import { z } from "zod";
import {
  GatekeeperOptions,
  GatekeeperKeyPair,
  RoomMetaObject,
  CookieObject,
  SignatureObject,
  SpecialParametersObject,
  TokenObject,
  ValidateRequestObject,
  HttpErrorWrapper,
  SessionStatusWrapper,
  RecordPerformanceOptions,
  SignatureSourceObject,
  ExtractTokenOptions,
  LocalStorageObject,
  LocalStorageOptions,
  ProcessURLResultObject,
  RoomConfig,
} from "../common/types";
import { generateSignature } from "../common/hash";

export class Gatekeeper {
  public PublicClient;
  private WAIT_URL: string = "https://wait.crowdhandler.com";
  public readonly STORAGE_NAME: string;
  public readonly REQUEST: any;
  public inWaitingRoom: boolean = false;
  private ignore: RegExp =
    /^((?!.*\?).*(\.(avi|css|eot|gif|ico|jpg|jpeg|js|json|mov|mp4|mpeg|mpg|og[g|v]|pdf|png|svg|ttf|txt|wmv|woff|woff2|xml))$)/;
  private hashedPrivateKey!: string;
  private publicKey: string;
  private readonly privateKey: string | undefined;
  private options: any = {
    debug: false,
    fallbackSlug: "",
    mode: "full",
    timeout: 5000,
    trustOnFail: true,
  };
  public activeConfig!: z.infer<typeof RoomMetaObject>;
  public cookies: Array<string> = [];
  public cookieValue: z.infer<typeof CookieObject> | undefined;
  public simpleCookieValue: string | undefined;
  public localStorageValue:
    | z.infer<typeof LocalStorageObject>
    | null
    | undefined;
  public storageKey: string | undefined;
  //Signature can come in the form of a simple string or as an object /w meta data.
  private cookieSignatureObject: z.infer<typeof SignatureObject>[0] | undefined;
  private cookieTokenObject: z.infer<typeof TokenObject> | undefined;
  private signatureType: string | undefined;
  private simpleSignature: string[] = [];
  private complexSignature: z.infer<typeof SignatureObject> = [];
  public token!: string;
  public responseID: string | undefined;
  timer: Timer;
  public host!: string;
  public path!: string;
  public agent: string | undefined;
  public ip: string | undefined;
  public lang: string | undefined;
  public sessionStatus: z.infer<typeof SessionStatusWrapper> | undefined;
  private requested: string | undefined;
  private deployment: string | undefined;
  private specialParameters: z.infer<typeof SpecialParametersObject> = {
    chCode: "",
    chID: "",
    chIDSignature: "",
    chPublicKey: "",
    chRequested: "",
  };
  public targetURL: string | undefined;

  constructor(
    PublicClient: any,
    request: any,
    keyPair: z.infer<typeof GatekeeperKeyPair>,
    options: z.infer<typeof GatekeeperOptions>
  ) {
    this.PublicClient = PublicClient;
    this.REQUEST = request;
    this.publicKey = keyPair.publicKey;
    this.privateKey = keyPair.privateKey;
    //Merge provided options with defaults
    this.options = Object.assign({}, this.options, options);
    
    // Set cookie name from options or use default
    this.STORAGE_NAME = this.options.cookieName || "crowdhandler";

    //Hash the private key if mode is set to hybrid
    //Check if privateKey is provided when mode is set to "hybrid"
    if (
      this.options.mode === "hybrid" &&
      (this.privateKey === undefined || this.privateKey === "")
    ) {
      throw new Error(
        "privateKey must be provided when mode is set to 'hybrid'"
      );
    }

    if (this.options.mode === "hybrid" && this.privateKey !== undefined) {
      try {
        this.hashedPrivateKey = generateSignature(this.privateKey);
      } catch (error: any) {
        logger(
          this.options.debug,
          "Error generating private key hash: ",
          error
        );
      }
    }

    this.host = this.REQUEST.getHost();
    this.path = this.REQUEST.getPath();

    if (this.options.mode === "full" || this.options.mode === "hybrid") {
      this.ip = getIP(this.REQUEST);
      this.lang = getLang(this.REQUEST);
      this.agent = getUserAgent(this.REQUEST);
    }

    //Start the timer
    this.timer = new Timer();

    //If host is wait.crowdhandler.com, wait-dev.crowdhandler.com or path starts with /ch/ then we're in the waiting room
    if (this.host === "wait.crowdhandler.com" || this.path.startsWith("/ch/")) {
      this.inWaitingRoom = true;
    }
  }

  //Set the host using your own method if you're not happy with the default
  /**
   * Override the request host for testing or special routing needs.
   * 
   * @param {string} host - The host to use (e.g., 'example.com')
   */
  public overrideHost(host: string) {
    this.host = host;
  }

  //Set the path using your own method if you're not happy with the default
  public overridePath(path: string) {
    this.path = path;
  }

  //Set the IP using your own method if you're not happy with the default
  public overrideIP(ip: string) {
    this.ip = ip;
  }

  //Set the language using your own method if you're not happy with the default
  public overrideLang(lang: string) {
    this.lang = lang;
  }

  //Set the user agent using your own method if you're not happy with the default
  public overrideUserAgent(agent: string) {
    this.agent = agent;
  }

  //Set the cookie using your own method if you're not happy with the default
  public overrideCookie(cookie: Array<string>) {
    this.cookies = cookie;
  }

  /**
   * Overrides the default CrowdHandler waiting room with your custom URL.
   * 
   * @param {string} url - The custom waiting room URL
   * 
   * @example
   * // Redirect to your custom queue page
   * gatekeeper.overrideWaitingRoomUrl('https://mysite.com/custom-queue');
   */
  public overrideWaitingRoomUrl(url: string) {
    this.WAIT_URL = url;
  }

  /* If you have your own regular expression for urls to ignore set it here
   * @param string $regExp Regular Expression
   */
  public setIgnoreUrls(regExp: RegExp) {
    this.ignore = regExp;
  }

  /*
   * Fetch the room config feed
   * @return object
   */
  public async getConfig() {
    let response = await this.PublicClient.rooms().get();

    let configParse = new ConfigParse(
      response.result,
      this.host,
      this.path,
      this.ignore
    );

    let result = configParse.parse();
    this.activeConfig = RoomMetaObject.parse(result);
  }

  /**
   * Retrieves the current session status using GET call if a token is available, or POST call otherwise.
   * @returns {Promise<void>} A Promise that resolves when the method has completed.
   */
  public async getSessionStatus(): Promise<void> {
    const requestConfig = {
      agent: this.agent,
      ip: this.ip,
      lang: this.lang,
      url: `https://${this.host}${this.path}`,
    };

    if (this.token) {
      logger(
        this.options.debug,
        "info",
        "Token found, performing a session GET call."
      );
      try {
        this.sessionStatus = await this.PublicClient.requests().get(
          this.token,
          requestConfig
        );
      } catch (error: any) {
        logger(
          this.options.debug,
          "error",
          `Session GET call failed with error: ${error}`
        );
      }
    } else {
      logger(
        this.options.debug,
        "info",
        "Token not found, performing a session POST call."
      );
      try {
        this.sessionStatus = await this.PublicClient.requests().post(
          requestConfig
        );
      } catch (error: any) {
        logger(
          this.options.debug,
          "error",
          `Session POST call failed with error: ${error}`
        );
      }
    }
  }

  /**
   * Processes the URL from the request to extract the target URL and any special parameters.
   */
  public processURL(): void {
    try {
      const processURLInstance = new ProcessURL(this.REQUEST);
      const result: z.infer<typeof ProcessURLResultObject> =
        processURLInstance.parseURL();
      if (result) {
        this.targetURL = result.targetURL;
        this.specialParameters = result.specialParameters;
      } else {
        throw new Error("Failed to parse URL.");
      }
    } catch (error) {
      logger(
        this.options.debug,
        "error",
        `Error while processing URL: ${error}`
      );
    }
  }

  /**
   * Extracts the signature from the given signature source.
   * @param signatureSource - The source from which to extract the signature.
   */
  public getSignature(
    signatureSource: z.infer<typeof SignatureSourceObject>
  ): void {
    try {
      if (signatureSource.chIDSignature) {
        // Simple signature case
        this.simpleSignature = [signatureSource.chIDSignature];
        this.signatureType = "simple";
      } else if (signatureSource.crowdhandlerCookieValue) {
        // Complex signature case
        this.cookieValue = CookieObject.parse(
          signatureSource.crowdhandlerCookieValue
        );

        // Assuming that the last token's signatures are needed
        this.complexSignature =
          this.cookieValue.tokens[
            this.cookieValue.tokens.length - 1
          ].signatures;
        this.signatureType = "complex";
      }
    } catch (error: any) {
      logger(this.options.debug, "error", `Failed to get signature: ${error}`);
    }
  }

  /**
   * Extracts and sets the token from various sources (URL params, cookies, etc).
   * This is an internal method used during request validation.
   * @param options - The options for extracting the token.
   */
  private extractToken(options?: z.infer<typeof ExtractTokenOptions>): void {
    // Use option values if provided, else fall back to constructor values
    const chID = options?.chID ?? this.specialParameters.chID;
    const crowdhandlerCookieValue =
      options?.crowdhandlerCookieValue ?? this.cookieValue;
    const localStorageValue =
      options?.localStorageValue ?? this.localStorageValue;
    const simpleCookieValue =
      options?.simpleCookieValue ?? this.simpleCookieValue;

    if (chID) {
      logger(this.options.debug, "info", "chID parameter found");
      this.extractTokenFromChID(chID);
    } else if (crowdhandlerCookieValue && this.options.mode === "hybrid") {
      logger(this.options.debug, "info", "complex cookie found");
      this.extractTokenFromComplexCookie(crowdhandlerCookieValue);
    } else if (simpleCookieValue) {
      logger(this.options.debug, "info", "simple cookie found");
      this.extractTokenFromSimpleCookie(simpleCookieValue);
    } else {
      logger(this.options.debug, "info", "Token not found or invalid format");
    }
  }

  /**
   * Verifies if the given token is valid based on its format.
   * @param token - The token to be validated.
   * @returns True if the token is valid, false otherwise.
   */
  private isValidToken(token: string): boolean {
    const tokenPattern = /^tok.*/;
    return tokenPattern.test(token);
  }

  /**
   * Extracts and sets the token from the provided chID if it's valid.
   * @param chID - The chID to extract the token from.
   * @throws {Error} When the token format is invalid.
   */
  private extractTokenFromChID(chID: string): void {
    if (!this.isValidToken(chID)) {
      throw new Error(`Invalid token format: ${chID}`);
    }

    this.token = chID;
  }

  /**
   * Extracts and sets the token from a complex cookie value if it's valid.
   * @param crowdhandlerCookieValue - The crowdhandler cookie value to extract the token from.
   * @throws {Error} When the token format is invalid.
   */
  private extractTokenFromComplexCookie(
    crowdhandlerCookieValue: z.infer<typeof CookieObject>
  ): void {
    try {
      this.cookieValue = CookieObject.parse(crowdhandlerCookieValue);

      // Ensure tokens array is not empty
      if (this.cookieValue.tokens.length === 0) {
        throw new Error("No tokens found in the cookie value.");
      }

      const extractedToken =
        this.cookieValue.tokens[this.cookieValue.tokens.length - 1].token;

      if (!this.isValidToken(extractedToken)) {
        throw new Error(`Invalid token format: ${extractedToken}`);
      }

      this.token = extractedToken;
    } catch (error: any) {
      logger(
        this.options.debug,
        "error",
        `Failed to extract token from complex cookie: ${error}`
      );
    }
  }

  /**
   * Extracts and sets the token from a simple cookie value if it's valid.
   * @param simpleCookieValue - The simple cookie value to extract the token from.
   * @throws {Error} When the token format is invalid.
   */
  private extractTokenFromSimpleCookie(simpleCookieValue: string): void {
    try {
      if (!this.isValidToken(simpleCookieValue)) {
        throw new Error(`Invalid token format: ${simpleCookieValue}`);
      }

      this.token = simpleCookieValue;
    } catch (error: any) {
      logger(
        this.options.debug,
        "error",
        `Failed to extract token from simple cookie: ${error}`
      );
    }
  }

  /**
   * Determines whether to use the slug or the domain to store the token, setting the storageKey accordingly.
   */
  private findStorageKey(): void {
    let key: string | undefined;

    if (this.inWaitingRoom) {
      // Prioritise slug over domain if both are present.
      const isWhiteLabel = !this.host.startsWith("wait");

      const pathParts = this.path.split("/");

      if (isWhiteLabel) {
        // Extracts 1CB20oWp8dbA from format /ch/1CB20oWp8dbA?foo=bar
        key = pathParts[2].split("?")[0];
      } else {
        // Extracts 1CB20oWp8dbA from format /1CB20oWp8dbA?foo=bar
        key = pathParts[1].split("?")[0];
      }

      // If we still don't have a key, try to get it from the url parameter.
      // This will be the case if we're in the waiting room and the slug is not present.
      if (!key) {
        const params = new URLSearchParams(this.path.split("?")[1]);
        key = params.get("url") || undefined;
      }
    } else {
      // If we're not in the waiting room, we can just use the domain as the key.
      key = this.host;
    }

    this.storageKey = key;
  }

  /**
   * Retrieves the token from local storage if possible.
   * @throws {Error} When the storage key or local storage value is undefined.
   */
  public getTokenFromLocalStorage(): void {
    try {
      if (!this.storageKey) {
        throw new Error("Storage key is not defined.");
      }

      if (!this.localStorageValue || !this.localStorageValue.token) {
        throw new Error(
          "Local storage value is not defined or does not contain a token."
        );
      }

      const token = this.localStorageValue.token[this.storageKey];

      if (!this.isValidToken(token)) {
        throw new Error(`Invalid token format: ${token}`);
      }

      this.token = token;
    } catch (error: any) {
      logger(
        this.options.debug,
        "error",
        `Failed to get token from local storage: ${error}`
      );
    }
  }

  /**
   * Validates the signature.
   *
   * @returns the result of signature validation
   */
  public validateSignature(): ReturnType<Signature["validateSignature"]> {
    const signature = new Signature(
      this.activeConfig,
      this.hashedPrivateKey,
      this.signatureType,
      this.simpleSignature,
      this.complexSignature,
      this.token,
      this.cookieValue,
      this.requested,
      this.specialParameters,
      this.options.debug
    );

    return signature.validateSignature();
  }

  /**
   * Convenience method that handles the complete redirect flow for non-promoted users.
   * Automatically manages cookies and redirects.
   * 
   * @returns {string} Success message after redirect
   * @throws {Error} If unable to determine redirect URL
   * 
   * @example
   * if (!result.promoted) {
   *   return gatekeeper.redirectIfNotPromoted();
   * }
   */
  public redirectIfNotPromoted(): string {
    try {
      const redirectUrl = this.getRedirectUrl();

      if (!redirectUrl) {
        throw new Error("Unable to determine redirect URL");
      }

      return this.REQUEST.redirect(redirectUrl);
    } catch (error: any) {
      logger(this.options.debug, "error", `Failed to redirect: ${error}`);
      return `Redirect failed: ${error.message}`;
    }
  }

  /**
   * Redirects the request to the decoded target URL.
   *
   * @param targetURL The target URL to redirect to.
   * @throws {Error} If decoding or redirecting fails.
   */
  /**
   * Removes CrowdHandler tracking parameters from URLs. Use when result.stripParams is true
   * to keep URLs clean.
   * 
   * @param {string} targetURL - The encoded URL to clean and redirect to (from result.targetURL)
   * @throws {Error} If the decoded URL is not a valid HTTP(S) URL
   * 
   * @example
   * if (result.stripParams) {
   *   return gatekeeper.redirectToCleanUrl(result.targetURL);
   * }
   */
  public redirectToCleanUrl(targetURL: string): void {
    try {
      const decodedUrl = decodeURIComponent(targetURL);

      // If decodedUrl is not a valid URL, throw an error.
      if (!/^http[s]?:\/\/.*/.test(decodedUrl)) {
        throw new Error("Decoded URL is not a valid URL");
      }

      this.REQUEST.redirect(decodedUrl);
    } catch (error: any) {
      logger(
        this.options.debug,
        "error",
        `Failed to redirect to clean URL: ${error}`
      );
      throw error;
    }
  }

  /**
   * Generates a redirect URL based on multiple fallback conditions.
   *
   * @throws {Error} If targetURL, token, or publicKey is missing or invalid.
   * @returns The generated redirect URL.
   */
  public getRedirectUrl(): string {
    try {
      const slug =
        this.sessionStatus?.result?.slug ||
        this.activeConfig?.slug ||
        this.options.fallbackSlug ||
        "";

      logger(this.options.debug, "info", `Generating redirect URL with slug: ${slug}`);
      logger(this.options.debug, "info", `Target URL: ${this.targetURL}`);
      logger(this.options.debug, "info", `Token: ${this.token}`);
      logger(this.options.debug, "info", `Public Key: ${this.publicKey}`);

      const redirectUrl = `${this.WAIT_URL}/${slug}?url=${this.targetURL}&ch-code=&ch-id=${this.token}&ch-public-key=${this.publicKey}`;

      logger(this.options.debug, "info", `Generated redirect URL: ${redirectUrl}`);

      return redirectUrl;
    } catch (error: any) {
      logger(
        this.options.debug,
        "error",
        `Failed to generate redirect URL: ${error}`
      );
      throw error;
    }
  }

  /**
   * Generates token and signature objects for cookies.
   *
   * @throws {Error} If token generation fails.
   */
  private generateCookieObjects(): void {
    try {
      const tokenDatestamp = new Date().getTime();
      let signatureGenerated: string = "";

      // Prioritise API response data over parameter data.
      signatureGenerated = this.requested || this.specialParameters.chRequested;

      const cookieObject = new GenerateCookieObject({
        tokenDatestamp,
        tokenDatestampSignature: generateSignature(
          `${this.hashedPrivateKey}${tokenDatestamp}`
        ),
        tokenSignature: this.simpleSignature[0],
        tokenSignatureGenerated: signatureGenerated,
        tokenSignatures: this.complexSignature,
        tokenValue: this.token,
      });

      this.cookieSignatureObject = cookieObject.signatureObject();
      this.cookieTokenObject = cookieObject.tokenObject();
    } catch (error: any) {
      logger(
        this.options.debug,
        "error",
        `Failed to generate cookie objects: ${error}`
      );
      throw error;
    }
  }

  // //TODO: Convert to an independent class for full local storage functionality
  // /**
  //  * Updates the token in the local storage object.
  //  * If no local storage object exists, creates a new one.
  //  * @param token - The new token to update in local storage.
  //  */
  public updateLocalStorageToken(token: string): void {
    try {
      if (this.localStorageValue && this.storageKey) {
        // Update the existing LocalStorageObject token field.
        this.localStorageValue.token[this.storageKey] = token;
      } else if (this.storageKey) {
        // Create a new LocalStorageObject if it doesn't exist.
        this.localStorageValue = {
          countdown: {},
          positions: {},
          token: { [this.storageKey]: token },
        };
      }
    } catch (error) {
      logger(
        this.options.debug,
        "error",
        `Failed to update local storage token: ${error}`
      );
    }
  }

  /**
   * Retrieves and processes cookies from request or override.
   */
  private getCookie(): void {
    try {
      // Get cookies from request or override.
      const cookies =
        this.cookies.length === 0 ? this.REQUEST.getCookies() : this.cookies;

      // If no cookies, there is no further processing needed.
      if (!cookies) {
        logger(this.options.debug, "info", "No cookies found.");
        return;
      }

      // Split the cookies string into individual cookie strings.
      const cookieArray = cookies.split(";");

      for (const cookieStr of cookieArray) {
        const [cookieName, ...cookieValueParts] = cookieStr.trim().split("=");
        const cookieValue = cookieValueParts.join("=");

        // If this is the cookie we're interested in, process it.
        if (cookieName === this.STORAGE_NAME) {
          if (this.options.mode === "hybrid") {
            let decodedCookie = decodeURIComponent(cookieValue);
            let processedCookie: z.infer<typeof CookieObject> | undefined =
              JSON.parse(decodedCookie);
            this.cookieValue = processedCookie;
          } else {
            this.simpleCookieValue = cookieValue;
          }
        }
      }
    } catch (error: any) {
      logger(
        this.options.debug,
        "error",
        `Failed to get or process cookies: ${error}`
      );
    }
  }

  //TODO: Improve this method alongside refactor of validateRequestHybridMode
  public generateCookie(tokens: any[], deployment?: string) {
    return {
      integration: "JSDK",
      tokens: tokens,
      deployment: deployment || "",
    };
  }

  /**
   * Sets the CrowdHandler session cookie. Always call this when result.setCookie is true
   * to maintain the user's queue position.
   * 
   * @param {string} value - The cookie value to set (from result.cookieValue)
   * @returns {boolean} True if the cookie was successfully set, false otherwise
   * 
   * @example
   * if (result.setCookie) {
   *   gatekeeper.setCookie(result.cookieValue);
   * }
   */
  public setCookie(value: string): boolean {
    try {
      // Set the cookie with the provided value and options
      this.REQUEST.setCookie(value, this.STORAGE_NAME);
      return true;
    } catch (error: any) {
      logger(this.options.debug, "error", error);
      return false;
    }
  }

  /**
   * Set a local storage item.
   *
   * @param options - Optional. An object containing the storage name and the local storage value.
   *
   * @throws If an error occurs while setting the local storage item, an Error is thrown and caught, logged with the logger,
   * and the function returns false.
   *
   * @returns True if the local storage item was successfully set, false otherwise.
   */
  public setLocalStorage(
    options?: z.infer<typeof LocalStorageOptions>
  ): boolean {
    try {
      // determine the name to use
      const nameToUse = options?.storageName || this.STORAGE_NAME;

      // determine the value to use
      const valueToUse =
        options?.localStorageValue || JSON.stringify(this.localStorageValue);

      // set the local storage item
      this.REQUEST.setLocalStorageItem(nameToUse, valueToUse);

      return true;
    } catch (error: any) {
      logger(this.options.debug, "error", error);
      return false;
    }
  }

  /**
   * Get a local storage item.
   *
   * @throws If an error occurs while getting or parsing the local storage item,
   * an Error is thrown and caught, logged with the logger, and the function returns null.
   *
   * @returns The value from local storage parsed as a LocalStorageObject, or null if an error occurs or if the item does not exist.
   */
  public getLocalStorage(): z.infer<typeof LocalStorageObject> | null {
    try {
      const crowdhandler = localStorage.getItem(this.STORAGE_NAME);
      if (crowdhandler) {
        const localStorageValue = LocalStorageObject.parse(
          JSON.parse(crowdhandler)
        );
        this.localStorageValue = localStorageValue; // still assign it to the class property if you need
        return localStorageValue;
      }

      logger(
        this.options.debug,
        "Info: No data found in local storage for key:",
        this.STORAGE_NAME
      );
      return null;
    } catch (error: any) {
      logger(this.options.debug, "Error reading from local storage:", error);
      return null;
    }
  }

  /**
   * Records performance metrics to help CrowdHandler optimize queue flow and capacity.
   * 
   * @param {RecordPerformanceOptions} options - Optional performance recording options:
   * - `sample` {number} - Sample rate (0-1). Default: 0.2 (20% of requests)
   * - `statusCode` {number} - HTTP status code. Default: 200
   * - `overrideElapsed` {number} - Override elapsed time in ms
   * - `responseID` {string} - Specific response ID to record
   * 
   * @example
   * // Simple usage (recommended)
   * await gatekeeper.recordPerformance();
   * 
   * @example
   * // With custom options
   * await gatekeeper.recordPerformance({
   *   sample: 0.2,  // Sample 20% of requests
   *   statusCode: 200
   * });
   */
  public async recordPerformance(
    options?: z.infer<typeof RecordPerformanceOptions>
  ) {
    try {
      // Parse and validate options if provided, else use default values
      const validatedOptions = options
        ? RecordPerformanceOptions.parse(options)
        : {
            statusCode: 200, // default HTTP response code
            sample: 0.2, // default sample rate
            overrideElapsed: undefined, // no elapsed time override
            responseID: undefined, // no responseID
          };

      const { statusCode, sample, overrideElapsed, responseID } =
        validatedOptions;

      // Generate a random number for sampling
      const lottery = Math.random();
      const currentResponseID = responseID || this.responseID;

      // If there's no responseID or if the random number is higher than the sample rate, return early
      if (!currentResponseID || lottery >= sample) {
        return;
      }

      const elapsed =
        overrideElapsed !== undefined ? overrideElapsed : this.timer.elapsed();

      // Asynchronously send the performance data to CrowdHandler, no need to await the promise
      this.PublicClient.responses().put(currentResponseID, {
        httpCode: statusCode,
        time: elapsed,
      });
    } catch (error: any) {
      logger(this.options.debug, "Error recording performance:", error);
    }
  }

  /**
   * Extracts the creation date from a token's base60 encoded timestamp
   */
  private tokenCreationDate(token: string): number {
    const base60 = "0123456789ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz";
    const tok_meta = token.slice(4, 10);
    
    const year = base60.indexOf(tok_meta[0]);
    const month = base60.indexOf(tok_meta[1]) - 1;
    const day = base60.indexOf(tok_meta[2]);
    const hour = base60.indexOf(tok_meta[3]);
    const minute = base60.indexOf(tok_meta[4]);
    const second = base60.indexOf(tok_meta[5]);
    
    return Date.UTC(2000 + year, month, day, hour, minute, second);
  }

  /**
   * Checks if a token is older than 12 hours
   */
  private isOldToken(token?: string): boolean {
    logger(this.options.debug, "info", `[Lite Validator] Checking token age for: ${token}`);
    
    if (!token || !token.startsWith("tok")) {
      logger(this.options.debug, "info", "[Lite Validator] Token not in a format that we can timestamp.");
      return false;
    }

    // Only handle tok0 format tokens
    if (!token.startsWith("tok0")) {
      logger(this.options.debug, "info", `[Lite Validator] Token format '${token.substring(0,4)}' not supported for age checking`);
      return false;
    }

    const dateStampUTC = new Date().getTime();
    const tokenCreated = this.tokenCreationDate(token);
    const tokenCreatedDate = new Date(tokenCreated);
    const differenceInHours = (dateStampUTC - tokenCreated) / (1000 * 60 * 60);

    logger(this.options.debug, "info", `[Lite Validator] Token created: ${tokenCreatedDate.toISOString()}, Age: ${differenceInHours.toFixed(2)} hours`);

    if (differenceInHours > 12) {
      logger(this.options.debug, "info", "[Lite Validator] Token is older than 12 hours - will trigger redirect");
      return true;
    }

    logger(this.options.debug, "info", "[Lite Validator] Token is fresh (< 12 hours old)");
    return false;
  }

  /**
   * Checks if the current request matches any configured room patterns
   * Rooms are pre-ordered by precedence (regex → contains → all)
   * First match wins
   */
  private matchRoomConfig(): { status: boolean; room?: any } {
    const roomMeta = {
      domain: null,
      patternType: null,
      queueActivatesOn: null,
      slug: null,
      status: false,
      timeout: null,
    };

    if (!this.options.roomsConfig || this.options.roomsConfig.length === 0) {
      logger(this.options.debug, "info", "[Lite Validator] No rooms config provided or empty array");
      return roomMeta;
    }

    const host = this.host;
    // Note: this.path already includes query string from all REQUEST handlers
    const path = this.path;
    const fullDomain = `https://${host}`;
    
    logger(this.options.debug, "info", `[Lite Validator] Checking rooms for domain: ${fullDomain}, path: ${path}`);
    logger(this.options.debug, "info", `[Lite Validator] Total rooms in config: ${this.options.roomsConfig.length}`);
    
    // Filter rooms by domain
    const filteredResults = this.options.roomsConfig.filter((item: z.infer<typeof RoomConfig>) => {
      const matches = item.domain === fullDomain;
      if (matches) {
        logger(this.options.debug, "info", `[Lite Validator] Domain match found: ${item.slug}`);
      }
      return matches;
    });

    logger(this.options.debug, "info", `[Lite Validator] Rooms matching domain: ${filteredResults.length}`);

    // Find first match - rooms are pre-ordered by precedence
    for (const item of filteredResults) {
      logger(this.options.debug, "info", `[Lite Validator] Testing room '${item.slug}' with pattern '${item.urlPattern}' (type: ${item.patternType})`);
      
      if (this.patternCheck(item, path) === true) {
        logger(this.options.debug, "info", `[Lite Validator] MATCH FOUND: Room '${item.slug}' matches current path`);
        
        // First match is the best match
        roomMeta.domain = item.domain;
        roomMeta.patternType = item.patternType;
        roomMeta.queueActivatesOn = item.queueActivatesOn;
        roomMeta.slug = item.slug;
        roomMeta.status = true;
        roomMeta.timeout = item.timeout;
        break; // Stop at first match
      }
    }

    if (!roomMeta.status) {
      logger(this.options.debug, "info", "[Lite Validator] No matching room found for current path");
    }

    return roomMeta;
  }

  /**
   * Pattern checking logic - matches reference implementation
   */
  private patternCheck(item: any, path: string): boolean {
    switch (item.patternType) {
      case "regex":
        if (!item.urlPattern) return false;
        const regex = new RegExp(item.urlPattern);
        return regex.test(path);

      case "contains":
        if (!item.urlPattern) return false;
        return path.includes(item.urlPattern);

      case "all":
        return true;

      default:
        return false;
    }
  }

  /**
   * Determines if the request should be redirected to the lite validator
   */
  private shouldRedirectToLiteValidator(): { redirect: boolean; url?: string } {
    logger(this.options.debug, "info", "[Lite Validator] === Starting lite validator check ===");
    logger(this.options.debug, "info", `[Lite Validator] Lite validator enabled: ${this.options.liteValidator}`);
    logger(this.options.debug, "info", `[Lite Validator] Rooms config provided: ${!!this.options.roomsConfig}`);
    logger(this.options.debug, "info", `[Lite Validator] Current token: ${this.token || 'NO TOKEN'}`);
    
    if (!this.options.liteValidator || !this.options.roomsConfig) {
      logger(this.options.debug, "info", "[Lite Validator] Lite validator disabled or no rooms config - skipping");
      return { redirect: false };
    }

    // Check if current path matches any protected room
    const roomMatch = this.matchRoomConfig();
    if (!roomMatch.status) {
      logger(this.options.debug, "info", "[Lite Validator] No room match - skipping lite validator");
      return { redirect: false };
    }

    logger(this.options.debug, "info", `[Lite Validator] Room matched: ${(roomMatch as any).slug || 'match found'}`);

    // Check if token is missing or old
    const tokenMissing = !this.token;
    const tokenIsOld = this.token ? this.isOldToken(this.token) : false;
    
    logger(this.options.debug, "info", `[Lite Validator] Token missing: ${tokenMissing}, Token old: ${tokenIsOld}`);
    
    if (tokenMissing || tokenIsOld) {
      const redirectUrl = this.buildLiteValidatorUrl();
      logger(this.options.debug, "info", `[Lite Validator] REDIRECT REQUIRED to: ${redirectUrl}`);
      return { redirect: true, url: redirectUrl };
    }

    logger(this.options.debug, "info", "[Lite Validator] Token is valid - no redirect needed");
    return { redirect: false };
  }

  /**
   * Builds the lite validator redirect URL
   */
  private buildLiteValidatorUrl(): string {
    const apiUrl = (this.PublicClient as any).apiUrl || 'https://api.crowdhandler.com';
    const baseUrl = `${apiUrl}/v1/redirect/requests`;
    // targetURL is already encoded by ProcessURL
    const targetUrl = this.targetURL || '';
    const code = this.specialParameters.chCode || '';
    
    const params = `ch-public-key=${this.publicKey}&url=${targetUrl}&ch-code=${code}`;
    
    return this.token 
      ? `${baseUrl}/${this.token}?${params}`
      : `${baseUrl}?${params}`;
  }

  /**
   * The primary method for validating requests against CrowdHandler's queue system.
   * Determines whether a user should be granted access to your protected resource or sent to a waiting room.
   * 
   * @returns {Promise<ValidateRequestObject>} Instructions on how to handle the request:
   * - `promoted` {boolean} - true = grant access, false = send to waiting room
   * - `setCookie` {boolean} - true = update the user's session cookie
   * - `cookieValue` {string} - The session token to store in the cookie
   * - `stripParams` {boolean} - true = remove CrowdHandler URL parameters
   * - `targetURL` {string} - Where to redirect (clean URL or waiting room)
   * - `slug` {string} - The waiting room slug (when not promoted)
   * - `responseID` {string} - Response ID for performance tracking (when promoted)
   * - `deployment` {string} - Deployment identifier from the API
   * - `token` {string} - The session token
   * - `hash` {string | null} - Signature hash for validation (when available)
   * - `liteValidatorRedirect` {boolean} - Whether to redirect for lite validation
   * - `liteValidatorUrl` {string} - URL for lite validator redirect
   * 
   * @example
   * const result = await gatekeeper.validateRequest();
   * if (!result.promoted) {
   *   return gatekeeper.redirectIfNotPromoted();
   * }
   * 
   * @throws {CrowdHandlerError} When API connection fails (check error.code === 'API_CONNECTION_FAILED')
   */
  public async validateRequest() {
    switch (this.options.mode) {
      case "hybrid":
        return await this.validateRequestHybridMode();
        break;
      case "full":
        return await this.validateRequestFullMode();
        break;
      case "clientside":
        return await this.validateRequestClientSideMode();
        break;
      default:
        "full";
        break;
    }
  }

  /**
   * Validate request in a client-side mode.
   *
   * This method checks for a CrowdHandler cookie and gets the session status for the request.
   * It works the same as full mode but runs in browser environments.
   *
   * @return {Promise<z.infer<typeof validateRequestObject>>} Result of the validation process.
   */
  private async validateRequestClientSideMode(): Promise<
    z.infer<typeof ValidateRequestObject>
  > {
    // Initial result object with default values
    let result: z.infer<typeof ValidateRequestObject> = {
      promoted: false,
      stripParams: false,
      setCookie: false,
      setLocalStorage: false,
      cookieValue: "",
      responseID: "",
      slug: "",
      targetURL: "",
      deployment: "",
      hash: null,
      token: "",
    };

    try {
      // Log details for debugging
      logger(this.options.debug, "info", `IP: ${this.ip}`);
      logger(this.options.debug, "info", `Agent: ${this.agent}`);
      logger(this.options.debug, "info", `Host: ${this.host}`);
      logger(this.options.debug, "info", `Path: ${this.path}`);
      logger(this.options.debug, "info", `Lang: ${this.lang}`);

      // Skip paths that match the ignore pattern
      if (ignoredPatternsCheck(this.path, this.ignore)) {
        logger(this.options.debug, "info", `Ignored path: ${this.path}`);
        result.promoted = true;
        return result;
      }

      this.processURL();
      result.targetURL = this.targetURL || "";
      this.getCookie();
      this.extractToken();
      
      // Lite validator check - EARLY EXIT
      logger(this.options.debug, "info", "[Lite Validator] Performing lite validator check in validateRequestClientSideMode");
      const liteCheck = this.shouldRedirectToLiteValidator();
      if (liteCheck.redirect) {
        logger(this.options.debug, "info", "[Lite Validator] Lite validator redirect triggered in clientside mode");
        result.liteValidatorRedirect = true;
        result.liteValidatorUrl = liteCheck.url;
        result.promoted = false;
        return result;
      }
      logger(this.options.debug, "info", "[Lite Validator] Continuing with normal validation")
      
      await this.getSessionStatus();

      // Use zod safeparse to check that we're working with the SessionStatusErrorWrapper type
      let sessionStatusType = HttpErrorWrapper.safeParse(this.sessionStatus);

      // Handle session status errors
      if (sessionStatusType.success) {
        if (this.sessionStatus?.result.status !== 200) {
          // Can't process the request but we can trust it if trustOnFail is set to true
          result.promoted = this.options.trustOnFail;
          if (!this.options.trustOnFail)
            result.slug = this.options.fallbackSlug;

          return result;
        }
      }

      // Processing based on promotion status
      if (this.sessionStatus) {
        const { promoted, slug, token, responseID, deployment, hash } = this.sessionStatus.result;

        result.promoted = promoted === 1;
        result.slug = slug || result.slug;
        this.token = token || this.token;
        result.token = token || result.token;
        result.deployment = deployment || result.deployment;
        result.hash = hash || null;
        
        // Always set cookie if we have a token (for both promoted and non-promoted users)
        if (token) {
          result.setCookie = true;
          result.cookieValue = token;
        }
        
        if (promoted === 1) {
          result.responseID = responseID || result.responseID;
          this.responseID = responseID || "";
          
          if (this.specialParameters.chRequested) {
            result.stripParams = true;
          }
        }
      }

      return result;
    } catch (error) {
      logger(
        this.options.debug,
        "error",
        `An error occurred during request validation: ${error}`
      );
      throw error;
    }
  }

  /**
   * Validates the request by making full use of CrowdHandler API.
   * It handles the request and sets the necessary response based on the session status and API response.
   * @return {Promise<z.infer<typeof ValidateRequestObject>>} - The resulting status after validating the request.
   */
  private async validateRequestFullMode(): Promise<
    z.infer<typeof ValidateRequestObject>
  > {
    // Default result object
    let result: z.infer<typeof ValidateRequestObject> = {
      promoted: false,
      stripParams: false,
      setCookie: false,
      setLocalStorage: false,
      cookieValue: "",
      responseID: "",
      slug: "",
      targetURL: "",
      deployment: "",
      hash: null,
      token: "",
    };

    try {
      // Log details for debugging
      logger(this.options.debug, "info", `IP: ${this.ip}`);
      logger(this.options.debug, "info", `Agent: ${this.agent}`);
      logger(this.options.debug, "info", `Host: ${this.host}`);
      logger(this.options.debug, "info", `Path: ${this.path}`);
      logger(this.options.debug, "info", `Lang: ${this.lang}`);

      // Skip paths that match the ignore pattern
      if (ignoredPatternsCheck(this.path, this.ignore)) {
        logger(this.options.debug, "info", `Ignored path: ${this.path}`);
        result.promoted = true;
        return result;
      }

      this.processURL();
      result.targetURL = this.targetURL;
      this.getCookie();
      this.extractToken();
      
      // Lite validator check - EARLY EXIT
      logger(this.options.debug, "info", "[Lite Validator] Performing lite validator check in validateRequestClientSideMode");
      const liteCheck = this.shouldRedirectToLiteValidator();
      if (liteCheck.redirect) {
        logger(this.options.debug, "info", "[Lite Validator] Lite validator redirect triggered in clientside mode");
        result.liteValidatorRedirect = true;
        result.liteValidatorUrl = liteCheck.url;
        result.promoted = false;
        return result;
      }
      logger(this.options.debug, "info", "[Lite Validator] Continuing with normal validation")
      
      await this.getSessionStatus();

      // Use zod safeparse to check that we're working with the SessionStatusErrorWrapper type
      let sessionStatusType = HttpErrorWrapper.safeParse(this.sessionStatus);

      // Handle session status errors
      if (sessionStatusType.success) {
        if (this.sessionStatus?.result.status !== 200) {
          // Can't process the request but we can trust it if trustOnFail is set to true
          result.promoted = this.options.trustOnFail;
          if (!this.options.trustOnFail)
            result.slug = this.options.fallbackSlug;

          return result;
        }
      }

      // Processing based on promotion status
      if (this.sessionStatus) {
        const { promoted, slug, token, responseID, deployment, hash } = this.sessionStatus.result;

        result.promoted = promoted === 1;
        result.slug = slug || result.slug;
        this.token = token || this.token;
        result.token = token || result.token;
        result.deployment = deployment || result.deployment;
        result.hash = hash || null;
        
        // Always set cookie if we have a token (for both promoted and non-promoted users)
        if (token) {
          result.setCookie = true;
          result.cookieValue = token;
        }
        
        if (promoted === 1) {
          result.responseID = responseID || result.responseID;
          this.responseID = responseID || "";
          
          if (this.specialParameters.chRequested) {
            result.stripParams = true;
          }
        }
      }

      return result;
    } catch (error) {
      logger(
        this.options.debug,
        "error",
        `An error occurred during request validation: ${error}`
      );
      throw error;
    }
  }

  //TODO: This method is a complex beast and needs refactoring
  /**
   * Validate request using signature and/or Crowdhandler API when required
   */
  private async validateRequestHybridMode() {
    let signatures = [];
    let tokens = [];
    let freshToken;
    let freshSignature;
    let processedCookie;

    let result: z.infer<typeof ValidateRequestObject> = {
      promoted: false,
      stripParams: false,
      setCookie: false,
      setLocalStorage: false,
      cookieValue: "",
      responseID: "",
      slug: "",
      targetURL: "",
      deployment: "",
      hash: null,
      token: "",
    };

    logger(this.options.debug, "info", "IP: " + this.ip);
    logger(this.options.debug, "info", "Agent: " + this.agent);
    logger(this.options.debug, "info", "Host: " + this.host);
    logger(this.options.debug, "info", "Path: " + this.path);
    logger(this.options.debug, "info", "Lang: " + this.lang);

    //Bypass paths that match the ignore patterns
    if (ignoredPatternsCheck(this.path, this.ignore)) {
      logger(this.options.debug, "info", "Ignored path: " + this.path);
      result.promoted = true;
      return result;
    }

    this.processURL();
    result.targetURL = this.targetURL;

    this.getCookie();
    this.extractToken();
    
    // Lite validator check - EARLY EXIT
    const liteCheck = this.shouldRedirectToLiteValidator();
    if (liteCheck.redirect) {
      result.liteValidatorRedirect = true;
      result.liteValidatorUrl = liteCheck.url;
      result.promoted = false;
      return result;
    }

    await this.getConfig();

    //Use zod safeparse to check that we're working with the SessionStatusErrorWrapper type
    let configStatusType = HttpErrorWrapper.safeParse(this.activeConfig);

    if (configStatusType.success) {
      if (this.activeConfig && this.activeConfig.result.status !== 200) {
        //Can't process the request but we can trust it if trustOnFail is set to true
        if (this.options.trustOnFail) {
          result.promoted = true;
        } else {
          result.promoted = false;
          result.slug = this.options.fallbackSlug;
        }

        return result;
      }
    }

    //Working with a real config file from here
    if (this.activeConfig.status === false) {
      logger(
        this.options.debug,
        "info",
        "Config succesfully fetched but no check required."
      );
      result.promoted = true;
      return result;
    }

    //Attempt to retrieve crowdhandler cookie
    this.getCookie();

    logger(this.options.debug, "info", "Cookie: " + this.cookieValue);
    
    // Extract deployment from cookie if available
    if (this.cookieValue && this.cookieValue.deployment) {
      result.deployment = this.cookieValue.deployment;
    }

    this.getSignature({
      chIDSignature: this.specialParameters.chIDSignature,
      crowdhandlerCookieValue: this.cookieValue,
    });
    this.extractToken();

    logger(this.options.debug, "info", "Signature: " + this.simpleSignature);
    logger(
      this.options.debug,
      "info",
      "Complex Signature: " + this.complexSignature
    );
    logger(this.options.debug, "info", "Token: " + this.token);

    //If we don't have a signature or token force a check.
    if (
      (this.simpleSignature.length === 0 ||
        this.complexSignature.length === 0) &&
      !this.token
    ) {
      logger(
        this.options.debug,
        "info",
        "Missing signature and/or token, doing a check."
      );

      try {
        await this.getSessionStatus();

        //Handle a failed session status check
        //Use zod safeparse to check that we're working with the SessionStatusErrorWrapper type
        let sessionStatusType = HttpErrorWrapper.safeParse(this.sessionStatus);

        if (sessionStatusType.success) {
          if (this.sessionStatus && this.sessionStatus.result.status !== 200) {
            //Can't process the request but we can trust it if trustOnFail is set to true
            if (this.options.trustOnFail) {
              result.promoted = true;
            } else {
              result.promoted = false;
              result.slug = this.options.fallbackSlug;
            }

            return result;
          }
        }

        let token: string;
        if (this.sessionStatus && this.sessionStatus.result.promoted === 0) {
          if (this.sessionStatus.result.token) {
            token = this.sessionStatus.result.token;
            result.token = token;
            this.extractToken({ chID: token });
          }

          result.promoted = false;
          return result;
        } else if (
          this.sessionStatus &&
          this.sessionStatus.result.promoted === 1
        ) {
          result.promoted = true;
          result.setCookie = true;

          let hash: string;
          let requested: string;

          if (this.sessionStatus.result.requested) {
            this.requested = this.sessionStatus.result.requested;
          }

          if (this.sessionStatus.result.deployment) {
            this.deployment = this.sessionStatus.result.deployment;
            result.deployment = this.deployment;
          }

          if (this.sessionStatus.result.hash) {
            hash = this.sessionStatus.result.hash;
            result.hash = hash;
            this.getSignature({ chIDSignature: hash });
          }

          if (this.sessionStatus.result.token) {
            token = this.sessionStatus.result.token;
            result.token = token;
            this.extractToken({ chID: token });
          }
        }
      } catch (error: any) {
        logger(this.options.debug, "error", error);
      }
    }

    logger(
      this.options.debug,
      "info",
      "Signature and token found. Validating..."
    );

    let validationResult = this.validateSignature();

    //If the signature is not valid we need to check the user
    if (validationResult.success === false) {
      logger(
        this.options.debug,
        "info",
        "Signature not valid. Checking against API."
      );

      try {
        await this.getSessionStatus();

        //Handle a failed session status check
        //Use zod safeparse to check that we're working with the SessionStatusErrorWrapper type
        let sessionStatusType = HttpErrorWrapper.safeParse(this.sessionStatus);

        if (sessionStatusType.success) {
          if (this.sessionStatus && this.sessionStatus.result.status !== 200) {
            //Can't process the request but we can trust it if trustOnFail is set to true
            if (this.options.trustOnFail) {
              result.promoted = true;
            } else {
              result.promoted = false;
              result.slug = this.options.fallbackSlug;
            }

            return result;
          }
        }

        if (this.sessionStatus && this.sessionStatus.result.promoted === 0) {
          result.promoted = false;
          return result;
        } else if (
          this.sessionStatus &&
          this.sessionStatus.result.promoted === 1
        ) {
          let hash: string;
          let requested: string;
          let token: string;

          if (this.sessionStatus.result.requested) {
            this.requested = this.sessionStatus.result.requested;
          }

          if (this.sessionStatus.result.deployment) {
            this.deployment = this.sessionStatus.result.deployment;
            result.deployment = this.deployment;
          }

          if (this.sessionStatus.result.hash) {
            hash = this.sessionStatus.result.hash;
            result.hash = hash;
            this.getSignature({ chIDSignature: hash });
          }

          if (this.sessionStatus.result.token) {
            token = this.sessionStatus.result.token;
            result.token = token;
            this.extractToken({ chID: token });
          }
        }
      } catch (error: any) {
        logger(this.options.debug, "error", error);
      }
    }

    //part 2 here

    //We've established that we have a valid signature at this point
    logger(this.options.debug, "info", "Signature is valid.");

    try {
      // Only parse cookieValue if it exists
      if (this.cookieValue) {
        this.cookieValue = CookieObject.parse(this.cookieValue);

        if (this.cookieValue) {
          for (const item of this.cookieValue.tokens) {
            tokens.push(item);
          }
        }
      }
    } catch (error: any) {
      logger(this.options.debug, "error", error);
    }

    //Determine if we're working with a new token or a previously seen one
    if (
      (Array.isArray(tokens) && tokens.length === 0) ||
      (Array.isArray(tokens) && tokens[tokens.length - 1].token !== this.token)
    ) {
      freshToken = true;
    } else {
      freshToken = false;

      //We want to work with the most recent array of signatures
      for (const item of tokens[tokens.length - 1].signatures) {
        signatures.push(item);
      }
    }

    this.generateCookieObjects();

    if (
      this.signatureType === "simple" &&
      signatures.some((item) => item.sig === this.simpleSignature) === false
    ) {
      signatures.push(this.cookieSignatureObject);
      freshSignature = true;
    }

    if (freshToken) {
      //Reset the array. It's important we don't allow the PMUSER_CREDENTIALS variable exceed the byte limit.
      tokens = [];

      if (this.cookieTokenObject) {
        this.cookieTokenObject.signatures = signatures;
      }
      tokens.push(this.cookieTokenObject);
    } else {
      tokens[tokens.length - 1].signatures = signatures;
      tokens[tokens.length - 1].touched = this.cookieTokenObject?.touched;
      tokens[tokens.length - 1].touchedSig = this.cookieTokenObject?.touchedSig;
    }
    try {
      this.cookieValue = this.generateCookie(tokens, this.deployment);
    } catch (error: any) {
      logger(this.options.debug, "error", error);
      // Handle the error as appropriate for your application...
    }
    result.cookieValue = JSON.stringify(this.cookieValue);

    if (freshSignature && this.specialParameters.chRequested) {
      result.stripParams = true;
    }

    //If we made it all the way here, we can assume the user is promoted and a cookie should be set.
    result.promoted = true;
    result.setCookie = true;
    result.token = this.token;

    return result;
  }
}
