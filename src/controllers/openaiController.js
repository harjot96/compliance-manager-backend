const OpenAI = require('openai');
const Joi = require('joi');
const OpenAISetting = require('../models/OpenAISetting');

/**
 * Handle large prompts by chunking or using alternative models
 */
const handleLargePrompt = async (openai, prompt, model, maxTokens, temperature) => {
  // Try with the original model first
  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: maxTokens,
      temperature: temperature
    });
    return completion;
  } catch (error) {
    // If we get a context length error, try alternative approaches
    if (error.message && error.message.includes('maximum context length')) {
      console.log('⚠️ Context length exceeded, trying alternative approaches...');
      
      // Try with GPT-4o which has larger context
      if (model !== 'gpt-4o') {
        try {
          console.log('🔄 Trying with GPT-4o (larger context)...');
          const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: maxTokens,
            temperature: temperature
          });
          return completion;
        } catch (gpt4oError) {
          console.log('❌ GPT-4o also failed, trying chunking...');
        }
      }
      
      // If still failing, try chunking the prompt
      try {
        console.log('🔄 Chunking large prompt...');
        const chunks = chunkPrompt(prompt, 12000); // Leave room for response
        const responses = [];
        
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];
          const chunkPrompt = i === 0 
            ? `Please analyze the following content: ${chunk}`
            : `Continuing from previous analysis, here's the next part: ${chunk}`;
          
          const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
              {
                role: 'user',
                content: chunkPrompt
              }
            ],
            max_tokens: Math.min(maxTokens, 4000),
            temperature: temperature
          });
          
          responses.push(completion.choices[0]?.message?.content || '');
        }
        
        // Combine responses
        const combinedResponse = responses.join('\n\n');
        
        // Create a mock completion object
        return {
          choices: [{
            message: { content: combinedResponse },
            finish_reason: 'stop'
          }],
          usage: {
            prompt_tokens: 0,
            completion_tokens: combinedResponse.length,
            total_tokens: combinedResponse.length
          }
        };
      } catch (chunkError) {
        throw new Error(`Failed to process large prompt even with chunking: ${chunkError.message}`);
      }
    }
    
    // If it's not a context length error, re-throw
    throw error;
  }
};

/**
 * Chunk a large prompt into smaller pieces
 */
const chunkPrompt = (prompt, maxChunkSize = 12000) => {
  const chunks = [];
  let currentChunk = '';
  
  // Split by sentences to avoid breaking context
  const sentences = prompt.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  for (const sentence of sentences) {
    const testChunk = currentChunk + sentence + '. ';
    
    if (testChunk.length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence + '. ';
    } else {
      currentChunk = testChunk;
    }
  }
  
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks.length > 0 ? chunks : [prompt.substring(0, maxChunkSize)];
};

/**
 * OpenAI Chat Completion
 * Uses stored API key from database
 */
const chatCompletion = async (req, res, next) => {
  try {
    const { prompt, model = 'gpt-3.5-turbo', maxTokens = 4000, temperature = 0.7 } = req.body;

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

    // Create chat completion with large prompt handling
    const completion = await handleLargePrompt(openai, prompt, model, maxTokens, temperature);

    const response = completion.choices[0]?.message?.content || 'No response generated';

    res.json({
      success: true,
      message: 'AI response generated successfully',
      data: {
        response: response,
        model: model,
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
      // Check if it's a context length error
      if (error.message && error.message.includes('maximum context length')) {
        return res.status(400).json({ 
          success: false, 
          message: 'Prompt too long. The system will automatically handle large prompts, but this one exceeded all limits. Please try a shorter prompt.',
          error: 'Context length exceeded',
          suggestion: 'Try breaking your request into smaller parts'
        });
      }
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
      model = 'gpt-3.5-turbo',
      maxTokens = 4000,
      temperature = 0.7
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

    // Create chat completion with large prompt handling
    const completion = await handleLargePrompt(openai, prompt, model, maxTokens, temperature);

    const response = completion.choices[0]?.message?.content || 'No response generated';

    res.json({
      success: true,
      message: 'Compliance text generated successfully',
      data: {
        response: response,
        complianceType: complianceType,
        companyName: companyName,
        daysLeft: daysLeft,
        model: model,
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
    } else if (error.status === 400) {
      // Check if it's a context length error
      if (error.message && error.message.includes('maximum context length')) {
        return res.status(400).json({ 
          success: false, 
          message: 'Prompt too long. The system will automatically handle large prompts, but this one exceeded all limits. Please try a shorter prompt.',
          error: 'Context length exceeded',
          suggestion: 'Try breaking your request into smaller parts'
        });
      }
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
      model = 'gpt-3.5-turbo',
      maxTokens = 4000,
      temperature = 0.7
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

    // Create chat completion with large prompt handling
    const completion = await handleLargePrompt(openai, prompt, model, maxTokens, temperature);

    const response = completion.choices[0]?.message?.content || 'No template generated';

    res.json({
      success: true,
      message: `${templateType.toUpperCase()} template generated successfully`,
      data: {
        template: response,
        templateType: templateType,
        complianceType: complianceType,
        tone: tone,
        model: model,
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
    } else if (error.status === 400) {
      // Check if it's a context length error
      if (error.message && error.message.includes('maximum context length')) {
        return res.status(400).json({ 
          success: false, 
          message: 'Template prompt too long. The system will automatically handle large prompts, but this one exceeded all limits. Please try a shorter prompt.',
          error: 'Context length exceeded',
          suggestion: 'Try breaking your template request into smaller parts'
        });
      }
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid request. Please check your template parameters.' 
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
      model = 'gpt-3.5-turbo',
      maxTokens = 4000,
      temperature = 0.7
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

    // Create chat completion with large prompt handling
    const completion = await handleLargePrompt(openai, prompt, model, maxTokens, temperature);

    const response = completion.choices[0]?.message?.content || 'No analysis generated';

    res.json({
      success: true,
      message: 'Content analysis completed successfully',
      data: {
        analysis: response,
        analysisType: analysisType,
        content: content,
        model: model,
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
    } else if (error.status === 400) {
      // Check if it's a context length error
      if (error.message && error.message.includes('maximum context length')) {
        return res.status(400).json({ 
          success: false, 
          message: 'Content too long. The system will automatically handle large content, but this one exceeded all limits. Please try with shorter content.',
          error: 'Context length exceeded',
          suggestion: 'Try breaking your content into smaller parts'
        });
      }
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid request. Please check your content and parameters.' 
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