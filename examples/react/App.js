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
        console.log("URL changed:", location.pathname);

        //create a new instance of the CrowdHandler SDK
        const publicClient = new crowdhandler.PublicClient("YOUR_PUBLIC_KEY");
        const chContext = new crowdhandler.RequestContext();
        const chGatekeeper = new crowdhandler.Gatekeeper(
          publicClient,
          chContext,
          {
            publicKey: "YOUR_PUBLIC_KEY",
          },
          //Make sure to pass this mode if CrowdHandler is going to run on the client side
          { mode: "clientside" }
        );

        //validate the request
        const chStatus = await chGatekeeper.validateRequest();

        //session management
        if (chStatus.setLocalStorage) {
          chGatekeeper.setLocalStorage();
        }

        //remove CrowdHandler guff from the URL
        if (chStatus.stripParams) {
          chGatekeeper.redirectToCleanUrl(chStatus.targetURL);
        }

        //to redirect or to not redirect, that is the question
        if (!chStatus.promoted) {
          return chGatekeeper.redirectIfNotPromoted();
        }

        /* Think carefull about where you include this.
         *
         *The intention is to inform CrowdHandler of the performance of the page
         *For example, in a single page application, you should defer this call until all critical components of the page have finished loading and the page is ready to be used.
         */
        chGatekeeper.recordPerformance();

        /*
         * IMPORTANT CONSIDERATION:
         *
         * The default status code sent to CrowdHandler is '200'. However, if a different status code needs to be sent,
         * it can be achieved by passing it as a parameter to the 'recordPerformance' method.
         *
         * Example:
         * chGatekeeper.recordPerformance({status: 404});
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
