'use client';

import React from 'react';
import LecturerCard from './LecturerCard';
import styles from './LecturerList.module.css';

const LecturerList = ({ lecturers, following = [], onFollowToggle }) => {
  if (!lecturers || lecturers.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No lecturers found</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {lecturers.map((lecturer) => (
        <LecturerCard
          key={lecturer._id}
          lecturer={lecturer}
          isFollowing={following.includes(lecturer._id)}
          onFollowToggle={onFollowToggle}
        />
      ))}
    </div>
  );
};

export default LecturerList;