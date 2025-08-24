"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  gradient 
}: { 
  icon: LucideIcon, 
  title: string, 
  description: string,
  gradient: string 
}) => (
  <div className="group relative overflow-hidden rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 p-6 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105">
    <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
    <div className="relative z-10">
      <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors duration-300">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  </div>
);

const ModelBadge = ({ name, color }: { name: string, color: string }) => (
  <div className={`inline-flex items-center px-3 py-1 rounded-full bg-${color}-500/20 border border-${color}-500/30 text-${color}-300 text-sm font-medium`}>
    <Bot className="w-3 h-3 mr-1" />
    {name}
  </div>
);

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
    <div className={`min-h-screen w-full ${backgroundClass} relative text-white`}>
      {/* Background overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-95" />
      
      {/* Navigation */}
      <nav className="relative z-20 flex justify-between items-center px-6 py-4">
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">ModelArena</span>
        </Link>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <a 
            href="https://github.com/Xenonesis/Open-Fiesta-Clone" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
          >
            <Star className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        </div>
      </nav>

      <div className="relative z-10 px-6">
        {/* Hero Section */}
        <div className={`max-w-6xl mx-auto pt-12 pb-20 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
          <div className="mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-medium">
              <Zap className="w-3 h-3 mr-1" />
              Multi-Model AI Playground
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
            Compare AI Models
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Side by Side
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            The ultimate open-source playground to experiment with multiple AI models simultaneously. 
            Compare outputs, find the best responses, and enhance your AI workflow.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link 
              href="/chat"
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Start Chatting
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            
            <a 
              href="https://github.com/Xenonesis/Open-Fiesta-Clone" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl transition-all duration-300"
            >
              <Star className="mr-2 w-5 h-5" />
              View on GitHub
            </a>
          </div>

          {/* Supported Models */}
          <div className="mb-20">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">Supported AI Models</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {supportedModels.map((model, index) => (
                <ModelBadge key={index} name={model.name} color={model.color} />
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto pb-20">
          <div className={`text-center mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> ModelArena</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover the features that make ModelArena the perfect playground for AI experimentation and comparison.
            </p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className={`max-w-4xl mx-auto text-center pb-20 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-white/10 rounded-2xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Exploring?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of developers, researchers, and AI enthusiasts who are already using ModelArena
              to compare and experiment with cutting-edge AI models.
            </p>
            <Link 
              href="/chat"
              className="group inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
            >
              Get Started Now
              <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>

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
              <a href="https://github.com/Xenonesis/Open-Fiesta-Clone" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                GitHub
              </a>
              <span className="text-sm">
                Made with ❤️ by{" "}
                <a href="https://github.com/Xenonesis" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Xenonesis
                </a>
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
