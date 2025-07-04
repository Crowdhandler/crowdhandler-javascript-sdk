// Description: This is a basic example of how to use the CrowdHandler SDK in a React application.

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
const crowdhandler = require("crowdhandler-sdk");

function App() {
  const [data, setData] = useState(null);

  const LocationListener = () => {
    const location = useLocation();

    // This is the main CrowdHandler code. It should be executed as early as possible each time a new page/screen is loaded.
    useEffect(() => {
      async function crowdhandler_gatekeeper() {
        // URL changed: location.pathname

        //Initialize CrowdHandler for browser/React
        const { gatekeeper } = crowdhandler.init({
          publicKey: "YOUR_PUBLIC_KEY"
          // No context needed - auto-detects browser and sets mode to 'clientside'
        });

        //validate the request
        const chStatus = await gatekeeper.validateRequest();

        //session management
        if (chStatus.setLocalStorage) {
          gatekeeper.setLocalStorage();
        }

        //remove CrowdHandler guff from the URL
        if (chStatus.stripParams) {
          gatekeeper.redirectToCleanUrl(chStatus.targetURL);
        }

        //to redirect or to not redirect, that is the question
        if (!chStatus.promoted) {
          return gatekeeper.redirectIfNotPromoted();
        }

        /* Think carefull about where you include this.
         *
         *The intention is to inform CrowdHandler of the performance of the page
         *For example, in a single page application, you should defer this call until all critical components of the page have finished loading and the page is ready to be used.
         */
        gatekeeper.recordPerformance();

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
      }

      crowdhandler_gatekeeper();
    }, [location]);

    return null; // this component doesn't render anything
  };
}

export default App;
