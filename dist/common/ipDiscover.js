"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIP = void 0;
//Get source IP address of the request in node.js
var zod_1 = require("zod");
//Response structure validation
var RequestObject = zod_1.z
    .object({
    headers: zod_1.z.object({}).catchall(zod_1.z.any()),
})
    .catchall(zod_1.z.any());
function getIP(request) {
    var ip = request.getHeader("x-forwarded-for") || request.getUserHostAddress();
    if (ip.indexOf(",") > -1) {
        // If there are multiple IPs in the x-forwarded-for header,
        // get the client's IP address, not the proxy addresses
        var ips = ip.split(",");
        ip = ips[0].trim();
    }
    return ip;
}
exports.getIP = getIP;
