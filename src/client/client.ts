import axios, { AxiosInstance } from "axios";
import { z, ZodError } from "zod";
import { logger } from "../common/logger";

const APIResponse = z.object({}).catchall(z.any());

const CustomResponse = z.object({
  result: z.object({
    error: z.string(),
    status: z.number(),
  }),
}).catchall(z.any());

class ResponseGenerator {
  message: string;
  status: number;

  constructor(message: string = "Something went wrong.", status: number = 500) {
    this.message = message;
    this.status = status;
  }

  genErrorResponse() {
    return {
      result: {
        error: this.message,
        status: this.status,
      },
    };
  }
}

export class Client {
    protected debug: boolean;
    protected api_url: string;
    protected key: string;
    protected timeout: number;
  
    constructor(
      api_url: string,
      key: string,
      options: { timeout?: number; debug?: boolean; api_url?: string } = {}
    ) {
      this.debug = options.debug || false;
      this.api_url = options.api_url || api_url;
      this.key = key;
      this.timeout = options.timeout || 5000;
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
          const response = await axios.delete(this.api_url + path, {
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
  
    async httpPOST(
      path: string,
      body?: Record<string, any>,
      headers?: Record<string, any>,
      schema: z.Schema = APIResponse
    ) {
      try {
        const response = await axios.post(this.api_url + path, body, {
          headers: {
            "x-api-key": this.key,
            ...headers,
          },
        });
        return schema.parse(response.data);
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
  