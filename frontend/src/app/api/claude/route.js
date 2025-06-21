// pages/api/claude.js atau app/api/claude/route.js

export async function POST(request) {
  try {
    const { message, apiKey, conversationHistory, model, temperature, maxTokens } = await request.json();

    if (!message || !apiKey) {
      return Response.json(
        { error: 'Message dan API Key diperlukan' },
        { status: 400 }
      );
    }

    // Buat messages array untuk Claude API
    const messages = [];

    // Tambahkan conversation history
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach(msg => {
        messages.push({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content
        });
      });
    }

    // Tambahkan pesan baru
    messages.push({
      role: 'user',
      content: message
    });

    // Siapkan request body untuk Claude API
    const requestBody = {
      model: model || 'claude-3-5-haiku-20241022',
      max_tokens: maxTokens || 1024,
      temperature: temperature || 0.7,
      messages: messages,
      system: "You are Claude, a helpful AI assistant created by Anthropic. Respond in the same language as the user's question."
    };

    // Panggil Claude API
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody),
    });

    if (!claudeResponse.ok) {
      const errorData = await claudeResponse.json();
      console.error('Claude API Error:', errorData);
      
      let errorMessage = 'Gagal mendapatkan response dari Claude API';
      
      // Handle specific error types
      if (errorData.error) {
        switch (errorData.error.type) {
          case 'authentication_error':
            errorMessage = 'API Key tidak valid atau tidak memiliki akses';
            break;
          case 'permission_error':
            errorMessage = 'Tidak memiliki permission untuk menggunakan model ini';
            break;
          case 'rate_limit_error':
            errorMessage = 'Rate limit terlampaui, coba lagi nanti';
            break;
          case 'billing_error':
            errorMessage = 'Masalah dengan billing atau credit habis';
            break;
          case 'invalid_request_error':
            errorMessage = 'Request tidak valid: ' + (errorData.error.message || 'Format request salah');
            break;
          default:
            errorMessage = errorData.error.message || errorMessage;
        }
      }
      
      return Response.json(
        { 
          error: errorMessage,
          details: errorData
        },
        { status: claudeResponse.status }
      );
    }

    const data = await claudeResponse.json();
    
    // Ekstrak response dari Claude
    const responseText = data.content?.[0]?.text;
    
    if (!responseText) {
      console.error('Invalid response structure:', data);
      return Response.json(
        { error: 'Response tidak valid dari Claude API' },
        { status: 500 }
      );
    }

    return Response.json({
      message: responseText,
      model: data.model,
      usage: data.usage,
      stop_reason: data.stop_reason,
      stop_sequence: data.stop_sequence
    });

  } catch (error) {
    console.error('Server Error:', error);
    return Response.json(
      { error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}

// Untuk Pages Router (pages/api/claude.js)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, apiKey, conversationHistory, model, temperature, maxTokens } = req.body;

    if (!message || !apiKey) {
      return res.status(400).json({ error: 'Message dan API Key diperlukan' });
    }

    // Buat messages array untuk Claude API
    const messages = [];

    // Tambahkan conversation history
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach(msg => {
        messages.push({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content
        });
      });
    }

    // Tambahkan pesan baru
    messages.push({
      role: 'user',
      content: message
    });

    // Siapkan request body untuk Claude API
    const requestBody = {
      model: model || 'claude-3-5-haiku-20241022',
      max_tokens: maxTokens || 1024,
      temperature: temperature || 0.7,
      messages: messages,
      system: "You are Claude, a helpful AI assistant created by Anthropic. Respond in the same language as the user's question."
    };

    // Panggil Claude API
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody),
    });

    if (!claudeResponse.ok) {
      const errorData = await claudeResponse.json();
      console.error('Claude API Error:', errorData);
      
      let errorMessage = 'Gagal mendapatkan response dari Claude API';
      
      // Handle specific error types
      if (errorData.error) {
        switch (errorData.error.type) {
          case 'authentication_error':
            errorMessage = 'API Key tidak valid atau tidak memiliki akses';
            break;
          case 'permission_error':
            errorMessage = 'Tidak memiliki permission untuk menggunakan model ini';
            break;
          case 'rate_limit_error':
            errorMessage = 'Rate limit terlampaui, coba lagi nanti';
            break;
          case 'billing_error':
            errorMessage = 'Masalah dengan billing atau credit habis';
            break;
          case 'invalid_request_error':
            errorMessage = 'Request tidak valid: ' + (errorData.error.message || 'Format request salah');
            break;
          default:
            errorMessage = errorData.error.message || errorMessage;
        }
      }
      
      return res.status(claudeResponse.status).json({
        error: errorMessage,
        details: errorData
      });
    }

    const data = await claudeResponse.json();
    
    // Ekstrak response dari Claude
    const responseText = data.content?.[0]?.text;
    
    if (!responseText) {
      console.error('Invalid response structure:', data);
      return res.status(500).json({ error: 'Response tidak valid dari Claude API' });
    }

    return res.json({
      message: responseText,
      model: data.model,
      usage: data.usage,
      stop_reason: data.stop_reason,
      stop_sequence: data.stop_sequence
    });

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
}