'use client';

import React, { useState, useEffect, useRef } from 'react';
import ChatLayout from '../components/shared/ChatLayout';
import MessageBubble from '../components/shared/MessageBubble';
import InputArea from '../components/shared/InputArea';
import ApiKeyInput from '../components/shared/ApiKeyInput';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export default function GeminiPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState('gemini-1.5-flash'); // Default ke model gratis
  const [apiKeyValid, setApiKeyValid] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // Save API key to localStorage
  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    setApiKeyValid(null); // Reset validation status
    if (key.trim()) {
      localStorage.setItem('gemini-api-key', key);
    } else {
      localStorage.removeItem('gemini-api-key');
    }
  };

  // Test API Key function
  const testApiKey = async (key: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/gemini/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: key,
          model: 'gemini-1.5-flash' // Use free model for testing
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

  const sendMessage = async (content: string) => {
    if (!content.trim() || !apiKey) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini', {
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
          model: model
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error:', error);
      const errorMessage: Message = {
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

  // Updated models with free options marked
  const availableModels = [
    { 
      value: 'gemini-1.5-flash', 
      label: 'Gemini 1.5 Flash (Gratis) ⚡', 
      description: 'Model tercepat, cocok untuk tugas ringan',
      free: true 
    },
    { 
      value: 'gemini-1.5-flash-8b', 
      label: 'Gemini 1.5 Flash 8B (Gratis) 🆓', 
      description: 'Model ringan dengan performa baik',
      free: true 
    },
    { 
      value: 'gemini-1.5-pro', 
      label: 'Gemini 1.5 Pro (Berbayar) 💎', 
      description: 'Model terbaik untuk tugas kompleks',
      free: false 
    },
    { 
      value: 'gemini-pro', 
      label: 'Gemini Pro (Legacy)', 
      description: 'Model sebelumnya, masih bisa digunakan',
      free: true 
    }
  ];

  const examplePrompts = [
    "Jelaskan konsep machine learning dengan sederhana",
    "Buatkan kode Python untuk sorting algorithm",
    "Apa perbedaan React dan Vue.js?",
    "Bagaimana cara mengoptimalkan performa website?"
  ];

  return (
    <ChatLayout
      title="Gemini AI"
      subtitle="Google Gemini - AI multimodal yang powerful dan cerdas"
      icon="🧠"
      color="blue"
    >
      {/* API Key Input */}
      <div className="p-4 border-b border-gray-100">
        <ApiKeyInput
          value={apiKey}
          onChange={handleApiKeyChange}
          placeholder="Masukkan Google AI Studio API Key..."
          provider="Google Gemini"
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
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Model:</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[200px]"
              >
                {availableModels.map((modelOption) => (
                  <option key={modelOption.value} value={modelOption.value}>
                    {modelOption.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-2">
              <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                {messages.length} pesan
              </span>
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
          
          {/* Model Description */}
          {model && (
            <div className="mt-2 text-xs text-gray-600">
              {availableModels.find(m => m.value === model)?.description}
              {availableModels.find(m => m.value === model)?.free && 
                <span className="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                  GRATIS
                </span>
              }
            </div>
          )}
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
              <p className="text-gray-600 text-sm max-w-md">
                Masukkan Google AI Studio API Key Anda di atas untuk mulai menggunakan Gemini AI
              </p>
              
              <div className="mt-4 text-xs text-gray-500 bg-blue-50 p-3 rounded-md">
                <p className="font-medium text-blue-700 mb-1">💡 Tips:</p>
                <p>Pilih model <strong>Gemini 1.5 Flash</strong> untuk penggunaan gratis dengan kuota harian yang cukup besar!</p>
              </div>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🧠</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Mulai Chat dengan Gemini AI
              </h3>
              <p className="text-gray-600 max-w-md">
                Gemini adalah AI multimodal canggih dari Google yang dapat memahami teks, gambar, dan kode dengan sangat baik
              </p>
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
                    className="text-left p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-sm text-blue-800 transition-colors"
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
              <MessageBubble
                key={message.id}
                message={message.content}
                isUser={message.role === 'user'}
                timestamp={message.timestamp}
              />
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
              ? "Gemini sedang mengetik..." 
              : "Ketik pesan untuk Gemini..."
          }
        />
      )}
    </ChatLayout>
  );
}