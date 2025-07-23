"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSignature = void 0;
var js_sha256_1 = require("js-sha256");
function generateSignature(input) {
    var hash = (0, js_sha256_1.sha256)(input);
    return hash;
}
exports.generateSignature = generateSignature;
