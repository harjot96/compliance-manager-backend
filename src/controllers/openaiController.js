const OpenAI = require('openai');
const Joi = require('joi');
const OpenAISetting = require('../models/OpenAISetting');

/**
 * Handle large prompts by chunking or using alternative models
 */
const handleLargePrompt = async (openai, prompt, model, maxTokens, temperature) => {
  // Check prompt size first
  const promptLength = prompt.length;
  const estimatedTokens = Math.ceil(promptLength / 4); // Rough estimate: 1 token ≈ 4 characters
  
  console.log(`📊 Prompt analysis: ${promptLength} characters, ~${estimatedTokens} tokens`);
  
  // Model context limits (approximate)
  const contextLimits = {
    'gpt-3.5-turbo': 16385,
    'gpt-4': 8192,
    'gpt-4o': 128000,
    'gpt-4o-mini': 128000
  };
  
  const modelLimit = contextLimits[model] || 16385;
  const safeLimit = Math.floor(modelLimit * 0.8); // Use 80% of limit to be safe
  
  // If prompt is within safe limits, try original model
  if (estimatedTokens < safeLimit) {
    try {
      console.log(`✅ Prompt within safe limits for ${model}, proceeding...`);
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
      // If it's not a context length error, re-throw
      if (!error.message || !error.message.includes('maximum context length')) {
        throw error;
      }
      console.log('⚠️ Context length exceeded despite size check, trying alternatives...');
    }
  } else {
    console.log(`⚠️ Prompt too large for ${model} (${estimatedTokens} > ${safeLimit}), trying alternatives...`);
  }
  
  // Try with GPT-4o which has much larger context
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
        max_tokens: Math.min(maxTokens, 8000), // Limit response size
        temperature: temperature
      });
      return completion;
    } catch (gpt4oError) {
      console.log('❌ GPT-4o also failed, trying chunking...');
      console.log('Error:', gpt4oError.message);
    }
  }
  
  // If still failing, try chunking the prompt
  try {
    console.log('🔄 Chunking large prompt...');
    const chunks = chunkPrompt(prompt, 8000); // Smaller chunks for better reliability
    console.log(`📊 Split into ${chunks.length} chunks`);
    
    const responses = [];
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`📝 Processing chunk ${i + 1}/${chunks.length} (${chunk.length} chars)`);
      
      const chunkPrompt = i === 0 
        ? `Please analyze the following content and provide a comprehensive response: ${chunk}`
        : `Continuing from previous analysis, here's the next part to analyze: ${chunk}`;
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: chunkPrompt
          }
        ],
        max_tokens: Math.min(maxTokens, 2000), // Smaller responses per chunk
        temperature: temperature
      });
      
      const response = completion.choices[0]?.message?.content || '';
      responses.push(response);
      console.log(`✅ Chunk ${i + 1} processed (${response.length} chars)`);
    }
    
    // Combine responses intelligently
    const combinedResponse = responses.join('\n\n---\n\n');
    
    console.log(`✅ Successfully processed all chunks, combined response: ${combinedResponse.length} chars`);
    
    // Create a mock completion object
    return {
      choices: [{
        message: { content: combinedResponse },
        finish_reason: 'stop'
      }],
      usage: {
        prompt_tokens: estimatedTokens,
        completion_tokens: combinedResponse.length,
        total_tokens: estimatedTokens + combinedResponse.length
      }
    };
  } catch (chunkError) {
    console.error('❌ Chunking failed:', chunkError.message);
    throw new Error(`Failed to process large prompt even with chunking. Please try a shorter prompt or break your request into smaller parts. Error: ${chunkError.message}`);
  }
};

/**
 * Chunk a large prompt into smaller pieces intelligently
 */
const chunkPrompt = (prompt, maxChunkSize = 8000) => {
  const chunks = [];
  
  // If prompt is already small enough, return as single chunk
  if (prompt.length <= maxChunkSize) {
    return [prompt];
  }
  
  // Try to split by paragraphs first (double newlines)
  const paragraphs = prompt.split(/\n\s*\n/);
  
  if (paragraphs.length > 1) {
    let currentChunk = '';
    
    for (const paragraph of paragraphs) {
      const testChunk = currentChunk + (currentChunk ? '\n\n' : '') + paragraph;
      
      if (testChunk.length > maxChunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = paragraph;
      } else {
        currentChunk = testChunk;
      }
    }
    
    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }
  } else {
    // If no paragraphs, split by sentences
    const sentences = prompt.split(/[.!?]+/).filter(s => s.trim().length > 0);
    let currentChunk = '';
    
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
  }
  
  // If still no chunks, force split by character count
  if (chunks.length === 0) {
    for (let i = 0; i < prompt.length; i += maxChunkSize) {
      chunks.push(prompt.substring(i, i + maxChunkSize));
    }
  }
  
  // Ensure no chunk is too large
  const finalChunks = [];
  for (const chunk of chunks) {
    if (chunk.length > maxChunkSize) {
      // Split large chunks further
      for (let i = 0; i < chunk.length; i += maxChunkSize) {
        finalChunks.push(chunk.substring(i, i + maxChunkSize));
      }
    } else {
      finalChunks.push(chunk);
    }
  }
  
  console.log(`📊 Chunking result: ${finalChunks.length} chunks, sizes: ${finalChunks.map(c => c.length).join(', ')}`);
  return finalChunks;
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

    // Validate prompt size
    const promptLength = prompt.length;
    const estimatedTokens = Math.ceil(promptLength / 4);
    
    // Absolute maximum (GPT-4o limit)
    if (estimatedTokens > 100000) {
      return res.status(400).json({
        success: false,
        message: 'Prompt too large. Maximum size is approximately 100,000 tokens.',
        error: 'Prompt size exceeded',
        suggestion: 'Please break your request into smaller parts',
        promptSize: {
          characters: promptLength,
          estimatedTokens: estimatedTokens,
          maxAllowed: 100000
        }
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