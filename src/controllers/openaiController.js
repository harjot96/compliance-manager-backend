const OpenAI = require('openai');
const Joi = require('joi');
const OpenAISetting = require('../models/OpenAISetting');

/**
 * OpenAI Chat Completion
 * Uses stored API key from database
 */
const chatCompletion = async (req, res, next) => {
  try {
    const { prompt, model, maxTokens, temperature } = req.body;

    // Validate required fields
    if (!prompt) {
      return res.status(400).json({ 
        success: false, 
        message: 'Prompt is required' 
      });
    }

    // Get OpenAI settings from database
    const settings = await OpenAISetting.getSettings();
    if (!settings) {
      return res.status(500).json({ 
        success: false, 
        message: 'OpenAI settings not configured. Please contact administrator.' 
      });
    }

    // Initialize OpenAI with stored API key
    const openai = new OpenAI({
      apiKey: settings.apiKey
    });

    // Create chat completion
    const completion = await openai.chat.completions.create({
      model: model || settings.model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: maxTokens || settings.maxTokens,
      temperature: temperature || settings.temperature
    });

    const response = completion.choices[0]?.message?.content || 'No response generated';

    res.json({
      success: true,
      message: 'AI response generated successfully',
      data: {
        response: response,
        model: model || settings.model,
        usage: completion.usage,
        finishReason: completion.choices[0]?.finish_reason
      }
    });

  } catch (error) {
    console.error('OpenAI Chat Error:', error);
    
    // Handle specific OpenAI errors
    if (error.status === 401) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid OpenAI API key. Please contact administrator.' 
      });
    } else if (error.status === 429) {
      return res.status(429).json({ 
        success: false, 
        message: 'Rate limit exceeded. Please try again later.' 
      });
    } else if (error.status === 400) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid request. Please check your prompt and parameters.' 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'AI service error', 
      error: error.message 
    });
  }
};

/**
 * OpenAI Text Generation
 * For compliance-related text generation
 */
const generateComplianceText = async (req, res, next) => {
  try {
    const { 
      complianceType, 
      companyName, 
      daysLeft, 
      customPrompt,
      model,
      maxTokens,
      temperature
    } = req.body;

    // Validate required fields
    if (!complianceType || !companyName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Compliance type and company name are required' 
      });
    }

    // Get OpenAI settings from database
    const settings = await OpenAISetting.getSettings();
    if (!settings) {
      return res.status(500).json({ 
        success: false, 
        message: 'OpenAI settings not configured. Please contact administrator.' 
      });
    }

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: settings.apiKey
    });

    // Create compliance-specific prompt
    let prompt = customPrompt;
    if (!customPrompt) {
      prompt = `Generate a professional compliance reminder for ${complianceType} for ${companyName}. 
      
      Requirements:
      - Company: ${companyName}
      - Compliance Type: ${complianceType}
      - Days Left: ${daysLeft || 'due soon'}
      - Tone: Professional and urgent
      - Length: 2-3 sentences
      - Include specific compliance type details
      
      Generate a clear, actionable reminder:`;
    }

    // Create chat completion
    const completion = await openai.chat.completions.create({
      model: model || settings.model,
      messages: [
        {
          role: 'system',
          content: 'You are a professional compliance management assistant. Generate clear, actionable compliance reminders.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: maxTokens || settings.maxTokens,
      temperature: temperature || settings.temperature
    });

    const response = completion.choices[0]?.message?.content || 'No response generated';

    res.json({
      success: true,
      message: 'Compliance text generated successfully',
      data: {
        response: response,
        complianceType: complianceType,
        companyName: companyName,
        daysLeft: daysLeft,
        model: model || settings.model,
        usage: completion.usage
      }
    });

  } catch (error) {
    console.error('OpenAI Compliance Text Error:', error);
    
    if (error.status === 401) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid OpenAI API key. Please contact administrator.' 
      });
    } else if (error.status === 429) {
      return res.status(429).json({ 
        success: false, 
        message: 'Rate limit exceeded. Please try again later.' 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'AI service error', 
      error: error.message 
    });
  }
};

/**
 * OpenAI Template Generation
 * Generate email/SMS templates using AI
 */
