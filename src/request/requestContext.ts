import { CloudFrontRequestEvent, CloudFrontResponseEvent } from "aws-lambda";

import { BrowserHandler } from "./browserHandler";
import { LambdaRequestHandler } from "./lambdaRequestHandler";
import { LambdaResponseHandler } from "./lambdaResponseHandler";
import { NodeJSHandler } from "./nodejsHandler";

interface RequestContextParams {
  lambdaEvent?: any;
  request?: any;
  response?: any;
}

//Create a base class that will act as a switch depending on the environment
export class RequestContext {
  //constructor(event: CloudFrontEvent, req?: any, res?: any) {
  constructor(params: RequestContextParams) {
    //Lambda@Edge event
    if (params && params.lambdaEvent) {
      //Create a switch based on the event type
      switch (params.lambdaEvent?.Records[0].cf.config.eventType) {
        case "viewer-request":
        case "origin-request":
          //update the event type to be a CloudFrontRequestEvent
          const requestEvent =
            params.lambdaEvent as unknown as CloudFrontRequestEvent;
          return new LambdaRequestHandler(requestEvent.Records[0].cf.request);
          break;

        case "viewer-response":
        case "origin-response":
          //update the event type to be a CloudFrontResponseEvent
          const responseEvent =
            params.lambdaEvent as unknown as CloudFrontResponseEvent;
          return new LambdaResponseHandler(
            responseEvent.Records[0].cf.request,
            responseEvent.Records[0].cf.response
          );
          break;
      }
      //NodeJS HTTP request
    } else if (params && params.request && params.response) {
      return new NodeJSHandler(params.request, params.response);
      //Default to Browser request
    } else {
      return new BrowserHandler();
    }
  }
}
