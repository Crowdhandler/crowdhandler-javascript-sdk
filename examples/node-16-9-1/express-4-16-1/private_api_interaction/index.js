/* 
* This file provides a few different examples of how the SDK can be used to interact with private CrowdHandler API methods.
* To understand the required parameters, request methods and expected responses, please refer to the full API documentation.
* API documentation can be found in the CrowdHandler control panel Under "Account -> API".
  
 * account() -> /v1/account
 * accountPlan() -> /v1/account/plan
 * codes() -> /v1/codes/:code-id
 * domains() -> /v1/domains/:domain-id
 * domainIPs() -> /v1/domains/:domain-id/ips
 * domainReports() -> /v1/domains/:domain-id/reports
 * domainRequests() -> /v1/domains/:domain-id/requests
 * domainRooms() -> /v1/domains/:domain-id/rooms
 * domainURLs() -> /v1/domains/:domain-id/urls
 * groups() -> /v1/groups/:group-id
 * groupsBatch() -> /v1/groups/:group-id/batch
 * groupsCodes() -> /v1/groups/:group-id/codes
 * ips() -> /v1/ips/:ip-id
 * reports() -> /v1/reports/:report-id
 * rooms() -> /v1/rooms/:room-id
 * roomReports() -> /v1/rooms/:room-id/reports
 * roomSessions() -> /v1/rooms/:room-id/sessions
 * sessions() -> /v1/sessions/:session-id
 * templates() -> /v1/templates/:template-id
 
*/

//Import the CrowdHandler SDK
const crowdhandler = require("crowdhandler-sdk");

//Initialize CrowdHandler with private key for API access
const { client } = crowdhandler.init({
  publicKey: "YOUR_PUBLIC_KEY_HERE",
  privateKey: "YOUR_PRIVATE_KEY_HERE"
});

//Get a list of all domains associated with the key
let domains = await client.domains().get();

//Fetch details for a specific domain
let yourDomain = await client.domains().get("dom_4RQg2RBH7DLA");

//Update the rate of yourDomain
await client.domains().put("dom_4RQg2RBH7DLA", {
  rate: 100,
});

//Fetch a domains report
//Parameters are passed as an object
let domainsReport = await client
  .domainReports()
  .get("dom_4RQg2RBH7DLA", {
    from: "2023-06-06T19:59:00.000Z",
    to: "2023-07-06T19:59:00.000Z",
    day: "day",
  });

//Fetch waiting rooms associated with the key
let rooms = await client.rooms().get();

//Fetch details for a specific room
let yourRoom = await client.rooms().get("room_5SRg2RBH7DLA");

//Get a list of sessions associated with a room
let roomSessions = await client
  .roomSessions()
  .get("room_5SRg2RBH7DLA");

//Delete a session
await client.sessions().delete("ses_5SRg2RBH7DLA");
