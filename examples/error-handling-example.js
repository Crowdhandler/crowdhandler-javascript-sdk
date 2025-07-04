const crowdhandler = require('crowdhandler-sdk');
const { CrowdHandlerError, ErrorCodes } = crowdhandler;

/**
 * All errors thrown by the CrowdHandler SDK are now CrowdHandlerError instances.
 * This means you don't need to check instanceof - just use the error properties directly!
 */

// Example 1: Missing configuration - No instanceof check needed!
try {
  const { client } = crowdhandler.init({
    // Oops, forgot publicKey!
  });
} catch (error) {
  // All errors are now CrowdHandlerError instances
  console.log(error.toString());
  // Output:
  // CrowdHandlerError [INVALID_CONFIG]: publicKey is required
  // 💡 Suggestion: Provide your public key from the CrowdHandler dashboard: crowdhandler.init({ publicKey: "YOUR_KEY" })
}

// Example 2: Using private API without private key
async function example2() {
  try {
    const { client } = crowdhandler.init({
      publicKey: 'pk_test123'
      // No privateKey provided
    });
    
    // This will throw a helpful error
    const domains = await client.domains().get();
  } catch (error) {
    console.log(error.toString());
    // Output:
    // CrowdHandlerError [MISSING_PRIVATE_KEY]: domains() requires a private key
    // 💡 Suggestion: Initialize with: crowdhandler.init({ publicKey, privateKey })
    // 📊 Status Code: 403
  }
}

// Example 3: API connection errors
async function example3() {
  try {
    const { client } = crowdhandler.init({
      publicKey: 'pk_test123',
      options: {
        apiUrl: 'https://invalid-url.example.com',
        timeout: 1000
      }
    });
    
    const rooms = await client.rooms().get();
  } catch (error) {
    // Specific error handling based on error code
    switch (error.code) {
      case ErrorCodes.API_TIMEOUT:
        console.log('Request timed out. Try increasing timeout or check network.');
        break;
      case ErrorCodes.API_CONNECTION_FAILED:
        console.log('Could not connect to API. Check your internet connection.');
        break;
      case ErrorCodes.RATE_LIMITED:
        console.log(`Rate limited. Retry after ${error.context.retryAfter} seconds.`);
        break;
      default:
        console.log(error.toString());
    }
  }
}

// Example 4: Invalid context configuration
try {
  const { gatekeeper } = crowdhandler.init({
    publicKey: 'pk_test123',
    request: 'not-a-valid-request' // Wrong type
  });
} catch (error) {
  console.log(error.toString());
  // Output:
  // CrowdHandlerError [INVALID_CONTEXT]: Invalid context configuration
  // 💡 Suggestion: Provide either:
  // - { request, response } for Express/Node.js
  // - { lambdaEdgeEvent } for Lambda@Edge
  // - Nothing for browser environment
}

// Example 5: Resource not found
async function example5() {
  try {
    const { client } = crowdhandler.init({
      publicKey: 'pk_test123',
      privateKey: 'sk_test123'
    });
    
    // Try to get a non-existent domain
    const domain = await client.domains().get('dom_invalid123');
  } catch (error) {
    // Can still check specific error codes if needed
    if (error.code === ErrorCodes.DOMAIN_NOT_FOUND) {
      console.log(`Domain not found: ${error.context.resourceId}`);
      console.log('Suggestion:', error.suggestion);
    } else {
      // All errors have these properties
      console.log(error.message);
      console.log(error.suggestion);
    }
  }
}

// Run examples
example2();
example3();
example5();