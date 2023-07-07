import { Client } from "./client";

export class Resource extends Client {
  path: string;
  constructor(
    key: string,
    path: string,
    options: { timeout?: number; debug?: boolean; api_url?: string } = {}
  ) {
    const {
      timeout = 5000,
      debug = false,
      api_url = "https://api.crowdhandler.com",
    } = options ?? {};
    super(api_url, key, options);
    this.path = path;
  }

  private formatPath(path: string, id: string) {
    // If id is not provided, replace it with an empty string.
    id = id || "";

    //this.path may contain a placeholder for the id. replace it with the actual id.
    path = path.replace("ID_PLACEHOLDER", id);

    return path;
  }

  delete(id: string, body: object) {
    this.path = this.formatPath(this.path, id);

    return super.httpDELETE(this.path, body);
  }

  get(id?: string, params?: object) {
    //Handle id being an optional parameter
    if (!id) {
      id = "";
    }

    this.path = this.formatPath(this.path, id);

    return super.httpGET(this.path, params);
  }

  post(body: object) {
    this.path = this.formatPath(this.path, "");

    return super.httpPOST(this.path, body);
  }

  put(id: string, body: object) {
    this.path = this.formatPath(this.path, id);

    return super.httpPUT(this.path, body);
  }
}
