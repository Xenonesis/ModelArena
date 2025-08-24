import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";
import {
  useMotionTemplate,
  useMotionValue,
  motion,
  animate,
} from "framer-motion";
import { useRouter } from "next/navigation";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

export const AuroraHero = () => {
  const router = useRouter();
  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, [color]);

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  return (
    <motion.section
      style={{
        backgroundImage,
      }}
      className="relative grid min-h-screen place-content-center overflow-hidden bg-gray-950 px-4 py-24 text-gray-200"
    >
      <div className="relative z-10 flex flex-col items-center">
        <span className="mb-1.5 inline-block rounded-full bg-gray-600/50 px-3 py-1.5 text-sm">
          🚀 AI Model Comparison Platform
        </span>
        <h1 className="max-w-3xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-3xl font-medium leading-tight text-transparent sm:text-5xl sm:leading-tight md:text-7xl md:leading-tight">
          Compare AI Models Side by Side
        </h1>
        <p className="my-6 max-w-xl text-center text-base leading-relaxed md:text-lg md:leading-relaxed">
          The ultimate open-source playground to experiment with multiple AI models simultaneously.
          Compare outputs, find the best responses, and enhance your AI workflow.
        </p>
        <motion.button
          onClick={() => router.push('/chat')}
          style={{
            border,
            boxShadow,
          }}
          whileHover={{
            scale: 1.015,
          }}
          whileTap={{
            scale: 0.985,
          }}
          className="group relative flex w-fit items-center gap-1.5 rounded-full bg-gray-950/10 px-4 py-2 text-gray-50 transition-colors hover:bg-gray-950/50 cursor-pointer"
        >
          Start Comparing
          <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
        </motion.button>
        
        {/* Connected Features Section */}
        <div className="mt-16 flex flex-col items-center">
          <motion.div
            style={{
              border,
              boxShadow,
            }}
            className="rounded-full bg-gray-950/20 px-6 py-3 backdrop-blur-sm"
          >
            <span className="text-lg font-medium text-gray-200">✨ Powerful Features</span>
          </motion.div>
          
          {/* Connection Line */}
          <motion.div 
            className="w-px h-8 my-4"
            style={{
              background: `linear-gradient(to bottom, ${color}, transparent)`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Connected Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <motion.div
              style={{
                border,
                background: `linear-gradient(135deg, ${color}10, transparent)`,
              }}
              className="p-4 rounded-lg backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-lg font-semibold text-gray-200 mb-2">Multi-Model Chat</h3>
              <p className="text-gray-400 text-sm">Compare responses from multiple AI models simultaneously</p>
            </motion.div>
            
            <motion.div
              style={{
                border,
                background: `linear-gradient(135deg, ${color}10, transparent)`,
              }}
              className="p-4 rounded-lg backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-lg font-semibold text-gray-200 mb-2">Real-time Analysis</h3>
              <p className="text-gray-400 text-sm">Get instant insights and performance comparisons</p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={50} count={2500} factor={4} fade speed={2} />
        </Canvas>
      </div>
    </motion.section>
  );
};
