import { BaseClient } from "./base_client";
import { Resource } from "./resource";

export class PrivateClient extends BaseClient {
  constructor(
    key: string,
    options: { timeout?: number; debug?: boolean; apiUrl?: string } = {}
  ) {
    const {
      timeout = 5000,
      debug = false,
      apiUrl = "https://api.crowdhandler.com",
    } = options ?? {};
    super(apiUrl, key, options);
  }

  account() {
    return new Resource(this.key, "/v1/account/", {
      timeout: this.timeout,
      debug: this.debug,
      apiUrl: this.apiUrl,
    });
  }

  accountPlan() {
    return new Resource(this.key, "/v1/account/plan", {
      timeout: this.timeout,
      debug: this.debug,
      apiUrl: this.apiUrl,
    });
  }

  codes() {
    return new Resource(this.key, "/v1/codes/ID_PLACEHOLDER", {
      timeout: this.timeout,
      debug: this.debug,
      apiUrl: this.apiUrl,
    });
  }

  domains() {
    return new Resource(this.key, "/v1/domains/ID_PLACEHOLDER", {
      timeout: this.timeout,
      debug: this.debug,
      apiUrl: this.apiUrl,
    });
  }

  domainIPs() {
    return new Resource(this.key, "/v1/domains/ID_PLACEHOLDER/ips", {
      timeout: this.timeout,
      debug: this.debug,
      apiUrl: this.apiUrl,
    });
  }

  domainReports() {
    return new Resource(this.key, "/v1/domains/ID_PLACEHOLDER/reports", {
      timeout: this.timeout,
      debug: this.debug,
      apiUrl: this.apiUrl,
    });
  }

  domainRequests() {
    return new Resource(this.key, "/v1/domains/ID_PLACEHOLDER/requests", {
      timeout: this.timeout,
      debug: this.debug,
      apiUrl: this.apiUrl,
    });
  }

  domainRooms() {
    return new Resource(this.key, "/v1/domains/ID_PLACEHOLDER/rooms", {
      timeout: this.timeout,
      debug: this.debug,
      apiUrl: this.apiUrl,
    });
  }

  domainURLs() {
    return new Resource(this.key, "/v1/domains/ID_PLACEHOLDER/urls", {
      timeout: this.timeout,
      debug: this.debug,
      apiUrl: this.apiUrl,
    });
  }

  groups() {
    return new Resource(this.key, "/v1/groups/ID_PLACEHOLDER", {
      timeout: this.timeout,
      debug: this.debug,
      apiUrl: this.apiUrl,
    });
  }

  groupBatch() {
    return new Resource(this.key, "/v1/groups/ID_PLACEHOLDER/batch", {
      timeout: this.timeout,
      debug: this.debug,
      apiUrl: this.apiUrl,
    });
  }

  groupCodes() {
    return new Resource(this.key, "/v1/groups/ID_PLACEHOLDER/codes", {
      timeout: this.timeout,
      debug: this.debug,
      apiUrl: this.apiUrl,
    });
  }

  ips() {
    return new Resource(this.key, "/v1/ips/ID_PLACEHOLDER", {
      timeout: this.timeout,
      debug: this.debug,
      apiUrl: this.apiUrl,
    });
  }

  reports() {
    return new Resource(this.key, "/v1/reports/ID_PLACEHOLDER", {
      timeout: this.timeout,
      debug: this.debug,
      apiUrl: this.apiUrl,
    });
  }

  rooms() {
    return new Resource(this.key, "/v1/rooms/ID_PLACEHOLDER", {
      timeout: this.timeout,
      debug: this.debug,
      apiUrl: this.apiUrl,
    });
  }

  roomReports() {
    return new Resource(this.key, "/v1/rooms/ID_PLACEHOLDER/reports", {
      timeout: this.timeout,
      debug: this.debug,
      apiUrl: this.apiUrl,
    });
  }

  roomSessions() {
    return new Resource(this.key, "/v1/rooms/ID_PLACEHOLDER/sessions", {
      timeout: this.timeout,
      debug: this.debug,
      apiUrl: this.apiUrl,
    });
  }

  sessions() {
    return new Resource(this.key, "/v1/sessions/ID_PLACEHOLDER", {
      timeout: this.timeout,
      debug: this.debug,
      apiUrl: this.apiUrl,
    });
  }

  templates() {
    return new Resource(this.key, "/v1/templates/ID_PLACEHOLDER", {
      timeout: this.timeout,
      debug: this.debug,
      apiUrl: this.apiUrl,
    });
  }
}
