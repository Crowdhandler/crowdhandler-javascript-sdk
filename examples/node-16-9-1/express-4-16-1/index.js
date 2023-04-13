var express = require("express");
var router = express.Router();
const crowdhandler = require("crowdhandler-sdk");

/* GET home page. */
router.get("*", async function (req, res, next) {

  //Found in crowdhandler control panel accounts -> api
  let publicKey = "YOUR_PUBLIC_KEY"

  //Initalize the client
  let public_client = new crowdhandler.PublicClient(
    "https://api-dev.crowdhandler.com",
    publicKey,
  );

  //Initalize the request context
  let ch_context = new crowdhandler.RequestContext(req, res);


  //Initalize the gatekeeper
  let ch_gatekeeper = new crowdhandler.Gatekeeper(
    public_client,
    ch_context,
    publicKey,
  );

  //Validate the request
  let ch_status = await ch_gatekeeper.validateRequest();

  if (ch_status.setCookie) {
    ch_gatekeeper.setCookie(ch_status.cookieValue);
  }

  if (ch_status.stripParams) {
    ch_gatekeeper.redirectToCleanUrl(ch_status.targetURL);
  }

  if (!ch_status.promoted) {
    ch_gatekeeper.redirectIfNotPromoted();
  } else {

    //YOUR APPLICATION CODE HERE
    res.render("index", { title: "hello" });

    //Record the performance AFTER your application code has executed
    ch_gatekeeper.recordPerformance();
  }
});

module.exports = router;
