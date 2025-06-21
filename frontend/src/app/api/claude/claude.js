export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, apiKey, conversationHistory, model } = req.body;

    if (!message || !apiKey) {
      return res.status(400).json({ error: 'Message dan API Key diperlukan' });
    }

    // Buat conversation history dalam format yang benar untuk Claude
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

    // Siapkan request body untuk Claude API
    const requestBody = {
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    // Panggil Claude API
    const claudeResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!claudeResponse.ok) {
      const errorData = await claudeResponse.json();
      console.error('Claude API Error:', errorData);
      
      return res.status(claudeResponse.status).json({
        error: errorData.error?.message || 'Gagal mendapatkan response dari Claude API',
        details: errorData
      });
    }

    const data = await claudeResponse.json();
    
    // Ekstrak response text dari claude
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      console.error('Invalid response structure:', data);
      return res.status(500).json({ error: 'Response tidak valid dari Claude API' });
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