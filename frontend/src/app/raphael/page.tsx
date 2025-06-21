'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ChatLayout from '../components/shared/ChatLayout';
import MessageBubble from '../components/shared/MessageBubble';
import InputArea from '../components/shared/InputArea';

export default function RaphaelPage() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState('raphael-creative');
  const [imageSize, setImageSize] = useState('1024x1024');
  const [imageStyle, setImageStyle] = useState('natural');
  const [numImages, setNumImages] = useState(1);
  const [isConnected, setIsConnected] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Test koneksi ke service AI
  useEffect(() => {
    testAIConnection();
  }, []);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const testAIConnection = async () => {
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      );
      
      const fetchPromise = fetch('/api/raphael', {
        method: 'GET',
      });
      
      const response = await Promise.race([fetchPromise, timeoutPromise]);
      const data = await response.json();
      setIsConnected(response.ok && data.status === 'active');
    } catch (error) {
      console.log('AI service connection test failed:', error);
      setIsConnected(false);
    }
  };

  const generateImage = async (prompt) => {
    if (!prompt.trim()) return;
    
    // Abort any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setRetryCount(0);

    try {
      console.log('Sending request with:', {
        prompt,
        model,
        size: imageSize,
        style: imageStyle,
        n: numImages
      });

      const startTime = Date.now();
      const response = await fetch('/api/raphael', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          model: model,
          size: imageSize,
          style: imageStyle,
          n: numImages
        }),
        signal: abortControllerRef.current.signal
      });

      const responseTime = Date.now() - startTime;

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        
        if (response.status === 408) {
          throw new Error('Request timeout - coba lagi dengan prompt yang lebih sederhana');
        }
        
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      if (!data.images || !Array.isArray(data.images) || data.images.length === 0) {
        throw new Error('No images received from API');
      }

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.images,
        timestamp: Date.now(),
        type: 'image',
        prompt: prompt,
        metadata: {
          model: data.model,
          size: imageSize,
          style: imageStyle,
          provider: data.provider || 'AI Generator',
          created: data.created,
          enhanced_prompt: data.enhancedPrompt,
          processing_time: data.processingTime,
          response_time: responseTime
        }
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request was aborted');
        return; // Don't show error for aborted requests
      }
      
      console.error('Generation Error:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ ${error.message}`,
        timestamp: Date.now(),
        type: 'error',
        originalPrompt: prompt
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Update connection status if needed
      if (error.message.includes('Network') || error.message.includes('Failed to fetch')) {
        setIsConnected(false);
      }
      
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const clearChat = useCallback(() => {
    // Abort any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setIsLoading(false);
  }, []);

  const retryGeneration = useCallback((prompt) => {
    setRetryCount(prev => prev + 1);
    generateImage(prompt);
  }, [model, imageSize, imageStyle, numImages]);

  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoading(false);
  }, []);

  // Available models for image generation
  const availableModels = [
    { 
      value: 'raphael-creative', 
      label: 'Raphael Creative 🎨', 
      description: 'Model kreatif untuk seni dan ilustrasi yang ekspresif',
      category: 'creative'
    },
    { 
      value: 'raphael-realistic', 
      label: 'Raphael Realistic 📸', 
      description: 'Model realistis untuk foto dan gambar yang detail',
      category: 'realistic'
    },
    { 
      value: 'raphael-artistic', 
      label: 'Raphael Artistic 🖼️', 
      description: 'Model artistik untuk lukisan dan karya seni',
      category: 'artistic'
    },
    { 
      value: 'raphael-anime', 
      label: 'Raphael Anime 🌸', 
      description: 'Model khusus untuk style anime dan manga',
      category: 'anime'
    }
  ];

  // Image size options
  const imageSizes = [
    { value: '256x256', label: '256×256 (Cepat)', cost: 'Fast' },
    { value: '512x512', label: '512×512 (Standar)', cost: 'Standard' },
    { value: '1024x1024', label: '1024×1024 (Kualitas)', cost: 'High Quality' },
    { value: '1792x1024', label: '1792×1024 (Landscape)', cost: 'Widescreen' },
    { value: '1024x1792', label: '1024×1792 (Portrait)', cost: 'Vertical' }
  ];

  // Image styles
  const imageStyles = [
    { value: 'natural', label: 'Natural 🌿', desc: 'Warna dan lighting alami' },
    { value: 'vivid', label: 'Vivid 🌈', desc: 'Warna cerah dan kontras tinggi' },
    { value: 'artistic', label: 'Artistic 🎭', desc: 'Gaya artistik dan painterly' },
    { value: 'photographic', label: 'Photographic 📷', desc: 'Fotorealistis dan detail tinggi' },
    { value: 'anime', label: 'Anime 🎌', desc: 'Gaya anime dan manga Jepang' },
    { value: 'cartoon', label: 'Cartoon 🎪', desc: 'Gaya kartun dan ilustrasi' }
  ];

  const examplePrompts = [
    "Beautiful girl with long hair in cherry blossom garden",
    "Mountain landscape with clear lake and starry sky",
    "Futuristic robot with elegant design in cyberpunk city",
    "Abstract painting with bright dynamic colors",
    "Cute cat playing with yarn in cozy living room",
    "Medieval castle with dragon flying in sunset sky",
    "Astronaut walking on alien planet with two suns",
    "Bamboo forest with sunlight filtering through leaves"
  ];

  // Safe image loading component
  const ImageDisplay = ({ src, alt, index, total }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleImageLoad = () => {
      setImageLoaded(true);
      setImageError(false);
    };

    const handleImageError = () => {
      setImageError(true);
      setImageLoaded(false);
      console.warn(`Failed to load image: ${src}`);
    };

    return (
      <div className="relative">
        {!imageLoaded && !imageError && (
          <div className="w-full h-48 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
            <div className="text-gray-500 text-sm">Loading image...</div>
          </div>
        )}
        
        {imageError && (
          <div className="w-full h-48 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500 text-sm">
              <div className="mb-2">⚠️ Failed to load image</div>
              <div className="text-xs text-gray-400">Service may be unavailable</div>
            </div>
          </div>
        )}
        
        <img
          src={src}
          alt={alt}
          className={`w-full rounded-lg shadow-md hover:shadow-lg transition-shadow ${
            imageLoaded ? 'block' : 'hidden'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
        
        {imageLoaded && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
            {index + 1}/{total}
          </div>
        )}
      </div>
    );
  };

  // Custom MessageBubble for image generation
  const ImageMessageBubble = ({ message }) => {
    if (message.role === 'user') {
      return (
        <div className="flex justify-end mb-4">
          <div className="max-w-xs lg:max-w-md px-4 py-2 bg-purple-500 text-white rounded-lg">
            <div className="text-sm">{message.content}</div>
            <div className="text-xs text-purple-100 mt-1">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      );
    }

    if (message.type === 'error') {
      return (
        <div className="flex justify-start mb-4">
          <div className="max-w-xs lg:max-w-md px-4 py-2 bg-red-100 border border-red-200 rounded-lg">
            <div className="text-sm text-red-700">{message.content}</div>
            <div className="text-xs text-red-500 mt-1">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
            {message.originalPrompt && (
              <div className="mt-2">
                <button
                  onClick={() => retryGeneration(message.originalPrompt)}
                  className="text-xs text-red-600 hover:text-red-800 underline"
                >
                  🔄 Retry
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (message.type === 'image') {
      return (
        <div className="flex justify-start mb-6">
          <div className="max-w-full lg:max-w-2xl">
            <div className="mb-3 px-4 py-2 bg-gray-100 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-1">
                🎨 Generated {message.content.length} image{message.content.length > 1 ? 's' : ''}
              </div>
              <div className="text-xs text-gray-500">
                Prompt: "{message.prompt}"
              </div>
              {message.metadata && (
                <div className="text-xs text-gray-400 mt-1">
                  {message.metadata.model} • {message.metadata.size} • {message.metadata.style}
                  {message.metadata.processing_time && (
                    <span> • {message.metadata.processing_time}ms</span>
                  )}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {message.content.map((imageUrl, index) => (
                <ImageDisplay
                  key={index}
                  src={imageUrl}
                  alt={message.prompt}
                  index={index}
                  total={message.content.length}
                />
              ))}
            </div>
            
            <div className="flex gap-2 mt-3 text-xs">
              <button
                onClick={() => retryGeneration(message.prompt)}
                className="px-2 py-1 bg-purple-100 text-purple-600 rounded hover:bg-purple-200 transition-colors"
              >
                🔄 Regenerate
              </button>
              <span className="text-gray-500">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <ChatLayout
      title="Raphael AI Generator"
      subtitle="AI Image Generator dengan multiple AI services & optimized performance"
      icon="🎨"
      color="purple"
    >
      {/* Status Banner */}
      <div className={`px-4 py-3 border-b ${
        isConnected 
          ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-100' 
          : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-100'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
              {isConnected ? '🟢' : '🔴'}
            </span>
            <span className={`font-medium ${isConnected ? 'text-green-700' : 'text-red-700'}`}>
              {isConnected ? 'AI Service Online' : 'AI Service Offline'}
            </span>
            <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
              - {isConnected ? 'Siap generate gambar AI!' : 'Menggunakan fallback service'}
            </span>
          </div>
          
          <button
            onClick={testAIConnection}
            className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            🔄 Test Connection
          </button>
        </div>
        
        <div className={`text-xs mt-1 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
          {isConnected 
            ? 'Multiple AI Services aktif dengan optimized processing' 
            : 'Beberapa fitur mungkin terbatas. Coba refresh atau test connection.'
          }
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div className="space-y-3">
          {/* Model and Basic Settings */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Model:</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                disabled={isLoading}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white min-w-[200px] disabled:opacity-50"
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
                {messages.filter(m => m.type === 'image').length} gambar dibuat
              </span>
              {retryCount > 0 && (
                <span className="text-xs text-orange-500 bg-orange-100 px-2 py-1 rounded-full">
                  {retryCount} retry
                </span>
              )}
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  disabled={isLoading}
                  className="px-3 py-1.5 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  🗑️ Clear
                </button>
              )}
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Ukuran:</label>
              <select
                value={imageSize}
                onChange={(e) => setImageSize(e.target.value)}
                disabled={isLoading}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white disabled:opacity-50"
              >
                {imageSizes.map((size) => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Style:</label>
              <select
                value={imageStyle}
                onChange={(e) => setImageStyle(e.target.value)}
                disabled={isLoading}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white disabled:opacity-50"
              >
                {imageStyles.map((style) => (
                  <option key={style.value} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Jumlah:</label>
              <select
                value={numImages}
                onChange={(e) => setNumImages(parseInt(e.target.value))}
                disabled={isLoading}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white disabled:opacity-50"
              >
                <option value={1}>1 gambar</option>
                <option value={2}>2 gambar</option>
                <option value={3}>3 gambar</option>
                <option value={4}>4 gambar</option>
              </select>
            </div>
          </div>

          {/* Model Description */}
          {availableModels.find(m => m.value === model) && (
            <div className="text-xs text-gray-600 bg-white px-3 py-2 rounded-md border">
              ℹ️ {availableModels.find(m => m.value === model).description}
            </div>
          )}
        </div>
      </div>

      {/* Example Prompts */}
      {messages.length === 0 && (
        <div className="px-4 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b">
          <div className="text-sm font-medium text-gray-700 mb-3">💡 Contoh Prompt:</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {examplePrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => generateImage(prompt)}
                disabled={isLoading}
                className="text-left text-xs p-2 bg-white border border-gray-200 rounded-md hover:border-purple-300 hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ImageMessageBubble key={message.id} message={message} />
        ))}
        
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="max-w-xs lg:max-w-md px-4 py-3 bg-gray-100 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                <span className="text-sm text-gray-600">Generating images...</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                This may take a few moments
              </div>
              <button
                onClick={cancelGeneration}
                className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <InputArea
          onSend={generateImage}
          isLoading={isLoading}
          placeholder="Tulis deskripsi gambar yang ingin dibuat... (contoh: 'beautiful sunset over mountains')"
          buttonText="🎨 Generate"
          showImageUpload={false}
        />
      </div>
    </ChatLayout>
  );
}