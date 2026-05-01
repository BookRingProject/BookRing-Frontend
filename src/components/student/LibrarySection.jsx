'use client';

import React from 'react';
import Tabs from '../../components/ui/Tabs';
import DownloadButton from './DownloadButton';
import styles from './LibrarySection.module.css';

const LibrarySection = ({ originalPdfUrl, summaryText, summaryPdfUrl, audioUrl, title }) => {
  const tabs = [
    {
      label: 'Original Document',
      content: (
        <div className={styles.tabContent}>
          <p className={styles.description}>Original PDF document from lecturer</p>
          <DownloadButton url={originalPdfUrl} filename={`${title}.pdf`} type="pdf" />
        </div>
      )
    },
    {
      label: 'Summary Notes',
      content: (
        <div className={styles.tabContent}>
          <div className={styles.summaryPreview}>
            <h4>Preview:</h4>
            <p>{summaryText || 'No summary available'}</p>
          </div>
          {summaryPdfUrl && (
            <DownloadButton url={summaryPdfUrl} filename={`${title}_summary.pdf`} type="summary" />
          )}
        </div>
      )
    },
    {
      label: 'Audio',
      content: (
        <div className={styles.tabContent}>
          {audioUrl ? (
            <>
              <p className={styles.description}>Listen to the audio summary</p>
              <audio controls className={styles.audioPlayer}>
                <source src={audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <DownloadButton url={audioUrl} filename={`${title}_audio.mp3`} type="audio" />
            </>
          ) : (
            <p className={styles.noAudio}>Audio not available</p>
          )}
        </div>
      )
    }
  ];

  return (
    <div className={styles.container}>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default LibrarySection;