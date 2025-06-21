import React from 'react';
import ChatLayout from '../shared/ChatLayout';
import MessageBubble from '../shared/MessageBubble';
import InputArea from '../shared/InputArea';
import { useChat } from '../../hooks/useChat';
import { OpenAIProvider } from '../../providers/OpenAIProvider';
import { MessageCircleIcon } from '../shared/icons';

export default function OpenAIChat() {
  const chat = useChat(OpenAIProvider);

  return (
    <ChatLayout
      title="ChatGPT AI"
      icon={<MessageCircleIcon />}
      showApiKeyInput={chat.showApiKeyInput}
      setShowApiKeyInput={chat.setShowApiKeyInput}
      apiKey={chat.apiKey}
      setApiKey={chat.setApiKey}
      apiKeyLabel="OpenAI API Key"
      apiKeyPlaceholder="Masukkan OpenAI API Key..."
      color="green"
    >
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <MessageCircleIcon />
            <p className="mt-2">Mulai percakapan dengan ChatGPT</p>
          </div>
        )}
        
        {chat.messages.map((message, index) => (
          <MessageBubble
            key={index}
            message={message}
            index={index}
            onCopy={chat.copyToClipboard}
            copiedIndex={chat.copiedIndex}
          />
        ))}
        
        <div ref={chat.messagesEndRef} />
      </div>

      <InputArea
        input={chat.input}
        setInput={chat.setInput}
        onSubmit={chat.sendMessage}
        isLoading={chat.isLoading}
        onClear={chat.clearChat}
        hasMessages={chat.messages.length > 0}
      />
    </ChatLayout>
  );
}