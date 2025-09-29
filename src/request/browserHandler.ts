export class BrowserHandler {
  constructor() {}

  public getCookies() {
    return document.cookie;
  }

  public getHost() {
    return window.location.host;
  }

  public getProtocol() {
    return window.location.protocol;
  }

  public getPath() {
    if (!window.location.search) {
      return window.location.pathname;
    } else {
      return `${window.location.pathname}${window.location.search}`;
    }
  }

  public getAbsoluteUri() {
    return window.location.href;
  }

  public setCookie(value: string, cookieName: string = "crowdhandler", domain?: string) {
    const cookieOptions: any = {
      path: "/",
      secure: true, // cookie will only be sent over HTTPS
    };
    
    // Add domain if provided
    if (domain) {
      cookieOptions.domain = domain;
    }
    
    document.cookie = `${cookieName}=${value}; ${Object.keys(cookieOptions)
      .map((key) => `${key}=${cookieOptions[key]}`)
      .join("; ")}`;
  }

  public getLocalStorageItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  public setLocalStorageItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  public redirect(url: string) {
    window.location.href = url;
  }
}
