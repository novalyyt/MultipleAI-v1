export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, apiKey, conversationHistory, model, temperature, maxTokens } = req.body;

    if (!message || !apiKey) {
      return res.status(400).json({ error: 'Message dan API Key diperlukan' });
    }

    // Buat messages array untuk OpenAI API
    const messages = [];
    
    // Tambahkan system message jika diperlukan
    messages.push({
      role: 'system',
      content: 'You are a helpful AI assistant. Respond in the same language as the user\'s question.'
    });

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

    // Siapkan request body untuk OpenAI API
    const requestBody = {
      model: model || 'gpt-4o-mini',
      messages: messages,
      temperature: temperature || 0.7,
      max_tokens: maxTokens || 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    };

    // Panggil OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('OpenAI API Error:', errorData);
      
      let errorMessage = 'Gagal mendapatkan response dari OpenAI API';
      
      // Handle specific error types
      if (errorData.error) {
        switch (errorData.error.type) {
          case 'invalid_api_key':
            errorMessage = 'API Key tidak valid';
            break;
          case 'insufficient_quota':
            errorMessage = 'Kuota API habis atau billing belum diatur';
            break;
          case 'rate_limit_exceeded':
            errorMessage = 'Rate limit terlampaui, coba lagi nanti';
            break;
          case 'model_not_found':
            errorMessage = 'Model tidak ditemukan atau tidak memiliki akses';
            break;
          default:
            errorMessage = errorData.error.message || errorMessage;
        }
      }
      
      return res.status(openaiResponse.status).json({
        error: errorMessage,
        details: errorData
      });
    }

    const data = await openaiResponse.json();
    
    // Ekstrak response dari OpenAI
    const responseText = data.choices?.[0]?.message?.content;
    
    if (!responseText) {
      console.error('Invalid response structure:', data);
      return res.status(500).json({ error: 'Response tidak valid dari OpenAI API' });
    }

    return res.json({
      message: responseText,
      model: data.model,
      usage: data.usage,
      finish_reason: data.choices?.[0]?.finish_reason
    });

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
}