"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timer = void 0;
//Create a class that will be used to create a timer
var Timer = /** @class */ (function () {
    //Create a constructor that will be used to initialize the timer
    function Timer() {
        //Initialize the timer
        this.timer = Date.now();
    }
    //Create a method that will be used to stop the timer
    Timer.prototype.elapsed = function () {
        //Stop the timer
        return Date.now() - this.timer;
    };
    return Timer;
}());
exports.Timer = Timer;
