'use client';

import React from 'react';
import styles from './DashboardStats.module.css';

const DashboardStats = ({ publications, followers, totalSaves, followerChange, saveChange }) => {
  return (
    <div className={styles.statsGrid}>
      <div className={styles.statCard}>
        <div className={styles.statValue}>{publications}</div>
        <div className={styles.statLabel}>Publications</div>
      </div>
      
      <div className={styles.statCard}>
        <div className={styles.statValue}>
          {followers}
          {followerChange !== undefined && (
            <span className={`${styles.changeBadge} ${followerChange >= 0 ? styles.positive : styles.negative}`}>
              {followerChange >= 0 ? `+${followerChange}` : `${followerChange}`}
            </span>
          )}
        </div>
        <div className={styles.statLabel}>Followers</div>
      </div>
      
      <div className={styles.statCard}>
        <div className={styles.statValue}>
          {totalSaves}
          {saveChange !== undefined && saveChange > 0 && (
            <span className={`${styles.changeBadge} ${styles.positive}`}>
              +{saveChange}
            </span>
          )}
        </div>
        <div className={styles.statLabel}>Total Saves</div>
      </div>
    </div>
  );
};

export default DashboardStats;