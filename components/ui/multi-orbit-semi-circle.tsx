"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Brain, Cpu, Zap, Bot, Network, Globe, Sparkles, CircuitBoard, Atom, Binary, Code2, Rocket } from "lucide-react";

// Real AI model provider icons with reliable sources
const AI_MODEL_PROVIDERS = [
  {
    name: "Google Gemini",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjIiIGZpbGw9InVybCgjZ3JhZGllbnQwXzMwXzEpIi8+CjxwYXRoIGQ9Ik0xNiAxOEgyNFYzMEgxNlYxOFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNiAxOEgzNFYzMEgyNlYxOFoiIGZpbGw9IndoaXRlIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50MF8zMF8xIiB4MT0iMiIgeTE9IjIiIHgyPSI0NiIgeTI9IjQ2IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiM0Mjg1RjQiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkZCRjAwIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+",
    fallbackIcon: Brain,
    gradient: "from-blue-500 to-purple-600"
  },
  {
    name: "OpenAI GPT",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjIiIGZpbGw9IiMwMEE2N0UiLz4KPHBhdGggZD0iTTEyIDI0QzEyIDMwLjYyNzQgMTcuMzcyNiAzNiAyNCAzNkMzMC42Mjc0IDM2IDM2IDMwLjYyNzQgMzYgMjRDMzYgMTcuMzcyNiAzMC42Mjc0IDEyIDI0IDEyQzE3LjM3MjYgMTIgMTIgMTcuMzcyNiAxMiAyNFoiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPgo8cGF0aCBkPSJNMTggMjRIMzAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPgo8cGF0aCBkPSJNMjQgMThWMzAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4=",
    fallbackIcon: Cpu,
    gradient: "from-green-500 to-blue-500"
  },
  {
    name: "Meta Llama",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjIiIGZpbGw9IiMxODc3RjIiLz4KPHBhdGggZD0iTTE2IDE2SDMyVjMySDI0VjI0SDE2VjE2WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+",
    fallbackIcon: Zap,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    name: "Anthropic Claude",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjIiIGZpbGw9IiNGRjY2MDAiLz4KPHBhdGggZD0iTTI0IDEyQzI0IDEyIDMwIDI0IDI0IDM2QzE4IDI0IDI0IDEyIDI0IDEyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+",
    fallbackIcon: Bot,
    gradient: "from-orange-500 to-red-500"
  },
  {
    name: "Mistral AI",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjIiIGZpbGw9IiNFRjQ0NDQiLz4KPHBhdGggZD0iTTE4IDE4SDE4LjVWMzBIMjkuNVYxOEgzMFYxNS41SDE4VjE4WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+",
    fallbackIcon: Network,
    gradient: "from-cyan-500 to-blue-500"
  },
  {
    name: "DeepSeek AI",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjIiIGZpbGw9IiMxRTFFMUUiLz4KPHBhdGggZD0iTTEyIDI0TDI0IDEyTDM2IDI0TDI0IDM2TDEyIDI0WiIgZmlsbD0iIzAwNzNGRiIvPgo8L3N2Zz4=",
    fallbackIcon: Globe,
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    name: "Qwen (Alibaba)",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjIiIGZpbGw9IiNGRjY1MDAiLz4KPHBhdGggZD0iTTE2IDE2SDE2VjMySDMyVjE2SDE2WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+",
    fallbackIcon: Sparkles,
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    name: "Moonshot AI",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjIiIGZpbGw9IiMwMDAwMDAiLz4KPHBhdGggZD0iTTI0IDhMMzAgMjZIMThMMjQgOFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNCA0MEwxOCAyMkgzMEwyNCA0MFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg==",
    fallbackIcon: CircuitBoard,
    gradient: "from-teal-500 to-green-500"
  },
  {
    name: "Hugging Face",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjIiIGZpbGw9IiNGRkQ5MDAiLz4KPHBhdGggZD0iTTE2IDE4QzE2IDE4IDIwIDIyIDI0IDIyQzI4IDIyIDMyIDE4IDMyIDE4VjMwQzMyIDMwIDI4IDI2IDI0IDI2QzIwIDI2IDE2IDMwIDE2IDMwVjE4WiIgZmlsbD0iYmxhY2siLz4KPC9zdmc+",
    fallbackIcon: Atom,
    gradient: "from-pink-500 to-rose-500"
  },
  {
    name: "OpenRouter",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjIiIGZpbGw9IiM2MzY2RjEiLz4KPHBhdGggZD0iTTE2IDIwSDE2VjI4SDMyVjIwSDMyVjE2SDE2VjIwWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+",
    fallbackIcon: Binary,
    gradient: "from-slate-500 to-gray-600"
  },
  {
    name: "Cohere",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjIiIGZpbGw9IiMzOUQ5ODciLz4KPHBhdGggZD0iTTI0IDEyQzMwLjYyNzQgMTIgMzYgMTcuMzcyNiAzNiAyNEMzNiAzMC42Mjc0IDMwLjYyNzQgMzYgMjQgMzZDMTcuMzcyNiAzNiAxMiAzMC42Mjc0IDEyIDI0QzEyIDE3LjM3MjYgMTcuMzcyNiAxMiAyNCAxMloiIGZpbGw9IndoaXRlIi8+CjxjaXJjbGUgY3g9IjI0IiBjeT0iMjQiIHI9IjQiIGZpbGw9IiMzOUQ5ODciLz4KPC9zdmc+",
    fallbackIcon: Code2,
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    name: "NVIDIA AI",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjIiIGZpbGw9IiM3NkIxMDAiLz4KPHBhdGggZD0iTTI0IDEyQzE5IDEyIDEzIDE3IDEzIDI0QzEzIDMxIDMxIDM2IDM1IDI0QzM1IDE3IDI5IDEyIDI0IDEyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+",
    fallbackIcon: Rocket,
    gradient: "from-violet-500 to-purple-600"
  }
];

