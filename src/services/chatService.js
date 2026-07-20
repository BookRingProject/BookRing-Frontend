import api from './api';

/**
 * Send a message to BRbot and get an AI response
 * @param {string} message - User's message
 * @param {string} bookId - Optional book ID to reference a specific book
 * @returns {Promise<Object>} - Response from the server
 */
export const sendChatMessage = async (message, bookId = null) => {
  try {
    const payload = { message };
    if (bookId) {
      payload.bookId = bookId;
    }

    const response = await api.post('/chat', payload);
    return response.data;
  } catch (error) {
    console.error('Chat API error:', error);
    throw error;
  }
};

/**
 * Send a message with a specific book context
 * @param {string} message - User's message
 * @param {string} bookId - Book ID to reference
 * @returns {Promise<Object>} - Response from the server
 */
export const sendChatWithBook = async (message, bookId) => {
  return sendChatMessage(message, bookId);
};

/**
 * Format chat response for display
 * @param {Object} response - Response from the server
 * @returns {Object} - Formatted response with reply and metadata
 */
export const formatChatResponse = (response) => {
  if (!response || !response.data) {
    return {
      reply: 'Sorry, I could not process your request.',
      bookFound: false,
      bookTitle: null,
      bookId: null,
    };
  }

  const { reply, bookFound, bookTitle, bookId } = response.data;
  
  return {
    reply: reply || 'No response received.',
    bookFound: bookFound || false,
    bookTitle: bookTitle || null,
    bookId: bookId || null,
  };
};

export default {
  sendChatMessage,
  sendChatWithBook,
  formatChatResponse,
};
