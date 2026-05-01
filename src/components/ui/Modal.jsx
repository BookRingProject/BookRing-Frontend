'use client';

import React, { useEffect } from 'react';
import styles from './Modal.module.css';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'large':
        return styles.large;
      default:
        return styles.medium;
    }
  };

  return (
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={`${styles.modal} ${getSizeClass()}`}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          {showCloseButton && (
            <button className={styles.closeBtn} onClick={onClose}>
              ✕
            </button>
          )}
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;