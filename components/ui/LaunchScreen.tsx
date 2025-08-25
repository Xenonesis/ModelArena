"use client";

import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/ui/Logo";

interface LaunchScreenProps {
  backgroundClass: string;
  title?: string;
  subtitle?: string;
  dismissed?: boolean;
}

export default function LaunchScreen({
  backgroundClass,
  title = "ModelArena",
  subtitle = "Warming things up…",
  dismissed = false,
}: LaunchScreenProps) {

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`min-h-screen w-full ${backgroundClass} relative text-white`}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.95 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-0 pointer-events-none"
          />
          <div className="relative z-10 px-3 lg:px-4 py-4 lg:py-6">
            <div className="flex gap-3 lg:gap-4">
              <div className="flex-1 min-w-0 flex flex-col h-[calc(100vh-2rem)] lg:h-[calc(100vh-3rem)] overflow-hidden">
                <div className="flex items-center justify-center h-full">
                  <motion.div
                    role="status"
                    aria-live="polite"
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      ease: "easeOut",
                      delay: 0.2
                    }}
                    className="w-full max-w-sm rounded-2xl border border-white/20 bg-gray-950/20 backdrop-blur-xl shadow-2xl p-7 sm:p-8 text-center relative overflow-hidden"
                    style={{
                      boxShadow: "0 0 40px rgba(19, 255, 170, 0.15), 0 0 80px rgba(30, 103, 198, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                    }}
                  >
                    {/* Enhanced Aurora ambient glow with animation */}
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="pointer-events-none absolute -inset-12 bg-gradient-radial from-[#13FFAA]/10 via-[#1E67C6]/5 to-transparent blur-3xl"
                    />

                    {/* Card content */}
                    <div className="relative">
                      {/* Logo with enhanced styling and animation */}
                      <motion.div
                        initial={{ scale: 0, rotate: -180, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{ 
                          duration: 0.8, 
                          delay: 0.5,
                          type: "spring",
                          stiffness: 150,
                          damping: 12
                        }}
                        className="mx-auto flex justify-center"
                      >
                        <Logo size="lg" showText={false} animated={true} />
                      </motion.div>

                      {/* Title & subtitle with staggered animation */}
                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="mt-3 text-base font-semibold tracking-wide bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                      >
                        {title}
                      </motion.h2>
                      
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0, duration: 0.5 }}
                        className="mt-1 text-sm text-white/70"
                      >
                        {subtitle}
                      </motion.p>

                      {/* Enhanced progress bar with aurora colors and animations */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                        className="mt-6 relative h-2 w-full overflow-hidden rounded-full bg-white/10"
                      >
                        {/* Aurora gradient progress with pulsing animation */}
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ 
                            duration: 2,
                            delay: 1.4,
                            ease: "easeInOut"
                          }}
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#13FFAA] via-[#1E67C6] to-[#CE84CF] opacity-60"
                          style={{
                            boxShadow: "0 0 20px rgba(19, 255, 170, 0.4), 0 0 40px rgba(30, 103, 198, 0.3), 0 0 60px rgba(206, 132, 207, 0.2)",
                          }}
                        />
                        
                        {/* Enhanced animated sheen effect */}
                        <motion.div
                          animate={{
                            x: ["-120%", "220%"]
                          }}
                          transition={{
                            duration: 1.4,
                            delay: 1.6,
                            repeat: Infinity,
                            repeatDelay: 2,
                            ease: "easeInOut"
                          }}
                          className="absolute top-0 left-0 h-full w-1/3"
                          style={{
                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
                            filter: "blur(1px)",
                          }}
                        />
                      </motion.div>

                      <span className="sr-only">Loading</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
