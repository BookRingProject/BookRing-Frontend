'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { uploadProfilePicture } from '../../services/uploadService';
import Button from '../../components/ui/Button';
import styles from './page.module.css';

const ProfileSetupPage = () => {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file);
      setProfilePictureFile(file);
      setProfilePicturePreview(previewUrl);
    }
  };

  const handleUpload = async () => {
    if (!profilePictureFile) {
      // No picture selected, just go to dashboard
      redirectToDashboard();
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', profilePictureFile);
      const response = await uploadProfilePicture(formData);
      
      if (response.data?.url) {
        updateUser({ profilePicture: response.data.url });
      }
      redirectToDashboard();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload profile picture. You can add one later from your profile page.');
      redirectToDashboard();
    } finally {
      setUploading(false);
    }
  };

  const handleSkip = () => {
    setSkipped(true);
    redirectToDashboard();
  };

  const redirectToDashboard = () => {
    if (user?.role === 'lecturer') {
      router.push('/dashboard');
    } else {
      router.push('/booksphere');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Set Up Your Profile</h1>
        <p className={styles.subtitle}>Add a profile picture (optional)</p>

        <div className={styles.avatarSection}>
          <div className={styles.avatarPreview}>
            {profilePicturePreview ? (
              <img src={profilePicturePreview} alt="Preview" className={styles.avatar} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {user?.name?.charAt(0) || '?'}
              </div>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className={styles.fileInput}
            id="avatar-upload"
          />
          <label htmlFor="avatar-upload" className={styles.uploadLabel}>
            Choose Image
          </label>
          {profilePicturePreview && (
            <button
              onClick={() => {
                setProfilePictureFile(null);
                setProfilePicturePreview('');
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className={styles.removeBtn}
            >
              Remove
            </button>
          )}
        </div>

        <div className={styles.actions}>
          <Button onClick={handleSkip} variant="outline">
            Skip for Now
          </Button>
          <Button onClick={handleUpload} variant="primary" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Continue'}
          </Button>
        </div>

        <p className={styles.note}>
          You can always change your profile picture later from your profile page.
        </p>
      </div>
    </div>
  );
};

export default ProfileSetupPage;