'use client';

import React from 'react';
import PageErrorBoundary from './PageErrorBoundary';

interface ComponentErrorBoundaryProps {
  children: React.ReactNode;
  componentName: string;
  fallback?: React.ReactNode;
}


export default function ComponentErrorBoundary({ 
  children, 
  componentName,
  fallback 
}: ComponentErrorBoundaryProps) {
  const customFallback = fallback || (
    <div className="flex items-center justify-center p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
      <div className="text-center">
        <div className="text-2xl mb-2">⚠️</div>
        <h3 className="text-sm font-medium text-foreground mb-1">
          {componentName} Error
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          This component encountered an error and couldn&apos;t load properly.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-xs px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );

  return (
    <PageErrorBoundary 
      fallbackComponent={customFallback}
      onError={(error, errorInfo) => {
        console.error(`Error in ${componentName}:`, error, errorInfo);
      }}
    >
      {children}
    </PageErrorBoundary>
  );
}
