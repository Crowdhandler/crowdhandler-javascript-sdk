import { CookieObject, RoomMetaObject, SignatureObject, SpecialParametersObject } from "../common/types";
import { z } from "zod";
export declare class Signature {
    private readonly activeConfig;
    private hashedPrivateKey;
    private signatureType;
    private complexSignature;
    private simpleSignature;
    private freshSignature;
    private matchedSignature;
    private cookie;
    private specialParameters;
    private hashCandidates;
    private activeCookie;
    private token;
    private requested;
    private validationResponse;
    debug: boolean;
    constructor(activeConfig: z.infer<typeof RoomMetaObject>, hashedPrivateKey: string | undefined, signatureType: string | undefined, simpleSignature: string[] | undefined, complexSignature: z.infer<typeof SignatureObject> | undefined, token: string | undefined, cookie: z.infer<typeof CookieObject> | undefined, requested: string | undefined, specialParameters: z.infer<typeof SpecialParametersObject>, debug?: boolean);
    private getHashCandidates;
    private hashValidation;
    private hashExpiration;
    validateSignature(): {
        expiration: boolean | null;
        success: boolean | null;
    };
}
