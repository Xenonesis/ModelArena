"use client";
import Image from "next/image";
import GithubStar from "@/components/app/GithubStar";
import ThemeToggle from "@/components/ThemeToggle";
import CustomModels from "@/components/modals/CustomModels";
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
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50",
        "flex items-center justify-between w-full px-1 py-2",
        "bg-gradient-to-r from-white/[0.02] via-white/[0.05] to-white/[0.02]",
        "border-b border-white/[0.08] backdrop-blur-sm",
        "transition-all duration-300 ease-out",
        className || ""
      ].join(" ")}
    >
      {/* Left Section: Menu + Author */}
      <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
        <button
          onClick={onOpenMenu}
          className="lg:hidden group inline-flex items-center justify-center h-8 w-8 rounded-lg bg-white/[0.08] border border-white/[0.12] text-white/80 hover:bg-white/[0.15] hover:text-white hover:border-white/[0.2] transition-all duration-200 ease-out"
          aria-label="Open menu"
          title="Menu"
        >
          <MenuIcon size={16} className="transition-transform duration-200 group-hover:scale-110" />
        </button>
        
        <a
          href={authorLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2.5 text-xs text-zinc-400 hover:text-white transition-all duration-200 ease-out"
          title={`Open ${authorName} on GitHub`}
        >
          <div className="relative">
            <Image
              src={authorImageSrc}
              alt={`${authorName} avatar`}
              width={22}
              height={22}
              className="h-5.5 w-5.5 rounded-full object-cover ring-1 ring-white/[0.15] group-hover:ring-white/[0.3] transition-all duration-200"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/[0.1] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
          <span className="opacity-90 hidden sm:inline text-sm font-medium">
            Made with{" "}
            <span className="text-red-400 animate-pulse">❤️</span>
            {" "}by{" "}
            <span className="font-semibold text-white/90 underline decoration-dotted decoration-white/[0.4] group-hover:decoration-white/[0.8] transition-all duration-200">
              {authorName}
            </span>
          </span>
        </a>
      </div>

      {/* Center Section: Logo */}
      <div className="flex-1 flex justify-center hidden sm:block px-4">
        <Logo size="sm" showText={true} animated={false} />
      </div>

      {/* Right Section: Action Buttons */}
      <div className="flex items-center gap-2 z-10 flex-shrink-0">
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => onOpenModelsModal && onOpenModelsModal()}
            className="group inline-flex items-center gap-2 text-xs h-9 px-3 rounded-lg border border-white/[0.15] bg-white/[0.05] hover:bg-white/[0.12] hover:border-white/[0.25] shadow-sm accent-focus transition-all duration-200 ease-out"
            title="Change models"
            aria-label="Change models"
          >
            <Layers size={14} className="transition-transform duration-200 group-hover:scale-110" />
            <span className="font-medium text-white/90">Models</span>
          </button>
        </div>
        
        <div className="md:hidden">
          <button
            onClick={() => onOpenModelsModal && onOpenModelsModal()}
            className="group inline-flex items-center justify-center h-9 w-9 rounded-lg border border-white/[0.15] bg-white/[0.05] hover:bg-white/[0.12] hover:border-white/[0.25] shadow-sm accent-focus transition-all duration-200 ease-out"
            title="Change models"
            aria-label="Change models"
          >
            <Layers size={14} className="transition-transform duration-200 group-hover:scale-110" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <CustomModels compact />
          <ThemeToggle compact />
          <Settings compact />
        </div>
        
        <div className="ml-1">
          <GithubStar owner={githubOwner} repo={githubRepo} />
        </div>
      </div>
    </header>
  );
}
