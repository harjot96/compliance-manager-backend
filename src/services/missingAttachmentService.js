const crypto = require('crypto');
const axios = require('axios');
const XeroSettings = require('../models/XeroSettings');
const Company = require('../models/Company');
const { UploadLink } = require('../models/UploadLink');
const { MissingAttachmentConfig } = require('../models/MissingAttachmentConfig');
const emailService = require('./emailService');
const db = require('../config/database');

class MissingAttachmentService {
  constructor() {
    this.defaultThreshold = 82.50; // Default GST threshold
    this.linkExpiryDays = 7;
    this.db = db;
  }

  /**
   * Detect missing attachments during Xero sync
   * @param {string} companyId - Company ID
   * @param {string} tenantId - Xero tenant ID
   * @returns {Promise<Array>} Array of transactions missing attachments
   */
  async detectMissingAttachments(companyId, tenantId) {
    try {
      console.log(`🔍 Detecting missing attachments for company ${companyId}, tenant ${tenantId}`);
      
      // Get Xero access token for the company
      const xeroSettings = await XeroSettings.findOne({ companyId });
      if (!xeroSettings || !xeroSettings.access_token) {
        // For demo purposes, return sample data when Xero is not connected
        console.log('⚠️ Xero not connected - using demo data for missing attachments');
        return this.generateDemoMissingAttachments(companyId, tenantId);
      }

      // Fetch all transactions from Xero
      const transactions = await this.fetchAllTransactions(xeroSettings.access_token, tenantId);
      
      // Filter transactions without attachments
      const missingAttachments = transactions.filter(transaction => {
        return !transaction.HasAttachments || transaction.HasAttachments === false;
      });

      console.log(`📎 Found ${missingAttachments.length} transactions without attachments`);
      
      // Calculate money at risk for each transaction
      const transactionsWithRisk = missingAttachments.map(transaction => {
        const moneyAtRisk = this.calculateMoneyAtRisk(transaction);
        return {
          ...transaction,
          moneyAtRisk,
          companyId,
          tenantId
        };
      });

      return transactionsWithRisk;
    } catch (error) {
      console.error('❌ Error detecting missing attachments:', error);
      throw error;
    }
  }

  /**
   * Fetch all transactions from Xero (invoices, bank transactions, etc.)
   * @param {string} accessToken - Xero access token
   * @param {string} tenantId - Xero tenant ID
   * @returns {Promise<Array>} All transactions
   */
  async fetchAllTransactions(accessToken, tenantId) {
    const transactions = [];
    
    try {
      // Fetch invoices
      const invoices = await this.fetchXeroData(accessToken, tenantId, 'Invoices');
      transactions.push(...invoices.map(inv => ({ ...inv, type: 'Invoice' })));

      // Fetch bank transactions
      const bankTransactions = await this.fetchXeroData(accessToken, tenantId, 'BankTransactions');
      transactions.push(...bankTransactions.map(bt => ({ ...bt, type: 'BankTransaction' })));

      // Fetch receipts
      const receipts = await this.fetchXeroData(accessToken, tenantId, 'Receipts');
      transactions.push(...receipts.map(r => ({ ...r, type: 'Receipt' })));

      // Fetch purchase orders
      const purchaseOrders = await this.fetchXeroData(accessToken, tenantId, 'PurchaseOrders');
      transactions.push(...purchaseOrders.map(po => ({ ...po, type: 'PurchaseOrder' })));

      return transactions;
    } catch (error) {
      console.error('❌ Error fetching transactions from Xero:', error);
      throw error;
    }
  }

