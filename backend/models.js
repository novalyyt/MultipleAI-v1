const { db } = require('./database');

class ConversationModel {
  // Get all conversations
  static async getAll() {
    const sql = `
      SELECT 
        c.*,
        COUNT(m.id) as message_count,
        MAX(m.created_at) as last_message_at
      FROM conversations c
      LEFT JOIN messages m ON c.id = m.conversation_id
      GROUP BY c.id
      ORDER BY c.updated_at DESC
    `;
    return await db.query(sql);
  }

  // Get conversation by ID with messages
  static async getById(id) {
    const conversationSql = 'SELECT * FROM conversations WHERE id = ?';
    const conversations = await db.query(conversationSql, [id]);
    
    if (conversations.length === 0) {
      return null;
    }

    const messagesSql = `
      SELECT * FROM messages 
      WHERE conversation_id = ? 
      ORDER BY created_at ASC
    `;
    const messages = await db.query(messagesSql, [id]);

    return {
      ...conversations[0],
      messages: messages
    };
  }

  // Create new conversation
  static async create(title = 'New Chat') {
    const sql = 'INSERT INTO conversations (title) VALUES (?)';
    const result = await db.query(sql, [title]);
    
    return {
      id: result.insertId,
      title,
      created_at: new Date(),
      updated_at: new Date(),
      messages: []
    };
  }

  // Update conversation
  static async update(id, data) {
    const fields = [];
    const values = [];

    if (data.title !== undefined) {
      fields.push('title = ?');
      values.push(data.title);
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const sql = `UPDATE conversations SET ${fields.join(', ')} WHERE id = ?`;
    await db.query(sql, values);

    return await this.getById(id);
  }

  // Delete conversation
  static async delete(id) {
    const sql = 'DELETE FROM conversations WHERE id = ?';
    const result = await db.query(sql, [id]);
    return result.affectedRows > 0;
  }
}

class MessageModel {
  // Create new message
  static async create(conversationId, content, sender) {
    const sql = `
      INSERT INTO messages (conversation_id, content, sender) 
      VALUES (?, ?, ?)
    `;
    const result = await db.query(sql, [conversationId, content, sender]);

    // Update conversation updated_at
    await db.query(
      'UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [conversationId]
    );

    return {
      id: result.insertId,
      conversation_id: conversationId,
      content,
      sender,
      created_at: new Date()
    };
  }

  // Get messages by conversation ID
  static async getByConversationId(conversationId) {
    const sql = `
      SELECT * FROM messages 
      WHERE conversation_id = ? 
      ORDER BY created_at ASC
    `;
    return await db.query(sql, [conversationId]);
  }

  // Delete message
  static async delete(id) {
    const sql = 'DELETE FROM messages WHERE id = ?';
    const result = await db.query(sql, [id]);
    return result.affectedRows > 0;
  }

  // Get conversation history for AI context
  static async getConversationHistory(conversationId, limit = 10) {
    const sql = `
      SELECT content, sender FROM messages 
      WHERE conversation_id = ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `;
    const messages = await db.query(sql, [conversationId, limit]);
    return messages.reverse(); // Return in chronological order
  }
}

module.exports = {
  ConversationModel,
  MessageModel
};