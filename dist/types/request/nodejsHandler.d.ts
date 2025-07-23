import { CookieObject } from "../common/types";
import { z } from "zod";
export declare class NodeJSHandler {
    private request;
    private response;
    constructor(req: any, res: any);
    getHeader(headername: string): any;
    getCookies(): any;
    getHost(): any;
    getProtocol(): any;
    getPath(): any;
    getAbsoluteUri(): string;
    getUserHostAddress(): any;
    setCookie(value: z.infer<typeof CookieObject>, cookieName?: string): any;
    redirect(url: string): any;
}
