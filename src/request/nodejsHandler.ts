import { CookieObject } from "../common/types";
import { z } from "zod";

export class NodeJSHandler {
    private request: any;
    private response: any;
  
    constructor(req: any, res: any) {
      // Handle data in a non-Lambda environment
      this.request = req;
      this.response = res;
    }
  
    public getHeader(headername: string) {
      let headerValue = this.request.header(headername);
  
      if (!headerValue) {
        return "";
      }
  
      return headerValue;
    }
  
    public getCookies() {
      return this.request.get("cookie");
    }
  
    public getHost() {
      return this.request.get("host");
    }
  
    public getProtocol() {
      return this.request.protocol;
    }
  
    public getPath() {
      return this.request.originalUrl;
    }
  
    public getAbsoluteUri() {
      return (
        this.request.protocol +
        "://" +
        this.request.get("host") +
        this.request.originalUrl
      );
    }
  
    public getUserHostAddress() {
      return this.request.ip;
    }
  
    public setCookie(value: z.infer<typeof CookieObject>, cookieName: string = "crowdhandler") {
      const cookieOptions: any = {
        path: "/",
        secure: true, // cookie will only be sent over HTTPS
      };
      //Append cookie to response header
      return this.response.setHeader(
        "Set-Cookie",
        `${cookieName}=${value}; ${Object.keys(cookieOptions)
          .map((key) => `${key}=${cookieOptions[key]}`)
          .join("; ")}`
      );
    }
  
    public redirect(url: string) {
      this.response.setHeader("Cache-Control", "no-cache, no-store, max-age=0");
      this.response.setHeader("Pragma", "no-cache");
      this.response.setHeader("Expires", 0);
      this.response.setHeader("Location", url);
      this.response.statusCode = 302;
      return this.response.end();
    }
  }