"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAgent = void 0;
var zod_1 = require("zod");
//Response structure validation
var RequestObject = zod_1.z
    .object({
    headers: zod_1.z.object({}).catchall(zod_1.z.any()),
})
    .catchall(zod_1.z.any());
function getUserAgent(request) {
    var userAgent;
    var userAgentStr = request.getHeader("user-agent");
    if (userAgentStr) {
        userAgent = userAgentStr;
    }
    return userAgent;
}
exports.getUserAgent = getUserAgent;
