import { CloudFrontRequest } from "aws-lambda";

export class LambdaRequestHandler {
  private request: CloudFrontRequest;

  constructor(event: CloudFrontRequest /*context: any, callback: any*/) {
    this.request = event;
  }

  public getHeader(headername: string) {
    const headers = this.request.headers;
    const headerValue = headers[headername.toLowerCase()];

    if (!headerValue) {
      return "";
    }

    return headerValue[0].value;
  }

  public getCookies() {
    const headers = this.request.headers;
    const cookies = headers.cookie;

    if (!cookies) {
      return "";
    }

    return cookies[0].value;
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

  public getAbsoluteUri() {
    const protocol = this.getProtocol();
    const host = this.getHost();
    const path = this.getPath();

    return `${protocol}://${host}${path}`;
  }

  public getUserHostAddress() {
    return this.request.clientIp;
  }

  public setHeader(headerName: string, headerValue: string) {
    this.request.headers[headerName] = [
      {
        key: headerName,
        value: headerValue,
      },
    ];
  }

  public redirect(url: string) {
    let response = {
      status: "302",
      statusDescription: "Found",
      headers: {
        location: [
          {
            key: "Location",
            value: url,
          },
        ],
        /*"set-cookie": [
            {
              key: "Set-Cookie",
              value: `crowdhandler=${token}; path=/; Secure; HttpOnly`,
            },
          ],*/
        "cache-control": [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
        expires: [
          {
            key: "Expires",
            value: "Fri, 01 Jan 1970 00:00:00 GMT",
          },
        ],
        pragma: [
          {
            key: "Pragma",
            value: "no-cache",
          },
        ],
      },
    };
    return response;
  }
}
