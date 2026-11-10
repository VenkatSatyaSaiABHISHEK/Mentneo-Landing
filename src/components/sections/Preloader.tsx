"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [complete, setComplete] = useState(false);
  const [stage, setStage] = useState<"enter" | "shine" | "reveal">("enter");
  const [logIndex, setLogIndex] = useState(0);

  const logs = [
    "INITIALIZING TENSOR RUNTIME ARCHITECTURE...",
    "VERIFYING DETERMINISTIC PROOF GATES... [OK]",
    "INTELLIGENCE, ENGINEERED.",
  ];

  const finish = useCallback(() => {
    setComplete(true);
  }, []);

  useEffect(() => {
    // If URL has ?holdPreloader=1, freeze at shine stage for visual auditing
    if (typeof window !== "undefined" && window.location.search.includes("holdPreloader=1")) {
      setStage("shine");
      setLogIndex(1);
      return;
    }

    // Sequence timing: total duration ~1.3s (under 1.5s)
    const tShine = setTimeout(() => {
      setStage("shine");
      setLogIndex(1);
    }, 450);

    const tReveal = setTimeout(() => {
      setStage("reveal");
      setLogIndex(2);
    }, 950);

    const tComplete = setTimeout(() => {
      finish();
    }, 1350);

    // Skippable on any keypress
    const handleKeyDown = () => {
      finish();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(tShine);
      clearTimeout(tReveal);
      clearTimeout(tComplete);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [finish]);

  return (
    <AnimatePresence>
      {!complete && (
        <motion.div
          id="chapter-0"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={finish}
          className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 select-none cursor-pointer"
        >
          {/* Subtle background grain */}
          <div className="absolute inset-0 bg-grain pointer-events-none" />

          {/* Central Architectural Emblem Reveal */}
          <div className="relative mb-6 flex flex-col items-center">
            {/* Soft Ambient Radial Bloom (Cyan + Violet) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: stage === "shine" || stage === "reveal" ? 0.75 : 0.3,
                scale: stage === "shine" || stage === "reveal" ? 1.15 : 0.95,
              }}
              transition={{ duration: 0.5 }}
              className="absolute -inset-12 rounded-full blur-3xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(56,189,248,0.35) 0%, rgba(192,132,252,0.25) 50%, transparent 75%)",
              }}
            />

            {/* Emblem Floating Frame */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative p-6 rounded-3xl border border-white/15 bg-white/[0.03] backdrop-blur-2xl shadow-[0_0_60px_rgba(56,189,248,0.3),0_0_90px_rgba(192,132,252,0.2)] flex items-center justify-center overflow-hidden"
            >
              <div className="relative w-20 h-24 sm:w-24 sm:h-28 flex items-center justify-center">
                <Image
                  src="/mentneo-logo.png"
                  alt="Mentneo Emblem"
                  width={192}
                  height={234}
                  priority
                  className="w-full h-full object-contain pointer-events-none drop-shadow-[0_8px_25px_rgba(0,0,0,0.8)]"
                />

                {/* Diagonal Specular Sweep */}
                <motion.div
                  initial={{ x: "-150%" }}
                  animate={{
                    x: stage === "shine" || stage === "reveal" ? "180%" : "-150%",
                  }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full pointer-events-none -skew-x-12"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* Typography Revealed */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="text-center mb-6"
          >
            <h1 className="text-xl sm:text-2xl font-semibold tracking-[0.2em] text-[#F2F2F0] uppercase font-sans">
              MENTNEO
            </h1>
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/45 mt-1">
              Research &amp; Dev
            </p>
          </motion.div>

          {/* Real-time Status Log */}
          <div className="h-6 flex items-center justify-center overflow-hidden">
            <motion.p
              key={logIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="font-mono text-[11px] text-[#38BDF8] tracking-wideMono"
            >
              {logs[logIndex]}
            </motion.p>
          </div>

          {/* Minimal hairline progress indicator */}
          <div className="w-48 h-[1px] bg-white/10 mt-6 relative overflow-hidden">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 1.25, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#38BDF8] to-white"
            />
          </div>

          {/* Skip hint */}
          <div className="absolute bottom-6 font-mono text-[10px] text-white/30 uppercase tracking-widest">
            Click anywhere or press any key to skip
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
