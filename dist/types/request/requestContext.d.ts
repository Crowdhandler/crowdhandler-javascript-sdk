interface RequestContextParams {
    lambdaEvent?: any;
    request?: any;
    response?: any;
}
export declare class RequestContext {
    constructor(params: RequestContextParams);
}
export {};
