export class ClaudeProvider {
  static async sendMessage(message, apiKey, history) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [
          ...history,
          { role: 'user', content: message }
        ]
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Gagal mendapatkan respons dari Claude');
    }

    const data = await response.json();
    return data.content[0].text;
  }
}