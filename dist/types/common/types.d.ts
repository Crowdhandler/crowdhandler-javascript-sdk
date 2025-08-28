import { z } from "zod";
export declare const RoomConfig: z.ZodObject<{
    domain: z.ZodString;
    urlPattern: z.ZodOptional<z.ZodString>;
    patternType: z.ZodOptional<z.ZodEnum<["regex", "contains", "all"]>>;
    queueActivatesOn: z.ZodOptional<z.ZodNumber>;
    slug: z.ZodString;
    timeout: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    domain: string;
    slug: string;
    urlPattern?: string | undefined;
    patternType?: "regex" | "contains" | "all" | undefined;
    queueActivatesOn?: number | undefined;
    timeout?: number | undefined;
}, {
    domain: string;
    slug: string;
    urlPattern?: string | undefined;
    patternType?: "regex" | "contains" | "all" | undefined;
    queueActivatesOn?: number | undefined;
    timeout?: number | undefined;
}>;
export declare const RoomsConfig: z.ZodArray<z.ZodObject<{
    domain: z.ZodString;
    urlPattern: z.ZodOptional<z.ZodString>;
    patternType: z.ZodOptional<z.ZodEnum<["regex", "contains", "all"]>>;
    queueActivatesOn: z.ZodOptional<z.ZodNumber>;
    slug: z.ZodString;
    timeout: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    domain: string;
    slug: string;
    urlPattern?: string | undefined;
    patternType?: "regex" | "contains" | "all" | undefined;
    queueActivatesOn?: number | undefined;
    timeout?: number | undefined;
}, {
    domain: string;
    slug: string;
    urlPattern?: string | undefined;
    patternType?: "regex" | "contains" | "all" | undefined;
    queueActivatesOn?: number | undefined;
    timeout?: number | undefined;
}>, "many">;
export declare const GatekeeperOptions: z.ZodObject<{
    debug: z.ZodOptional<z.ZodBoolean>;
    fallbackSlug: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodString>;
    timeout: z.ZodOptional<z.ZodNumber>;
    trustOnFail: z.ZodOptional<z.ZodBoolean>;
    cookieName: z.ZodOptional<z.ZodString>;
    liteValidator: z.ZodOptional<z.ZodBoolean>;
    roomsConfig: z.ZodOptional<z.ZodArray<z.ZodObject<{
        domain: z.ZodString;
        urlPattern: z.ZodOptional<z.ZodString>;
        patternType: z.ZodOptional<z.ZodEnum<["regex", "contains", "all"]>>;
        queueActivatesOn: z.ZodOptional<z.ZodNumber>;
        slug: z.ZodString;
        timeout: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        domain: string;
        slug: string;
        urlPattern?: string | undefined;
        patternType?: "regex" | "contains" | "all" | undefined;
        queueActivatesOn?: number | undefined;
        timeout?: number | undefined;
    }, {
        domain: string;
        slug: string;
        urlPattern?: string | undefined;
        patternType?: "regex" | "contains" | "all" | undefined;
        queueActivatesOn?: number | undefined;
        timeout?: number | undefined;
    }>, "many">>;
    waitingRoom: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    debug?: boolean | undefined;
    fallbackSlug?: string | undefined;
    mode?: string | undefined;
    timeout?: number | undefined;
    trustOnFail?: boolean | undefined;
    cookieName?: string | undefined;
    liteValidator?: boolean | undefined;
    roomsConfig?: {
        domain: string;
        slug: string;
        urlPattern?: string | undefined;
        patternType?: "regex" | "contains" | "all" | undefined;
        queueActivatesOn?: number | undefined;
        timeout?: number | undefined;
    }[] | undefined;
    waitingRoom?: boolean | undefined;
}, {
    debug?: boolean | undefined;
    fallbackSlug?: string | undefined;
    mode?: string | undefined;
    timeout?: number | undefined;
    trustOnFail?: boolean | undefined;
    cookieName?: string | undefined;
    liteValidator?: boolean | undefined;
    roomsConfig?: {
        domain: string;
        slug: string;
        urlPattern?: string | undefined;
        patternType?: "regex" | "contains" | "all" | undefined;
        queueActivatesOn?: number | undefined;
        timeout?: number | undefined;
    }[] | undefined;
    waitingRoom?: boolean | undefined;
}>;
export declare const GatekeeperKeyPair: z.ZodObject<{
    publicKey: z.ZodString;
    privateKey: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    publicKey: string;
    privateKey?: string | undefined;
}, {
    publicKey: string;
    privateKey?: string | undefined;
}>;
export declare const QueryObject: z.ZodObject<{
    "ch-code": z.ZodOptional<z.ZodString>;
    "ch-id": z.ZodOptional<z.ZodString>;
    "ch-id-signature": z.ZodOptional<z.ZodString>;
    "ch-public-key": z.ZodOptional<z.ZodString>;
    "ch-requested": z.ZodOptional<z.ZodString>;
    "ch-token": z.ZodOptional<z.ZodString>;
}, "strip", z.ZodAny, z.objectOutputType<{
    "ch-code": z.ZodOptional<z.ZodString>;
    "ch-id": z.ZodOptional<z.ZodString>;
    "ch-id-signature": z.ZodOptional<z.ZodString>;
    "ch-public-key": z.ZodOptional<z.ZodString>;
    "ch-requested": z.ZodOptional<z.ZodString>;
    "ch-token": z.ZodOptional<z.ZodString>;
}, z.ZodAny, "strip">, z.objectInputType<{
    "ch-code": z.ZodOptional<z.ZodString>;
    "ch-id": z.ZodOptional<z.ZodString>;
    "ch-id-signature": z.ZodOptional<z.ZodString>;
    "ch-public-key": z.ZodOptional<z.ZodString>;
    "ch-requested": z.ZodOptional<z.ZodString>;
    "ch-token": z.ZodOptional<z.ZodString>;
}, z.ZodAny, "strip">>;
export declare const SpecialParametersObject: z.ZodObject<{
    chCode: z.ZodString;
    chID: z.ZodString;
    chIDSignature: z.ZodString;
    chPublicKey: z.ZodString;
    chRequested: z.ZodString;
}, "strip", z.ZodTypeAny, {
    chCode: string;
    chID: string;
    chIDSignature: string;
    chPublicKey: string;
    chRequested: string;
}, {
    chCode: string;
    chID: string;
    chIDSignature: string;
    chPublicKey: string;
    chRequested: string;
}>;
export declare const SessionRequestConfig: z.ZodObject<{
    agent: z.ZodOptional<z.ZodString>;
    ip: z.ZodOptional<z.ZodString>;
    lang: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    agent?: string | undefined;
    ip?: string | undefined;
    lang?: string | undefined;
    url?: string | undefined;
    slug?: string | undefined;
    custom?: Record<string, any> | undefined;
}, {
    agent?: string | undefined;
    ip?: string | undefined;
    lang?: string | undefined;
    url?: string | undefined;
    slug?: string | undefined;
    custom?: Record<string, any> | undefined;
}>;
export declare const ProcessURLResultObject: z.ZodObject<{
    targetURL: z.ZodString;
    specialParameters: z.ZodObject<{
        chCode: z.ZodString;
        chID: z.ZodString;
        chIDSignature: z.ZodString;
        chPublicKey: z.ZodString;
        chRequested: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        chCode: string;
        chID: string;
        chIDSignature: string;
        chPublicKey: string;
        chRequested: string;
    }, {
        chCode: string;
        chID: string;
        chIDSignature: string;
        chPublicKey: string;
        chRequested: string;
    }>;
}, "strip", z.ZodTypeAny, {
    targetURL: string;
    specialParameters: {
        chCode: string;
        chID: string;
        chIDSignature: string;
        chPublicKey: string;
        chRequested: string;
    };
}, {
    targetURL: string;
    specialParameters: {
        chCode: string;
        chID: string;
        chIDSignature: string;
        chPublicKey: string;
        chRequested: string;
    };
}>;
export declare const RequestObject: z.ZodObject<{
    hostname: z.ZodString;
    path: z.ZodString;
}, "strip", z.ZodAny, z.objectOutputType<{
    hostname: z.ZodString;
    path: z.ZodString;
}, z.ZodAny, "strip">, z.objectInputType<{
    hostname: z.ZodString;
    path: z.ZodString;
}, z.ZodAny, "strip">>;
export declare const CookieObject: z.ZodObject<{
    tokens: z.ZodArray<z.ZodAny, "many">;
    deployment: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodAny, z.objectOutputType<{
    tokens: z.ZodArray<z.ZodAny, "many">;
    deployment: z.ZodOptional<z.ZodString>;
}, z.ZodAny, "strip">, z.objectInputType<{
    tokens: z.ZodArray<z.ZodAny, "many">;
    deployment: z.ZodOptional<z.ZodString>;
}, z.ZodAny, "strip">>;
export declare const LocalStorageObject: z.ZodObject<{
    countdown: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    positions: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    token: z.ZodRecord<z.ZodString, z.ZodString>;
}, "strip", z.ZodTypeAny, {
    countdown: Record<string, unknown>;
    positions: Record<string, unknown>;
    token: Record<string, string>;
}, {
    countdown: Record<string, unknown>;
    positions: Record<string, unknown>;
    token: Record<string, string>;
}>;
export declare const LocalStorageOptions: z.ZodObject<{
    storageName: z.ZodString;
    localStorageValue: z.ZodString;
}, "strip", z.ZodTypeAny, {
    storageName: string;
    localStorageValue: string;
}, {
    storageName: string;
    localStorageValue: string;
}>;
export declare const RoomMetaObject: z.ZodObject<{
    domain: z.ZodNullable<z.ZodString>;
    patternType: z.ZodNullable<z.ZodString>;
    queueActivatesOn: z.ZodNullable<z.ZodString>;
    slug: z.ZodNullable<z.ZodString>;
    status: z.ZodNullable<z.ZodBoolean>;
    timeout: z.ZodNullable<z.ZodNumber>;
}, "strip", z.ZodAny, z.objectOutputType<{
    domain: z.ZodNullable<z.ZodString>;
    patternType: z.ZodNullable<z.ZodString>;
    queueActivatesOn: z.ZodNullable<z.ZodString>;
    slug: z.ZodNullable<z.ZodString>;
    status: z.ZodNullable<z.ZodBoolean>;
    timeout: z.ZodNullable<z.ZodNumber>;
}, z.ZodAny, "strip">, z.objectInputType<{
    domain: z.ZodNullable<z.ZodString>;
    patternType: z.ZodNullable<z.ZodString>;
    queueActivatesOn: z.ZodNullable<z.ZodString>;
    slug: z.ZodNullable<z.ZodString>;
    status: z.ZodNullable<z.ZodBoolean>;
    timeout: z.ZodNullable<z.ZodNumber>;
}, z.ZodAny, "strip">>;
export declare const SignatureObject: z.ZodArray<z.ZodObject<{
    gen: z.ZodString;
    sig: z.ZodString;
}, "strip", z.ZodTypeAny, {
    gen: string;
    sig: string;
}, {
    gen: string;
    sig: string;
}>, "many">;
export declare const SignatureResponseObject: z.ZodObject<{
    expiration: z.ZodNullable<z.ZodBoolean>;
    success: z.ZodNullable<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    expiration: boolean | null;
    success: boolean | null;
}, {
    expiration: boolean | null;
    success: boolean | null;
}>;
export declare const SignatureSourceObject: z.ZodObject<{
    chIDSignature: z.ZodOptional<z.ZodString>;
    crowdhandlerCookieValue: z.ZodOptional<z.ZodObject<{
        tokens: z.ZodArray<z.ZodAny, "many">;
        deployment: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodAny, z.objectOutputType<{
        tokens: z.ZodArray<z.ZodAny, "many">;
        deployment: z.ZodOptional<z.ZodString>;
    }, z.ZodAny, "strip">, z.objectInputType<{
        tokens: z.ZodArray<z.ZodAny, "many">;
        deployment: z.ZodOptional<z.ZodString>;
    }, z.ZodAny, "strip">>>;
}, "strip", z.ZodTypeAny, {
    chIDSignature?: string | undefined;
    crowdhandlerCookieValue?: z.objectOutputType<{
        tokens: z.ZodArray<z.ZodAny, "many">;
        deployment: z.ZodOptional<z.ZodString>;
    }, z.ZodAny, "strip"> | undefined;
}, {
    chIDSignature?: string | undefined;
    crowdhandlerCookieValue?: z.objectInputType<{
        tokens: z.ZodArray<z.ZodAny, "many">;
        deployment: z.ZodOptional<z.ZodString>;
    }, z.ZodAny, "strip"> | undefined;
}>;
export declare const ExtractTokenOptions: z.ZodObject<{
    crowdhandlerCookieValue: z.ZodOptional<z.ZodObject<{
        tokens: z.ZodArray<z.ZodAny, "many">;
        deployment: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodAny, z.objectOutputType<{
        tokens: z.ZodArray<z.ZodAny, "many">;
        deployment: z.ZodOptional<z.ZodString>;
    }, z.ZodAny, "strip">, z.objectInputType<{
        tokens: z.ZodArray<z.ZodAny, "many">;
        deployment: z.ZodOptional<z.ZodString>;
    }, z.ZodAny, "strip">>>;
    chID: z.ZodOptional<z.ZodString>;
    localStorageValue: z.ZodOptional<z.ZodObject<{
        countdown: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        positions: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        token: z.ZodRecord<z.ZodString, z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        countdown: Record<string, unknown>;
        positions: Record<string, unknown>;
        token: Record<string, string>;
    }, {
        countdown: Record<string, unknown>;
        positions: Record<string, unknown>;
        token: Record<string, string>;
    }>>;
    simpleCookieValue: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    crowdhandlerCookieValue?: z.objectOutputType<{
        tokens: z.ZodArray<z.ZodAny, "many">;
        deployment: z.ZodOptional<z.ZodString>;
    }, z.ZodAny, "strip"> | undefined;
    chID?: string | undefined;
    localStorageValue?: {
        countdown: Record<string, unknown>;
        positions: Record<string, unknown>;
        token: Record<string, string>;
    } | undefined;
    simpleCookieValue?: string | undefined;
}, {
    crowdhandlerCookieValue?: z.objectInputType<{
        tokens: z.ZodArray<z.ZodAny, "many">;
        deployment: z.ZodOptional<z.ZodString>;
    }, z.ZodAny, "strip"> | undefined;
    chID?: string | undefined;
    localStorageValue?: {
        countdown: Record<string, unknown>;
        positions: Record<string, unknown>;
        token: Record<string, string>;
    } | undefined;
    simpleCookieValue?: string | undefined;
}>;
export declare const TokenObject: z.ZodObject<{
    token: z.ZodString;
    touched: z.ZodNumber;
    touchedSig: z.ZodString;
    signatures: z.ZodArray<z.ZodAny, "many">;
}, "strip", z.ZodTypeAny, {
    token: string;
    touched: number;
    touchedSig: string;
    signatures: any[];
}, {
    token: string;
    touched: number;
    touchedSig: string;
    signatures: any[];
}>;
export declare const TokenObjectConstructor: z.ZodObject<{
    tokenDatestamp: z.ZodNumber;
    tokenDatestampSignature: z.ZodString;
    tokenSignature: z.ZodString;
    tokenSignatureGenerated: z.ZodString;
    tokenSignatures: z.ZodArray<z.ZodAny, "many">;
    tokenValue: z.ZodString;
}, "strip", z.ZodTypeAny, {
    tokenDatestamp: number;
    tokenDatestampSignature: string;
    tokenSignature: string;
    tokenSignatureGenerated: string;
    tokenSignatures: any[];
    tokenValue: string;
}, {
    tokenDatestamp: number;
    tokenDatestampSignature: string;
    tokenSignature: string;
    tokenSignatureGenerated: string;
    tokenSignatures: any[];
    tokenValue: string;
}>;
export declare const ValidateRequestParams: z.ZodObject<{
    custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    custom?: Record<string, any> | undefined;
}, {
    custom?: Record<string, any> | undefined;
}>;
export declare const ValidateRequestObject: z.ZodObject<{
    promoted: z.ZodBoolean;
    stripParams: z.ZodBoolean;
    setCookie: z.ZodBoolean;
    cookieValue: z.ZodOptional<z.ZodString>;
    setLocalStorage: z.ZodBoolean;
    localStorageValue: z.ZodOptional<z.ZodString>;
    responseID: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    targetURL: z.ZodOptional<z.ZodString>;
    deployment: z.ZodOptional<z.ZodString>;
    hash: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    token: z.ZodOptional<z.ZodString>;
    requested: z.ZodOptional<z.ZodString>;
    liteValidatorRedirect: z.ZodOptional<z.ZodBoolean>;
    liteValidatorUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    promoted: boolean;
    stripParams: boolean;
    setCookie: boolean;
    setLocalStorage: boolean;
    cookieValue?: string | undefined;
    localStorageValue?: string | undefined;
    responseID?: string | undefined;
    slug?: string | undefined;
    targetURL?: string | undefined;
    deployment?: string | undefined;
    hash?: string | null | undefined;
    token?: string | undefined;
    requested?: string | undefined;
    liteValidatorRedirect?: boolean | undefined;
    liteValidatorUrl?: string | undefined;
}, {
    promoted: boolean;
    stripParams: boolean;
    setCookie: boolean;
    setLocalStorage: boolean;
    cookieValue?: string | undefined;
    localStorageValue?: string | undefined;
    responseID?: string | undefined;
    slug?: string | undefined;
    targetURL?: string | undefined;
    deployment?: string | undefined;
    hash?: string | null | undefined;
    token?: string | undefined;
    requested?: string | undefined;
    liteValidatorRedirect?: boolean | undefined;
    liteValidatorUrl?: string | undefined;
}>;
export declare const HttpErrorWrapper: z.ZodObject<{
    result: z.ZodObject<{
        error: z.ZodNullable<z.ZodString>;
        status: z.ZodNullable<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        error: string | null;
        status: number | null;
    }, {
        error: string | null;
        status: number | null;
    }>;
}, "strip", z.ZodTypeAny, {
    result: {
        error: string | null;
        status: number | null;
    };
}, {
    result: {
        error: string | null;
        status: number | null;
    };
}>;
export declare const SessionStatusWrapper: z.ZodObject<{
    result: z.ZodObject<{
        hash: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        promoted: z.ZodNullable<z.ZodNumber>;
        status: z.ZodNullable<z.ZodNumber>;
        slug: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        token: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        urlRedirect: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        requested: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodAny, z.objectOutputType<{
        hash: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        promoted: z.ZodNullable<z.ZodNumber>;
        status: z.ZodNullable<z.ZodNumber>;
        slug: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        token: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        urlRedirect: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        requested: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.ZodAny, "strip">, z.objectInputType<{
        hash: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        promoted: z.ZodNullable<z.ZodNumber>;
        status: z.ZodNullable<z.ZodNumber>;
        slug: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        token: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        urlRedirect: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        requested: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.ZodAny, "strip">>;
}, "strip", z.ZodTypeAny, {
    result: {
        status: number | null;
        promoted: number | null;
        hash?: string | null | undefined;
        slug?: string | null | undefined;
        token?: string | null | undefined;
        urlRedirect?: string | null | undefined;
        requested?: string | null | undefined;
    } & {
        [k: string]: any;
    };
}, {
    result: {
        status: number | null;
        promoted: number | null;
        hash?: string | null | undefined;
        slug?: string | null | undefined;
        token?: string | null | undefined;
        urlRedirect?: string | null | undefined;
        requested?: string | null | undefined;
    } & {
        [k: string]: any;
    };
}>;
export declare const RecordPerformanceOptions: z.ZodObject<{
    statusCode: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    sample: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    overrideElapsed: z.ZodOptional<z.ZodNumber>;
    responseID: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    statusCode: number;
    sample: number;
    overrideElapsed?: number | undefined;
    responseID?: string | undefined;
}, {
    statusCode?: number | undefined;
    sample?: number | undefined;
    overrideElapsed?: number | undefined;
    responseID?: string | undefined;
}>;
export declare const Modes: {
    readonly FULL: "full";
    readonly HYBRID: "hybrid";
    readonly CLIENTSIDE: "clientside";
    readonly AUTO: "auto";
};
export declare type Mode = typeof Modes[keyof typeof Modes];
