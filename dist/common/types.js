"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modes = exports.RecordPerformanceOptions = exports.SessionStatusWrapper = exports.HttpErrorWrapper = exports.ValidateRequestObject = exports.TokenObjectConstructor = exports.TokenObject = exports.ExtractTokenOptions = exports.SignatureSourceObject = exports.SignatureResponseObject = exports.SignatureObject = exports.RoomMetaObject = exports.LocalStorageOptions = exports.LocalStorageObject = exports.CookieObject = exports.RequestObject = exports.ProcessURLResultObject = exports.SessionRequestConfig = exports.SpecialParametersObject = exports.QueryObject = exports.GatekeeperKeyPair = exports.GatekeeperOptions = exports.RoomsConfig = exports.RoomConfig = void 0;
var zod_1 = require("zod");
// Lite Validator types
exports.RoomConfig = zod_1.z.object({
    domain: zod_1.z.string(),
    urlPattern: zod_1.z.string().optional(),
    patternType: zod_1.z.enum(['regex', 'contains', 'all']).optional(),
    queueActivatesOn: zod_1.z.number().optional(),
    slug: zod_1.z.string(),
    timeout: zod_1.z.number().optional()
});
exports.RoomsConfig = zod_1.z.array(exports.RoomConfig);
//Gatekeeper Options
exports.GatekeeperOptions = zod_1.z.object({
    debug: zod_1.z.boolean().optional(),
    fallbackSlug: zod_1.z.string().optional(),
    mode: zod_1.z.string().optional(),
    timeout: zod_1.z.number().optional(),
    trustOnFail: zod_1.z.boolean().optional(),
    cookieName: zod_1.z.string().optional(),
    liteValidator: zod_1.z.boolean().optional(),
    roomsConfig: exports.RoomsConfig.optional(),
    waitingRoom: zod_1.z.boolean().optional(),
});
exports.GatekeeperKeyPair = zod_1.z.object({
    publicKey: zod_1.z.string(),
    privateKey: zod_1.z.string().optional(),
});
exports.QueryObject = zod_1.z
    .object({
    "ch-code": zod_1.z.string().optional(),
    "ch-id": zod_1.z.string().optional(),
    "ch-id-signature": zod_1.z.string().optional(),
    "ch-public-key": zod_1.z.string().optional(),
    "ch-requested": zod_1.z.string().optional(),
    "ch-token": zod_1.z.string().optional(),
})
    .catchall(zod_1.z.any());
exports.SpecialParametersObject = zod_1.z.object({
    chCode: zod_1.z.string(),
    chID: zod_1.z.string(),
    chIDSignature: zod_1.z.string(),
    chPublicKey: zod_1.z.string(),
    chRequested: zod_1.z.string(),
});
// Request configuration for session status API calls
exports.SessionRequestConfig = zod_1.z.object({
    agent: zod_1.z.string().optional(),
    ip: zod_1.z.string().optional(),
    lang: zod_1.z.string().optional(),
    url: zod_1.z.string().optional(),
    slug: zod_1.z.string().optional(),
});
exports.ProcessURLResultObject = zod_1.z.object({
    targetURL: zod_1.z.string(),
    specialParameters: exports.SpecialParametersObject,
});
exports.RequestObject = zod_1.z
    .object({
    hostname: zod_1.z.string(),
    path: zod_1.z.string(),
})
    .catchall(zod_1.z.any());
//Cookie object structure validation
exports.CookieObject = zod_1.z
    .object({
    tokens: zod_1.z.array(zod_1.z.any()),
    deployment: zod_1.z.string().optional(),
})
    .catchall(zod_1.z.any());
