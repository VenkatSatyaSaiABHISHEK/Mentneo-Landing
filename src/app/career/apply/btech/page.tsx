"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Lock,
  ShieldCheck,
  Mail,
  X,
} from "lucide-react";

interface FormFieldConfig {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  step: number;
  enabled: boolean;
  required: boolean;
  options?: string[];
  isCustom?: boolean;
  helpText?: string;
}

interface RoleFormConfig {
  isOpen: boolean;
  roleId: string;
  roleTitle: string;
  headline: string;
  description: string;
  targetBinId: string;
  closedMessage: string;
  fields: FormFieldConfig[];
}

interface BTechFormData {
  fullName: string;
  email: string;
  mobile: string;
  collegeRollNumber: string;
  collegeName: string;
  branch: string;
  currentCgpa: string;
  graduationYear: string;
  positions: string[];
  technicalSkills: string;
  githubUrl: string;
  linkedinUrl: string;
  relocationWillingness: "Yes" | "No" | "";
  resume: File | null;
}

const INITIAL_FORM: BTechFormData = {
  fullName: "",
  email: "",
  mobile: "",
  collegeRollNumber: "",
  collegeName: "",
  branch: "",
  currentCgpa: "",
  graduationYear: "2026",
  positions: ["Machine Learning Engineer"],
  technicalSkills: "",
  githubUrl: "",
  linkedinUrl: "",
  relocationWillingness: "",
  resume: null,
};

const STEPS = [
  { step: 1, title: "Personal" },
  { step: 2, title: "Academics" },
  { step: 3, title: "Position" },
  { step: 4, title: "Skills" },
  { step: 5, title: "Relocation" },
  { step: 6, title: "Custom Questions" },
  { step: 7, title: "Resume & Submit" },
];

