# CrowdHandler JavaScript SDK

The official JavaScript SDK for [CrowdHandler](https://www.crowdhandler.com) waiting room and queue management. Works in both Node.js and browser environments.

[![npm version](https://img.shields.io/npm/v/crowdhandler-sdk.svg)](https://www.npmjs.com/package/crowdhandler-sdk)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## Features

- 🚀 **Easy Integration** - Add queue management to any JavaScript application with a single function call
- 🌐 **Flexible Deployment** - Works in Node.js servers, browsers, serverless functions, and CDN edge locations
- ⚡ **Performance Options** - Choose between real-time API validation or local signature validation based on your needs
- 🔄 **Queue Continuity** - Maintains user position across page refreshes and sessions
- 📘 **TypeScript Support** - Full type definitions for better development experience
- 🔧 **API Access** - Manage waiting rooms, monitor queues, and access analytics programmatically

## Installation

### NPM

```bash
npm install crowdhandler-sdk
```

### CDN

```html
<!-- Load from unpkg -->
<script src="https://unpkg.com/crowdhandler-sdk/dist/crowdhandler.umd.min.js"></script>

<!-- Or specify a version -->
<script src="https://unpkg.com/crowdhandler-sdk@2.0.0/dist/crowdhandler.umd.min.js"></script>
```

### Module Formats

The SDK is available in multiple formats:

- **ES Modules** - `import { init } from 'crowdhandler-sdk'`
- **CommonJS** - `const crowdhandler = require('crowdhandler-sdk')`
- **UMD** - Available as `window.crowdhandler` when loaded via script tag
- **Dynamic Import** - `await import('crowdhandler-sdk')`

## Quick Start

### Node.js / Server-side

```javascript
const crowdhandler = require('crowdhandler-sdk');
// or ES modules: import { init } from 'crowdhandler-sdk';

// Initialize SDK
const { client, gatekeeper } = crowdhandler.init({
  publicKey: 'YOUR_PUBLIC_KEY',
  // Optional: add privateKey for private API access
  privateKey: 'YOUR_PRIVATE_KEY',
  request: req,  // Express request object
  response: res  // Express response object
});

// Validate the request
const result = await gatekeeper.validateRequest();

// Handle the validation result
if (result.setCookie) {
  gatekeeper.setCookie(result.cookieValue, result.domain);
}

if (result.stripParams) {
  return gatekeeper.redirectToCleanUrl(result.targetURL);
}

if (!result.promoted) {
  return gatekeeper.redirectIfNotPromoted();
}

// User is promoted - continue with your application
// ... your protected content here ...

// Record performance (optional but recommended)
await gatekeeper.recordPerformance();
```

### Browser / Client-side

```javascript
// Using script tag
const { client, gatekeeper } = window.crowdhandler.init({
  publicKey: 'YOUR_PUBLIC_KEY',
  options: {
    mode: 'clientside'
  }
});

// Or using ES Modules
import { init } from 'crowdhandler-sdk';
const { client, gatekeeper } = init({
  publicKey: 'YOUR_PUBLIC_KEY',
  options: {
    mode: 'clientside'
  }
});

// Validate the request
const result = await gatekeeper.validateRequest();

// Handle the validation result
if (result.setCookie) {
  gatekeeper.setCookie(result.cookieValue, result.domain);
}

if (result.stripParams) {
  // Redirect to clean URL
  window.location.href = result.targetURL;
  return;
}

if (!result.promoted) {
  // Redirect to waiting room
  gatekeeper.redirectIfNotPromoted();
  return;
}

// User is promoted - your application continues
console.log('User granted access');

// Record performance (optional but recommended)
await gatekeeper.recordPerformance();
```

## Core Methods

### gatekeeper.validateRequest(params?)

The primary method for validating requests against CrowdHandler's queue system. This method determines whether a user should be granted access to your protected resource or sent to a waiting room.

```javascript
// Basic usage
const result = await gatekeeper.validateRequest();

// With custom parameters
const result = await gatekeeper.validateRequest({
  custom: {
    code: 'ABC123',
    captcha: 'xK9mN2pQ5vL8wR3tY6uZ1aS4dF7gH0j'
  }
});
```

**Parameters:**

- `params` (optional) - Object containing custom parameters
  - `custom` - Object with any key-value pairs to send to the CrowdHandler API

**How it works:**

1. **Token Check**: First checks for an existing CrowdHandler session token in cookies
2. **API Validation**: Sends the token (or generates a new one) to CrowdHandler's API, including any custom parameters
3. **Queue Position**: Determines if the user is promoted based on current capacity
4. **Response**: Returns instructions on how to handle the request

**Return Object:**

```javascript
{
  promoted: boolean,      // true = grant access, false = send to waiting room
  setCookie: boolean,     // true = update the user's session cookie
  cookieValue: string,    // The session token to store in the cookie
  stripParams: boolean,   // true = remove CrowdHandler URL parameters
  targetURL: string,      // Where to redirect (clean URL or waiting room)
  slug: string,           // The waiting room slug (when not promoted)
  responseID: string,     // Response ID for performance tracking (when promoted)
  deployment: string,     // Deployment identifier from the API
  token: string,          // The session token
  hash: string | null,    // Signature hash for validation (when available)
  requested: string,      // Timestamp when the request was made
  liteValidatorRedirect: boolean,  // true = redirect to lite validator
  liteValidatorUrl: string         // URL for lite validator redirect
}
```

**Mode-Specific Behavior:**

- **Full Mode** (default): Makes an API call on every request for real-time validation
- **Hybrid Mode**: Validates signatures locally for promoted users, reducing API calls
- **Clientside Mode**: Validates entirely in the browser using cookies

**Error Handling:**

```javascript
try {
  const result = await gatekeeper.validateRequest();
  // ... handle result ...
} catch (error) {
  if (error.code === 'API_CONNECTION_FAILED') {
    // Handle based on trustOnFail setting
    // true = allow access, false = use fallback room
  }
}
```

### gatekeeper.setCookie(value, domain?)

Sets the CrowdHandler session cookie. Always call this when `result.setCookie` is true to maintain the user's queue position. The optional `domain` parameter (provided in `result.domain`) enables proper cookie scoping for wildcard domains.

```javascript
if (result.setCookie) {
  gatekeeper.setCookie(result.cookieValue, result.domain);
}
```

### gatekeeper.redirectToCleanUrl(url)

Removes CrowdHandler tracking parameters from URLs. Use when `result.stripParams` is true to keep URLs clean.

```javascript
if (result.stripParams) {
  return gatekeeper.redirectToCleanUrl(result.targetURL);
}
```

### gatekeeper.redirectIfNotPromoted()

Convenience method that handles the complete redirect flow for non-promoted users. Automatically manages cookies and redirects.

```javascript
if (!result.promoted) {
  return gatekeeper.redirectIfNotPromoted();
}
```

### gatekeeper.redirectIfPromoted()

Redirects promoted users from a waiting room implementation back to the target site with fresh CrowdHandler parameters. This method is specifically for use in waiting room implementations.

```javascript
// In waiting room implementation
if (result.promoted) {
  return gatekeeper.redirectIfPromoted();
}
```

**Use Case:** When building a custom waiting room that runs on your infrastructure, this method handles the redirect back to the protected resource with proper CrowdHandler parameters.

### gatekeeper.recordPerformance(options?)

Records performance metrics to help CrowdHandler optimize queue flow and capacity.

```javascript
// Simple usage (recommended)
await gatekeeper.recordPerformance();

// With custom options
await gatekeeper.recordPerformance({
  sample: 0.2,  // Sample 20% of requests
  factor: 100   // Custom timing factor
});
```

### gatekeeper.overrideWaitingRoomUrl(url)

Overrides the default CrowdHandler waiting room with your custom URL.

```javascript
// Redirect to your custom queue page
gatekeeper.overrideWaitingRoomUrl('https://mysite.com/custom-queue');
```

## Configuration

### Initialization Options

```javascript
const instance = crowdhandler.init({
  // Required
  publicKey: 'YOUR_PUBLIC_KEY',
  
  // Optional
  privateKey: 'YOUR_PRIVATE_KEY',  // Required for private API methods
  
  // Request context (choose one based on your environment)
  request: req,           // Express/Node.js request
  response: res,          // Express/Node.js response
  lambdaEdgeEvent: event, // Lambda@Edge event
  // (none)               // Browser environment (auto-detected)
  
  // Options
  options: {
    mode: 'full',         // 'full' (default), 'hybrid', 'clientside'
    apiUrl: 'https://api.crowdhandler.com',  // Custom API endpoint
    debug: false,         // Enable debug logging
    timeout: 5000,        // API timeout in milliseconds
    trustOnFail: true,    // Allow access if API fails
    fallbackSlug: '',     // Fallback room slug when trustOnFail is false
    cookieName: 'crowdhandler',  // Custom cookie name (default: 'crowdhandler')
    waitingRoom: false,   // Set to true if SDK is running in a waiting room context
    liteValidator: false, // Enable lite validator mode (default: false)
    roomsConfig: [{       // Array of room configurations for lite validator
      domain: string,     // e.g. 'https://example.com'
      slug: string,       // Room identifier
      urlPattern?: string,  // URL pattern to match
      patternType?: 'regex' | 'contains' | 'all',
      queueActivatesOn?: number,  // Unix timestamp
      timeout?: number    // Timeout in seconds
    }]
  }
});
```

## Validation Modes

### Full Mode (Default)
Best for most server-side integrations.

- ✅ **Pros**: Simple setup, no private key required, full features
- ❌ **Cons**: API call on every request (20-100ms latency)

### Hybrid Mode
For performance-critical applications.

- ✅ **Pros**: Minimal latency (2-10ms), fewer API calls
- ❌ **Cons**: Requires private key, needs client-side JavaScript for auxilery functionality

```javascript
const instance = crowdhandler.init({
  publicKey: 'YOUR_PUBLIC_KEY',
  privateKey: 'YOUR_PRIVATE_KEY',  // Required for hybrid mode
  options: { mode: 'hybrid' }
});
```

### Clientside Mode
For single-page applications and static sites.

- ✅ **Pros**: Works without server, easy integration
- ❌ **Cons**: Client-side only, requires JavaScript

## Custom Cookie Name

By default, CrowdHandler uses `crowdhandler` as the cookie name. You can override this with a custom name:

```javascript
const { gatekeeper } = crowdhandler.init({
  publicKey: 'YOUR_PUBLIC_KEY',
  options: {
    cookieName: 'my-custom-queue'  // Use custom cookie name
  }
});
```

This is useful when:
- Running multiple CrowdHandler instances on the same domain
- Avoiding conflicts with existing cookies
- Meeting specific naming conventions

## API Client

The SDK provides a unified client for both public and private APIs:

```javascript
// List all waiting rooms
const rooms = await client.rooms().get();

// Get specific room
const room = await client.rooms().get('room_id');

// Create a new room (requires privateKey)
const newRoom = await client.rooms().post({
  name: 'Product Launch',
  domain: 'example.com'
});

// Update room settings
await client.rooms().put('room_id', {
  capacity: 1000
});

// Delete a room
await client.rooms().delete('room_id');
```

### Available Resources

**Public API** (publicKey only):
- `client.requests()` - Request validation  
- `client.responses()` - Response tracking
- `client.rooms()` - Waiting room information

**Private API** (requires privateKey):
- `client.account()` - Account information
- `client.accountPlan()` - Account plan details
- `client.codes()` - Access code management
- `client.domains()` - Domain configuration
- `client.domainIPs()` - Domain IP addresses
- `client.domainReports()` - Domain analytics
- `client.domainRequests()` - Domain request logs
- `client.domainRooms()` - Rooms for a domain
- `client.domainURLs()` - Protected URLs
- `client.groups()` - Access code groups
- `client.groupBatch()` - Batch code operations
- `client.groupCodes()` - Codes in a group
- `client.ips()` - IP address management
- `client.reports()` - Analytics reports
- `client.rooms()` - Waiting room management
- `client.roomReports()` - Room analytics
- `client.roomSessions()` - Active room sessions
- `client.sessions()` - Session management
- `client.templates()` - Waiting room templates

All methods support standard REST operations where applicable:
- `.get()` - List all or get specific resource by ID
- `.post(data)` - Create new resource
- `.put(id, data)` - Update existing resource
- `.patch(id, data)` - Partial update
- `.delete(id)` - Delete resource

Full API documentation with request/response examples is available in your [CrowdHandler dashboard](https://admin.crowdhandler.com) under Account → API.

## Error Handling

All SDK errors are instances of `CrowdHandlerError` with helpful context:

```javascript
try {
  const rooms = await client.rooms().get();
} catch (error) {
  console.error(error.code);       // 'ROOM_NOT_FOUND'
  console.error(error.message);    // Human-readable message
  console.error(error.suggestion); // Helpful next steps
  console.error(error.statusCode); // HTTP status code
}
```

### Error Codes

- `INVALID_CONFIG` - Invalid SDK configuration
- `MISSING_PRIVATE_KEY` - Private key required for this operation
- `API_CONNECTION_FAILED` - Cannot reach CrowdHandler API
- `RESOURCE_NOT_FOUND` - Requested resource doesn't exist
- `RATE_LIMITED` - Too many requests
- Plus more specific error codes

## Integration Examples

See the [examples directory](https://github.com/Crowdhandler/crowdhandler-javascript-sdk/tree/main/examples) for complete working examples including:
- Express.js implementations (full protection, API-only, private API)
- Lambda@Edge handlers  
- React integration
- Error handling patterns
- TypeScript usage

### Express.js

```javascript
const express = require('express');
const crowdhandler = require('crowdhandler-sdk');

const app = express();

// Middleware to protect routes
async function protectRoute(req, res, next) {
  try {
    const { gatekeeper } = crowdhandler.init({
      publicKey: process.env.CROWDHANDLER_PUBLIC_KEY,
      request: req,
      response: res
    });

    const result = await gatekeeper.validateRequest();
    
    if (result.setCookie) {
      gatekeeper.setCookie(result.cookieValue, result.domain);
    }
    
    if (result.stripParams) {
      return gatekeeper.redirectToCleanUrl(result.targetURL);
    }
    
    if (!result.promoted) {
      return gatekeeper.redirectIfNotPromoted();
    }
    
    // User is promoted, continue
    res.locals.gatekeeper = gatekeeper;
    next();
  } catch (error) {
    console.error('CrowdHandler error:', error);
    // Decide whether to block or allow on error
    next();
  }
}

// Protect specific routes
app.get('/limited-product', protectRoute, (req, res) => {
  res.send('This is a limited product page!');
  
  // Record performance after response
  if (res.locals.gatekeeper) {
    res.locals.gatekeeper.recordPerformance();
  }
});
```

### Lambda@Edge

```javascript
const crowdhandler = require('crowdhandler-sdk');

exports.handler = async (event) => {
  const { gatekeeper } = crowdhandler.init({
    publicKey: process.env.CROWDHANDLER_PUBLIC_KEY,
    lambdaEdgeEvent: event
  });

  const result = await gatekeeper.validateRequest();
  
  if (!result.promoted) {
    // Redirect to waiting room
    return {
      status: '302',
      statusDescription: 'Found',
      headers: {
        location: [{
          key: 'Location',
          value: result.targetURL
        }]
      }
    };
  }
  
  // Continue with normal request processing
  return event.Records[0].cf.request;
};
```

### React / Next.js

```javascript
import { useEffect, useState } from 'react';
import { init } from 'crowdhandler-sdk';

function ProtectedComponent() {
  const [isPromoted, setIsPromoted] = useState(null);
  
  useEffect(() => {
    const checkAccess = async () => {
      const { gatekeeper } = init({
        publicKey: 'YOUR_PUBLIC_KEY',
        options: { mode: 'clientside' }
      });
      
      const result = await gatekeeper.validateRequest();
      
      if (!result.promoted) {
        window.location.href = result.targetURL;
      } else {
        setIsPromoted(true);
      }
    };
    
    checkAccess();
  }, []);
  
  if (isPromoted === null) return <div>Checking access...</div>;
  if (!isPromoted) return <div>Redirecting to waiting room...</div>;
  
  return <div>Protected content here!</div>;
}
```

## Advanced Features

### Override Waiting Room URL

```javascript
gatekeeper.overrideWaitingRoomUrl('https://custom-wait.example.com');
```

### Custom Ignore Patterns

```javascript
// Don't check these paths
gatekeeper.setIgnoreUrls(/\.(css|js|png|jpg)$/);
```

### Override Request Details

```javascript
gatekeeper.overrideHost('example.com');
gatekeeper.overridePath('/special-path');
gatekeeper.overrideIP('203.0.113.0');
gatekeeper.overrideLang('en-US');
gatekeeper.overrideUserAgent('Custom Bot 1.0');
```

### Performance Recording

```javascript
// Basic usage (records automatically)
await gatekeeper.recordPerformance();

// With options
await gatekeeper.recordPerformance({
  sample: 1.0,           // Record 100% of requests (default 0.2)
  statusCode: 200,       // HTTP status code
  overrideElapsed: 1234  // Custom timing in ms
});
```

### Lite Validator Mode

Lite validator mode provides token refresh without API calls by checking room configuration locally. To enable it:

1. Set `liteValidator: true` in options
2. Fetch and provide your rooms configuration from the CrowdHandler API

```javascript
// First, fetch your rooms configuration
const { client } = init({ publicKey: 'YOUR_PUBLIC_KEY' });
const roomsResponse = await client.rooms().get();

// Then initialize with lite validator enabled
const { gatekeeper } = init({
  publicKey: 'YOUR_PUBLIC_KEY',
  request: req,
  response: res,
  options: {
    liteValidator: true,              // Enable lite validator
    roomsConfig: roomsResponse.result // Pass the rooms array from API
  }
});

// Handle the lite validator redirect
const result = await gatekeeper.validateRequest();

if (result.liteValidatorRedirect) {
  // Redirect to refresh token/session
  return gatekeeper.redirect(result.liteValidatorUrl);
}
```

**When lite validator activates:**
- URL matches a room in your config
- Token is missing or >12 hours old
- Redirects to CrowdHandler to refresh session

## Testing

The SDK includes comprehensive testing tools:

### Local Test Server

```bash
# Start test server with your keys
npm run test:server -- --publicKey=YOUR_KEY --privateKey=YOUR_PRIVATE_KEY

# With custom options
npm run test:server -- --apiUrl=https://staging-api.crowdhandler.com --mode=hybrid

# Development mode (auto-rebuilds SDK)
npm run test:server:dev
```

### Browser Test Page

1. Start the test server
2. Open http://localhost:3000/test/browser-test.html
3. Interactive testing with real API integration

### Test Client

```bash
# Run automated tests against test server
npm run test:client
```

## TypeScript Support

Full TypeScript support with type definitions included:

```typescript
import { init, CrowdHandlerError, ErrorCodes } from 'crowdhandler-sdk';
import type { Mode, Room, Domain, ValidationResult } from 'crowdhandler-sdk';

// All types are properly inferred
const { client, gatekeeper } = init({
  publicKey: 'YOUR_KEY'
});

// TypeScript knows this returns Room[]
const rooms = await client.rooms().get();

// Error handling with types
try {
  await client.domains().get();
} catch (error) {
  if (error instanceof CrowdHandlerError) {
    if (error.code === ErrorCodes.MISSING_PRIVATE_KEY) {
      // Handle missing key
    }
  }
}
```

## Build Information

The SDK is distributed in multiple formats:

- **CommonJS** (`dist/crowdhandler.cjs.js`) - For Node.js `require()`
- **ES Modules** (`dist/crowdhandler.esm.js`) - For modern `import`
- **UMD** (`dist/crowdhandler.umd.js`) - For browsers via `<script>`
- **UMD Minified** (`dist/crowdhandler.umd.min.js`) - Production browser build


## Support

- 📚 [Knowledge Base](https://www.crowdhandler.com/support)
- 📖 [API Documentation](https://admin.crowdhandler.com/account/api)
- 💬 [Email Support](mailto:support@crowdhandler.com)
- 🐛 [Report Issues](https://github.com/Crowdhandler/crowdhandler-javascript-sdk/issues)

## License

BSD 3-Clause License - see LICENSE file for details.