const db = require('../config/database');
const XeroSettings = require('../models/XeroSettings');

const createTables = async () => {
  try {
    // Create companies table
    await db.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id SERIAL PRIMARY KEY,
        company_name VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        mobile_number VARCHAR(20) NOT NULL,
        country_code VARCHAR(5) DEFAULT '+61',
        password_hash VARCHAR(255) NOT NULL,
        bas_frequency VARCHAR(50) CHECK (bas_frequency IN ('Monthly', 'Quarterly', 'Annually')),
        fbt_applicable BOOLEAN DEFAULT FALSE,
        financial_year_end DATE,
        role VARCHAR(20) NOT NULL DEFAULT 'company',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create index on email for faster lookups
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_companies_email ON companies(email)
    `);

    // Create index on company_name for faster lookups
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_companies_company_name ON companies(company_name)
    `);

    // Create or replace the update_updated_at_column function before creating the trigger
    await db.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
    // Create trigger to update updated_at column only if it does not exist
    await db.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger WHERE tgname = 'update_companies_updated_at'
        ) THEN
          CREATE TRIGGER update_companies_updated_at 
          BEFORE UPDATE ON companies 
          FOR EACH ROW 
          EXECUTE FUNCTION update_updated_at_column();
        END IF;
      END
      $$;
    `);

    // Create notification_templates table
    await db.query(`
      CREATE TABLE IF NOT EXISTS notification_templates (
        id SERIAL PRIMARY KEY,
        type VARCHAR(10) NOT NULL CHECK (type IN ('email', 'sms')),
        name VARCHAR(100) NOT NULL UNIQUE,
        subject VARCHAR(255),
        body TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create notification_settings table
    await db.query(`
      CREATE TABLE IF NOT EXISTS notification_settings (
        id SERIAL PRIMARY KEY,
        type VARCHAR(10) NOT NULL CHECK (type IN ('smtp', 'twilio')),
        config JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create company_compliance table
    await db.query(`
      CREATE TABLE IF NOT EXISTS company_compliance (
        id SERIAL PRIMARY KEY,
        company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        bas_frequency VARCHAR(20) NOT NULL,
        next_bas_due DATE NOT NULL,
        fbt_applicable BOOLEAN NOT NULL,
        next_fbt_due DATE,
        ias_required BOOLEAN NOT NULL,
        ias_frequency VARCHAR(20),
        next_ias_due DATE,
        financial_year_end DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add new columns for compliance details if they do not exist
    await db.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='companies' AND column_name='next_bas_due') THEN
          ALTER TABLE companies ADD COLUMN next_bas_due DATE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='companies' AND column_name='next_fbt_due') THEN
          ALTER TABLE companies ADD COLUMN next_fbt_due DATE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='companies' AND column_name='ias_required') THEN
          ALTER TABLE companies ADD COLUMN ias_required BOOLEAN;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='companies' AND column_name='ias_frequency') THEN
          ALTER TABLE companies ADD COLUMN ias_frequency VARCHAR(20);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='companies' AND column_name='next_ias_due') THEN
          ALTER TABLE companies ADD COLUMN next_ias_due DATE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='companies' AND column_name='country_code') THEN
          ALTER TABLE companies ADD COLUMN country_code VARCHAR(5) DEFAULT '+61';
        END IF;
      END
      $$;
    `);

    // Create cronjob_settings table
    await db.query(`
      CREATE TABLE IF NOT EXISTS cronjob_settings (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL UNIQUE,
        duration_days INTEGER NOT NULL DEFAULT 1,
        enabled BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create compliance_deadlines table (single row, JSONB column)
    await db.query(`
      CREATE TABLE IF NOT EXISTS compliance_deadlines (
        id SERIAL PRIMARY KEY,
        deadlines JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    // Ensure at least one row exists
    await db.query(`
      INSERT INTO compliance_deadlines (deadlines)
      SELECT '{}'::jsonb
      WHERE NOT EXISTS (SELECT 1 FROM compliance_deadlines)
    `);

    // Create openai_settings table
    await db.query(`
      CREATE TABLE IF NOT EXISTS openai_settings (
        id SERIAL PRIMARY KEY,
        api_key_encrypted TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_by INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Xero settings table
    await XeroSettings.createTable();

    // Create xero_oauth_states table for OAuth flow
    await db.query(`
      CREATE TABLE IF NOT EXISTS xero_oauth_states (
        id SERIAL PRIMARY KEY,
        state VARCHAR(255) NOT NULL UNIQUE,
        company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create index for faster lookups
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_xero_oauth_states_state ON xero_oauth_states(state)
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

const dropTables = async () => {
  try {
    await db.query('DROP TABLE IF EXISTS companies CASCADE');
    await db.query('DROP TABLE IF EXISTS openai_settings CASCADE');
    await db.query('DROP TABLE IF EXISTS xero_settings CASCADE');
    await db.query('DROP TABLE IF EXISTS xero_oauth_states CASCADE');
    await db.query('DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE');
    console.log('Database tables dropped successfully');
  } catch (error) {
    console.error('Error dropping tables:', error);
    throw error;
  }
};

// Add migration to alter table and add role column if it does not exist
const addRoleColumn = async () => {
  try {
    await db.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='companies' AND column_name='role'
        ) THEN
          ALTER TABLE companies ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'company';
        END IF;
      END
      $$;
    `);
    console.log("'role' column added to companies table (if not exists)");
  } catch (error) {
    console.error("Error adding 'role' column:", error);
    throw error;
  }
};

const runMigrations = async () => {
  try {
    console.log('Running migrations...');
    
    // Add columns to notification_templates if they don't exist
    await db.query(`
      ALTER TABLE notification_templates 
      ADD COLUMN IF NOT EXISTS notification_types JSONB DEFAULT '[]',
      ADD COLUMN IF NOT EXISTS sms_days JSONB DEFAULT '[]',
      ADD COLUMN IF NOT EXISTS email_days JSONB DEFAULT '[]';
    `);
    
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
  }
};

/**
 * Migrate OpenAI settings table to remove unused columns
 */
async function migrateOpenAISettings() {
  try {
    console.log('🔄 Starting OpenAI settings migration...');
    
    // Check if columns exist before dropping them
    const checkColumnsQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'openai_settings' 
      AND column_name IN ('model', 'max_tokens', 'temperature');
    `;
    
    const existingColumns = await db.query(checkColumnsQuery);
    const columnsToDrop = existingColumns.rows.map(row => row.column_name);
    
    if (columnsToDrop.length > 0) {
      console.log(`📋 Found columns to drop: ${columnsToDrop.join(', ')}`);
      
      // Drop each column
      for (const column of columnsToDrop) {
        const dropQuery = `ALTER TABLE openai_settings DROP COLUMN IF EXISTS ${column};`;
        await db.query(dropQuery);
        console.log(`✅ Dropped column: ${column}`);
      }
      
      console.log('✅ OpenAI settings migration completed successfully');
    } else {
      console.log('ℹ️  No columns to drop - table already migrated');
    }
    
  } catch (error) {
    console.error('❌ Error during OpenAI settings migration:', error);
    throw error;
  }
}

/**
 * Run all migrations with retry logic
 */
async function runAllMigrations() {
  const maxRetries = 3;
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      console.log(`🚀 Starting database migrations (attempt ${retryCount + 1}/${maxRetries})...`);
      
      // Test database connection first
      await db.query('SELECT 1');
      console.log('✅ Database connection test successful');
      
      // Run OpenAI settings migration
      await migrateOpenAISettings();
      
      console.log('✅ All migrations completed successfully');
      return;
      
    } catch (error) {
      retryCount++;
      console.error(`❌ Migration attempt ${retryCount} failed:`, error.message);
      
      if (retryCount < maxRetries) {
        console.log(`⏳ Retrying in ${retryCount * 2} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryCount * 2000));
      } else {
        console.error('❌ All migration attempts failed');
        throw error;
      }
    }
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  const action = process.argv[2];
  
  if (action === 'drop') {
    dropTables()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else if (action === 'addRoleColumn') {
    addRoleColumn()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else if (action === 'runMigrations') {
    runMigrations()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else if (action === 'runAllMigrations') {
    runAllMigrations()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else {
    createTables()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  }
}

module.exports = { createTables, dropTables, addRoleColumn, runMigrations, migrateOpenAISettings, runAllMigrations };
