import { z } from "zod";
export declare class ConfigParse {
    private roomMeta;
    private readonly config;
    private readonly host;
    private readonly path;
    private readonly patterns;
    constructor(config: Object[], host: string, path: string, patterns: RegExp);
    patternEvaulation(item: any): boolean | undefined;
    parse(): z.objectOutputType<{
        domain: z.ZodNullable<z.ZodString>;
        patternType: z.ZodNullable<z.ZodString>;
        queueActivatesOn: z.ZodNullable<z.ZodString>;
        slug: z.ZodNullable<z.ZodString>;
        status: z.ZodNullable<z.ZodBoolean>;
        timeout: z.ZodNullable<z.ZodNumber>;
    }, z.ZodAny, "strip">;
}
