'use client';

import React, { useState, useEffect, useRef } from 'react';
import ChatLayout from '../components/shared/ChatLayout';
import MessageBubble from '../components/shared/MessageBubble';
import InputArea from '../components/shared/InputArea';
import ApiKeyInput from '../components/shared/ApiKeyInput';

export default function OpenAIPage() {
  const [messages, setMessages] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState('gpt-4o-mini'); // Default ke model paling murah
  const [apiKeyValid, setApiKeyValid] = useState(null);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // Save API key to localStorage
  const handleApiKeyChange = (key) => {
    setApiKey(key);
    setApiKeyValid(null); // Reset validation status
    if (key.trim()) {
      localStorage.setItem('openai-api-key', key);
    } else {
      localStorage.removeItem('openai-api-key');
    }
  };

  // Test API Key function
  const testApiKey = async (key) => {
    try {
      const response = await fetch('/api/openai/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: key,
          model: 'gpt-4o-mini' // Use cheapest model for testing
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setApiKeyValid(true);
        return data.valid || true;
      } else {
        setApiKeyValid(false);
        const errorData = await response.json();
        throw new Error(errorData.error || 'API Key tidak valid');
      }
    } catch (error) {
      setApiKeyValid(false);
      throw error;
    }
  };

  const sendMessage = async (content) => {
    if (!content.trim() || !apiKey) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          apiKey: apiKey,
          conversationHistory: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          model: model,
          temperature: temperature,
          maxTokens: maxTokens
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: Date.now(),
        usage: data.usage
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ Terjadi kesalahan: ${error.message}`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  // Available models with cost information
  const availableModels = [
    { 
      value: 'gpt-4o-mini', 
      label: 'GPT-4o Mini (Termurah) 💰', 
      description: 'Model paling ekonomis, cocok untuk tugas ringan',
      cost: '$0.15 / 1M tokens input, $0.60 / 1M tokens output',
      category: 'budget'
    },
    { 
      value: 'gpt-3.5-turbo', 
      label: 'GPT-3.5 Turbo (Murah) 💸', 
      description: 'Model klasik yang cepat dan efisien',
      cost: '$0.50 / 1M tokens input, $1.50 / 1M tokens output',
      category: 'budget'
    },
    { 
      value: 'gpt-4o', 
      label: 'GPT-4o (Standar) 🎯', 
      description: 'Model terbaru dengan performa excellent',
      cost: '$2.50 / 1M tokens input, $10.00 / 1M tokens output',
      category: 'standard'
    },
    { 
      value: 'gpt-4-turbo', 
      label: 'GPT-4 Turbo (Premium) ⚡', 
      description: 'Model powerful dengan context window besar',
      cost: '$10.00 / 1M tokens input, $30.00 / 1M tokens output',
      category: 'premium'
    },
    { 
      value: 'gpt-4', 
      label: 'GPT-4 (Mahal) 💎', 
      description: 'Model flagship OpenAI yang paling canggih',
      cost: '$30.00 / 1M tokens input, $60.00 / 1M tokens output',
      category: 'premium'
    }
  ];

  const examplePrompts = [
    "Jelaskan perbedaan antara AI, Machine Learning, dan Deep Learning",
    "Buatkan contoh kode React hooks untuk form validation",
    "Bagaimana cara mengoptimalkan SEO untuk website modern?",
    "Jelaskan konsep blockchain dengan analogi sederhana",
    "Tips produktivitas untuk developer software",
    "Perbedaan REST API dan GraphQL beserta contohnya"
  ];

  // Calculate total usage
  const totalUsage = messages.reduce((acc, msg) => {
    if (msg.usage) {
      acc.input += msg.usage.prompt_tokens || 0;
      acc.output += msg.usage.completion_tokens || 0;
      acc.total += msg.usage.total_tokens || 0;
    }
    return acc;
  }, { input: 0, output: 0, total: 0 });

  return (
    <ChatLayout
      title="OpenAI ChatGPT"
      subtitle="GPT-4, GPT-3.5 dan model OpenAI lainnya"
      icon="🤖"
      color="green"
    >
      {/* API Key Input */}
      <div className="p-4 border-b border-gray-100">
        <ApiKeyInput
          value={apiKey}
          onChange={handleApiKeyChange}
          placeholder="Masukkan OpenAI API Key..."
          provider="OpenAI"
          onTest={testApiKey}
        />
        
        {/* API Key Status */}
        {apiKeyValid !== null && (
          <div className={`mt-2 flex items-center gap-2 text-sm ${
            apiKeyValid ? 'text-green-600' : 'text-red-600'
          }`}>
            <span>{apiKeyValid ? '✅' : '❌'}</span>
            <span>
              {apiKeyValid 
                ? 'API Key valid dan siap digunakan!' 
                : 'API Key tidak valid, silakan periksa kembali'
              }
            </span>
          </div>
        )}
      </div>

      {/* Controls */}
      {apiKey && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <div className="space-y-3">
            {/* Model Selection */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">Model:</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white min-w-[250px]"
                >
                  {availableModels.map((modelOption) => (
                    <option key={modelOption.value} value={modelOption.value}>
                      {modelOption.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-2 items-center">
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                  {messages.length} pesan
                </span>
                {totalUsage.total > 0 && (
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    {totalUsage.total.toLocaleString()} tokens
                  </span>
                )}
                {messages.length > 0 && (
                  <button
                    onClick={clearChat}
                    className="px-3 py-1.5 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                  >
                    🗑️ Hapus Chat
                  </button>
                )}
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Temperature:</label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-gray-500 w-8">{temperature}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Max Tokens:</label>
                <input
                  type="number"
                  min="100"
                  max="4000"
                  step="100"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
            
            {/* Model Description & Cost */}
            {model && (
              <div className="text-xs text-gray-600 bg-white p-2 rounded border">
                <div className="font-medium">
                  {availableModels.find(m => m.value === model)?.description}
                </div>
                <div className="text-gray-500 mt-1">  
                  💰 Biaya: {availableModels.find(m => m.value === model)?.cost}
                </div>
                {availableModels.find(m => m.value === model)?.category === 'budget' && (
                  <div className="mt-1">
                    <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                      EKONOMIS
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        {!apiKey ? (
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🔑</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                API Key Diperlukan
              </h3>
              <p className="text-gray-600 text-sm max-w-md mb-4">
                Masukkan OpenAI API Key Anda di atas untuk mulai menggunakan ChatGPT
              </p>
              
              <div className="text-xs text-gray-500 bg-yellow-50 p-3 rounded-md border border-yellow-200">
                <p className="font-medium text-yellow-700 mb-1">💡 Tips Hemat:</p>
                <p>Gunakan <strong>GPT-4o Mini</strong> untuk menghemat biaya - hanya $0.15 per 1M token input!</p>
                <p className="mt-1">Atau coba <strong>GPT-3.5 Turbo</strong> untuk keseimbangan harga dan performa.</p>
              </div>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Mulai Chat dengan ChatGPT
              </h3>
              <p className="text-gray-600 max-w-md">
                ChatGPT adalah AI conversational yang dapat membantu Anda dengan berbagai tugas seperti coding, writing, problem solving, dan banyak lagi
              </p>
            </div>

            {/* Model Cost Warning */}
            <div className="w-full max-w-2xl mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-blue-700 text-sm font-medium mb-1">
                  <span>💰</span>
                  <span>Model Aktif: {availableModels.find(m => m.value === model)?.label}</span>
                </div>
                <div className="text-xs text-blue-600">
                  {availableModels.find(m => m.value === model)?.cost}
                </div>
              </div>
            </div>
            
            <div className="w-full max-w-2xl">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                💡 Contoh pertanyaan:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {examplePrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(prompt)}
                    className="text-left p-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg text-sm text-green-800 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                <MessageBubble
                  message={message.content}
                  isUser={message.role === 'user'}
                  timestamp={message.timestamp}
                />
                {message.usage && (
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    Tokens: {message.usage.prompt_tokens || 0} input + {message.usage.completion_tokens || 0} output = {message.usage.total_tokens || 0} total
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <MessageBubble
                message="Sedang mengetik..."
                isUser={false}
                timestamp={Date.now()}
                isLoading={true}
              />
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Input Area */}
      {apiKey && (
        <InputArea
          onSendMessage={sendMessage}
          disabled={isLoading}
          placeholder={
            isLoading 
              ? "ChatGPT sedang mengetik..." 
              : "Ketik pesan untuk ChatGPT..."
          }
        />
      )}
    </ChatLayout>
  );
}