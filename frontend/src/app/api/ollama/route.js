export async function POST(request) {
  try {
    const { message, baseUrl, conversationHistory, model } = await request.json();

    if (!message) {
      return Response.json(
        { error: 'Message diperlukan' },
        { status: 400 }
      );
    }

    // Default Ollama base URL jika tidak disediakan
    const ollamaUrl = baseUrl || 'http://localhost:11434';

    // Buat conversation history dalam format yang benar untuk Ollama
    const messages = [];
    
    // Tambahkan history conversation
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach(msg => {
        messages.push({
          role: msg.role, // 'user' atau 'assistant'
          content: msg.content
        });
      });
    }

    // Tambahkan pesan baru
    messages.push({
      role: 'user',
      content: message
    });

    // Siapkan request body untuk Ollama API
    const requestBody = {
      model: model || 'llama2', // Default model jika tidak disediakan
      messages: messages,
      stream: false, // Set ke true jika ingin streaming response
      options: {
        temperature: 0.7,
        top_p: 0.9,
        top_k: 40,
        num_predict: 1024
      }
    };

    // Panggil Ollama API
    const ollamaResponse = await fetch(
      `${ollamaUrl}/api/chat`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!ollamaResponse.ok) {
      let errorData;
      try {
        errorData = await ollamaResponse.json();
      } catch (e) {
        errorData = { error: 'Gagal mendapatkan response dari Ollama API' };
      }
      console.error('Ollama API Error:', errorData);
      
      return Response.json(
        { 
          error: errorData.error || 'Gagal mendapatkan response dari Ollama API',
          details: errorData
        },
        { status: ollamaResponse.status }
      );
    }

    const data = await ollamaResponse.json();
    
    // Ekstrak response text dari Ollama
    const responseText = data.message?.content;
    
    if (!responseText) {
      console.error('Invalid response structure:', data);
      return Response.json(
        { error: 'Response tidak valid dari Ollama API' },
        { status: 500 }
      );
    }

    return Response.json({
      message: responseText,
      model: data.model || model,
      usage: {
        prompt_tokens: data.prompt_eval_count || null,
        completion_tokens: data.eval_count || null,
        total_tokens: (data.prompt_eval_count || 0) + (data.eval_count || 0) || null
      }
    });

  } catch (error) {
    console.error('Server Error:', error);
    return Response.json(
      { error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}