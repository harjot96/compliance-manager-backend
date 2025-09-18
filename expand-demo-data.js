const fs = require('fs');
const path = require('path');

// Generate expanded demo data
function generateExpandedDemoData() {
  const expandedData = {
    organization: [
      {
        OrganisationID: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        Name: "Demo Company Ltd",
        LegalName: "Demo Company Limited",
        PaysTax: true,
        Version: "AU",
        OrganisationType: "COMPANY",
        BaseCurrency: "AUD",
        CountryCode: "AU",
        IsDemoCompany: true,
        OrganisationStatus: "ACTIVE",
        RegistrationNumber: "123456789",
        TaxNumber: "12345678901",
        FinancialYearEndDay: 30,
        FinancialYearEndMonth: 6,
        SalesTaxBasis: "ACCRUALS",
        SalesTaxPeriod: "QUARTERLY",
        DefaultSalesTax: "GST on Income",
        DefaultPurchasesTax: "GST on Expenses",
        PeriodLockDate: "2024-06-30T00:00:00",
        EndOfYearLockDate: "2024-06-30T00:00:00",
        CreatedDateUTC: "2023-01-15T00:00:00Z",
        Timezone: "AUSEASTERNSTANDARDTIME"
      }
    ],
    contacts: [],
    accounts: [],
    invoices: [],
    items: [],
    'bank-transactions': [],
    'tax-rates': [],
    receipts: [],
    'purchase-orders': [],
    quotes: [],
    'tracking-categories': [],
    'credit-notes': [],
    'manual-journals': [],
    prepayments: [],
    overpayments: [],
    reports: []
  };

  // Generate 50 contacts
  const businessTypes = ['Pty Ltd', 'Ltd', 'Corp', 'Group', 'Solutions', 'Services', 'Industries', 'Holdings', 'Enterprises'];
  const businessNames = ['Tech', 'Global', 'Premier', 'Advanced', 'Elite', 'Professional', 'Dynamic', 'Strategic', 'Innovative', 'Superior', 'Excellence', 'Prime', 'Quality', 'Reliable', 'Trusted', 'Leading', 'Modern', 'Smart', 'Digital', 'Creative'];
  const cities = ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Darwin', 'Hobart', 'Canberra'];
  const states = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'NT', 'TAS', 'ACT'];

  for (let i = 1; i <= 50; i++) {
    const businessName = businessNames[Math.floor(Math.random() * businessNames.length)];
    const businessType = businessTypes[Math.floor(Math.random() * businessTypes.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const state = states[cities.indexOf(city)];
    const isSupplier = i > 35; // Last 15 are suppliers
    
    expandedData.contacts.push({
      ContactID: `contact-${i.toString().padStart(3, '0')}-${Math.random().toString(36).substr(2, 9)}`,
      ContactStatus: 'ACTIVE',
      Name: `${businessName} ${businessType}`,
      FirstName: '',
      LastName: '',
      EmailAddress: `info@${businessName.toLowerCase()}${businessType.toLowerCase().replace(' ', '')}.com.au`,
      ContactPersons: [],
      BankAccountDetails: '',
      TaxNumber: `${(12345678900 + i).toString()}`,
      AccountsReceivableTaxType: 'GST on Income',
      AccountsPayableTaxType: 'GST on Expenses',
      Addresses: [{
        AddressType: 'STREET',
        AddressLine1: `${Math.floor(Math.random() * 999) + 1} ${businessName} Street`,
        City: city,
        Region: state,
        PostalCode: `${Math.floor(Math.random() * 9000) + 1000}`,
        Country: 'Australia'
      }],
      Phones: [{
        PhoneType: 'DEFAULT',
        PhoneNumber: `0${Math.floor(Math.random() * 9) + 1} ${Math.floor(Math.random() * 9000) + 1000} ${Math.floor(Math.random() * 9000) + 1000}`
      }],
      IsSupplier: isSupplier,
      IsCustomer: !isSupplier,
      DefaultCurrency: 'AUD',
      UpdatedDateUTC: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}T00:00:00Z`,
      HasAttachments: false
    });
  }

  // Generate 30 accounts
  const accountTypes = [
    { code: '200', name: 'Sales', type: 'REVENUE', description: 'Sales Revenue' },
    { code: '260', name: 'Other Revenue', type: 'REVENUE', description: 'Other Revenue Sources' },
    { code: '400', name: 'Advertising', type: 'EXPENSE', description: 'Advertising and Marketing' },
    { code: '404', name: 'Bank Fees', type: 'EXPENSE', description: 'Bank Fees and Charges' },
    { code: '408', name: 'Cleaning', type: 'EXPENSE', description: 'Cleaning Services' },
    { code: '412', name: 'Consulting', type: 'EXPENSE', description: 'Consulting and Professional Fees' },
    { code: '420', name: 'Entertainment', type: 'EXPENSE', description: 'Entertainment Expenses' },
    { code: '429', name: 'General Expenses', type: 'EXPENSE', description: 'General Business Expenses' },
    { code: '433', name: 'Insurance', type: 'EXPENSE', description: 'Insurance Premiums' },
    { code: '449', name: 'Legal expenses', type: 'EXPENSE', description: 'Legal and Professional Fees' },
    { code: '453', name: 'Light, Power, Heating', type: 'EXPENSE', description: 'Utilities' },
    { code: '461', name: 'Motor Vehicle Expenses', type: 'EXPENSE', description: 'Vehicle Running Costs' },
    { code: '469', name: 'Office Expenses', type: 'EXPENSE', description: 'Office Supplies and Equipment' },
    { code: '477', name: 'Printing & Stationery', type: 'EXPENSE', description: 'Printing and Stationery' },
    { code: '485', name: 'Rent', type: 'EXPENSE', description: 'Rent and Lease Payments' },
    { code: '493', name: 'Repairs and Maintenance', type: 'EXPENSE', description: 'Repairs and Maintenance' },
    { code: '505', name: 'Subscriptions', type: 'EXPENSE', description: 'Subscriptions and Memberships' },
    { code: '513', name: 'Telephone & Internet', type: 'EXPENSE', description: 'Telecommunications' },
    { code: '521', name: 'Training & Development', type: 'EXPENSE', description: 'Staff Training' },
    { code: '529', name: 'Travel - National', type: 'EXPENSE', description: 'Domestic Travel' },
    { code: '090', name: 'Business Bank Account', type: 'BANK', description: 'Primary Business Account' },
    { code: '091', name: 'Petty Cash', type: 'CURRENT', description: 'Petty Cash Account' },
    { code: '610', name: 'Accounts Receivable', type: 'CURRENT', description: 'Trade Debtors' },
    { code: '620', name: 'Inventory', type: 'CURRENT', description: 'Stock on Hand' },
    { code: '630', name: 'GST', type: 'CURRENT', description: 'GST Control Account' },
    { code: '800', name: 'Accounts Payable', type: 'CURRENT', description: 'Trade Creditors' },
    { code: '825', name: 'Accrued Expenses', type: 'CURRENT', description: 'Accrued Liabilities' },
    { code: '850', name: 'PAYG Withholdings Payable', type: 'CURRENT', description: 'PAYG Tax Payable' },
    { code: '855', name: 'Superannuation Payable', type: 'CURRENT', description: 'Super Contributions Payable' },
    { code: '860', name: 'Wages Payable', type: 'CURRENT', description: 'Wages and Salaries Payable' }
  ];

  accountTypes.forEach((account, index) => {
    expandedData.accounts.push({
      AccountID: `account-${(index + 1).toString().padStart(3, '0')}-${Math.random().toString(36).substr(2, 9)}`,
      Code: account.code,
      Name: account.name,
      Type: account.type,
      TaxType: account.type === 'REVENUE' ? 'GST on Income' : account.type === 'EXPENSE' ? 'GST on Expenses' : 'GST Free',
      Description: account.description,
      Class: account.type,
      SystemAccount: account.code === '200' ? 'SALES' : '',
      EnablePaymentsToAccount: account.type === 'BANK',
      ShowInExpenseClaims: account.type === 'EXPENSE',
      BankAccountNumber: account.type === 'BANK' ? `${Math.floor(Math.random() * 900000000) + 100000000}` : '',
      BankAccountType: account.type === 'BANK' ? 'BANK' : '',
      CurrencyCode: 'AUD',
      ReportingCode: '',
      ReportingCodeName: '',
      HasAttachments: false,
      UpdatedDateUTC: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-15T00:00:00Z`,
      AddToWatchlist: false
    });
  });

  // Generate 75 invoices
  for (let i = 1; i <= 75; i++) {
    const amount = Math.floor(Math.random() * 10000) + 500;
    const gst = Math.floor(amount * 0.1);
    const total = amount + gst;
    const contactIndex = Math.floor(Math.random() * 35); // Only use customer contacts
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const dueDate = new Date(date);
    dueDate.setDate(dueDate.getDate() + 30);
    
    const statuses = ['AUTHORISED', 'PAID', 'VOIDED'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    expandedData.invoices.push({
      InvoiceID: `invoice-${i.toString().padStart(3, '0')}-${Math.random().toString(36).substr(2, 9)}`,
      InvoiceNumber: `INV-2024-${i.toString().padStart(3, '0')}`,
      Type: 'ACCREC',
      Contact: {
        ContactID: expandedData.contacts[contactIndex].ContactID,
        Name: expandedData.contacts[contactIndex].Name
      },
      Date: date.toISOString().split('T')[0],
      DueDate: dueDate.toISOString().split('T')[0],
      Status: status,
      LineAmountTypes: 'Exclusive',
      LineItems: [{
        LineItemID: `line-${i}-${Math.random().toString(36).substr(2, 9)}`,
        Description: `Professional Services - Invoice ${i}`,
        Quantity: Math.floor(Math.random() * 20) + 1,
        UnitAmount: Math.floor(amount / Math.floor(Math.random() * 20 + 1)),
        LineAmount: amount,
        AccountCode: '200',
        TaxType: 'GST on Income'
      }],
      SubTotal: amount,
      TotalTax: gst,
      Total: total,
      AmountDue: status === 'PAID' ? 0 : total,
      AmountPaid: status === 'PAID' ? total : 0,
      AmountCredited: 0,
      CurrencyRate: 1,
      CurrencyCode: 'AUD',
      FullyPaidOnDate: status === 'PAID' ? date.toISOString().split('T')[0] : null,
      Reference: `Project ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 100)}`,
      BrandingThemeID: `brand-${Math.random().toString(36).substr(2, 9)}`,
      Url: `https://in.xero.com/AccountsReceivable/Edit.aspx?InvoiceID=${Math.random().toString(36).substr(2, 9)}`,
      SentToContact: true,
      ExpectedPaymentDate: status === 'AUTHORISED' ? dueDate.toISOString().split('T')[0] : null,
      PlannedPaymentDate: status === 'AUTHORISED' ? dueDate.toISOString().split('T')[0] : null,
      HasAttachments: Math.random() > 0.8,
      IsDiscounted: false,
      HasErrors: false,
      InvoiceType: 'ACCREC',
      UpdatedDateUTC: `${date.toISOString().split('T')[0]}T${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00Z`
    });
  }

  // Generate more items, transactions, etc.
  const itemNames = ['Consulting Hours', 'Software License', 'Training Session', 'Support Package', 'Development Work', 'Design Services', 'Marketing Package', 'Maintenance Contract', 'Installation Service', 'Technical Support'];
  
  for (let i = 1; i <= 25; i++) {
    const itemName = itemNames[Math.floor(Math.random() * itemNames.length)];
    const price = Math.floor(Math.random() * 500) + 50;
    
    expandedData.items.push({
      ItemID: `item-${i.toString().padStart(3, '0')}-${Math.random().toString(36).substr(2, 9)}`,
      Code: `ITEM${i.toString().padStart(3, '0')}`,
      Name: `${itemName} ${i}`,
      Description: `Professional ${itemName.toLowerCase()} service`,
      PurchaseDescription: `Purchase of ${itemName.toLowerCase()}`,
      SalesDetails: {
        UnitPrice: price,
        AccountCode: '200',
        TaxType: 'GST on Income',
        IsSold: true,
        IsPurchased: false
      },
      PurchaseDetails: {
        UnitPrice: Math.floor(price * 0.8),
        AccountCode: '400',
        TaxType: 'GST on Expenses',
        IsSold: false,
        IsPurchased: true
      },
      IsTrackedAsInventory: false,
      IsSold: true,
      IsPurchased: true,
      InventoryAssetAccountCode: '620',
      TotalCostPool: Math.floor(price * Math.random() * 10),
      QuantityOnHand: Math.floor(Math.random() * 100),
      UpdatedDateUTC: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-15T00:00:00Z`
    });
  }

  return expandedData;
}

// Generate the expanded data
const expandedData = generateExpandedDemoData();

// Read the current demo controller file
const demoControllerPath = path.join(__dirname, 'src/controllers/demoXeroController.js');
let fileContent = fs.readFileSync(demoControllerPath, 'utf8');

// Replace the sampleXeroData object
const startMarker = 'const sampleXeroData = {';
const endMarker = '};';

const startIndex = fileContent.indexOf(startMarker);
const endIndex = fileContent.indexOf(endMarker, startIndex) + endMarker.length;

if (startIndex !== -1 && endIndex !== -1) {
  const newDataString = `const sampleXeroData = ${JSON.stringify(expandedData, null, 2)};`;
  
  const newFileContent = fileContent.substring(0, startIndex) + 
                        newDataString + 
                        fileContent.substring(endIndex);
  
  // Write the updated file
  fs.writeFileSync(demoControllerPath, newFileContent);
  
  console.log('✅ Demo data expanded successfully!');
  console.log(`📊 Generated data:`);
  console.log(`   - Contacts: ${expandedData.contacts.length} records`);
  console.log(`   - Invoices: ${expandedData.invoices.length} records`);
  console.log(`   - Accounts: ${expandedData.accounts.length} records`);
  console.log(`   - Items: ${expandedData.items.length} records`);
  console.log(`   - Organization: ${expandedData.organization.length} record`);
} else {
  console.error('❌ Could not find sampleXeroData in the file');
}
