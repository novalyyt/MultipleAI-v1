export async function POST(request) {
  try {
    const { message, apiKey, conversationHistory, model, temperature, maxTokens } = await request.json();

    if (!message || !apiKey) {
      return Response.json(
        { error: 'Message dan API Key diperlukan' },
        { status: 400 }
      );
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
      
      return Response.json(
        { 
          error: errorMessage,
          details: errorData
        },
        { status: openaiResponse.status }
      );
    }

    const data = await openaiResponse.json();
    
    // Ekstrak response dari OpenAI
    const responseText = data.choices?.[0]?.message?.content;
    
    if (!responseText) {
      console.error('Invalid response structure:', data);
      return Response.json(
        { error: 'Response tidak valid dari OpenAI API' },
        { status: 500 }
      );
    }

    return Response.json({
      message: responseText,
      model: data.model,
      usage: data.usage,
      finish_reason: data.choices?.[0]?.finish_reason
    });

  } catch (error) {
    console.error('Server Error:', error);
    return Response.json(
      { error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}