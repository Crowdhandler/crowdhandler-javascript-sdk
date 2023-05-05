const crowdhandler = require("crowdhandler-sdk");
const publicKey = "YOUR_PUBLIC_KEY_HERE";

let ch_client = new crowdhandler.PublicClient(publicKey, { timeout: 2000 });

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

  //If we don't have a responseID or a startTime, we can't record the performance
  if (!responseID || !startTime) {
    return response;
  }

  //This is a throw away request. We don't need to wait for a response.
  await ch_gatekeeper.recordPerformance({
    overrideElapsed: elapsed,
    responseID: responseID,
    sample: 1,
    statusCode: responseStatus,
  });

  //Fin
  return response;
};
