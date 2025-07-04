const express = require("express");
const router = express.Router();
const crowdhandler = require("crowdhandler-sdk");
const { URL } = require("url");

// Middleware to handle CrowdHandler logic for POST and PUT methods
const crowdHandlerMiddleware = async (req, res, next) => {
  const method = req.method;

  // Check if the request method is POST or PUT
  if (method === "POST" || method === "PUT") {
    const { gatekeeper } = crowdhandler.init({
      publicKey: "YOUR_PUBLIC_KEY",
      request: req,
      response: res
    });

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
        gatekeeper.overrideHost(temporaryHost);
        gatekeeper.overridePath(temporaryPath);

        // If there's a token in the body, provide gatekeeper with a pseudo cookie
        if (chToken) {
          gatekeeper.overrideCookie(`crowdhandler=${chToken}`);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        return next(error);
      }
    }

    const ch_status = await gatekeeper.validateRequest();

    // If the request is not promoted, send a 403 Forbidden response and do not proceed to the next middleware
    if (!ch_status.promoted) {
      res.status(403).send("Forbidden");
      return;
    } else {
      // If the request is promoted, save the gatekeeper instance in res.locals for later use
      res.locals.gatekeeper = gatekeeper;
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

    // If the gatekeeper instance exists in res.locals, record the performance
    if (res.locals.gatekeeper) {
      res.locals.gatekeeper.recordPerformance();
    }

    /*
     * IMPORTANT CONSIDERATION:
     *
     * The default status code sent to CrowdHandler is '200'. However, if a different status code needs to be sent,
     * it can be achieved by passing it as a parameter to the 'recordPerformance' method.
     *
     * Example:
     * gatekeeper.recordPerformance({status: 404});
     *
     * If you are using CrowdHandler's autotune feature, is is crucial to pass accurate status codes to CrowdHandler to ensure the precision of analytics and autotune results.
     */
  });
});

// Export the router
module.exports = router;