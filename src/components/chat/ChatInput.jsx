'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatInput.module.css';

const ChatInput = ({ 
  onSend, 
  disabled = false, 
  placeholder = "Type your message..." 
}) => {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputValue]);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || disabled) return;
    
    onSend(trimmed);
    setInputValue('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div className={`${styles.inputContainer} ${disabled ? styles.disabled : ''}`}>
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        aria-label="Chat input"
      />
      <button
        className={`${styles.sendButton} ${!inputValue.trim() || disabled ? styles.sendDisabled : ''}`}
        onClick={handleSend}
        disabled={!inputValue.trim() || disabled}
        aria-label="Send message"
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default ChatInput;
