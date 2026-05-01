'use client';

import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import { downloadFromCloudinary } from '../../services/downloadService';
import styles from './DownloadButton.module.css';

const DownloadButton = ({ url, filename, type }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!url) return;
    
    setIsDownloading(true);
    try {
      await downloadFromCloudinary(url, filename);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download file. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="small"
      onClick={handleDownload}
      disabled={isDownloading || !url}
      className={styles.button}
    >
      {isDownloading ? 'Downloading...' : `Download ${type.toUpperCase()}`}
    </Button>
  );
};

export default DownloadButton;