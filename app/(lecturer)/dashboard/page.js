'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import DashboardStats from '../../../components/lecturer/DashboardStats';
import TopBooksChart from '../../../components/lecturer/TopBooksChart';
import PerformanceLineChart from '../../../components/lecturer/PerformanceLineChart';
import Loader from '../../../components/common/Loader';
import {
  fetchDashboardStats,
  fetchTopBooks,
  fetchPerformanceData
} from '../../../services/lecturerService';
import styles from './page.module.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [topBooks, setTopBooks] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [performancePercentage, setPerformancePercentage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, topBooksRes, perfRes] = await Promise.all([
        fetchDashboardStats(),
        fetchTopBooks(),
        fetchPerformanceData()
      ]);
      
      setStats(statsRes.data.data);
      setTopBooks(topBooksRes.data.data || []);
      setPerformanceData(perfRes.data.data?.chartData || []);
      setPerformancePercentage(perfRes.data.data?.percentage || 0);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.welcome}>
        <h1>Welcome back, {user?.name?.split(' ')[0]}!</h1>
        <p>Here's your teaching performance overview</p>
      </div>

      <DashboardStats
        publications={stats?.publications || 0}
        followers={stats?.followers || 0}
        totalSaves={stats?.totalSaves || 0}
        followerChange={stats?.followerChange || 0}
        saveChange={stats?.saveChange || 0}
      />

      <div className={styles.chartsRow}>
        <div className={styles.performanceCard}>
          <PerformanceLineChart
            data={performanceData}
            percentage={performancePercentage}
          />
        </div>
      </div>

      <TopBooksChart books={topBooks} />
    </div>
  );
}