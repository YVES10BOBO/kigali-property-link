import toast from 'react-hot-toast';

// Success toast
export const showSuccess = (message: string) => {
  toast.success(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#10b981',
      color: '#fff',
      borderRadius: '8px',
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10b981',
    },
  });
};

// Error toast
export const showError = (message: string) => {
  toast.error(message, {
    duration: 5000,
    position: 'top-right',
    style: {
      background: '#ef4444',
      color: '#fff',
      borderRadius: '8px',
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#ef4444',
    },
  });
};

// Info toast
export const showInfo = (message: string) => {
  toast(message, {
    duration: 4000,
    position: 'top-right',
    icon: 'ℹ️',
    style: {
      background: '#3b82f6',
      color: '#fff',
      borderRadius: '8px',
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: '500',
    },
  });
};

// Loading toast (returns a function to update/close)
export const showLoading = (message: string = 'Loading...') => {
  return toast.loading(message, {
    position: 'top-right',
    style: {
      background: '#6366f1',
      color: '#fff',
      borderRadius: '8px',
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: '500',
    },
  });
};

// Update loading toast to success/error
export const updateToast = (toastId: string, type: 'success' | 'error', message: string) => {
  if (type === 'success') {
    toast.success(message, {
      id: toastId,
      duration: 4000,
    });
  } else {
    toast.error(message, {
      id: toastId,
      duration: 5000,
    });
  }
};

// Dismiss toast
export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};
