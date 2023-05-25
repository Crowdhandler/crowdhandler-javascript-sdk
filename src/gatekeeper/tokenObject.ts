import { z } from "zod";
import {
  SignatureObject,
  TokenObjectConstructor,
  TokenObject,
} from "../common/types";

export class GenerateCookieObject {
  private tokenDatestamp: z.infer<
    typeof TokenObjectConstructor
  >["tokenDatestamp"];
  private tokenDatestampSignature: z.infer<
    typeof TokenObjectConstructor
  >["tokenDatestampSignature"];
  private tokenSignature: z.infer<
    typeof TokenObjectConstructor
  >["tokenSignature"];
  private tokenSignatureGenerated: z.infer<
    typeof TokenObjectConstructor
  >["tokenSignatureGenerated"];
  private tokenSignatures: z.infer<
    typeof TokenObjectConstructor
  >["tokenSignatures"];
  private tokenValue: z.infer<typeof TokenObjectConstructor>["tokenValue"];

  constructor(tokenObjectProperties: z.infer<typeof TokenObjectConstructor>) {
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
    let tokenObj: z.infer<typeof TokenObject> = {
      token: this.tokenValue,
      touched: this.tokenDatestamp,
      touchedSig: this.tokenDatestampSignature,
      signatures: this.tokenSignatures,
    };

    return tokenObj;
  }
}
