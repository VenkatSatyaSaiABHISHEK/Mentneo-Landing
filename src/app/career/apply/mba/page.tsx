"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/ui/Logo";
import {
  ArrowLeft,
  ArrowRight,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";

interface MbaFormData {
  fullName: string;
  email: string;
  mobile: string;
  collegeName: string;
  collegeRollNumber: string;
  mbaSpecialization: string;
  currentCgpa: string;
  graduationYear: string;
  positions: string[];
  skillsStrengths: string;
  previousExperience: string;
  relocationWillingness: "Yes" | "No" | "";
  resume: File | null;
}

const INITIAL_FORM: MbaFormData = {
  fullName: "",
  email: "",
  mobile: "",
  collegeName: "",
  collegeRollNumber: "",
  mbaSpecialization: "Marketing",
  currentCgpa: "",
  graduationYear: "2026",
  positions: ["Management & Business Operations"],
  skillsStrengths: "",
  previousExperience: "",
  relocationWillingness: "",
  resume: null,
};

const MBA_POSITIONS = [
  {
    id: "mba-role",
    name: "Management & Business Operations",
    desc: "Enterprise client acquisitions, strategic partnerships, operational scale, and commercial execution.",
  },
];

const SPECIALIZATIONS = [
  "Marketing",
  "Finance",
  "Human Resources (HR)",
  "Business Analytics",
  "Operations",
  "Other",
];

const STEPS = [
  { number: "01", title: "Personal Details" },
  { number: "02", title: "Academic Background" },
  { number: "03", title: "Position Preferences" },
  { number: "04", title: "Skills & Experience" },
  { number: "05", title: "Relocation" },
  { number: "06", title: "Resume & Submit" },
];

export default function MbaApplyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<MbaFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    reference: string;
    submittedAt: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = <K extends keyof MbaFormData>(field: K, value: MbaFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const togglePosition = (name: string) => {
    setFormData((prev) => {
      const exists = prev.positions.includes(name);
      const nextPositions = exists
        ? prev.positions.filter((p) => p !== name)
        : [...prev.positions, name];
      return { ...prev, positions: nextPositions };
    });
    if (errors.positions) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.positions;
        return next;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) errs.fullName = "Full name is required.";
      if (!formData.email.trim()) {
        errs.email = "Email address is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        errs.email = "Please enter a valid email address.";
      }
      if (!formData.mobile.trim()) {
        errs.mobile = "Mobile number is required.";
      } else if (!/^[0-9+ -]{10,15}$/.test(formData.mobile.trim())) {
        errs.mobile = "Please enter a valid 10-digit mobile number.";
      }
      if (!formData.collegeName.trim()) {
        errs.collegeName = "College / Institution name is required.";
      }
      if (!formData.collegeRollNumber.trim()) {
        errs.collegeRollNumber = "College roll number is required.";
      }
    } else if (step === 2) {
      if (!formData.mbaSpecialization.trim()) {
        errs.mbaSpecialization = "MBA specialization is required.";
      }
      if (!formData.currentCgpa.trim()) {
        errs.currentCgpa = "Current CGPA or percentage is required.";
      }
      if (!formData.graduationYear.trim()) {
        errs.graduationYear = "Graduation year is required.";
      }
    } else if (step === 3) {
      if (formData.positions.length === 0) {
        errs.positions = "Please select at least one commercial role.";
      }
    } else if (step === 4) {
      if (!formData.skillsStrengths.trim()) {
        errs.skillsStrengths = "Please describe your core skills and strengths.";
      }
    } else if (step === 5) {
      if (!formData.relocationWillingness) {
        errs.relocationWillingness = "Please specify your willingness to relocate.";
      }
    } else if (step === 6) {
      if (!formData.resume) {
        errs.resume = "Please upload your resume in PDF format.";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        setErrors((prev) => ({ ...prev, resume: "Only PDF documents (.pdf) are accepted." }));
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, resume: "Resume file exceeds the 4 MB limit. Please upload a PDF under 4 MB." }));
        return;
      }
      updateField("resume", file);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(6)) return;

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("mobile", formData.mobile);
      data.append("collegeName", formData.collegeName);
      data.append("collegeRollNumber", formData.collegeRollNumber);
      data.append("mbaSpecialization", formData.mbaSpecialization);
      data.append("currentCgpa", formData.currentCgpa);
      data.append("graduationYear", formData.graduationYear);
      data.append("positions", JSON.stringify(formData.positions));
      data.append("skillsStrengths", formData.skillsStrengths);
      data.append("previousExperience", formData.previousExperience);
      data.append("relocationWillingness", formData.relocationWillingness);
      if (formData.resume) {
        data.append("resume", formData.resume);
      }

      const res = await fetch("/api/career/apply/mba", {
        method: "POST",
        body: data,
      });

      const rawText = await res.text();
      let json: { success?: boolean; error?: string; reference?: string; submittedAt?: string } = {};
      try {
        json = JSON.parse(rawText);
      } catch {
        if (res.status === 413 || rawText.includes("Request Entity Too Large")) {
          throw new Error("Your resume PDF is too large. Please upload a PDF under 4 MB.");
        }
        if (res.status >= 500) {
          throw new Error("Recruitment servers are currently processing high applicant volume. Please retry in a few seconds.");
        }
        throw new Error("Unable to complete submission. Please verify your connection and try again.");
      }

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to submit application");
      }

      setSubmissionResult({
        reference: json.reference || "MNT-2026-MB",
        submittedAt: json.submittedAt || new Date().toISOString(),
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      setErrors((prev) => ({
        ...prev,
        submit: (err as Error).message || "An unexpected error occurred while submitting.",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0B0C0E] flex flex-col justify-between selection:bg-[#0B0C0E] selection:text-white">
      {/* Top Header Bar */}
      <header className="border-b border-[#E9E7E1] py-4 px-6 bg-white sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/career" className="flex items-center gap-2 group">
            <Logo variant="light" size="sm" showWordmark={true} showTagline={false} />
            <span className="hidden sm:inline-block pl-3 border-l border-[#E9E7E1] text-[11px] font-mono uppercase text-[#737883]">
              MBA Hiring 2026
            </span>
          </Link>

          <Link
            href="/career"
            className="text-xs font-mono text-[#737883] hover:text-[#0B0C0E] flex items-center gap-1.5 transition-colors"
          >
            <span>Exit Application</span>
            <X className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10">
        {/* SUCCESS CONFIRMATION SCREEN */}
        {submissionResult ? (
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
                Application Successfully Lodged
              </span>
              <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#0B0C0E]">
                Thank you, {formData.fullName.split(" ")[0]}
              </h1>
              <p className="text-sm text-[#4A4E57] max-w-lg mx-auto leading-relaxed">
                Your application for MENTNEO MBA Hiring 2026 has been encrypted and recorded in our
                talent evaluation registry.
              </p>
            </div>

            {/* Reference Number Card */}
            <div className="p-6 rounded-2xl border border-[#E9E7E1] bg-[#FAFAFA] max-w-md mx-auto text-center space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#737883]">
                Application Reference Number
              </span>
              <div className="font-mono text-2xl font-bold tracking-wider text-[#2F5BFF]">
                {submissionResult.reference}
              </div>
              <p className="text-[11px] text-[#737883]">
                Please retain this reference code for all recruitment telemetry and communications.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[#E9E7E1] bg-white max-w-md mx-auto text-left text-xs text-[#4A4E57] space-y-2">
              <div className="font-semibold text-[#0B0C0E] pb-1 border-b border-[#E9E7E1]">
                Application Summary
              </div>
              <div className="flex justify-between">
                <span className="text-[#737883]">Category:</span>
                <span className="font-mono font-medium text-[#0B0C0E]">MBA Hiring 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737883]">Specialization:</span>
                <span className="font-medium text-[#0B0C0E]">{formData.mbaSpecialization}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737883]">Positions:</span>
                <span className="font-medium text-[#0B0C0E] text-right">
                  {formData.positions.join(", ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737883]">College:</span>
                <span className="text-[#0B0C0E]">{formData.collegeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737883]">Submitted At:</span>
                <span className="font-mono text-[#0B0C0E]">
                  {new Date(submissionResult.submittedAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-4 flex justify-center gap-4">
              <Link
                href="/career"
                className="px-6 py-3 rounded-full bg-[#0B0C0E] text-white text-xs font-semibold hover:bg-black transition-colors"
              >
                Return to Career Portal
              </Link>
            </div>
          </motion.div>
        ) : (
          <div>
            {/* Progress Milestone Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs font-mono text-[#737883] mb-2">
                <span className="font-semibold text-[#0B0C0E]">
                  STEP {STEPS[currentStep - 1].number} / 06
                </span>
                <span>{STEPS[currentStep - 1].title}</span>
              </div>

              {/* Progress Track */}
              <div className="w-full h-1.5 bg-[#F0EFEB] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#0B0C0E]"
                  initial={false}
                  animate={{ width: `${(currentStep / 6) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Step Title & Subtitle */}
              <div className="mt-6">
                <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-[#0B0C0E]">
                  {STEPS[currentStep - 1].title}
                </h2>
                <p className="text-xs text-[#737883] mt-1">
                  {currentStep === 1 && "Enter your identity, college affiliation, and contact details."}
                  {currentStep === 2 && "Specify your MBA specialization and academic metrics."}
                  {currentStep === 3 && "Select the commercial positions you are applying for."}
                  {currentStep === 4 && "Highlight your business acumen, strengths, and internship experience."}
                  {currentStep === 5 && "Confirm location and operational availability."}
                  {currentStep === 6 && "Attach your resume in PDF format and review information."}
                </p>
              </div>
            </div>

            {/* FORM CONTAINER */}
            <div className="min-h-[360px]">
              <AnimatePresence mode="wait">
                {/* STEP 1: Personal Details */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wide text-[#4A4E57] mb-1.5">
                        Full Name <span className="text-[#2F5BFF]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => updateField("fullName", e.target.value)}
                        placeholder="e.g. Rahul Varma"
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.fullName ? "border-red-500 bg-red-50/20" : "border-[#E9E7E1] bg-[#FAFAFA]"
                        } text-sm text-[#0B0C0E] focus:outline-none focus:border-[#0B0C0E] focus:bg-white transition-all`}
                      />
                      {errors.fullName && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wide text-[#4A4E57] mb-1.5">
                          Email Address <span className="text-[#2F5BFF]">*</span>
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          placeholder="rahul.v@bschool.edu or gmail"
                          className={`w-full px-4 py-3 rounded-xl border ${
                            errors.email ? "border-red-500 bg-red-50/20" : "border-[#E9E7E1] bg-[#FAFAFA]"
                          } text-sm text-[#0B0C0E] focus:outline-none focus:border-[#0B0C0E] focus:bg-white transition-all font-mono text-xs`}
                        />
                        {errors.email && (
                          <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wide text-[#4A4E57] mb-1.5">
                          Mobile Number <span className="text-[#2F5BFF]">*</span>
                        </label>
                        <input
                          type="tel"
                          value={formData.mobile}
                          onChange={(e) => updateField("mobile", e.target.value)}
                          placeholder="e.g. +91 98765 43210"
                          className={`w-full px-4 py-3 rounded-xl border ${
                            errors.mobile ? "border-red-500 bg-red-50/20" : "border-[#E9E7E1] bg-[#FAFAFA]"
                          } text-sm text-[#0B0C0E] focus:outline-none focus:border-[#0B0C0E] focus:bg-white transition-all font-mono text-xs`}
                        />
                        {errors.mobile && (
                          <p className="text-[11px] text-red-500 mt-1">{errors.mobile}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wide text-[#4A4E57] mb-1.5">
                          College / Business School Name <span className="text-[#2F5BFF]">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.collegeName}
                          onChange={(e) => updateField("collegeName", e.target.value)}
                          placeholder="e.g. Symbiosis / NMIMS / IIM"
                          className={`w-full px-4 py-3 rounded-xl border ${
                            errors.collegeName ? "border-red-500 bg-red-50/20" : "border-[#E9E7E1] bg-[#FAFAFA]"
                          } text-sm text-[#0B0C0E] focus:outline-none focus:border-[#0B0C0E] focus:bg-white transition-all`}
                        />
                        {errors.collegeName && (
                          <p className="text-[11px] text-red-500 mt-1">{errors.collegeName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wide text-[#4A4E57] mb-1.5">
                          College Roll Number <span className="text-[#2F5BFF]">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.collegeRollNumber}
                          onChange={(e) => updateField("collegeRollNumber", e.target.value)}
                          placeholder="e.g. MBA24MKT082"
                          className={`w-full px-4 py-3 rounded-xl border ${
                            errors.collegeRollNumber ? "border-red-500 bg-red-50/20" : "border-[#E9E7E1] bg-[#FAFAFA]"
                          } text-sm text-[#0B0C0E] focus:outline-none focus:border-[#0B0C0E] focus:bg-white transition-all font-mono text-xs uppercase`}
                        />
                        {errors.collegeRollNumber && (
                          <p className="text-[11px] text-red-500 mt-1">{errors.collegeRollNumber}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Academic Background */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wide text-[#4A4E57] mb-1.5">
                        MBA Specialization <span className="text-[#2F5BFF]">*</span>
                      </label>
                      <select
                        value={formData.mbaSpecialization}
                        onChange={(e) => updateField("mbaSpecialization", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#E9E7E1] bg-[#FAFAFA] text-sm text-[#0B0C0E] focus:outline-none focus:border-[#0B0C0E] focus:bg-white transition-all font-sans"
                      >
                        {SPECIALIZATIONS.map((spec) => (
                          <option key={spec} value={spec}>
                            {spec}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wide text-[#4A4E57] mb-1.5">
                          Current CGPA or Percentage <span className="text-[#2F5BFF]">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.currentCgpa}
                          onChange={(e) => updateField("currentCgpa", e.target.value)}
                          placeholder="e.g. 8.2 CGPA or 78%"
                          className={`w-full px-4 py-3 rounded-xl border ${
                            errors.currentCgpa ? "border-red-500 bg-red-50/20" : "border-[#E9E7E1] bg-[#FAFAFA]"
                          } text-sm text-[#0B0C0E] focus:outline-none focus:border-[#0B0C0E] focus:bg-white transition-all font-mono text-xs`}
                        />
                        {errors.currentCgpa && (
                          <p className="text-[11px] text-red-500 mt-1">{errors.currentCgpa}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wide text-[#4A4E57] mb-1.5">
                          Graduation Year <span className="text-[#2F5BFF]">*</span>
                        </label>
                        <select
                          value={formData.graduationYear}
                          onChange={(e) => updateField("graduationYear", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-[#E9E7E1] bg-[#FAFAFA] text-sm text-[#0B0C0E] focus:outline-none focus:border-[#0B0C0E] focus:bg-white transition-all font-mono text-xs"
                        >
                          <option value="2026">2026 (Batch of 2026)</option>
                          <option value="2025">2025 (Batch of 2025)</option>
                          <option value="2027">2027 (First Year)</option>
                          <option value="2024">2024 (Prior Graduate)</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Position Preferences */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <p className="text-xs text-[#737883]">
                      Select the business roles that align with your career goals. Multiple selections are permitted.
                    </p>

                    <div className="space-y-3">
                      {MBA_POSITIONS.map((pos) => {
                        const isSelected = formData.positions.includes(pos.name);
                        return (
                          <div
                            key={pos.id}
                            onClick={() => togglePosition(pos.name)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                              isSelected
                                ? "border-[#0B0C0E] bg-[#FAFAFA] shadow-sm"
                                : "border-[#E9E7E1] bg-white hover:border-[#0B0C0E]/30"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <h4 className="text-sm font-semibold text-[#0B0C0E]">{pos.name}</h4>
                                <p className="text-xs text-[#737883]">{pos.desc}</p>
                              </div>
                              <div
                                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                                  isSelected
                                    ? "bg-[#0B0C0E] border-[#0B0C0E] text-white"
                                    : "border-[#D1D5DB] bg-white"
                                }`}
                              >
                                {isSelected && <span className="text-xs">✓</span>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {errors.positions && (
                      <p className="text-[11px] text-red-500 mt-2">{errors.positions}</p>
                    )}
                  </motion.div>
                )}

                {/* STEP 4: Skills & Experience */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wide text-[#4A4E57] mb-1.5">
                        Skills &amp; Strengths <span className="text-[#2F5BFF]">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={formData.skillsStrengths}
                        onChange={(e) => updateField("skillsStrengths", e.target.value)}
                        placeholder="e.g. B2B SaaS Sales, Financial Modeling, Hubspot CRM, Negotiation, Market Research, Communication"
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.skillsStrengths
                            ? "border-red-500 bg-red-50/20"
                            : "border-[#E9E7E1] bg-[#FAFAFA]"
                        } text-sm text-[#0B0C0E] focus:outline-none focus:border-[#0B0C0E] focus:bg-white transition-all font-sans resize-none`}
                      />
                      {errors.skillsStrengths && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.skillsStrengths}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wide text-[#4A4E57] mb-1.5">
                        Previous Internship / Work Experience <span className="text-[#737883]">(optional)</span>
                      </label>
                      <textarea
                        rows={3}
                        value={formData.previousExperience}
                        onChange={(e) => updateField("previousExperience", e.target.value)}
                        placeholder="e.g. Summer Internship at HDFC Bank (2 months), Corporate Sales Executive at Startup (1 year)"
                        className="w-full px-4 py-3 rounded-xl border border-[#E9E7E1] bg-[#FAFAFA] text-sm text-[#0B0C0E] focus:outline-none focus:border-[#0B0C0E] focus:bg-white transition-all font-sans resize-none"
                      />
                    </div>
                  </motion.div>
                )}

                {/* STEP 5: Relocation */}
                {currentStep === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div className="p-6 rounded-2xl border border-[#E9E7E1] bg-[#FAFAFA] space-y-4">
                      <div>
                        <h4 className="text-base font-medium text-[#0B0C0E]">
                          Are you willing to relocate to Hyderabad? <span className="text-[#2F5BFF]">*</span>
                        </h4>
                        <p className="text-xs text-[#737883] mt-1">
                          Our business leadership, marketing, and sales operations headquarters are stationed in Hyderabad, India.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        {(["Yes", "No"] as const).map((option) => {
                          const isSelected = formData.relocationWillingness === option;
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => updateField("relocationWillingness", option)}
                              className={`py-3.5 px-4 rounded-xl border text-sm font-semibold transition-all ${
                                isSelected
                                  ? "bg-[#0B0C0E] text-white border-[#0B0C0E] shadow-sm"
                                  : "bg-white text-[#4A4E57] border-[#E9E7E1] hover:border-[#0B0C0E]/30"
                              }`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>

                      {errors.relocationWillingness && (
                        <p className="text-[11px] text-red-500">{errors.relocationWillingness}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* STEP 6: Resume & Review */}
                {currentStep === 6 && (
                  <motion.div
                    key="step6"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    {/* Resume Upload Box */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wide text-[#4A4E57] mb-2">
                        Upload Resume (PDF ONLY) <span className="text-[#2F5BFF]">*</span>
                      </label>

                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".pdf,application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />

                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed cursor-pointer text-center transition-all ${
                          formData.resume
                            ? "border-[#10B981] bg-[#10B981]/[0.02]"
                            : errors.resume
                            ? "border-red-400 bg-red-50/20"
                            : "border-[#E9E7E1] bg-[#FAFAFA] hover:border-[#0B0C0E]/30 hover:bg-white"
                        }`}
                      >
                        {formData.resume ? (
                          <div className="flex items-center justify-center gap-3">
                            <FileText className="w-8 h-8 text-[#10B981]" />
                            <div className="text-left">
                              <span className="text-sm font-semibold text-[#0B0C0E] block">
                                {formData.resume.name}
                              </span>
                              <span className="font-mono text-xs text-[#737883]">
                                {(formData.resume.size / (1024 * 1024)).toFixed(2)} MB · PDF
                              </span>
                            </div>
                            <span className="ml-4 text-xs font-mono text-[#2F5BFF] underline">
                              Change file
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <UploadCloud className="w-8 h-8 text-[#737883] mx-auto" />
                            <div className="text-xs font-medium text-[#0B0C0E]">
                              Click to browse or drop your PDF resume here
                            </div>
                            <p className="text-[11px] text-[#737883] font-mono">
                              PDF only · Maximum file size 4 MB
                            </p>
                          </div>
                        )}
                      </div>

                      {errors.resume && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.resume}</p>
                      )}
                    </div>

                    {/* Information Review Card */}
                    <div className="p-5 rounded-2xl border border-[#E9E7E1] bg-[#FAFAFA] space-y-3 text-xs">
                      <div className="font-semibold text-[#0B0C0E] pb-2 border-b border-[#E9E7E1] flex justify-between items-center">
                        <span>Review Information</span>
                        <span className="font-mono text-[10px] text-[#737883]">MBA Hiring 2026</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[#4A4E57]">
                        <div>
                          <span className="text-[#737883] block">Candidate:</span>
                          <span className="font-medium text-[#0B0C0E]">{formData.fullName}</span>
                        </div>
                        <div>
                          <span className="text-[#737883] block">College / Roll:</span>
                          <span className="font-medium text-[#0B0C0E]">
                            {formData.collegeName} ({formData.collegeRollNumber})
                          </span>
                        </div>
                        <div>
                          <span className="text-[#737883] block">Email:</span>
                          <span className="font-mono text-[#0B0C0E]">{formData.email}</span>
                        </div>
                        <div>
                          <span className="text-[#737883] block">Mobile:</span>
                          <span className="font-mono text-[#0B0C0E]">{formData.mobile}</span>
                        </div>
                        <div>
                          <span className="text-[#737883] block">Specialization &amp; CGPA:</span>
                          <span className="font-medium text-[#0B0C0E]">
                            {formData.mbaSpecialization} ({formData.currentCgpa})
                          </span>
                        </div>
                        <div>
                          <span className="text-[#737883] block">Graduation Year:</span>
                          <span className="font-mono text-[#0B0C0E]">{formData.graduationYear}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#E9E7E1]/80">
                        <span className="text-[#737883] block mb-1">Target Positions:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {formData.positions.map((p, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-white border border-[#E9E7E1] text-[10px] font-medium text-[#0B0C0E]"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#E9E7E1]/80 flex justify-between">
                        <span className="text-[#737883]">Willing to relocate to Hyderabad:</span>
                        <span className="font-semibold text-[#0B0C0E]">
                          {formData.relocationWillingness}
                        </span>
                      </div>
                    </div>

                    {errors.submit && (
                      <div className="p-3.5 rounded-xl border border-red-200 bg-red-50 text-xs text-red-600 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errors.submit}</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Step Navigation Controls */}
            <div className="pt-8 border-t border-[#E9E7E1] flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E9E7E1] bg-white text-xs font-semibold text-[#4A4E57] hover:text-[#0B0C0E] hover:border-[#0B0C0E]/30 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0B0C0E] text-white text-xs font-semibold hover:bg-black transition-all shadow-sm"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex flex-col items-end gap-2">
                  {submitting && (
                    <p className="text-[11px] font-mono text-[#0B0C0E] animate-pulse">
                      Uploading resume &amp; syncing to recruitment cloud... Please do not refresh.
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#0B0C0E] text-white text-xs font-semibold hover:bg-black transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm &amp; Submit Application</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="py-4 border-t border-[#E9E7E1] text-center font-mono text-[11px] text-[#737883]">
        MENTNEO RECRUITMENT PORTAL · STRICTLY ENCRYPTED CLOUD TRANSMIT
      </footer>
    </div>
  );
}
