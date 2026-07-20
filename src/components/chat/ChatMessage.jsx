'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './ChatMessage.module.css';

const ChatMessage = ({ message }) => {
  const { type, content, timestamp, bookFound, bookTitle, isError } = message;

  const isUser = type === 'user';
  const isBot = type === 'bot';

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`${styles.messageWrapper} ${isUser ? styles.userWrapper : styles.botWrapper}`}>
      {isBot && (
        <div className={styles.avatar}>
          <span>🤖</span>
        </div>
      )}
      
      <div className={`${styles.messageBubble} ${isUser ? styles.userBubble : styles.botBubble}`}>
        {/* Show book context if available */}
        {isBot && bookFound && bookTitle && (
          <div className={styles.bookContext}>
            📚 <span>Analyzing: {bookTitle}</span>
          </div>
        )}
        
        {/* Error indicator */}
        {isError && (
          <div className={styles.errorIcon}>⚠️</div>
        )}
        
        {/* Message content */}
        <div className={styles.messageContent}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
        
        {/* Timestamp */}
        <div className={`${styles.timestamp} ${isUser ? styles.userTimestamp : styles.botTimestamp}`}>
          {formatTime(timestamp)}
        </div>
      </div>
      
      {isUser && (
        <div className={styles.avatar}>
          <span>👤</span>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
