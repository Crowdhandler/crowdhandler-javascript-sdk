"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
//export a logger function that will be used to log messages
function logger(debug, level, message) {
    if (debug) {
        switch (level) {
            case "info":
                console.info(message);
                break;
            case "warn":
                console.warn(message);
                break;
            case "error":
                console.error(message);
                break;
            default:
                console.log(message);
                break;
        }
    }
}
exports.logger = logger;
