import { Client } from "./client";
import { Resource } from "./resource";

export class PublicClient extends Client {
  constructor(
    api_url: string,
    key: string,
    timeout: number = 5000,
    debug: boolean = false
  ) {
    super(api_url, key, timeout, debug);
    this.debug = debug;
  }

  requests() {
    return new Resource(this.api_url, this.key, "/v1/requests/", this.timeout, this.debug);
  }

  responses() {
    return new Resource(this.api_url, this.key, "/v1/responses/", this.timeout, this.debug);
  }

  rooms() {
    return new Resource(this.api_url, this.key, "/v1/rooms/", this.timeout, this.debug);
  }
}