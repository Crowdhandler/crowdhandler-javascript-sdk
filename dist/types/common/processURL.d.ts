import { z } from "zod";
import { RequestObject } from "./types";
export declare class ProcessURL {
    private host;
    private path;
    private queryString;
    private specialParameters;
    private targetURL;
    debug: boolean;
    constructor(request: z.infer<typeof RequestObject>, debug?: boolean);
    parseURL(): {
        targetURL: string;
        specialParameters: {
            chCode: string;
            chID: string;
            chIDSignature: string;
            chPublicKey: string;
            chRequested: string;
        };
    };
    private processQueryString;
}
