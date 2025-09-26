// Test Script for Plug and Play Xero Integration
// This script tests the complete Xero integration to ensure everything works properly

const axios = require('axios');
const crypto = require('crypto-js');

// Test configuration
const TEST_CONFIG = {
  baseUrl: process.env.API_BASE_URL || 'http://localhost:3333',
  testToken: process.env.TEST_TOKEN || 'test-token-123',
  testCompanyId: 7,
  xeroClientId: process.env.XERO_CLIENT_ID || 'test-client-id',
  xeroRedirectUri: process.env.XERO_REDIRECT_URI || 'https://test.com/callback'
};

// Test utilities
class XeroIntegrationTester {
  constructor(config) {
    this.config = config;
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : '🔍';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async test(name, testFunction) {
    try {
      this.log(`Testing: ${name}`);
      await testFunction();
      this.results.passed++;
      this.results.tests.push({ name, status: 'passed', error: null });
      this.log(`✅ PASSED: ${name}`, 'success');
    } catch (error) {
      this.results.failed++;
      this.results.tests.push({ name, status: 'failed', error: error.message });
      this.log(`❌ FAILED: ${name} - ${error.message}`, 'error');
    }
  }

  async makeRequest(method, endpoint, data = null, headers = {}) {
    const url = `${this.config.baseUrl}${endpoint}`;
    const config = {
      method,
      url,
      headers: {
        'Authorization': `Bearer ${this.config.testToken}`,
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (data) {
      config.data = data;
    }

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      throw new Error(`HTTP ${error.response?.status}: ${error.response?.data?.message || error.message}`);
    }
  }

  // Test 1: Server Health Check
  async testServerHealth() {
    const response = await axios.get(`${this.config.baseUrl}/health`);
    if (response.status !== 200) {
      throw new Error('Server health check failed');
    }
    this.log('Server is healthy', 'success');
  }

  // Test 2: Xero Settings Endpoints
  async testXeroSettings() {
    // Test save settings
    const settingsData = {
      clientId: this.config.xeroClientId,
      clientSecret: 'test-client-secret',
      redirectUri: this.config.xeroRedirectUri
    };

    const saveResponse = await this.makeRequest('POST', '/api/xero/settings', settingsData);
    if (!saveResponse.success) {
      throw new Error('Failed to save Xero settings');
    }

    // Test get settings
    const getResponse = await this.makeRequest('GET', '/api/xero/settings');
    if (!getResponse.success || !getResponse.data.clientId) {
      throw new Error('Failed to retrieve Xero settings');
    }

    // Test delete settings
    const deleteResponse = await this.makeRequest('DELETE', '/api/xero/settings');
    if (!deleteResponse.success) {
      throw new Error('Failed to delete Xero settings');
    }
  }

  // Test 3: Connection Status
  async testConnectionStatus() {
    const response = await this.makeRequest('GET', '/api/xero/status');
    if (!response.success) {
      throw new Error('Failed to get connection status');
    }
    
    // Should return not_configured since we deleted settings
    if (response.data.connectionStatus !== 'not_configured') {
      throw new Error(`Expected 'not_configured', got '${response.data.connectionStatus}'`);
    }
  }

  // Test 4: OAuth URL Generation
  async testOAuthUrlGeneration() {
    // First save settings
    const settingsData = {
      clientId: this.config.xeroClientId,
      redirectUri: this.config.xeroRedirectUri
    };
    await this.makeRequest('POST', '/api/xero/settings', settingsData);

    // Test auth URL generation
    const response = await this.makeRequest('GET', '/api/xero/connect');
    if (!response.success || !response.data.authUrl) {
      throw new Error('Failed to generate OAuth URL');
    }

    if (!response.data.authUrl.includes('login.xero.com')) {
      throw new Error('Generated URL is not a valid Xero OAuth URL');
    }

    // Clean up
    await this.makeRequest('DELETE', '/api/xero/settings');
  }

  // Test 5: Demo Data Endpoints
  async testDemoData() {
    const demoEndpoints = ['invoices', 'contacts', 'accounts', 'organization'];
    
    for (const endpoint of demoEndpoints) {
      const response = await this.makeRequest('GET', `/api/xero/demo/${endpoint}`);
      if (!response.success || !response.data) {
        throw new Error(`Failed to get demo ${endpoint} data`);
      }
    }
  }

  // Test 6: Data Endpoints (should fail without connection)
  async testDataEndpointsWithoutConnection() {
    const dataEndpoints = ['invoices', 'contacts', 'accounts', 'organization'];
    
    for (const endpoint of dataEndpoints) {
      try {
        await this.makeRequest('GET', `/api/xero/${endpoint}`);
        throw new Error(`Expected ${endpoint} endpoint to fail without connection`);
      } catch (error) {
        if (!error.message.includes('401') && !error.message.includes('connect_required')) {
          throw new Error(`Unexpected error for ${endpoint}: ${error.message}`);
        }
      }
    }
  }

  // Test 7: Health Check Endpoint
  async testHealthCheck() {
    const response = await this.makeRequest('GET', '/api/xero/health');
    if (!response.success) {
      throw new Error('Xero health check failed');
    }
  }

  // Test 8: Rate Limiting (basic test)
  async testRateLimiting() {
    // Make multiple rapid requests
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(this.makeRequest('GET', '/api/xero/health').catch(err => err));
    }
    
    const results = await Promise.all(promises);
    const successCount = results.filter(r => r.success).length;
    
    // Should allow at least some requests
    if (successCount === 0) {
      throw new Error('Rate limiting too restrictive');
    }
  }

  // Test 9: Error Handling
  async testErrorHandling() {
    // Test invalid endpoint
    try {
      await this.makeRequest('GET', '/api/xero/invalid-endpoint');
      throw new Error('Expected 404 error for invalid endpoint');
    } catch (error) {
      if (!error.message.includes('404')) {
        throw new Error(`Expected 404, got: ${error.message}`);
      }
    }

    // Test invalid resource type
    try {
      await this.makeRequest('GET', '/api/xero/invalid-resource');
      throw new Error('Expected 400 error for invalid resource type');
    } catch (error) {
      if (!error.message.includes('400') && !error.message.includes('Invalid')) {
        throw new Error(`Expected 400 for invalid resource, got: ${error.message}`);
      }
    }
  }

  // Test 10: Encryption/Decryption
  async testEncryption() {
    const testKey = 'test-encryption-key-32-characters';
    const testText = 'test-sensitive-data';
    
    // Test encryption
    const encrypted = crypto.AES.encrypt(testText, testKey).toString();
    if (!encrypted || encrypted === testText) {
      throw new Error('Encryption failed');
    }

    // Test decryption
    const decrypted = crypto.AES.decrypt(encrypted, testKey).toString(crypto.enc.Utf8);
    if (decrypted !== testText) {
      throw new Error('Decryption failed');
    }
  }

  // Run all tests
  async runAllTests() {
    this.log('🚀 Starting Plug and Play Xero Integration Tests', 'info');
    this.log(`Testing against: ${this.config.baseUrl}`, 'info');

    await this.test('Server Health Check', () => this.testServerHealth());
    await this.test('Xero Settings Management', () => this.testXeroSettings());
    await this.test('Connection Status', () => this.testConnectionStatus());
    await this.test('OAuth URL Generation', () => this.testOAuthUrlGeneration());
    await this.test('Demo Data Endpoints', () => this.testDemoData());
    await this.test('Data Endpoints Without Connection', () => this.testDataEndpointsWithoutConnection());
    await this.test('Health Check Endpoint', () => this.testHealthCheck());
    await this.test('Rate Limiting', () => this.testRateLimiting());
    await this.test('Error Handling', () => this.testErrorHandling());
    await this.test('Encryption/Decryption', () => this.testEncryption());

    // Print results
    this.log('\n📊 Test Results:', 'info');
    this.log(`✅ Passed: ${this.results.passed}`, 'success');
    this.log(`❌ Failed: ${this.results.failed}`, this.results.failed > 0 ? 'error' : 'success');
    this.log(`📈 Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1)}%`, 'info');

    if (this.results.failed > 0) {
      this.log('\n❌ Failed Tests:', 'error');
      this.results.tests
        .filter(t => t.status === 'failed')
        .forEach(t => this.log(`  - ${t.name}: ${t.error}`, 'error'));
    }

    return this.results;
  }
}

// Main execution
async function main() {
  try {
    const tester = new XeroIntegrationTester(TEST_CONFIG);
    const results = await tester.runAllTests();

    if (results.failed === 0) {
      console.log('\n🎉 All tests passed! Plug and Play Xero Integration is working correctly.');
      process.exit(0);
    } else {
      console.log('\n⚠️ Some tests failed. Please check the issues above.');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n💥 Test execution failed:', error.message);
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = { XeroIntegrationTester, TEST_CONFIG };
