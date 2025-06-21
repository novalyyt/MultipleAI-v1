// frontend/src/utils/storage.js
export const saveConversationId = (id) => {
  try {
    localStorage.setItem('conversationId', id);
  } catch (error) {
    console.error('Error saving conversation ID:', error);
  }
};

export const getConversationId = () => {
  try {
    return localStorage.getItem('conversationId');
  } catch (error) {
    console.error('Error getting conversation ID:', error);
    return null;
  }
};

export const clearConversationId = () => {
  try {
    localStorage.removeItem('conversationId');
  } catch (error) {
    console.error('Error clearing conversation ID:', error);
  }
};