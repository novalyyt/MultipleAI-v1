'use client';

import React, { useState, useEffect, useRef } from 'react';
import ChatLayout from '../components/shared/ChatLayout';
import MessageBubble from '../components/shared/MessageBubble';
import InputArea from '../components/shared/InputArea';

export default function OllamaPage() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState('llama3.2:3b'); // Default ke model yang ringan
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);
  const [ollamaStatus, setOllamaStatus] = useState('checking'); // checking, running, not-running
  const [availableModels, setAvailableModels] = useState([]);
  const [serverUrl, setServerUrl] = useState('http://localhost:11434');
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load server URL from localStorage on mount
  useEffect(() => {
    const savedServerUrl = localStorage.getItem('ollama-server-url');
    if (savedServerUrl) {
      setServerUrl(savedServerUrl);
    }
  }, []);

  // Check Ollama status and get available models
  useEffect(() => {
    checkOllamaStatus();
  }, [serverUrl]);

  const checkOllamaStatus = async () => {
    setOllamaStatus('checking');
    try {
      const response = await fetch('/api/ollama/models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serverUrl: serverUrl
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOllamaStatus('running');
        setAvailableModels(data.models || []);
        
        // Set default model if current model is not available
        if (data.models && data.models.length > 0) {
          const modelExists = data.models.some(m => m.name === model);
          if (!modelExists) {
            setModel(data.models[0].name);
          }
        }
      } else {
        setOllamaStatus('not-running');
        setAvailableModels([]);
      }
    } catch (error) {
      console.error('Error checking Ollama status:', error);
      setOllamaStatus('not-running');
      setAvailableModels([]);
    }
  };

  // Save server URL to localStorage
  const handleServerUrlChange = (url) => {
    setServerUrl(url);
    if (url.trim()) {
      localStorage.setItem('ollama-server-url', url);
    } else {
      localStorage.removeItem('ollama-server-url');
    }
  };

  const sendMessage = async (content) => {
    if (!content.trim() || ollamaStatus !== 'running') return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ollama', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          conversationHistory: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          model: model,
          temperature: temperature,
          maxTokens: maxTokens,
          serverUrl: serverUrl
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

  // Default model information (when Ollama is not running)
  const defaultModels = [
    { 
      name: 'llama3.2:3b',
      displayName: 'Llama 3.2 3B (Ringan) 🚀',
      description: 'Model ringan yang cepat, cocok untuk daily use',
      size: '~2GB RAM',
      category: 'light'
    },
    { 
      name: 'llama3.2:1b',
      displayName: 'Llama 3.2 1B (Sangat Ringan) ⚡',
      description: 'Model paling ringan, untuk device dengan RAM terbatas',
      size: '~1GB RAM',
      category: 'ultralight'
    },
    { 
      name: 'llama3.1:8b',
      displayName: 'Llama 3.1 8B (Standar) 🎯',
      description: 'Keseimbangan performa dan kecepatan yang baik',
      size: '~5GB RAM',
      category: 'standard'
    },
    { 
      name: 'llama3.1:70b',
      displayName: 'Llama 3.1 70B (Premium) 💎',
      description: 'Model terbesar dengan performa terbaik',
      size: '~40GB RAM',
      category: 'premium'
    },
    { 
      name: 'codellama:7b',
      displayName: 'Code Llama 7B (Coding) 👨‍💻',
      description: 'Spesialis untuk coding dan programming',
      size: '~4GB RAM',
      category: 'coding'
    },
    { 
      name: 'mistral:7b',
      displayName: 'Mistral 7B (Alternatif) 🌟',
      description: 'Model alternatif dengan performa solid',
      size: '~4GB RAM',
      category: 'alternative'
    }
  ];

  const examplePrompts = [
    "Jelaskan konsep containerization dengan Docker",
    "Buatkan contoh REST API sederhana dengan Node.js",
    "Bagaimana cara mengoptimalkan performa database?",
    "Jelaskan perbedaan Git merge vs rebase",
    "Tips terbaik untuk clean code dalam JavaScript",
    "Cara setup CI/CD pipeline untuk project web"
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

  const getStatusIcon = () => {
    switch (ollamaStatus) {
      case 'running': return '🟢';
      case 'not-running': return '🔴';
      case 'checking': return '🟡';
      default: return '⚪';
    }
  };

  const getStatusText = () => {
    switch (ollamaStatus) {
      case 'running': return 'Ollama berjalan dengan baik';
      case 'not-running': return 'Ollama tidak berjalan atau tidak dapat diakses';
      case 'checking': return 'Mengecek status Ollama...';
      default: return 'Status tidak diketahui';
    }
  };

  return (
    <ChatLayout
      title="Ollama Chat"
      subtitle="Large Language Models lokal dengan Ollama"
      icon="🦙"
      color="blue"
    >
      {/* Server Configuration */}
      <div className="p-4 border-b border-gray-100">
        <div className="space-y-3">
          {/* Server URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ollama Server URL:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={serverUrl}
                onChange={(e) => handleServerUrlChange(e.target.value)}
                placeholder="http://localhost:11434"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={checkOllamaStatus}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                🔄 Cek Status
              </button>
            </div>
          </div>
          
          {/* Status Display */}
          <div className={`flex items-center gap-2 text-sm ${
            ollamaStatus === 'running' ? 'text-green-600' : 
            ollamaStatus === 'not-running' ? 'text-red-600' : 'text-yellow-600'
          }`}>
            <span>{getStatusIcon()}</span>
            <span>{getStatusText()}</span>
            {ollamaStatus === 'running' && availableModels.length > 0 && (
              <span className="text-gray-500">
                ({availableModels.length} model tersedia)
              </span>
            )}
          </div>

          {/* Installation Help */}
          {ollamaStatus === 'not-running' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">📋 Cara menjalankan Ollama:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Download Ollama dari <a href="https://ollama.ai" target="_blank" className="text-blue-600 underline">ollama.ai</a></li>
                  <li>Install dan jalankan: <code className="bg-gray-200 px-1 rounded">ollama serve</code></li>
                  <li>Download model: <code className="bg-gray-200 px-1 rounded">ollama pull llama3.2:3b</code></li>
                  <li>Refresh halaman ini untuk mengecek status</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      {ollamaStatus === 'running' && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <div className="space-y-3">
            {/* Model Selection */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">Model:</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[250px]"
                >
                  {availableModels.length > 0 ? (
                    availableModels.map((modelOption) => (
                      <option key={modelOption.name} value={modelOption.name}>
                        {modelOption.name} ({(modelOption.size / (1024**3)).toFixed(1)}GB)
                      </option>
                    ))
                  ) : (
                    defaultModels.map((modelOption) => (
                      <option key={modelOption.name} value={modelOption.name}>
                        {modelOption.displayName}
                      </option>
                    ))
                  )}
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
            
            {/* Model Description */}
            {model && (
              <div className="text-xs text-gray-600 bg-white p-2 rounded border">
                <div className="font-medium">
                  Model aktif: {model}
                </div>
                {availableModels.length === 0 && (
                  <div className="text-gray-500 mt-1">
                    {defaultModels.find(m => m.name === model)?.description}
                  </div>
                )}
                <div className="mt-1">
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                    LOKAL & GRATIS
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        {ollamaStatus !== 'running' ? (
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🦙</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Ollama Belum Berjalan
              </h3>
              <p className="text-gray-600 text-sm max-w-md mb-4">
                Pastikan Ollama sudah terinstall dan berjalan di sistem Anda
              </p>
              
              <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-md border border-blue-200">
                <p className="font-medium text-blue-700 mb-1">💡 Keuntungan Ollama:</p>
                <p>✅ Berjalan lokal (privasi terjaga)</p>
                <p>✅ Tidak perlu internet setelah download</p>
                <p>✅ Gratis tanpa batas penggunaan</p>
                <p>✅ Banyak pilihan model open source</p>
              </div>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🦙</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Mulai Chat dengan Ollama
              </h3>
              <p className="text-gray-600 max-w-md">
                Ollama memungkinkan Anda menjalankan Large Language Models secara lokal di komputer Anda sendiri
              </p>
            </div>

            {/* Model Info */}
            <div className="w-full max-w-2xl mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-700 text-sm font-medium mb-1">
                  <span>🦙</span>
                  <span>Model Aktif: {model}</span>
                </div>
                <div className="text-xs text-green-600">
                  Berjalan lokal - Privasi terjaga & Gratis
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
      {ollamaStatus === 'running' && (
        <InputArea
          onSendMessage={sendMessage}
          disabled={isLoading}
          placeholder={
            isLoading 
              ? "Ollama sedang mengetik..." 
              : "Ketik pesan untuk Ollama..."
          }
        />
      )}
    </ChatLayout>
  );
}