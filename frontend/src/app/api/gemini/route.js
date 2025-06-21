export async function POST(request) {
  try {
    const { message, apiKey, conversationHistory, model } = await request.json();

    if (!message || !apiKey) {
      return Response.json(
        { error: 'Message dan API Key diperlukan' },
        { status: 400 }
      );
    }

    // Buat conversation history dalam format yang benar untuk Gemini
    const contents = [];
    
    // Tambahkan history conversation
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach(msg => {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        });
      });
    }

    // Tambahkan pesan baru
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Siapkan request body untuk Gemini API
    const requestBody = {
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    // Panggil Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      console.error('Gemini API Error:', errorData);
      
      return Response.json(
        { 
          error: errorData.error?.message || 'Gagal mendapatkan response dari Gemini API',
          details: errorData
        },
        { status: geminiResponse.status }
      );
    }

    const data = await geminiResponse.json();
    
    // Ekstrak response text dari Gemini
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      console.error('Invalid response structure:', data);
      return Response.json(
        { error: 'Response tidak valid dari Gemini API' },
        { status: 500 }
      );
    }

    return Response.json({
      message: responseText,
      model: model,
      usage: data.usageMetadata || null
    });

  } catch (error) {
    console.error('Server Error:', error);
    return Response.json(
      { error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}
