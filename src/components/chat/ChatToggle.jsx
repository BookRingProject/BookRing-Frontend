'use client';

import React, { useState, useEffect } from 'react';
import styles from './ChatToggle.module.css';

const ChatToggle = ({ 
  isOpen = false, 
  onToggle, 
  unreadCount = 0,
  label = "Chat with BRbot"
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Show tooltip briefly on mount
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 3000);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    }
    // Hide tooltip when toggled
    setShowTooltip(false);
  };

  return (
    <div className={styles.toggleWrapper}>
      {/* Tooltip */}
      {!isOpen && showTooltip && (
        <div className={styles.tooltip}>
          {label}
          <span className={styles.tooltipArrow} />
        </div>
      )}

      {/* Toggle Button */}
      <button
        className={`${styles.toggleButton} ${isOpen ? styles.active : ''}`}
        onClick={handleToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          // Close icon (X)
          <svg 
            width="28" 
            height="28" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M18 6L6 18M6 6L18 18" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
        ) : (
          // Chat icon (bubble)
          <svg 
            width="28" 
            height="28" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        )}

        {/* Notification Badge */}
        {!isOpen && unreadCount > 0 && (
          <span className={styles.badge}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default ChatToggle;
