import { Client } from "./client";

export class Resource extends Client {
  path: string;
  constructor(
    key: string,
    path: string,
    options: { timeout?: number; debug?: boolean; api_url?: string } = {}
  ) {
    const { timeout = 5000, debug = false, api_url = "https://api.crowdhandler.com" } =
      options ?? {};
    super(api_url, key, options);
    this.path = path;
  }

  delete(id: string, body: object) {
    return super.httpDELETE(this.path + id, body);
  }

  get(id?: string, params?: object) {
    if (id === undefined) {
      id = "";
    }

    return super.httpGET(this.path + id, params);
  }

  post(body: object) {
    return super.httpPOST(this.path, body);
  }

  put(id: string, body: object) {
    return super.httpPUT(this.path + id, body);
  }
}