  /**
   * Fetch data from Xero API
   * @param {string} accessToken - Xero access token
   * @param {string} tenantId - Xero tenant ID
   * @param {string} endpoint - Xero API endpoint
   * @returns {Promise<Array>} Xero data
   */
  async fetchXeroData(accessToken, tenantId, endpoint) {
    try {
      const response = await axios.get(`https://api.xero.com/api.xro/2.0/${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Xero-tenant-id': tenantId,
          'Accept': 'application/json'
        }
      });

      return response.data[endpoint] || [];
    } catch (error) {
      console.error(`❌ Error fetching ${endpoint} from Xero:`, error.response?.data || error.message);
      return [];
    }
  }

  /**
   * Calculate money at risk based on configurable threshold
   * @param {Object} transaction - Xero transaction
   * @param {number} threshold - GST threshold (default: 82.50)
   * @returns {Object} Money at risk calculation
   */
  calculateMoneyAtRisk(transaction, threshold = null) {
    const configuredThreshold = threshold || this.defaultThreshold;
    
    // Extract financial values from transaction
    const total = parseFloat(transaction.Total) || 0;
    const totalTax = parseFloat(transaction.TotalTax) || 0;
    const subTotal = parseFloat(transaction.SubTotal) || total - totalTax;
    
    // Calculate risk based on threshold
    const exceedsThreshold = total >= configuredThreshold;
    const riskLevel = exceedsThreshold ? 'HIGH' : 'LOW';
    const potentialPenalty = exceedsThreshold ? total * 0.25 : 0; // 25% penalty estimate
    
    return {
      total,
      totalTax,
      subTotal,
      threshold: configuredThreshold,
      exceedsThreshold,
      riskLevel,
      potentialPenalty: parseFloat(potentialPenalty.toFixed(2)),
      currency: transaction.CurrencyCode || 'AUD'
    };
  }

  /**
   * Find existing upload link or create a new one (prevents duplicates)
   * @param {string} transactionId - Transaction ID
   * @param {string} companyId - Company ID
   * @param {string} tenantId - Xero tenant ID
   * @param {string} transactionType - Transaction type
   * @returns {Promise<Object>} Upload link details
   */
  async findOrCreateUploadLink(transactionId, companyId, tenantId, transactionType) {
    try {
      // First, check for any existing active link for this transaction
      const existingActiveLink = await UploadLink.findOne({
        transactionId,
        companyId,
        used: false,
        expiresAt: { $gt: new Date() }
      });

      if (existingActiveLink) {
        console.log(`🔗 Found existing active upload link for transaction ${transactionId}`);
        return {
          ...existingActiveLink,
          publicUrl: `${process.env.FRONTEND_URL || 'https://compliance-manager-frontend.onrender.com'}/upload-receipt/${existingActiveLink.linkId}?token=${existingActiveLink.token}`
        };
      }

      // Check for expired links that we can extend
      const expiredLink = await UploadLink.findOne({
        transactionId,
        companyId,
        used: false,
        expiresAt: { $lt: new Date() }
      });

      if (expiredLink) {
        console.log(`🔄 Extending expired upload link for transaction ${transactionId}`);
        // Extend the expired link with new expiry date
        const newExpiresAt = new Date();
        newExpiresAt.setDate(newExpiresAt.getDate() + this.linkExpiryDays);
        
        await UploadLink.update(
          { expiresAt: newExpiresAt },
          { linkId: expiredLink.linkId }
        );

        return {
          ...expiredLink,
          expiresAt: newExpiresAt,
          publicUrl: `${process.env.FRONTEND_URL || 'https://compliance-manager-frontend.onrender.com'}/upload-receipt/${expiredLink.linkId}?token=${expiredLink.token}`
        };
      }

      // No existing link found, create a new one
      console.log(`📝 Creating new upload link for transaction ${transactionId}`);
      return await this.generateUploadLink(transactionId, companyId, tenantId, transactionType);
    } catch (error) {
      console.error('❌ Error finding or creating upload link:', error);
      throw error;
    }
  }

  /**
   * Generate single-use upload link for a transaction
   * @param {string} transactionId - Transaction ID
   * @param {string} companyId - Company ID
   * @param {string} tenantId - Xero tenant ID
   * @param {string} transactionType - Transaction type
   * @returns {Promise<Object>} Upload link details
   */
  async generateUploadLink(transactionId, companyId, tenantId, transactionType = 'Invoice') {
    const linkId = crypto.randomUUID();
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.linkExpiryDays);
    
    const uploadLink = {
      linkId,
      token,
      transactionId,
      companyId,
      tenantId,
      transactionType,
      expiresAt,
      used: false,
      createdAt: new Date()
    };

    // Store the link in database
    await this.storeUploadLink(uploadLink);
    
    // Generate the public URL
    const baseUrl = process.env.FRONTEND_URL || 'https://compliance-manager-frontend.onrender.com';
    const publicUrl = `${baseUrl}/upload-receipt/${linkId}?token=${token}`;
    
    return {
      ...uploadLink,
      publicUrl
    };
  }

  /**
   * Store upload link in database
   * @param {Object} uploadLink - Upload link details
   */
  async storeUploadLink(uploadLink) {
    try {
      const stored = await UploadLink.create({
        linkId: uploadLink.linkId,
        token: uploadLink.token,
        transactionId: uploadLink.transactionId,
        companyId: uploadLink.companyId,
        tenantId: uploadLink.tenantId,
        expiresAt: uploadLink.expiresAt,
        used: uploadLink.used,
        createdAt: uploadLink.createdAt
      });
      
      console.log('📝 Stored upload link:', stored.linkId);
      return stored;
    } catch (error) {
      console.error('❌ Error storing upload link:', error);
      throw error;
    }
  }

  /**
   * Send SMS notification via Twilio
   * @param {Object} transaction - Transaction details
   * @param {Object} uploadLink - Upload link details
   * @param {string} phoneNumber - Recipient phone number
   * @returns {Promise<Object>} SMS result
   */
  async sendSMSNotification(transaction, uploadLink, phoneNumber) {
    try {
      const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
      const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

      if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
        throw new Error('Twilio credentials not configured');
      }

      const message = this.generateSMSMessage(transaction, uploadLink);
      
      // Send SMS via Twilio API
      const response = await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
        new URLSearchParams({
          To: phoneNumber,
          From: twilioPhoneNumber,
          Body: message
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString('base64')}`
          }
        }
      );

