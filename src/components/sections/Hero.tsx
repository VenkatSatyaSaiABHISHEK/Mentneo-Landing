"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useSmoothScroll } from "@/components/ui/SmoothScrollProvider";

interface FanCardData {
  id: string;
  name: string;
  category: string;
  badge: string;
  accent: string;
  glowColor: string;
  statLabel: string;
  statValue: string;
  renderVisual: () => React.ReactNode;
}

export default function Hero() {
  const { scrollTo } = useSmoothScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const fanCards: FanCardData[] = [
    {
      id: "card-llm",
      name: "Mentneo LLM",
      category: "Foundation Architecture",
      badge: "v3.4 MoE",
      accent: "#7DA4D8",
      glowColor: "rgba(125, 164, 216, 0.25)",
      statLabel: "THROUGHPUT",
      statValue: "318 tok/s",
      renderVisual: () => (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-gradient-to-b from-[#0E1013] to-black">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-white/50 tracking-wideMono">
              TENSOR_CORE_8X
            </span>
            <span className="w-2 h-2 rounded-full bg-[#7DA4D8] shadow-[0_0_8px_#7DA4D8]" />
          </div>
          {/* Simulated Tensor Heatmap / Attention Matrix */}
          <div className="grid grid-cols-6 gap-1.5 my-3">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="h-3.5 rounded-sm transition-opacity duration-700"
                style={{
                  backgroundColor: "#7DA4D8",
                  opacity: 0.15 + ((i * 7) % 85) / 100,
                }}
              />
            ))}
          </div>
          <div className="flex justify-between items-end border-t border-white/10 pt-2.5 font-mono text-xs">
            <span className="text-white/40">CONTEXT</span>
            <span className="text-white/95 font-medium">1.2M Tokens</span>
          </div>
        </div>
      ),
    },
    {
      id: "card-voice",
      name: "Mentneo Voice",
      category: "Acoustic DSP Physics",
      badge: "118ms E2E",
      accent: "#2F5BFF",
      glowColor: "rgba(47, 91, 255, 0.3)",
      statLabel: "LATENCY",
      statValue: "118 ms",
      renderVisual: () => (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-gradient-to-b from-[#0E1013] to-black">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-white/50 tracking-wideMono">
              BINAURAL_DSP
            </span>
            <span className="font-mono text-[10px] text-white px-1.5 py-0.5 rounded bg-[#2F5BFF]/30 border border-[#2F5BFF]/40 font-semibold">
              48kHz / 24-BIT
            </span>
          </div>
          {/* Live Waveform Bars */}
          <div className="flex items-center justify-center gap-1.5 h-14 my-2">
            {[20, 48, 85, 32, 95, 65, 40, 75, 100, 55, 30, 80, 45, 90, 60, 25].map(
              (h, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full bg-gradient-to-t from-[#2F5BFF]/20 to-[#2F5BFF]"
                  style={{ height: `${h}%` }}
                />
              )
            )}
          </div>
          <div className="flex justify-between items-end border-t border-white/10 pt-2.5 font-mono text-xs">
            <span className="text-white/40">DUPLEX</span>
            <span className="text-white/95 font-medium">Sub-42ms Interrupt</span>
          </div>
        </div>
      ),
    },
    {
      id: "card-chip",
      name: "Neuro HGI Chip",
      category: "Neuromorphic Silicon",
      badge: "2.2 mm Die",
      accent: "#E8A23B",
      glowColor: "rgba(232, 162, 59, 0.3)",
      statLabel: "POWER BUDGET",
      statValue: "0.8 W",
      renderVisual: () => (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-gradient-to-b from-[#14120E] to-black">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-white/50 tracking-wideMono">
              SILICON_ARCH
            </span>
            <span className="font-mono text-[10px] text-[#E8A23B] px-1.5 py-0.5 rounded bg-[#E8A23B]/10 border border-[#E8A23B]/30 font-semibold">
              SUB-MILLIWATT
            </span>
          </div>
          {/* Micro-Die Schematic */}
          <div className="relative w-22 h-22 mx-auto border border-[#E8A23B]/40 rounded-sm bg-[#E8A23B]/[0.03] flex items-center justify-center">
            <div className="w-14 h-14 border border-[#E8A23B]/60 rounded-sm flex items-center justify-center">
              <span className="font-mono text-xs text-[#E8A23B] font-bold">HGI 2.2</span>
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,162,59,0.18),transparent_70%)]" />
          </div>
          <div className="flex justify-between items-end border-t border-white/10 pt-2.5 font-mono text-xs">
            <span className="text-white/40">DIE SCALE</span>
            <span className="text-[#E8A23B] font-semibold">2.2 × 2.2 mm</span>
          </div>
        </div>
      ),
    },
    {
      id: "card-saadhyam",
      name: "Saadhyam",
      category: "Autonomous Calling",
      badge: "100k Concurrency",
      accent: "#8EA0B8",
      glowColor: "rgba(142, 160, 184, 0.25)",
      statLabel: "CALL ACCURACY",
      statValue: "88.7%",
      renderVisual: () => (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-gradient-to-b from-[#101216] to-black">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-white/50 tracking-wideMono">
              SIP_TRUNK_LIVE
            </span>
            <span className="w-2 h-2 rounded-full bg-[#2F5BFF] animate-ping" />
          </div>
          {/* Real-time Call Telemetry Stream */}
          <div className="space-y-1.5 my-2.5 font-mono text-[11px]">
            <div className="p-2 rounded bg-white/[0.03] border border-white/10 flex justify-between">
              <span className="text-white/40">ACTIVE LINES</span>
              <span className="text-white font-medium">100,420</span>
            </div>
            <div className="p-2 rounded bg-white/[0.03] border border-white/10 flex justify-between">
              <span className="text-white/40">SENTIMENT</span>
              <span className="text-[#2F5BFF] font-semibold">94.2% Positive</span>
            </div>
          </div>
          <div className="flex justify-between items-end border-t border-white/10 pt-2.5 font-mono text-xs">
            <span className="text-white/40">CRM SYNC</span>
            <span className="text-white/95 font-medium">&lt; 180ms Latency</span>
          </div>
        </div>
      ),
    },
    {
      id: "card-rag",
      name: "Mentneo Search",
      category: "Deterministic RAG",
      badge: "10B+ Vectors",
      accent: "#7EB8A2",
      glowColor: "rgba(126, 184, 162, 0.25)",
      statLabel: "P99 RETRIEVAL",
      statValue: "4.8 ms",
      renderVisual: () => (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-gradient-to-b from-[#09110D] to-black">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-white/50 tracking-wideMono">
              HNSW_SPARSE_DENSE
            </span>
            <span className="font-mono text-[10px] text-[#7EB8A2] px-1.5 py-0.5 rounded bg-[#7EB8A2]/10 border border-[#7EB8A2]/30 font-semibold">
              SIMD AVX
            </span>
          </div>
          {/* High Dimensional Node Graph */}
          <div className="relative h-18 my-2 border border-[#7EB8A2]/20 rounded bg-[#7EB8A2]/[0.02] p-2 flex items-center justify-around">
            <div className="w-2 h-2 rounded-full bg-[#7EB8A2]" />
            <div className="h-[1px] w-12 bg-gradient-to-r from-[#7EB8A2] to-white/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_#fff]" />
            <div className="h-[1px] w-8 bg-gradient-to-r from-white/40 to-[#7EB8A2]" />
            <div className="w-2 h-2 rounded-full bg-[#7EB8A2]/60" />
          </div>
          <div className="flex justify-between items-end border-t border-white/10 pt-2.5 font-mono text-xs">
            <span className="text-white/40">GROUNDING</span>
            <span className="text-[#7EB8A2] font-semibold">100% Exact Citation</span>
          </div>
        </div>
      ),
    },
  ];

  // Resting fan angles: -18, -9, 0, 9, 18
  const baseRotations = [-18, -9, 0, 9, 18];
  const baseOffsets = [-160, -80, 0, 80, 160];

  return (
    <section
      id="chapter-1"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
        setActiveCard(null);
      }}
      className="relative min-h-screen bg-black pt-32 pb-24 px-6 flex flex-col items-center justify-between overflow-hidden select-none"
    >
      {/* Background Micro Grain & Vignette */}
      <div className="absolute inset-0 bg-grain pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.035)_0%,transparent_70%)] pointer-events-none" />

      {/* Top Tagline & Headline */}
      <div className="relative z-10 max-w-4xl mx-auto text-center mt-6">
        {/* Sovereign R&D Tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] mb-6 backdrop-blur-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#2F5BFF]" />
          <span className="font-mono text-xs uppercase tracking-wideMono text-white/70">
            HYDERABAD · KAKINADA · SAN FRANCISCO · LONDON
          </span>
        </motion.div>

        {/* Big Bold Architectural Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-normal tracking-[-0.04em] text-[#F2F2F0] leading-[0.95]"
        >
          Intelligence, <br />
          <span className="text-white/60">engineered.</span>
        </motion.h1>

        {/* Precise Technical Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-[#8A8F98] max-w-2xl mx-auto font-normal leading-relaxed tracking-tight"
        >
          Mentneo designs frontier foundation models, deterministic reasoning graphs,
          sub-120ms acoustic voice physics, and the upcoming 2.2&nbsp;mm Neuro HGI silicon.
          Built for enterprises and sovereigns where probabilistic hallucinations are unacceptable.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={() => scrollTo("#chapter-3")}
            className="px-6 py-3 rounded-full bg-white text-black text-xs font-semibold tracking-tight hover:bg-[#F2F2F0] transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            data-cursor
            data-cursor-label="EXPLORE"
          >
            Explore Product Fleet
          </button>
          <button
            onClick={() => scrollTo("#chapter-4")}
            className="px-6 py-3 rounded-full border border-white/20 bg-white/[0.03] text-xs font-semibold tracking-tight text-white hover:bg-white/10 transition-colors flex items-center gap-2"
            data-cursor
            data-cursor-label="CHIP"
          >
            <span>Neuro HGI 2.2 mm Silicon</span>
            <span className="text-[#E8A23B]">→</span>
          </button>
        </motion.div>
      </div>

      {/* REFINED FAN OF PRODUCT CARDS (Mouse parallax, 3D tilt max 6deg, separates & straightens on hover) */}
      <div className="relative z-10 w-full max-w-5xl h-[380px] sm:h-[430px] mt-12 flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center">
          {fanCards.map((card, idx) => {
            const isCardActive = activeCard === idx;
            const spreadMultiplier = isHovered ? 1.5 : 1.0;
            const targetX = baseOffsets[idx] * spreadMultiplier + mousePos.x * 25;
            const targetY = isHovered
              ? Math.abs(idx - 2) * 8 + mousePos.y * 15
              : Math.abs(idx - 2) * 16 + mousePos.y * 12;
            const targetRotate = isHovered
              ? baseRotations[idx] * 0.2 + mousePos.x * 4 // Max 6 deg tilt
              : baseRotations[idx];

            return (
              <motion.div
                key={card.id}
                onMouseEnter={() => setActiveCard(idx)}
                onMouseLeave={() => setActiveCard(null)}
                onClick={() => scrollTo("#chapter-3")}
                animate={{
                  x: targetX,
                  y: isCardActive ? targetY - 30 : targetY,
                  rotate: isCardActive ? 0 : targetRotate,
                  scale: isCardActive ? 1.08 : isHovered ? 1.02 : 0.98,
                  zIndex: isCardActive ? 30 : idx === 2 ? 15 : idx,
                }}
                transition={{
                  type: "spring",
                  stiffness: 240,
                  damping: 24,
                  mass: 0.8,
                }}
                style={{
                  transformOrigin: "bottom center",
                  boxShadow: isCardActive
                    ? `0 25px 50px -10px rgba(0,0,0,0.9), 0 0 50px -5px ${card.glowColor}, inset 0 1px 0 rgba(255,255,255,0.2)`
                    : "0 20px 40px -15px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
                className="absolute w-[250px] sm:w-[280px] h-[335px] sm:h-[370px] rounded-2xl border border-white/10 border-t-white/25 border-l-white/20 bg-[#0A0C0F] overflow-hidden cursor-pointer transition-colors duration-300 group"
                data-cursor
                data-cursor-label="INSPECT"
              >
                {/* Top specular hairline according to card accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
                  style={{
                    backgroundColor: card.accent,
                    opacity: isCardActive ? 1 : 0.45,
                  }}
                />

                {/* Card Header */}
                <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.015]">
                  <div>
                    <h3 className="text-sm font-semibold text-white tracking-tight">
                      {card.name}
                    </h3>
                    <p className="font-mono text-[10px] uppercase tracking-wideMono text-white/50 mt-0.5">
                      {card.category}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full border border-white/15 bg-white/[0.05] text-white/80 font-medium">
                    {card.badge}
                  </span>
                </div>

                {/* Interactive Product Visual Component */}
                <div className="h-[210px] sm:h-[240px]">
                  {card.renderVisual()}
                </div>

                {/* Card Footer Metric */}
                <div className="p-3.5 border-t border-white/[0.08] flex items-center justify-between bg-black/50">
                  <span className="font-mono text-[10px] uppercase tracking-wideMono text-white/50">
                    {card.statLabel}
                  </span>
                  <span
                    className="font-mono text-sm font-bold tracking-tight"
                    style={{ color: card.accent }}
                  >
                    {card.statValue}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Hero Footnote Indicator */}
      <div className="relative z-10 mt-8 flex items-center gap-3 font-mono text-xs text-white/40 tracking-wideMono uppercase">
        <span>SCROLL TO BEGIN COGNITIVE TRANSITION</span>
        <span className="animate-bounce">↓</span>
      </div>
    </section>
  );
}