function SemiCircleOrbit({ radius, centerX, centerY, count, iconSize }: {
  radius: number;
  centerX: number;
  centerY: number;
  count: number;
  iconSize: number;
}) {
  const [imageErrors, setImageErrors] = useState<{[key: number]: boolean}>({});
  const [imageLoaded, setImageLoaded] = useState<{[key: number]: boolean}>({});

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const handleImageLoad = (index: number) => {
    setImageLoaded(prev => ({ ...prev, [index]: true }));
    // Reset error state if image loads successfully
    if (imageErrors[index]) {
      setImageErrors(prev => ({ ...prev, [index]: false }));
    }
  };

  // Add timeout for image loading
  useEffect(() => {
    const timer = setTimeout(() => {
      // Force fallback for any images that haven't loaded after 3 seconds
      setImageErrors(prev => {
        const newErrors = { ...prev };
        for (let i = 0; i < count; i++) {
          if (!imageLoaded[i] && !newErrors[i]) {
            newErrors[i] = true;
          }
        }
        return newErrors;
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [count, imageLoaded]);

  return (
    <>
      {/* Semi-circle glow background */}
      <div className="absolute inset-0 flex justify-center">
        <div
          className="
            w-[1000px] h-[1000px] rounded-full 
            bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.25),transparent_70%)]
            dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.25),transparent_70%)]
            blur-3xl 
            -mt-40 
            pointer-events-none
          "
          style={{ zIndex: 0 }}
        />
      </div>

      {/* Orbit icons */}
      {Array.from({ length: count }).map((_, index) => {
        const angle = (index / (count - 1)) * 180;
        const x = radius * Math.cos((angle * Math.PI) / 180);
        const y = radius * Math.sin((angle * Math.PI) / 180);
        const providerData = AI_MODEL_PROVIDERS[index % AI_MODEL_PROVIDERS.length];
        const hasImageError = imageErrors[index];
        const FallbackIcon = providerData.fallbackIcon;

        // Tooltip positioning — above or below based on angle
        const tooltipAbove = angle > 90;

        return (
          <div
            key={index}
            className="absolute flex flex-col items-center group"
            style={{
              left: `${centerX + x - iconSize / 2}px`,
              top: `${centerY - y - iconSize / 2}px`,
              zIndex: 5,
            }}
          >
            {hasImageError ? (
              <div 
                className={`flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300 hover:scale-110 shadow-lg border border-white/20 bg-gradient-to-br ${providerData.gradient} backdrop-blur-sm`}
                style={{ width: iconSize, height: iconSize, minWidth: iconSize, minHeight: iconSize }}
              >
                <FallbackIcon className="w-3/5 h-3/5 text-white drop-shadow-lg" />
              </div>
            ) : (
              <Image
                src={providerData.icon}
                alt={`${providerData.name} logo`}
                width={iconSize}
                height={iconSize}
                className="object-contain rounded-lg cursor-pointer transition-all duration-300 hover:scale-110 shadow-lg border border-white/20 bg-white/5 backdrop-blur-sm p-1"
                style={{ minWidth: iconSize, minHeight: iconSize }}
                onError={() => handleImageError(index)}
                onLoad={() => handleImageLoad(index)}
              />
            )}

            {/* Tooltip */}
            <div
              className={`absolute ${
                tooltipAbove ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]"
              } hidden group-hover:block w-32 rounded-lg bg-black px-2 py-1 text-xs text-white shadow-lg text-center z-50`}
            >
              {providerData.name}
              <div
                className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-black ${
                  tooltipAbove ? "top-full" : "bottom-full"
                }`}
              ></div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default function MultiOrbitSemiCircle() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const baseWidth = Math.min(size.width * 0.8, 700);
  const centerX = baseWidth / 2;
  const centerY = baseWidth * 0.5;

  const iconSize =
    size.width < 480
      ? Math.max(24, baseWidth * 0.05)
      : size.width < 768
      ? Math.max(28, baseWidth * 0.06)
      : Math.max(32, baseWidth * 0.07);

  return (
    <section className="py-12 relative min-h-screen w-full overflow-hidden">
      <div className="relative flex flex-col items-center text-center z-10">
        <h1 className="my-6 text-4xl font-bold lg:text-7xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
          AI Models
        </h1>
        <p className="mb-12 max-w-2xl text-gray-600 dark:text-gray-400 lg:text-xl">
          Connect with powerful AI models from leading providers.
        </p>

        <div
          className="relative"
          style={{ width: baseWidth, height: baseWidth * 0.6 }}
        >
          <SemiCircleOrbit radius={baseWidth * 0.22} centerX={centerX} centerY={centerY} count={6} iconSize={iconSize} />
          <SemiCircleOrbit radius={baseWidth * 0.36} centerX={centerX} centerY={centerY} count={8} iconSize={iconSize} />
          <SemiCircleOrbit radius={baseWidth * 0.5} centerX={centerX} centerY={centerY} count={10} iconSize={iconSize} />
        </div>
      </div>
    </section>
  );
}