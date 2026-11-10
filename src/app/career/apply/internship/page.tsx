"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";
import {
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  X,
  GraduationCap,
  Brain,
} from "lucide-react";

export default function InternshipApplyPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    collegeName: "",
    graduationYear: "2026",
    interestedDomain: "AI & Foundation Models",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ reference: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim()) errs.fullName = "Full name is required.";
    if (!formData.email.trim()) {
      errs.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }
    if (!formData.mobile.trim()) {
      errs.mobile = "Mobile number is required.";
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/career/apply/internship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to register interest");
      }

      setResult({ reference: json.reference });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      setErrors({ form: (err as Error).message || "Failed to lodge notification request." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0B0C0E] flex flex-col justify-between selection:bg-[#0B0C0E] selection:text-white">
      {/* Top Header */}
      <header className="border-b border-[#E9E7E1] py-4 px-6 bg-white sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/career" className="flex items-center gap-2 group">
            <Logo variant="light" size="sm" showWordmark={true} showTagline={false} />
            <span className="hidden sm:inline-block pl-3 border-l border-[#E9E7E1] text-[11px] font-mono uppercase text-[#737883]">
              Internship &amp; Training 2026
            </span>
          </Link>

          <Link
            href="/career"
            className="text-xs font-mono text-[#737883] hover:text-[#0B0C0E] flex items-center gap-1.5 transition-colors"
          >
            <span>Back to Opportunities</span>
            <X className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12">
        {result ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12 text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center mx-auto text-2xl border border-[#10B981]/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-wide text-[#10B981] font-semibold">
                Priority Notification Registered
              </span>
              <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#0B0C0E]">
                We have registered your details
              </h1>
              <p className="text-sm text-[#4A4E57] max-w-lg mx-auto leading-relaxed">
                As soon as the 2026 Internship &amp; Training cohort applications officially launch,
                you will receive direct notification with priority screening access.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[#E9E7E1] bg-[#FAFAFA] max-w-md mx-auto text-center space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#737883]">
                Priority Registration Code
              </span>
              <div className="font-mono text-2xl font-bold tracking-wider text-[#2F5BFF]">
                {result.reference}
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <Link
                href="/career"
                className="px-6 py-3 rounded-full bg-[#0B0C0E] text-white text-xs font-semibold hover:bg-black transition-colors"
              >
                Return to Career Portal
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-10">
            {/* Header Badge */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2F5BFF]/30 bg-[#2F5BFF]/[0.06]">
                <Clock className="w-3.5 h-3.5 text-[#2F5BFF]" />
                <span className="font-mono text-xs uppercase tracking-wide text-[#2F5BFF] font-semibold">
                  APPLICATIONS OPENING SOON · 2026 COHORT
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-normal tracking-tight text-[#0B0C0E]">
                Internship &amp; Training Program
              </h1>
              <p className="text-base text-[#4A4E57] leading-relaxed">
                Build your career with MENTNEO through practical industry exposure, professional
                training, and real-world business experience.
              </p>
            </div>

            {/* Program Overview Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl border border-[#E9E7E1] bg-[#FAFAFA] space-y-2">
                <Brain className="w-5 h-5 text-[#2F5BFF]" />
                <h4 className="text-sm font-semibold text-[#0B0C0E]">Real AI Engineering</h4>
                <p className="text-xs text-[#737883] leading-relaxed">
                  Direct hands-on code contributions to foundation model runtimes and sovereign architectures.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-[#E9E7E1] bg-[#FAFAFA] space-y-2">
                <GraduationCap className="w-5 h-5 text-[#2F5BFF]" />
                <h4 className="text-sm font-semibold text-[#0B0C0E]">Research Mentorship</h4>
                <p className="text-xs text-[#737883] leading-relaxed">
                  1-on-1 guidance from Mentneo senior research fellows and systems architects.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-[#E9E7E1] bg-[#FAFAFA] space-y-2">
                <Sparkles className="w-5 h-5 text-[#2F5BFF]" />
                <h4 className="text-sm font-semibold text-[#0B0C0E]">PPO Conversion</h4>
                <p className="text-xs text-[#737883] leading-relaxed">
                  High-performing interns are fast-tracked into full-time engineering and commercial roles.
                </p>
              </div>
            </div>

            {/* Early Notification Registration Form */}
            <div className="p-8 rounded-3xl border border-[#E9E7E1] bg-[#FAFAFA] space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-[#0B0C0E]">
                  Register for Early Application Notification
                </h3>
                <p className="text-xs text-[#737883]">
                  Receive an automated alert and priority application slot the moment batch dates are announced.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wide text-[#4A4E57] mb-1.5">
                    Full Name <span className="text-[#2F5BFF]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Ananya Sen"
                    className="w-full px-4 py-3 rounded-xl border border-[#E9E7E1] bg-white text-sm text-[#0B0C0E] focus:outline-none focus:border-[#0B0C0E]"
                  />
                  {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wide text-[#4A4E57] mb-1.5">
                      Email Address <span className="text-[#2F5BFF]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ananya@college.edu"
                      className="w-full px-4 py-3 rounded-xl border border-[#E9E7E1] bg-white text-sm text-[#0B0C0E] focus:outline-none focus:border-[#0B0C0E] font-mono text-xs"
                    />
                    {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wide text-[#4A4E57] mb-1.5">
                      Mobile Number <span className="text-[#2F5BFF]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl border border-[#E9E7E1] bg-white text-sm text-[#0B0C0E] focus:outline-none focus:border-[#0B0C0E] font-mono text-xs"
                    />
                    {errors.mobile && <p className="text-[11px] text-red-500 mt-1">{errors.mobile}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wide text-[#4A4E57] mb-1.5">
                      College / University Name
                    </label>
                    <input
                      type="text"
                      value={formData.collegeName}
                      onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                      placeholder="e.g. IIT Hyderabad / BITS / VIT"
                      className="w-full px-4 py-3 rounded-xl border border-[#E9E7E1] bg-white text-sm text-[#0B0C0E] focus:outline-none focus:border-[#0B0C0E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wide text-[#4A4E57] mb-1.5">
                      Graduation Year
                    </label>
                    <select
                      value={formData.graduationYear}
                      onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E9E7E1] bg-white text-sm text-[#0B0C0E] focus:outline-none focus:border-[#0B0C0E] font-mono text-xs"
                    >
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                      <option value="2025">2025</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wide text-[#4A4E57] mb-1.5">
                    Preferred Domain of Interest
                  </label>
                  <select
                    value={formData.interestedDomain}
                    onChange={(e) => setFormData({ ...formData, interestedDomain: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E9E7E1] bg-white text-sm text-[#0B0C0E] focus:outline-none focus:border-[#0B0C0E]"
                  >
                    <option value="AI & Foundation Models">AI &amp; Foundation Models (PyTorch, Transformers)</option>
                    <option value="Full-Stack & Cloud Systems">Full-Stack &amp; Cloud Systems (Next.js, Node, Go)</option>
                    <option value="Neuromorphic Hardware & Embedded">Neuromorphic Hardware &amp; Embedded (VLSI, C++)</option>
                    <option value="Product Growth & Business Operations">Product Growth &amp; Business Operations (MBA Track)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wide text-[#4A4E57] mb-1.5">
                    Questions or Areas of Passion <span className="text-[#737883]">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Tell us what you are building or exploring..."
                    className="w-full px-4 py-3 rounded-xl border border-[#E9E7E1] bg-white text-sm text-[#0B0C0E] focus:outline-none focus:border-[#0B0C0E] resize-none"
                  />
                </div>

                {errors.form && (
                  <div className="p-3 rounded-xl border border-red-200 bg-red-50 text-xs text-red-600 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errors.form}</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl bg-[#0B0C0E] text-white text-xs font-semibold hover:bg-black transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <span>Submitting Registration...</span>
                    ) : (
                      <>
                        <span>Register for Notification &amp; Priority Slot</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <footer className="py-4 border-t border-[#E9E7E1] text-center font-mono text-[11px] text-[#737883]">
        MENTNEO RECRUITMENT PORTAL · STRICTLY ENCRYPTED CLOUD TRANSMIT
      </footer>
    </div>
  );
}
