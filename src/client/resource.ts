import { BaseClient } from "./base_client";

export class Resource extends BaseClient {
  path: string;
  constructor(
    key: string,
    path: string,
    options: { timeout?: number; debug?: boolean; apiUrl?: string } = {}
  ) {
    const {
      timeout = 5000,
      debug = false,
      apiUrl = "https://api.crowdhandler.com",
    } = options ?? {};
    super(apiUrl, key, options);
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

  get(id?: string, params?: any) {
    //Handle id being an optional parameter
    if (!id) {
      id = "";
    }

    this.path = this.formatPath(this.path, id);

    // Extract custom parameters and spread them with other params
    const { custom, ...standardParams } = params || {};
    const requestParams = {
      ...standardParams,
      ...custom // Spread custom parameters at the root level
    };

    return super.httpGET(this.path, requestParams);
  }

  post(body: any) {
    this.path = this.formatPath(this.path, "");

    // Extract custom parameters and spread them with other body params
    const { custom, ...standardBody } = body || {};
    const requestBody = {
      ...standardBody,
      ...custom // Spread custom parameters at the root level
    };

    return super.httpPOST(this.path, requestBody);
  }

  put(id: string, body: object) {
    this.path = this.formatPath(this.path, id);

    return super.httpPUT(this.path, body);
  }
}
