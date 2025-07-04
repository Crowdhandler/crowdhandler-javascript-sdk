const crowdhandler = require("crowdhandler-sdk");
const publicKey = "YOUR_PUBLIC_KEY_HERE";

module.exports.originResponse = async (event) => {
  let request = event.Records[0].cf.request;
  let requestHeaders = event.Records[0].cf.request.headers;
  let response = event.Records[0].cf.response;
  let responseStatus = response.status;

  //convert response status to number
  responseStatus = parseInt(responseStatus);

  //extract the custom headers that we passed through from the viewerRequest event
  let responseID;
  let startTime;

  try {
    responseID = requestHeaders["x-crowdhandler-responseid"][0].value;
  } catch (e) {}

  try {
    startTime = requestHeaders["x-crowdhandler-starttime"][0].value;
  } catch (e) {}

  //Work out how long we spent processing at the origin
  let elapsed = Date.now() - startTime;

  //Initialize CrowdHandler with Lambda@Edge event
  const { gatekeeper } = crowdhandler.init({
    publicKey: publicKey,
    lambdaEdgeEvent: event,
    options: { 
      debug: false,
      timeout: 2000 
    }
  });

  //If we don't have a responseID or a startTime, we can't record the performance
  if (!responseID || !startTime) {
    return response;
  }

  //This is a throw away request. We don't need to wait for a response.
  await gatekeeper.recordPerformance({
    overrideElapsed: elapsed,
    responseID: responseID,
    sample: 1,
    statusCode: responseStatus,
  });

  //Fin
  return response;
};
