'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { uploadBook } from '../../../services/uploadService';
import { UPLOAD_STATUS } from '../../../utils/constants';
import UploadProgress from '../../../components/lecturer/UploadProgress';
import UploadStatus from '../../../components/lecturer/UploadStatus';
import Button from '../../../components/ui/Button';
import styles from './page.module.css';

export default function UploadPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState(UPLOAD_STATUS.IDLE);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (file) => {
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace('.pdf', ''));
      }
    } else if (file) {
      alert('Please select a valid PDF file');
    }
  };

  const onFileSelect = (e) => {
    handleFileChange(e.target.files[0]);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  const simulateProgress = () => {
    const steps = [
      { status: UPLOAD_STATUS.UPLOADING, progress: 25 },
      { status: UPLOAD_STATUS.SUMMARIZING, progress: 50 },
      { status: UPLOAD_STATUS.GENERATING_AUDIO, progress: 75 },
      { status: UPLOAD_STATUS.COMPLETED, progress: 100 }
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setStatus(steps[stepIndex].status);
        setProgress(steps[stepIndex].progress);
        stepIndex++;
      } else {
        clearInterval(interval);
      }
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Please select a PDF file');
      return;
    }

    setStatus(UPLOAD_STATUS.UPLOADING);
    setProgress(10);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append('pdf', selectedFile);
    formData.append('title', title);

    try {
      simulateProgress();
      
      const response = await uploadBook(formData, (percent) => {
        setProgress(percent);
      });

      setUploadStatus({
        status: 'success',
        message: 'Book uploaded successfully! Redirecting...'
      });

      setTimeout(() => {
        router.push('/my-books');
      }, 2000);
      
    } catch (error) {
      setStatus(UPLOAD_STATUS.ERROR);
      setUploadStatus({
        status: 'error',
        message: error.response?.data?.message || 'Upload failed. Please try again.'
      });
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setTitle('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isProcessing = status !== UPLOAD_STATUS.IDLE && status !== UPLOAD_STATUS.ERROR;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Upload New Book</h1>
        <p className={styles.subtitle}>Upload a PDF and let AI do the rest</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Book Title Input */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Book Title</label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter book title"
              className={styles.input}
              required
              disabled={isProcessing}
            />
          </div>
        </div>

        {/* Modern File Upload Area */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>PDF File</label>
          <div
            className={`${styles.dropZone} ${isDragging ? styles.dragging : ''} ${selectedFile ? styles.hasFile : ''}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={openFileDialog}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={onFileSelect}
              className={styles.fileInput}
              disabled={isProcessing}
            />
            
            {!selectedFile ? (
              <div className={styles.uploadPrompt}>
                <div className={styles.uploadIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 16V4M12 4L8 8M12 4L16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 16V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <p className={styles.uploadText}>Drag & drop your PDF here</p>
                <p className={styles.uploadSubtext}>or click to browse</p>
                <p className={styles.fileHint}>Supported format: PDF (Max 50MB)</p>
              </div>
            ) : (
              <div className={styles.filePreview}>
                <div className={styles.fileIcon}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13 2V9H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className={styles.fileInfo}>
                  <p className={styles.fileName}>{selectedFile.name}</p>
                  <p className={styles.fileSize}>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button 
                  type="button" 
                  onClick={removeFile} 
                  className={styles.removeFileBtn}
                  disabled={isProcessing}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {!isProcessing && (
          <Button type="submit" variant="primary" fullWidth className={styles.submitBtn}>
            Upload & Process
          </Button>
        )}

        {(status !== UPLOAD_STATUS.IDLE || progress > 0) && (
          <div className={styles.progressSection}>
            <UploadProgress status={status} progress={progress} />
          </div>
        )}

        {uploadStatus && (
          <UploadStatus status={uploadStatus.status} message={uploadStatus.message} />
        )}
      </form>
    </div>
  );
}