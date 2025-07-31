#!/usr/bin/env node

/**
 * SendGrid Fix Script
 * Helps resolve SendGrid configuration issues
 */

console.log('🔧 SendGrid Fix Guide');
console.log('=' .repeat(50));

console.log('\n📋 Current Issue: "Forbidden" Error');
console.log('This means your SendGrid API key is not working properly.');
console.log('');

console.log('🔍 Step-by-Step Fix:');
console.log('');

console.log('1. **Check Your SendGrid API Key**');
console.log('   - Go to https://app.sendgrid.com/settings/api_keys');
console.log('   - Verify your API key: YOUR_SENDGRID_API_KEY_HERE');
console.log('   - Make sure it has "Mail Send" permissions');
console.log('   - If not, create a new API key with "Mail Send" access');
console.log('');

console.log('2. **Verify Sender Email**');
console.log('   - Go to https://app.sendgrid.com/settings/sender_auth');
console.log('   - Verify "aicomplyhub@gmail.com" as a sender');
console.log('   - Or add a new verified sender email');
console.log('');

console.log('3. **Check Account Status**');
console.log('   - Ensure your SendGrid account is active');
console.log('   - Check if you have sending credits available');
console.log('   - Verify billing status');
console.log('');

console.log('4. **Test with New Configuration**');
console.log('   - Generate a new API key if needed');
console.log('   - Use a verified sender email');
console.log('   - Update the configuration using the API');
console.log('');

console.log('5. **Alternative Solutions**');
console.log('   - Try using a different sender email');
console.log('   - Use a different API key');
console.log('   - Check SendGrid logs for detailed error info');
console.log('');

console.log('🚀 Quick Test Commands:');
console.log('');

console.log('To test with a new API key:');
console.log('curl -X POST https://compliance-manager-backend.onrender.com/api/companies/test/notification-settings \\');
console.log('  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{');
console.log('    "type": "sendgrid",');
console.log('    "config": {');
console.log('      "apiKey": "YOUR_NEW_API_KEY",');
console.log('      "fromEmail": "your-verified-email@domain.com",');
console.log('      "fromName": "Your Company Name"');
console.log('    }');
console.log('  }\'');
console.log('');

console.log('To test email sending:');
console.log('curl -X POST https://compliance-manager-backend.onrender.com/api/companies/test/email \\');
console.log('  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{');
console.log('    "companyId": 1,');
console.log('    "templateId": 7,');
console.log('    "testData": {');
console.log('      "companyName": "Test Company"');
console.log('    }');
console.log('  }\'');
console.log('');

console.log('📞 Need Help?');
console.log('- Check SendGrid documentation: https://docs.sendgrid.com/');
console.log('- Verify API key permissions in SendGrid dashboard');
console.log('- Contact SendGrid support if account issues persist');
console.log('');

console.log('✅ Once fixed, your email sending should work!'); 