export default function BTechApplyDynamicPage() {
  const [config, setConfig] = useState<RoleFormConfig | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BTechFormData>(INITIAL_FORM);
  const [customFields, setCustomFields] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [stepError, setStepError] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    reference: string;
    submittedAt: string;
    cohortName?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load live form configuration
  useEffect(() => {
    async function fetchConfig() {
      try {
        setLoadingConfig(true);
        const res = await fetch(`/api/career/form-config?role=btech&t=${Date.now()}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setConfig(json.data);
          }
        }
      } catch (err) {
        console.warn("Failed to load form config:", err);
      } finally {
        setLoadingConfig(false);
      }
    }
    fetchConfig();
  }, []);

  const getFieldConfig = (id: string): FormFieldConfig | undefined => {
    return config?.fields?.find((f) => f.id === id);
  };

  const isFieldEnabled = (id: string, defaultEnabled = true): boolean => {
    const f = getFieldConfig(id);
    if (!f) return defaultEnabled;
    return f.enabled !== false;
  };

  const isFieldRequired = (id: string, defaultRequired = false): boolean => {
    const f = getFieldConfig(id);
    if (!f) return defaultRequired;
    return f.required === true;
  };

  const updateField = <K extends keyof BTechFormData>(field: K, value: BTechFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    setStepError("");
  };

  const updateCustomField = (key: string, value: string) => {
    setCustomFields((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
    setStepError("");
  };

  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (isFieldEnabled("fullName") && isFieldRequired("fullName", true) && !formData.fullName.trim()) {
        errs.fullName = "Full legal name is mandatory to proceed.";
      }
      if (isFieldEnabled("email") && isFieldRequired("email", true)) {
        if (!formData.email.trim()) {
          errs.email = "Email address is mandatory to proceed.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
          errs.email = "Please enter a valid email address.";
        }
      }
      if (isFieldEnabled("mobile") && isFieldRequired("mobile", true)) {
        if (!formData.mobile.trim()) {
          errs.mobile = "Mobile number is mandatory to proceed.";
        } else if (!/^[0-9+ -]{10,15}$/.test(formData.mobile.trim())) {
          errs.mobile = "Please enter a valid mobile number.";
        }
      }
      if (isFieldEnabled("collegeRollNumber") && isFieldRequired("collegeRollNumber", true) && !formData.collegeRollNumber.trim()) {
        errs.collegeRollNumber = "College roll / registration number is mandatory to proceed.";
      }
    } else if (step === 2) {
      if (isFieldEnabled("branch") && isFieldRequired("branch", true) && !formData.branch.trim()) {
        errs.branch = "Engineering branch is mandatory to proceed.";
      }
      if (isFieldEnabled("collegeName") && isFieldRequired("collegeName", false) && !formData.collegeName.trim()) {
        errs.collegeName = "College name is mandatory to proceed.";
      }
      if (isFieldEnabled("currentCgpa") && isFieldRequired("currentCgpa", true) && !formData.currentCgpa.trim()) {
        errs.currentCgpa = "Current CGPA is mandatory to proceed.";
      }
      if (isFieldEnabled("graduationYear") && isFieldRequired("graduationYear", true) && !formData.graduationYear.trim()) {
        errs.graduationYear = "Graduation year is mandatory to proceed.";
      }
    } else if (step === 3) {
      if (isFieldEnabled("positions") && isFieldRequired("positions", true) && formData.positions.length === 0) {
        errs.positions = "Please select your target engineering track.";
      }
    } else if (step === 4) {
      if (isFieldEnabled("technicalSkills") && isFieldRequired("technicalSkills", true) && !formData.technicalSkills.trim()) {
        errs.technicalSkills = "Technical skills and framework competencies are mandatory to proceed.";
      }
      if (isFieldEnabled("githubUrl") && isFieldRequired("githubUrl", false) && !formData.githubUrl.trim()) {
        errs.githubUrl = "GitHub profile URL is mandatory to proceed.";
      }
      if (isFieldEnabled("linkedinUrl") && isFieldRequired("linkedinUrl", false) && !formData.linkedinUrl.trim()) {
        errs.linkedinUrl = "LinkedIn profile URL is mandatory to proceed.";
      }
    } else if (step === 5) {
      if (isFieldEnabled("relocationWillingness") && isFieldRequired("relocationWillingness", true) && !formData.relocationWillingness) {
        errs.relocationWillingness = "Please specify in-person relocation willingness to proceed.";
      }
    } else if (step === 6) {
      // Validate custom questions for step 6 (and any step)
      const stepCustomFields = config?.fields?.filter((f) => f.step === 6 && f.enabled !== false && f.required) || [];
      for (const cf of stepCustomFields) {
        if (!customFields[cf.id]?.trim()) {
          errs[cf.id] = `${cf.label} is mandatory to proceed.`;
        }
      }
    } else if (step === 7) {
      if (isFieldEnabled("resume") && isFieldRequired("resume", true) && !formData.resume) {
        errs.resume = "Curriculum Vitae / Resume PDF document is mandatory to proceed.";
      }
    }

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setStepError("Please complete all mandatory fields (* marked) before proceeding to the next step.");
      return false;
    }
    setStepError("");
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      // Check if step 6 has any fields; if not, skip step 6
      if (currentStep === 5) {
        const step6Fields = config?.fields?.filter((f) => f.step === 6 && f.enabled !== false) || [];
        if (step6Fields.length === 0) {
          setCurrentStep(7);
          return;
        }
      }
      setCurrentStep((prev) => Math.min(prev + 1, 7));
    }
  };

  const handleBack = () => {
    setStepError("");
    if (currentStep === 7) {
      const step6Fields = config?.fields?.filter((f) => f.step === 6 && f.enabled !== false) || [];
      if (step6Fields.length === 0) {
        setCurrentStep(5);
        return;
      }
    }
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setErrors((prev) => ({ ...prev, resume: "Please select a valid PDF file." }));
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, resume: "File size must be 4 MB or less." }));
      return;
    }

    updateField("resume", file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(7)) return;

    setSubmitting(true);
    setStepError("");

    try {
      const data = new FormData();
      data.append("fullName", formData.fullName.trim());
      data.append("email", formData.email.trim());
      data.append("mobile", formData.mobile.trim());
      data.append("collegeRollNumber", formData.collegeRollNumber.trim());
      data.append("collegeName", formData.collegeName.trim());
      data.append("branch", formData.branch.trim());
      data.append("currentCgpa", formData.currentCgpa.trim());
      data.append("graduationYear", formData.graduationYear.trim());
      data.append("positions", JSON.stringify(formData.positions));
      data.append("technicalSkills", formData.technicalSkills.trim());
      data.append("githubUrl", formData.githubUrl.trim());
      data.append("linkedinUrl", formData.linkedinUrl.trim());
      data.append("relocationWillingness", formData.relocationWillingness);
      data.append("customFields", JSON.stringify(customFields));

      if (formData.resume) {
        data.append("resume", formData.resume);
      }

      const res = await fetch("/api/career/apply/btech", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Submission failed. Please try again.");
      }

      setSubmissionResult({
        reference: json.data.reference,
        submittedAt: json.data.submittedAt,
        cohortName: json.data.cohortName,
      });
    } catch (err: unknown) {
      setStepError((err as Error).message || "An error occurred during submission.");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loadingConfig) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center gap-3 font-mono text-xs text-[#737883]">
          <Loader2 className="w-4 h-4 animate-spin text-[#2F5BFF]" />
          <span>INITIALIZING SECURE RECRUITMENT GATEWAY...</span>
        </div>
      </div>
    );
  }

  // Application closed notice
  if (!config?.isOpen) {
    return (
      <div className="min-h-screen bg-white text-[#0B0C0E] flex flex-col justify-between selection:bg-[#0B0C0E] selection:text-white">
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

        <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-16 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full text-center space-y-8"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] flex items-center justify-center mx-auto text-[#111111] shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <Lock className="w-7 h-7 text-[#111111]" />
            </div>

            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-50 text-amber-800 text-[11px] font-mono uppercase tracking-wider font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Applications Closed
              </span>
              <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#0B0C0E]">
                B.Tech ML Track Currently Closed
              </h1>
              <p className="text-sm sm:text-base text-[#666666] max-w-lg mx-auto leading-relaxed">
                {config?.closedMessage || "Applications for this cohort are currently closed. Please check back later."}
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[#EAEAEA] bg-[#FAFAFA] text-left space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E5E5] flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-[#111111] font-mono">
                    Candidate Submissions Safe &amp; Preserved
                  </h3>
                  <p className="text-xs text-[#555555] leading-relaxed">
                    All submitted applications are securely stored in our recruitment registry. Shortlisted candidates will be contacted directly via email.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#EAEAEA] flex items-center justify-between text-xs text-[#777777] font-mono">
                <span>Recruitment Inquiries:</span>
                <a href="mailto:research@mentneo.ai" className="text-black hover:underline flex items-center gap-1 font-sans">
                  <Mail className="w-3.5 h-3.5" />
                  <span>research@mentneo.ai</span>
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/career"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-black text-white text-xs font-semibold hover:bg-[#222222] transition-colors"
              >
                <span>View All Career Openings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // Application Success Confirmation Screen
  if (submissionResult) {
    return (
      <div className="min-h-screen bg-white text-[#0B0C0E] flex flex-col justify-between selection:bg-[#0B0C0E] selection:text-white">
        <header className="border-b border-[#E9E7E1] py-4 px-6 bg-white sticky top-0 z-30">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <Link href="/career" className="flex items-center gap-2">
              <Logo variant="light" size="sm" showWordmark={true} showTagline={false} />
              <span className="hidden sm:inline-block pl-3 border-l border-[#E9E7E1] text-[11px] font-mono uppercase text-[#737883]">
                BTech Hiring 2026
              </span>
            </Link>
            <Link
              href="/career"
              className="text-xs font-mono text-[#737883] hover:text-[#0B0C0E] flex items-center gap-1.5"
            >
              <span>Exit Application</span>
              <X className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        <main className="flex-1 max-w-xl w-full mx-auto px-6 py-16 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full text-center space-y-8"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-emerald-700 font-semibold block">
                Application Successfully Lodged
              </span>
              <h1 className="text-3xl font-semibold tracking-tight text-[#0B0C0E]">
                Thank you, {formData.fullName}
              </h1>
              <p className="text-sm text-[#737883] max-w-md mx-auto leading-relaxed">
                Your application for MENTNEO BTech Hiring 2026 has been encrypted and recorded in our candidate registry.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[#E9E7E1] bg-[#FAFAFA] space-y-4">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#737883] block">
                Application Reference Number
              </span>
              <div className="font-mono text-2xl font-bold tracking-wider text-[#2F5BFF] py-2 px-4 rounded-xl bg-white border border-[#E9E7E1] inline-block shadow-xs">
                {submissionResult.reference}
              </div>
              <p className="text-xs text-[#737883]">
                Please retain this reference code for all recruitment telemetry and communications.
              </p>
              {submissionResult.cohortName && (
                <div className="pt-2 text-[11px] font-mono text-[#737883]">
                  Assigned Intake Cycle: <strong>{submissionResult.cohortName}</strong>
                </div>
              )}
            </div>

            <div className="p-5 rounded-2xl border border-[#E9E7E1] bg-white text-left text-xs space-y-2">
              <span className="font-mono text-[10px] uppercase text-[#737883] block font-semibold">
                Application Summary
              </span>
              <div className="grid grid-cols-2 gap-2 text-[#737883]">
                <span>Category:</span>
                <span className="text-[#0B0C0E] font-medium">BTech Hiring 2026</span>
                <span>Positions:</span>
                <span className="text-[#0B0C0E] font-medium">{formData.positions.join(", ")}</span>
                <span>Email:</span>
                <span className="text-[#0B0C0E] font-mono">{formData.email}</span>
                <span>Graduation Batch:</span>
                <span className="text-[#0B0C0E] font-mono">{formData.graduationYear}</span>
              </div>
            </div>

            <Link
              href="/career"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0B0C0E] text-white text-xs font-semibold hover:bg-black transition-colors"
            >
              <span>Return to Careers Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </main>
      </div>
    );
  }

  // Active Multi-step Application Form
  const step6CustomFields = config?.fields?.filter((f) => f.step === 6 && f.enabled !== false) || [];

  return (
    <div className="min-h-screen bg-white text-[#0B0C0E] flex flex-col justify-between selection:bg-[#0B0C0E] selection:text-white">
      {/* Header */}
      <header className="border-b border-[#E9E7E1] py-4 px-6 bg-white sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/career" className="flex items-center gap-2">
            <Logo variant="light" size="sm" showWordmark={true} showTagline={false} />
            <span className="hidden sm:inline-block pl-3 border-l border-[#E9E7E1] text-[11px] font-mono uppercase text-[#737883]">
              BTech Hiring 2026 · {config?.roleTitle || "ML Track"}
            </span>
          </Link>
          <Link
            href="/career"
            className="text-xs font-mono text-[#737883] hover:text-[#0B0C0E] flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </Link>
        </div>
      </header>

      {/* Main Multi-Step Form */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-10">
        {/* Step Progress Indicators */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#737883] mb-2">
            <span>Step {currentStep} of {step6CustomFields.length > 0 ? 7 : 6}</span>
            <span>{STEPS[currentStep - 1]?.title}</span>
          </div>
          <div className="w-full h-1.5 bg-[#F0EFEB] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0B0C0E] transition-all duration-300"
              style={{ width: `${(currentStep / (step6CustomFields.length > 0 ? 7 : 6)) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Error Notice */}
        {stepError && (
          <div className="mb-6 p-4 rounded-2xl border border-rose-200 bg-rose-50 text-xs text-rose-700 flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{stepError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {/* STEP 1: PERSONAL DETAILS */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-[#0B0C0E]">Personal Information</h2>
                  <p className="text-xs text-[#737883] mt-1">
                    Provide your primary contact credentials for recruitment telemetry.
                  </p>
                </div>

                {isFieldEnabled("fullName") && (
                  <div>
                    <label className="block text-xs font-medium text-[#0B0C0E] mb-1.5">
                      Full Legal Name {isFieldRequired("fullName", true) && <span className="text-rose-600">* (Mandatory)</span>}
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      placeholder={getFieldConfig("fullName")?.placeholder || "e.g. John Doe"}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs text-[#0B0C0E] bg-[#FAFAFA] focus:outline-none focus:bg-white transition-all ${
                        errors.fullName ? "border-rose-400 bg-rose-50/20" : "border-[#E9E7E1] focus:border-[#0B0C0E]"
                      }`}
                    />
                    {errors.fullName && <p className="text-[11px] text-rose-600 mt-1">{errors.fullName}</p>}
                  </div>
                )}

                {isFieldEnabled("email") && (
                  <div>
                    <label className="block text-xs font-medium text-[#0B0C0E] mb-1.5">
                      Email Address {isFieldRequired("email", true) && <span className="text-rose-600">* (Mandatory)</span>}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder={getFieldConfig("email")?.placeholder || "e.g. john@university.edu"}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs text-[#0B0C0E] bg-[#FAFAFA] focus:outline-none focus:bg-white transition-all ${
                        errors.email ? "border-rose-400 bg-rose-50/20" : "border-[#E9E7E1] focus:border-[#0B0C0E]"
                      }`}
                    />
                    {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
                  </div>
                )}

                {isFieldEnabled("mobile") && (
                  <div>
                    <label className="block text-xs font-medium text-[#0B0C0E] mb-1.5">
                      Mobile Number {isFieldRequired("mobile", true) && <span className="text-rose-600">* (Mandatory)</span>}
                    </label>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => updateField("mobile", e.target.value)}
                      placeholder={getFieldConfig("mobile")?.placeholder || "e.g. +91 98765 43210"}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs text-[#0B0C0E] bg-[#FAFAFA] focus:outline-none focus:bg-white transition-all ${
                        errors.mobile ? "border-rose-400 bg-rose-50/20" : "border-[#E9E7E1] focus:border-[#0B0C0E]"
                      }`}
                    />
                    {errors.mobile && <p className="text-[11px] text-rose-600 mt-1">{errors.mobile}</p>}
                  </div>
                )}

                {isFieldEnabled("collegeRollNumber") && (
                  <div>
                    <label className="block text-xs font-medium text-[#0B0C0E] mb-1.5">
                      College Roll / Student ID {isFieldRequired("collegeRollNumber", true) && <span className="text-rose-600">* (Mandatory)</span>}
                    </label>
                    <input
                      type="text"
                      value={formData.collegeRollNumber}
                      onChange={(e) => updateField("collegeRollNumber", e.target.value)}
                      placeholder={getFieldConfig("collegeRollNumber")?.placeholder || "e.g. 21B01A0501"}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs text-[#0B0C0E] bg-[#FAFAFA] focus:outline-none focus:bg-white transition-all ${
                        errors.collegeRollNumber ? "border-rose-400 bg-rose-50/20" : "border-[#E9E7E1] focus:border-[#0B0C0E]"
                      }`}
                    />
                    {errors.collegeRollNumber && <p className="text-[11px] text-rose-600 mt-1">{errors.collegeRollNumber}</p>}
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 2: ACADEMICS */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-[#0B0C0E]">Academic Qualifications</h2>
                  <p className="text-xs text-[#737883] mt-1">
                    Detail your current undergraduate degree and institution.
                  </p>
                </div>

                {isFieldEnabled("branch") && (
                  <div>
                    <label className="block text-xs font-medium text-[#0B0C0E] mb-1.5">
                      Engineering Branch / Specialization {isFieldRequired("branch", true) && <span className="text-rose-600">* (Mandatory)</span>}
                    </label>
                    <input
                      type="text"
                      value={formData.branch}
                      onChange={(e) => updateField("branch", e.target.value)}
                      placeholder={getFieldConfig("branch")?.placeholder || "e.g. Computer Science (AI & ML)"}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs text-[#0B0C0E] bg-[#FAFAFA] focus:outline-none focus:bg-white transition-all ${
                        errors.branch ? "border-rose-400 bg-rose-50/20" : "border-[#E9E7E1] focus:border-[#0B0C0E]"
                      }`}
                    />
                    {errors.branch && <p className="text-[11px] text-rose-600 mt-1">{errors.branch}</p>}
                  </div>
                )}

                {isFieldEnabled("collegeName", false) && (
                  <div>
                    <label className="block text-xs font-medium text-[#0B0C0E] mb-1.5">
                      College / University Name {isFieldRequired("collegeName", false) && <span className="text-rose-600">* (Mandatory)</span>}
                    </label>
                    <input
                      type="text"
                      value={formData.collegeName}
                      onChange={(e) => updateField("collegeName", e.target.value)}
                      placeholder={getFieldConfig("collegeName")?.placeholder || "e.g. National Institute of Technology"}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs text-[#0B0C0E] bg-[#FAFAFA] focus:outline-none focus:bg-white transition-all ${
                        errors.collegeName ? "border-rose-400 bg-rose-50/20" : "border-[#E9E7E1] focus:border-[#0B0C0E]"
                      }`}
                    />
                    {errors.collegeName && <p className="text-[11px] text-rose-600 mt-1">{errors.collegeName}</p>}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {isFieldEnabled("currentCgpa") && (
                    <div>
                      <label className="block text-xs font-medium text-[#0B0C0E] mb-1.5">
                        Current CGPA {isFieldRequired("currentCgpa", true) && <span className="text-rose-600">* (Mandatory)</span>}
                      </label>
                      <input
                        type="text"
                        value={formData.currentCgpa}
                        onChange={(e) => updateField("currentCgpa", e.target.value)}
                        placeholder={getFieldConfig("currentCgpa")?.placeholder || "e.g. 8.75 / 10"}
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs text-[#0B0C0E] bg-[#FAFAFA] focus:outline-none focus:bg-white transition-all ${
                          errors.currentCgpa ? "border-rose-400 bg-rose-50/20" : "border-[#E9E7E1] focus:border-[#0B0C0E]"
                        }`}
                      />
                      {errors.currentCgpa && <p className="text-[11px] text-rose-600 mt-1">{errors.currentCgpa}</p>}
                    </div>
                  )}

                  {isFieldEnabled("graduationYear") && (
                    <div>
                      <label className="block text-xs font-medium text-[#0B0C0E] mb-1.5">
                        Graduation Year {isFieldRequired("graduationYear", true) && <span className="text-rose-600">* (Mandatory)</span>}
                      </label>
                      <select
                        value={formData.graduationYear}
                        onChange={(e) => updateField("graduationYear", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E9E7E1] text-xs text-[#0B0C0E] bg-[#FAFAFA] focus:outline-none focus:bg-white transition-all"
                      >
                        {(getFieldConfig("graduationYear")?.options || ["2024", "2025", "2026", "2027", "2028"]).map((yr) => (
                          <option key={yr} value={yr}>
                            {yr} Batch
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 3: POSITION SELECTION */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-[#0B0C0E]">Target Engineering Track</h2>
                  <p className="text-xs text-[#737883] mt-1">
                    Select your primary research and engineering specialization.
                  </p>
                </div>

                <div className="p-5 rounded-2xl border-2 border-[#0B0C0E] bg-[#FAFAFA] flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-bold text-sm text-[#0B0C0E] block">
                      Machine Learning Engineer
                    </span>
                    <p className="text-xs text-[#737883] leading-relaxed">
                      Foundation model architecture, transformer training, neural inference optimization, and sovereign agentic systems.
                    </p>
                  </div>
                  <span className="w-5 h-5 rounded-full bg-[#0B0C0E] text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                    ✓
                  </span>
                </div>
              </motion.div>
            )}

            {/* STEP 4: TECHNICAL SKILLS & LINKS */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-[#0B0C0E]">Technical Competencies &amp; Profiles</h2>
                  <p className="text-xs text-[#737883] mt-1">
                    Highlight your frameworks, libraries, and public engineering profiles.
                  </p>
                </div>

                {isFieldEnabled("technicalSkills") && (
                  <div>
                    <label className="block text-xs font-medium text-[#0B0C0E] mb-1.5">
                      Core Frameworks &amp; Skills {isFieldRequired("technicalSkills", true) && <span className="text-rose-600">* (Mandatory)</span>}
                    </label>
                    <textarea
                      rows={4}
                      value={formData.technicalSkills}
                      onChange={(e) => updateField("technicalSkills", e.target.value)}
                      placeholder={getFieldConfig("technicalSkills")?.placeholder || "e.g. PyTorch, CUDA, HuggingFace, TensorRT, vLLM, DeepSpeed, LangChain, Vector DBs"}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs text-[#0B0C0E] bg-[#FAFAFA] focus:outline-none focus:bg-white transition-all resize-none ${
                        errors.technicalSkills ? "border-rose-400 bg-rose-50/20" : "border-[#E9E7E1] focus:border-[#0B0C0E]"
                      }`}
                    />
                    {errors.technicalSkills && <p className="text-[11px] text-rose-600 mt-1">{errors.technicalSkills}</p>}
                  </div>
                )}

                {isFieldEnabled("githubUrl") && (
                  <div>
                    <label className="block text-xs font-medium text-[#0B0C0E] mb-1.5">
                      GitHub Profile URL {isFieldRequired("githubUrl", false) && <span className="text-rose-600">* (Mandatory)</span>}
                    </label>
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => updateField("githubUrl", e.target.value)}
                      placeholder="https://github.com/yourhandle"
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs text-[#0B0C0E] bg-[#FAFAFA] focus:outline-none focus:bg-white transition-all ${
                        errors.githubUrl ? "border-rose-400 bg-rose-50/20" : "border-[#E9E7E1] focus:border-[#0B0C0E]"
                      }`}
                    />
                    {errors.githubUrl && <p className="text-[11px] text-rose-600 mt-1">{errors.githubUrl}</p>}
                  </div>
                )}

                {isFieldEnabled("linkedinUrl") && (
                  <div>
                    <label className="block text-xs font-medium text-[#0B0C0E] mb-1.5">
                      LinkedIn Profile URL {isFieldRequired("linkedinUrl", false) && <span className="text-rose-600">* (Mandatory)</span>}
                    </label>
                    <input
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={(e) => updateField("linkedinUrl", e.target.value)}
                      placeholder="https://linkedin.com/in/yourhandle"
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs text-[#0B0C0E] bg-[#FAFAFA] focus:outline-none focus:bg-white transition-all ${
                        errors.linkedinUrl ? "border-rose-400 bg-rose-50/20" : "border-[#E9E7E1] focus:border-[#0B0C0E]"
                      }`}
                    />
                    {errors.linkedinUrl && <p className="text-[11px] text-rose-600 mt-1">{errors.linkedinUrl}</p>}
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 5: RELOCATION */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-[#0B0C0E]">Location &amp; In-Person Presence</h2>
                  <p className="text-xs text-[#737883] mt-1">
                    Mentneo research roles are based at our Hyderabad innovation center.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-medium text-[#0B0C0E]">
                    Are you willing to work in-person at Mentneo Labs, Hyderabad? {isFieldRequired("relocationWillingness", true) && <span className="text-rose-600">* (Mandatory)</span>}
                  </label>

                  <div className="grid grid-cols-2 gap-4">
                    {["Yes", "No"].map((option) => {
                      const isSelected = formData.relocationWillingness === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateField("relocationWillingness", option as "Yes" | "No")}
                          className={`p-4 rounded-2xl border text-center transition-all ${
                            isSelected
                              ? "border-[#0B0C0E] bg-[#0B0C0E] text-white font-semibold"
                              : "border-[#E9E7E1] bg-[#FAFAFA] text-[#0B0C0E] hover:border-[#0B0C0E]/40"
                          }`}
                        >
                          <span className="text-sm">{option}</span>
                        </button>
                      );
                    })}
                  </div>
                  {errors.relocationWillingness && (
                    <p className="text-[11px] text-rose-600 mt-1">{errors.relocationWillingness}</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 6: CUSTOM ROLE QUESTIONS (IF CONFIGURED BY ADMIN) */}
            {currentStep === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-[#0B0C0E]">Special Assessments &amp; Role Inquiries</h2>
                  <p className="text-xs text-[#737883] mt-1">
                    Please provide answers to the specific inquiries required for this cohort.
                  </p>
                </div>

                {step6CustomFields.map((field) => (
                  <div key={field.id} className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#0B0C0E]">
                      {field.label} {field.required && <span className="text-rose-600">* (Mandatory)</span>}
                    </label>

                    {field.type === "textarea" ? (
                      <textarea
                        rows={3}
                        value={customFields[field.id] || ""}
                        onChange={(e) => updateCustomField(field.id, e.target.value)}
                        placeholder={field.placeholder || "Enter details..."}
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs text-[#0B0C0E] bg-[#FAFAFA] focus:outline-none focus:bg-white resize-none ${
                          errors[field.id] ? "border-rose-400 bg-rose-50/20" : "border-[#E9E7E1] focus:border-[#0B0C0E]"
                        }`}
                      />
                    ) : field.type === "select" ? (
                      <select
                        value={customFields[field.id] || ""}
                        onChange={(e) => updateCustomField(field.id, e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs text-[#0B0C0E] bg-[#FAFAFA] focus:outline-none focus:bg-white ${
                          errors[field.id] ? "border-rose-400 bg-rose-50/20" : "border-[#E9E7E1] focus:border-[#0B0C0E]"
                        }`}
                      >
                        <option value="">-- Select an option --</option>
                        {(field.options || []).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type === "number" ? "number" : field.type === "url" ? "url" : "text"}
                        value={customFields[field.id] || ""}
                        onChange={(e) => updateCustomField(field.id, e.target.value)}
                        placeholder={field.placeholder || "Enter details..."}
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs text-[#0B0C0E] bg-[#FAFAFA] focus:outline-none focus:bg-white ${
                          errors[field.id] ? "border-rose-400 bg-rose-50/20" : "border-[#E9E7E1] focus:border-[#0B0C0E]"
                        }`}
                      />
                    )}

                    {errors[field.id] && <p className="text-[11px] text-rose-600 mt-1">{errors[field.id]}</p>}
                  </div>
                ))}
              </motion.div>
            )}

            {/* STEP 7: RESUME UPLOAD & SUBMIT */}
            {currentStep === 7 && (
              <motion.div
                key="step7"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-[#0B0C0E]">Curriculum Vitae &amp; Review</h2>
                  <p className="text-xs text-[#737883] mt-1">
                    Upload your resume document in PDF format (maximum 4 MB).
                  </p>
                </div>

                {isFieldEnabled("resume") && (
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-8 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
                        formData.resume
                          ? "border-emerald-500 bg-emerald-50/20"
                          : errors.resume
                          ? "border-rose-400 bg-rose-50/20"
                          : "border-[#E9E7E1] hover:border-[#0B0C0E] bg-[#FAFAFA]"
                      }`}
                    >
                      {formData.resume ? (
                        <div className="flex flex-col items-center gap-2">
                          <FileText className="w-8 h-8 text-emerald-600" />
                          <span className="text-xs font-semibold text-[#0B0C0E]">{formData.resume.name}</span>
                          <span className="font-mono text-[10px] text-[#737883]">
                            {(formData.resume.size / (1024 * 1024)).toFixed(2)} MB · Click to change file
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <UploadCloud className="w-8 h-8 text-[#737883]" />
                          <span className="text-xs font-semibold text-[#0B0C0E]">
                            Click to upload your resume (PDF)
                          </span>
                          <span className="font-mono text-[10px] text-[#737883]">
                            Maximum allowed file size: 4 MB
                          </span>
                        </div>
                      )}
                    </div>
                    {errors.resume && <p className="text-[11px] text-rose-600 mt-1">{errors.resume}</p>}
                  </div>
                )}

                {/* Candidate Declaration */}
                <div className="p-4 rounded-xl border border-[#E9E7E1] bg-[#FAFAFA] text-xs text-[#737883] leading-relaxed">
                  By submitting this application, I certify that all stated academic records and credentials are accurate.
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Step Navigation Buttons */}
          <div className="pt-6 border-t border-[#E9E7E1] flex items-center justify-between gap-4">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={submitting}
                className="px-5 py-2.5 rounded-full border border-[#E9E7E1] text-xs font-medium text-[#0B0C0E] hover:bg-[#FAFAFA] transition-colors"
              >
                ← Back
              </button>
            ) : <div />}

            {currentStep < 7 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-full bg-[#0B0C0E] text-white text-xs font-semibold hover:bg-black transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 rounded-full bg-[#2F5BFF] hover:bg-[#2563EB] text-white text-xs font-semibold transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Encrypting &amp; Lodging Application...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Official Application</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E9E7E1] py-4 px-6 text-center text-[11px] font-mono text-[#737883]">
        MENTNEO RECRUITMENT GATEWAY · CONFIDENTIAL CANDIDATE REGISTRY
      </footer>
    </div>
  );
}
