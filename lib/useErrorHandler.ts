'use client';

import { useEffect, useState } from 'react';

interface ErrorInfo {
  error: Error;
  errorInfo: string;
}

export function useErrorHandler() {
  const [error, setError] = useState<ErrorInfo | null>(null);

  const handleError = (error: Error, errorInfo?: string) => {
    console.error('Error caught by useErrorHandler:', error);
    setError({ error, errorInfo: errorInfo || error.stack || '' });
  };

  const clearError = () => {
    setError(null);
  };

  // Set up global error handlers
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      handleError(new Error(`Unhandled promise rejection: ${event.reason}`));
    };

    const handleGlobalError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      handleError(event.error || new Error(event.message));
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleGlobalError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleGlobalError);
    };
  }, []);

  return {
    error,
    handleError,
    clearError,
    hasError: !!error,
  };
}

export function useErrorBoundary() {
  const [error, setError] = useState<Error | null>(null);

  const captureError = (error: Error) => {
    setError(error);
  };

  const resetError = () => {
    setError(null);
  };

  if (error) {
    throw error;
  }

  return { captureError, resetError };
}
