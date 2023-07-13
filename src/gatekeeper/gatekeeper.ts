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
  GetTokenOptions,
  LocalStorageObject,
  LocalStorageOptions,
  ProcessURLResultObject,
} from "../common/types";
import { generateSignature } from "../common/hash";

export class Gatekeeper {
  public PublicClient;
  private readonly WAIT_URL: string = "https://wait.crowdhandler.com";
  private readonly STORAGE_NAME: string = "crowdhandler";
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
   * Retrieves a token based on the provided options or instance variables.
   * @param options - The options for retrieving the token.
   */
  public getToken(options?: z.infer<typeof GetTokenOptions>): void {
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
    } else if (localStorageValue && this.options.mode === "clientside") {
      logger(this.options.debug, "info", "localstorage found");
      this.getTokenFromLocalStorage();
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
   * Redirects the request to another URL if it is not promoted.
   *
   * @returns Redirection response or error message.
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

      const redirectUrl = `${this.WAIT_URL}/${slug}?url=${this.targetURL}&ch-code=&ch-id=${this.token}&ch-public-key=${this.publicKey}`;

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
        const [cookieName, ...cookieValueParts] = cookieStr.split("=");
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
  public generateCookie(tokens: any[]) {
    return {
      integration: "JSDK",
      tokens: tokens,
    };
  }

  /**
   * Set CrowdHandler session cookie.
   *
   * @param value - The value of the cookie to be set.
   *
   * @throws If an error occurs while setting the cookie, an Error is thrown and caught, logged with the logger,
   * and the function returns false.
   *
   * @returns True if the cookie was successfully set, false otherwise.
   */
  public setCookie(value: string): boolean {
    try {
      // Set the cookie with the provided value and options
      this.REQUEST.setCookie(value, {
        secure: true,
        sameSite: "strict",
        path: "/",
        domain: this.host,
      });
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
   * Send current page performance to CrowdHandler
   * @param options Options object containing HTTP Response code, Sample rate, Override elapsed time, and Response ID.
   * @throws If an error occurs while making the API request, an Error is thrown and caught, and then logged with the logger.
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
   * This method checks for a CrowdHandler cookie first,
   * falls back to local storage if the cookie doesn't exist,
   * and gets the session status for the request.
   *
   * It processes different cases based on the session status and the specific options set,
   * ultimately returning an object that contains the results of the validation process.
   *
   * @return {Promise<z.infer<typeof validateRequestObject>>} Result of the validation process.
   */
  private async validateRequestClientSideMode(): Promise<
    z.infer<typeof ValidateRequestObject>
  > {
    // Initial result object with default values
    const defaultResult: z.infer<typeof ValidateRequestObject> = {
      promoted: false,
      stripParams: false,
      setCookie: false,
      setLocalStorage: false,
      localStorageValue: "",
      responseID: "",
      slug: "",
      targetURL: "",
    };

    logger(this.options.debug, "info", `IP: ${this.ip}`);
    logger(this.options.debug, "info", `Agent: ${this.agent}`);
    logger(this.options.debug, "info", `Host: ${this.host}`);
    logger(this.options.debug, "info", `Path: ${this.path}`);
    logger(this.options.debug, "info", `Lang: ${this.lang}`);

    const result = { ...defaultResult };

    // If path matches the ignore pattern, bypass it and promote the result
    if (ignoredPatternsCheck(this.path, this.ignore)) {
      logger(this.options.debug, "info", `Ignored path: ${this.path}`);
      result.promoted = true;
      return result;
    }

    this.processURL();
    result.targetURL = this.targetURL || "";

    this.getCookie();

    if (!this.simpleCookieValue) {
      this.getLocalStorage();
    }

    this.findStorageKey();
    this.getToken();
    await this.getSessionStatus();

    const sessionStatusType = HttpErrorWrapper.safeParse(this.sessionStatus);

    if (
      sessionStatusType.success &&
      this.sessionStatus?.result.status !== 200
    ) {
      result.promoted = this.options.trustOnFail || false;
      result.slug = this.options.trustOnFail
        ? undefined
        : this.options.fallbackSlug || "";
      return result;
    }

    if (this.sessionStatus?.result.promoted === 0) {
      result.promoted = false;
      result.slug = this.sessionStatus.result.slug || "";
      this.token = this.sessionStatus.result.token || "";
      return result;
    } else if (this.sessionStatus?.result.promoted === 1) {
      result.promoted = true;
      result.setLocalStorage = true;

      if (this.sessionStatus.result.token) {
        this.updateLocalStorageToken(this.sessionStatus.result.token);
        if (this.localStorageValue) {
          result.localStorageValue =
            JSON.stringify(this.localStorageValue) || "";
        }
      }

      if (this.sessionStatus.result.responseID) {
        result.responseID = this.sessionStatus.result.responseID || "";
        this.responseID = this.sessionStatus.result.responseID || "";
      }

      if (this.specialParameters.chRequested) {
        result.stripParams = true;
      }
    }

    return result;
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
      this.getToken();
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
        const { promoted, slug, token, responseID } = this.sessionStatus.result;

        result.promoted = promoted === 1;
        result.setCookie = promoted === 1;
        result.slug = slug || result.slug;
        result.cookieValue =
          promoted === 1 && token ? token : result.cookieValue;
        result.responseID =
          promoted === 1 && responseID ? responseID : result.responseID;
        this.responseID = promoted === 1 && responseID ? responseID : "";
        this.token = token || this.token;

        if (promoted === 1 && this.specialParameters.chRequested) {
          result.stripParams = true;
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
      targetURL: "",
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

    this.getSignature({
      chIDSignature: this.specialParameters.chIDSignature,
      crowdhandlerCookieValue: this.cookieValue,
    });
    this.getToken();

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
            this.getToken({ chID: token });
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

          if (this.sessionStatus.result.hash) {
            hash = this.sessionStatus.result.hash;
            this.getSignature({ chIDSignature: hash });
          }

          if (this.sessionStatus.result.token) {
            token = this.sessionStatus.result.token;
            this.getToken({ chID: token });
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

          if (this.sessionStatus.result.hash) {
            hash = this.sessionStatus.result.hash;
            this.getSignature({ chIDSignature: hash });
          }

          if (this.sessionStatus.result.token) {
            token = this.sessionStatus.result.token;
            this.getToken({ chID: token });
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
      this.cookieValue = CookieObject.parse(this.cookieValue);

      if (this.cookieValue) {
        for (const item of this.cookieValue.tokens) {
          tokens.push(item);
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
      this.cookieValue = this.generateCookie(tokens);
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

    return result;
  }
}