      console.log('📱 SMS sent successfully:', response.data.sid);
      return {
        success: true,
        messageSid: response.data.sid,
        status: response.data.status
      };
    } catch (error) {
      console.error('❌ Error sending SMS:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Generate SMS message content
   * @param {Object} transaction - Transaction details
   * @param {Object} uploadLink - Upload link details
   * @returns {string} SMS message
   */
  generateSMSMessage(transaction, uploadLink) {
    const amount = transaction.moneyAtRisk?.total || transaction.Total || 0;
    const currency = transaction.moneyAtRisk?.currency || 'AUD';
    const transactionType = transaction.type || 'Transaction';
    
    return `🧾 Missing Receipt Alert
${transactionType}: ${currency} ${amount}
Upload your receipt here (expires in ${this.linkExpiryDays} days):
${uploadLink.publicUrl}

Reply STOP to opt out.`;
  }

  /**
   * Process all missing attachments for a company
   * @param {string} companyId - Company ID
   * @returns {Promise<Object>} Processing results
   */
  async processMissingAttachments(companyId) {
    try {
      console.log(`🔄 Processing missing attachments for company ${companyId}`);
      
      const company = await Company.findById(companyId);
      if (!company) {
        throw new Error('Company not found');
      }

      // Get company's Xero tenants
      const xeroSettings = await XeroSettings.findOne({ companyId });
      if (!xeroSettings) {
        throw new Error('Xero not connected for this company');
      }

      // For now, we'll assume one tenant. In production, you might need to handle multiple tenants
      const tenantId = xeroSettings.tenant_id || 'default';
      
      // Detect missing attachments
      const missingAttachments = await this.detectMissingAttachments(companyId, tenantId);
      
      const results = {
        companyId,
        totalTransactions: missingAttachments.length,
        highRiskCount: 0,
        lowRiskCount: 0,
        smssSent: 0,
        errors: [],
        processedAt: new Date()
      };

      // Process each missing attachment
      for (const transaction of missingAttachments) {
        try {
          // Count risk levels
          if (transaction.moneyAtRisk.riskLevel === 'HIGH') {
            results.highRiskCount++;
          } else {
            results.lowRiskCount++;
          }

          // Check if upload link already exists for this transaction
          const transactionId = transaction.InvoiceID || transaction.BankTransactionID || transaction.ReceiptID || transaction.PurchaseOrderID;
          
          let uploadLink = await this.findOrCreateUploadLink(transactionId, companyId, tenantId, transaction.type);

          // Get company's missing attachment config
          const config = await MissingAttachmentConfig.findOne({ companyId });
          
          // Send SMS if enabled and phone number configured
          if (config?.smsEnabled && config?.phoneNumber) {
            try {
              await this.sendSMSNotification(transaction, uploadLink, config.phoneNumber);
              results.smssSent++;
            } catch (smsError) {
              console.error('❌ SMS failed, trying email fallback:', smsError);
              results.errors.push({
                transactionId: transaction.InvoiceID,
                error: `SMS failed: ${smsError.message}`
              });
              
              // Email fallback if SMS fails and email is enabled
              if (config?.emailEnabled && config?.emailAddress) {
                try {
                  await emailService.sendMissingAttachmentEmail(transaction, uploadLink, config.emailAddress);
                  console.log('✅ Email fallback sent successfully');
                } catch (emailError) {
                  console.error('❌ Email fallback also failed:', emailError);
                  results.errors.push({
                    transactionId: transaction.InvoiceID,
                    error: `Email fallback failed: ${emailError.message}`
                  });
                }
              }
            }
          }
          
          // Send email if enabled (primary or fallback)
          else if (config?.emailEnabled && config?.emailAddress) {
            try {
              await emailService.sendMissingAttachmentEmail(transaction, uploadLink, config.emailAddress);
              results.smssSent++; // Count as notification sent
            } catch (emailError) {
              console.error('❌ Email notification failed:', emailError);
              results.errors.push({
                transactionId: transaction.InvoiceID,
                error: `Email failed: ${emailError.message}`
              });
            }
          }
        } catch (error) {
          console.error(`❌ Error processing transaction ${transaction.InvoiceID}:`, error);
          results.errors.push({
            transactionId: transaction.InvoiceID,
            error: error.message
          });
        }
      }

      console.log(`✅ Processed ${results.totalTransactions} missing attachments for company ${companyId}`);
      return results;
    } catch (error) {
      console.error('❌ Error processing missing attachments:', error);
      throw error;
    }
  }

  /**
   * Validate and process file upload
   * @param {string} linkId - Upload link ID
   * @param {string} token - Security token
   * @param {Object} file - Uploaded file
   * @returns {Promise<Object>} Upload result
   */
  async processFileUpload(linkId, token, file) {
    try {
      // Validate upload link
      const uploadLink = await this.validateUploadLink(linkId, token);
      if (!uploadLink) {
        throw new Error('Invalid or expired upload link');
      }

      // Validate file
      this.validateFile(file);

      // Generate presigned POST URL for storage
      const storageResult = await this.uploadToStorage(file, uploadLink);

      // Attach file to Xero transaction
      await this.attachToXeroTransaction(uploadLink, storageResult);

      // Mark link as used and resolved
      await this.markLinkUsed(linkId);

      return {
        success: true,
        message: 'Receipt uploaded successfully',
        fileUrl: storageResult.fileUrl
      };
    } catch (error) {
      console.error('❌ Error processing file upload:', error);
      throw error;
    }
  }

  /**
   * Validate upload link
   * @param {string} linkId - Upload link ID
   * @param {string} token - Security token
   * @returns {Promise<Object|null>} Upload link if valid
   */
  async validateUploadLink(linkId, token) {
    try {
      const uploadLink = await UploadLink.findOne({
        linkId,
        token,
        used: false,
        expiresAt: { $gt: new Date() }
      });
      
      if (!uploadLink) {
        console.log('🔍 Invalid or expired upload link:', linkId);
        return null;
      }
      
      console.log('✅ Valid upload link found:', linkId);
      return uploadLink;
    } catch (error) {
      console.error('❌ Error validating upload link:', error);
      return null;
    }
  }

  /**
   * Validate uploaded file
   * @param {Object} file - Uploaded file
   */
  validateFile(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only JPG, PNG, and PDF files are allowed.');
    }

    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 10MB.');
    }
  }

  /**
   * Upload file to storage using presigned POST
   * @param {Object} file - Uploaded file
   * @param {Object} uploadLink - Upload link details
   * @returns {Promise<Object>} Storage result
   */
  async uploadToStorage(file, uploadLink) {
    try {
      // For now, we'll use a simple file storage approach
      // In production, you would use AWS S3, Google Cloud Storage, etc.
      const fs = require('fs');
      const path = require('path');
      
      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'uploads', 'receipts');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      // Generate unique filename
      const fileExtension = path.extname(file.originalname);
      const fileName = `${uploadLink.linkId}_${Date.now()}${fileExtension}`;
      const filePath = path.join(uploadsDir, fileName);
      
      // Save file to disk
      fs.writeFileSync(filePath, file.buffer);
      
      console.log('📤 File uploaded to storage:', fileName);
      
      // Return file URL (in production this would be a CDN URL)
      const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
      return {
        fileUrl: `${baseUrl}/uploads/receipts/${fileName}`,
        key: fileName,
        filePath
      };
    } catch (error) {
      console.error('❌ Error uploading file to storage:', error);
      throw new Error('Failed to upload file to storage');
    }
  }

  /**
   * Attach file to Xero transaction
   * @param {Object} uploadLink - Upload link details
   * @param {Object} storageResult - Storage result
   */
  async attachToXeroTransaction(uploadLink, storageResult) {
    try {
      // Get Xero access token for the company
      const xeroSettings = await XeroSettings.findOne({ companyId: uploadLink.companyId });
      if (!xeroSettings || !xeroSettings.access_token) {
        throw new Error('Xero not connected for this company');
      }

      // Read the file for upload to Xero
      const fs = require('fs');
      const fileBuffer = fs.readFileSync(storageResult.filePath);
      const fileName = storageResult.key;

      // Determine the Xero endpoint based on transaction type
      let endpoint;
      switch (uploadLink.transactionType) {
        case 'Invoice':
          endpoint = `Invoices/${uploadLink.transactionId}/Attachments/${fileName}`;
          break;
        case 'BankTransaction':
          endpoint = `BankTransactions/${uploadLink.transactionId}/Attachments/${fileName}`;
          break;
        case 'Receipt':
          endpoint = `Receipts/${uploadLink.transactionId}/Attachments/${fileName}`;
          break;
        case 'PurchaseOrder':
          endpoint = `PurchaseOrders/${uploadLink.transactionId}/Attachments/${fileName}`;
          break;
        default:
          throw new Error(`Unsupported transaction type: ${uploadLink.transactionType}`);
      }

      // Upload attachment to Xero
      const response = await axios.put(
        `https://api.xero.com/api.xro/2.0/${endpoint}`,
        fileBuffer,
        {
          headers: {
            'Authorization': `Bearer ${xeroSettings.access_token}`,
            'Xero-tenant-id': uploadLink.tenantId,
            'Content-Type': 'application/octet-stream'
          }
        }
      );

      console.log('📎 Successfully attached file to Xero transaction:', uploadLink.transactionId);
      
      // Update the upload link with file details
      await UploadLink.update({
        fileUrl: storageResult.fileUrl,
        fileName: fileName,
        fileSize: fileBuffer.length
      }, {
        where: { linkId: uploadLink.linkId }
      });

      return {
        success: true,
        attachmentId: response.data?.Attachments?.[0]?.AttachmentID,
        xeroResponse: response.data
      };
    } catch (error) {
      console.error('❌ Error attaching file to Xero transaction:', error.response?.data || error.message);
      
      // Still update the upload link with file details even if Xero attachment fails
      try {
        const fs = require('fs');
        const fileBuffer = fs.readFileSync(storageResult.filePath);
        await UploadLink.update({
          fileUrl: storageResult.fileUrl,
          fileName: storageResult.key,
          fileSize: fileBuffer.length
        }, {
          where: { linkId: uploadLink.linkId }
        });
      } catch (updateError) {
        console.error('❌ Error updating upload link:', updateError);
      }

      // Don't throw error - file is still stored, just not attached to Xero
      console.log('⚠️ File uploaded but not attached to Xero. Manual attachment may be required.');
      return {
        success: false,
        error: error.message,
        fileStored: true
      };
    }
  }

  /**
   * Mark upload link as used
   * @param {string} linkId - Upload link ID
   */
  async markLinkUsed(linkId) {
    try {
      await UploadLink.update(
        { 
          used: true, 
          usedAt: new Date(),
          resolved: true,
          resolvedAt: new Date()
        },
        { linkId }
      );
      
      console.log('✅ Marked link as used:', linkId);
    } catch (error) {
      console.error('❌ Error marking link as used:', error);
      throw error;
    }
  }

  /**
   * Send daily digest email for all companies
   * @returns {Promise<Object>} Digest results
   */
  async sendDailyDigest() {
    try {
      console.log('📊 Sending daily digest emails...');
      
      // Get all companies with email notifications enabled
      const configs = await MissingAttachmentConfig.findAll({
        where: {
          enabled: true,
          emailEnabled: true
        }
      });

      const results = {
        companiesProcessed: 0,
        emailsSent: 0,
        errors: []
      };

      for (const config of configs) {
        try {
          if (!config.emailAddress) {
            continue;
          }

          // Get missing attachments for this company
          const tenantId = 'default'; // You might need to get this from Xero settings
          const missingAttachments = await this.detectMissingAttachments(config.companyId, tenantId);
          
          const summary = {
            totalTransactions: missingAttachments.length,
            highRiskCount: missingAttachments.filter(t => t.moneyAtRisk.riskLevel === 'HIGH').length,
            lowRiskCount: missingAttachments.filter(t => t.moneyAtRisk.riskLevel === 'LOW').length,
            smssSent: 0 // This would come from daily stats
          };

          // Send digest email
          await emailService.sendDailyDigest(config.emailAddress, missingAttachments, summary);
          
          results.companiesProcessed++;
          results.emailsSent++;
          
          console.log(`✅ Daily digest sent to company ${config.companyId}`);
        } catch (error) {
          console.error(`❌ Error sending digest to company ${config.companyId}:`, error);
          results.errors.push({
            companyId: config.companyId,
            error: error.message
          });
        }
      }

      console.log(`📊 Daily digest complete: ${results.emailsSent} emails sent to ${results.companiesProcessed} companies`);
      return results;
    } catch (error) {
      console.error('❌ Error sending daily digest:', error);
      throw error;
    }
  }

  /**
   * Generate demo missing attachments data for testing
   * @param {string} companyId - Company ID
   * @param {string} tenantId - Xero tenant ID
   * @returns {Array} Demo missing attachments
   */
  generateDemoMissingAttachments(companyId, tenantId) {
    const demoTransactions = [
      {
        InvoiceID: 'DEMO-INV-001',
        type: 'Invoice',
        Total: '150.00',
        TotalTax: '13.64',
        SubTotal: '136.36',
        CurrencyCode: 'AUD',
        HasAttachments: false,
        Date: new Date().toISOString(),
        Contact: { Name: 'Demo Customer 1' }
      },
      {
        BankTransactionID: 'DEMO-BT-002',
        type: 'BankTransaction',
        Total: '45.50',
        TotalTax: '4.14',
        SubTotal: '41.36',
        CurrencyCode: 'AUD',
        HasAttachments: false,
        Date: new Date().toISOString(),
        Contact: { Name: 'Demo Vendor 1' }
      },
      {
        ReceiptID: 'DEMO-REC-003',
        type: 'Receipt',
        Total: '220.00',
        TotalTax: '20.00',
        SubTotal: '200.00',
        CurrencyCode: 'AUD',
        HasAttachments: false,
        Date: new Date().toISOString(),
        Contact: { Name: 'Demo Supplier 1' }
      },
      {
        InvoiceID: 'DEMO-INV-004',
        type: 'Invoice',
        Total: '75.25',
        TotalTax: '6.84',
        SubTotal: '68.41',
        CurrencyCode: 'AUD',
        HasAttachments: false,
        Date: new Date().toISOString(),
        Contact: { Name: 'Demo Customer 2' }
      },
      {
        PurchaseOrderID: 'DEMO-PO-005',
        type: 'PurchaseOrder',
        Total: '95.00',
        TotalTax: '8.64',
        SubTotal: '86.36',
        CurrencyCode: 'AUD',
        HasAttachments: false,
        Date: new Date().toISOString(),
        Contact: { Name: 'Demo Vendor 2' }
      }
    ];

    // Calculate money at risk for each transaction
    const transactionsWithRisk = demoTransactions.map(transaction => {
      const moneyAtRisk = this.calculateMoneyAtRisk(transaction);
      return {
        ...transaction,
        moneyAtRisk,
        companyId,
        tenantId: tenantId || 'demo-tenant'
      };
    });

    console.log(`📎 Generated ${transactionsWithRisk.length} demo transactions without attachments`);
    return transactionsWithRisk;
  }

  /**
   * Clean up expired upload links (run periodically)
   * @param {number} daysOld - Remove links older than this many days (default: 30)
   * @returns {Promise<Object>} Cleanup results
   */
  async cleanupExpiredLinks(daysOld = 30) {
    try {
      console.log(`🧹 Cleaning up upload links older than ${daysOld} days...`);
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      // Count links to be deleted
      const countToDelete = await UploadLink.count({
        expiresAt: { $lt: cutoffDate }
      });

      // Delete expired links
      const result = await this.db.query(
        'DELETE FROM upload_links WHERE expires_at < $1',
        [cutoffDate]
      );

      console.log(`🧹 Cleaned up ${result.rowCount} expired upload links`);
      
      return {
        deletedCount: result.rowCount,
        cutoffDate,
        daysOld
      };
    } catch (error) {
      console.error('❌ Error cleaning up expired links:', error);
      throw error;
    }
  }

  /**
   * Get duplicate link statistics
   * @param {string} companyId - Company ID
   * @returns {Promise<Object>} Duplicate statistics
   */
  async getDuplicateStats(companyId) {
    try {
      const query = `
        SELECT 
          transaction_id,
          COUNT(*) as link_count,
          MAX(created_at) as latest_created,
          MIN(created_at) as first_created
        FROM upload_links 
        WHERE company_id = $1 
        GROUP BY transaction_id 
        HAVING COUNT(*) > 1
        ORDER BY link_count DESC
      `;

      const result = await this.db.query(query, [companyId]);
      
      return {
        duplicateTransactions: result.rows,
        totalDuplicates: result.rows.length,
        companyId
      };
    } catch (error) {
      console.error('❌ Error getting duplicate stats:', error);
      throw error;
    }
  }
}

module.exports = new MissingAttachmentService();
