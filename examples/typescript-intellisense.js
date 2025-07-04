// This example shows how to use the SDK with TypeScript
// In a real project, you would import from 'crowdhandler-sdk'
// import * as crowdhandler from 'crowdhandler-sdk';

// For this example, we'll use require since we're in the SDK itself
const crowdhandler = require('../dist/index.js');

/**
 * This example demonstrates the improved TypeScript support and IntelliSense
 */

// Example 1: API-only mode - TypeScript knows gatekeeper is not available
const apiOnly = crowdhandler.init({ 
  publicKey: 'pk_test123' 
});
// apiOnly.client is available ✓
// apiOnly.gatekeeper is undefined (TypeScript knows this!)

// Example 2: With context - TypeScript knows gatekeeper IS available
const withContext = crowdhandler.init({
  publicKey: 'pk_test123',
  privateKey: 'sk_test123',
  request: {},  // Express request
  response: {} // Express response
});
// withContext.client is available ✓
// withContext.gatekeeper is available ✓ (TypeScript knows this!)

// Example 3: Using Mode constants for better autocomplete
const hybridMode = crowdhandler.init({
  publicKey: 'pk_test123',
  privateKey: 'sk_test123',
  options: {
    mode: crowdhandler.Modes.HYBRID, // Autocomplete works!
    timeout: 10000,
    debug: true
  }
});

// Example 4: Error handling with specific error codes
async function handleErrors() {
  try {
    const { client } = crowdhandler.init({ publicKey: 'pk_test123' });
    await client.domains().get(); // This will fail
  } catch (error) {
    // All errors are CrowdHandlerError - no instanceof needed!
    switch (error.code) {
      case crowdhandler.ErrorCodes.MISSING_PRIVATE_KEY:
        console.log('Need private key for this operation');
        break;
      case crowdhandler.ErrorCodes.API_TIMEOUT:
        console.log('Request timed out');
        break;
      case crowdhandler.CROWDHANDLER_ERRORS.RATE_LIMITED:
        // Can also use the constant object
        console.log('Rate limited');
        break;
    }
  }
}

// Example 5: Using exported types
// In TypeScript, you would type this as: function processRoom(room: crowdhandler.Room)
function processRoom(room) {
  console.log(`Room ${room.id} on domain ${room.domain}`);
  console.log(`Slug: ${room.slug}, Active: ${room.status}`);
}

// Example 6: Client configuration with full type support
// In TypeScript: const clientConfig: crowdhandler.InitConfig = {
const clientConfig = {
  publicKey: 'pk_test123',
  privateKey: 'sk_test123',
  options: {
    mode: 'auto',     // TypeScript knows valid values!
    timeout: 5000,    // TypeScript knows this is number
    debug: false,     // TypeScript knows this is boolean
    apiUrl: 'https://api.crowdhandler.com',
    trustOnFail: true,
    fallbackSlug: 'default-room'
  }
};

// Example 7: Using the Client class directly (advanced usage)
const { Client } = crowdhandler;
const directClient = new Client({
  publicKey: 'pk_test123',
  privateKey: 'sk_test123',
  options: {
    timeout: 10000,
    debug: true
  }
});

// All methods have JSDoc comments for IntelliSense
directClient.rooms();     // Hover to see documentation
directClient.domains();   // Hover to see it requires private key
directClient.sessions();  // Full parameter documentation

// Example 8: Type-safe result handling
// In TypeScript: async function getActiveRooms(): Promise<crowdhandler.Room[]>
async function getActiveRooms() {
  const { client } = crowdhandler.init({ 
    publicKey: 'pk_test123' 
  });
  
  const rooms = await client.rooms().get();
  
  // TypeScript knows rooms is an array of Room objects
  return rooms.filter(room => room.status === true);
}