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

    // Check if validation encountered an error
    if (chStatus.error) {
      console.error(`CrowdHandler API error ${chStatus.error.statusCode}: ${chStatus.error.message}`);
      
      // Important: The request still has a promoted status even with errors
      // - 4xx errors: promoted = false (user is blocked)
      // - 5xx errors: promoted depends on trustOnFail setting
      
      // You might want to track these errors for monitoring
      // For example, send to your logging service
    }

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
  } catch (error) {
    // This catches unexpected SDK errors (e.g., network failures, config issues)
    console.error('CrowdHandler SDK error:', error.message);
    
    // With trustOnFail: true (default), you might allow access
    // With trustOnFail: false, you might block access or show error page
    
    // For critical routes, you might want to be more restrictive:
    // return res.status(503).send('Service temporarily unavailable');
    
    // For less critical routes, you might allow access:
    next();
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
