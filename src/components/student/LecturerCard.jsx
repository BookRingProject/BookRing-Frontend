'use client';

import React from 'react';
import Link from 'next/link';
import FollowButton from './FollowButton';
import UsersIcon from '../icons/UsersIcon';
import styles from './LecturerCard.module.css';

const LecturerCard = ({ lecturer, isFollowing, onFollowToggle }) => {
  return (
    <div className={styles.card}>
      <Link href={`/lecturer/${lecturer._id}`} className={styles.link}>
        <div className={styles.avatar}>
          <img 
            src={lecturer.profilePicture || '/images/default-avatar.png'} 
            alt={lecturer.name}
            className={styles.avatarImage}
          />
        </div>
        <div className={styles.info}>
          <h3 className={styles.name}>{lecturer.name}</h3>
          <p className={styles.specialty}>{lecturer.specialty}</p>
          <div className={styles.followerCount}>
            <UsersIcon />
            {lecturer.followerCount || 0} followers
          </div>
        </div>
      </Link>
      <div className={styles.followBtn}>
        <FollowButton isFollowing={isFollowing} onToggle={() => onFollowToggle(lecturer._id)} />
      </div>
    </div>
  );
};

export default LecturerCard;