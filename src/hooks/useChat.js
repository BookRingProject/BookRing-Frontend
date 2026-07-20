import { useState, useCallback } from 'react';
import { sendChatMessage, formatChatResponse } from '../services/chatService';

export const useChat = (initialBookId = null) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bookId, setBookId] = useState(initialBookId);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (message) => {
    if (!message || message.trim().length === 0) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendChatMessage(message, bookId);
      const formatted = formatChatResponse(response);

      if (formatted.bookId) {
        setBookId(formatted.bookId);
      }

      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: formatted.reply,
        timestamp: new Date().toISOString(),
        bookFound: formatted.bookFound,
        bookTitle: formatted.bookTitle,
      };
      setMessages((prev) => [...prev, botMessage]);

    } catch (err) {
      setError(err.message || 'An error occurred');
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I'm sorry, I encountered an error. Please try again later.",
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [bookId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const resetBookContext = useCallback(() => {
    setBookId(initialBookId);
  }, [initialBookId]);

  return {
    messages,
    isLoading,
    error,
    bookId,
    sendMessage,
    clearMessages,
    resetBookContext,
    setBookId,
  };
};

export default useChat;
