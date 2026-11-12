"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";
import { ArrowLeft, Lock, ArrowRight, ShieldCheck, Mail } from "lucide-react";

export default function BTechApplyClosedPage() {
  return (
    <div className="min-h-screen bg-white text-[#0B0C0E] flex flex-col justify-between selection:bg-[#0B0C0E] selection:text-white">
      {/* Top Header Bar */}
      <header className="border-b border-[#E9E7E1] py-4 px-6 bg-white sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/career" className="flex items-center gap-2 group">
            <Logo variant="light" size="sm" showWordmark={true} showTagline={false} />
            <span className="hidden sm:inline-block pl-3 border-l border-[#E9E7E1] text-[11px] font-mono uppercase text-[#737883]">
              BTech Hiring 2026
            </span>
          </Link>

          <Link
            href="/career"
            className="text-xs font-mono text-[#737883] hover:text-[#0B0C0E] flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Careers</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full text-center space-y-8"
        >
          {/* Icon Badge */}
          <div className="w-16 h-16 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] flex items-center justify-center mx-auto text-[#111111] shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <Lock className="w-7 h-7 text-[#111111]" />
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-50 text-amber-800 text-[11px] font-mono uppercase tracking-wider font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              2026 Cohort Closed
            </span>
            <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#0B0C0E]">
              B.Tech ML Applications Closed
            </h1>
            <p className="text-sm sm:text-base text-[#666666] max-w-lg mx-auto leading-relaxed">
              Applications for the <strong>Machine Learning Engineer (B.Tech 2026)</strong> track have officially reached deadline and are now closed.
            </p>
          </div>

          {/* Registry Status Card */}
          <div className="p-6 rounded-2xl border border-[#EAEAEA] bg-[#FAFAFA] text-left space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E5E5] flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-[#111111] font-mono">
                  Applied Candidates Information
                </h3>
                <p className="text-xs text-[#555555] leading-relaxed">
                  All submitted applications and resumes are securely stored in our sovereign candidate registry. The recruitment board is currently reviewing shortlisted candidates and will reach out directly via email with interview scheduling.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#EAEAEA] flex items-center justify-between text-xs text-[#777777] font-mono">
              <span>Recruitment Inquiries:</span>
              <a
                href="mailto:research@mentneo.ai"
                className="text-black hover:underline flex items-center gap-1 font-sans"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>research@mentneo.ai</span>
              </a>
            </div>
          </div>

          {/* Action Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/career"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-black text-white text-xs font-semibold hover:bg-[#222222] transition-colors"
            >
              <span>View Career Overview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#E5E5E5] bg-white text-[#111111] text-xs font-medium hover:border-black transition-colors"
            >
              <span>Back to Mentneo Homepage</span>
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E9E7E1] py-6 px-6 text-center text-xs font-mono text-[#8C92A4]">
        <span>© 2026 Mentneo Inc. Sovereign Machine Intelligence Labs · Hyderabad</span>
      </footer>
    </div>
  );
}
