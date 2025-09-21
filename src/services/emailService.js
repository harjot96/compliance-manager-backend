const sgMail = require('@sendgrid/mail');

class EmailService {
  constructor() {
    // Initialize SendGrid if API key is available
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }
  }

  /**
   * Send missing attachment notification email
   * @param {Object} transaction - Transaction details
   * @param {Object} uploadLink - Upload link details
   * @param {string} emailAddress - Recipient email address
   * @returns {Promise<Object>} Email result
   */
  async sendMissingAttachmentEmail(transaction, uploadLink, emailAddress) {
    try {
      if (!process.env.SENDGRID_API_KEY) {
        throw new Error('SendGrid API key not configured');
      }

      const fromEmail = process.env.FROM_EMAIL || 'noreply@compliancemanager.com';
      const companyName = process.env.COMPANY_NAME || 'Compliance Manager';
      
      const amount = transaction.moneyAtRisk?.total || transaction.Total || 0;
      const currency = transaction.moneyAtRisk?.currency || 'AUD';
      const transactionType = transaction.type || 'Transaction';
      const riskLevel = transaction.moneyAtRisk?.riskLevel || 'UNKNOWN';
      
      const subject = `Missing Receipt: ${transactionType} ${currency} ${amount}`;
      
      const htmlContent = this.generateEmailHTML(transaction, uploadLink, {
        amount,
        currency,
        transactionType,
        riskLevel
      });
      
      const textContent = this.generateEmailText(transaction, uploadLink, {
        amount,
        currency,
        transactionType,
        riskLevel
      });

      const msg = {
        to: emailAddress,
        from: {
          email: fromEmail,
          name: companyName
        },
        subject,
        text: textContent,
        html: htmlContent
      };

      const response = await sgMail.send(msg);
      
      console.log('📧 Email sent successfully:', response[0].statusCode);
      return {
        success: true,
        messageId: response[0].headers['x-message-id'],
        statusCode: response[0].statusCode
      };
    } catch (error) {
      console.error('❌ Error sending email:', error.response?.body || error.message);
      throw error;
    }
  }

  /**
   * Generate HTML email content
   */
  generateEmailHTML(transaction, uploadLink, details) {
    const { amount, currency, transactionType, riskLevel } = details;
    const expiresAt = new Date(uploadLink.expiresAt);
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Missing Receipt Alert</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
        .alert { background: ${riskLevel === 'HIGH' ? '#fef2f2' : '#fefce8'}; border: 1px solid ${riskLevel === 'HIGH' ? '#fca5a5' : '#fde047'}; padding: 15px; border-radius: 6px; margin: 15px 0; }
        .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { background: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b; border-radius: 0 0 8px 8px; }
        .transaction-details { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🧾 Missing Receipt Alert</h1>
    </div>
    
    <div class="content">
        <p>A transaction is missing a receipt and requires your attention.</p>
        
        <div class="transaction-details">
            <h3>Transaction Details</h3>
            <p><strong>Type:</strong> ${transactionType}</p>
            <p><strong>Amount:</strong> ${currency} ${amount}</p>
            <p><strong>Transaction ID:</strong> ${uploadLink.transactionId}</p>
            <p><strong>Risk Level:</strong> <span style="color: ${riskLevel === 'HIGH' ? '#dc2626' : '#d97706'}">${riskLevel}</span></p>
        </div>
        
        <div class="alert">
            <strong>${riskLevel === 'HIGH' ? '⚠️ High Risk' : '⚡ Attention Required'}</strong><br>
            ${riskLevel === 'HIGH' 
              ? 'This transaction exceeds the GST threshold and may result in compliance issues if not resolved.'
              : 'Please upload a receipt to maintain proper record keeping.'
            }
        </div>
        
        <p>Click the button below to upload your receipt:</p>
        
        <div style="text-align: center;">
            <a href="${uploadLink.publicUrl}" class="button">Upload Receipt</a>
        </div>
        
        <p><strong>Important:</strong></p>
        <ul>
            <li>This link expires on ${expiresAt.toLocaleDateString()} at ${expiresAt.toLocaleTimeString()}</li>
            <li>The link can only be used once</li>
            <li>Accepted formats: JPG, PNG, PDF (max 10MB)</li>
        </ul>
        
        <p>If you have any questions, please contact your accounting team.</p>
    </div>
    
    <div class="footer">
        <p>This is an automated message from your compliance management system.</p>
        <p>Please do not reply to this email.</p>
    </div>
</body>
</html>`;
  }

  /**
   * Generate plain text email content
   */
  generateEmailText(transaction, uploadLink, details) {
    const { amount, currency, transactionType, riskLevel } = details;
    const expiresAt = new Date(uploadLink.expiresAt);
    
    return `
MISSING RECEIPT ALERT

A transaction is missing a receipt and requires your attention.

Transaction Details:
- Type: ${transactionType}
- Amount: ${currency} ${amount}
- Transaction ID: ${uploadLink.transactionId}
- Risk Level: ${riskLevel}

${riskLevel === 'HIGH' 
  ? 'HIGH RISK: This transaction exceeds the GST threshold and may result in compliance issues if not resolved.'
  : 'ATTENTION REQUIRED: Please upload a receipt to maintain proper record keeping.'
}

Upload your receipt here:
${uploadLink.publicUrl}

Important:
- This link expires on ${expiresAt.toLocaleDateString()} at ${expiresAt.toLocaleTimeString()}
- The link can only be used once
- Accepted formats: JPG, PNG, PDF (max 10MB)

If you have any questions, please contact your accounting team.

---
This is an automated message from your compliance management system.
Please do not reply to this email.`;
  }

  /**
   * Send daily digest email
   * @param {string} emailAddress - Recipient email address
   * @param {Array} missingAttachments - Array of missing attachments
   * @param {Object} summary - Summary statistics
   * @returns {Promise<Object>} Email result
   */
  async sendDailyDigest(emailAddress, missingAttachments, summary) {
    try {
      if (!process.env.SENDGRID_API_KEY) {
        throw new Error('SendGrid API key not configured');
      }

      const fromEmail = process.env.FROM_EMAIL || 'noreply@compliancemanager.com';
      const companyName = process.env.COMPANY_NAME || 'Compliance Manager';
      
      const subject = `Daily Missing Attachments Digest - ${missingAttachments.length} items`;
      
      const htmlContent = this.generateDigestHTML(missingAttachments, summary);
      const textContent = this.generateDigestText(missingAttachments, summary);

      const msg = {
        to: emailAddress,
        from: {
          email: fromEmail,
          name: companyName
        },
        subject,
        text: textContent,
        html: htmlContent
      };

      const response = await sgMail.send(msg);
      
      console.log('📧 Daily digest email sent successfully:', response[0].statusCode);
      return {
        success: true,
        messageId: response[0].headers['x-message-id'],
        statusCode: response[0].statusCode
      };
    } catch (error) {
      console.error('❌ Error sending daily digest email:', error.response?.body || error.message);
      throw error;
    }
  }

  /**
   * Generate digest HTML content
   */
  generateDigestHTML(missingAttachments, summary) {
    const today = new Date().toLocaleDateString();
    
    const transactionRows = missingAttachments.map(transaction => {
      const amount = transaction.moneyAtRisk?.total || transaction.Total || 0;
      const currency = transaction.moneyAtRisk?.currency || 'AUD';
      const riskLevel = transaction.moneyAtRisk?.riskLevel || 'UNKNOWN';
      
      return `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${transaction.type}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${transaction.InvoiceID || transaction.BankTransactionID || transaction.ReceiptID || transaction.PurchaseOrderID}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${currency} ${amount}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: ${riskLevel === 'HIGH' ? '#dc2626' : '#d97706'}">${riskLevel}</td>
        </tr>`;
    }).join('');
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Missing Attachments Digest</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0; }
        .summary-card { background: white; padding: 15px; border-radius: 6px; text-align: center; }
        .table { width: 100%; border-collapse: collapse; background: white; border-radius: 6px; overflow: hidden; }
        .table th { background: #f1f5f9; padding: 12px 8px; text-align: left; font-weight: 600; }
        .footer { background: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b; border-radius: 0 0 8px 8px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Daily Missing Attachments Digest</h1>
        <p>${today}</p>
    </div>
    
    <div class="content">
        <div class="summary">
            <div class="summary-card">
                <h3 style="margin: 0 0 10px 0; color: #2563eb;">${summary.totalTransactions || missingAttachments.length}</h3>
                <p style="margin: 0; font-size: 14px;">Total Missing</p>
            </div>
            <div class="summary-card">
                <h3 style="margin: 0 0 10px 0; color: #dc2626;">${summary.highRiskCount || 0}</h3>
                <p style="margin: 0; font-size: 14px;">High Risk</p>
            </div>
            <div class="summary-card">
                <h3 style="margin: 0 0 10px 0; color: #d97706;">${summary.lowRiskCount || 0}</h3>
                <p style="margin: 0; font-size: 14px;">Low Risk</p>
            </div>
            <div class="summary-card">
                <h3 style="margin: 0 0 10px 0; color: #059669;">${summary.smssSent || 0}</h3>
                <p style="margin: 0; font-size: 14px;">Notifications Sent</p>
            </div>
        </div>
        
        ${missingAttachments.length > 0 ? `
        <h3>Missing Attachments</h3>
        <table class="table">
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Transaction ID</th>
                    <th>Amount</th>
                    <th>Risk Level</th>
                </tr>
            </thead>
            <tbody>
                ${transactionRows}
            </tbody>
        </table>
        ` : '<p>✅ No missing attachments found today!</p>'}
        
        <p style="margin-top: 30px;">
            <strong>Next Steps:</strong><br>
            • Review high-risk transactions first<br>
            • Follow up on any unreturned upload links<br>
            • Check for any processing errors<br>
        </p>
    </div>
    
    <div class="footer">
        <p>This is an automated daily digest from your compliance management system.</p>
        <p>Please do not reply to this email.</p>
    </div>
</body>
</html>`;
  }

  /**
   * Generate digest plain text content
   */
  generateDigestText(missingAttachments, summary) {
    const today = new Date().toLocaleDateString();
    
    const transactionList = missingAttachments.map(transaction => {
      const amount = transaction.moneyAtRisk?.total || transaction.Total || 0;
      const currency = transaction.moneyAtRisk?.currency || 'AUD';
      const riskLevel = transaction.moneyAtRisk?.riskLevel || 'UNKNOWN';
      const id = transaction.InvoiceID || transaction.BankTransactionID || transaction.ReceiptID || transaction.PurchaseOrderID;
      
      return `- ${transaction.type} #${id}: ${currency} ${amount} (${riskLevel} Risk)`;
    }).join('\n');
    
    return `
DAILY MISSING ATTACHMENTS DIGEST - ${today}

SUMMARY:
- Total Missing: ${summary.totalTransactions || missingAttachments.length}
- High Risk: ${summary.highRiskCount || 0}
- Low Risk: ${summary.lowRiskCount || 0}
- Notifications Sent: ${summary.smssSent || 0}

${missingAttachments.length > 0 ? `
MISSING ATTACHMENTS:
${transactionList}
` : 'No missing attachments found today!'}

NEXT STEPS:
• Review high-risk transactions first
• Follow up on any unreturned upload links
• Check for any processing errors

---
This is an automated daily digest from your compliance management system.
Please do not reply to this email.`;
  }
}

module.exports = new EmailService();
