import { BaseClient } from "./base_client";
import { Resource } from "./resource";

export class PublicClient extends BaseClient {
  constructor(
    key: string,
    options: { timeout?: number; debug?: boolean; apiUrl?: string } = {}
  ) {
    const { timeout = 5000, debug = false, apiUrl = "https://api.crowdhandler.com" } =
      options ?? {};
    super(apiUrl, key, options);
  }

  requests() {
    return new Resource(this.key, "/v1/requests/ID_PLACEHOLDER", { timeout: this.timeout, debug: this.debug, apiUrl: this.apiUrl });
  }

  responses() {
    return new Resource(this.key, "/v1/responses/ID_PLACEHOLDER", { timeout: this.timeout, debug: this.debug, apiUrl: this.apiUrl });
  }

  rooms() {
    return new Resource(this.key, "/v1/rooms/", { timeout: this.timeout, debug: this.debug, apiUrl: this.apiUrl });
  }
}