'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, RefreshCw, Zap, Terminal, Info } from 'lucide-react';
import { getPuterStatus, callPuter } from '@/lib/client';

interface PuterStatus {
  available: boolean;
  version?: string;
  hasAI: boolean;
  error?: string;
  authenticated?: boolean;
}

export default function PuterDebug() {
  const [status, setStatus] = useState<PuterStatus>({ available: false, hasAI: false });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTestingAI, setIsTestingAI] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  const checkStatus = useCallback(() => {
    const puterStatus = getPuterStatus();
    
    setStatus(prevStatus => {
      // Only log significant status changes, not every check
      if (JSON.stringify(puterStatus) !== JSON.stringify(prevStatus)) {
        if (process.env.NODE_ENV === 'development') {
          console.debug('[Puter Debug] Status changed:', puterStatus);
        }
      }
      return puterStatus;
    });
  }, []);

  const refreshStatus = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    checkStatus();
    setIsRefreshing(false);
  };

  const testAIChat = async () => {
    setIsTestingAI(true);
    setTestResult(null);
    
    try {
      // Test a simple Puter.js call
      const testMessage = { role: 'user' as const, content: 'Hello! Please respond with a short greeting to test the connection.', ts: Date.now() };
      const result = await callPuter({ model: 'default', messages: [testMessage] });
      
      if (result.text) {
        setTestResult(`✅ AI Test Success: ${result.text.slice(0, 100)}...`);
      } else if (result.error) {
        if (result.error.includes('authentication required') || result.error.includes('401')) {
          setTestResult('ℹ️ Expected Auth Error: Anonymous mode (normal behavior)');
        } else {
          setTestResult(`❌ AI Test Error: ${result.error}`);
        }
      } else {
        setTestResult('❌ AI Test: Unknown response format');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      if (errorMsg.includes('401') || errorMsg.includes('Unauthorized') || errorMsg.includes('authentication required')) {
        setTestResult('ℹ️ Expected Auth Error: Anonymous mode (normal behavior)');
      } else {
        setTestResult(`❌ AI Test Error: ${errorMsg}`);
      }
    } finally {
      setIsTestingAI(false);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 10000); // Further reduced frequency to 10 seconds
    return () => clearInterval(interval);
  }, [checkStatus]);

  useEffect(() => {
    // Auto-show debug panel if there are issues (but not for 401 errors)
    if (status.error && !status.hasAI && !status.error.includes('401')) {
      setShowDebug(true);
    }
  }, [status]);

  const getStatusIcon = () => {
    if (status.available && status.hasAI) {
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    } else if (status.available) {
      return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    } else {
      return <AlertCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getStatusColor = () => {
    if (status.available && status.hasAI) return 'border-green-500/30 bg-green-950/90';
    if (status.available) return 'border-yellow-500/30 bg-yellow-950/90';
    return 'border-red-500/30 bg-red-950/90';
  };

  // Floating debug trigger button
  if (!showDebug) {
    return (
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 right-4 p-3 rounded-full bg-purple-600/90 backdrop-blur-sm text-white shadow-lg hover:bg-purple-700 transition-colors z-50"
        title="Open Puter.js Debug"
      >
        <Zap className="w-5 h-5" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed bottom-4 right-4 max-w-md z-50"
    >
      <div className={`rounded-xl border backdrop-blur-sm shadow-lg p-6 ${getStatusColor()}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            <h3 className="text-white font-semibold">Puter.js Debug</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshStatus}
              disabled={isRefreshing}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              title="Refresh Status"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowDebug(false)}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-white text-sm">
              {status.available ? 'Puter.js Loaded' : 'Puter.js Not Available'}
            </span>
          </div>

          {status.version && (
            <div className="text-xs text-gray-300">
              Version: {status.version}
            </div>
          )}

          <div className="flex items-center gap-2">
            {status.hasAI ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
            <span className="text-white text-sm">
              {status.hasAI ? 'AI Chat Available' : 'AI Chat Not Available'}
            </span>
          </div>

          {status.error && !status.error.includes('401') && (
            <div className="text-xs text-red-300 bg-red-900/20 p-2 rounded">
              Error: {status.error}
            </div>
          )}

          <div className="pt-2 border-t border-gray-600/30 space-y-2">
            <button
              onClick={testAIChat}
              disabled={!status.hasAI || isTestingAI}
              className="w-full px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors flex items-center justify-center gap-2"
            >
              <Terminal className="w-4 h-4" />
              {isTestingAI ? 'Testing...' : 'Test AI Chat (Official)'}
            </button>

            {testResult && (
              <div className="mt-2 text-xs p-2 rounded bg-gray-800/50 text-gray-200">
                {testResult}
              </div>
            )}
          </div>

          {/* Enhanced Setup Information */}
          <div className="flex items-start gap-2 text-xs text-blue-300 bg-blue-900/20 p-2 rounded">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium">Puter.js Setup Status:</div>
              <div className="mt-1 text-blue-200">
                ✅ Script loaded from <code className="bg-blue-800/30 px-1 rounded">https://js.puter.com/v2/</code><br/>
                {status.hasAI ? '✅' : '❌'} AI functionality available<br/>
                {status.error ? `⚠️ ${status.error}` : '✅ No errors detected'}
              </div>
              <div className="mt-2 text-blue-200">
                <strong>Note:</strong> 401 errors are expected in anonymous mode. 
                For full functionality, authentication may be required.
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-400 text-center">
            <a 
              href="https://docs.puter.com/getting-started/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              View Puter.js Setup Guide
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}