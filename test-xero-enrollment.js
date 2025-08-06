const axios = require('axios');

const BASE_URL = 'https://compliance-manager-backend.onrender.com';

// Test data
const testData = {
  // Super admin token (should be blocked)
  adminToken: 'your-admin-jwt-token-here',
  
  // Company token without enrollment (should be blocked)
  unenrolledCompanyToken: 'your-unenrolled-company-jwt-token-here',
  
  // Company token with enrollment (should work)
  enrolledCompanyToken: 'your-enrolled-company-jwt-token-here'
};

async function testXeroEnrollmentRestrictions() {
  console.log('🧪 Testing Xero Enrollment Restrictions\n');

  const tests = [
    {
      name: 'Super Admin - Build Auth URL (Should be blocked)',
      url: `${BASE_URL}/api/xero/login`,
      token: testData.adminToken,
      expectedStatus: 403
    },
    {
      name: 'Unenrolled Company - Build Auth URL (Should be blocked)',
      url: `${BASE_URL}/api/xero/login`,
      token: testData.unenrolledCompanyToken,
      expectedStatus: 403
    },
    {
      name: 'Enrolled Company - Build Auth URL (Should work)',
      url: `${BASE_URL}/api/xero/login`,
      token: testData.enrolledCompanyToken,
      expectedStatus: 200
    },
    {
      name: 'Super Admin - Get Company Info (Should work - view only)',
      url: `${BASE_URL}/api/xero/company-info`,
      token: testData.adminToken,
      expectedStatus: 200
    },
    {
      name: 'Unenrolled Company - Get Company Info (Should work - view only)',
      url: `${BASE_URL}/api/xero/company-info`,
      token: testData.unenrolledCompanyToken,
      expectedStatus: 200
    }
  ];

  for (const test of tests) {
    try {
      console.log(`\n📋 Testing: ${test.name}`);
      
      const response = await axios.get(test.url, {
        headers: {
          'Authorization': `Bearer ${test.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === test.expectedStatus) {
        console.log(`✅ PASS: Status ${response.status} (expected ${test.expectedStatus})`);
        
        if (response.data && response.data.data && response.data.data.enrollmentStatus) {
          console.log(`📊 Enrollment Status:`, response.data.data.enrollmentStatus);
        }
      } else {
        console.log(`❌ FAIL: Status ${response.status} (expected ${test.expectedStatus})`);
      }

    } catch (error) {
      const status = error.response?.status || 'Network Error';
      if (status === test.expectedStatus) {
        console.log(`✅ PASS: Status ${status} (expected ${test.expectedStatus})`);
        if (error.response?.data?.message) {
          console.log(`📝 Message: ${error.response.data.message}`);
        }
      } else {
        console.log(`❌ FAIL: Status ${status} (expected ${test.expectedStatus})`);
        if (error.response?.data?.message) {
          console.log(`📝 Message: ${error.response.data.message}`);
        }
      }
    }
  }

  console.log('\n🎯 Test Summary:');
  console.log('- Super admins cannot setup Xero (blocked)');
  console.log('- Unenrolled companies cannot setup Xero (blocked)');
  console.log('- Enrolled companies can setup Xero (allowed)');
  console.log('- All users can view company information');
}

// Instructions for manual testing
console.log('📋 Manual Testing Instructions:');
console.log('1. Replace the JWT tokens in testData with real tokens');
console.log('2. Run: node test-xero-enrollment.js');
console.log('3. Check that enrollment restrictions work correctly\n');

// Uncomment to run tests
// testXeroEnrollmentRestrictions();

module.exports = { testXeroEnrollmentRestrictions }; 