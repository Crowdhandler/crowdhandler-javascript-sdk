"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signature = void 0;
var types_1 = require("../common/types");
var hash_1 = require("../common/hash");
var logger_1 = require("../common/logger");
var Signature = /** @class */ (function () {
    function Signature(activeConfig, hashedPrivateKey, signatureType, simpleSignature, complexSignature, token, cookie, requested, specialParameters, debug) {
        if (simpleSignature === void 0) { simpleSignature = []; }
        if (debug === void 0) { debug = false; }
        this.hashCandidates = [];
        this.validationResponse = {
            expiration: null,
            success: null,
        };
        this.activeConfig = activeConfig;
        this.hashedPrivateKey = hashedPrivateKey;
        this.signatureType = signatureType;
        this.complexSignature = complexSignature;
        this.simpleSignature = simpleSignature;
        this.token = token;
        this.cookie = cookie;
        this.requested = requested;
        this.specialParameters = specialParameters;
        this.debug = debug;
        if (this.requested) {
            this.specialParameters.chRequested = this.requested;
        }
        if (this.specialParameters.chRequested) {
            this.freshSignature = true;
        }
        else {
            this.freshSignature = false;
        }
    }
    Signature.prototype.getHashCandidates = function () {
        var generatedHistory = [];
        //Check that the cookie is in a format that we can work with
        try {
            if (this.cookie) {
                types_1.CookieObject.parse(this.cookie);
                if (!this.freshSignature && this.cookie) {
                    this.activeCookie = this.cookie.tokens[this.cookie.tokens.length - 1];
                }
            }
        }
        catch (error) {
            (0, logger_1.logger)(this.debug, "error", error);
        }
        if (this.simpleSignature && this.simpleSignature.length > 0) {
            this.hashCandidates.unshift("".concat(this.hashedPrivateKey).concat(this.activeConfig.slug).concat(this.activeConfig.queueActivatesOn).concat(this.token).concat(this.specialParameters.chRequested));
        }
        else if (this.complexSignature && this.complexSignature.length > 0) {
            //If we have a signature that is active, we can use that to generate the hash
            for (var _i = 0, _a = this.complexSignature; _i < _a.length; _i++) {
                var item = _a[_i];
                generatedHistory.unshift(item.gen);
            }
            //Generate possible hash candidates
            for (var _b = 0, generatedHistory_1 = generatedHistory; _b < generatedHistory_1.length; _b++) {
                var item = generatedHistory_1[_b];
                this.hashCandidates.push("".concat(this.hashedPrivateKey).concat(this.activeConfig.slug).concat(this.activeConfig.queueActivatesOn).concat(this.token).concat(item));
            }
        }
        else {
            this.validationResponse.expiration = false;
            this.validationResponse.success = false;
            return;
        }
    };
    Signature.prototype.hashValidation = function () {
        var requiredHash;
        if (this.freshSignature) {
            var requiredHash_1 = (0, hash_1.generateSignature)(this.hashCandidates[0]);
            if (this.simpleSignature.some(function (item) { return item === requiredHash_1; }) === true) {
                this.matchedSignature = requiredHash_1;
            }
        }
        else if (this.complexSignature && this.complexSignature.length > 0) {
            var _loop_1 = function (hash) {
                var requiredHash_2 = (0, hash_1.generateSignature)(hash);
                if (this_1.complexSignature.some(function (item) { return item.sig === requiredHash_2; }) ===
                    true) {
                    this_1.matchedSignature = requiredHash_2;
                    return "break";
                }
            };
            var this_1 = this;
            for (var _i = 0, _a = this.hashCandidates; _i < _a.length; _i++) {
                var hash = _a[_i];
                var state_1 = _loop_1(hash);
                if (state_1 === "break")
                    break;
            }
        }
        //No signature matches found. Validation failed.
        if (!this.matchedSignature) {
            this.validationResponse.expiration = false;
            this.validationResponse.success = false;
            return;
        }
    };
    Signature.prototype.hashExpiration = function () {
        function minutesSinceTokenCreated(datestamp) {
            //UTC
            var currentDatestamp = new Date().getTime();
            //Time passed since creation time in minutes
            var minutesPassed = (currentDatestamp - datestamp) / 1000 / 60;
            //One decimal place
            minutesPassed = Math.round(minutesPassed * 10) / 10;
            return minutesPassed;
        }
        //This will only be true if we're dealing with a request that has recently been promoted from the waiting room or lite-validator.
        if (this.freshSignature && this.specialParameters.chRequested) {
            if (minutesSinceTokenCreated(Date.parse(this.specialParameters.chRequested)) < this.activeConfig.timeout) {
                this.validationResponse.expiration = false;
                this.validationResponse.success = true;
                return;
            }
        }
        else if (this.activeCookie &&
            this.activeCookie.touchedSig ===
                (0, hash_1.generateSignature)("".concat(this.hashedPrivateKey).concat(this.activeCookie.touched)) &&
            minutesSinceTokenCreated(this.activeCookie.touched) <
                this.activeConfig.timeout) {
            this.validationResponse.expiration = false;
            this.validationResponse.success = true;
            return;
        }
        else {
            //catch all
            this.validationResponse.expiration = true;
            this.validationResponse.success = false;
            return;
        }
    };
    Signature.prototype.validateSignature = function () {
        try {
            this.getHashCandidates();
            if (this.validationResponse.success !== null) {
                return this.validationResponse;
            }
        }
        catch (error) {
            (0, logger_1.logger)(this.debug, "error", error);
            this.validationResponse.expiration = false;
            this.validationResponse.success = false;
            return this.validationResponse;
        }
        try {
            this.hashValidation();
            if (this.validationResponse.success !== null) {
                return this.validationResponse;
            }
        }
        catch (error) {
            (0, logger_1.logger)(this.debug, "error", error);
            this.validationResponse.expiration = false;
            this.validationResponse.success = false;
            return this.validationResponse;
        }
        try {
            this.hashExpiration();
            return this.validationResponse;
        }
        catch (error) {
            (0, logger_1.logger)(this.debug, "error", error);
            this.validationResponse.expiration = false;
            this.validationResponse.success = false;
            return this.validationResponse;
        }
    };
    return Signature;
}());
exports.Signature = Signature;
