'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';

export interface ToastData {
  id: string;
  type: 'error' | 'success' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
  provider?: string;
  statusCode?: number;
}

interface ToastProps {
  toast: ToastData;
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : -50, 
        scale: isVisible ? 1 : 0.9 
      }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative max-w-sm w-full rounded-lg border backdrop-blur-sm shadow-lg bg-red-950/90 border-red-600/50 text-red-100"
      style={{ zIndex: 99999 }}
    >
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold truncate">
                {toast.title}
                {toast.provider && (
                  <span className="ml-2 text-xs opacity-75">
                    ({toast.provider})
                  </span>
                )}
              </p>
              <button
                onClick={() => onRemove(toast.id)}
                className="ml-2 inline-flex text-gray-400 hover:text-gray-200 focus:outline-none transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm opacity-90">{toast.message}</p>
            {toast.statusCode && (
              <p className="text-xs opacity-75 mt-1">
                Status Code: {toast.statusCode}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const ToastContainer: React.FC<{ toasts: ToastData[]; onRemove: (id: string) => void }> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 space-y-2 pointer-events-none" style={{ zIndex: 99999 }}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onRemove={onRemove} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastData = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const error = (title: string, message: string, options?: { provider?: string; statusCode?: number; duration?: number }) => {
    return addToast({
      type: 'error',
      title,
      message,
      provider: options?.provider,
      statusCode: options?.statusCode,
      duration: options?.duration,
    });
  };

  return {
    toasts,
    removeToast,
    error,
  };
}