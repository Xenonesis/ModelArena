"use client";
import { motion } from "framer-motion";
import { MessageSquare, Sparkles, Zap } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  animated?: boolean;
  className?: string;
}

export default function Logo({ 
  size = "md", 
  showText = true, 
  animated = true,
  className = "" 
}: LogoProps) {
  const sizeClasses = {
    sm: {
      container: "w-8 h-8",
      icon: "w-5 h-5",
      text: "text-lg",
      spacing: "gap-2"
    },
    md: {
      container: "w-12 h-12",
      icon: "w-7 h-7",
      text: "text-2xl",
      spacing: "gap-3"
    },
    lg: {
      container: "w-16 h-16",
      icon: "w-9 h-9",
      text: "text-3xl",
      spacing: "gap-4"
    },
    xl: {
      container: "w-20 h-20",
      icon: "w-12 h-12",
      text: "text-4xl",
      spacing: "gap-5"
    }
  };

  const { container, icon, text, spacing } = sizeClasses[size];

  const LogoIcon = () => (
    <div className="relative group">
      <motion.div
        className={`${container} rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 flex items-center justify-center shadow-xl relative overflow-hidden`}
        whileHover={animated ? { scale: 1.1 } : {}}
        transition={{ duration: 0.3 }}
        style={{ 
          boxShadow: "0 8px 32px rgba(59, 130, 246, 0.3)" 
        }}
      >
        {/* Background gradient animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 opacity-0 group-hover:opacity-30 blur-lg"
          initial={{ opacity: 0 }}
          whileHover={animated ? { opacity: 0.3 } : {}}
          transition={{ duration: 0.3 }}
        />
        
        {/* Sparkle effects */}
        {animated && (
          <>
            <motion.div
              className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full"
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.5,
              }}
            />
            <motion.div
              className="absolute bottom-2 left-2 w-0.5 h-0.5 bg-white rounded-full"
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 1.5,
              }}
            />
          </>
        )}
        
        {/* Main icon with subtle rotation */}
        <motion.div
          animate={animated ? { rotate: [0, 5, -5, 0] } : {}}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <MessageSquare className={`${icon} text-white relative z-10`} />
        </motion.div>
        
        {/* Inner glow */}
        <div className="absolute inset-0 bg-gradient-radial from-white/20 via-transparent to-transparent opacity-30" />
      </motion.div>
      
      {/* Floating elements around logo */}
      {animated && (
        <>
          <motion.div
            className="absolute -top-2 -right-2 text-yellow-400"
            animate={{
              y: [-2, 2, -2],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-3 h-3" />
          </motion.div>
          <motion.div
            className="absolute -bottom-1 -left-2 text-blue-300"
            animate={{
              x: [-1, 1, -1],
              scale: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <Zap className="w-2.5 h-2.5" />
          </motion.div>
        </>
      )}
    </div>
  );

  if (!showText) {
    return <LogoIcon />;
  }

  return (
    <motion.div 
      className={`flex items-center ${spacing} ${className}`}
      whileHover={animated ? { scale: 1.02 } : {}}
      transition={{ duration: 0.2 }}
    >
      <LogoIcon />
      <motion.div 
        className="flex flex-col"
        initial={animated ? { opacity: 0, x: -10 } : {}}
        animate={animated ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.span
          className={`font-bold ${text} bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent tracking-tight`}
          animate={animated ? {
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          } : {}}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundSize: "200% 200%",
          }}
        >
          ModelArena
        </motion.span>
        {size !== "sm" && (
          <motion.span
            className="text-xs text-gray-400 font-medium tracking-wide"
            initial={animated ? { opacity: 0 } : {}}
            animate={animated ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            AI Model Comparison
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
}