import { CloudFrontRequest, CloudFrontResponse } from "aws-lambda";
import { CookieObject } from "../common/types";
import { z } from "zod";

export class LambdaResponseHandler {
  private request: CloudFrontRequest;
  private response: CloudFrontResponse;

  constructor(
    requestEvent: CloudFrontRequest,
    responseEvent: CloudFrontResponse
  ) {
    // Handle data in a Lambda@Edge environment
    this.request = requestEvent;
    this.response = responseEvent;
  }

  public getHeader(headername: string) {
    const headers = this.request.headers;
    const headerValue = headers[headername.toLowerCase()];

    if (!headerValue) {
      return "";
    }

    return headerValue[0].value;
  }

  public getHost() {
    return this.request.headers.host[0].value;
  }

  public getProtocol() {
    return this.request.headers["cloudfront-forwarded-proto"][0].value;
  }

  public getPath() {
    return this.request.uri;
  }

  

  public setCookie(value: z.infer<typeof CookieObject>, cookieName: string = "crowdhandler", domain?: string) {
    const cookieOptions: any = {
      path: "/",
      secure: true, // cookie will only be sent over HTTPS
    };
    
    // Add domain if provided
    if (domain) {
      cookieOptions.domain = domain;
    }
    
    // Append cookie to response header
    const cookieHeader = `${cookieName}=${value}; ${Object.keys(cookieOptions)
      .map((key) => `${key}=${cookieOptions[key]}`)
      .join("; ")}`;

    const setCookieHeader = this.response.headers["set-cookie"] || [];
    setCookieHeader.push({ key: "Set-Cookie", value: cookieHeader });
    this.response.headers["set-cookie"] = setCookieHeader;

    return this.response;
  }
}
