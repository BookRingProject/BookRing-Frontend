'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Chatbot from '../../../components/chat/Chatbot';
import styles from './page.module.css';

export default function ChatPage() {
  const router = useRouter();
  const [isChatOpen, setIsChatOpen] = useState(true);

  const handleBack = () => {
    router.back();
  };

  return (
    <div className={styles.pageContainer}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <button onClick={handleBack} className={styles.backButton}>
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M15 18L9 12L15 6" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          Back
        </button>
        <h1 className={styles.pageTitle}>BRbot Assistant</h1>
        <div className={styles.headerPlaceholder} />
      </div>

      {/* Chat Container */}
      <div className={styles.chatWrapper}>
        <Chatbot 
          isOpen={isChatOpen}
          onClose={() => router.push('/dashboard')}
        />
      </div>

      {/* Footer Info */}
      <div className={styles.footer}>
        <p className={styles.footerText}>
          💡 BRbot can analyze your uploaded books and answer questions about them.
          Just mention the book title in your message.
        </p>
      </div>
    </div>
  );
}
