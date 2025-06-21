import React from 'react';
import CodeBlock from './CodeBlock';
import { parseCodeBlocks, replaceCodeBlocksWithPlaceholders } from '../utils/codeParser';

interface MessageProps {
  message: {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
  };
  isTyping?: boolean;
}

const Message: React.FC<MessageProps> = ({ message, isTyping = false }) => {
  const { text, codeBlocks } = parseCodeBlocks(message.text);
  const textWithoutCodeBlocks = replaceCodeBlocksWithPlaceholders(text, codeBlocks);

  const renderMessageContent = () => {
    if (codeBlocks.length === 0) {
      return (
        <div className="whitespace-pre-wrap break-words">
          {formatText(message.text)}
        </div>
      );
    }

    // Split text by code block placeholders and render alternating text and code blocks
    const parts = textWithoutCodeBlocks.split(/(__CODE_BLOCK_code-block-\d+__)/);
    
    return (
      <div className="space-y-3">
        {parts.map((part, index) => {
          const codeBlockMatch = part.match(/^__CODE_BLOCK_(code-block-\d+)__$/);
          
          if (codeBlockMatch) {
            const blockId = codeBlockMatch[1];
            const codeBlock = codeBlocks.find(block => block.id === blockId);
            
            if (codeBlock) {
              return (
                <CodeBlock
                  key={`${message.id}-${blockId}`}
                  code={codeBlock.code}
                  language={codeBlock.language}
                  fileName={codeBlock.fileName}
                />
              );
            }
          }
          
          // Regular text part
          if (part.trim()) {
            return (
              <div key={index} className="whitespace-pre-wrap break-words">
                {formatText(part)}
              </div>
            );
          }
          
          return null;
        })}
      </div>
    );
  };

  const formatText = (text: string) => {
    // Handle inline code blocks (single backticks)
    const parts = text.split(/(`[^`\n]+`)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        const code = part.slice(1, -1);
        return (
          <code
            key={index}
            className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-sm font-mono rounded text-gray-800 dark:text-gray-200"
          >
            {code}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div
      className={`flex ${
        message.sender === 'user' ? 'justify-end' : 'justify-start'
      } mb-4`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          message.sender === 'user'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
        }`}
      >
        {/* Message Content */}
        <div className="mb-2">
          {renderMessageContent()}
        </div>

        {/* Typing Indicator */}
        {isTyping && message.sender === 'bot' && (
          <div className="flex space-x-1 items-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            </div>
            <span className="text-sm text-gray-500 ml-2">AI is typing...</span>
          </div>
        )}

        {/* Timestamp */}
        <div
          className={`text-xs mt-1 ${
            message.sender === 'user'
              ? 'text-blue-100'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
};

export default Message;