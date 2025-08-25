"use client";

import { useState, useEffect } from 'react';
import { AlertTriangle, ExternalLink, Key, Copy, Check } from 'lucide-react';

interface ApiKeySetupProps {
  onDismiss?: () => void;
}

export default function ApiKeySetup({ onDismiss }: ApiKeySetupProps) {
  const [showSetup, setShowSetup] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    // Check if in development and if API keys are missing
    if (process.env.NODE_ENV === 'development') {
      // Show setup after a brief delay
      const timer = setTimeout(() => setShowSetup(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const copyToClipboard = async (text: string, keyType: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(keyType);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleDismiss = () => {
    setShowSetup(false);
    onDismiss?.();
  };

  if (!showSetup || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-gray-900/95 backdrop-blur-sm border border-amber-500/30 rounded-xl p-6 shadow-2xl z-50">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-white font-semibold mb-2">
            API Keys Setup Required
          </h3>
          <p className="text-gray-300 text-sm mb-4">
            To test AI models, you&apos;ll need to add API keys to your <code className="bg-gray-800 px-1 rounded">.env.local</code> file.
          </p>
          
          <div className="space-y-3 mb-4">
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-400 font-medium text-sm">OpenRouter API Key</span>
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-gray-900 p-2 rounded text-gray-300">
                  OPENROUTER_API_KEY=sk-or-v1-...
                </code>
                <button
                  onClick={() => copyToClipboard('OPENROUTER_API_KEY=sk-or-v1-your_key_here', 'openrouter')}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                  title="Copy template"
                >
                  {copiedKey === 'openrouter' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-400 font-medium text-sm">Gemini API Key</span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-gray-900 p-2 rounded text-gray-300">
                  GEMINI_API_KEY=AIza...
                </code>
                <button
                  onClick={() => copyToClipboard('GEMINI_API_KEY=AIzaSyA-your_key_here', 'gemini')}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                  title="Copy template"
                >
                  {copiedKey === 'gemini' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={handleDismiss}
              className="px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Dismiss
            </button>
            <a
              href="https://docs.puter.com/getting-started/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors flex items-center gap-1"
            >
              <Key className="w-3 h-3" />
              Puter.js Setup
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}