'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchAllLecturers,
  fetchLecturerById,
  followLecturer,
  unfollowLecturer,
  checkFollowStatus,
  fetchFollowingLecturers,
  fetchLecturerFollowers
} from '../services/lecturerService';

export const useLecturers = () => {
  const [lecturers, setLecturers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllLecturers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchAllLecturers();
      setLecturers(response.data.data || []);
      return response.data.data || [];
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch lecturers');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getLecturerById = useCallback(async (lecturerId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchLecturerById(lecturerId);
      // FIX: Access nested data
      return response.data.data || null;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch lecturer');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFollowingLecturers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchFollowingLecturers();
      // The API returns { success: true, data: [lecturer1, lecturer2, ...] }
      const followingData = response.data.data || [];
      
      // Extract just the IDs from the lecturer objects
      const followingIds = followingData.map(lecturer => lecturer._id);
      
      console.log('🔍 Following lecturers (objects):', followingData);
      console.log('🔍 Following IDs:', followingIds);
      
      setFollowing(followingIds);
      return followingIds;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch following lecturers');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const followLecturerHandler = useCallback(async (lecturerId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await followLecturer(lecturerId);
      await getFollowingLecturers(); // Refresh following list
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to follow lecturer');
      return null;
    } finally {
      setLoading(false);
    }
  }, [getFollowingLecturers]);

  const unfollowLecturerHandler = useCallback(async (lecturerId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await unfollowLecturer(lecturerId);
      await getFollowingLecturers(); // Refresh following list
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to unfollow lecturer');
      return null;
    } finally {
      setLoading(false);
    }
  }, [getFollowingLecturers]);

  const isFollowing = useCallback(async (lecturerId) => {
    try {
      const response = await checkFollowStatus(lecturerId);
      return response.data.isFollowing;
    } catch (err) {
      return false;
    }
  }, []);

  const getFollowers = useCallback(async (lecturerId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchLecturerFollowers(lecturerId);
      // FIX: Access nested data array
      return response.data.data || [];
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch followers');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    lecturers,
    following,
    loading,
    error,
    getAllLecturers,
    getLecturerById,
    getFollowingLecturers,
    followLecturer: followLecturerHandler,
    unfollowLecturer: unfollowLecturerHandler,
    isFollowing,
    getFollowers
  };
};