"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useSmoothScroll } from "@/components/ui/SmoothScrollProvider";
import { HERO_FAN_CARDS, HeroFanCard } from "@/data/products";
import HeroCardVisual from "./HeroCardVisual";

export default function Hero() {
  const { scrollTo } = useSmoothScroll();
  const containerRef = useRef<HTMLDivElement>(null);

  // Single shared active index for flower petal fan (0 to 6, default 3: Saadhyam)
  const [activeIndex, setActiveIndex] = useState(3);
  const [previewHover, setPreviewHover] = useState<number | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Drag tracking
  const dragStartX = useRef<number | null>(null);

  // Auto-play: Cycle active card every 4.5 seconds when idle
  useEffect(() => {
    if (isInteracting) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_FAN_CARDS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isInteracting]);

  // Keyboard navigation (Left / Right arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev + 1) % HERO_FAN_CARDS.length);
        setIsInteracting(true);
      } else if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev - 1 + HERO_FAN_CARDS.length) % HERO_FAN_CARDS.length);
        setIsInteracting(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Mouse Parallax for entire fan
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleCardClick = (idx: number, card: HeroFanCard) => {
    if (idx !== activeIndex) {
      // Click a neighbour petal to lock and bloom it
      setActiveIndex(idx);
      setIsInteracting(true);
      return;
    }

    // Clicking the already active front card navigates to explore it
    if (typeof window !== "undefined") {
      const jump = (window as unknown as Record<string, unknown>).__jumpToScene as
        | ((idx: number) => void)
        | undefined;
      if (card.sceneIndex !== undefined && jump) {
        jump(card.sceneIndex);
        return;
      }
    }
    scrollTo(card.href);
  };

  // Drag / Swipe handling
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    setIsInteracting(true);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const deltaX = e.clientX - dragStartX.current;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        // Swiped left -> advance
        setActiveIndex((prev) => (prev + 1) % HERO_FAN_CARDS.length);
      } else {
        // Swiped right -> previous
        setActiveIndex((prev) => (prev - 1 + HERO_FAN_CARDS.length) % HERO_FAN_CARDS.length);
      }
    }
    dragStartX.current = null;
  };

  const activeCardData = HERO_FAN_CARDS[activeIndex];

  return (
    <section
      id="chapter-1"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-black pt-28 pb-16 px-4 sm:px-6 flex flex-col items-center justify-between overflow-hidden select-none"
    >
      {/* Background Micro Grain & Vignette */}
      <div className="absolute inset-0 bg-grain pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.035)_0%,transparent_70%)] pointer-events-none" />

      {/* Top Headline & Value Proposition */}
      <div className="relative z-10 max-w-4xl mx-auto text-center mt-2">
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-normal tracking-[-0.04em] text-[#F2F2F0] leading-[0.95]"
        >
          Intelligence, <br />
          <span className="text-white/60">engineered.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-5 text-sm sm:text-base lg:text-lg text-[#8A8F98] max-w-2xl mx-auto font-normal leading-relaxed tracking-tight"
        >
          Mentneo designs frontier foundation models, real-time voice intelligence,
          autonomous AI workforces, and the upcoming 2.2&nbsp;mm Neuro HGI silicon.
          Built for enterprises where probabilistic hallucinations are unacceptable.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3.5"
        >
          <button
            onClick={() => scrollTo("#chapter-3")}
            className="px-5 py-2.5 rounded-full bg-white text-black text-xs font-semibold tracking-tight hover:bg-[#F2F2F0] transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            data-cursor
            data-cursor-label="EXPLORE"
          >
            Explore Product Fleet
          </button>
          <button
            onClick={() => scrollTo("#chapter-4")}
            className="px-5 py-2.5 rounded-full border border-white/20 bg-white/[0.03] text-xs font-semibold tracking-tight text-white hover:bg-white/10 transition-colors flex items-center gap-2"
            data-cursor
            data-cursor-label="CHIP"
          >
            <span>Neuro HGI 2.2 mm Silicon</span>
            <span className="text-[#E8A23B]">→</span>
          </button>
        </motion.div>
      </div>

      {/* FLOWER-STYLE CARD FAN:
          All 7 cards act as petals around a central stem/pivot point.
          Single shared active index drives synchronized spring motion.
          Cards are reduced to ~55-60% size (250px × 360px), fitting comfortably in viewport. */}
      <div
        className="relative z-10 w-full max-w-6xl h-[400px] sm:h-[420px] mt-6 flex items-center justify-center touch-pan-y"
        onMouseEnter={() => setIsInteracting(true)}
        onMouseLeave={() => {
          setIsInteracting(false);
          setPreviewHover(null);
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {/* Soft Radial Ambient Accent Glow Behind the Blooming Front Card Only */}
        <motion.div
          animate={{
            backgroundColor: activeCardData.accent,
            opacity: 0.28,
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{
            backgroundColor: { duration: 0.5 },
            opacity: { duration: 0.5 },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute w-[340px] h-[340px] rounded-full blur-[80px] pointer-events-none"
        />

        {/* Parallax Container shifting entire flower slightly with mouse */}
        <motion.div
          animate={{
            x: mousePos.x * 20,
            y: mousePos.y * 12,
            rotateY: mousePos.x * 3.5,
            rotateX: -mousePos.y * 2.5,
          }}
          transition={{ type: "spring", stiffness: 80, damping: 25 }}
          className="relative w-full h-full flex items-center justify-center perspective-[1200px]"
        >
          {HERO_FAN_CARDS.map((card, idx) => {
            // Compute wrapped shortest distance from activeIndex: range [-3, 3]
            let diff = idx - activeIndex;
            if (diff > 3) diff -= 7;
            if (diff < -3) diff += 7;

            const absDiff = Math.abs(diff);
            const isBloom = absDiff === 0;
            const isHoveredPreview = previewHover === idx && !isBloom;

            // Layout Parameters (Radial Petal Fan):
            // - Symmetrical rotation: ±7.5°, ±15°, ±22.5°
            const targetRotate = diff * 7.5;

            // - Symmetrical scale down: 1.0, 0.92, 0.85, 0.78
            const baseScale = isBloom ? 1.0 : absDiff === 1 ? 0.92 : absDiff === 2 ? 0.85 : 0.78;
            const targetScale = isHoveredPreview ? baseScale + 0.04 : baseScale;

            // - Symmetrical drop in Y (front card rises to bloom: -18px, neighbours drop down)
            const baseY = isBloom ? -18 : absDiff === 1 ? 14 : absDiff === 2 ? 34 : 54;
            const targetY = isHoveredPreview ? baseY - 10 : baseY;

            // - Symmetrical horizontal spacing with parting to give bloom room
            const parting = diff > 0 ? 18 : diff < 0 ? -18 : 0;
            const targetX = diff * 92 + parting;

            // - Z-index hierarchy
            const targetZ = isBloom ? 35 : isHoveredPreview ? 25 : 20 - absDiff * 5;

            // - Dimming & soft blur for background petals
            const targetOpacity = isBloom ? 1.0 : isHoveredPreview ? 0.95 : absDiff === 1 ? 0.88 : absDiff === 2 ? 0.70 : 0.52;
            const targetBlur = isBloom ? 0 : isHoveredPreview ? 0.5 : absDiff === 1 ? 0.5 : absDiff === 2 ? 1.8 : 2.8;

            return (
              <motion.div
                key={card.id}
                onMouseEnter={() => setPreviewHover(idx)}
                onMouseLeave={() => setPreviewHover(null)}
                onClick={() => handleCardClick(idx, card)}
                animate={{
                  x: targetX,
                  y: targetY,
                  rotate: targetRotate,
                  scale: targetScale,
                  zIndex: targetZ,
                  opacity: targetOpacity,
                  filter: `blur(${targetBlur}px)`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 20,
                  mass: 0.9,
                }}
                style={{
                  transformOrigin: "center 680px",
                  boxShadow: isBloom
                    ? `0 25px 60px -12px rgba(0,0,0,0.95), 0 0 45px -8px ${card.glowColor}, inset 0 1px 0 rgba(255,255,255,0.22)`
                    : "0 18px 36px -12px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
                className={`absolute w-[240px] sm:w-[255px] lg:w-[265px] h-[340px] sm:h-[360px] rounded-[22px] border ${
                  isBloom ? "border-white/25" : "border-white/10"
                } bg-gradient-to-b from-[#12141B]/95 via-[#0C0D12]/95 to-[#07080B]/98 backdrop-blur-xl overflow-hidden cursor-pointer flex flex-col justify-between p-4 sm:p-5 transition-[border-color,box-shadow] duration-300 group`}
                data-cursor
                data-cursor-label={isBloom ? "EXPLORE" : "VIEW"}
              >
                {/* Top Accent Hairline */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
                  style={{
                    backgroundColor: card.accent,
                    opacity: isBloom ? 1 : 0.4,
                  }}
                />

                {/* Subtle Grain Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  }}
                />

                {/* Card Header: Domain Tag + Large Product Name + Plain-English Promise */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] sm:text-[12px] font-mono text-white/50 tracking-wider uppercase">
                      {card.label}
                    </span>
                    <span
                      className="w-1.5 h-1.5 rounded-full transition-transform duration-300 group-hover:scale-125"
                      style={{ backgroundColor: card.accent }}
                    />
                  </div>

                  <h3 className="text-[20px] sm:text-[22px] font-medium text-white tracking-tight leading-[1.15] mt-1.5">
                    {card.name}
                  </h3>

                  <p className="text-[13px] sm:text-[13.5px] text-[#A1A1AA] leading-snug mt-1 line-clamp-2">
                    {card.promise}
                  </p>
                </div>

                {/* Card Visual Center */}
                <div className="relative z-10 flex-1 my-2 flex items-center justify-center overflow-hidden rounded-xl bg-white/[0.015] border border-white/[0.04]">
                  <HeroCardVisual type={card.visualType} accent={card.accent} />
                </div>

                {/* Card Footer: Subtle Explore Action */}
                <div className="relative z-10 pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-white/45">
                    {isBloom ? "Click to explore" : "Click to view"}
                  </span>
                  <span
                    className="text-xs font-semibold tracking-tight inline-flex items-center gap-1 transition-transform group-hover:translate-x-1"
                    style={{ color: card.accent }}
                  >
                    <span>→</span>
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* 7-Dot Flower Index Indicator Bar (follows active index) */}
      <div className="relative z-10 mt-4 flex flex-col items-center gap-2">
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
          {HERO_FAN_CARDS.map((card, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={card.id}
                onClick={() => {
                  setActiveIndex(idx);
                  setIsInteracting(true);
                }}
                aria-label={`Select ${card.name}`}
                data-cursor
                data-cursor-label={card.name}
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? "w-6 h-1.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.6)]"
                    : "w-1.5 h-1.5 bg-white/25 hover:bg-white/50"
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
