const { generateToken } = require('./src/utils/jwt');

// Create a test token for company ID 1
const testToken = generateToken({ id: 1 });

console.log('🔑 Test Token for Company ID 1:');
console.log(testToken);

// Save to a file for easy access
require('fs').writeFileSync('/tmp/test-token', testToken);
console.log('💾 Token saved to /tmp/test-token');

process.exit(0);
