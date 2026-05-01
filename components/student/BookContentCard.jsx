'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import FileIcon from '../icons/FileIcon';
import SummaryIcon from '../icons/SummaryIcon';
import AudioIcon from '../icons/AudioIcon';
import DownloadIcon from '../icons/DownloadIcon';
import DeleteIcon from '../icons/DeleteIcon';
import { downloadFile, generatePdfFilename, generateAudioFilename } from '../../services/downloadService';
import styles from './BookContentCard.module.css';
import { getPdfThumbnail, getPdfPreview } from '../../utils/cloudinary';

const BookContentCard = ({ book, type, onDelete, isLibrary = true }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);
  
  // Audio player states (only for audio type)
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
        return { 
          url: book.pdfUrl, 
          filename: generatePdfFilename(book.title), 
          label: 'Download PDF' 
        };
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

  // Get lecturer name - check both possible field names
  const lecturerName = book.lecturerId?.name || book.lecturer?.name || 'Unknown Lecturer';

  // Summary preview with See More/Less
  const renderSummary = () => {
    if (type !== 'summary' || !book.summaryText) return null;
    
    const text = book.summaryText;
    const previewLength = 200;
    const isLong = text.length > previewLength;
    const displayText = showFullSummary ? text : text.substring(0, previewLength);
    
    return (
      <div className={styles.summaryPreview}>
        <p className={styles.summaryText}>
          {displayText}
          {!showFullSummary && isLong && '...'}
        </p>
        {isLong && (
          <button 
            onClick={() => setShowFullSummary(!showFullSummary)} 
            className={styles.seeMoreBtn}
          >
            {showFullSummary ? 'See less' : 'See more'}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className={styles.card}>
      <Link href={`/booksphere/${book._id}`} className={styles.link}>
        <div className={styles.cover}>
        <img 
         src={getPdfThumbnail(book.pdfUrl)} 
         alt={book.title}
         onError={(e) => { e.target.src = '/images/default-cover.png' }}
        />
        </div>
      </Link>
      <div className={styles.content}>
        <Link href={`/booksphere/${book._id}`} className={styles.titleLink}>
          <h3 className={styles.title}>{getTitle()}</h3>
        </Link>
        <p className={styles.meta}>
          By: {lecturerName} | Category: {book.category}
        </p>
        
        {/* Audio Player for audio type */}
        {type === 'audio' && book.audioUrl && (
          <div className={styles.audioPlayerContainer}>
            <audio ref={audioRef} src={book.audioUrl} />
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
          </div>
        )}
        
        {/* Summary with See More/Less */}
        {renderSummary()}
      </div>
      <div className={styles.actions}>
        {isAvailable && (
          <button 
            onClick={handleDownload} 
            className={styles.downloadBtn}
            disabled={isDownloading}
          >
            <DownloadIcon />
            {isDownloading ? 'Downloading...' : fileInfo.label}
          </button>
        )}
        <button 
          onClick={() => onDelete(book._id)} 
          className={styles.deleteBtn}
        >
          <DeleteIcon />
          Remove
        </button>
      </div>
    </div>
  );
};

export default BookContentCard;