const express = require("express");
const router = express.Router();
const crowdhandler = require("crowdhandler-sdk");
const { URL } = require("url");

// Middleware to handle CrowdHandler logic for POST and PUT methods
const crowdHandlerMiddleware = async (req, res, next) => {
  const method = req.method;

  // Check if the request method is POST or PUT
  if (method === "POST" || method === "PUT") {
    const publicKey = "YOUR_PUBLIC_KEY";
    const public_client = new crowdhandler.PublicClient(publicKey);
    const ch_context = new crowdhandler.RequestContext(req, res);
    const ch_gatekeeper = new crowdhandler.Gatekeeper(
      public_client,
      ch_context,
      {publicKey: publicKey}
    );

    let decodedBody;
    let chToken;
    let sourceURL;

    if (req.body) {
      try {
        decodedBody = JSON.parse(req.body);
        chToken = decodedBody.chToken;
        sourceURL = decodedBody.sourceURL;

        // Extract host & path from sourceURL
        let url = new URL(sourceURL);
        let temporaryHost = url.host;
        let temporaryPath = url.pathname;

        // Override the gatekeeper host and path with the sourceURL
        ch_gatekeeper.overrideHost(temporaryHost);
        ch_gatekeeper.overridePath(temporaryPath);

        // If there's a token in the body, provide gatekeeper with a pseudo cookie
        if (chToken) {
          ch_gatekeeper.overrideCookie(`crowdhandler=${chToken}`);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        return next(error);
      }
    }

    const ch_status = await ch_gatekeeper.validateRequest();

    // If the request is not promoted, send a 403 Forbidden response and do not proceed to the next middleware
    if (!ch_status.promoted) {
      res.status(403).send("Forbidden");
      return;
    } else {
      // If the request is promoted, save the ch_gatekeeper instance in res.locals for later use
      res.locals.ch_gatekeeper = ch_gatekeeper;
    }
  }
  // Continue to the next middleware or route handler
  next();
};

// Add the CrowdHandler middleware to the router
router.use(crowdHandlerMiddleware);

// Route handler for all request methods and paths
router.all("*", (req, res, next) => {
  // Render the view and send the HTML
  res.render("index", { title: "hello" }, (err, html) => {
    // Handle any errors during rendering
    if (err) {
      return next(err);
    }

    // Send the rendered HTML to the client
    res.send(html);

    // If the ch_gatekeeper instance exists in res.locals, record the performance
    if (res.locals.ch_gatekeeper) {
      res.locals.ch_gatekeeper.recordPerformance();
    }
  });
});

// Export the router
module.exports = router;
