import { z } from "zod";

//Gatekeeper Options
export const GatekeeperOptions = z.object({
  debug: z.boolean().optional(),
  fallbackSlug: z.string().optional(),
  mode: z.string().optional(),
  timeout: z.number().optional(),
  trustOnFail: z.boolean().optional(),
  cookieName: z.string().optional(),
});

export const GatekeeperKeyPair = z.object({
  publicKey: z.string(),
  privateKey: z.string().optional(),
});

export const QueryObject = z
  .object({
    "ch-code": z.string().optional(),
    "ch-id": z.string().optional(),
    "ch-id-signature": z.string().optional(),
    "ch-public-key": z.string().optional(),
    "ch-requested": z.string().optional(),
    "ch-token": z.string().optional(),
  })
  .catchall(z.any());

export const SpecialParametersObject = z.object({
  chCode: z.string(),
  chID: z.string(),
  chIDSignature: z.string(),
  chPublicKey: z.string(),
  chRequested: z.string(),
});

export const ProcessURLResultObject = z.object({
  targetURL: z.string(),
  specialParameters: SpecialParametersObject,
});

export const RequestObject = z
  .object({
    hostname: z.string(),
    path: z.string(),
  })
  .catchall(z.any());

//Cookie object structure validation
export const CookieObject = z
  .object({
    tokens: z.array(z.any()),
    deployment: z.string().optional(),
  })
  .catchall(z.any());

export const LocalStorageObject = z.object({
  countdown: z.record(z.unknown()),
  positions: z.record(z.unknown()),
  token: z.record(z.string()),
});

export const LocalStorageOptions = z.object({
  storageName: z.string(),
  localStorageValue: z.string(),
});

//Response structure validation
export const RoomMetaObject = z
  .object({
    domain: z.string().nullable(),
    patternType: z.string().nullable(),
    queueActivatesOn: z.string().nullable(),
    slug: z.string().nullable(),
    status: z.boolean().nullable(),
    timeout: z.number().nullable(),
  })
  .catchall(z.any());

export const SignatureObject = z.array(
  z.object({
    gen: z.string(),
    sig: z.string(),
  })
);

export const SignatureResponseObject = z.object({
  expiration: z.nullable(z.boolean()),
  success: z.nullable(z.boolean()),
});

export const SignatureSourceObject = z.object({
  chIDSignature: z.string().optional(),
  crowdhandlerCookieValue: CookieObject.optional(),
});

export const GetTokenOptions = z.object({
  //object can contain anything and we don't know any of the possible values
  crowdhandlerCookieValue: CookieObject.optional(),
  chID: z.string().optional(),
  localStorageValue: LocalStorageObject.optional(),
  simpleCookieValue: z.string().optional(),
});

export const TokenObject = z.object({
  token: z.string(),
  touched: z.number(),
  touchedSig: z.string(),
  signatures: z.array(z.any()),
});


export const TokenObjectConstructor = z.object({
  tokenDatestamp: z.number(),
  tokenDatestampSignature: z.string(),
  tokenSignature: z.string(),
  tokenSignatureGenerated: z.string(),
  tokenSignatures: z.array(z.any()),
  tokenValue: z.string(),
});

export const ValidateRequestObject = z.object({
  promoted: z.boolean(),
  stripParams: z.boolean(),
  setCookie: z.boolean(),
  cookieValue: z.string().optional(),
  setLocalStorage: z.boolean(),
  localStorageValue: z.string().optional(),
  responseID: z.string().optional(),
  slug: z.string().optional(),
  targetURL: z.string().optional(),
  deployment: z.string().optional(),
  hash: z.string().nullable().optional(),
  token: z.string().optional(),
});

export const HttpErrorWrapper = z.object({
  result: z.object({
    error: z.string().nullable(),
    status: z.number().nullable(),
  }),
});

export const SessionStatusWrapper = z.object({
  result: z
    .object({
      hash: z.string().nullable().optional(),
      promoted: z.number().nullable(),
      status: z.number().nullable(),
      slug: z.string().nullable().optional(),
      token: z.string().nullable().optional(),
    })
    .catchall(z.any()),
});

export const RecordPerformanceOptions = z.object({
  statusCode: z.number().optional().default(200),
  sample: z.number().optional().default(0.2),
  overrideElapsed: z.number().optional(),
  responseID: z.string().optional(),
});

// Mode constants
export const Modes = {
  FULL: 'full',
  HYBRID: 'hybrid',
  CLIENTSIDE: 'clientside',
  AUTO: 'auto'
} as const;

export type Mode = typeof Modes[keyof typeof Modes];