exports.LocalStorageObject = zod_1.z.object({
    countdown: zod_1.z.record(zod_1.z.unknown()),
    positions: zod_1.z.record(zod_1.z.unknown()),
    token: zod_1.z.record(zod_1.z.string()),
});
exports.LocalStorageOptions = zod_1.z.object({
    storageName: zod_1.z.string(),
    localStorageValue: zod_1.z.string(),
});
//Response structure validation
exports.RoomMetaObject = zod_1.z
    .object({
    domain: zod_1.z.string().nullable(),
    patternType: zod_1.z.string().nullable(),
    queueActivatesOn: zod_1.z.string().nullable(),
    slug: zod_1.z.string().nullable(),
    status: zod_1.z.boolean().nullable(),
    timeout: zod_1.z.number().nullable(),
})
    .catchall(zod_1.z.any());
exports.SignatureObject = zod_1.z.array(zod_1.z.object({
    gen: zod_1.z.string(),
    sig: zod_1.z.string(),
}));
exports.SignatureResponseObject = zod_1.z.object({
    expiration: zod_1.z.nullable(zod_1.z.boolean()),
    success: zod_1.z.nullable(zod_1.z.boolean()),
});
exports.SignatureSourceObject = zod_1.z.object({
    chIDSignature: zod_1.z.string().optional(),
    crowdhandlerCookieValue: exports.CookieObject.optional(),
});
exports.ExtractTokenOptions = zod_1.z.object({
    //object can contain anything and we don't know any of the possible values
    crowdhandlerCookieValue: exports.CookieObject.optional(),
    chID: zod_1.z.string().optional(),
    localStorageValue: exports.LocalStorageObject.optional(),
    simpleCookieValue: zod_1.z.string().optional(),
});
exports.TokenObject = zod_1.z.object({
    token: zod_1.z.string(),
    touched: zod_1.z.number(),
    touchedSig: zod_1.z.string(),
    signatures: zod_1.z.array(zod_1.z.any()),
});
exports.TokenObjectConstructor = zod_1.z.object({
    tokenDatestamp: zod_1.z.number(),
    tokenDatestampSignature: zod_1.z.string(),
    tokenSignature: zod_1.z.string(),
    tokenSignatureGenerated: zod_1.z.string(),
    tokenSignatures: zod_1.z.array(zod_1.z.any()),
    tokenValue: zod_1.z.string(),
});
exports.ValidateRequestObject = zod_1.z.object({
    promoted: zod_1.z.boolean(),
    stripParams: zod_1.z.boolean(),
    setCookie: zod_1.z.boolean(),
    cookieValue: zod_1.z.string().optional(),
    setLocalStorage: zod_1.z.boolean(),
    localStorageValue: zod_1.z.string().optional(),
    responseID: zod_1.z.string().optional(),
    slug: zod_1.z.string().optional(),
    targetURL: zod_1.z.string().optional(),
    deployment: zod_1.z.string().optional(),
    hash: zod_1.z.string().nullable().optional(),
    token: zod_1.z.string().optional(),
    requested: zod_1.z.string().optional(),
    liteValidatorRedirect: zod_1.z.boolean().optional(),
    liteValidatorUrl: zod_1.z.string().optional(),
});
exports.HttpErrorWrapper = zod_1.z.object({
    result: zod_1.z.object({
        error: zod_1.z.string().nullable(),
        status: zod_1.z.number().nullable(),
    }),
});
exports.SessionStatusWrapper = zod_1.z.object({
    result: zod_1.z
        .object({
        hash: zod_1.z.string().nullable().optional(),
        promoted: zod_1.z.number().nullable(),
        status: zod_1.z.number().nullable(),
        slug: zod_1.z.string().nullable().optional(),
        token: zod_1.z.string().nullable().optional(),
        urlRedirect: zod_1.z.string().nullable().optional(),
        requested: zod_1.z.string().nullable().optional(),
    })
        .catchall(zod_1.z.any()),
});
exports.RecordPerformanceOptions = zod_1.z.object({
    statusCode: zod_1.z.number().optional().default(200),
    sample: zod_1.z.number().optional().default(0.2),
    overrideElapsed: zod_1.z.number().optional(),
    responseID: zod_1.z.string().optional(),
});
// Mode constants
exports.Modes = {
    FULL: 'full',
    HYBRID: 'hybrid',
    CLIENTSIDE: 'clientside',
    AUTO: 'auto'
};
