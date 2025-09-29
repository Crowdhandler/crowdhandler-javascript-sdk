export declare class BrowserHandler {
    constructor();
    getCookies(): string;
    getHost(): string;
    getProtocol(): string;
    getPath(): string;
    getAbsoluteUri(): string;
    setCookie(value: string, cookieName?: string, domain?: string): void;
    getLocalStorageItem(key: string): string | null;
    setLocalStorageItem(key: string, value: string): void;
    redirect(url: string): void;
}
