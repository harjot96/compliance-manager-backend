const axios = require('axios');

const BASE_URL = 'http://localhost:3333';
const TEST_TOKEN = 'test-token'; // Replace with real JWT token

async function testDashboardEndpoint() {
  console.log('🔍 Testing Updated Dashboard Endpoint\n');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/xero/dashboard-data`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Dashboard endpoint response:');
    console.log('Status:', response.status);
    console.log('Success:', response.data.success);
    console.log('Message:', response.data.message);
    
    if (response.data.data) {
      const data = response.data.data;
      
      console.log('\n📊 Summary Data:');
      console.log('Total Invoices:', data.summary?.totalInvoices || 0);
      console.log('Total Contacts:', data.summary?.totalContacts || 0);
      console.log('Total Transactions:', data.summary?.totalTransactions || 0);
      console.log('Total Accounts:', data.summary?.totalAccounts || 0);
      
      console.log('\n🏢 Organization Status:');
      console.log('Is Empty:', data.organizationStatus?.isEmpty || false);
      console.log('Message:', data.organizationStatus?.message || 'No status message');
      
      if (data.organizationStatus?.suggestions) {
        console.log('\n💡 Suggestions:');
        data.organizationStatus.suggestions.forEach((suggestion, index) => {
          console.log(`${index + 1}. ${suggestion}`);
        });
      }
      
      console.log('\n🏢 Organization Info:');
      console.log('Name:', data.organization?.Name || 'N/A');
      console.log('Type:', data.organization?.OrganisationType || 'N/A');
      console.log('Status:', data.organization?.OrganisationStatus || 'N/A');
      console.log('Is Demo:', data.organization?.IsDemoCompany || 'N/A');
    }
    
  } catch (error) {
    if (error.response) {
      console.log('❌ Error Response:');
      console.log('Status:', error.response.status);
      console.log('Message:', error.response.data?.message || 'No error message');
      console.log('Error:', error.response.data?.error || 'No error details');
    } else {
      console.log('❌ Network Error:', error.message);
    }
  }
}

// Run the test
testDashboardEndpoint().catch(console.error);

