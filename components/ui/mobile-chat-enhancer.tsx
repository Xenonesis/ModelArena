"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronUp, Zap, Sparkles, MessageCircle, Users } from "lucide-react";

interface MobileChatEnhancerProps {
  isLoading?: boolean;
  messageCount?: number;
  onScrollToTop?: () => void;
}

export default function MobileChatEnhancer({ 
  isLoading = false, 
  messageCount = 0,
  onScrollToTop 
}: MobileChatEnhancerProps) {
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [showWelcomeHint, setShowWelcomeHint] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setShowTypingIndicator(isLoading);
  }, [isLoading]);

  useEffect(() => {
    // Hide welcome hint after 8 seconds
    const timer = setTimeout(() => setShowWelcomeHint(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Enhanced Mobile Floating Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        {/* Mobile Bottom Bar */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-gradient-to-t from-black/90 via-black/70 to-transparent backdrop-blur-xl border-t border-white/10 px-4 py-3"
        >
          <div className="flex items-center justify-between">
            {/* Message counter */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-2 px-3 py-2 bg-purple-600/20 rounded-full border border-purple-400/30"
            >
              <MessageCircle size={16} className="text-purple-400" />
              <span className="text-sm text-white font-medium">{messageCount} chats</span>
            </motion.div>

            {/* Scroll to top button */}
            <AnimatePresence>
              {showScrollToTop && (
                <motion.button
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  onClick={onScrollToTop}
                  className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg flex items-center justify-center touch-manipulation hover:shadow-xl"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronUp size={20} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Mobile status indicator */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center space-x-2 px-3 py-2 bg-green-600/20 rounded-full border border-green-400/30"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-green-400 rounded-full"
              />
              <span className="text-sm text-green-200 font-medium">Live</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Mobile typing indicator */}
      <AnimatePresence>
        {showTypingIndicator && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed bottom-20 left-4 right-4 z-40 md:hidden"
          >
            <div className="bg-gradient-to-r from-purple-600/90 to-blue-600/90 backdrop-blur-sm border border-purple-400/30 rounded-2xl px-4 py-4 shadow-2xl">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                />
                <div className="flex-1">
                  <p className="text-sm text-white font-semibold">AI models are thinking...</p>
                  <div className="flex space-x-1 mt-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                        className="w-2 h-2 bg-white/80 rounded-full"
                      />
                    ))}
                  </div>
                </div>
                <Users size={20} className="text-white/80" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Mobile welcome hint */}
      <AnimatePresence>
        {showWelcomeHint && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="fixed top-20 left-4 right-4 z-30 md:hidden pointer-events-none"
          >
            <div className="bg-gradient-to-r from-indigo-600/90 to-purple-600/90 backdrop-blur-sm border border-indigo-400/30 rounded-xl px-4 py-3 shadow-xl">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles size={20} className="text-yellow-300" />
                </motion.div>
                <div className="flex-1">
                  <p className="text-sm text-white font-semibold">Welcome to ModelArena!</p>
                  <p className="text-xs text-white/80 mt-1">Select models to compare AI responses</p>
                </div>
                <motion.div
                  animate={{ x: [0, 5, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Zap size={16} className="text-yellow-300" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Mobile performance indicator */}
      <div className="fixed top-4 left-4 z-20 md:hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="bg-black/70 backdrop-blur-sm rounded-full px-3 py-2 border border-white/10 shadow-lg"
        >
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ 
                boxShadow: [
                  "0 0 5px rgba(34, 197, 94, 0.5)",
                  "0 0 15px rgba(34, 197, 94, 0.8)",
                  "0 0 5px rgba(34, 197, 94, 0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-3 h-3 bg-green-500 rounded-full"
            />
            <span className="text-xs text-white font-medium">Mobile Mode</span>
          </div>
        </motion.div>
      </div>

      {/* Mobile swipe guidance (improved) */}
      <div className="fixed bottom-24 left-4 right-4 z-20 md:hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: [0, 0.8, 0],
            y: [20, 0, -10]
          }}
          transition={{ 
            duration: 4, 
            delay: 3, 
            repeat: 1,
            ease: "easeInOut"
          }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-cyan-600/80 to-teal-600/80 backdrop-blur-sm border border-cyan-400/30 rounded-xl px-4 py-3 inline-flex items-center space-x-3 shadow-lg">
            <motion.div
              animate={{ 
                x: [-5, 5, -5],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap size={18} className="text-cyan-200" />
            </motion.div>
            <div className="text-left">
              <p className="text-sm text-white font-semibold">Swipe & Tap to Explore</p>
              <p className="text-xs text-cyan-100">Touch-optimized for mobile</p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}