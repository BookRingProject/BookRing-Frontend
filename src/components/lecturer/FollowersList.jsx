'use client';

import React from 'react';
import styles from './FollowersList.module.css';

const FollowersList = ({ followers }) => {
  if (!followers || followers.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No followers yet</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {followers.map((follower) => (
        <div key={follower._id} className={styles.followerItem}>
          <img 
            src={follower.profilePicture || '/images/default-avatar.png'} 
            alt={follower.name}
            className={styles.avatar}
          />
          <div className={styles.info}>
            <div className={styles.name}>{follower.name}</div>
            <div className={styles.email}>{follower.email}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FollowersList;