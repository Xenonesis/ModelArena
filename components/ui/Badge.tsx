"use client";

import React from "react";
import { Star } from "lucide-react";
import { BadgeType } from "@/lib/themes";

interface BadgeProps {
  type: BadgeType;
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  type,
  size = "md",
  className = "",
  children,
}) => {
  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-[10px]",
    md: "px-2 py-0.5 text-[11px]",
    lg: "px-2.5 py-0.5 text-xs",
  };

  const baseClasses = `inline-flex items-center rounded-full font-medium border transition-all duration-200 ${sizeClasses[size]}`;

  const typeClasses = {
    pro: "bg-[var(--badge-pro-background)] text-[var(--badge-pro-text)] border-[var(--badge-pro-border)] hover:shadow-[0_0_0_1px_var(--badge-pro-glow)]",
    free: "bg-[var(--badge-free-background)] text-[var(--badge-free-text)] border-[var(--badge-free-border)] hover:shadow-[0_0_0_1px_var(--badge-free-glow)]",
  };

  return (
    <span className={`${baseClasses} ${typeClasses[type]} ${className}`}>
      {children}
    </span>
  );
};

// Specialized Pro Badge Component
export const ProBadge: React.FC<{
  size?: "sm" | "md" | "lg";
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
}> = ({ size = "md", className = "", showIcon = true, showText = true }) => {
  return (
    <Badge type="pro" size={size} className={`gap-1 ${className}`}>
      {showIcon && (
        <Star
          size={size === "sm" ? 9 : size === "lg" ? 13 : 11}
          className="shrink-0"
        />
      )}
      {showText && <span className="hidden sm:inline">Pro</span>}
    </Badge>
  );
};

// Specialized Free Badge Component
export const FreeBadge: React.FC<{
  size?: "sm" | "md" | "lg";
  className?: string;
  showDot?: boolean;
  showText?: boolean;
}> = ({ size = "md", className = "", showDot = true, showText = true }) => {
  const dotSize =
    size === "sm" ? "h-1.5 w-1.5" : size === "lg" ? "h-2 w-2" : "h-1.5 w-1.5";

  return (
    <Badge type="free" size={size} className={`gap-1 ${className}`}>
      {showDot && (
        <span className={`rounded-full bg-current opacity-80 ${dotSize}`} />
      )}
      {showText && <span className="hidden sm:inline">Free</span>}
    </Badge>
  );
};

export default Badge;
