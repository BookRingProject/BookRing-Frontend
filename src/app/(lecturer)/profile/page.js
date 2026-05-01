'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { updateLecturerProfile, fetchLecturerFollowers } from '../../../services/lecturerService';
import EditProfileForm from '../../../components/lecturer/EditProfileForm';
import FollowersList from '../../../components/lecturer/FollowersList';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Loader from '../../../components/common/Loader';
import BookIcon from '../../../components/icons/BookIcon';
import UsersIcon from '../../../components/icons/UsersIcon';
import LogoutIcon from '../../../components/icons/LogoutIcon';
import EditIcon from '../../../components/icons/EditIcon';
import { uploadProfilePicture } from '../../../services/uploadService';
import styles from './page.module.css';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef(null);

  const handleEditSubmit = async (formData) => {
    setUpdating(true);
    try {
      const response = await updateLecturerProfile(formData);
      updateUser(response.data);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleViewFollowers = async () => {
    setShowFollowers(true);
    setLoadingFollowers(true);
    try {
      const response = await fetchLecturerFollowers(user._id);
      setFollowers(response.data.data || []);
    } catch (error) {
      console.error('Failed to load followers:', error);
    } finally {
      setLoadingFollowers(false);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }
    
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await uploadProfilePicture(formData);
  
      console.log('Full response:', response);
      console.log('response.data:', response.data);
      console.log('response.data.data:', response.data.data);
      
      const imageUrl = response.data.data?.url;
      console.log('Extracted imageUrl:', imageUrl);
      
      if (imageUrl) {
        updateUser({ profilePicture: imageUrl });
        console.log('Updated user with new profile picture');
        
        // Verify it was saved
        const updatedUser = JSON.parse(localStorage.getItem('bookring_user'));
        console.log('User in localStorage after update:', updatedUser);
        
        alert('Profile picture updated successfully!');
      } else {
        throw new Error('No URL returned from server');
      }
    } catch (error) {
      console.error('Avatar upload failed:', error);
      alert('Failed to upload profile picture. Please try again.');
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageError = (e) => {
    console.error('Image failed to load');
    console.log('URL that failed:', user?.profilePicture);
    setImgError(true);
    e.target.src = '/images/default-avatar.png';
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully!');
    console.log('URL that loaded:', user?.profilePicture);
    setImgError(false);
  };

  if (!user) {
    return <Loader />;
  }

  const imageSrc = imgError ? '/images/default-avatar.png' : (user.profilePicture || '/images/default-avatar.png');

  return (
    <div className={styles.container}>
      <div className={styles.profileHeader}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}>
            <img
              src={imageSrc}
              alt={user.name}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className={styles.editAvatarBtn}
            aria-label="Edit profile picture"
            disabled={uploadingAvatar}
          >
            <EditIcon />
          </button>
          <input
            ref={fileInputRef}
            id="avatarUpload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleAvatarChange}
          />
        </div>
        <div className={styles.headerInfo}>
          <h1 className={styles.name}>{user.name}</h1>
          <p className={styles.email}>{user.email}</p>
          {user.specialty && (
            <p className={styles.specialty}>{user.specialty}</p>
          )}
          {user.institution && (
            <p className={styles.institution}>{user.institution}</p>
          )}
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className={styles.editBtn}
        >
          Edit Profile
        </button>
      </div>

      {uploadingAvatar && (
        <div className={styles.uploadingOverlay}>
          <Loader />
        </div>
      )}

      <div className={styles.statsGrid}>
        <div className={styles.statCard} onClick={() => router.push('/my-books')}>
          <div className={styles.statIcon}>
            <BookIcon />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>Published Books</div>
            <div className={styles.statLabel}>View all →</div>
          </div>
        </div>

        <div className={styles.statCard} onClick={handleViewFollowers}>
          <div className={styles.statIcon}>
            <UsersIcon />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>Followers</div>
            <div className={styles.statLabel}>See who follows you →</div>
          </div>
        </div>

        <div className={styles.statCard} onClick={handleLogout}>
          <div className={styles.statIcon}>
            <LogoutIcon />
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>Logout</div>
            <div className={styles.statLabel}>Sign out →</div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Profile"
      >
        <EditProfileForm
          user={user}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditing(false)}
        />
        {updating && <Loader />}
      </Modal>

      <Modal
        isOpen={showFollowers}
        onClose={() => setShowFollowers(false)}
        title="Your Followers"
        size="medium"
      >
        {loadingFollowers ? (
          <Loader />
        ) : (
          <FollowersList followers={followers} />
        )}
      </Modal>
    </div>
  );
}