"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export interface LogoProps {
  variant?: "dark" | "light" | "auto";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showWordmark?: boolean;
  showTagline?: boolean;
  animated?: boolean;
  className?: string;
}

export default function Logo({
  variant = "dark",
  size = "md",
  showWordmark = true,
  showTagline = true,
  animated = true,
  className = "",
}: LogoProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isLight = variant === "light";

  // Scaled dimensions: significantly enlarged for high prominence and clarity
  // Emblem aspect ratio is ~169:206 (~1:1.22)
  const sizeMap = {
    xs: { w: 22, h: 27, text: "text-sm", sub: "text-[9px]", gap: "gap-2.5", flareH: "h-6" },
    sm: { w: 30, h: 37, text: "text-[17px]", sub: "text-[10px]", gap: "gap-3", flareH: "h-8" },
    // md: standard navbar size - enlarged to 42x51px emblem, 22px bold wordmark
    md: { w: 42, h: 51, text: "text-[21px]", sub: "text-[11px]", gap: "gap-3.5", flareH: "h-11" },
    // lg: preloader / hero size - 58x71px emblem, 28px wordmark
    lg: { w: 58, h: 71, text: "text-[28px]", sub: "text-[13px]", gap: "gap-4", flareH: "h-14" },
    // xl: monument size - 86x105px emblem, 40px wordmark
    xl: { w: 86, h: 105, text: "text-[40px]", sub: "text-sm", gap: "gap-5", flareH: "h-20" },
  }[size];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group inline-flex items-center ${sizeMap.gap} select-none cursor-pointer ${className}`}
    >
      {/* ─── 3D Crystal Prism Emblem Container ─── */}
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{ width: sizeMap.w, height: sizeMap.h }}
      >
        {/* Dual Chromatic Ambient Aura (Electric Cyan + Magenta Violet) */}
        <div
          className={`absolute -inset-2 rounded-full blur-lg pointer-events-none transition-all duration-500 ${
            isHovered ? "opacity-95 scale-135" : "opacity-45 scale-100"
          }`}
          style={{
            background: isLight
              ? "radial-gradient(circle at 40% 45%, rgba(37,99,235,0.35), rgba(147,51,234,0.25) 60%, transparent 75%)"
              : "radial-gradient(circle at 35% 45%, rgba(192, 132, 252, 0.65), rgba(56, 189, 248, 0.55) 65%, transparent 75%)",
          }}
        />

        {/* Floating 3D Emblem with Levitation & Hover Physics */}
        <motion.div
          animate={
            animated
              ? {
                  y: isHovered ? -4 : [0, -3, 0],
                  rotateZ: isHovered ? 4 : [0, 1.2, -1.2, 0],
                  scale: isHovered ? 1.09 : 1,
                }
              : {}
          }
          transition={{
            y: isHovered
              ? { duration: 0.25, ease: "easeOut" }
              : { duration: 4, repeat: Infinity, ease: "easeInOut" },
            rotateZ: isHovered
              ? { duration: 0.25, ease: "easeOut" }
              : { duration: 6, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 0.25, ease: "easeOut" },
          }}
          className="relative w-full h-full flex items-center justify-center"
          style={{
            filter: isLight
              ? isHovered
                ? "drop-shadow(0 6px 16px rgba(37, 99, 235, 0.45)) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15))"
                : "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.14))"
              : isHovered
              ? "drop-shadow(0 0 16px rgba(56, 189, 248, 0.7)) drop-shadow(0 0 24px rgba(192, 132, 252, 0.5))"
              : "drop-shadow(0 3px 10px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 12px rgba(56, 189, 248, 0.3))",
          }}
        >
          {/* High-Resolution Emblem Image */}
          <Image
            src="/mentneo-logo.png"
            alt="Mentneo Emblem"
            width={sizeMap.w * 2}
            height={sizeMap.h * 2}
            priority
            className="w-full h-full object-contain pointer-events-none select-none"
          />

          {/* Dynamic Diagonal Specular Flare (Traversing crystal facets on hover) */}
          <div
            className={`absolute inset-0 pointer-events-none overflow-hidden rounded-lg transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <motion.div
              initial={{ x: "-130%" }}
              animate={isHovered ? { x: "170%" } : { x: "-130%" }}
              transition={{ duration: 0.75, ease: "easeInOut" }}
              className="w-full h-full transform -skew-x-12"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.85) 50%, transparent 100%)",
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* ─── Typography: Wordmark & Tagline ─── */}
      {showWordmark && (
        <div className="flex flex-col justify-center leading-none">
          {/* MENTNEO Wordmark with Iridescent Shimmer */}
          <div className="flex items-center gap-2">
            <span
              className={`font-bold tracking-[0.16em] uppercase font-sans ${sizeMap.text} transition-all duration-300 ${
                isLight ? "text-[#0B0C0E] group-hover:text-black" : "text-white"
              }`}
              style={{
                backgroundImage: isLight
                  ? undefined
                  : isHovered
                  ? "linear-gradient(90deg, #FFFFFF 0%, #93C5FD 30%, #F472B6 70%, #FFFFFF 100%)"
                  : "linear-gradient(90deg, #FFFFFF 0%, #E2E8F0 50%, #FFFFFF 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: isLight ? undefined : "text",
                WebkitTextFillColor: isLight ? undefined : isHovered ? "transparent" : "inherit",
              }}
            >
              MENTNEO
            </span>

            {/* Live Micro Dual-Color Beacon */}
            <span className="flex items-center gap-0.5">
              <span
                className="w-1.5 h-1.5 rounded-full animate-ping"
                style={{ backgroundColor: "#38BDF8" }}
              />
            </span>
          </div>

          {/* Subtitle / Tagline */}
          {showTagline && (
            <div
              className={`flex items-center gap-2 mt-1.5 font-mono uppercase tracking-[0.18em] ${sizeMap.sub} ${
                isLight ? "text-[#737883]" : "text-white/50"
              }`}
            >
              <span>RESEARCH &amp; DEV</span>
              <span className="opacity-30">·</span>
              <span className={isHovered ? "text-[#38BDF8] transition-colors duration-200" : ""}>
                EST. 2025
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
