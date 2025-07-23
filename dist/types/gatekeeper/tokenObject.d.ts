import { z } from "zod";
import { TokenObjectConstructor } from "../common/types";
export declare class GenerateCookieObject {
    private tokenDatestamp;
    private tokenDatestampSignature;
    private tokenSignature;
    private tokenSignatureGenerated;
    private tokenSignatures;
    private tokenValue;
    constructor(tokenObjectProperties: z.infer<typeof TokenObjectConstructor>);
    signatureObject(): {
        gen: string;
        sig: string;
    };
    tokenObject(): {
        token: string;
        touched: number;
        touchedSig: string;
        signatures: any[];
    };
}
