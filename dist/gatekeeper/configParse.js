"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigParse = void 0;
var ignoredPatternsCheck_1 = require("../common/ignoredPatternsCheck");
var types_1 = require("../common/types");
var ConfigParse = /** @class */ (function () {
    function ConfigParse(config, host, path, patterns) {
        this.roomMeta = {
            domain: null,
            patternType: null,
            queueActivatesOn: null,
            slug: null,
            status: false,
            timeout: null,
        };
        this.config = config;
        this.host = host;
        this.path = path;
        this.patterns = patterns;
    }
    ConfigParse.prototype.patternEvaulation = function (item) {
        switch (item.patternType) {
            case "regex":
                var regex = new RegExp(item.urlPattern);
                return regex.test(this.path);
                break;
            case "contains":
                var contains = item.urlPattern;
                return this.path.includes(contains);
                break;
            case "all":
                return true;
                break;
            default:
                break;
        }
    };
    ConfigParse.prototype.parse = function () {
        var _this = this;
        var staticAsset = (0, ignoredPatternsCheck_1.ignoredPatternsCheck)(this.path, this.patterns);
        if (staticAsset) {
            return types_1.RoomMetaObject.parse(this.roomMeta);
        }
        var filteredResults;
        filteredResults = this.config.filter(function (item) {
            if (item.domain === "https://".concat(_this.host)) {
                return item;
            }
        });
        for (var _i = 0, filteredResults_1 = filteredResults; _i < filteredResults_1.length; _i++) {
            var item = filteredResults_1[_i];
            if (this.patternEvaulation(item) === true) {
                //Populate the roomMeta object.
                //Use slug as a guard to make sure if we've already found a match we don't override it with weaker ones as we loop.
                if (this.roomMeta.slug === null) {
                    this.roomMeta.domain = item.domain;
                    this.roomMeta.patternType = item.patternType;
                    this.roomMeta.queueActivatesOn = item.queueActivatesOn;
                    this.roomMeta.slug = item.slug;
                    this.roomMeta.status = true;
                    this.roomMeta.timeout = item.timeout;
                }
            }
        }
        return types_1.RoomMetaObject.parse(this.roomMeta);
    };
    return ConfigParse;
}());
exports.ConfigParse = ConfigParse;
