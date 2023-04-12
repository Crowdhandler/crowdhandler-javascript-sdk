const axios = require("axios").default;
import { z } from "zod";
import { logger } from "../common/logger";

//Response structure validation
const APIResponse = z.object({}).catchall(z.any());

const CustomResponse = z
  .object({
    result: z.object({
      error: z.string(),
      status: z.number(),
    }),
  })
  .catchall(z.any());

class ResponseGenerator {
  message;
  status;

  constructor(message: string | undefined, status: number | undefined) {
    this.message = message;
    this.status = status;
  }

  genErrorResponse() {
    return {
      result: {
        error: this.message || "Something went wrong.",
        status: this.status || 500,
      },
    };
  }
}

export class Client {
  public debug;
  api_url;
  key;
  timeout: number | undefined;

  constructor(
    api_url: string,
    key: string,
    timeout: number = 5000,
    debug: boolean = false
  ) {
    this.debug = debug;
    this.api_url = api_url;
    this.key = key;
    this.timeout = timeout;
    axios.defaults.timeout = this.timeout;
  }

  async errorHandler(error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx

      logger(this.debug, "error", error.response.data);
      logger(this.debug, "error", error.response.status);
      logger(this.debug, "error", error.response.headers);

      let response = new ResponseGenerator(
        error.response.data.error,
        error.response.status
      ).genErrorResponse();
      return CustomResponse.parse(response);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js

      logger(this.debug, "error", error.message);

      let response = new ResponseGenerator(
        error.message,
        500
      ).genErrorResponse();
      return CustomResponse.parse(response);
    } else {
      logger(this.debug, "error", error.message);

      let response = new ResponseGenerator(
        error.message,
        500
      ).genErrorResponse();
      return CustomResponse.parse(response);
    }
  }

  async httpDELETE(path: string, body: object) {
    try {
      const response = await axios.delete(this.api_url + path, body, {
        headers: {
          "x-api-key": this.key,
        },
      });
      return APIResponse.parse(response.data);
    } catch (error) {
      return this.errorHandler(error);
    }
  }

  async httpGET(path?: string, params?: object) {
    try {
      const response = await axios.get(this.api_url + path, {
        params: params,
        headers: {
          "x-api-key": this.key,
        },
      });
      return APIResponse.parse(response.data);
    } catch (error) {
      return this.errorHandler(error);
    }
  }

  async httpPOST(path: string, body: object) {
    try {
      const response = await axios.post(this.api_url + path, body, {
        headers: {
          "x-api-key": this.key,
        },
      });
      return APIResponse.parse(response.data);
    } catch (error) {
      return this.errorHandler(error);
    }
  }

  async httpPUT(path: string, body: object) {
    try {
      const response = await axios.put(this.api_url + path, body, {
        headers: {
          "x-api-key": this.key,
        },
      });
      return APIResponse.parse(response.data);
    } catch (error) {
      return this.errorHandler(error);
    }
  }
}
