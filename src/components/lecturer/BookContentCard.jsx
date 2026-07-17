'use client';

import React, { useState, useRef, useEffect } from 'react';
import FileIcon from '../icons/FileIcon';
import SummaryIcon from '../icons/SummaryIcon';
import AudioIcon from '../icons/AudioIcon';
import DownloadIcon from '../icons/DownloadIcon';
import DeleteIcon from '../icons/DeleteIcon';
import { downloadFile, generatePdfFilename, generateAudioFilename, generateImageFilename } from '../../services/downloadService';
import { getPdfThumbnail } from '../../utils/cloudinary';
import styles from './BookContentCard.module.css';

const BookContentCard = ({ book, type, onDelete }) => {
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Audio player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || type !== 'audio') return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [type, book.audioUrl]);

  const getIcon = () => {
    switch (type) {
      case 'original':
        return <FileIcon />;
      case 'summary':
        return <SummaryIcon />;
      case 'audio':
        return <AudioIcon />;
      default:
        return <FileIcon />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'original':
        return book.title;
      case 'summary':
        return `${book.title} (Summary)`;
      case 'audio':
        return `${book.title} (Audio)`;
      default:
        return book.title;
    }
  };

  const getFileInfo = () => {
    switch (type) {
      case 'original':
        // ✅ FIX: Check if it's an image or PDF
        if (book.isImageBased) {
          return { 
            url: book.pdfUrl, 
            filename: generateImageFilename(book.title), 
            label: 'Download Image' 
          };
        } else {
          return { 
            url: book.pdfUrl, 
            filename: generatePdfFilename(book.title), 
            label: 'Download PDF' 
          };
        }
      case 'summary':
        return { 
          url: book.summaryPdfUrl || '#', 
          filename: generatePdfFilename(`${book.title}_summary`), 
          label: 'Download Summary' 
        };
      case 'audio':
        return { 
          url: book.audioUrl, 
          filename: generateAudioFilename(book.title), 
          label: 'Download Audio' 
        };
      default:
        return { url: '#', filename: '', label: 'Download' };
    }
  };

  const handleDownload = async () => {
    const fileInfo = getFileInfo();
    if (!fileInfo.url || fileInfo.url === '#') return;
    
    setIsDownloading(true);
    try {
      await downloadFile(fileInfo.url, fileInfo.filename);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download file. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.error("Playback interrupted:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e) => {
    if (!progressBarRef.current || !duration) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const fileInfo = getFileInfo();
  const isAvailable = fileInfo.url && fileInfo.url !== '#';

  return (
    <div className={styles.card}>
      <div className={styles.cover}>
        <img 
         src={getPdfThumbnail(book.pdfUrl)} 
         alt={book.title}
         onError={(e) => { e.target.src = '/images/default-cover.png' }}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{getTitle()}</h3>
        <p className={styles.meta}>
          Category: {book.category} | Saves: {book.saveCount}
        </p>
        <p className={styles.date}>
          Uploaded: {new Date(book.createdAt).toLocaleDateString()}
        </p>
        
        {/* Summary Preview Logic */}
        {type === 'summary' && (
          <div className={styles.summaryPreview}>
            {!book.summaryText ? (
              <p className={styles.noSummary}>No summary available</p>
            ) : (
              <>
                <p className={styles.summaryText}>
                  {showFullSummary ? book.summaryText : book.summaryText.substring(0, 150)}
                  {!showFullSummary && book.summaryText.length > 150 && '...'}
                </p>
                {book.summaryText.length > 150 && (
                  <button 
                    onClick={() => setShowFullSummary(!showFullSummary)} 
                    className={styles.seeMoreBtn}
                  >
                    {showFullSummary ? 'See less' : 'See more'}
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* Audio Player UI - Rendered Inline for Component Stability */}
        {type === 'audio' && (
          <div className={styles.audioPlayerContainer}>
            {!book.audioUrl ? (
              <p className={styles.noAudio}>Audio not available</p>
            ) : (
              <>
                <audio ref={audioRef} src={book.audioUrl} preload="metadata" />
                <div className={styles.audioControls}>
                  <button onClick={togglePlay} className={styles.playPauseBtn}>
                    {isPlaying ? '⏸' : '▶'}
                  </button>
                  <div className={styles.progressContainer}>
                    <span className={styles.currentTime}>{formatTime(currentTime)}</span>
                    <div 
                      ref={progressBarRef}
                      className={styles.progressBarWrapper}
                      onClick={handleProgressClick}
                    >
                      <div 
                        className={styles.progressFilled}
                        style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                      />
                    </div>
                    <span className={styles.duration}>{formatTime(duration)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        {isAvailable ? (
          <button 
            onClick={handleDownload} 
            className={styles.downloadBtn}
            disabled={isDownloading}
          >
            <DownloadIcon />
            {isDownloading ? 'Downloading...' : fileInfo.label}
          </button>
        ) : (
          <button className={styles.disabledBtn} disabled>
            <DownloadIcon />
            Not Available
          </button>
        )}
        <button 
          onClick={() => onDelete(book._id)} 
          className={styles.deleteBtn}
        >
          <DeleteIcon />
          Delete
        </button>
      </div>
    </div>
  );
};

export default BookContentCard;
