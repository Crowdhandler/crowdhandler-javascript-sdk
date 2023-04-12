import {
  CookieObject,
  RequestObject,
  RoomMetaObject,
  SignatureObject,
  SignatureResponseObject,
  SpecialParametersObject,
} from "../common/types";
import { generateSignature } from "../common/hash";
import { logger } from "../common/logger";
import { TypeOf, z } from "zod";

export class Signature {
  private readonly activeConfig: any;
  private hashedPrivateKey: string | undefined;
  private signatureType: string | undefined;
  private complexSignature: z.infer<typeof SignatureObject> | undefined;
  private simpleSignature: string[];
  private freshSignature: boolean | undefined;
  private matchedSignature: string | undefined;
  private cookie: z.infer<typeof CookieObject> | undefined;
  private specialParameters: z.infer<typeof SpecialParametersObject>;
  private hashCandidates: string[] = [];
  //GET AN INTERFACE IN
  private activeCookie: any;
  private token: string | undefined;
  private requested: string | undefined;
  private validationResponse: z.infer<typeof SignatureResponseObject> = {
    expiration: null,
    success: null,
  };
  debug: boolean;

  constructor(
    activeConfig: z.infer<typeof RoomMetaObject>,
    hashedPrivateKey: string | undefined,
    signatureType: string | undefined,
    simpleSignature: string[] = [],
    complexSignature: z.infer<typeof SignatureObject> | undefined,
    token: string | undefined,
    cookie: z.infer<typeof CookieObject> | undefined,
    requested: string | undefined,
    specialParameters: z.infer<typeof SpecialParametersObject>,
    debug: boolean = false
  ) {
    this.activeConfig = activeConfig;
    this.hashedPrivateKey = hashedPrivateKey;
    this.signatureType = signatureType;
    this.complexSignature = complexSignature;
    this.simpleSignature = simpleSignature;
    this.token = token;
    this.cookie = cookie;
    this.requested = requested;
    this.specialParameters = specialParameters;
    this.debug = debug;

    if (this.requested) {
      this.specialParameters.chRequested = this.requested;
    }

    if (this.specialParameters.chRequested) {
      this.freshSignature = true;
    } else {
      this.freshSignature = false;
    }
  }

  private getHashCandidates() {
    let generatedHistory = [];

    //Check that the cookie is in a format that we can work with
    try {
      CookieObject.parse(this.cookie);

      if (!this.freshSignature && this.cookie) {
        this.activeCookie = this.cookie.tokens[this.cookie.tokens.length - 1];
      }
    } catch (error: any) {
      logger(this.debug, "error", error);
    }

    if (this.simpleSignature && this.simpleSignature.length > 0) {
      this.hashCandidates.unshift(
        `${this.hashedPrivateKey}${this.activeConfig.slug}${this.activeConfig.queueActivatesOn}${this.token}${this.specialParameters.chRequested}`
      );
    } else if (this.complexSignature && this.complexSignature.length > 0) {
      //If we have a signature that is active, we can use that to generate the hash
      for (const item of this.complexSignature) {
        generatedHistory.unshift(item.gen);
      }

      //Generate possible hash candidates
      for (const item of generatedHistory) {
        this.hashCandidates.push(
          `${this.hashedPrivateKey}${this.activeConfig.slug}${this.activeConfig.queueActivatesOn}${this.token}${item}`
        );
      }
    } else {
      this.validationResponse.expiration = false;
      this.validationResponse.success = false;
      return;
    }
  }

  private hashValidation() {
    let requiredHash;
    if (this.freshSignature) {
      let requiredHash = generateSignature(this.hashCandidates[0]);
      if (this.simpleSignature.some((item) => item === requiredHash) === true) {
        this.matchedSignature = requiredHash;
      }
    } else if (this.complexSignature && this.complexSignature.length > 0) {
      for (const hash of this.hashCandidates) {
        let requiredHash = generateSignature(hash);
        if (
          this.complexSignature.some((item) => item.sig === requiredHash) ===
          true
        ) {
          this.matchedSignature = requiredHash;
          break;
        }
      }
    }

    //No signature matches found. Validation failed.
    if (!this.matchedSignature) {
      this.validationResponse.expiration = false;
      this.validationResponse.success = false;
      return;
    }
  }

  private hashExpiration() {
    function minutesSinceTokenCreated(datestamp: number) {
      //UTC
      const currentDatestamp = new Date().getTime();

      //Time passed since creation time in minutes
      let minutesPassed = (currentDatestamp - datestamp) / 1000 / 60;
      //One decimal place
      minutesPassed = Math.round(minutesPassed * 10) / 10;
      return minutesPassed;
    }

    //This will only be true if we're dealing with a request that has recently been promoted from the waiting room or lite-validator.
    if (this.freshSignature && this.specialParameters.chRequested) {
      if (
        minutesSinceTokenCreated(
          Date.parse(this.specialParameters.chRequested)
        ) < this.activeConfig.timeout
      ) {
        this.validationResponse.expiration = false;
        this.validationResponse.success = true;
        return;
      }
    } else if (
      this.activeCookie &&
      this.activeCookie.touchedSig ===
        generateSignature(
          `${this.hashedPrivateKey}${this.activeCookie.touched}`
        ) &&
      minutesSinceTokenCreated(this.activeCookie.touched) <
        this.activeConfig.timeout
    ) {
      this.validationResponse.expiration = false;
      this.validationResponse.success = true;
      return;
    } else {
      //catch all
      this.validationResponse.expiration = true;
      this.validationResponse.success = false;
      return;
    }
  }

  public validateSignature() {
    try {
      this.getHashCandidates();

      if (this.validationResponse.success !== null) {
        return this.validationResponse;
      }
    } catch (error: any) {
      logger(this.debug, "error", error);
      this.validationResponse.expiration = false;
      this.validationResponse.success = false;
      return this.validationResponse;
    }

    try {
      this.hashValidation();

      if (this.validationResponse.success !== null) {
        return this.validationResponse;
      }
    } catch (error: any) {
      logger(this.debug, "error", error);
      this.validationResponse.expiration = false;
      this.validationResponse.success = false;
      return this.validationResponse;
    }

    try {
      this.hashExpiration();

      return this.validationResponse;
    } catch (error: any) {
      logger(this.debug, "error", error);
      this.validationResponse.expiration = false;
      this.validationResponse.success = false;
      return this.validationResponse;
    }
  }
}
