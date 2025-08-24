"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/themeContext";
import { BACKGROUND_STYLES } from "@/lib/themes";
import {
  MessageSquare,
  Zap,
  Users,
  Globe,
  ArrowRight,
  Star,
  ChevronRight,
  Bot,
  GitCompare,
  Image as ImageIcon
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

import { LucideIcon } from "lucide-react";

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  gradient,
  index
}: {
  icon: LucideIcon,
  title: string,
  description: string,
  gradient: string,
  index: number
}) => (
  <motion.div
    className="group relative overflow-hidden rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 p-6 hover:border-white/20"
    initial={{ opacity: 0, y: 50, rotateX: -15 }}
    animate={{ opacity: 1, y: 0, rotateX: 0 }}
    transition={{
      delay: 0.2 + index * 0.1,
      duration: 0.8,
      type: "spring",
      stiffness: 100
    }}
    whileHover={{
      scale: 1.05,
      y: -8,
      rotateX: 5,
      transition: { duration: 0.3 }
    }}
    whileTap={{ scale: 0.98 }}
    style={{ transformStyle: "preserve-3d" }}
  >
    <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
    <div className="relative z-10">
      <motion.div
        className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors duration-300"
        whileHover={{
          rotate: 360,
          scale: 1.1,
          transition: { duration: 0.3 }
        }}
      >
        <Icon className="w-6 h-6 text-white" />
      </motion.div>
      <motion.h3
        className="text-xl font-semibold text-white mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 + index * 0.1 }}
      >
        {title}
      </motion.h3>
      <motion.p
        className="text-gray-300 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 + index * 0.1 }}
      >
        {description}
      </motion.p>
    </div>

    {/* Animated border gradient */}
    <motion.div
      className="absolute inset-0 rounded-xl"
      initial={{ background: "linear-gradient(45deg, transparent, transparent)" }}
      whileHover={{
        background: `linear-gradient(45deg, ${gradient.includes('blue') ? 'rgba(59, 130, 246, 0.2)' : gradient.includes('green') ? 'rgba(16, 185, 129, 0.2)' : gradient.includes('purple') ? 'rgba(147, 51, 234, 0.2)' : gradient.includes('orange') ? 'rgba(249, 115, 22, 0.2)' : gradient.includes('indigo') ? 'rgba(99, 102, 241, 0.2)' : 'rgba(234, 179, 8, 0.2)'}, transparent, transparent)`,
        transition: { duration: 0.3 }
      }}
    />
  </motion.div>
);

const ModelBadge = ({ name, color, index }: { name: string, color: string, index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.8 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{
      delay: 0.8 + index * 0.1,
      duration: 0.6,
      type: "spring",
      stiffness: 100
    }}
    whileHover={{
      scale: 1.05,
      y: -2,
      transition: { duration: 0.2 }
    }}
    className={`inline-flex items-center px-3 py-1 rounded-full bg-${color}-500/20 border border-${color}-500/30 text-${color}-300 text-sm font-medium cursor-pointer`}
  >
    <Bot className="w-3 h-3 mr-1" />
    {name}
  </motion.div>
);