const generateTemplate = async (req, res, next) => {
  try {
    const { 
      templateType, // 'email' or 'sms'
      complianceType,
      tone = 'professional',
      customPrompt,
      model,
      maxTokens,
      temperature
    } = req.body;

    // Validate required fields
    if (!templateType || !complianceType) {
      return res.status(400).json({ 
        success: false, 
        message: 'Template type and compliance type are required' 
      });
    }

    // Get OpenAI settings from database
    const settings = await OpenAISetting.getSettings();
    if (!settings) {
      return res.status(500).json({ 
        success: false, 
        message: 'OpenAI settings not configured. Please contact administrator.' 
      });
    }

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: settings.apiKey
    });

    // Create template-specific prompt
    let prompt = customPrompt;
    if (!customPrompt) {
      if (templateType === 'email') {
        prompt = `Generate a professional ${tone} email template for ${complianceType} compliance reminder.
        
        Requirements:
        - Type: Email template
        - Compliance: ${complianceType}
        - Tone: ${tone}
        - Include subject line
        - Include email body
        - Professional and actionable
        - 2-3 paragraphs maximum
        
        Format:
        Subject: [Subject line]
        
        [Email body]`;
      } else if (templateType === 'sms') {
        prompt = `Generate a professional ${tone} SMS template for ${complianceType} compliance reminder.
        
        Requirements:
        - Type: SMS template
        - Compliance: ${complianceType}
        - Tone: ${tone}
        - Concise and clear
        - Maximum 160 characters
        - Include urgency
        - Professional tone
        
        Generate SMS text:`;
      }
    }

    // Create chat completion
    const completion = await openai.chat.completions.create({
      model: model || settings.model,
      messages: [
        {
          role: 'system',
          content: `You are a professional compliance management assistant. Generate ${templateType} templates for compliance reminders.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: maxTokens || settings.maxTokens,
      temperature: temperature || settings.temperature
    });

    const response = completion.choices[0]?.message?.content || 'No template generated';

    res.json({
      success: true,
      message: `${templateType.toUpperCase()} template generated successfully`,
      data: {
        template: response,
        templateType: templateType,
        complianceType: complianceType,
        tone: tone,
        model: model || settings.model,
        usage: completion.usage
      }
    });

  } catch (error) {
    console.error('OpenAI Template Generation Error:', error);
    
    if (error.status === 401) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid OpenAI API key. Please contact administrator.' 
      });
    } else if (error.status === 429) {
      return res.status(429).json({ 
        success: false, 
        message: 'Rate limit exceeded. Please try again later.' 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'AI service error', 
      error: error.message 
    });
  }
};

/**
 * OpenAI Content Analysis
 * Analyze compliance content and provide insights
 */
const analyzeContent = async (req, res, next) => {
  try {
    const { 
      content, 
      analysisType = 'compliance', // 'compliance', 'tone', 'effectiveness'
      customPrompt,
      model,
      maxTokens,
      temperature
    } = req.body;

    // Validate required fields
    if (!content) {
      return res.status(400).json({ 
        success: false, 
        message: 'Content is required' 
      });
    }

    // Get OpenAI settings from database
    const settings = await OpenAISetting.getSettings();
    if (!settings) {
      return res.status(500).json({ 
        success: false, 
        message: 'OpenAI settings not configured. Please contact administrator.' 
      });
    }

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: settings.apiKey
    });

    // Create analysis-specific prompt
    let prompt = customPrompt;
    if (!customPrompt) {
      if (analysisType === 'compliance') {
        prompt = `Analyze the following compliance-related content and provide insights:
        
        Content: "${content}"
        
        Please analyze:
        1. Compliance relevance
        2. Clarity and effectiveness
        3. Professional tone
        4. Actionability
        5. Areas for improvement
        
        Provide a structured analysis:`;
      } else if (analysisType === 'tone') {
        prompt = `Analyze the tone of the following content:
        
        Content: "${content}"
        
        Please analyze:
        1. Overall tone (professional, urgent, friendly, etc.)
        2. Appropriateness for compliance context
        3. Emotional impact
        4. Suggestions for tone adjustment
        
        Provide a structured analysis:`;
      } else if (analysisType === 'effectiveness') {
        prompt = `Analyze the effectiveness of the following compliance communication:
        
        Content: "${content}"
        
        Please analyze:
        1. Message clarity
        2. Call-to-action effectiveness
        3. Urgency conveyed
        4. Professional standards
        5. Improvement suggestions
        
        Provide a structured analysis:`;
      }
    }

    // Create chat completion
    const completion = await openai.chat.completions.create({
      model: model || settings.model,
      messages: [
        {
          role: 'system',
          content: 'You are a professional compliance communication analyst. Provide detailed, actionable insights.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: maxTokens || settings.maxTokens,
      temperature: temperature || settings.temperature
    });

    const response = completion.choices[0]?.message?.content || 'No analysis generated';

    res.json({
      success: true,
      message: 'Content analysis completed successfully',
      data: {
        analysis: response,
        analysisType: analysisType,
        content: content,
        model: model || settings.model,
        usage: completion.usage
      }
    });

  } catch (error) {
    console.error('OpenAI Content Analysis Error:', error);
    
    if (error.status === 401) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid OpenAI API key. Please contact administrator.' 
      });
    } else if (error.status === 429) {
      return res.status(429).json({ 
        success: false, 
        message: 'Rate limit exceeded. Please try again later.' 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'AI service error', 
      error: error.message 
    });
  }
};

module.exports = {
  chatCompletion,
  generateComplianceText,
  generateTemplate,
  analyzeContent
}; 