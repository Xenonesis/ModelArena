"use client";

import React from "react";

interface AccentButtonProps {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  glow?: "none" | "soft" | "medium" | "strong";
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export default function AccentButton({
  variant = "primary",
  size = "md",
  glow = "none",
  children,
  className = "",
  onClick,
  disabled = false,
  type = "button",
}: AccentButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const sizeClasses = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-5 py-2.5 text-sm",
  };

  const variantClasses = {
    primary:
      "accent-button-primary focus:ring-[var(--accent-interactive-focus)]",
    secondary:
      "accent-button-secondary focus:ring-[var(--accent-interactive-focus)]",
    ghost:
      "text-[var(--accent-interactive-primary)] hover:bg-[var(--accent-highlight-subtle)] focus:ring-[var(--accent-interactive-focus)]",
  };

  const glowClasses = {
    none: "",
    soft: "accent-glow-soft",
    medium: "accent-glow-medium",
    strong: "accent-glow-strong",
  };

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed pointer-events-none"
    : "cursor-pointer";

  const combinedClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${glowClasses[glow]}
    ${disabledClasses}
    ${className}
  `.trim();

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
