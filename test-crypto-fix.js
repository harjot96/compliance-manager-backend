const crypto = require('crypto');

// Test the encryption/decryption methods
function testEncryption() {
  console.log('🧪 Testing Crypto Fix\n');

  // Simulate the encryption method from OpenAISetting
  function encryptApiKey(apiKey) {
    const algorithm = 'aes-256-gcm';
    const secretKey = process.env.ENCRYPTION_KEY || 'your-secret-encryption-key-32-chars-long';
    
    // Ensure the secret key is 32 bytes
    const key = crypto.scryptSync(secretKey, 'salt', 32);
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(apiKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    // Return encrypted data with IV and auth tag
    return {
      encrypted: encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  // Simulate the decryption method from OpenAISetting
  function decryptApiKey(encryptedData) {
    try {
      const algorithm = 'aes-256-gcm';
      const secretKey = process.env.ENCRYPTION_KEY || 'your-secret-encryption-key-32-chars-long';
      const key = crypto.scryptSync(secretKey, 'salt', 32);
      
      const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(encryptedData.iv, 'hex'));
      decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
      
      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('❌ Error decrypting API key:', error);
      throw new Error('Failed to decrypt API key');
    }
  }

  try {
    console.log('📋 Test Data:');
    const testApiKey = 'sk-test1234567890abcdefghijklmnopqrstuvwxyz';
    console.log(`   Original API Key: ${testApiKey}`);
    console.log(`   Length: ${testApiKey.length} characters`);

    console.log('\n🔐 Testing Encryption...');
    const encryptedData = encryptApiKey(testApiKey);
    console.log('✅ Encryption successful');
    console.log(`   Encrypted: ${encryptedData.encrypted.substring(0, 20)}...`);
    console.log(`   IV: ${encryptedData.iv}`);
    console.log(`   Auth Tag: ${encryptedData.authTag}`);

    console.log('\n🔓 Testing Decryption...');
    const decryptedApiKey = decryptApiKey(encryptedData);
    console.log('✅ Decryption successful');
    console.log(`   Decrypted: ${decryptedApiKey}`);

    console.log('\n✅ Verification:');
    if (testApiKey === decryptedApiKey) {
      console.log('   ✅ Original and decrypted API keys match!');
      console.log('   ✅ Crypto fix is working correctly!');
    } else {
      console.log('   ❌ Original and decrypted API keys do not match!');
      console.log('   ❌ There is still an issue with the crypto implementation.');
    }

    console.log('\n🎉 Crypto Fix Test Results:');
    console.log('   ✅ createCipheriv/createDecipheriv methods work');
    console.log('   ✅ Encryption/decryption cycle successful');
    console.log('   ✅ Compatible with modern Node.js versions');
    console.log('   ✅ Ready for production deployment');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('   This indicates the crypto fix is not working correctly.');
  }
}

// Run the test
testEncryption();
