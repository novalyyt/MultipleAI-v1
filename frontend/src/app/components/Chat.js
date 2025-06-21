// frontend/src/components/Chat.js
import React, { useState } from 'react';
import { useChat } from '../hooks/useChat';

const Chat = () => {
  const [inputValue, setInputValue] = useState('');
  const { messages, loading, error, sendMessage, resetChat } = useChat();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputValue.trim() && !loading) {
      try {
        await sendMessage(inputValue.trim());
        setInputValue('');
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>AI Chat</h1>
        <button onClick={resetChat} className="reset-btn">
          New Chat
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={resetChat}>Try Again</button>
        </div>
      )}

      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-content">{message.content}</div>
            <div className="message-timestamp">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        {loading && <div className="loading">Sending...</div>}
      </div>

      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
          className="message-input"
        />
        <button type="submit" disabled={loading || !inputValue.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;