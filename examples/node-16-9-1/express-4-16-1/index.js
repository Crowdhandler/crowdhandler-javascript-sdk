const express = require("express");
const router = express.Router();
const crowdhandler = require("crowdhandler-sdk");

router.get("*", async (req, res) => {
  const publicKey = "YOUR_PUBLIC_KEY";
  const public_client = new crowdhandler.PublicClient(publicKey);
  const ch_context = new crowdhandler.RequestContext(req, res);
  const ch_gatekeeper = new crowdhandler.Gatekeeper(public_client, ch_context, publicKey);
  const ch_status = await ch_gatekeeper.validateRequest();

  ch_status.setCookie && ch_gatekeeper.setCookie(ch_status.cookieValue);
  ch_status.stripParams && ch_gatekeeper.redirectToCleanUrl(ch_status.targetURL);

  if (!ch_status.promoted) {
    ch_gatekeeper.redirectIfNotPromoted();
  } else {
    //YOUR CODE HERE
    res.render("index", { title: "hello" });
    ch_gatekeeper.recordPerformance();
  }
});

module.exports = router;
