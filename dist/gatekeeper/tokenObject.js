"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateCookieObject = void 0;
var GenerateCookieObject = /** @class */ (function () {
    function GenerateCookieObject(tokenObjectProperties) {
        this.tokenDatestamp = tokenObjectProperties.tokenDatestamp;
        this.tokenDatestampSignature =
            tokenObjectProperties.tokenDatestampSignature;
        this.tokenSignature = tokenObjectProperties.tokenSignature;
        this.tokenSignatureGenerated =
            tokenObjectProperties.tokenSignatureGenerated;
        this.tokenSignatures = tokenObjectProperties.tokenSignatures;
        this.tokenValue = tokenObjectProperties.tokenValue;
    }
    GenerateCookieObject.prototype.signatureObject = function () {
        var signatureObj = {
            gen: this.tokenSignatureGenerated,
            sig: this.tokenSignature,
        };
        return signatureObj;
    };
    GenerateCookieObject.prototype.tokenObject = function () {
        var tokenObj = {
            token: this.tokenValue,
            touched: this.tokenDatestamp,
            touchedSig: this.tokenDatestampSignature,
            signatures: this.tokenSignatures,
        };
        return tokenObj;
    };
    return GenerateCookieObject;
}());
exports.GenerateCookieObject = GenerateCookieObject;
