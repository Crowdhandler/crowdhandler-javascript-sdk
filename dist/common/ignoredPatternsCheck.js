"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ignoredPatternsCheck = void 0;
function ignoredPatternsCheck(path, patterns) {
    //Handle static file extensions
    var result = patterns.test(path);
    return result;
}
exports.ignoredPatternsCheck = ignoredPatternsCheck;
