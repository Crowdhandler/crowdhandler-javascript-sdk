import { ignoredPatternsCheck } from "../common/ignoredPatternsCheck";
import { z } from "zod";
import { RoomMetaObject } from "../common/types";

export class ConfigParse {
  private roomMeta = {
    domain: null,
    patternType: null,
    queueActivatesOn: null,
    slug: null,
    status: false,
    timeout: null,
  };
  private readonly config: Object[];
  private readonly host: string;
  private readonly path: string;
  private readonly patterns: RegExp;

  constructor(config: Object[], host: string, path: string, patterns: RegExp) {
    this.config = config;
    this.host = host;
    this.path = path;
    this.patterns = patterns;
  }

  patternEvaulation(item: any) {
    switch (item.patternType) {
      case "regex":
        let regex = new RegExp(item.urlPattern);
        return regex.test(this.path);
        break;

      case "contains":
        let contains = item.urlPattern;
        return this.path.includes(contains);
        break;

      case "all":
        return true;
        break;

      default:
        break;
    }
  }

  parse() {
    let staticAsset = ignoredPatternsCheck(this.path, this.patterns);

    if (staticAsset) {
      return RoomMetaObject.parse(this.roomMeta);
    }

    let filteredResults: any;
    filteredResults = this.config.filter((item: any) => {
      if (item.domain === `https://${this.host}`) {
        return item;
      }
    });


    for (const item of filteredResults) {
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
    return RoomMetaObject.parse(this.roomMeta);
  }
}
