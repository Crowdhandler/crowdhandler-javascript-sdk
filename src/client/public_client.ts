import { Client } from "./client";
import { Resource } from "./resource";

export class PublicClient extends Client {
  constructor(
    key: string,
    options: { timeout?: number; debug?: boolean; api_url?: string } = {}
  ) {
    const { timeout = 5000, debug = false, api_url = "https://api.crowdhandler.com" } =
      options ?? {};
    super(api_url, key, options);
  }

  requests() {
    return new Resource(this.key, "/v1/requests/ID_PLACEHOLDER", { timeout: this.timeout, debug: this.debug, api_url: this.api_url });
  }

  responses() {
    return new Resource(this.key, "/v1/responses/ID_PLACEHOLDER", { timeout: this.timeout, debug: this.debug, api_url: this.api_url });
  }

  rooms() {
    return new Resource(this.key, "/v1/rooms/", { timeout: this.timeout, debug: this.debug, api_url: this.api_url });
  }
}