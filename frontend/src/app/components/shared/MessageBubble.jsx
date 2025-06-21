// components/shared/MessageBubble.jsx
import React from 'react';

const MessageBubble = ({ message, isUser, timestamp }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isUser 
          ? 'bg-blue-500 text-white' 
          : 'bg-white text-gray-800 shadow-sm border border-gray-200'
      }`}>
        <p className="text-sm whitespace-pre-wrap">{message}</p>
        {timestamp && (
          <span className={`text-xs mt-1 block ${
            isUser ? 'text-blue-100' : 'text-gray-400'
          }`}>
            {new Date(timestamp).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;