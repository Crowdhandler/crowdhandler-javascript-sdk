const express = require("express");
const router = express.Router();
const crowdhandler = require("crowdhandler-sdk");

// Middleware to handle CrowdHandler logic
const crowdHandlerMiddleware = async (req, res, next) => {
  const { gatekeeper } = crowdhandler.init({
    publicKey: "YOUR_PUBLIC_KEY",
    request: req,
    response: res
  });

  try {
    const chStatus = await gatekeeper.validateRequest();

    if (chStatus.setCookie) {
      gatekeeper.setCookie(chStatus.cookieValue, chStatus.domain);
    }

    if (chStatus.stripParams) {
      gatekeeper.redirectToCleanUrl(chStatus.targetURL);
    }

    if (!chStatus.promoted) {
      return gatekeeper.redirectIfNotPromoted();
    }

    // If the request is promoted, save the gatekeeper instance in res.locals for later use
    res.locals.gatekeeper = gatekeeper;

    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    // Error handling middleware
    next(err);
  }
};

// Add the CrowdHandler middleware to the router
router.use(crowdHandlerMiddleware);

// Route handler for all paths
router.get("*", (req, res, next) => {
  //YOUR CODE BELOW THIS COMMENT

  // Render the view and send the HTML
  res.render("index", { title: "hello" }, (err, html) => {
    // Handle any errors during rendering
    if (err) {
      return next(err);
    }

    res.send(html);

    // Don't forget to log performance data with CrowdHandler. This is used for reporting and the autotune feature.
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
