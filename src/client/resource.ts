import { Client } from "./client";

export class Resource extends Client {
  path;

  constructor(
    api_url: string,
    key: string,
    path: string,
    timeout: number = 5000,
    debug: boolean = false
  ) {
    super(api_url, key, timeout, debug);
    this.path = path;
    this.debug = debug;
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
