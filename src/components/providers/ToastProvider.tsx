"use client";

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options for all toasts
        className: '',
        duration: 4000,
        style: {
          background: '#fff',
          color: '#363636',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
        // Success toast
        success: {
          duration: 4000,
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
          style: {
            background: '#10b981',
            color: '#fff',
          },
        },
        // Error toast
        error: {
          duration: 5000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
          style: {
            background: '#ef4444',
            color: '#fff',
          },
        },
        // Loading toast
        loading: {
          iconTheme: {
            primary: '#6366f1',
            secondary: '#fff',
          },
          style: {
            background: '#6366f1',
            color: '#fff',
          },
        },
      }}
    />
  );
}
