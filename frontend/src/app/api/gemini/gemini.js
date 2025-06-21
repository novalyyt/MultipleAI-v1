export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, apiKey, conversationHistory, model } = req.body;

    if (!message || !apiKey) {
      return res.status(400).json({ error: 'Message dan API Key diperlukan' });
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
      
      return res.status(geminiResponse.status).json({
        error: errorData.error?.message || 'Gagal mendapatkan response dari Gemini API',
        details: errorData
      });
    }

    const data = await geminiResponse.json();
    
    // Ekstrak response text dari Gemini
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      console.error('Invalid response structure:', data);
      return res.status(500).json({ error: 'Response tidak valid dari Gemini API' });
    }

    return res.json({
      message: responseText,
      model: model,
      usage: data.usageMetadata || null
    });

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
}