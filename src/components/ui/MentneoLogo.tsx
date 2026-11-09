"use client";

import React from "react";
import { motion } from "framer-motion";

interface LogoProps {
  variant?: "dark" | "light" | "auto";
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  showTagline?: boolean;
  animated?: boolean;
  className?: string;
}

export default function MentneoLogo({
  variant = "auto",
  size = "md",
  showWordmark = true,
  showTagline = true,
  animated = false,
  className = "",
}: LogoProps) {
  // Dimensions for the geometric Monogram
  const dimensions = {
    sm: { box: 24, font: "text-sm", mark: 22 },
    md: { box: 32, font: "text-base", mark: 30 },
    lg: { box: 44, font: "text-xl", mark: 40 },
  }[size];

  const colorClass =
    variant === "light"
      ? "text-ink"
      : variant === "dark"
      ? "text-white"
      : "text-white group-hover:text-white";

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Bespoke Geometric Monogram 'M' (Neural Path / Chip Die) */}
      <div
        className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
        style={{ width: dimensions.box, height: dimensions.box }}
      >
        <svg
          viewBox="0 0 32 32"
          width={dimensions.mark}
          height={dimensions.mark}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={colorClass}
        >
          {/* Monogram Pillar Left */}
          <motion.rect
            initial={animated ? { scaleY: 0 } : false}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "bottom" }}
            x="4"
            y="6"
            width="4.5"
            height="20"
            rx="1.2"
            fill="currentColor"
          />

          {/* Central Neural Tensor Route / Chevron Apex */}
          <motion.path
            initial={animated ? { pathLength: 0 } : false}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            d="M8.5 8L16 17.5L23.5 8"
            stroke="currentColor"
            strokeWidth="4.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Monogram Pillar Right */}
          <motion.rect
            initial={animated ? { scaleY: 0 } : false}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "bottom" }}
            x="23.5"
            y="6"
            width="4.5"
            height="20"
            rx="1.2"
            fill="currentColor"
          />

          {/* Precision Micro-Die Core Accent Dot (Blue signature or mono) */}
          <circle
            cx="16"
            cy="24"
            r="1.8"
            fill="#2F5BFF"
            className="transition-colors group-hover:fill-white"
          />
        </svg>

        {/* Soft specular glow on hover */}
        <div className="absolute inset-0 rounded-lg bg-[#2F5BFF]/15 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />
      </div>

      {/* Wordmark & Micro-label */}
      {showWordmark && (
        <div className="flex flex-col">
          <span
            className={`font-sans font-semibold tracking-wideBranded leading-none ${dimensions.font} ${
              variant === "light" ? "text-ink" : "text-white"
            }`}
          >
            MENTNEO
          </span>
          {showTagline && (
            <span
              className={`font-mono text-[9px] uppercase tracking-wideMono mt-1 ${
                variant === "light" ? "text-ink-secondary" : "text-white/40"
              }`}
            >
              RESEARCH & DEV · EST. 2025
            </span>
          )}
        </div>
      )}
    </div>
  );
}
