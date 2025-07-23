import { CloudFrontRequest } from "aws-lambda";
export declare class LambdaRequestHandler {
    private request;
    constructor(event: CloudFrontRequest);
    getHeader(headername: string): string;
    getCookies(): string;
    getHost(): string;
    getProtocol(): string;
    getPath(): string;
    getAbsoluteUri(): string;
    getUserHostAddress(): string;
    setHeader(headerName: string, headerValue: string): void;
    redirect(url: string): {
        status: string;
        statusDescription: string;
        headers: {
            location: {
                key: string;
                value: string;
            }[];
            "cache-control": {
                key: string;
                value: string;
            }[];
            expires: {
                key: string;
                value: string;
            }[];
            pragma: {
                key: string;
                value: string;
            }[];
        };
    };
}
