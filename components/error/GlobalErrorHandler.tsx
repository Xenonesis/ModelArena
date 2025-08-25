'use client';

import { useEffect } from 'react';
import { useToast, ToastContainer } from '@/components/ui/toast';

interface GlobalErrorHandlerProps {
  children: React.ReactNode;
}

export default function GlobalErrorHandler({ children }: GlobalErrorHandlerProps) {
  const { toasts, removeToast, error: showError } = useToast();

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      if (process.env.NODE_ENV === 'production') {
        showError('Application Error', 'Something went wrong. Please try again.');
      }
      
      event.preventDefault();
    };

    const handleGlobalError = (event: ErrorEvent) => {
      console.error('Global JavaScript error:', event.error || event.message);
      
      if (process.env.NODE_ENV === 'production') {
        showError('Application Error', 'An unexpected error occurred.');
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleGlobalError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleGlobalError);
    };
  }, [showError]);

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
