"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MentneoLogo from "@/components/ui/MentneoLogo";

export default function Preloader() {
  const [complete, setComplete] = useState(false);
  const [bootStep, setBootStep] = useState(0);

  const bootLogs = [
    "INITIALIZING MENTNEO TENSOR ENGINE...",
    "VERIFYING DETERMINISTIC PROOF GATES... [OK]",
    "SYNCHRONIZING SOVEREIGN HUBS (HYD · KAK · SF · LDN)... [11.2ms]",
    "INTELLIGENCE, ENGINEERED.",
  ];

  useEffect(() => {
    const t1 = setTimeout(() => setBootStep(1), 350);
    const t2 = setTimeout(() => setBootStep(2), 700);
    const t3 = setTimeout(() => setBootStep(3), 1050);
    const t4 = setTimeout(() => setComplete(true), 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <AnimatePresence>
      {!complete && (
        <motion.div
          id="chapter-0"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 select-none"
        >
          {/* Subtle background grain */}
          <div className="absolute inset-0 bg-grain pointer-events-none" />

          {/* Central Architectural Monogram */}
          <div className="relative mb-8">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="p-4 rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-xl shadow-[0_0_60px_rgba(47,91,255,0.2)]"
            >
              <MentneoLogo
                variant="dark"
                size="lg"
                showWordmark={false}
                showTagline={false}
                animated={true}
              />
            </motion.div>
          </div>

          {/* Minimal Statement */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-6"
          >
            <h1 className="text-xl md:text-2xl font-light tracking-tight text-[#F2F2F0]">
              Intelligence, engineered.
            </h1>
            <p className="font-mono text-[10px] tracking-wideMono uppercase text-white/40 mt-1">
              Mentneo AI Research & Development · 2025
            </p>
          </motion.div>

          {/* Real-time Telemetry Boot Logs */}
          <div className="h-6 flex items-center justify-center overflow-hidden">
            <motion.p
              key={bootStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="font-mono text-[11px] text-[#2F5BFF] tracking-wideMono"
            >
              {bootLogs[bootStep]}
            </motion.p>
          </div>

          {/* Minimal hairline progress indicator */}
          <div className="w-48 h-[1px] bg-white/10 mt-6 relative overflow-hidden">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2F5BFF] to-white"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
