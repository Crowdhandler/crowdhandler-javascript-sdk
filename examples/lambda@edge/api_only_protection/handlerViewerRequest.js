"use strict";
//include crowdhandler-sdk
const crowdhandler = require("crowdhandler-sdk");
const publicKey = "YOUR_PUBLIC_KEY_HERE";

let ch_client = new crowdhandler.PublicClient(publicKey, { timeout: 2000 });

module.exports.viewerRequest = async (event) => {
  //extract the request from the event
  let request = event.Records[0].cf.request;
  let decodedBody;
  let chToken;
  let sourceURL;

  //if the request is not a POST or PUT request, return the request unmodified
  if (request.method !== "POST" || request.method !== "PUT" ) {
    return request;
  }

  if (request.body && request.body.encoding === "base64") {
    // Decode the base64 encoded body
    decodedBody = Buffer.from(request.body.data, "base64").toString("utf8");

    // Parse the JSON encoded body
    try {
      // Parse the decoded body into a JSON object
      decodedBody = JSON.parse(decodedBody);
      //destructure sourceURL, chToken from the decoded body
      chToken = decodedBody.chToken;
      sourceURL = decodedBody.sourceURL;

      // Now you can work with the JSON object
    } catch (error) {
      console.error("Error parsing JSON:", error);

      // Handle the error or return the request object unmodified
      return request;
    }
  }

  //extract host & path from sourceURL using URL API
  let url = new URL(sourceURL);
  let temporaryHost = url.host;
  let temporaryPath = url.pathname;

  //Filter the event through the Request Context class
  let ch_context = new crowdhandler.RequestContext({ lambdaEvent: event });
  //Instantiate the Gatekeeper class
  let ch_gatekeeper = new crowdhandler.Gatekeeper(
    ch_client,
    ch_context,
    {
      publicKey: publicKey,
    },
    { debug: true }
  );

  //Override the gatekeeper host with the sourceURL
  ch_gatekeeper.overrideHost(temporaryHost);
  //Override the gatekeeper path with the sourceURL
  ch_gatekeeper.overridePath(temporaryPath);

  //If there's a token in the body provide gatekeeper with a pseudo cookie so that it can check that the provided token is valid/promoted
  if (chToken) {
    ch_gatekeeper.overrideCookie(`crowdhandler=${chToken}`);
  }

  //Validate the request
  let ch_status = await ch_gatekeeper.validateRequest();

  //If the request is not promoted, reject the request
  if (!ch_status.promoted) {
    return {
      status: "403",
      statusDescription: "Forbidden",
      headers: {
        "content-type": [
          {
            key: "Content-Type",
            value: "text/plain",
          },
        ],
        "cache-control": [
          {
            key: "Cache-Control",
            value: "max-age=0",
          },
        ],
      },
      body: "Access to this resource is forbidden.",
    };
  }

  //If the request is promoted, allow it to proceed normally
  //set customer headers for recording performance on the request before passing it through
  request.headers["x-crowdhandler-responseID"] = [
    { key: "x-crowdhandler-responseID", value: `${ch_status.responseID}` },
  ];
  request.headers["x-crowdhandler-startTime"] = [
    { key: "x-crowdhandler-startTime", value: `${Date.now()}` },
  ];

  //return the request
  return request;
};
