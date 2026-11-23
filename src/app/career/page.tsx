"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import CareerNavbar from "@/components/career/CareerNavbar";
import CareerFooter from "@/components/career/CareerFooter";
import { ArrowRight, BrainCircuit, Briefcase, MapPin, CheckCircle2, Lock } from "lucide-react";

export default function CareerPortalPage() {
  const openingsRef = useRef<HTMLDivElement>(null);
  const [formConfig, setFormConfig] = useState<{
    globalOpen: boolean;
    btech: { isOpen: boolean };
    mba: { isOpen: boolean };
  } | null>(null);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch(`/api/career/form-config?t=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          const d = json.data || json;
          if (json.success && d && d.btech && d.mba) {
            setFormConfig({
              globalOpen: Boolean(d.globalOpen),
              btech: { isOpen: Boolean(d.btech.isOpen) },
              mba: { isOpen: Boolean(d.mba.isOpen) },
            });
          }
        }
      } catch (err) {
        console.warn("Failed to load career config:", err);
      }
    }
    loadConfig();
  }, []);

  const btechOpen = Boolean(formConfig ? formConfig.globalOpen && formConfig.btech?.isOpen : false);
  const mbaOpen = Boolean(formConfig ? formConfig.globalOpen && formConfig.mba?.isOpen : false);
  const anyOpen = btechOpen || mbaOpen;
  const onlyOneOpen = (btechOpen && !mbaOpen) || (!btechOpen && mbaOpen);

  // Automatic gentle scroll to openings after 5 seconds if user hasn't scrolled yet
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.scrollY < 120 && openingsRef.current) {
        const top = openingsRef.current.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const scrollToOpenings = () => {
    if (openingsRef.current) {
      const top = openingsRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] flex flex-col justify-between selection:bg-black selection:text-white antialiased font-sans">
      {/* Clean White Google/OpenAI Style Career Navbar with live status */}
      <CareerNavbar
        isOpen={formConfig ? anyOpen : undefined}
        btechOpen={formConfig ? btechOpen : undefined}
        mbaOpen={formConfig ? mbaOpen : undefined}
      />

      <main className="flex-1 pt-28 pb-20">
        {/* =========================================================================
            A. HERO SECTION — MINIMAL, ELEGANT, WHITE
        ========================================================================= */}
        <section className="relative px-6 pt-16 pb-20 max-w-5xl mx-auto text-center">
          {/* Recruitment Program Name Tag (Clean text, no blinking dots) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E5E5E5] bg-[#FAFAFA] mb-7"
          >
            <span className="text-[12px] font-medium tracking-wide text-[#555555]">
              Mentneo Recruitment Drive 2026 · Hyderabad
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-normal tracking-[-0.035em] text-black leading-[1.06]"
          >
            Build Your Future <br />
            <span className="text-[#666666]">With MENTNEO</span>
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-[#555555] max-w-2xl mx-auto leading-relaxed"
          >
            Discover opportunities to learn, innovate, and build your career with Mentneo.
            Join an engineering-first research culture building sovereign artificial intelligence.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-9 flex items-center justify-center gap-4"
          >
            <button
              onClick={scrollToOpenings}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-black text-white text-xs font-semibold hover:bg-[#222222] transition-all shadow-sm"
            >
              <span>{anyOpen ? "View Active Openings & Apply" : "Recruitment Status (Closed)"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </section>

        {/* =========================================================================
            B. THE TWO OPENINGS SECTION
        ========================================================================= */}
        <section ref={openingsRef} id="openings" className="px-6 pt-12 pb-24 max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-[#777777] block mb-2">
              2026 Recruitment Cohort
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-black">
              {anyOpen ? "Career Tracks & Positions" : "Recruitment Window Closed"}
            </h2>
            <p className="mt-2 text-sm text-[#666666]">
              {anyOpen
                ? "Discover active career tracks and submit your candidate application."
                : "Applications for the current recruitment cycle are currently paused."}
            </p>
            {anyOpen && (
              <div className="mt-6 inline-flex items-center gap-3 px-5 py-3 rounded-full border border-emerald-500/30 bg-emerald-50 text-emerald-900 text-xs text-left max-w-xl mx-auto shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                <span>
                  <strong>Official Recruitment Open:</strong> Applications are actively being accepted for open intake tracks. Fill the multi-step form to lodge your candidacy.
                </span>
              </div>
            )}
          </div>

          {/* Dynamic Active Roles: Closed roles are completely hidden */}
          {formConfig === null ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-mono text-[#777777]">Checking live cohort status...</span>
            </div>
          ) : anyOpen ? (
            <div className={onlyOneOpen ? "max-w-2xl mx-auto" : "grid grid-cols-1 md:grid-cols-2 gap-8"}>
              {/* ─── ROLE 1: B.TECH (MACHINE LEARNING) ─── */}
              {btechOpen && (
                <div
                  id="btech"
                  className="relative p-8 sm:p-9 rounded-2xl border border-[#E5E5E5] bg-white hover:border-black/40 transition-all duration-300 shadow-[0_2px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between"
                >
                  <div>
                    {/* Tags row */}
                    <div className="flex flex-wrap items-center gap-2 mb-5">
                      <span className="px-3 py-1 rounded-full bg-[#111111] text-white text-[11px] font-semibold tracking-wide">
                        B.Tech
                      </span>
                      <span className="px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-50 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Applications Open
                      </span>
                      <span className="px-3 py-1 rounded-full border border-[#E5E5E5] bg-[#FBFBFA] text-[#444444] text-[11px] font-medium">
                        Machine Learning
                      </span>
                      <span className="px-3 py-1 rounded-full border border-[#E5E5E5] bg-[#FBFBFA] text-[#444444] text-[11px] font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#666666]" />
                        Hyderabad
                      </span>
                    </div>

                    {/* Role Title */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F5F5F5] border border-[#EAEAEA] flex items-center justify-center shrink-0 mt-0.5">
                        <BrainCircuit className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-medium tracking-tight text-black">
                          Machine Learning Engineer
                        </h3>
                        <p className="text-xs text-[#777777] mt-0.5">
                          Core AI &amp; Foundation Model Architecture
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-[#444444] leading-relaxed mt-4">
                      Work directly on Mentneo&apos;s proprietary foundation models, real-time voice synthesis kernels,
                      agentic reasoning systems, and high-performance inference pipelines.
                    </p>

                    {/* Key Skills Tags */}
                    <div className="mt-6">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#888888] block mb-2">
                        Key Technical Focus
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          "Python",
                          "PyTorch",
                          "Transformers",
                          "LLM Fine-Tuning",
                          "Vector Databases",
                          "TensorRT",
                          "CUDA",
                          "Model Quantization",
                        ].map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 rounded-md bg-[#F7F7F7] border border-[#EBEBEB] text-[11px] text-[#333333]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Candidate Requirements */}
                    <div className="mt-6 pt-5 border-t border-[#EAEAEA] space-y-2 text-xs text-[#555555]">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
                        <span>Graduating B.Tech / B.E (CSE, AI/ML, Data Science, ECE &amp; allied)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
                        <span>Full-time in-person role at Mentneo Labs, Hyderabad</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-8 pt-4">
                    <Link
                      href="/career/apply/btech"
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-[#222222] transition-all shadow-sm"
                    >
                      <span>Apply for Machine Learning Engineer</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}

              {/* ─── ROLE 2: MBA (MANAGEMENT & OPERATIONS) ─── */}
              {mbaOpen && (
                <div
                  id="mba"
                  className="relative p-8 sm:p-9 rounded-2xl border border-[#E5E5E5] bg-white hover:border-black/40 transition-all duration-300 shadow-[0_2px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between"
                >
                  <div>
                    {/* Tags row */}
                    <div className="flex flex-wrap items-center gap-2 mb-5">
                      <span className="px-3 py-1 rounded-full bg-[#111111] text-white text-[11px] font-semibold tracking-wide">
                        MBA
                      </span>
                      <span className="px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-50 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Applications Open
                      </span>
                      <span className="px-3 py-1 rounded-full border border-[#E5E5E5] bg-[#FBFBFA] text-[#444444] text-[11px] font-medium">
                        Management &amp; Growth
                      </span>
                      <span className="px-3 py-1 rounded-full border border-[#E5E5E5] bg-[#FBFBFA] text-[#444444] text-[11px] font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#666666]" />
                        Hyderabad
                      </span>
                    </div>

                    {/* Role Title */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F5F5F5] border border-[#EAEAEA] flex items-center justify-center shrink-0 mt-0.5">
                        <Briefcase className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-medium tracking-tight text-black">
                          Management &amp; Business Operations
                        </h3>
                        <p className="text-xs text-[#777777] mt-0.5">
                          Enterprise Strategy &amp; GTM Scaling
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-[#444444] leading-relaxed mt-4">
                      Lead commercial expansion, enterprise client engagements, institutional partnerships,
                      and strategic operational scale for Mentneo&apos;s sovereign artificial intelligence products.
                    </p>

                    {/* Key Skills Tags */}
                    <div className="mt-6">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#888888] block mb-2">
                        Key Focus Areas
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          "Enterprise Strategy",
                          "Corporate Partnerships",
                          "Growth Operations",
                          "B2B Commercials",
                          "Market Intelligence",
                          "Client Engagements",
                          "Business Analytics",
                        ].map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 rounded-md bg-[#F7F7F7] border border-[#EBEBEB] text-[11px] text-[#333333]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Candidate Requirements */}
                    <div className="mt-6 pt-5 border-t border-[#EAEAEA] space-y-2 text-xs text-[#555555]">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
                        <span>Graduating MBA / PGDM (Marketing, Strategy, Operations, General Mgmt)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
                        <span>Full-time in-person role at Mentneo Labs, Hyderabad</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-8 pt-4">
                    <Link
                      href="/career/apply/mba"
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-[#222222] transition-all shadow-sm"
                    >
                      <span>Apply for Management &amp; Business Operations</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ─── ALL APPLICATIONS CLOSED STATE ─── */
            <div className="max-w-xl mx-auto p-10 rounded-3xl border border-[#E5E5E5] bg-[#FAFAFA] text-center space-y-6 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-white border border-[#E5E5E5] flex items-center justify-center mx-auto text-[#111111] shadow-xs">
                <Lock className="w-7 h-7 text-[#111111]" />
              </div>
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-50 text-amber-800 text-[11px] font-mono uppercase tracking-wider font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Intake Paused
                </span>
                <h3 className="text-2xl sm:text-3xl font-normal tracking-tight text-[#111111]">
                  Applications Are Currently Closed
                </h3>
                <p className="text-sm text-[#666666] max-w-md mx-auto leading-relaxed">
                  Candidate registrations are currently paused for all roles. All existing submitted applications are securely encrypted and recorded in our candidate registry.
                </p>
              </div>
              <div className="pt-4 border-t border-[#EAEAEA] flex items-center justify-center gap-2 text-xs font-mono text-[#777777]">
                <span>Recruitment Telemetry:</span>
                <a href="mailto:research@mentneo.ai" className="text-black hover:underline font-sans font-medium">
                  research@mentneo.ai
                </a>
              </div>
            </div>
          )}
        </section>

        {/* =========================================================================
            C. APPLICATION PROCESS — CLEAN & SIMPLE
        ========================================================================= */}
        <section className="px-6 py-12 border-t border-[#EAEAEA] max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-xl font-medium text-black">How We Review &amp; Hire</h3>
            <p className="text-xs text-[#666666] mt-1">
              Direct, deterministic application process with fast feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-[#EAEAEA] bg-[#FAFAFA]">
              <span className="text-xs font-mono text-[#888888] block mb-2">STEP 01</span>
              <h4 className="text-sm font-medium text-black">Submit Profile &amp; Resume PDF</h4>
              <p className="text-xs text-[#666666] mt-1.5 leading-relaxed">
                Complete the dedicated application form and upload your resume. You will receive an immediate application reference code.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#EAEAEA] bg-[#FAFAFA]">
              <span className="text-xs font-mono text-[#888888] block mb-2">STEP 02</span>
              <h4 className="text-sm font-medium text-black">Technical / Strategy Discussion</h4>
              <p className="text-xs text-[#666666] mt-1.5 leading-relaxed">
                Shortlisted applicants are invited for an engineering code discussion (B.Tech) or strategic case review (MBA) with team leads.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#EAEAEA] bg-[#FAFAFA]">
              <span className="text-xs font-mono text-[#888888] block mb-2">STEP 03</span>
              <h4 className="text-sm font-medium text-black">Offer &amp; Laboratory Onboarding</h4>
              <p className="text-xs text-[#666666] mt-1.5 leading-relaxed">
                Selected candidates receive formal offer letters and join our research lab cohort in Hyderabad.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Clean White Career Footer */}
      <CareerFooter />
    </div>
  );
}
