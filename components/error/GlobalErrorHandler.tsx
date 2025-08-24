'use client';

import { useEffect } from 'react';
import { toast } from 'react-toastify';

interface GlobalErrorHandlerProps {
  children: React.ReactNode;
}

export default function GlobalErrorHandler({ children }: GlobalErrorHandlerProps) {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      if (process.env.NODE_ENV === 'production') {
        toast.error('Something went wrong. Please try again.');
      }
      
      event.preventDefault();
    };

    const handleGlobalError = (event: ErrorEvent) => {
      console.error('Global JavaScript error:', event.error || event.message);
      
      if (process.env.NODE_ENV === 'production') {
        toast.error('An unexpected error occurred.');
      }
    };

    const handleResourceError = (event: Event) => {
      const target = event.target as EventTarget | null;

      // Ignore errors that bubble from window without a concrete target
      if (!target || target === window) {
        console.error('Resource loading error (no target):', event);
        return;
      }

      try {
        if (target instanceof HTMLImageElement) {
          console.error('Resource loading error: IMG', {
            src: target.currentSrc || target.src,
            alt: target.alt,
          });
          return;
        }
        if (target instanceof HTMLScriptElement) {
          console.error('Resource loading error: SCRIPT', {
            src: target.src,
            noModule: target.noModule,
            async: target.async,
            defer: target.defer,
          });
          return;
        }
        if (target instanceof HTMLLinkElement) {
          console.error('Resource loading error: LINK', {
            href: target.href,
            rel: target.rel,
            as: (target as HTMLLinkElement).as,
          });
          return;
        }
        if (target instanceof Element) {
          console.error('Resource loading error:', target.tagName);
          return;
        }

        // Fallback: unknown target type
        console.error('Resource loading error (unknown target):', event);
      } catch (e) {
        // Ensure error handler never throws
        console.error('Resource loading error (handler exception):', e);
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('error', handleResourceError, true); // Use capture phase for resource errors

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('error', handleResourceError, true);
    };
  }, []);

  return <>{children}</>;
}
