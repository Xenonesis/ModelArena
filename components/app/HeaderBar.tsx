"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import GithubStar from "@/components/app/GithubStar";
import ThemeToggle from "@/components/ThemeToggle";
import CustomModels from "@/components/modals/CustomModels";
import FavoritesButton from "@/components/modals/FavoritesButton";
import Settings from "@/components/app/Settings";
import Logo from "@/components/ui/Logo";
import { Layers } from "lucide-react";
import { Menu as MenuIcon } from "lucide-react";

type Props = {
  onOpenMenu: () => void;
  authorName?: string;
  authorImageSrc?: string;
  authorLink?: string;
  githubOwner: string;
  githubRepo: string;
  className?: string;
  onOpenModelsModal?: () => void;
};

export default function HeaderBar({
  onOpenMenu,
  authorName = "Xenonesis",
  authorImageSrc = "https://github.com/Xenonesis.png",
  authorLink = "https://github.com/Xenonesis",
  githubOwner,
  githubRepo,
  className,
  onOpenModelsModal,
}: Props) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={[
        "fixed top-0 left-0 right-0 z-50",
        "flex items-center justify-between w-full px-1 py-2",
        "bg-gradient-to-r from-white/[0.02] via-white/[0.05] to-white/[0.02]",
        "border-b border-white/[0.08] backdrop-blur-sm",
        "transition-all duration-300 ease-out shadow-lg shadow-black/5",
        className || ""
      ].join(" ")}
    >
      {/* Left Section: Menu + Author */}
      <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
        <motion.button
          onClick={onOpenMenu}
          className="lg:hidden group inline-flex items-center justify-center h-8 w-8 rounded-lg bg-white/[0.08] border border-white/[0.12] text-white/80 hover:bg-white/[0.15] hover:text-white hover:border-white/[0.2] transition-all duration-200 ease-out"
          aria-label="Open menu"
          title="Menu"
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            transition={{ duration: 0.2 }}
            className="transition-transform duration-200 group-hover:scale-110"
          >
            <MenuIcon size={16} />
          </motion.div>
        </motion.button>
        
        <motion.a
          href={authorLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2.5 text-xs text-zinc-400 hover:text-white transition-all duration-200 ease-out"
          title={`Open ${authorName} on GitHub`}
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            className="relative"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src={authorImageSrc}
              alt={`${authorName} avatar`}
              width={22}
              height={22}
              className="h-5.5 w-5.5 rounded-full object-cover ring-1 ring-white/[0.15] group-hover:ring-white/[0.3] transition-all duration-200"
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-white/[0.1] to-transparent"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
          <span className="opacity-90 hidden sm:inline text-sm font-medium">
            Made with{" "}
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-red-400"
            >
              ❤️
            </motion.span>
            {" "}by{" "}
            <span className="font-semibold text-white/90 underline decoration-dotted decoration-white/[0.4] group-hover:decoration-white/[0.8] transition-all duration-200">
              {authorName}
            </span>
          </span>
        </motion.a>
      </div>

      {/* Center Section: Logo */}
      <motion.div
        className="flex-1 justify-center hidden sm:flex px-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <Logo size="sm" showText={true} animated={false} />
        </motion.div>
      </motion.div>

      {/* Right Section: Action Buttons */}
      <motion.div
        className="flex items-center gap-2 z-10 flex-shrink-0"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <div className="hidden md:flex items-center gap-2">
          <motion.button
            onClick={() => onOpenModelsModal && onOpenModelsModal()}
            className="group inline-flex items-center gap-2 text-xs h-9 px-3 rounded-lg border border-white/[0.15] bg-white/[0.05] hover:bg-white/[0.12] hover:border-white/[0.25] shadow-sm accent-focus transition-all duration-200 ease-out"
            title="Change models"
            aria-label="Change models"
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              transition={{ duration: 0.2 }}
              className="transition-transform duration-200 group-hover:scale-110"
            >
              <Layers size={14} />
            </motion.div>
            <span className="font-medium text-white/90">Models</span>
          </motion.button>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FavoritesButton />
          </motion.div>
        </div>
        
        <div className="md:hidden">
          <motion.button
            onClick={() => onOpenModelsModal && onOpenModelsModal()}
            className="group inline-flex items-center justify-center h-9 w-9 rounded-lg border border-white/[0.15] bg-white/[0.05] hover:bg-white/[0.12] hover:border-white/[0.25] shadow-sm accent-focus transition-all duration-200 ease-out"
            title="Change models"
            aria-label="Change models"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              transition={{ duration: 0.2 }}
              className="transition-transform duration-200 group-hover:scale-110"
            >
              <Layers size={14} />
            </motion.div>
          </motion.button>
        </div>

        <div className="flex items-center gap-1.5">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <FavoritesButton compact />
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <CustomModels compact />
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <ThemeToggle compact />
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Settings compact />
          </motion.div>
        </div>
        
        <motion.div
          className="ml-1"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <GithubStar owner={githubOwner} repo={githubRepo} />
        </motion.div>
      </motion.div>
    </motion.header>
  );
}
