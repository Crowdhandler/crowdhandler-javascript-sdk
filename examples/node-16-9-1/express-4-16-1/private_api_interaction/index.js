//This file provides a few different examples of how the SDK can be used to interact with private CrowdHandler API methods
//To understand the required parameters, request methods and expected responses, please refer to the full API documentation
//API documentation can be found in the CrowdHandler control panel Under "Account -> API"

//Import the CrowdHandler SDK
const crowdhandler = require("crowdhandler-sdk");

//Instantiate a new PrivateClient object
let private_client = new crowdhandler.PrivateClient("YOUR_PRIVATE_KEY_HERE");

//Get a list of all domains associated with the key
let domains = await private_client.domains().get();

//Fetch details for a specific domain
let yourDomain = await private_client.domains().get("dom_4RQg2RBH7DLA");

//Update the rate of yourDomain
await private_client.domains().put("dom_4RQg2RBH7DLA", {
  rate: 100,
});

//Fetch a domains report
//Parameters are passed as an object
let domainsReport = await private_client.domainsReports().get("dom_4RQg2RBH7DLA", {
  from: "2023-06-06T19:59:00.000Z",
  to: "2023-07-06T19:59:00.000Z",
  day: "day",
});

//Fetch waiting rooms associated with the key
let rooms = await private_client.rooms().get();

//Fetch details for a specific room
let yourRoom = await private_client.rooms().get("room_5SRg2RBH7DLA");

//Get a list of sessions associated with a room
let roomSessions = await private_client.roomsSessions().get("room_5SRg2RBH7DLA");

//Delete a session
await private_client.sessions().delete("ses_5SRg2RBH7DLA");



