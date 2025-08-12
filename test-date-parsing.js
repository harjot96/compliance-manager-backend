#!/usr/bin/env node

/**
 * Test script to verify date parsing fixes
 */

console.log('🧪 Testing Date Parsing Fixes\n');

// Test various date formats that might come from Xero
const testDates = [
  '2024-01-15',
  '2024-01-15T10:30:00Z',
  '2024-01-15T10:30:00.000Z',
  '2024-01-15T10:30:00+00:00',
  '2024-01-15T10:30:00.000+00:00',
  '15/01/2024',
  '01/15/2024',
  '2024-01-15 10:30:00',
  'invalid-date',
  null,
  undefined,
  '',
  '2024-13-45', // Invalid month/day
  'not-a-date'
];

console.log('📅 Testing Date Parsing:');
testDates.forEach(dateStr => {
  try {
    const date = new Date(dateStr);
    const isValid = !isNaN(date.getTime());
    const status = isValid ? '✅' : '❌';
    console.log(`${status} "${dateStr}" -> ${isValid ? date.toISOString() : 'Invalid Date'}`);
  } catch (error) {
    console.log(`❌ "${dateStr}" -> Error: ${error.message}`);
  }
});

// Test the specific logic from the dashboard
console.log('\n🔍 Testing Dashboard Date Logic:');
const mockInvoices = [
  { Status: 'PAID', DueDate: '2024-01-15', InvoiceNumber: 'INV-001' },
  { Status: 'AUTHORISED', DueDate: '2024-01-15T10:30:00Z', InvoiceNumber: 'INV-002' },
  { Status: 'AUTHORISED', DueDate: 'invalid-date', InvoiceNumber: 'INV-003' },
  { Status: 'AUTHORISED', DueDate: null, InvoiceNumber: 'INV-004' },
  { Status: 'AUTHORISED', DueDate: '2024-01-15T10:30:00.000Z', InvoiceNumber: 'INV-005' }
];

const nowISO = new Date().toISOString();
console.log(`Current time: ${nowISO}`);

const overdueInvoices = mockInvoices.filter((inv) => {
  if (inv.Status === 'PAID' || !inv.DueDate) return false;
  
  try {
    const dueDate = new Date(inv.DueDate);
    // Check if the date is valid
    if (isNaN(dueDate.getTime())) {
      console.log(`⚠️ Invalid due date format: ${inv.DueDate} for invoice: ${inv.InvoiceNumber}`);
      return false;
    }
    const isOverdue = dueDate.toISOString() < nowISO;
    console.log(`📅 Invoice ${inv.InvoiceNumber}: ${inv.DueDate} -> ${dueDate.toISOString()} -> ${isOverdue ? 'OVERDUE' : 'NOT OVERDUE'}`);
    return isOverdue;
  } catch (error) {
    console.log(`⚠️ Error parsing due date: ${inv.DueDate} for invoice: ${inv.InvoiceNumber} - ${error.message}`);
    return false;
  }
});

console.log(`\n📊 Results: ${overdueInvoices.length} overdue invoices found`);

// Test number parsing
console.log('\n💰 Testing Number Parsing:');
const mockTotals = [
  '100.50',
  '1000',
  '0',
  'invalid-number',
  null,
  undefined,
  '',
  '100.50.25' // Invalid format
];

const totalAmount = mockTotals.reduce((sum, total) => {
  try {
    return sum + (parseFloat(total) || 0);
  } catch (error) {
    console.log(`⚠️ Error parsing total: ${total} - ${error.message}`);
    return sum;
  }
}, 0);

console.log(`Total amount: ${totalAmount.toFixed(2)}`);

console.log('\n✅ Date parsing tests completed!');
console.log('The fixes should now handle invalid dates gracefully.');
