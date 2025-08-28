/**
 * CrowdHandler JavaScript SDK
 *
 * @packageDocumentation
 */
import 'regenerator-runtime/runtime';
/**
 * Initialize CrowdHandler with configuration.
 * This is the main entry point for the SDK.
 */
export { init } from './init';
/**
 * Unified API client for all CrowdHandler operations.
 * Usually obtained from init(), but can be instantiated directly.
 */
export { Client } from './client/client';
export { CrowdHandlerError, ErrorCodes } from './common/errors';
export declare const CROWDHANDLER_ERRORS: {
    readonly INVALID_CONFIG: "INVALID_CONFIG";
    readonly INVALID_MODE: "INVALID_MODE";
    readonly INVALID_CONTEXT: "INVALID_CONTEXT";
    readonly MISSING_PRIVATE_KEY: "MISSING_PRIVATE_KEY";
    readonly API_CONNECTION_FAILED: "API_CONNECTION_FAILED";
    readonly API_TIMEOUT: "API_TIMEOUT";
    readonly API_INVALID_RESPONSE: "API_INVALID_RESPONSE";
    readonly INVALID_API_KEY: "INVALID_API_KEY";
    readonly RATE_LIMITED: "RATE_LIMITED";
    readonly RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND";
    readonly DOMAIN_NOT_FOUND: "DOMAIN_NOT_FOUND";
    readonly ROOM_NOT_FOUND: "ROOM_NOT_FOUND";
    readonly SESSION_NOT_FOUND: "SESSION_NOT_FOUND";
    readonly UNKNOWN_ERROR: "UNKNOWN_ERROR";
};
export type { InitConfig, InitResult, InitResultWithGatekeeper, InitResultWithoutGatekeeper } from './init';
export type { Gatekeeper } from './gatekeeper/gatekeeper';
export type { RequestContext } from './request/requestContext';
export type { ValidateRequestObject, ValidateRequestParams, RecordPerformanceOptions, GatekeeperOptions, RoomConfig, RoomsConfig, } from './common/types';
import { z } from 'zod';
import { ValidateRequestObject as ValidateRequestSchema, ValidateRequestParams as ValidateRequestParamsSchema, RecordPerformanceOptions as RecordPerformanceSchema, GatekeeperOptions as GatekeeperOptionsSchema, RoomConfig as RoomConfigSchema } from './common/types';
export declare type ValidateRequestResult = z.infer<typeof ValidateRequestSchema>;
export declare type ValidateRequestParams = z.infer<typeof ValidateRequestParamsSchema>;
export declare type RecordPerformanceOptions = z.infer<typeof RecordPerformanceSchema>;
export declare type GatekeeperOptions = z.infer<typeof GatekeeperOptionsSchema>;
export declare type LiteValidatorRoom = z.infer<typeof RoomConfigSchema>;
export { Mode, Modes } from './common/types';
/**
 * Common options for API client configuration
 */
export interface ClientOptions {
    /** API request timeout in milliseconds (default: 5000) */
    timeout?: number;
    /** Enable debug logging (default: false) */
    debug?: boolean;
    /** Custom API URL (default: https://api.crowdhandler.com) */
    apiUrl?: string;
}
/**
 * Room resource from the CrowdHandler API
 */
export interface Room {
    /** Unique room identifier */
    id: string;
    /** URL slug for the room */
    slug: string;
    /** Domain associated with the room */
    domain: string;
    /** Whether the room is active */
    status: boolean;
    /** Additional room properties */
    [key: string]: any;
}
export interface Domain {
    id: string;
    domain: string;
    [key: string]: any;
}
export interface Session {
    id: string;
    roomId: string;
    status: number;
    promoted: number;
    [key: string]: any;
}
export interface Request {
    id: string;
    [key: string]: any;
}
export interface Response {
    id: string;
    [key: string]: any;
}
