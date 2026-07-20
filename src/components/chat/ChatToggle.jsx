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
          // Close icon (X) - using a div to ensure visibility
          <span className={styles.closeIcon}>✕</span>
        ) : (
          // Chat icon (bubble) - using a div for consistency
          <span className={styles.chatIcon}>💬</span>
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
