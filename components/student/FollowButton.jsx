'use client';

import React from 'react';
import Button from '../../components/ui/Button';
import styles from './FollowButton.module.css';

const FollowButton = ({ isFollowing, onToggle, size = 'small' }) => {
  return (
    <Button
      variant={isFollowing ? 'outline' : 'primary'}
      size={size}
      onClick={onToggle}
      className={styles.button}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </Button>
  );
};

export default FollowButton;