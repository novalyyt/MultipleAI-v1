'use client';

import Link from 'next/link';
import { MessageCircleIcon, BotIcon, UserIcon } from './components/shared/icons';

const aiProviders = [
  {
    id: 'gemini',
    name: 'Gemini AI',
    description: 'Google Gemini - AI multimodal yang powerful',
    color: 'blue',
    href: '/gemini',
    icon: '🤖'
  },
  {
    id: 'openai',
    name: 'ChatGPT',
    description: 'OpenAI GPT - AI conversational terpopuler',
    color: 'green', 
    href: '/openai',
    icon: '💬'
  },
  {
    id: 'claude',
    name: 'Claude AI',
    description: 'Anthropic Claude - AI yang aman dan helpful',
    color: 'purple',
    href: '/claude', 
    icon: '🧠'
  },
  {
    id: 'ollama',
    name: 'Ollama Local',
    description: 'AI lokal dengan Ollama - Privacy first',
    color: 'orange',
    href: '/ollama',
    icon: '🏠'
  },
  {
    id: 'raphael',
    name: 'RaphaelApp',
    description: 'AI Generate gambar',
    color: 'pink',
    href: '/raphael',
    icon: '🦄'
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <MessageCircleIcon />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">AI NOVDEV</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Pilih AI Assistant favorit Anda untuk memulai percakapan
          </p>
        </div>

        {/* AI Cards Grid */}
<div className="mb-12">
  <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
    {aiProviders.slice(0, -1).map((provider) => (
      <Link key={provider.id} href={provider.href}>
        <div className={`
          group relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl 
          transition-all duration-300 cursor-pointer transform hover:-translate-y-1
          border-2 border-transparent hover:border-${provider.color}-200
          bg-gradient-to-br from-white to-${provider.color}-50
        `}>
          {/* Icon */}
          <div className={`
            w-16 h-16 bg-${provider.color}-500 rounded-xl flex items-center justify-center mb-4
            group-hover:scale-110 transition-transform duration-300
          `}>
            <span className="text-2xl">{provider.icon}</span>
          </div>

          {/* Content */}
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {provider.name}
          </h3>
          <p className="text-gray-600 mb-4">
            {provider.description}
          </p>

          {/* Action Button */}
          <div className={`
            inline-flex items-center gap-2 px-4 py-2 
            bg-${provider.color}-500 text-white rounded-lg
            group-hover:bg-${provider.color}-600 transition-colors
          `}>
            <span>Mulai Chat</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>

          {/* Hover Effect */}
          <div className={`
            absolute inset-0 bg-${provider.color}-500 opacity-0 group-hover:opacity-5 
            rounded-2xl transition-opacity duration-300
          `}></div>
        </div>
      </Link>
    ))}
  </div>
  
            {/* Last item centered */}
            <div className="flex justify-center mt-6">
              <Link href={aiProviders[aiProviders.length - 1].href}>
                <div className={`
                  group relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl 
                  transition-all duration-300 cursor-pointer transform hover:-translate-y-1
                  border-2 border-transparent hover:border-${aiProviders[aiProviders.length - 1].color}-200
                  bg-gradient-to-br from-white to-${aiProviders[aiProviders.length - 1].color}-50
                  w-96 max-w-full
                `}>
                  {/* Icon */}
                  <div className={`
                    w-16 h-16 bg-${aiProviders[aiProviders.length - 1].color}-500 rounded-xl flex items-center justify-center mb-4
                    group-hover:scale-110 transition-transform duration-300
                  `}>
                    <span className="text-2xl">{aiProviders[aiProviders.length - 1].icon}</span>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {aiProviders[aiProviders.length - 1].name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {aiProviders[aiProviders.length - 1].description}
                  </p>

                  {/* Action Button */}
                  <div className={`
                    inline-flex items-center gap-2 px-4 py-2 
                    bg-${aiProviders[aiProviders.length - 1].color}-500 text-white rounded-lg
                    group-hover:bg-${aiProviders[aiProviders.length - 1].color}-600 transition-colors
                  `}>
                    <span>Mulai Chat</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>

                  {/* Hover Effect */}
                  <div className={`
                    absolute inset-0 bg-${aiProviders[aiProviders.length - 1].color}-500 opacity-0 group-hover:opacity-5 
                    rounded-2xl transition-opacity duration-300
                  `}></div>
                </div>
              </Link>
            </div>
          </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Fitur Unggulan
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Multi AI Provider</h3>
              <p className="text-gray-600 text-sm">Akses berbagai AI dalam satu platform</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Aman & Private</h3>
              <p className="text-gray-600 text-sm">API Key disimpan lokal di browser Anda</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-600">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Cepat & Responsif</h3>
              <p className="text-gray-600 text-sm">Interface modern dengan performa optimal</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500">
          <p className="mb-2">© 2025 AI NOVDEV. By NOVdev</p>
          <p className="text-sm">
            Membutuhkan API Key dari masing-masing provider untuk menggunakan layanan
          </p>
        </div>
      </div>
    </div>
  );
}