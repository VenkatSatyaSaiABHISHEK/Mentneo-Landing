"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import CareerNavbar from "@/components/career/CareerNavbar";
import CareerFooter from "@/components/career/CareerFooter";
import { ArrowRight, BrainCircuit, Briefcase, MapPin, CheckCircle2 } from "lucide-react";

export default function CareerPortalPage() {
  const openingsRef = useRef<HTMLDivElement>(null);

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
      {/* Clean White Google/OpenAI Style Career Navbar */}
      <CareerNavbar />

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
              <span>View Roles (Applications Closed)</span>
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
              Career Tracks &amp; Positions
            </h2>
            <p className="mt-2 text-sm text-[#666666]">
              Applications for the 2026 hiring cycle are officially closed.
            </p>
            {/* Prominent Closed Notice Banner */}
            <div className="mt-6 inline-flex items-center gap-3 px-5 py-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 text-amber-900 text-xs text-left max-w-xl mx-auto shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 animate-pulse" />
              <span>
                <strong>Applications Window Closed:</strong> Both B.Tech ML and MBA candidate registrations have concluded. All submitted profiles are currently undergoing screening by the recruitment board.
              </span>
            </div>
          </div>

          {/* Exactly 2 Clean Cards Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* ─── ROLE 1: B.TECH (MACHINE LEARNING) ─── */}
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
                  <span className="px-3 py-1 rounded-full border border-amber-500/30 bg-amber-50 text-amber-800 text-[11px] font-semibold">
                    Applications Closed
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
                <div
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#F4F4F5] text-[#71717A] text-xs font-semibold cursor-not-allowed border border-[#E4E4E7]"
                >
                  <span>Applications Closed · 2026 Cohort</span>
                </div>
              </div>
            </div>

            {/* ─── ROLE 2: MBA (MANAGEMENT & OPERATIONS) ─── */}
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
                  <span className="px-3 py-1 rounded-full border border-amber-500/30 bg-amber-50 text-amber-800 text-[11px] font-semibold">
                    Applications Closed
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
                <div
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#F4F4F5] text-[#71717A] text-xs font-semibold cursor-not-allowed border border-[#E4E4E7]"
                >
                  <span>Applications Closed · 2026 Cohort</span>
                </div>
              </div>
            </div>
          </div>
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
