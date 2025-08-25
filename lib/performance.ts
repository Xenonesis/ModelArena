// Performance utilities for production optimization
import React, { memo, useMemo, useCallback } from 'react';

// Component memoization wrapper
export function withMemo<T extends Record<string, unknown>>(
  Component: React.ComponentType<T>,
  propsAreEqual?: (prevProps: T, nextProps: T) => boolean
) {
  return memo(Component, propsAreEqual);
}

// Debounced hook for expensive operations (simple implementation)
export function useDebounced<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T {
  return useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    const debouncedFn = ((...args: unknown[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => callback(...args), delay);
    }) as T;
    return debouncedFn;
  }, [callback, delay]);
}

// Memoized callback hook
export function useStableCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  deps: React.DependencyList
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(callback, deps);
}

// Image optimization helper
export function getOptimizedImageProps(src: string, alt: string) {
  return {
    src,
    alt,
    loading: 'lazy' as const,
    decoding: 'async' as const,
    style: { 
      maxWidth: '100%',
      height: 'auto'
    }
  };
}

// Preload critical resources
export function preloadResource(href: string, as: string, type?: string) {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  document.head.appendChild(link);
}

// Bundle size analyzer (development only)
export function analyzeBundleSize() {
  if (process.env.NODE_ENV !== 'development') return;
  
  console.log('Bundle Analysis:');
  console.log('- React bundle size:', (window as unknown as Record<string, unknown>).__REACT_BUNDLE_SIZE__ || 'Unknown');
  console.log('- App bundle size:', (window as unknown as Record<string, unknown>).__APP_BUNDLE_SIZE__ || 'Unknown');
  
  // Log largest components
  const webpackSizes = (window as unknown as Record<string, unknown>).__WEBPACK_CHUNK_SIZES__;
  if (webpackSizes) {
    console.log('Chunk sizes:', webpackSizes);
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static measurements: Map<string, number> = new Map();
  
  static start(name: string) {
    if (typeof window === 'undefined') return;
    performance.mark(`${name}-start`);
  }
  
  static end(name: string) {
    if (typeof window === 'undefined') return;
    
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name, 'measure')[0];
    if (measure) {
      this.measurements.set(name, measure.duration);
      
      // Log slow operations in development
      if (process.env.NODE_ENV === 'development' && measure.duration > 100) {
        console.warn(`Slow operation detected: ${name} took ${measure.duration.toFixed(2)}ms`);
      }
    }
  }
  
  static getMetrics() {
    return Object.fromEntries(this.measurements);
  }
  
  static clear() {
    this.measurements.clear();
    if (typeof window !== 'undefined') {
      performance.clearMarks();
      performance.clearMeasures();
    }
  }
}