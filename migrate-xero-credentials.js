const db = require('./src/config/database');
const XeroSettings = require('./src/models/XeroSettings');

async function migrateXeroCredentials() {
  try {
    console.log('🔄 Starting Xero credentials migration...');
    
    // Add credential columns to existing table
    await XeroSettings.addCredentialColumns();
    
    console.log('✅ Xero credentials migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateXeroCredentials();
}

module.exports = migrateXeroCredentials;

