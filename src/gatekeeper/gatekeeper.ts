import { PublicClient } from "../client/public_client";
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
import { TypeOf, z } from "zod";
import {
  GatekeeperOptions,
  RequestObject,
  RoomMetaObject,
  CookieObject,
  SignatureObject,
  SpecialParametersObject,
  processURLResultObject,
  tokenObject,
  validateRequestObject,
  httpErrorWrapper,
  SessionStatusWrapper,
} from "../common/types";
import { generateSignature } from "../common/hash";
import { RequestContext } from "../request/requestContext";
import { Resource } from "../client/resource";

export class Gatekeeper {
  public PublicClient;
  private readonly WAIT_URL: string = "https://wait-dev.crowdhandler.com";
  private readonly COOKIE_NAME: string = "crowdhandler";
  public readonly REQUEST: any;
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
  public cookieValue: z.infer<typeof CookieObject> | undefined;
  public simpleCookieValue: string | undefined;
  //Signature can come in the form of a simple string or as an object /w meta data.
  private cookieSignatureObject: z.infer<typeof SignatureObject>[0] | undefined;
  private cookieTokenObject: z.infer<typeof tokenObject> | undefined;
  private signatureType: string | undefined;
  private simpleSignature: string[] = [];
  private complexSignature: z.infer<typeof SignatureObject> = [];
  public token!: string;
  public responseID: string | undefined;
  private tokenObject: any;
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
    publickey: string,
    privateKey: string,
    options: z.infer<typeof GatekeeperOptions>
  ) {
    this.PublicClient = PublicClient;
    this.REQUEST = request;
    this.publicKey = publickey;
    this.privateKey = privateKey;
    //Merge provided options with defaults
    this.options = Object.assign({}, this.options, options);

    console.log(this.options);

    //hash the private key
    this.hashedPrivateKey = generateSignature(privateKey);

    this.host = this.REQUEST.getHost();
    this.path = this.REQUEST.getPath();
    this.ip = getIP(this.REQUEST);
    this.lang = getLang(this.REQUEST);
    this.agent = getUserAgent(this.REQUEST);

    //Start the timer
    this.timer = new Timer();
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

  /* If you have your own regular expression for urls to ignore set it here
   * @param string $regExp Regular Expression
   */
  public setIgnoreUrls(regExp: RegExp) {
    this.ignore = regExp;
  }

  /*
   * Fetch the room config feed
   * Method options are static, cache or edgekv.
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

  public async getSessionStatus() {
    if (this.token) {
      logger(
        this.options.debug,
        "info",
        "Token found, performing a session GET call."
      );
      try {
        this.sessionStatus = await this.PublicClient.requests().get(
          this.token,
          {
            agent: this.agent,
            ip: this.ip,
            lang: this.lang,
            url: `https://${this.host}${this.path}`,
          }
        );
      } catch (error: any) {
        logger(this.options.debug, "error", "Session GET call Failed.");
        logger(this.options.debug, "error", error);
      }
    } else {
      logger(
        this.options.debug,
        "info",
        "Token not found, performing a session POST call."
      );
      try {
        this.sessionStatus = await this.PublicClient.requests().post({
          agent: this.agent,
          ip: this.ip,
          lang: this.lang,
          url: `https://${this.host}${this.path}`,
        });
      } catch (error: any) {
        logger(this.options.debug, "error", "Session POST call Failed.");
        logger(this.options.debug, "error", error);
      }
    }
  }

  public processURL() {
    let processURL = new ProcessURL(this.REQUEST);
    let result: z.infer<typeof processURLResultObject> = processURL.parseURL();
    this.targetURL = result.targetURL;
    this.specialParameters = result.specialParameters;
  }

  public getSignature(
    chIDSignature?: string,
    crowdhandlerCookieValue?: object
  ) {
    if (chIDSignature) {
      this.simpleSignature = [chIDSignature];
      this.signatureType = "simple";
    } else if (crowdhandlerCookieValue) {
      try {
        this.cookieValue = CookieObject.parse(crowdhandlerCookieValue);

        this.complexSignature =
          this.cookieValue.tokens[
            this.cookieValue.tokens.length - 1
          ].signatures;
        this.signatureType = "complex";
      } catch (error: any) {
        logger(this.options.debug, "error", error);
        return;
      }
    }
  }

  public getToken(chID?: string, crowdhandlerCookieValue?: object) {
    const tokenPattern = /^tok.*/; // modified regex pattern to match any string that starts with "tok"
    //Extract from ch-id query string parameter
    if (chID && tokenPattern.test(chID)) {
      this.token = chID;
      //Extract from complex cookie
    } else if (crowdhandlerCookieValue && this.options.mode === "hybrid") {
      try {
        this.cookieValue = CookieObject.parse(crowdhandlerCookieValue);
        const extractedToken =
          this.cookieValue.tokens[this.cookieValue.tokens.length - 1].token;
        if (tokenPattern.test(extractedToken)) {
          this.token = extractedToken;
        } else {
          throw new Error("Invalid token format");
        }
      } catch (error: any) {
        logger(this.options.debug, "error", error);
        return;
      }
      //Extract from simple cookie
    } else if (this.simpleCookieValue && this.options.mode === "full") {
      try {
        if (tokenPattern.test(this.simpleCookieValue)) {
          this.token = this.simpleCookieValue;
        } else {
          throw new Error("Invalid token format");
        }
      } catch (error: any) {
        logger(this.options.debug, "error", error);
        return;
      }
    } else {
      logger(this.options.debug, "error", "Token not found or invalid format");
      return;
    }
  }

  public validateSignature() {
    let signature = new Signature(
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

    let validate = signature.validateSignature();
    return validate;
  }

  /**
   * Redirect user to waiting room if not promoted
   */
  public redirectIfNotPromoted() {
    this.REQUEST.redirect(this.getRedirectUrl());
  }

  public redirectToCleanUrl(targetURL: string) {
    this.REQUEST.redirect(decodeURIComponent(targetURL));
  }

  public getRedirectUrl() {
    let slug;

    /**
     * 1.) API
     * 2.) Config (hybrid mode only)
     * 3.) Fallback
     * 4.) No slug
     */
    slug =
      this.sessionStatus?.result?.slug ||
      this.activeConfig?.slug ||
      this.options.fallbackSlug ||
      "";

    return `${this.WAIT_URL}/${slug}?url=${this.targetURL}&ch-code=&ch-id=${this.token}&ch-public-key=${this.publicKey}`;
  }

  /**
   * Generate Token Object
  */
  private generateCookieObjects() {
    let tokenDatestamp = new Date().getTime();
    let signatureGenerated: string = "";

    //Prioritise API response data over parameter data.
    if (this.requested) {
      signatureGenerated = this.requested;
    } else {
      signatureGenerated = this.specialParameters.chRequested;
    }

    let cookieObject = new GenerateCookieObject({
      tokenDatestamp: tokenDatestamp,
      tokenDatestampSignature: generateSignature(
        `${this.hashedPrivateKey}${tokenDatestamp}`
      ),
      tokenSignature: this.simpleSignature[0],
      //tokenSignatureGenerated: this.specialParameters.chRequested,
      tokenSignatureGenerated: signatureGenerated,
      tokenSignatures: this.complexSignature,
      tokenValue: this.token,
    });

    let signatureObject = cookieObject.signatureObject();
    let tokenObject = cookieObject.tokenObject();

    this.cookieSignatureObject = signatureObject;
    this.cookieTokenObject = tokenObject;
  }

  private getCookie(name: string) {
    let cookie = this.REQUEST.getCookies(this.COOKIE_NAME);
    //extract crowdhandler cookie value if it exists
    if (cookie && this.options.mode === "hybrid") {
      try {
        let cookieArray = cookie.split(";");
        for (let i = 0; i < cookieArray.length; i++) {
          let cookie = cookieArray[i].split("=");
          if (cookie[0] === this.COOKIE_NAME) {
            let rawcookie = cookie[1];
            let decodedCookie = decodeURIComponent(rawcookie);
            let processedCookie: z.infer<typeof CookieObject> | undefined =
              JSON.parse(decodedCookie);
            this.cookieValue = processedCookie;

            //this.cookieValue = processedCookie;
          }
        }
      } catch (error: any) {
        logger(this.options.debug, "error", error);
        return;
      }
    } else if (cookie && this.options.mode === "full") {
      try {
        let cookieArray = cookie.split(";");
        for (let i = 0; i < cookieArray.length; i++) {
          let cookie = cookieArray[i].split("=");
          if (cookie[0] === this.COOKIE_NAME) {
            this.simpleCookieValue = cookie[1];
          }
        }
      } catch (error: any) {
        logger(this.options.debug, "error", error);
        return;
      }
    }
  }

  public generateCookie(tokens: any[]) {
    return {
      integration: "JSDK",
      tokens: tokens,
    };
  }

  /**
   * Set CrowdHandler session cookie
   */
  public setCookie(value: string) {
    this.REQUEST.setCookie(value),
      {
        secure: true,
        sameSite: "strict",
        path: "/",
        domain: this.host,
      };
  }

  /**
   * Send current page performance to CrowdHandler
   * @param integer $httpCode HTTP Response code
   * @param float $sample Sample rate (0.0 - 1.0). Record 20% of requests by default.
   */
  public recordPerformance(statusCode?: number, sample: number = 0.2) {
    let lottery = Math.random();

    if (!this.responseID || lottery < sample) {
      return;
    }

    let elapsed = this.timer.elapsed();

    //No need to wait for this to complete. It's a throwaway request.
    this.PublicClient.responses().put(this.responseID, {
      //Will default to 200 if not provided
      httpCode: statusCode,
      time: elapsed,
    });
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
        break;
      default:
        "full";
        break;
    }
  }

  /**
   * Validate request using CrowdHandler API only
   */
  private async validateRequestFullMode() {
    let result: z.infer<typeof validateRequestObject> = {
      promoted: false,
      stripParams: false,
      setCookie: false,
      cookieValue: "",
      slug: "",
      targetURL: "",
    };

    logger(this.options.debug, "info", "IP: " + this.ip);
    logger(this.options.debug, "info", "Agent: " + this.agent);
    logger(this.options.debug, "info", "Host: " + this.host);
    logger(this.options.debug, "info", "Path: " + this.path);
    logger(this.options.debug, "info", "Lang: " + this.lang);

    //Bypass paths that match the ignore pattern
    if (ignoredPatternsCheck(this.path, this.ignore)) {
      logger(this.options.debug, "info", "Ignored path: " + this.path);
      result.promoted = true;
      return result;
    }

    this.processURL();

    result.targetURL = this.targetURL;

    this.getCookie(this.COOKIE_NAME);

    //We need to have a simple version of the cookie for full mode
    this.getToken(this.specialParameters.chID, this.cookieValue);

    await this.getSessionStatus();

    //Use zod safeparse to check that we're working with the SessionStatusErrorWrapper type
    let sessionStatusType = httpErrorWrapper.safeParse(this.sessionStatus);

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

      if (this.sessionStatus.result.slug) {
        result.slug = this.sessionStatus.result.slug;
      }

      //Set the token to make sure it is included in redirect parameters
      if (this.sessionStatus.result.token) {
        this.token = this.sessionStatus.result.token;
      }

      return result;
    } else if (this.sessionStatus && this.sessionStatus.result.promoted === 1) {
      result.promoted = true;
      result.setCookie = true;

      if (this.sessionStatus.result.token) {
        result.cookieValue = this.sessionStatus.result.token;
      }

      if (this.sessionStatus.result.responseID) {
        this.responseID = this.sessionStatus.result.responseID;
      }

      if (this.specialParameters.chRequested) {
        result.stripParams = true;
      }

      return result;
    }
  }

  /**
   * Validate request using signature and/or Crowdhandler API when required
  */
  private async validateRequestHybridMode() {
    let signatures = [];
    let tokens = [];
    let freshToken;
    let freshSignature;
    let processedCookie;

    let result: z.infer<typeof validateRequestObject> = {
      promoted: false,
      stripParams: false,
      setCookie: false,
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

    this.getCookie(this.COOKIE_NAME);

    await this.getConfig();

    //Use zod safeparse to check that we're working with the SessionStatusErrorWrapper type
    let configStatusType = httpErrorWrapper.safeParse(this.activeConfig);

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
    this.getCookie(this.COOKIE_NAME);

    logger(this.options.debug, "info", "Cookie: " + this.cookieValue);

    this.getSignature(this.specialParameters.chIDSignature, this.cookieValue);
    this.getToken(this.specialParameters.chID, this.cookieValue);

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
        let sessionStatusType = httpErrorWrapper.safeParse(this.sessionStatus);

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
            this.getToken(token);
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
            this.getSignature(hash);
          }

          if (this.sessionStatus.result.token) {
            token = this.sessionStatus.result.token;
            this.getToken(token);
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
        let sessionStatusType = httpErrorWrapper.safeParse(this.sessionStatus);

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
            this.getSignature(hash);
          }

          if (this.sessionStatus.result.token) {
            token = this.sessionStatus.result.token;
            this.getToken(token);
          }
        }
      } catch (error: any) {
        logger(this.options.debug, "error", error);
      }
    }

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
    this.cookieValue = this.generateCookie(tokens);
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
