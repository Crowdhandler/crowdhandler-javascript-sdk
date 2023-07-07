import { Client } from "./client";
import { Resource } from "./resource";

export class PrivateClient extends Client {
  constructor(
    key: string,
    options: { timeout?: number; debug?: boolean; api_url?: string } = {}
  ) {
    const {
      timeout = 5000,
      debug = false,
      api_url = "https://api.crowdhandler.com",
    } = options ?? {};
    super(api_url, key, options);
  }

  account() {
    return new Resource(this.key, "/v1/account/", {
      timeout: this.timeout,
      debug: this.debug,
      api_url: this.api_url,
    });
  }

  accountPlan() {
    return new Resource(this.key, "/v1/account/plan", {
      timeout: this.timeout,
      debug: this.debug,
      api_url: this.api_url,
    });
  }

  codes() {
    return new Resource(this.key, "/v1/codes/ID_PLACEHOLDER", {
      timeout: this.timeout,
      debug: this.debug,
      api_url: this.api_url,
    });
  }

  domains() {
    return new Resource(this.key, "/v1/domains/ID_PLACEHOLDER", {
      timeout: this.timeout,
      debug: this.debug,
      api_url: this.api_url,
    });
  }

  domainsIPs() {
    return new Resource(this.key, "/v1/domains/ID_PLACEHOLDER/ips", {
      timeout: this.timeout,
      debug: this.debug,
      api_url: this.api_url,
    });
  }

  domainsReports() {
    return new Resource(this.key, "/v1/domains/ID_PLACEHOLDER/reports", {
      timeout: this.timeout,
      debug: this.debug,
      api_url: this.api_url,
    });
  }

  domainsRequests() {
    return new Resource(this.key, "/v1/domains/ID_PLACEHOLDER/requests", {
      timeout: this.timeout,
      debug: this.debug,
      api_url: this.api_url,
    });
  }

  domainsRooms() {
    return new Resource(this.key, "/v1/domains/ID_PLACEHOLDER/rooms", {
      timeout: this.timeout,
      debug: this.debug,
      api_url: this.api_url,
    });
  }

  domainsURLs() {
    return new Resource(this.key, "/v1/domains/ID_PLACEHOLDER/urls", {
      timeout: this.timeout,
      debug: this.debug,
      api_url: this.api_url,
    });
  }

  groups() {
    return new Resource(this.key, "/v1/groups/ID_PLACEHOLDER", {
      timeout: this.timeout,
      debug: this.debug,
      api_url: this.api_url,
    });
  }

  groupsBatch() {
    return new Resource(this.key, "/v1/groups/ID_PLACEHOLDER/batch", {
      timeout: this.timeout,
      debug: this.debug,
      api_url: this.api_url,
    });
  }

  groupsCodes() {
    return new Resource(this.key, "/v1/groups/ID_PLACEHOLDER/codes", {
      timeout: this.timeout,
      debug: this.debug,
      api_url: this.api_url,
    });
  }

  ips() {
    return new Resource(this.key, "/v1/ips/ID_PLACEHOLDER", {
      timeout: this.timeout,
      debug: this.debug,
      api_url: this.api_url,
    });
  }

  reports() {
    return new Resource(this.key, "/v1/reports/ID_PLACEHOLDER", {
      timeout: this.timeout,
      debug: this.debug,
      api_url: this.api_url,
    });
  }

  rooms() {
    return new Resource(this.key, "/v1/rooms/ID_PLACEHOLDER", {
      timeout: this.timeout,
      debug: this.debug,
      api_url: this.api_url,
    });
  }

  roomsReports() {
    return new Resource(this.key, "/v1/rooms/ID_PLACEHOLDER/reports", {
      timeout: this.timeout,
      debug: this.debug,
      api_url: this.api_url,
    });
  }

  roomsSessions() {
    return new Resource(this.key, "/v1/rooms/ID_PLACEHOLDER/sessions", {
      timeout: this.timeout,
      debug: this.debug,
      api_url: this.api_url,
    });
  }

  sessions() {
    return new Resource(this.key, "/v1/sessions/ID_PLACEHOLDER", {
      timeout: this.timeout,
      debug: this.debug,
      api_url: this.api_url,
    });
  }

  templates() {
    return new Resource(this.key, "/v1/templates/ID_PLACEHOLDER", {
      timeout: this.timeout,
      debug: this.debug,
      api_url: this.api_url,
    });
  }
}
