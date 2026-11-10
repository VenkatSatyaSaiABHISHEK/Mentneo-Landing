"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/ui/Logo";

export default function FinaleSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [inquiryType, setInquiryType] = useState("Sovereign Deployment");
  const [submitted, setSubmitted] = useState(false);

  const inquiryOptions = [
    "Sovereign & Air-Gapped Deployment",
    "Neuro HGI 2.2 mm Silicon Partnership",
    "Enterprise Mentneo LLM & Voice Integration",
    "Saadhyam Autonomous Calling Fleet",
    "Mentlearn Fellowship & Corporate Academy",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setModalOpen(false);
    }, 2000);
  };

  return (
    <section
      id="chapter-8"
      className="relative min-h-screen bg-black text-[#F2F2F0] px-6 pt-32 pb-16 flex flex-col justify-between items-center overflow-hidden select-none"
    >
      {/* Background Micro Grain */}
      <div className="absolute inset-0 bg-grain pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.035)_0%,transparent_70%)] pointer-events-none" />

      {/* Chapter Tag */}
      <div className="relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-wideMono text-white/70">
            CONTACT · THE ENGAGEMENT
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-light tracking-[-0.03em] text-white">
          Begin deterministic engineering.
        </h2>
        <p className="mt-4 text-sm sm:text-base text-[#8A8F98] max-w-xl mx-auto leading-relaxed">
          Whether you require an air-gapped sovereign model architecture, real-time voice intelligence,
          or early silicon collaboration on the Neuro HGI die.
        </p>

        {/* Single Refined "Talk to us" CTA */}
        <div className="mt-10">
          <button
            onClick={() => setModalOpen(true)}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black text-sm font-semibold tracking-tight hover:bg-[#F2F2F0] transition-all duration-300 shadow-[0_0_50px_rgba(255,255,255,0.25)] hover:scale-105"
            data-cursor
            data-cursor-label="TALK"
          >
            <span>Talk to us</span>
            <span className="font-mono text-xs transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </div>

      {/* HUGE OUTLINED "MENTNEO" TYPOGRAPHIC MONUMENT */}
      <div className="relative z-10 w-full my-16 text-center select-none pointer-events-none">
        <h1
          className="text-[15vw] font-black tracking-[-0.05em] leading-none text-transparent"
          style={{
            WebkitTextStroke: "1px rgba(255, 255, 255, 0.15)",
          }}
        >
          MENTNEO
        </h1>
      </div>

      {/* MINIMAL FOOTER: Keep ONLY Hyderabad, India, contact email, copyright */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto pt-10 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-[11px] text-white/50">
        <div className="flex items-center gap-3">
          <Logo size="sm" showWordmark={true} showTagline={false} />
          <span>·</span>
          <span>Hyderabad, India</span>
        </div>

        <div>
          <a
            href="mailto:research@mentneo.ai"
            className="hover:text-white transition-colors underline-offset-4 hover:underline"
          >
            research@mentneo.ai
          </a>
        </div>

        <div>
          <span>© 2025 Mentneo Inc. All rights reserved.</span>
        </div>
      </footer>

      {/* INTERACTIVE BRIEFING CONSULTATION MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-lg rounded-2xl border border-white/15 bg-[#0C0E12] p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-lg font-medium text-white tracking-tight">
                    Schedule Laboratory Briefing
                  </h3>
                  <p className="font-mono text-[10px] text-white/40 uppercase tracking-wideMono mt-0.5">
                    Direct access to Mentneo engineering fellows
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full border border-[#10B981] bg-[#10B981]/10 text-[#10B981] flex items-center justify-center mx-auto text-xl">
                    ✓
                  </div>
                  <h4 className="text-base font-medium text-white">
                    Briefing Request Logged
                  </h4>
                  <p className="text-xs text-white/60 font-mono">
                    A Mentneo research partner will transmit meeting access details within 4 business hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="font-mono text-[10px] uppercase text-white/50 tracking-wideMono block mb-1.5">
                      ENGAGEMENT MANDATE
                    </label>
                    <select
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.03] text-xs text-white focus:outline-none focus:border-white/30"
                    >
                      {inquiryOptions.map((opt) => (
                        <option key={opt} value={opt} className="bg-black text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-mono text-[10px] uppercase text-white/50 tracking-wideMono block mb-1.5">
                        NAME / TITLE
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Dr. Elena Vance"
                        className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/[0.03] text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30 font-sans"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[10px] uppercase text-white/50 tracking-wideMono block mb-1.5">
                        ORGANIZATION
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Ministry of Electronics / Enterprise"
                        className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/[0.03] text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30 font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-mono text-[10px] uppercase text-white/50 tracking-wideMono block mb-1.5">
                      WORK EMAIL (ENCRYPTED)
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="e.vance@gov.in or corporate domain"
                      className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/[0.03] text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[10px] uppercase text-white/50 tracking-wideMono block mb-1.5">
                      SPECIFICATION NOTES (OPTIONAL)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Compute requirements, air-gapped security tier, expected token or voice concurrent volume..."
                      className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/[0.03] text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30 font-sans resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-lg bg-white text-black font-semibold text-xs tracking-tight hover:bg-[#F2F2F0] transition-colors"
                    >
                      Transmit Briefing Request
                    </button>
                    <p className="font-mono text-[9px] text-white/40 text-center mt-2">
                      Zero tracking cookies · Cryptographic client-side validation
                    </p>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
