interface RequestContextParams {
    lambdaEvent?: any;
    request?: any;
    response?: any;
    cloudflareWorkersRequest?: any;
}
export declare class RequestContext {
    constructor(params: RequestContextParams);
}
export {};