// Animated particle component for background
const FloatingParticle = ({ delay = 0 }: { delay?: number }) => {
  // Use default dimensions for SSR, will be updated on client
  const defaultWidth = 1920;
  const defaultHeight = 1080;

  return (
    <motion.div
      className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
      initial={{
        x: Math.random() * defaultWidth,
        y: Math.random() * defaultHeight,
        opacity: 0
      }}
      animate={{
        x: [
          Math.random() * defaultWidth,
          Math.random() * defaultWidth,
          Math.random() * defaultWidth
        ],
        y: [
          Math.random() * defaultHeight,
          Math.random() * defaultHeight,
          Math.random() * defaultHeight
        ],
        opacity: [0, 0.6, 0]
      }}
      transition={{
        duration: 20 + Math.random() * 10,
        delay: delay,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
};

// Animated text component for word-by-word reveal
const AnimatedText = ({ text, className, delay = 0 }: { text: string, className?: string, delay?: number }) => {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: delay },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className={`inline-block ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-2"
          variants={child}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default function LandingPage() {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const backgroundClass = BACKGROUND_STYLES[theme.background].className;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: GitCompare,
      title: "Multi-Model Comparison",
      description: "Compare outputs from up to 5 different AI models side-by-side to find the best response for your needs.",
      gradient: "bg-gradient-to-br from-blue-500 to-purple-600"
    },
    {
      icon: MessageSquare,
      title: "Real-time Streaming",
      description: "Experience blazing-fast streaming responses with normalized APIs for a consistent chat experience.",
      gradient: "bg-gradient-to-br from-green-500 to-teal-600"
    },
    {
      icon: ImageIcon,
      title: "Image Support",
      description: "Upload and analyze images with compatible models like Gemini for multimodal AI interactions.",
      gradient: "bg-gradient-to-br from-purple-500 to-pink-600"
    },
    {
      icon: Globe,
      title: "Web Search Integration",
      description: "Toggle web search per message to get AI responses enriched with real-time internet information.",
      gradient: "bg-gradient-to-br from-orange-500 to-red-600"
    },
    {
      icon: Users,
      title: "Project Organization",
      description: "Organize your conversations into projects with custom system prompts and context management.",
      gradient: "bg-gradient-to-br from-indigo-500 to-blue-600"
    },
    {
      icon: Zap,
      title: "Open Source",
      description: "Fully open-source and self-hostable. Customize, extend, and deploy on your own infrastructure.",
      gradient: "bg-gradient-to-br from-yellow-500 to-amber-600"
    }
  ];

  const supportedModels = [
    { name: "Gemini 2.5 Flash", color: "blue" },
    { name: "Llama 3.3 70B", color: "green" },
    { name: "Qwen 2.5 72B", color: "purple" },
    { name: "DeepSeek R1", color: "orange" },
    { name: "Claude 3.5", color: "indigo" },
    { name: "GPT-4", color: "teal" }
  ];

  return (
    <div className={`min-h-screen w-full ${backgroundClass} relative text-white overflow-hidden`}>
      {/* Animated Background Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-95">
        {[...Array(15)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.5} />
        ))}
      </div>

      {/* Navigation */}
      <motion.nav
        className="relative z-20 flex justify-between items-center px-6 py-4"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <motion.div
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <MessageSquare className="w-5 h-5 text-white" />
          </motion.div>
          <span className="text-xl font-bold">ModelArena</span>
        </Link>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <motion.a
            href="https://github.com/Xenonesis/ModelArena.git"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Star className="w-4 h-4" />
            <span>GitHub</span>
          </motion.a>
        </div>
      </motion.nav>

      <div className="relative z-10 px-6">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto pt-12 pb-20 text-center">
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.span
              className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-medium"
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)" }}
              transition={{ duration: 0.2 }}
            >
              <Zap className="w-3 h-3 mr-1" />
              Multi-Model AI Playground
            </motion.span>
          </motion.div>

          <div className="mb-6">
            <AnimatedText
              text="Compare AI Models"
              className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent block"
              delay={0.4}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <span className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Side by Side
              </span>
            </motion.div>
          </div>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            The ultimate open-source playground to experiment with multiple AI models simultaneously.
            Compare outputs, find the best responses, and enhance your AI workflow.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/chat"
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  Start Chatting
                </motion.span>
                <motion.div
                  className="ml-2"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="https://github.com/Xenonesis/ModelArena.git"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl transition-all duration-300"
              >
                <Star className="mr-2 w-5 h-5" />
                View on GitHub
              </a>
            </motion.div>
          </motion.div>

          {/* Supported Models */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <motion.h3
              className="text-lg font-semibold text-gray-300 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              Supported AI Models
            </motion.h3>
            <div className="flex flex-wrap justify-center gap-3">
              {supportedModels.map((model, index) => (
                <ModelBadge key={index} name={model.name} color={model.color} index={index} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto pb-20">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Why Choose{" "}
              <motion.span
                className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                ModelArena
              </motion.span>
              ?
            </motion.h2>
            <motion.p
              className="text-xl text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              Discover the features that make ModelArena the perfect playground for AI experimentation and comparison.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} index={index} />
            ))}
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          className="max-w-4xl mx-auto text-center pb-20"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-white/10 rounded-2xl p-12 relative overflow-hidden"
            whileHover={{
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Animated background gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-600/5"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
              viewport={{ once: true }}
            />

            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4 relative z-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Ready to Start Exploring?
            </motion.h2>
            <motion.p
              className="text-xl text-gray-300 mb-8 relative z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Join thousands of developers, researchers, and AI enthusiasts who are already using ModelArena
              to compare and experiment with cutting-edge AI models.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/chat"
                  className="group inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-lg relative z-10"
                >
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    Get Started Now
                  </motion.span>
                  <motion.div
                    className="ml-2"
                    initial={{ x: 0 }}
                    whileHover={{ x: 8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <footer className="max-w-6xl mx-auto border-t border-white/10 pt-12 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">ModelArena</span>
            </div>
            <div className="flex items-center space-x-6 text-gray-400">
              <a href="https://github.com/Xenonesis/ModelArena.git" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                GitHub
              </a>
              <span className="text-sm flex items-center space-x-2">
                <img
                  src="https://avatars.githubusercontent.com/Xenonesis"
                  alt="Xenonesis GitHub Profile"
                  className="w-5 h-5 rounded-full"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span>Made with ❤️ by{" "}
                  <a href="https://github.com/Xenonesis" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                    Xenonesis
                  </a>
                </span>
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
