// backend/routes/chat.js
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// In-memory storage (gunakan database untuk production)
let conversations = new Map();

// Membuat conversation baru
router.post('/conversations', (req, res) => {
  try {
    const conversationId = uuidv4();
    const conversation = {
      id: conversationId,
      createdAt: new Date(),
      messages: []
    };
    
    conversations.set(conversationId, conversation);
    
    res.status(201).json({
      id: conversationId,
      message: 'Conversation created successfully'
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// Mendapatkan conversation berdasarkan ID
router.get('/conversations/:id', (req, res) => {
  try {
    const { id } = req.params;
    const conversation = conversations.get(id);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    res.json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

// Mengirim pesan ke conversation
router.post('/conversations/:id/messages', (req, res) => {
  try {
    const { id } = req.params;
    const { content, sender } = req.body;
    
    // Validasi input
    if (!content || !sender) {
      return res.status(400).json({ error: 'Content and sender are required' });
    }
    
    // Cek apakah conversation exists
    const conversation = conversations.get(id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    // Buat pesan baru
    const message = {
      id: uuidv4(),
      content,
      sender,
      timestamp: new Date()
    };
    
    // Tambahkan pesan ke conversation
    conversation.messages.push(message);
    conversations.set(id, conversation);
    
    // Simulasi AI response (ganti dengan AI API yang sebenarnya)
    if (sender === 'user') {
      setTimeout(() => {
        const aiMessage = {
          id: uuidv4(),
          content: `AI Response to: ${content}`,
          sender: 'ai',
          timestamp: new Date()
        };
        conversation.messages.push(aiMessage);
        conversations.set(id, conversation);
      }, 1000);
    }
    
    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Mendapatkan semua pesan dari conversation
router.get('/conversations/:id/messages', (req, res) => {
  try {
    const { id } = req.params;
    const conversation = conversations.get(id);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    res.json(conversation.messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;