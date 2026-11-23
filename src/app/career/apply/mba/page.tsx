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
  Download,
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
  linkedinUrl: string;
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
  linkedinUrl: "",
  relocationWillingness: "",
  resume: null,
};

const STEPS = [
  { step: 1, title: "Personal" },
  { step: 2, title: "Academics" },
  { step: 3, title: "Position" },
  { step: 4, title: "Skills & Experience" },
  { step: 5, title: "Relocation" },
  { step: 6, title: "Custom Questions" },
  { step: 7, title: "Resume & Submit" },
];

export default function MbaApplyDynamicPage() {
  const [config, setConfig] = useState<RoleFormConfig | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<MbaFormData>(INITIAL_FORM);
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
        const res = await fetch(`/api/career/form-config?role=mba&t=${Date.now()}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const json = await res.json();
          const d = json.data || json.roleConfig || json;
          if (json.success && d) {
            setConfig(d);
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

  const updateField = <K extends keyof MbaFormData>(field: K, value: MbaFormData[K]) => {
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
      if (isFieldEnabled("collegeName") && isFieldRequired("collegeName", true) && !formData.collegeName.trim()) {
        errs.collegeName = "Business school name is mandatory to proceed.";
      }
      if (isFieldEnabled("collegeRollNumber") && isFieldRequired("collegeRollNumber", true) && !formData.collegeRollNumber.trim()) {
        errs.collegeRollNumber = "Roll / Student registration number is mandatory to proceed.";
      }
    } else if (step === 2) {
      if (isFieldEnabled("mbaSpecialization") && isFieldRequired("mbaSpecialization", true) && !formData.mbaSpecialization.trim()) {
        errs.mbaSpecialization = "MBA specialization is mandatory to proceed.";
      }
      if (isFieldEnabled("currentCgpa") && isFieldRequired("currentCgpa", true) && !formData.currentCgpa.trim()) {
        errs.currentCgpa = "Current CGPA / Percentage is mandatory to proceed.";
      }
      if (isFieldEnabled("graduationYear") && isFieldRequired("graduationYear", true) && !formData.graduationYear.trim()) {
        errs.graduationYear = "Graduation batch is mandatory to proceed.";
      }
    } else if (step === 3) {
      if (isFieldEnabled("positions") && isFieldRequired("positions", true) && formData.positions.length === 0) {
        errs.positions = "Please select your target commercial track.";
      }
    } else if (step === 4) {
      if (isFieldEnabled("skillsStrengths") && isFieldRequired("skillsStrengths", true) && !formData.skillsStrengths.trim()) {
        errs.skillsStrengths = "Key commercial strengths and competencies are mandatory to proceed.";
      }
      if (isFieldEnabled("previousExperience") && isFieldRequired("previousExperience", false) && !formData.previousExperience.trim()) {
        errs.previousExperience = "Prior engagement details are mandatory to proceed.";
      }
      if (isFieldEnabled("linkedinUrl") && isFieldRequired("linkedinUrl", false) && !formData.linkedinUrl.trim()) {
        errs.linkedinUrl = "LinkedIn profile URL is mandatory to proceed.";
      }
    } else if (step === 5) {
      if (isFieldEnabled("relocationWillingness") && isFieldRequired("relocationWillingness", true) && !formData.relocationWillingness) {
        errs.relocationWillingness = "Please specify in-person relocation willingness to proceed.";
      }
    } else if (step === 6) {
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
      data.append("collegeName", formData.collegeName.trim());
      data.append("collegeRollNumber", formData.collegeRollNumber.trim());
      data.append("mbaSpecialization", formData.mbaSpecialization.trim());
      data.append("currentCgpa", formData.currentCgpa.trim());
      data.append("graduationYear", formData.graduationYear.trim());
      data.append("positions", JSON.stringify(formData.positions));
      data.append("skillsStrengths", formData.skillsStrengths.trim());
      data.append("previousExperience", formData.previousExperience.trim());
      data.append("linkedinUrl", formData.linkedinUrl.trim());
      data.append("relocationWillingness", formData.relocationWillingness);
      data.append("customFields", JSON.stringify(customFields));

      if (formData.resume) {
        data.append("resume", formData.resume);
      }

      const res = await fetch("/api/career/apply/mba", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Submission failed. Please try again.");
      }

      const d = json.data || json;
      setSubmissionResult({
        reference: d.reference || "MNT-2026-MB",
        submittedAt: d.submittedAt || new Date().toISOString(),
        cohortName: d.cohortName || "2026 Recruitment Drive",
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
                MBA Commercial 2026
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
                MBA Commercial Track Currently Closed
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

  const handleDownloadSlip = () => {
    if (!submissionResult) return;
    const refCode = submissionResult.reference || "MNT-2026-MB";
    const cohort = submissionResult.cohortName || "KIET Group of Institutions (Nov 2026 Archive)";
    const dateStr = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "long", timeStyle: "medium" });

    const slipHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Application Slip - ${refCode} - Mentneo</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0F172A;
      background: #FFFFFF;
      margin: 0;
      padding: 24px;
      line-height: 1.5;
    }
    .container {
      max-width: 720px;
      margin: 0 auto;
      border: 2px solid #0F172A;
      border-radius: 12px;
      padding: 32px;
      background: #FFFFFF;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #E2E8F0;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #0F172A;
      margin: 0;
    }
    .brand-sub {
      font-size: 11px;
      font-family: ui-monospace, monospace;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-top: 4px;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 14px;
      background: #ECFDF5;
      color: #065F46;
      border: 1px solid #A7F3D0;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .ref-box {
      background: #F8FAFC;
      border: 1.5px dashed #CBD5E1;
      border-radius: 10px;
      padding: 16px 20px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .ref-label {
      font-size: 11px;
      text-transform: uppercase;
      font-family: ui-monospace, monospace;
      color: #64748B;
      margin-bottom: 4px;
    }
    .ref-val {
      font-size: 22px;
      font-weight: 800;
      font-family: ui-monospace, monospace;
      color: #2563EB;
      letter-spacing: 1px;
    }
    .cohort-badge {
      font-size: 11px;
      font-weight: 600;
      color: #475569;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      padding: 4px 10px;
      border-radius: 6px;
      font-family: ui-monospace, monospace;
    }
    .section-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #334155;
      border-bottom: 1px solid #E2E8F0;
      padding-bottom: 6px;
      margin-top: 20px;
      margin-bottom: 14px;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px 20px;
    }
    .field {
      display: flex;
      flex-direction: column;
    }
    .field-lbl {
      font-size: 11px;
      font-weight: 600;
      color: #64748B;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    .field-val {
      font-size: 13px;
      font-weight: 600;
      color: #0F172A;
      word-break: break-word;
    }
    .footer {
      margin-top: 32px;
      padding-top: 18px;
      border-top: 1px dashed #CBD5E1;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 11px;
      color: #64748B;
    }
    .seal-box {
      text-align: right;
    }
    .seal-stamp {
      font-family: ui-monospace, monospace;
      font-size: 10px;
      color: #059669;
      font-weight: 700;
      border: 1px solid #059669;
      padding: 4px 8px;
      border-radius: 4px;
      display: inline-block;
      margin-bottom: 4px;
      background: #ECFDF5;
    }
    .print-bar {
      margin-bottom: 16px;
      text-align: right;
    }
    .print-btn {
      background: #0F172A;
      color: #FFFFFF;
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }
    @media print {
      .no-print { display: none !important; }
      body { padding: 0; }
      .container { border: 1px solid #94A3B8; }
    }
  </style>
</head>
<body>
  <div class="no-print print-bar">
    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  </div>
  <div class="container">
    <div class="header">
      <div>
        <h1 class="brand-title">MENTNEO</h1>
        <div class="brand-sub">Sovereign Artificial Intelligence · Candidate Registration Slip</div>
      </div>
      <div>
        <span class="status-badge">✓ Confirmed &amp; Lodged</span>
      </div>
    </div>

    <div class="ref-box">
      <div>
        <div class="ref-label">Application Reference Number</div>
        <div class="ref-val">${refCode}</div>
      </div>
      <div>
        <span class="cohort-badge">${cohort}</span>
      </div>
    </div>

    <div class="section-title">Applicant Credentials</div>
    <div class="grid">
      <div class="field">
        <span class="field-lbl">Full Legal Name</span>
        <span class="field-val">${formData.fullName}</span>
      </div>
      <div class="field">
        <span class="field-lbl">Email Address</span>
        <span class="field-val">${formData.email}</span>
      </div>
      <div class="field">
        <span class="field-lbl">Mobile Contact</span>
        <span class="field-val">${formData.mobile}</span>
      </div>
      <div class="field">
        <span class="field-lbl">Application Track</span>
        <span class="field-val">MBA Commercial &amp; Business Operations</span>
      </div>
    </div>

    <div class="section-title">Academic &amp; Institute Details</div>
    <div class="grid">
      <div class="field">
        <span class="field-lbl">Business School / College</span>
        <span class="field-val">${formData.collegeName || "KIET Group of Institutions"}</span>
      </div>
      <div class="field">
        <span class="field-lbl">Student Roll Number</span>
        <span class="field-val">${formData.collegeRollNumber}</span>
      </div>
      <div class="field">
        <span class="field-lbl">MBA Specialization</span>
        <span class="field-val">${formData.mbaSpecialization}</span>
      </div>
      <div class="field">
        <span class="field-lbl">Current CGPA / Percentage</span>
        <span class="field-val">${formData.currentCgpa}</span>
      </div>
      <div class="field">
        <span class="field-lbl">Graduation Batch</span>
        <span class="field-val">${formData.graduationYear}</span>
      </div>
      <div class="field">
        <span class="field-lbl">Relocation Willingness</span>
        <span class="field-val">${formData.relocationWillingness} (Hyderabad HQ)</span>
      </div>
    </div>

    <div class="section-title">Selected Track &amp; Telemetry</div>
    <div class="grid">
      <div class="field">
        <span class="field-lbl">Target Role(s)</span>
        <span class="field-val">${(formData.positions || []).join(", ") || "Management & Business Operations"}</span>
      </div>
      <div class="field">
        <span class="field-lbl">Registration Timestamp</span>
        <span class="field-val">${dateStr}</span>
      </div>
    </div>

    <div class="footer">
      <div>
        <div>Mentneo Research Labs · Hyderabad, India</div>
        <div style="font-size: 10px; color: #94A3B8; margin-top: 2px;">Retain this slip for campus placement verification and interview rounds.</div>
      </div>
      <div class="seal-box">
        <div class="seal-stamp">OFFICIAL CANDIDATE REGISTRY</div>
        <div style="font-family: ui-monospace, monospace; font-size: 10px; color: #94A3B8;">HASH: ${refCode}-VERIFIED</div>
      </div>
    </div>
  </div>
  <script>
    window.addEventListener("load", () => {
      setTimeout(() => { window.print(); }, 350);
    });
  </script>
</body>
</html>`;

    const printWin = window.open("", "_blank");
    if (printWin) {
      printWin.document.write(slipHtml);
      printWin.document.close();
    } else {
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "none";
      document.body.appendChild(iframe);
      const doc = iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(slipHtml);
        doc.close();
      }
    }
  };

  // Application Success Confirmation Screen
  if (submissionResult) {
    return (
      <div className="min-h-screen bg-white text-[#0B0C0E] flex flex-col justify-between selection:bg-[#0B0C0E] selection:text-white">
        <header className="border-b border-[#E9E7E1] py-4 px-6 bg-white sticky top-0 z-30">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <Link href="/career" className="flex items-center gap-2">
              <Logo variant="light" size="sm" showWordmark={true} showTagline={false} />
              <span className="hidden sm:inline-block pl-3 border-l border-[#E9E7E1] text-[11px] font-mono uppercase text-[#737883]">
                MBA Commercial 2026
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
                Your application for MENTNEO MBA Commercial Hiring 2026 has been encrypted and recorded in our candidate registry.
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
                <span className="text-[#0B0C0E] font-medium">MBA Commercial 2026</span>
                <span>Positions:</span>
                <span className="text-[#0B0C0E] font-medium">{formData.positions.join(", ")}</span>
                <span>Institute:</span>
                <span className="text-[#0B0C0E] font-medium">{formData.collegeName || "KIET Group of Institutions"}</span>
                <span>Roll Number:</span>
                <span className="text-[#0B0C0E] font-mono">{formData.collegeRollNumber}</span>
                <span>Specialization:</span>
                <span className="text-[#0B0C0E] font-medium">{formData.mbaSpecialization}</span>
                <span>Email:</span>
                <span className="text-[#0B0C0E] font-mono">{formData.email}</span>
                <span>Graduation Batch:</span>
                <span className="text-[#0B0C0E] font-mono">{formData.graduationYear}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadSlip}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#2F5BFF] text-white text-xs font-semibold hover:bg-blue-600 transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Application Slip (PDF)</span>
              </button>

              <Link
                href="/career"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0B0C0E] text-white text-xs font-semibold hover:bg-black transition-colors"
              >
                <span>Return to Careers Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  const step6CustomFields = config?.fields?.filter((f) => f.step === 6 && f.enabled !== false) || [];

  return (
    <div className="min-h-screen bg-white text-[#0B0C0E] flex flex-col justify-between selection:bg-[#0B0C0E] selection:text-white">
      {/* Header */}
      <header className="border-b border-[#E9E7E1] py-4 px-6 bg-white sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/career" className="flex items-center gap-2">
            <Logo variant="light" size="sm" showWordmark={true} showTagline={false} />
            <span className="hidden sm:inline-block pl-3 border-l border-[#E9E7E1] text-[11px] font-mono uppercase text-[#737883]">
              MBA Commercial 2026 · {config?.roleTitle || "Commercial Track"}
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
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 sm:px-8 py-10">
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
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-[#0B0C0E]">Personal &amp; Institution Credentials</h2>
                  <p className="text-xs text-[#737883] mt-1">
                    Provide your primary contact and business school identification.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  {isFieldEnabled("fullName") && (
                    <div>
                      <label className="block text-xs font-medium text-[#0B0C0E] mb-1.5">
                        Full Legal Name {isFieldRequired("fullName", true) && <span className="text-rose-600">* (Mandatory)</span>}
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => updateField("fullName", e.target.value)}
                        placeholder={getFieldConfig("fullName")?.placeholder || "e.g. Jane Smith"}
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
                        placeholder={getFieldConfig("email")?.placeholder || "e.g. jane@businessschool.edu"}
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
                        Student Roll / Registration Number {isFieldRequired("collegeRollNumber", true) && <span className="text-rose-600">* (Mandatory)</span>}
                      </label>
                      <input
                        type="text"
                        value={formData.collegeRollNumber}
                        onChange={(e) => updateField("collegeRollNumber", e.target.value)}
                        placeholder={getFieldConfig("collegeRollNumber")?.placeholder || "e.g. MBA-2026-042"}
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs text-[#0B0C0E] bg-[#FAFAFA] focus:outline-none focus:bg-white transition-all ${
                          errors.collegeRollNumber ? "border-rose-400 bg-rose-50/20" : "border-[#E9E7E1] focus:border-[#0B0C0E]"
                        }`}
                      />
                      {errors.collegeRollNumber && <p className="text-[11px] text-rose-600 mt-1">{errors.collegeRollNumber}</p>}
                    </div>
                  )}

                  {isFieldEnabled("collegeName") && (
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-[#0B0C0E] mb-1.5">
                        Business School / University {isFieldRequired("collegeName", true) && <span className="text-rose-600">* (Mandatory)</span>}
                      </label>
                      <input
                        type="text"
                        value={formData.collegeName}
                        onChange={(e) => updateField("collegeName", e.target.value)}
                        placeholder={getFieldConfig("collegeName")?.placeholder || "e.g. Indian Institute of Management"}
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs text-[#0B0C0E] bg-[#FAFAFA] focus:outline-none focus:bg-white transition-all ${
                          errors.collegeName ? "border-rose-400 bg-rose-50/20" : "border-[#E9E7E1] focus:border-[#0B0C0E]"
                        }`}
                      />
                      {errors.collegeName && <p className="text-[11px] text-rose-600 mt-1">{errors.collegeName}</p>}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 2: ACADEMICS & SPECIALIZATION */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-[#0B0C0E]">Specialization &amp; Metrics</h2>
                  <p className="text-xs text-[#737883] mt-1">
                    Detail your MBA curriculum focus and current cumulative scores.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  {isFieldEnabled("mbaSpecialization") && (
                    <div className="md:col-span-1">
                      <label className="block text-xs font-medium text-[#0B0C0E] mb-1.5">
                        MBA Specialization {isFieldRequired("mbaSpecialization", true) && <span className="text-rose-600">* (Mandatory)</span>}
                      </label>
                      <select
                        value={formData.mbaSpecialization}
                        onChange={(e) => updateField("mbaSpecialization", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E9E7E1] text-xs text-[#0B0C0E] bg-[#FAFAFA] focus:outline-none focus:bg-white transition-all"
                      >
                        {(getFieldConfig("mbaSpecialization")?.options || [
                          "Marketing",
                          "Finance",
                          "Human Resources (HR)",
                          "Business Analytics",
                          "Operations",
                          "General Management",
                          "Other",
                        ]).map((spec) => (
                          <option key={spec} value={spec}>
                            {spec}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {isFieldEnabled("graduationYear") && (
                    <div className="md:col-span-1">
                      <label className="block text-xs font-medium text-[#0B0C0E] mb-1.5">
                        Graduation Batch {isFieldRequired("graduationYear", true) && <span className="text-rose-600">* (Mandatory)</span>}
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

                  {isFieldEnabled("currentCgpa") && (
                    <div className="md:col-span-1">
                      <label className="block text-xs font-medium text-[#0B0C0E] mb-1.5">
                        Current CGPA / % {isFieldRequired("currentCgpa", true) && <span className="text-rose-600">* (Mandatory)</span>}
                      </label>
                      <input
                        type="text"
                        value={formData.currentCgpa}
                        onChange={(e) => updateField("currentCgpa", e.target.value)}
                        placeholder="e.g. 8.5 / 10"
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs text-[#0B0C0E] bg-[#FAFAFA] focus:outline-none focus:bg-white transition-all ${
                          errors.currentCgpa ? "border-rose-400 bg-rose-50/20" : "border-[#E9E7E1] focus:border-[#0B0C0E]"
                        }`}
                      />
                      {errors.currentCgpa && <p className="text-[11px] text-rose-600 mt-1">{errors.currentCgpa}</p>}
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
                  <h2 className="text-xl font-bold tracking-tight text-[#0B0C0E]">Target Commercial Track</h2>
                  <p className="text-xs text-[#737883] mt-1">
                    Select your primary enterprise and operations track.
                  </p>
                </div>

                <div className="p-5 rounded-2xl border-2 border-[#0B0C0E] bg-[#FAFAFA] flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-bold text-sm text-[#0B0C0E] block">
                      Management &amp; Business Operations
                    </span>
                    <p className="text-xs text-[#737883] leading-relaxed">
                      Lead commercial enterprise strategy, key account expansion, GTM operations, and organizational scaling for sovereign AI.
                    </p>
                  </div>
                  <span className="w-5 h-5 rounded-full bg-[#0B0C0E] text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                    ✓
                  </span>
                </div>
              </motion.div>
            )}

            {/* STEP 4: SKILLS & EXPERIENCE */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-[#0B0C0E]">Commercial Acumen &amp; Experience</h2>
                  <p className="text-xs text-[#737883] mt-1">
                    Highlight your business development, analytical skills, and past internships.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  {isFieldEnabled("skillsStrengths") && (
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-[#0B0C0E] mb-1.5">
                        Key Strengths &amp; Acumen {isFieldRequired("skillsStrengths", true) && <span className="text-rose-600">* (Mandatory)</span>}
                      </label>
                      <textarea
                        rows={3}
                        value={formData.skillsStrengths}
                        onChange={(e) => updateField("skillsStrengths", e.target.value)}
                        placeholder={getFieldConfig("skillsStrengths")?.placeholder || "e.g. Enterprise Partnerships, Growth Operations, B2B Deal Negotiations, Strategic Market Analysis"}
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs text-[#0B0C0E] bg-[#FAFAFA] focus:outline-none focus:bg-white transition-all resize-none ${
                          errors.skillsStrengths ? "border-rose-400 bg-rose-50/20" : "border-[#E9E7E1] focus:border-[#0B0C0E]"
                        }`}
                      />
                      {errors.skillsStrengths && <p className="text-[11px] text-rose-600 mt-1">{errors.skillsStrengths}</p>}
                    </div>
                  )}

                  {isFieldEnabled("previousExperience") && (
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-[#0B0C0E] mb-1.5">
                        Prior Experience / Internship Details {isFieldRequired("previousExperience", false) && <span className="text-rose-600">* (Mandatory)</span>}
                      </label>
                      <textarea
                        rows={3}
                        value={formData.previousExperience}
                        onChange={(e) => updateField("previousExperience", e.target.value)}
                        placeholder={getFieldConfig("previousExperience")?.placeholder || "Briefly outline any past leadership, internships, or corporate engagements."}
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs text-[#0B0C0E] bg-[#FAFAFA] focus:outline-none focus:bg-white transition-all resize-none ${
                          errors.previousExperience ? "border-rose-400 bg-rose-50/20" : "border-[#E9E7E1] focus:border-[#0B0C0E]"
                        }`}
                      />
                      {errors.previousExperience && <p className="text-[11px] text-rose-600 mt-1">{errors.previousExperience}</p>}
                    </div>
                  )}

                  {isFieldEnabled("linkedinUrl") && (
                    <div className="md:col-span-1">
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
                </div>
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
                    Mentneo commercial and operations leadership is centered at Hyderabad.
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

            {/* STEP 6: CUSTOM ROLE QUESTIONS */}
            {currentStep === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-[#0B0C0E]">Special Assessments &amp; Role Inquiries</h2>
                  <p className="text-xs text-[#737883] mt-1">
                    Please provide answers to the specific inquiries required for this cohort.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  {step6CustomFields.map((field) => (
                    <div
                      key={field.id}
                      className={`space-y-1.5 ${field.type === "textarea" ? "md:col-span-2" : "md:col-span-1"}`}
                    >
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
                </div>
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
