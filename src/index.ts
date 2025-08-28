/**
 * CrowdHandler JavaScript SDK
 * 
 * @packageDocumentation
 */

// Polyfill for async/await in ES5 environments
import 'regenerator-runtime/runtime';

// Main API
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

// Error handling
export { CrowdHandlerError, ErrorCodes } from './common/errors';

// Export individual error codes for better autocomplete
export const CROWDHANDLER_ERRORS = {
  // Configuration errors
  INVALID_CONFIG: 'INVALID_CONFIG',
  INVALID_MODE: 'INVALID_MODE',
  INVALID_CONTEXT: 'INVALID_CONTEXT',
  MISSING_PRIVATE_KEY: 'MISSING_PRIVATE_KEY',
  
  // API errors
  API_CONNECTION_FAILED: 'API_CONNECTION_FAILED',
  API_TIMEOUT: 'API_TIMEOUT',
  API_INVALID_RESPONSE: 'API_INVALID_RESPONSE',
  INVALID_API_KEY: 'INVALID_API_KEY',
  RATE_LIMITED: 'RATE_LIMITED',
  
  // Resource errors
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  DOMAIN_NOT_FOUND: 'DOMAIN_NOT_FOUND',
  ROOM_NOT_FOUND: 'ROOM_NOT_FOUND',
  SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',
  
  // Generic errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const;

// Types that users might need
export type { 
  InitConfig, 
  InitResult,
  InitResultWithGatekeeper,
  InitResultWithoutGatekeeper 
} from './init';

// Classes for advanced usage (types only)
export type { Gatekeeper } from './gatekeeper/gatekeeper';
export type { RequestContext } from './request/requestContext';

// Types for request validation
export type {
  ValidateRequestObject,
  ValidateRequestParams,
  RecordPerformanceOptions,
  GatekeeperOptions,
  RoomConfig,
  RoomsConfig,
} from './common/types';

// Re-export types with better names
import { z } from 'zod';
import { 
  ValidateRequestObject as ValidateRequestSchema,
  ValidateRequestParams as ValidateRequestParamsSchema,
  RecordPerformanceOptions as RecordPerformanceSchema,
  GatekeeperOptions as GatekeeperOptionsSchema,
  RoomConfig as RoomConfigSchema,
} from './common/types';

export type ValidateRequestResult = z.infer<typeof ValidateRequestSchema>;
export type ValidateRequestParams = z.infer<typeof ValidateRequestParamsSchema>;
export type RecordPerformanceOptions = z.infer<typeof RecordPerformanceSchema>;
export type GatekeeperOptions = z.infer<typeof GatekeeperOptionsSchema>;
export type LiteValidatorRoom = z.infer<typeof RoomConfigSchema>;

// Mode constants for better IntelliSense
export { Mode, Modes } from './common/types';

// Common options types
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

// Response types from API methods

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