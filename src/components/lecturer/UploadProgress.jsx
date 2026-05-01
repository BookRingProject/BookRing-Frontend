'use client';

import React from 'react';
import styles from './UploadProgress.module.css';

const UploadProgress = ({ status, progress }) => {
  const steps = [
    { id: 'uploading', label: 'Uploading PDF' },
    { id: 'summarizing', label: 'AI Summarizing' },
    { id: 'generating_audio', label: 'Generating Audio' },
    { id: 'completed', label: 'Upload Complete' }
  ];

  const getCurrentStepIndex = () => {
    switch (status) {
      case 'uploading': return 0;
      case 'summarizing': return 1;
      case 'generating_audio': return 2;
      case 'completed': return 3;
      default: return -1;
    }
  };

  const currentStep = getCurrentStepIndex();

  return (
    <div className={styles.container}>
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className={styles.steps}>
        {steps.map((step, index) => (
          <div key={step.id} className={styles.step}>
            <div className={`${styles.stepCircle} ${index <= currentStep ? styles.active : ''}`}>
              {index < currentStep ? '✓' : index + 1}
            </div>
            <span className={`${styles.stepLabel} ${index <= currentStep ? styles.activeLabel : ''}`}>
              {step.label}
            </span>
            {index < steps.length - 1 && <div className={styles.stepLine}></div>}
          </div>
        ))}
      </div>
      
      {status === 'completed' && (
        <div className={styles.successMessage}>
          ✓ Upload completed successfully!
        </div>
      )}
      
      {status === 'error' && (
        <div className={styles.errorMessage}>
          ✗ Upload failed. Please try again.
        </div>
      )}
    </div>
  );
};

export default UploadProgress;