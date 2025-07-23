"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLang = void 0;
var zod_1 = require("zod");
//Response structure validation
var RequestObject = zod_1.z
    .object({
    headers: zod_1.z.object({}).catchall(zod_1.z.any()),
})
    .catchall(zod_1.z.any());
function getLang(request) {
    var lang;
    var langStr = request.getHeader("accept-language");
    if (langStr) {
        lang = langStr;
    }
    return lang;
}
exports.getLang = getLang;
