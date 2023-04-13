CrowdHandler JS SDK
====================
JS SDK for interacting with CrowdHandler Public and Private APIs. Extensive functionality for checking and queuing users

Install and Require
-------------------

    npm i crowdhandler-sdk
    
    const crowdhandler = require("crowdhandler-sdk")

Instantiate a Public API client
--------------------------------

    const public_clent = new crowdhandler.PublicClient(api_endpoint, your_public_key, timeout, debugMode)

**api_endpoint**: string (unless specified you should set this to "https://api.crowdhandler.com")

**your_public_key**: string

**timeout**: integer (optional) (default = 5000ms)

**debugMode**: boolean (optional) (default = false)

Instantiate Request Context
--------------------------------

    const ch_context = new crowdhandler.RequestContext(req, res)
    
**req**: object

**res**: object

Instantiate a new GateKeeper object
-----------------------------------

The GateKeeper class is a controller for interacting with the user request and the CrowdHandler API and taking appropriate action.

    const ch_gatekeeper = new crowdhandler.Gatekeeper(public_client, ch_context, your_public_key, your_private_key, options)
    
**your_public_key**: string

**your_private_key**: string (required only if options.mode = "**hybrid**")

**options** : object (optional)


| Option | Type | Default | Values | Explanation |
| ------ | ---- | ------- | ------ | ----------- |
| debug | boolean | false | false, true | Outputs debugging information. |
| fallbackSlug | string | "" | * | Used in combination with setting trustOnFail = false, specifying a specific safety net waiting room to be used in the event of a communications failure. |
| mode | string | full | full, hybrid, clientside | Validation method. See below for more information on choosing a mode. |
| timeout | integer | 5000 | 1 - 30000 | Outbound API communication timeout in milliseconds. | 
| trustOnFail | boolean | true | false, true | If false, if an API call fails, or a malformed response is received, you will be redirected to CrowdHandler's ultimate catch-all waiting room until the API responds with more inforamtion. |
    
options.mode
-------

Choosing the correct mode option is dependent on how/where you are integrating CrowdHandler. See below for for some general guidance. 
If in doubt, reach out to support@crowhandler.com.

`full` (default)

Suitable for most server-side integrations. 

***Pros***:

* Fully featured out of the box.
* Does not require suplimentary Javascript integration to enable autotune feature. 
* No private key required.

***Cons***: 

* Checks in with CrowdHandler API on every protected request.
* 20-100ms (depending on geo-location) of processing time added to requests accessing protected URLs. 

`hybrid`

When every millisecond counts.

***Pros***:

* Uses known signature method to significantly reduce the need for CrowdHandler API calls. 
* Only 2-10ms of processing time added to majority of requests. 
* Offloads none mission critical processes to browser.

***Cons***: 

* Requires additional installation of CrowdHandler's clientside Javascript (https://support.crowdhandler.com/support/solutions/articles/80000274028-javascript-integration-installing)
* Gatekeeper requires private key. 

`clientside`

_coming soon..._


Gatekeeper Overrides
-------

#### Override Host

    ch_gatekeeper.overrideHost(host: string)
    
By default host is inferred from the RequestContext class. 

#### Override Path

     ch_gatekeeper.overridePath(path: string)
    
By default path is inferred from the RequestContext class. 
    

#### Override IP Address   

    ch_gatekeeper.overrideIP(ip: string) 
    
Tracking the user's IP should be a simple thing, but in load-balanced or cloud hosting environments, sometimes you'll get the IP of the load balancer instead of the IP of the user. 

GateKeeper tries common patterns to detect the IP, including common load balancer patterns, but you can ovverride what it detects by setting explicitly if your setup is more exotic. It's important to track the IP accurately. If the same user is tracked via two IPs they could be blocked erroneously, or simultaneously blocked and not-blocked, depending upon whether they are waiting or transacting. 

#### Override Language

    ch_gatekeeper.overrideLang(lang: string) 
    
By default language is inferred from the accept-language header processed in the RequestContext class. 

#### Override User Agent

    ch_gatekeeper.overrideUserAgent(agent: string) 
    
By default user agent is inferred from the user-agent header processed in the RequestContext class. 

#### Override Ignore Pattern

    ch_gatekeeper.setIgnoreUrls(regExp: RegExp) 
    
    Default: /^((?!.*\?).*(\.(avi|css|eot|gif|ico|jpg|jpeg|js|json|mov|mp4|mpeg|mpg|og[g|v]|pdf|png|svg|ttf|txt|wmv|woff|woff2|xml))$)/;
    
By default, common assets (png jpg etc) will be excluded from API checks, receiving automatic promotion. 
If you want you can pass your own regular expression. This will *override* the existing RegExp, so you will need to incorporate assets if necessary.


Request Validation
-------------------------
    
    const ch_status = ch_gatekeeper->validateRequest();
    
This is the heart of the class. It looks at the user's request, checks in with the API (or their signature if options.mode = "hybrid") and retrieves a result that indicates whether the user should be granted access or be sent to a waiting room. 

Set the cookie
--------------

    if (ch_status.setCookie) {
        ch_gatekeeper.setCookie(ch_status.cookieValue)
    }

We automatically set the cookie so that the user carries their token with each request.

Strip CrowdHandler parameters
-----------------------------

After users are redirected from the waiting room to your application, CrowdHandler appends information to the URL query string which is used to manage state.

    if (ch_status.stripParams) {
        ch_gatekeeper.setCookie(ch_status.targetURL)
    }

Redirect the user if they should wait
-------------------------------------
    
If this user should be waiting, they will be sent to the correct waiting room.

    if (!ch_status.promoted) {
        ch_gatekeeper.redirectIfNotPromoted()
    }
    
Record page load performance
----------------------------

This should be done last, after your application has completed all actions i.e. rendered the page. 
        
    ch_gatekeeper.recordPerfomance()
    

Putting it all together
----------------------------

See the examples directory...

Instantiate a Private API Client
--------------------------------

_coming soon..._

More information
----------------

#### Knowledge base and API

https://support.crowdhandler.com

#### email

support@crowdhandler.com

