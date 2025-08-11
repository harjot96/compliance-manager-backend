const XeroSettings = require('./src/models/XeroSettings');
const db = require('./src/config/database');

async function migrateXeroTokens() {
  try {
    console.log('🔧 Starting Xero tokens migration...');
    
    // Add token columns to existing table
    await XeroSettings.addTokenColumns();
    
    console.log('✅ Xero tokens migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateXeroTokens();
