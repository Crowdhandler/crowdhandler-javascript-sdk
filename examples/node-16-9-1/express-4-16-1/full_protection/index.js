const express = require("express");
const router = express.Router();
const crowdhandler = require("crowdhandler-sdk");

// Middleware to handle CrowdHandler logic for all GET requests
const crowdHandlerMiddleware = async (req, res, next) => {
  const publicKey = "YOUR_PUBLIC_KEY";
  const publicClient = new crowdhandler.PublicClient(publicKey);
  const chContext = new crowdhandler.RequestContext(req, res);
  const chGatekeeper = new crowdhandler.Gatekeeper(publicClient, chContext);

  try {
    const chStatus = await chGatekeeper.validateRequest();

    if (chStatus.setCookie) {
      chGatekeeper.setCookie(chStatus.cookieValue);
    }

    if (chStatus.stripParams) {
      chGatekeeper.redirectToCleanUrl(chStatus.targetURL);
    }

    if (!chStatus.promoted) {
      return chGatekeeper.redirectIfNotPromoted();
    }

    // If the request is promoted, save the chGatekeeper instance in res.locals for later use
    res.locals.chGatekeeper = chGatekeeper;

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
    if (res.locals.chGatekeeper) {
      res.locals.chGatekeeper.recordPerformance();
    }
  });
});

// Export the router
module.exports = router;
