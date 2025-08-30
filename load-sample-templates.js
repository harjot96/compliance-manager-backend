const db = require('./src/config/database');

const sampleTemplates = [
  {
    type: 'email',
    name: 'BAS Reminder Template',
    subject: 'BAS Due Soon - Action Required',
    body: 'Dear {companyName},\n\nThis is a friendly reminder that your Business Activity Statement (BAS) is due in {daysLeft} days.\n\nPlease ensure all required documents are prepared and submitted on time to avoid any penalties.\n\nIf you have any questions or need assistance, please don\'t hesitate to contact us.\n\nBest regards,\nYour Compliance Team',
    notificationTypes: ['BAS'],
    smsDays: [],
    emailDays: [1, 7, 14]
  },
  {
    type: 'email',
    name: 'FBT Annual Return Template',
    subject: 'FBT Annual Return Due - Important Notice',
    body: 'Dear {companyName},\n\nYour Fringe Benefits Tax (FBT) Annual Return is due for lodgement.\n\nKey points to remember:\n- Ensure all fringe benefits are properly recorded\n- Verify calculations are accurate\n- Submit before the deadline to avoid penalties\n\nPlease contact us if you need assistance with your FBT return.\n\nRegards,\nYour Tax Team',
    notificationTypes: ['FBT'],
    smsDays: [],
    emailDays: [1, 14, 30]
  },
  {
    type: 'sms',
    name: 'BAS SMS Reminder',
    subject: '',
    body: 'Hi {companyName}, your BAS is due in {daysLeft} days. Please ensure timely lodgement to avoid penalties. Contact us if you need help.',
    notificationTypes: ['BAS'],
    smsDays: [1, 7],
    emailDays: []
  },
  {
    type: 'email',
    name: 'IAS Quarterly Reminder',
    subject: 'IAS Quarterly Statement Due',
    body: 'Dear {companyName},\n\nYour Instalment Activity Statement (IAS) for the current quarter is due soon.\n\nPlease ensure:\n- All income is properly declared\n- Instalment amounts are calculated correctly\n- Payment is made on time\n\nIf you need help calculating your instalments, please contact us.\n\nBest regards,\nYour Compliance Team',
    notificationTypes: ['IAS'],
    smsDays: [],
    emailDays: [1, 7, 14]
  },
  {
    type: 'email',
    name: 'Financial Year End Template',
    subject: 'Financial Year End Approaching - Action Required',
    body: 'Dear {companyName},\n\nAs the financial year end approaches, please ensure all necessary preparations are completed:\n\n- Reconcile all accounts\n- Review outstanding invoices and payments\n- Prepare for annual reporting requirements\n- Consider tax planning opportunities\n\nWe\'re here to help you with year-end procedures.\n\nRegards,\nYour Accounting Team',
    notificationTypes: ['FYEND'],
    smsDays: [],
    emailDays: [7, 14, 30]
  },
  {
    type: 'sms',
    name: 'FBT SMS Alert',
    subject: '',
    body: 'FBT Annual Return due soon. Please ensure all fringe benefits are recorded and return lodged on time.',
    notificationTypes: ['FBT'],
    smsDays: [1, 7, 14],
    emailDays: []
  },
  {
    type: 'email',
    name: 'GST Registration Reminder',
    subject: 'GST Registration Status Check',
    body: 'Dear {companyName},\n\nWe\'re checking in on your GST registration status.\n\nIf your business turnover exceeds $75,000, you may need to register for GST.\n\nPlease review your current situation and contact us if:\n- You need to register for GST\n- You have questions about GST obligations\n- You need assistance with GST compliance\n\nBest regards,\nYour Tax Team',
    notificationTypes: ['GST'],
    smsDays: [],
    emailDays: [1, 30]
  },
  {
    type: 'email',
    name: 'PAYG Withholding Reminder',
    subject: 'PAYG Withholding Compliance Check',
    body: 'Dear {companyName},\n\nThis is a reminder to ensure your PAYG withholding obligations are up to date.\n\nPlease verify:\n- All employee payments are correctly withheld\n- PAYG withholding amounts are calculated properly\n- Reports are lodged on time\n- Payments are made to the ATO\n\nContact us if you need assistance with PAYG withholding.\n\nRegards,\nYour Payroll Team',
    notificationTypes: ['PAYG'],
    smsDays: [],
    emailDays: [1, 7, 14]
  }
];

async function loadSampleTemplates() {
  try {
    console.log('🔄 Loading sample templates...');
    
    // Check if templates table exists
    const tableCheck = await db.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'notification_templates'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('❌ notification_templates table does not exist. Please run migrations first.');
      return;
    }
    
    // Insert sample templates
    for (const template of sampleTemplates) {
      const query = `
        INSERT INTO notification_templates (type, name, subject, body, notification_types, sms_days, email_days)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (name) DO NOTHING
        RETURNING id, name
      `;
      
      const result = await db.query(query, [
        template.type,
        template.name,
        template.subject,
        template.body,
        JSON.stringify(template.notificationTypes),
        JSON.stringify(template.smsDays),
        JSON.stringify(template.emailDays)
      ]);
      
      if (result.rows.length > 0) {
        console.log(`✅ Created template: ${result.rows[0].name} (ID: ${result.rows[0].id})`);
      } else {
        console.log(`⏭️  Template already exists: ${template.name}`);
      }
    }
    
    // Count total templates
    const countResult = await db.query('SELECT COUNT(*) as count FROM notification_templates');
    console.log(`📊 Total templates in database: ${countResult.rows[0].count}`);
    
    console.log('✅ Sample templates loaded successfully!');
    
  } catch (error) {
    console.error('❌ Error loading sample templates:', error);
  } finally {
    await db.end();
  }
}

// Run the script
loadSampleTemplates();
