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

  public setCookie(value: string) {
    const cookieOptions: any = {
      path: "/",
      secure: true, // cookie will only be sent over HTTPS
    };
    document.cookie = `crowdhandler=${value}; ${Object.keys(cookieOptions)
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
