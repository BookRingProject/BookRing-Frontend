'use client';

import React, { useEffect, useRef } from 'react';
import styles from './PerformanceLineChart.module.css';

const PerformanceLineChart = ({ data, percentage }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set dimensions
    canvas.width = width;
    canvas.height = height;

    // Find max value
    const maxValue = Math.max(...data.map(d => d.value), 10);
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = 'var(--border-color)';
    ctx.lineWidth = 1;
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw line
    if (data.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = 'var(--green-primary)';
      ctx.lineWidth = 2;
      
      data.forEach((point, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = height - padding - (point.value / maxValue) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      // Draw points
      data.forEach((point, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = height - padding - (point.value / maxValue) * chartHeight;
        
        ctx.beginPath();
        ctx.fillStyle = 'var(--green-primary)';
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = 'var(--text-primary)';
        ctx.font = '10px Arial';
        ctx.fillText(point.label, x - 10, y - 8);
      });
    }

    // Draw percentage label
    ctx.fillStyle = 'var(--green-primary)';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`${percentage}%`, padding, padding - 10);
    
    ctx.fillStyle = 'var(--text-muted)';
    ctx.font = '12px Arial';
    ctx.fillText('Performance', padding, padding - 25);
    
  }, [data, percentage]);

  return (
    <div className={styles.container}>
      <canvas 
        ref={canvasRef} 
        width={500} 
        height={300} 
        className={styles.canvas}
      ></canvas>
    </div>
  );
};

export default PerformanceLineChart;