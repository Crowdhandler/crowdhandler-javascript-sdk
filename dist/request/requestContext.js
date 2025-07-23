"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestContext = void 0;
var browserHandler_1 = require("./browserHandler");
var lambdaRequestHandler_1 = require("./lambdaRequestHandler");
var lambdaResponseHandler_1 = require("./lambdaResponseHandler");
var nodejsHandler_1 = require("./nodejsHandler");
//Create a base class that will act as a switch depending on the environment
var RequestContext = /** @class */ (function () {
    //constructor(event: CloudFrontEvent, req?: any, res?: any) {
    function RequestContext(params) {
        var _a;
        //Lambda@Edge event
        if (params && params.lambdaEvent) {
            //Create a switch based on the event type
            switch ((_a = params.lambdaEvent) === null || _a === void 0 ? void 0 : _a.Records[0].cf.config.eventType) {
                case "viewer-request":
                case "origin-request":
                    //update the event type to be a CloudFrontRequestEvent
                    var requestEvent = params.lambdaEvent;
                    return new lambdaRequestHandler_1.LambdaRequestHandler(requestEvent.Records[0].cf.request);
                    break;
                case "viewer-response":
                case "origin-response":
                    //update the event type to be a CloudFrontResponseEvent
                    var responseEvent = params.lambdaEvent;
                    return new lambdaResponseHandler_1.LambdaResponseHandler(responseEvent.Records[0].cf.request, responseEvent.Records[0].cf.response);
                    break;
            }
            //NodeJS HTTP request
        }
        else if (params && params.request && params.response) {
            return new nodejsHandler_1.NodeJSHandler(params.request, params.response);
            //Default to Browser request
        }
        else {
            return new browserHandler_1.BrowserHandler();
        }
    }
    return RequestContext;
}());
exports.RequestContext = RequestContext;
