'use client';

import React from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import ErrorBoundary from '../components/common/ErrorBoundary';
import '../styles/globals.css';
import '../styles/themes.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Bookring - Smart Learning Platform</title>
        <meta name="description" content="Where lecturers upload books and AI generates summaries and audio for students" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <ErrorBoundary>
          <ThemeProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}