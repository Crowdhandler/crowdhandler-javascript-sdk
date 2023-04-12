import { z } from "zod";
import {
  SignatureObject,
  tokenObjectConstructor,
  tokenObject,
} from "../common/types";

export class GenerateCookieObject {
  private tokenDatestamp: z.infer<
    typeof tokenObjectConstructor
  >["tokenDatestamp"];
  private tokenDatestampSignature: z.infer<
    typeof tokenObjectConstructor
  >["tokenDatestampSignature"];
  private tokenSignature: z.infer<
    typeof tokenObjectConstructor
  >["tokenSignature"];
  private tokenSignatureGenerated: z.infer<
    typeof tokenObjectConstructor
  >["tokenSignatureGenerated"];
  private tokenSignatures: z.infer<
    typeof tokenObjectConstructor
  >["tokenSignatures"];
  private tokenValue: z.infer<typeof tokenObjectConstructor>["tokenValue"];

  constructor(tokenObjectProperties: z.infer<typeof tokenObjectConstructor>) {
    this.tokenDatestamp = tokenObjectProperties.tokenDatestamp;
    this.tokenDatestampSignature =
      tokenObjectProperties.tokenDatestampSignature;
    this.tokenSignature = tokenObjectProperties.tokenSignature;
    this.tokenSignatureGenerated =
      tokenObjectProperties.tokenSignatureGenerated;
    this.tokenSignatures = tokenObjectProperties.tokenSignatures;
    this.tokenValue = tokenObjectProperties.tokenValue;
  }

  signatureObject() {
    let signatureObj: z.infer<typeof SignatureObject>[0] = {
      gen: this.tokenSignatureGenerated,
      sig: this.tokenSignature,
    };

    return signatureObj;
  }

  tokenObject() {
    let tokenObj: z.infer<typeof tokenObject> = {
      token: this.tokenValue,
      touched: this.tokenDatestamp,
      touchedSig: this.tokenDatestampSignature,
      signatures: this.tokenSignatures,
    };

    return tokenObj;
  }
}
