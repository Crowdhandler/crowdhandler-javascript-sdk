import { CloudFrontRequest, CloudFrontResponse } from "aws-lambda";
import { CookieObject } from "../common/types";
import { z } from "zod";
export declare class LambdaResponseHandler {
    private request;
    private response;
    constructor(requestEvent: CloudFrontRequest, responseEvent: CloudFrontResponse);
    getHeader(headername: string): string;
    getHost(): string;
    getProtocol(): string;
    getPath(): string;
    setCookie(value: z.infer<typeof CookieObject>, cookieName?: string): CloudFrontResponse;
}
