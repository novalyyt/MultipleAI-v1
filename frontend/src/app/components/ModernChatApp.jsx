import React, { useState, useEffect, useRef } from 'react';
import { Send, Plus, MessageCircle, Trash2, Settings, Moon, Sun, Sidebar, X, Edit2, Search, Archive, Star } from 'lucide-react';

// Enhanced Mock API with more realistic responses
const mockAPI = {
  getConversations: async () => [
    { 
      id: 1, 
      title: 'Web Development Discussion', 
      message_count: 15, 
      last_message_at: '2024-01-15T10:30:00Z',
      preview: 'How can I optimize React performance?',
      starred: true
    },
    { 
      id: 2, 
      title: 'React Best Practices', 
      message_count: 8, 
      last_message_at: '2024-01-14T15:45:00Z',
      preview: 'Let me explain hooks in detail...',
      starred: false
    },
    { 
      id: 3, 
      title: 'JavaScript Tips', 
      message_count: 23, 
      last_message_at: '2024-01-13T09:20:00Z',
      preview: 'Modern ES6+ features are amazing',
      starred: false
    },
    { 
      id: 4, 
      title: 'CSS Grid Layout', 
      message_count: 12, 
      last_message_at: '2024-01-12T14:15:00Z',
      preview: 'Grid vs Flexbox comparison',
      starred: true
    }
  ],
  getConversation: async (id) => ({
    id,
    title: id === 1 ? 'Web Development Discussion' : 'Sample Conversation',
    messages: id === 1 ? [
      { id: 1, content: 'Hello! I\'m here to help you with web development. What would you like to learn today?', sender: 'ai', created_at: '2024-01-15T10:00:00Z' },
      { id: 2, content: 'I need help optimizing React performance. My app is getting slow with large datasets.', sender: 'user', created_at: '2024-01-15T10:01:00Z' },
      { id: 3, content: 'Great question! React performance optimization involves several strategies:\n\n1. **React.memo()** - Prevents unnecessary re-renders\n2. **useMemo()** - Memoizes expensive calculations\n3. **useCallback()** - Memoizes functions\n4. **Virtual scrolling** - For large lists\n5. **Code splitting** - Lazy loading components\n\nWhich area would you like me to dive deeper into?', sender: 'ai', created_at: '2024-01-15T10:02:00Z' },
      { id: 4, content: 'Can you show me an example of React.memo() in action?', sender: 'user', created_at: '2024-01-15T10:03:00Z' },
      { id: 5, content: 'Absolutely! Here\'s a practical example:\n\n```jsx\nconst ExpensiveComponent = React.memo(({ data, onUpdate }) => {\n  return (\n    <div>\n      {data.map(item => (\n        <div key={item.id}>{item.name}</div>\n      ))}\n    </div>\n  );\n});\n```\n\nThis component will only re-render when `data` or `onUpdate` props actually change, not when parent re-renders!', sender: 'ai', created_at: '2024-01-15T10:04:00Z' }
    ] : [
      { id: 1, content: 'Hello! How can I help you today?', sender: 'ai', created_at: '2024-01-15T10:00:00Z' },
      { id: 2, content: 'I need help with React hooks', sender: 'user', created_at: '2024-01-15T10:01:00Z' },
      { id: 3, content: 'I\'d be happy to help you with React hooks! React hooks are functions that let you use state and other React features in functional components. Would you like me to explain a specific hook?', sender: 'ai', created_at: '2024-01-15T10:02:00Z' }
    ]
  }),
  sendMessage: async (conversationId, content) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Smart responses based on keywords
    let aiResponse = "I understand your question. Let me help you with that!";
    
    if (content.toLowerCase().includes('react')) {
      aiResponse = "React is a fantastic library! Here are some key concepts that might help you:\n\n• Components are the building blocks\n• State management with useState\n• Side effects with useEffect\n• Props for data passing\n\nWhat specific aspect of React would you like to explore?";
    } else if (content.toLowerCase().includes('javascript')) {
      aiResponse = "JavaScript has evolved tremendously! Here are some modern features you should know:\n\n• Arrow functions\n• Destructuring\n• Template literals\n• Async/await\n• Modules\n\nWhich one interests you most?";
    } else if (content.toLowerCase().includes('css')) {
      aiResponse = "CSS has some amazing modern features:\n\n• Flexbox for 1D layouts\n• Grid for 2D layouts\n• Custom properties (CSS variables)\n• Container queries\n• CSS-in-JS solutions\n\nWhat CSS challenge are you facing?";
    }
    
    return {
      userMessage: { id: Date.now(), content, sender: 'user', created_at: new Date().toISOString() },
      aiMessage: { id: Date.now() + 1, content: aiResponse, sender: 'ai', created_at: new Date().toISOString() }
    };
  },
  createConversation: async () => ({
    id: Date.now(),
    title: 'New Chat',
    messages: [],
    preview: '',
    starred: false
  })
};

