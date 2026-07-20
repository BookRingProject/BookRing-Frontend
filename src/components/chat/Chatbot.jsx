/**
 * Chatbot Component - BRbot Main Chat Interface
 * MIT License
 * 
 * The main chat interface component that renders the chat window,
 * manages messages state, and handles user interactions.
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { sendChatMessage, formatChatResponse } from '../../services/chatService';
import styles from './Chatbot.module.css';

const Chatbot = ({ 
  initialBookId = null, 
  onClose = null,
  isOpen = true 
}) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bookId, setBookId] = useState(initialBookId);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Add a welcome message when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          type: 'bot',
          content: "Hi there! I'm BRbot 👋\n\nI can help you study your books. Just tell me which book you want to discuss, and I'll analyze it for you.",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, [isOpen]);

  const handleSendMessage = async (message) => {
    if (!message || message.trim().length === 0) return;

    // Add user message to chat
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Send to backend
      const response = await sendChatMessage(message, bookId);
      const formatted = formatChatResponse(response);

      // If a book was found, update the bookId for future messages
      if (formatted.bookId) {
        setBookId(formatted.bookId);
      }

      // Add bot response to chat
      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: formatted.reply,
        timestamp: new Date().toISOString(),
        bookFound: formatted.bookFound,
        bookTitle: formatted.bookTitle,
      };
      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      // Add error message
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I'm sorry, I encountered an error. Please try again later.",
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (messages.length > 1) {
      // Keep only the welcome message
      const welcomeMsg = messages.find(m => m.id === 'welcome');
      setMessages(welcomeMsg ? [welcomeMsg] : []);
    }
  };

  // If chat is closed, don't render anything
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.chatbotContainer} ref={chatContainerRef}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.botAvatar}>
            <span>🤖</span>
          </div>
          <div>
            <h3 className={styles.headerTitle}>BRbot</h3>
            <p className={styles.headerStatus}>
              {bookId ? '📚 Analyzing book' : '💡 Ready to help'}
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          {messages.length > 1 && (
            <button 
              onClick={handleClearChat} 
              className={styles.clearBtn}
              title="Clear chat"
            >
              🗑️
            </button>
          )}
          {onClose && (
            <button 
              onClick={onClose} 
              className={styles.closeBtn}
              title="Close chat"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className={styles.messagesContainer}>
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className={styles.typingIndicator}>
            <span>●</span>
            <span>●</span>
            <span>●</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={styles.inputContainer}>
        <ChatInput 
          onSend={handleSendMessage} 
          disabled={isLoading}
          placeholder="Ask about your book..."
        />
      </div>
    </div>
  );
};

export default Chatbot;
