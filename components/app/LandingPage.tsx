"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue, animate, MotionValue } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import {
  MessageSquare,
  Zap,
  Users,
  Globe,
  Star,
  GitCompare,
  Image as ImageIcon
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/app/Footer";
import { AuroraHero } from "@/components/ui/futurastic-hero-section";
import Logo from "@/components/ui/Logo";
import MultiOrbitSemiCircle from "@/components/ui/multi-orbit-semi-circle";

import { LucideIcon } from "lucide-react";

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  gradient,
  index,
  border
}: {
  icon: LucideIcon,
  title: string,
  description: string,
  gradient: string,
  index: number,
  border: MotionValue<string>
}) => (
  <motion.div
    className="group relative overflow-hidden rounded-2xl bg-gray-950/10 backdrop-blur-sm p-8 hover:bg-gray-950/20 transition-all duration-300"
    style={{
      border,
      transformStyle: "preserve-3d",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
    }}
    initial={{ opacity: 0, y: 50, rotateX: -15 }}
    animate={{ opacity: 1, y: 0, rotateX: 0 }}
    transition={{
      delay: 0.2 + index * 0.1,
      duration: 0.8,
      type: "spring",
      stiffness: 100
    }}
    whileHover={{
      scale: 1.015,
      y: -8,
      transition: { duration: 0.3 }
    }}
    whileTap={{ scale: 0.985 }}
  >
    <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
    <div className="relative z-10">
      <motion.div
        className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 group-hover:bg-white/20 transition-all duration-300 shadow-lg"
        whileHover={{
          rotate: 360,
          scale: 1.1,
          transition: { duration: 0.3 }
        }}
        style={{ boxShadow: "0 8px 24px rgba(255, 255, 255, 0.1)" }}
      >
        <Icon className="w-8 h-8 text-white" />
      </motion.div>
      <motion.h3
        className="text-2xl font-bold mb-4 bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 + index * 0.1 }}
      >
        {title}
      </motion.h3>
      <motion.p
        className="text-gray-300 leading-relaxed text-base"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 + index * 0.1 }}
      >
        {description}
      </motion.p>
    </div>

    {/* Animated border gradient */}
    <motion.div
      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{
        background: `linear-gradient(45deg, ${gradient.includes('blue') ? 'rgba(59, 130, 246, 0.1)' : gradient.includes('green') ? 'rgba(16, 185, 129, 0.1)' : gradient.includes('purple') ? 'rgba(147, 51, 234, 0.1)' : gradient.includes('orange') ? 'rgba(249, 115, 22, 0.1)' : gradient.includes('indigo') ? 'rgba(99, 102, 241, 0.1)' : 'rgba(234, 179, 8, 0.1)'}, transparent, transparent)`,
        boxShadow: `0 0 40px ${gradient.includes('blue') ? 'rgba(59, 130, 246, 0.2)' : gradient.includes('green') ? 'rgba(16, 185, 129, 0.2)' : gradient.includes('purple') ? 'rgba(147, 51, 234, 0.2)' : gradient.includes('orange') ? 'rgba(249, 115, 22, 0.2)' : gradient.includes('indigo') ? 'rgba(99, 102, 241, 0.2)' : 'rgba(234, 179, 8, 0.2)'}`
      }}
    />
  </motion.div>
);


const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

export default function LandingPage() {
  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, [color]);

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


  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
  const border = useMotionTemplate`1px solid ${color}`;

  return (
    <motion.div 
      style={{ backgroundImage }}
      className="min-h-screen w-full relative text-gray-200 overflow-hidden bg-gray-950"
    >
      {/* 3D Stars Background */}
      <div className="absolute inset-0 z-0">
        <Canvas
          onCreated={(state) => {
            // Handle context loss gracefully with improved error handling
            const gl = state.gl;
            const canvas = gl.domElement;
            
            const handleContextLoss = (event: Event) => {
              event.preventDefault();
              // Reduce console spam in development
              if (process.env.NODE_ENV === 'development') {
                console.info('[Three.js] WebGL context lost, restoring...');
              }
              // Prevent default to allow context restoration
            };
            
            const handleContextRestore = () => {
              if (process.env.NODE_ENV === 'development') {
                console.info('[Three.js] WebGL context restored successfully');
              }
              // Force a re-render after context restoration
              state.invalidate();
            };
            
            // Add event listeners for context management
            canvas.addEventListener('webglcontextlost', handleContextLoss, { passive: false });
            canvas.addEventListener('webglcontextrestored', handleContextRestore);
            
            // Cleanup function to remove listeners
            return () => {
              canvas.removeEventListener('webglcontextlost', handleContextLoss);
              canvas.removeEventListener('webglcontextrestored', handleContextRestore);
            };
          }}
          gl={{ 
            preserveDrawingBuffer: false, 
            antialias: false,
            powerPreference: "high-performance",
            failIfMajorPerformanceCaveat: false
          }}
          dpr={[1, 2]} // Limit device pixel ratio for better performance
          frameloop="demand" // Only render when needed
        >
          <Stars radius={50} count={2500} factor={4} fade speed={2} />
        </Canvas>
      </div>

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-6 bg-gray-950/20 backdrop-blur-sm border-b border-white/10"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Logo size="md" showText={true} animated={true} />
        </Link>
        <div className="flex items-center space-x-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ThemeToggle />
          </motion.div>
          <motion.a
            href="https://github.com/Xenonesis/ModelArena.git"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-950/10 border border-white/20 text-gray-200 hover:bg-gray-950/50 hover:text-white transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ 
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)"
            }}
          >
            <Star className="w-4 h-4 group-hover:text-yellow-300 transition-colors" />
            <span className="font-medium">GitHub</span>
          </motion.a>
        </div>
      </motion.nav>

      <div className="relative z-10 pt-20">
        {/* Aurora Hero Section */}
        <AuroraHero />

        {/* Features Grid */}
        <motion.section 
          className="max-w-6xl mx-auto pb-20 px-4"
          style={{ backgroundImage }}
        >
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.span
              className="mb-6 inline-block rounded-full bg-gray-950/20 px-4 py-2 text-sm font-medium backdrop-blur-sm"
              style={{
                border,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              ✨ Powerful Features
            </motion.span>
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Why Choose{" "}
              <motion.span
                className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
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
              className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
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
              <FeatureCard key={index} {...feature} index={index} border={border} />
            ))}
          </motion.div>
        </motion.section>

        {/* Integrations Section */}
        <MultiOrbitSemiCircle />

        {/* Footer */}
        <Footer 
          githubOwner="Xenonesis"
          githubRepo="ModelArena"
          className="mt-12 relative z-10"
        />
      </div>
    </motion.div>
  );
}