export default function ModernChatApp() {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Auto-focus input when conversation changes
    if (currentConversation && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const data = await mockAPI.getConversations();
      setConversations(data);
      if (data.length > 0 && !currentConversation) {
        selectConversation(data[0].id);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectConversation = async (id) => {
    try {
      setIsLoading(true);
      const conversation = await mockAPI.getConversation(id);
      setCurrentConversation(conversation);
      setMessages(conversation.messages || []);
    } catch (error) {
      console.error('Error loading conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewConversation = async () => {
    try {
      const newConversation = await mockAPI.createConversation();
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
      setMessages([]);
      setIsSidebarOpen(false); // Auto-hide sidebar on mobile after creating
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || !currentConversation) return;

    const messageContent = inputMessage.trim();
    setInputMessage('');
    setIsTyping(true);

    // Add user message immediately for better UX
    const tempUserMessage = {
      id: Date.now(),
      content: messageContent,
      sender: 'user',
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMessage]);

    try {
      const { aiMessage } = await mockAPI.sendMessage(currentConversation.id, messageContent);
      setMessages(prev => [...prev, aiMessage]);
      
      // Update conversation preview
      setConversations(prev => prev.map(conv => 
        conv.id === currentConversation.id 
          ? { ...conv, preview: messageContent, last_message_at: new Date().toISOString(), message_count: conv.message_count + 2 }
          : conv
      ));
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        content: '❌ Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        created_at: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleStarConversation = (conversationId) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, starred: !conv.starred }
        : conv
    ));
  };

  const deleteConversation = (conversationId) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    if (currentConversation?.id === conversationId) {
      const remaining = conversations.filter(conv => conv.id !== conversationId);
      if (remaining.length > 0) {
        selectConversation(remaining[0].id);
      } else {
        setCurrentConversation(null);
        setMessages([]);
      }
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const themeClasses = isDarkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gradient-to-br from-blue-50 to-purple-50 text-gray-900';

  const sidebarClasses = isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white/80 backdrop-blur-sm border-gray-200';

  const messageClasses = isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white/80 backdrop-blur-sm border-gray-200';

  return (
    <div className={`flex h-screen ${themeClasses} transition-all duration-500`}>
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden border-r ${sidebarClasses} shadow-xl`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                ✨ AI Chat
              </h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110"
                  title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDarkMode ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-blue-600" />}
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110"
                  title="Settings"
                >
                  <Settings size={18} />
                </button>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 lg:hidden"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
              />
            </div>

            <button
              onClick={createNewConversation}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <Plus size={18} />
              <span className="font-medium">New Chat</span>
            </button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
                <p>No conversations found</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`group relative p-3 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${
                    currentConversation?.id === conversation.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                      : `hover:bg-gray-100 dark:hover:bg-gray-700 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`
                  }`}
                  onClick={() => selectConversation(conversation.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <MessageCircle size={16} className={conversation.starred ? 'text-yellow-400' : ''} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate text-sm">{conversation.title}</h3>
                        {conversation.starred && (
                          <Star size={12} className="text-yellow-400 fill-current flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs opacity-70 truncate mb-1">
                        {conversation.preview || 'No messages yet'}
                      </p>
                      <p className="text-xs opacity-60">
                        {conversation.message_count} messages • {formatDate(conversation.last_message_at)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStarConversation(conversation.id);
                      }}
                      className="p-1 rounded hover:bg-white/20 transition-colors"
                      title={conversation.starred ? 'Unstar' : 'Star'}
                    >
                      <Star size={12} className={conversation.starred ? 'fill-current text-yellow-400' : ''} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conversation.id);
                      }}
                      className="p-1 rounded hover:bg-red-500/20 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800/80' : 'border-gray-200 bg-white/80'} backdrop-blur-sm shadow-sm`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {!isSidebarOpen && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110"
                >
                  <Sidebar size={20} />
                </button>
              )}
              <div>
                <h2 className="font-semibold text-lg">
                  {currentConversation?.title || 'Select a conversation'}
                </h2>
                <p className="text-sm opacity-70">
                  {messages.length > 0 ? `${messages.length} messages` : 'Start a new conversation'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-600">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading && messages.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
              <p className="text-gray-500">Loading conversation...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full mb-6">
                <MessageCircle size={48} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Start a conversation
              </h3>
              <p className="text-gray-500 mb-6 max-w-md">
                Send a message to begin chatting with AI. Ask questions, get help with coding, or just have a friendly conversation!
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['How to optimize React?', 'Explain JavaScript closures', 'CSS Grid vs Flexbox'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInputMessage(suggestion)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`max-w-xs lg:max-w-md xl:max-w-2xl ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : `${messageClasses} shadow-md`
                } rounded-2xl p-4 ${message.sender === 'user' ? 'rounded-br-md' : 'rounded-bl-md'} transition-all duration-300 hover:shadow-lg`}>
                  <div className="flex items-start gap-3">
                    {message.sender === 'ai' && (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        AI
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="whitespace-pre-wrap leading-relaxed text-sm"
                           dangerouslySetInnerHTML={{
                             __html: message.content
                               .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                               .replace(/```(.*?)```/gs, '<code class="block bg-gray-100 dark:bg-gray-700 p-2 rounded mt-2 mb-2 text-xs">$1</code>')
                               .replace(/•/g, '•')
                           }}
                      />
                      <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {formatTime(message.created_at)}
                      </p>
                    </div>
                    {message.sender === 'user' && (
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        You
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className={`${messageClasses} rounded-2xl rounded-bl-md p-4 shadow-md`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    AI
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-500 ml-2">AI is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

                 placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                  disabled={isLoading || !currentConversation}
                  rows={1}
                  className={`w-full px-4 py-3 rounded-xl border-2 resize-none ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                  } focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200`}
                  style={{
                    minHeight: '48px',
                    maxHeight: '120px',
                    height: 'auto'
                  }}
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading || !currentConversation}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:transform-none disabled:hover:shadow-lg flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <Send size={18} />
                    <span className="hidden sm:inline">Send</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      }</style>
    </div>
  );
}