"use client";
import { MessageSquare, Github, Heart, ExternalLink, Zap, Globe, Sparkles, Star, Code2, Users2, Rocket, ChevronRight, Mail, Twitter, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";

type FooterProps = {
  className?: string;
  authorName?: string;
  authorImageSrc?: string;
  authorLink?: string;
  githubOwner?: string;
  githubRepo?: string;
  appName?: string;
};

export default function Footer({
  className,
  authorName = "Xenonesis",
  authorImageSrc = "https://github.com/Xenonesis.png",
  authorLink = "https://github.com/Xenonesis",
  githubOwner = "Xenonesis",
  githubRepo = "ModelArena",
  appName = "ModelArena",
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={[
        "relative max-w-6xl mx-auto",
        "border-t border-white/[0.1]",
        "bg-gray-950/10 backdrop-blur-sm",
        "pt-16 pb-8",
        "transition-all duration-300 ease-out",
        className || ""
      ].join(" ")}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/[0.03] via-purple-600/[0.03] to-transparent pointer-events-none" />
      
      {/* Subtle floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-4 left-1/4 w-2 h-2 rounded-full bg-blue-400/20 animate-pulse" />
        <div className="absolute bottom-6 right-1/3 w-1.5 h-1.5 rounded-full bg-purple-400/20 animate-pulse delay-1000" />
        <div className="absolute top-8 right-1/4 w-1 h-1 rounded-full bg-indigo-400/20 animate-pulse delay-500" />
      </div>

      <div className="relative">
        {/* Main Content - Compact Layout */}
        <motion.div 
          className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Brand Section */}
          <div className="flex items-center gap-4 group">
            <Logo size="md" showText={true} animated={true} />
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-4">
            <motion.a
              href="/chat"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Rocket className="w-4 h-4" />
              <span>Start Chat</span>
            </motion.a>
            
            <motion.a
              href={`https://github.com/${githubOwner}/${githubRepo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-950/30 border border-white/20 hover:bg-gray-950/50 hover:border-white/40 text-white font-medium transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </motion.a>
          </div>
        </motion.div>

        {/* Features Badges - Compact Row */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {[
            { icon: Code2, text: "Open Source", color: "from-green-400 to-emerald-500" },
            { icon: Zap, text: "Real-time", color: "from-yellow-400 to-orange-500" },
            { icon: Users2, text: "Multi-Model", color: "from-blue-400 to-indigo-500" },
            { icon: Globe, text: "Global", color: "from-purple-400 to-pink-500" }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-950/20 border border-white/10 hover:border-white/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * idx }}
              viewport={{ once: true }}
            >
              <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                <feature.icon className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="text-xs text-gray-300 group-hover:text-white transition-colors font-medium">
                {feature.text}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Links Row */}
        <motion.div 
          className="flex flex-wrap justify-center gap-6 mb-6 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {[
            { href: `https://github.com/${githubOwner}/${githubRepo}/issues`, label: "Issues" },
            { href: `https://github.com/${githubOwner}/${githubRepo}/discussions`, label: "Discussions" },
            { href: `https://github.com/${githubOwner}/${githubRepo}#features`, label: "Features" },
            { href: `https://github.com/${githubOwner}/${githubRepo}#getting-started`, label: "Docs" }
          ].map((link, idx) => (
            <motion.a
              key={idx}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-1"
              whileHover={{ y: -1 }}
            >
              <span>{link.label}</span>
              <ArrowUpRight className="w-3 h-3" />
            </motion.a>
          ))}
        </motion.div>

        {/* Attribution Section - Clean & Compact */}
        <motion.div 
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.05]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Creator Attribution */}
          <div className="flex items-center gap-3">
            <a
              href={authorLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 hover:scale-105 transition-transform duration-200"
            >
              <Image
                src={authorImageSrc}
                alt={`${authorName} avatar`}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20 group-hover:ring-white/40 transition-all"
              />
              <div className="text-sm">
                <div className="flex items-center gap-1 text-gray-300">
                  <span>Made with</span>
                  <Heart className="w-3 h-3 text-red-400 animate-pulse" />
                  <span>by</span>
                  <span className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                    {authorName}
                  </span>
                </div>
              </div>
            </a>
          </div>
          
          {/* Copyright & Tech */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>© {currentYear} {appName}</span>
            <span className="hidden md:block">•</span>
            <span className="flex items-center gap-1">
              <Code2 className="w-3 h-3" />
              Next.js & Tailwind
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}