"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import {
  ShieldCheck,
  Search,
  Download,
  FileSpreadsheet,
  FileText,
  AlertCircle,
  Eye,
  LogOut,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  History,
  X,
  ArrowRight,
  Plus,
  Trash2,
  FolderArchive,
  Sliders,
  Check,
  Lock,
  Unlock,
  CheckCircle2,
} from "lucide-react";
import type { CareerFormSettings, FormBin, FormFieldConfig } from "@/lib/career/form-config";

interface OverviewMetrics {
  total: number;
  btech: number;
  mba: number;
  internship: number;
  submitted: number;
  underReview: number;
  shortlisted: number;
  interview: number;
  selected: number;
  rejected: number;
}

interface ApplicationSummary {
  id: number;
  application_reference: string;
  applicant_type: "btech" | "mba" | "internship";
  full_name: string;
  email: string;
  mobile: string;
  college_name: string | null;
  college_roll_number: string;
  branch: string | null;
  mba_specialization: string | null;
  current_cgpa: string | null;
  current_percentage: string | null;
  graduation_year: string;
  relocation_willingness: "Yes" | "No";
  technical_skills: string | null;
  skills_strengths: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  previous_experience: string | null;
  resume_object_key: string | null;
  application_status: "Submitted" | "Under Review" | "Shortlisted" | "Interview" | "Selected" | "Rejected";
  submitted_at: string;
  positions: string[];
}

interface ApplicationDetailData {
  application: ApplicationSummary;
  positions: string[];
  events: { id: number; event_type: string; event_description: string; created_at: string }[];
  notes: { id: number; admin_id: string; note: string; created_at: string }[];
}

export default function AdminPage() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [pinDigits, setPinDigits] = useState<string[]>(Array(8).fill(""));
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Dashboard states
  const [activeTab, setActiveTab] = useState<"overview" | "applicants" | "analytics" | "export" | "form_studio">("overview");

  // Bins & Form Studio states
  const [selectedBin, setSelectedBin] = useState<string>("all");
  const [binsList, setBinsList] = useState<FormBin[]>([]);
  const [allBinsTotal, setAllBinsTotal] = useState<number>(0);
  const [formSettings, setFormSettings] = useState<CareerFormSettings | null>(null);
  const [formSettingsSaving, setFormSettingsSaving] = useState(false);
  const [settingsFeedback, setSettingsFeedback] = useState<string>("");
  const [studioRole, setStudioRole] = useState<"btech" | "mba">("btech");

  // New Bin Modal
  const [newBinModalOpen, setNewBinModalOpen] = useState(false);
  const [newBinName, setNewBinName] = useState("");
  const [newBinDesc, setNewBinDesc] = useState("");
  const [newBinRole, setNewBinRole] = useState<"all" | "btech" | "mba">("all");
  const [newBinCreating, setNewBinCreating] = useState(false);

  // Custom Field Modal
  const [customFieldModalOpen, setCustomFieldModalOpen] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldKey, setNewFieldKey] = useState("");
  const [newFieldType, setNewFieldType] = useState<"text" | "number" | "select" | "textarea" | "url">("text");
  const [newFieldStep, setNewFieldStep] = useState<number>(6);
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldOptions, setNewFieldOptions] = useState("");
  const [newFieldPlaceholder, setNewFieldPlaceholder] = useState("");
  const [metrics, setMetrics] = useState<OverviewMetrics>({
    total: 0,
    btech: 0,
    mba: 0,
    internship: 0,
    submitted: 0,
    underReview: 0,
    shortlisted: 0,
    interview: 0,
    selected: 0,
    rejected: 0,
  });
  const [positionStats, setPositionStats] = useState<{ position_name: string; count: number }[]>([]);
  const [gradYearStats, setGradYearStats] = useState<{ graduation_year: string; count: number }[]>([]);
  const [recentApplications, setRecentApplications] = useState<ApplicationSummary[]>([]);

  // Applicants list states
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [totalApps, setTotalApps] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [gradYearFilter, setGradYearFilter] = useState("all");
  const [listLoading, setListLoading] = useState(false);

  // Selected applicant details modal
  const [selectedApp, setSelectedApp] = useState<ApplicationDetailData | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [noteSubmitting, setNoteSubmitting] = useState(false);

  // Export panel states
  const [exportType, setExportType] = useState("all");
  const [exportFormat, setExportFormat] = useState("xlsx");
  const [exportStatus, setExportStatus] = useState("all");

  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Check current session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadFormConfig = useCallback(async () => {
    try {
      const res = await fetch(`/api/ca/admin/form-config?t=${Date.now()}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setFormSettings(json.data);
          if (Array.isArray(json.data.bins)) {
            setBinsList(json.data.bins);
          }
        }
      }
    } catch (err) {
      console.warn("Failed to load form config:", err);
    }
  }, []);

  const checkSession = useCallback(async (binOverride?: string) => {
    try {
      const activeBinParam = binOverride !== undefined ? binOverride : selectedBin;
      const binQuery = activeBinParam !== "all" ? `&bin=${encodeURIComponent(activeBinParam)}` : "";
      const res = await fetch(`/api/ca/admin/dashboard?t=${Date.now()}${binQuery}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setIsAuthenticated(true);
          const rawM = json.data.metrics || json.data.overview || {};
          setMetrics({
            total: rawM.total ?? rawM.totalApplicants ?? 0,
            btech: rawM.btech ?? rawM.btechTotal ?? 0,
            mba: rawM.mba ?? rawM.mbaTotal ?? 0,
            internship: rawM.internship ?? rawM.internshipTotal ?? 0,
            submitted: rawM.submitted ?? 0,
            underReview: rawM.underReview ?? 0,
            shortlisted: rawM.shortlisted ?? 0,
            interview: rawM.interview ?? 0,
            selected: rawM.selected ?? 0,
            rejected: rawM.rejected ?? 0,
          });
          if (rawM.allBinsTotal !== undefined) {
            setAllBinsTotal(rawM.allBinsTotal);
          }
          setPositionStats(Array.isArray(json.data.positionStats) ? json.data.positionStats : []);
          setGradYearStats(Array.isArray(json.data.gradYearStats) ? json.data.gradYearStats : []);
          setRecentApplications(Array.isArray(json.data.recentApplications) ? json.data.recentApplications : []);
          return;
        }
      }
      setIsAuthenticated(false);
    } catch {
      setIsAuthenticated(false);
    }
  }, [selectedBin]);

  const loadApplications = useCallback(async (overrideSearch?: string, binOverride?: string) => {
    setListLoading(true);
    try {
      const query = overrideSearch !== undefined ? overrideSearch : searchQuery;
      const activeBinParam = binOverride !== undefined ? binOverride : selectedBin;
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        type: typeFilter,
        status: statusFilter,
        gradYear: gradYearFilter,
        search: query,
        bin: activeBinParam,
        t: Date.now().toString(),
      });

      const res = await fetch(`/api/ca/admin/applications?${params.toString()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const appsList = Array.isArray(json.data.applications) ? json.data.applications : [];
          setApplications(appsList);
          const totalCount = json.data.pagination?.total ?? appsList.length;
          setTotalApps(totalCount);
        }
      }
    } catch (err) {
      console.error("Failed to load applicants:", err);
    } finally {
      setListLoading(false);
    }
  }, [currentPage, typeFilter, statusFilter, gradYearFilter, searchQuery, selectedBin]);

  const handleSelectBin = (binId: string) => {
    setSelectedBin(binId);
    setCurrentPage(1);
    checkSession(binId);
    loadApplications(undefined, binId);
  };

  const handleSaveSettings = async (customConfig?: CareerFormSettings) => {
    const toSave = customConfig || formSettings;
    if (!toSave) return;
    setFormSettingsSaving(true);
    setSettingsFeedback("");
    try {
      const res = await fetch("/api/ca/admin/form-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toSave),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setFormSettings(json.data);
        if (Array.isArray(json.data.bins)) setBinsList(json.data.bins);
        setSettingsFeedback("Settings and dynamic form configuration saved successfully.");
        setTimeout(() => setSettingsFeedback(""), 4000);
      } else {
        throw new Error(json.error || "Failed to update settings");
      }
    } catch (err: unknown) {
      setSettingsFeedback(`Error: ${(err as Error).message}`);
    } finally {
      setFormSettingsSaving(false);
    }
  };

  const handleSetActiveBin = async (binId: string) => {
    if (!formSettings) return;
    const updated: CareerFormSettings = {
      ...formSettings,
      activeBinId: binId,
      bins: formSettings.bins.map((b) => ({
        ...b,
        status: b.id === binId ? "active" : b.status === "active" ? "archived" : b.status,
      })),
      btech: { ...formSettings.btech, targetBinId: binId },
      mba: { ...formSettings.mba, targetBinId: binId },
    };
    setFormSettings(updated);
    await handleSaveSettings(updated);
  };

  const handleCreateBin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBinName.trim()) return;
    setNewBinCreating(true);
    try {
      const res = await fetch("/api/ca/admin/bins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newBinName.trim(),
          description: newBinDesc.trim() || `Intake cohort created on ${new Date().toLocaleDateString()}`,
          targetRole: newBinRole,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setNewBinName("");
        setNewBinDesc("");
        setNewBinModalOpen(false);
        await loadFormConfig();
      }
    } catch (err) {
      console.error("Create bin error:", err);
    } finally {
      setNewBinCreating(false);
    }
  };

  const toggleGlobalOpen = async () => {
    if (!formSettings) return;
    const updated: CareerFormSettings = {
      ...formSettings,
      globalOpen: !formSettings.globalOpen,
    };
    setFormSettings(updated);
    await handleSaveSettings(updated);
  };

  const toggleRoleOpen = async (role: "btech" | "mba") => {
    if (!formSettings) return;
    const updated: CareerFormSettings = {
      ...formSettings,
      [role]: {
        ...formSettings[role],
        isOpen: !formSettings[role].isOpen,
      },
    };
    setFormSettings(updated);
    await handleSaveSettings(updated);
  };

  const toggleFieldEnabled = (role: "btech" | "mba", fieldId: string) => {
    if (!formSettings) return;
    const targetFields = formSettings[role].fields.map((f) => {
      if (f.id === fieldId) {
        return { ...f, enabled: !f.enabled };
      }
      return f;
    });
    setFormSettings({
      ...formSettings,
      [role]: { ...formSettings[role], fields: targetFields },
    });
  };

  const toggleFieldRequired = (role: "btech" | "mba", fieldId: string) => {
    if (!formSettings) return;
    const targetFields = formSettings[role].fields.map((f) => {
      if (f.id === fieldId) {
        return { ...f, required: !f.required };
      }
      return f;
    });
    setFormSettings({
      ...formSettings,
      [role]: { ...formSettings[role], fields: targetFields },
    });
  };

  const handleAddCustomField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSettings || !newFieldLabel.trim()) return;
    const autoKey =
      newFieldKey.trim() ||
      newFieldLabel.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/^_+|_+$/g, "") ||
      `custom_${Date.now()}`;
    const newField: FormFieldConfig = {
      id: autoKey,
      label: newFieldLabel.trim(),
      type: newFieldType,
      step: Number(newFieldStep) || 6,
      enabled: true,
      required: newFieldRequired,
      isCustom: true,
      placeholder: newFieldPlaceholder.trim() || undefined,
      options:
        newFieldType === "select" && newFieldOptions.trim()
          ? newFieldOptions.split(",").map((s) => s.trim()).filter(Boolean)
          : undefined,
    };

    const targetFields = [...formSettings[studioRole].fields, newField];
    setFormSettings({
      ...formSettings,
      [studioRole]: { ...formSettings[studioRole], fields: targetFields },
    });
    setCustomFieldModalOpen(false);
    setNewFieldLabel("");
    setNewFieldKey("");
    setNewFieldPlaceholder("");
    setNewFieldOptions("");
    setNewFieldRequired(false);
  };

  const handleDeleteCustomField = (role: "btech" | "mba", fieldId: string) => {
    if (!formSettings) return;
    const targetFields = formSettings[role].fields.filter((f) => f.id !== fieldId);
    setFormSettings({
      ...formSettings,
      [role]: { ...formSettings[role], fields: targetFields },
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadFormConfig();
    }
  }, [isAuthenticated, loadFormConfig]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([checkSession(), loadApplications()]);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Real-time polling: auto-refresh candidates every 10 seconds
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      checkSession();
      loadApplications();
    }, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated, checkSession, loadApplications]);

  // Load applicants list when switching to applicants tab or changing filters
  useEffect(() => {
    if (isAuthenticated) {
      loadApplications();
    }
  }, [isAuthenticated, loadApplications]);

  // PIN Input handlers
  const handlePinChange = (index: number, val: string) => {
    const digit = val.slice(-1);
    if (digit && !/^[0-9]$/.test(digit)) return;

    const nextDigits = [...pinDigits];
    nextDigits[index] = digit;
    setPinDigits(nextDigits);

    if (digit && index < 7) {
      pinRefs.current[index + 1]?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pinDigits[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const pin = pinDigits.join("");
    if (pin.length !== 8) {
      setLoginError("Please enter all 8 digits of your security PIN.");
      return;
    }

    setLoginLoading(true);
    try {
      const res = await fetch("/api/ca/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin, password: pin }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Authentication failed.");
      }

      setIsAuthenticated(true);
      checkSession();
    } catch (err: unknown) {
      setLoginError((err as Error).message || "Invalid credentials.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/ca/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
    setPinDigits(Array(8).fill(""));
  };

  // Open applicant detail drawer
  const openApplicant = async (id: number) => {
    setModalLoading(true);
    setSelectedApp(null);
    try {
      const res = await fetch(`/api/ca/admin/applications/${id}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setSelectedApp(json.data);
          setNewStatus(json.data.application.application_status);
        }
      }
    } catch (err) {
      console.error("Failed to load applicant detail:", err);
    } finally {
      setModalLoading(false);
    }
  };

  // Update applicant status
  const handleStatusUpdate = async () => {
    if (!selectedApp || !newStatus) return;
    setStatusUpdating(true);
    try {
      const res = await fetch(`/api/ca/admin/applications/${selectedApp.application.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        openApplicant(selectedApp.application.id);
        loadApplications();
        checkSession();
      }
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setStatusUpdating(false);
    }
  };

  // Add Admin Note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !newNote.trim()) return;
    setNoteSubmitting(true);
    try {
      const res = await fetch(`/api/ca/admin/applications/${selectedApp.application.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: newNote }),
      });

      if (res.ok) {
        setNewNote("");
        openApplicant(selectedApp.application.id);
      }
    } catch (err) {
      console.error("Note submit error:", err);
    } finally {
      setNoteSubmitting(false);
    }
  };

  // Cohort Bin Filter Bar Helper
  const renderCohortBinFilterBar = () => (
    <div className="p-3 rounded-2xl border border-[#E9E7E1] bg-white shadow-xs flex items-center justify-between gap-3 overflow-x-auto">
      <div className="flex items-center gap-2">
        <FolderArchive className="w-4 h-4 text-[#737883] shrink-0 ml-1" />
        <span className="font-mono text-[11px] uppercase text-[#737883] tracking-wide shrink-0">
          Cohort Bin:
        </span>
        <button
          onClick={() => handleSelectBin("all")}
          className={`px-3 py-1 rounded-xl font-mono text-xs transition-all shrink-0 ${
            selectedBin === "all"
              ? "bg-[#0B0C0E] text-white font-semibold shadow-xs"
              : "bg-[#FAFAFA] text-[#4A4E57] hover:bg-[#F0EFEB] hover:text-[#0B0C0E]"
          }`}
        >
          All Bins ({allBinsTotal || metrics.total})
        </button>
        {binsList.map((bin) => {
          const isSelected = selectedBin === bin.id;
          const isActiveIntake = bin.id === formSettings?.activeBinId || bin.status === "active";
          return (
            <button
              key={bin.id}
              onClick={() => handleSelectBin(bin.id)}
              className={`px-3 py-1 rounded-xl font-mono text-xs transition-all flex items-center gap-1.5 shrink-0 ${
                isSelected
                  ? "bg-[#0B0C0E] text-white font-semibold shadow-xs"
                  : "bg-[#FAFAFA] text-[#4A4E57] hover:bg-[#F0EFEB] hover:text-[#0B0C0E]"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isActiveIntake ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
                }`}
              />
              <span>{bin.name}</span>
              <span
                className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                  isSelected ? "bg-white/20 text-white" : "bg-[#E9E7E1] text-[#0B0C0E]"
                }`}
              >
                {bin.applicationCount ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => setActiveTab("form_studio")}
        className="px-3 py-1 rounded-xl border border-[#E9E7E1] hover:border-[#0B0C0E]/40 text-xs font-mono text-[#2F5BFF] hover:bg-[#FAFAFA] transition-colors shrink-0 flex items-center gap-1"
      >
        <Sliders className="w-3.5 h-3.5" />
        <span>Manage Bins &amp; Forms</span>
      </button>
    </div>
  );

  // Status Badge Helper
  const renderStatusBadge = (st: string) => {
    let colorClass = "bg-gray-100 text-gray-700 border-gray-200";
    if (st === "Submitted") colorClass = "bg-blue-50 text-blue-700 border-blue-200";
    if (st === "Under Review") colorClass = "bg-amber-50 text-amber-700 border-amber-200";
    if (st === "Shortlisted") colorClass = "bg-indigo-50 text-indigo-700 border-indigo-200";
    if (st === "Interview") colorClass = "bg-purple-50 text-purple-700 border-purple-200";
    if (st === "Selected") colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (st === "Rejected") colorClass = "bg-rose-50 text-rose-700 border-rose-200";

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono border font-medium ${colorClass}`}>
        {st}
      </span>
    );
  };

  // If checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="font-mono text-xs text-[#737883] animate-pulse">
          AUTHENTICATING COMMAND CREDENTIALS...
        </div>
      </div>
    );
  }

  // =========================================================================
  // LOGIN SCREEN (Dual Credentials: Password + 8-Digit Segmented PIN)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] flex flex-col justify-between selection:bg-black selection:text-white">
        <header className="border-b border-[#E9E7E1] py-4 px-6 bg-white">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <Link href="/career" className="flex items-center gap-2">
              <Logo variant="light" size="sm" showWordmark={true} showTagline={false} />
              <span className="pl-3 border-l border-[#E9E7E1] text-[11px] font-mono uppercase text-[#737883]">
                Recruitment Command
              </span>
            </Link>

            <Link
              href="/career"
              className="text-xs font-mono text-[#737883] hover:text-[#0B0C0E] transition-colors"
            >
              ← Public Career Portal
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl border border-[#E9E7E1] bg-white shadow-[0_15px_40px_rgba(0,0,0,0.03)] space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl border border-[#E9E7E1] bg-[#FAFAFA] flex items-center justify-center mx-auto text-[#2F5BFF]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-semibold tracking-tight text-[#0B0C0E]">
                Recruitment Admin Access
              </h1>
              <p className="text-xs text-[#737883]">
                Enter your 8-digit administrator security PIN to manage candidate applications.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* 8-Digit Segmented PIN */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wide text-[#4A4E57] mb-2.5 text-center">
                  <span>8-Digit Security PIN</span>
                </label>

                <div className="grid grid-cols-8 gap-1.5">
                  {pinDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        pinRefs.current[idx] = el;
                      }}
                      type="password"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinChange(idx, e.target.value)}
                      onKeyDown={(e) => handlePinKeyDown(idx, e)}
                      className="w-full h-11 text-center font-mono text-sm font-bold rounded-lg border border-[#E9E7E1] bg-[#FAFAFA] text-[#0B0C0E] focus:outline-none focus:border-[#2F5BFF] focus:bg-white transition-all"
                    />
                  ))}
                </div>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl border border-red-200 bg-red-50 text-xs text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-xl bg-[#0B0C0E] text-white text-xs font-semibold hover:bg-black transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loginLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Unlock Recruitment Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 border-t border-[#E9E7E1] text-center">
              <span className="font-mono text-[10px] text-[#737883] uppercase tracking-wider">
                Cryptographic session attestation · Rate-limited
              </span>
            </div>
          </div>
        </main>

        <footer className="py-4 border-t border-[#E9E7E1] text-center font-mono text-[11px] text-[#737883]">
          MENTNEO SECURE INFRASTRUCTURE · AUTHENTICATED ACCESS ONLY
        </footer>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED ADMIN DASHBOARD
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#0B0C0E] flex flex-col justify-between selection:bg-black selection:text-white">
      {/* Top Navigation Bar */}
      <header className="border-b border-[#E9E7E1] py-3.5 px-6 bg-white sticky top-0 z-30 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="light" size="sm" showWordmark={true} showTagline={false} />
            <span className="hidden sm:inline-block pl-3 border-l border-[#E9E7E1] font-mono text-xs uppercase text-[#737883]">
              Recruitment Command · 2026
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E9E7E1] bg-white text-xs font-mono text-[#0B0C0E] hover:border-[#0B0C0E]/40 hover:bg-[#FAFAFA] transition-all shadow-sm"
              title="Refresh candidate data now"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#2F5BFF]" : "text-[#737883]"}`} />
              <span className="hidden sm:inline">{isRefreshing ? "Updating..." : "Live Refresh"}</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-[#10B981]/30 bg-[#10B981]/[0.08] text-[11px] font-mono text-[#059669]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span>Session Authenticated</span>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E9E7E1] bg-white text-xs font-mono text-[#737883] hover:text-red-600 hover:border-red-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white border-b border-[#E9E7E1] px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-2">
          {[
            { id: "overview", label: "Dashboard Overview" },
            { id: "applicants", label: `Applicants (${totalApps || metrics?.total || 0})` },
            { id: "analytics", label: "Analytics & Trends" },
            { id: "export", label: "Export Records" },
            { id: "form_studio", label: "Form & Bins Studio" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "overview" | "applicants" | "analytics" | "export")}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#0B0C0E] text-white shadow-sm"
                    : "text-[#4A4E57] hover:bg-[#FAFAFA] hover:text-[#0B0C0E]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {/* =========================================================================
            TAB 1: OVERVIEW
        ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {renderCohortBinFilterBar()}
            {/* Top Stat Tiles */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
              <div className="p-5 rounded-2xl border border-[#E9E7E1] bg-white shadow-sm">
                <span className="font-mono text-[10px] text-[#737883] uppercase tracking-wide block mb-1">
                  Total Applicants
                </span>
                <span className="text-3xl font-bold tracking-tight text-[#0B0C0E] block">
                  {metrics?.total || 0}
                </span>
                <span className="text-[11px] text-[#737883] mt-1 block">All registered cohorts</span>
              </div>

              <div className="p-5 rounded-2xl border border-[#E9E7E1] bg-white shadow-sm">
                <span className="font-mono text-[10px] text-[#2F5BFF] uppercase tracking-wide block mb-1">
                  BTech Engineering
                </span>
                <span className="text-3xl font-bold tracking-tight text-[#2F5BFF] block">
                  {metrics?.btech || 0}
                </span>
                <span className="text-[11px] text-[#737883] mt-1 block">AI/ML &amp; Software</span>
              </div>

              <div className="p-5 rounded-2xl border border-[#E9E7E1] bg-white shadow-sm">
                <span className="font-mono text-[10px] text-[#0B0C0E] uppercase tracking-wide block mb-1">
                  MBA Commercial
                </span>
                <span className="text-3xl font-bold tracking-tight text-[#0B0C0E] block">
                  {metrics?.mba || 0}
                </span>
                <span className="text-[11px] text-[#737883] mt-1 block">Sales &amp; Marketing</span>
              </div>

              <div className="p-5 rounded-2xl border border-[#E9E7E1] bg-white shadow-sm">
                <span className="font-mono text-[10px] text-amber-600 uppercase tracking-wide block mb-1">
                  Under Review
                </span>
                <span className="text-3xl font-bold tracking-tight text-amber-600 block">
                  {(metrics?.underReview || 0) + (metrics?.submitted || 0)}
                </span>
                <span className="text-[11px] text-[#737883] mt-1 block">Pending screening</span>
              </div>

              <div className="p-5 rounded-2xl border border-[#E9E7E1] bg-white shadow-sm">
                <span className="font-mono text-[10px] text-emerald-600 uppercase tracking-wide block mb-1">
                  Shortlisted / Interview
                </span>
                <span className="text-3xl font-bold tracking-tight text-emerald-600 block">
                  {(metrics?.shortlisted || 0) + (metrics?.interview || 0)}
                </span>
                <span className="text-[11px] text-[#737883] mt-1 block">Advancing candidates</span>
              </div>
            </div>

            {/* Middle Section: Recent Applications & Position Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Applications (2 cols) */}
              <div className="lg:col-span-2 p-6 rounded-3xl border border-[#E9E7E1] bg-white shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E9E7E1]">
                  <div>
                    <h3 className="text-base font-semibold text-[#0B0C0E]">Recent Applications</h3>
                    <p className="text-xs text-[#737883]">Latest candidates submitted via portal</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("applicants")}
                    className="text-xs font-mono text-[#2F5BFF] hover:underline"
                  >
                    View All →
                  </button>
                </div>

                {recentApplications.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#737883]">
                    No applications received yet.
                  </div>
                ) : (
                  <div className="divide-y divide-[#E9E7E1]">
                    {recentApplications.map((app) => (
                      <div
                        key={app.id}
                        className="py-3 flex items-center justify-between gap-4 hover:bg-[#FAFAFA] px-2 rounded-xl transition-colors cursor-pointer"
                        onClick={() => openApplicant(app.id)}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm text-[#0B0C0E]">{app.full_name}</span>
                            <span className="font-mono text-[10px] text-[#737883]">
                              {app.application_reference}
                            </span>
                          </div>
                          <p className="text-xs text-[#737883]">
                            {app.branch || app.mba_specialization || "Candidate"} · Batch {app.graduation_year}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          {renderStatusBadge(app.application_status)}
                          <span className="text-xs font-mono text-[#737883]">
                            {new Date(app.submitted_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Position Distribution (1 col) */}
              <div className="p-6 rounded-3xl border border-[#E9E7E1] bg-white shadow-sm space-y-4">
                <div className="pb-3 border-b border-[#E9E7E1]">
                  <h3 className="text-base font-semibold text-[#0B0C0E]">Demand by Role</h3>
                  <p className="text-xs text-[#737883]">Distribution across positions applied</p>
                </div>

                <div className="space-y-3">
                  {positionStats.map((pos) => {
                    const percent = (metrics?.total || 0) > 0 ? Math.round((pos.count / (metrics?.total || 1)) * 100) : 0;
                    return (
                      <div key={pos.position_name} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-[#0B0C0E] line-clamp-1">
                            {pos.position_name}
                          </span>
                          <span className="font-mono text-[#737883]">{pos.count}</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#F0EFEB] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#2F5BFF]"
                            style={{ width: `${Math.min(percent, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: APPLICANTS MANAGEMENT
        ========================================================================= */}
        {activeTab === "applicants" && (
          <div className="space-y-5">
            {renderCohortBinFilterBar()}
            {/* Search & Filters Bar */}
            <div className="p-4 rounded-2xl border border-[#E9E7E1] bg-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search Box */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-[#737883] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    loadApplications(e.target.value);
                  }}
                  placeholder="Search name, email, roll number, or role..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E9E7E1] bg-[#FAFAFA] text-xs text-[#0B0C0E] placeholder-[#737883] focus:outline-none focus:border-[#0B0C0E] focus:bg-white transition-all font-sans"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                {/* Type Filter */}
                <select
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-[#E9E7E1] bg-[#FAFAFA] text-xs text-[#0B0C0E] focus:outline-none"
                >
                  <option value="all">All Cohorts</option>
                  <option value="btech">BTech Hiring</option>
                  <option value="mba">MBA Hiring</option>
                  <option value="internship">Internship</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-[#E9E7E1] bg-[#FAFAFA] text-xs text-[#0B0C0E] focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview">Interview</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>

                {/* Graduation Year Filter */}
                <select
                  value={gradYearFilter}
                  onChange={(e) => {
                    setGradYearFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-[#E9E7E1] bg-[#FAFAFA] text-xs text-[#0B0C0E] focus:outline-none"
                >
                  <option value="all">All Batches</option>
                  <option value="2026">Batch of 2026</option>
                  <option value="2025">Batch of 2025</option>
                  <option value="2027">Batch of 2027</option>
                </select>

                <button
                  onClick={() => {
                    setSearchQuery("");
                    setTypeFilter("all");
                    setStatusFilter("all");
                    setGradYearFilter("all");
                    setCurrentPage(1);
                    loadApplications("");
                  }}
                  className="p-2 rounded-xl border border-[#E9E7E1] text-[#737883] hover:text-[#0B0C0E]"
                  title="Reset Filters"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Applications Table */}
            <div className="rounded-2xl border border-[#E9E7E1] bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAFAFA] border-b border-[#E9E7E1] text-[#737883] font-mono text-[10px] uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Ref Code</th>
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4">Cohort</th>
                      <th className="py-3 px-4">Applied Positions</th>
                      <th className="py-3 px-4">Grad Year</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9E7E1]">
                    {listLoading ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-xs text-[#737883]">
                          Loading candidate registry...
                        </td>
                      </tr>
                    ) : applications.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-xs text-[#737883]">
                          No candidate records found matching current query.
                        </td>
                      </tr>
                    ) : (
                      applications.map((app) => (
                        <tr
                          key={app.id}
                          className="hover:bg-[#FAFAFA] transition-colors cursor-pointer"
                          onClick={() => openApplicant(app.id)}
                        >
                          <td className="py-3 px-4 font-mono font-medium text-[#2F5BFF]">
                            {app.application_reference}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-[#0B0C0E]">{app.full_name}</div>
                            <div className="font-mono text-[11px] text-[#737883]">{app.email}</div>
                          </td>
                          <td className="py-3 px-4 font-mono uppercase text-[10px] font-semibold text-[#4A4E57]">
                            {app.applicant_type}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {(app.positions || []).slice(0, 2).map((pos, pI) => (
                                <span
                                  key={pI}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-[#FAFAFA] border border-[#E9E7E1] text-[#4A4E57] line-clamp-1"
                                >
                                  {pos}
                                </span>
                              ))}
                              {(app.positions || []).length > 2 && (
                                <span className="text-[10px] text-[#737883]">
                                  +{(app.positions || []).length - 2}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono text-[#0B0C0E]">
                            {app.graduation_year}
                          </td>
                          <td className="py-3 px-4">{renderStatusBadge(app.application_status)}</td>
                          <td className="py-3 px-4 font-mono text-[11px] text-[#737883]">
                            {new Date(app.submitted_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openApplicant(app.id);
                              }}
                              className="px-3 py-1 rounded-lg border border-[#E9E7E1] bg-white text-xs font-medium text-[#0B0C0E] hover:bg-[#0B0C0E] hover:text-white transition-all inline-flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Inspect</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination */}
              <div className="py-3 px-4 bg-[#FAFAFA] border-t border-[#E9E7E1] flex items-center justify-between text-xs text-[#737883]">
                <span>
                  Showing {applications.length} of {totalApps} candidate profiles
                </span>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-[#E9E7E1] bg-white disabled:opacity-40"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-xs text-[#0B0C0E]">Page {currentPage}</span>
                  <button
                    disabled={applications.length < 12}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="p-1.5 rounded-lg border border-[#E9E7E1] bg-white disabled:opacity-40"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: ANALYTICS & TRENDS
        ========================================================================= */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Funnel Distribution */}
              <div className="p-6 rounded-3xl border border-[#E9E7E1] bg-white shadow-sm space-y-4">
                <div className="pb-3 border-b border-[#E9E7E1]">
                  <h3 className="text-base font-semibold text-[#0B0C0E]">Candidate Funnel Stages</h3>
                  <p className="text-xs text-[#737883]">Conversion drop-off across evaluation milestones</p>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    { label: "Submitted", count: metrics?.submitted || 0, color: "bg-blue-500" },
                    { label: "Under Review", count: metrics?.underReview || 0, color: "bg-amber-500" },
                    { label: "Shortlisted", count: metrics?.shortlisted || 0, color: "bg-indigo-500" },
                    { label: "Interview Scheduled", count: metrics?.interview || 0, color: "bg-purple-500" },
                    { label: "Offer Selected", count: metrics?.selected || 0, color: "bg-emerald-500" },
                    { label: "Rejected / Withdrawn", count: metrics?.rejected || 0, color: "bg-rose-500" },
                  ].map((stage) => {
                    const totalCount = metrics?.total || 0;
                    const pct = totalCount > 0 ? Math.round((stage.count / totalCount) * 100) : 0;
                    return (
                      <div key={stage.label} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-[#0B0C0E]">{stage.label}</span>
                          <span className="font-mono text-[#737883]">
                            {stage.count} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-[#F0EFEB] rounded-full overflow-hidden">
                          <div
                            className={`h-full ${stage.color}`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Graduation Batch Distribution */}
              <div className="p-6 rounded-3xl border border-[#E9E7E1] bg-white shadow-sm space-y-4">
                <div className="pb-3 border-b border-[#E9E7E1]">
                  <h3 className="text-base font-semibold text-[#0B0C0E]">Graduation Year Metrics</h3>
                  <p className="text-xs text-[#737883]">Cohort breakdown across graduating years</p>
                </div>

                <div className="space-y-3 pt-2">
                  {gradYearStats.map((yr) => {
                    const totalCount = metrics?.total || 0;
                    const pct = totalCount > 0 ? Math.round((yr.count / totalCount) * 100) : 0;
                    return (
                      <div key={yr.graduation_year} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-[#0B0C0E]">
                            Batch of {yr.graduation_year}
                          </span>
                          <span className="font-mono text-[#737883]">
                            {yr.count} applicants ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-[#F0EFEB] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#0B0C0E]"
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: EXPORT APPLICANTS
        ========================================================================= */}
        {activeTab === "export" && (
          <div className="max-w-2xl mx-auto p-8 rounded-3xl border border-[#E9E7E1] bg-white shadow-sm space-y-6">
            <div>
              <div className="w-12 h-12 rounded-2xl border border-[#E9E7E1] bg-[#FAFAFA] flex items-center justify-center text-[#2F5BFF] mb-3">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold text-[#0B0C0E]">Export Applicant Records</h2>
              <p className="text-xs text-[#737883] mt-1">
                Download structured recruitment records in XLSX (Excel) or CSV formats with secure resume access links.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wide text-[#4A4E57] mb-1.5">
                  Cohort Filter
                </label>
                <select
                  value={exportType}
                  onChange={(e) => setExportType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E9E7E1] bg-[#FAFAFA] text-xs text-[#0B0C0E]"
                >
                  <option value="all">All Applicants (BTech + MBA + Internship)</option>
                  <option value="btech">BTech Hiring Only</option>
                  <option value="mba">MBA Hiring Only</option>
                  <option value="internship">Internship Registrations Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wide text-[#4A4E57] mb-1.5">
                  Status Filter
                </label>
                <select
                  value={exportStatus}
                  onChange={(e) => setExportStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E9E7E1] bg-[#FAFAFA] text-xs text-[#0B0C0E]"
                >
                  <option value="all">All Application Statuses</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview">Interview</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wide text-[#4A4E57] mb-1.5">
                  Export File Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "xlsx", label: "Microsoft Excel (.xlsx)", icon: FileSpreadsheet },
                    { id: "csv", label: "Standard CSV (.csv)", icon: FileText },
                  ].map((fmt) => {
                    const isSelected = exportFormat === fmt.id;
                    return (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setExportFormat(fmt.id)}
                        className={`p-3.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                          isSelected
                            ? "bg-[#0B0C0E] text-white border-[#0B0C0E]"
                            : "bg-white text-[#4A4E57] border-[#E9E7E1] hover:border-[#0B0C0E]/30"
                        }`}
                      >
                        <fmt.icon className="w-4 h-4 shrink-0" />
                        <span className="text-xs font-medium">{fmt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4">
                <a
                  href={`/api/ca/admin/export?format=${exportFormat}&type=${exportType}&status=${exportStatus}`}
                  download
                  className="w-full py-3.5 rounded-xl bg-[#2F5BFF] text-white text-xs font-semibold hover:bg-[#2563EB] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Generate &amp; Download {exportFormat.toUpperCase()} Export</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: RECRUITMENT FORM & BINS STUDIO
        ========================================================================= */}
        {activeTab === "form_studio" && (
          <div className="space-y-8">
            {/* Header & Global Status Notification */}
            <div className="p-6 rounded-3xl border border-[#E9E7E1] bg-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-5 h-5 text-[#2F5BFF]" />
                  <h2 className="text-lg font-bold tracking-tight text-[#0B0C0E]">
                    Recruitment Form &amp; Bins Studio
                  </h2>
                </div>
                <p className="text-xs text-[#737883] mt-1 max-w-2xl leading-relaxed">
                  Manage candidate intake cycles (Bins), dynamically toggle role application forms on or off, and customize mandatory requirements so candidates cannot proceed without filling vital information.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => handleSaveSettings()}
                  disabled={formSettingsSaving}
                  className="px-5 py-2.5 rounded-xl bg-[#0B0C0E] hover:bg-black text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {formSettingsSaving ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-[#2F5BFF]" />
                  ) : (
                    <Check className="w-4 h-4 text-emerald-400" />
                  )}
                  <span>{formSettingsSaving ? "Saving Config..." : "Save Settings"}</span>
                </button>
              </div>
            </div>

            {settingsFeedback && (
              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50 text-xs text-emerald-800 flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{settingsFeedback}</span>
                </div>
                <button onClick={() => setSettingsFeedback("")} className="text-emerald-600 hover:text-emerald-900">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* SECTION 1: MASTER RECRUITMENT TOGGLES & BINS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Master Global Toggle Card */}
              <div className="p-6 rounded-3xl border border-[#E9E7E1] bg-white shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E9E7E1]">
                  <div>
                    <h3 className="text-sm font-semibold text-[#0B0C0E]">Global Applications Gate</h3>
                    <p className="text-[11px] text-[#737883]">Master on/off switch for entire career portal</p>
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full ${formSettings?.globalOpen ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-[#E9E7E1] bg-[#FAFAFA]">
                  <div>
                    <span className="text-xs font-bold text-[#0B0C0E] block">
                      {formSettings?.globalOpen ? "Applications ACTIVE (Open)" : "Applications PAUSED (Closed)"}
                    </span>
                    <span className="text-[10px] text-[#737883]">
                      {formSettings?.globalOpen ? "Accepting candidate submissions" : "Portal shows closed notice"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={toggleGlobalOpen}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
                      formSettings?.globalOpen
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        : "bg-rose-100 text-rose-800 hover:bg-rose-200"
                    }`}
                  >
                    {formSettings?.globalOpen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    <span>{formSettings?.globalOpen ? "Turn OFF" : "Turn ON"}</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl border border-[#E9E7E1] bg-white text-xs space-y-2">
                  <span className="font-mono text-[10px] uppercase text-[#737883] tracking-wider block font-semibold">
                    Active Intake Destination Bin
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#0B0C0E]">
                      {binsList.find((b) => b.id === formSettings?.activeBinId)?.name || "Active Intake Bin"}
                    </span>
                    <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      {formSettings?.activeBinId}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#737883]">
                    New candidate submissions are automatically stamped with this bin ID.
                  </p>
                </div>
              </div>

              {/* Cohort Bins Management (2 cols) */}
              <div className="lg:col-span-2 p-6 rounded-3xl border border-[#E9E7E1] bg-white shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E9E7E1]">
                  <div>
                    <h3 className="text-sm font-semibold text-[#0B0C0E]">Cohort Bins Registry</h3>
                    <p className="text-[11px] text-[#737883]">
                      Existing candidate data is preserved in historical archive bins.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNewBinModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-[#2F5BFF] hover:bg-[#2563EB] text-white text-xs font-medium shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Bin</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {binsList.map((bin) => {
                    const isActive = bin.id === formSettings?.activeBinId;
                    return (
                      <div
                        key={bin.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isActive
                            ? "border-emerald-300 bg-emerald-50/30"
                            : "border-[#E9E7E1] bg-[#FAFAFA] hover:bg-white"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#0B0C0E]">{bin.name}</span>
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-white border border-[#E9E7E1] text-[#737883]">
                              {bin.id}
                            </span>
                            {isActive && (
                              <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                                ACTIVE INTAKE
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#737883] leading-relaxed">{bin.description}</p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <span className="font-mono text-sm font-bold text-[#0B0C0E] block">
                              {bin.applicationCount ?? 0}
                            </span>
                            <span className="text-[10px] text-[#737883]">Candidates</span>
                          </div>

                          {!isActive && (
                            <button
                              type="button"
                              onClick={() => handleSetActiveBin(bin.id)}
                              className="px-3 py-1.5 rounded-xl border border-[#E9E7E1] bg-white text-xs font-medium hover:border-[#0B0C0E] transition-colors"
                            >
                              Set as Active
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SECTION 2: ROLE APPLICATION FORMS & DYNAMIC FIELD STUDIO */}
            <div className="p-6 rounded-3xl border border-[#E9E7E1] bg-white shadow-sm space-y-6">
              {/* Role Sub-Tabs & Role Open/Close Switch */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9E7E1]">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStudioRole("btech")}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      studioRole === "btech"
                        ? "bg-[#2F5BFF] text-white shadow-sm"
                        : "bg-[#FAFAFA] text-[#4A4E57] hover:bg-[#F0EFEB]"
                    }`}
                  >
                    B.Tech Machine Learning Track
                  </button>
                  <button
                    type="button"
                    onClick={() => setStudioRole("mba")}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      studioRole === "mba"
                        ? "bg-[#2F5BFF] text-white shadow-sm"
                        : "bg-[#FAFAFA] text-[#4A4E57] hover:bg-[#F0EFEB]"
                    }`}
                  >
                    MBA Management &amp; Operations Track
                  </button>
                </div>

                {formSettings && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#737883]">
                      Role Status: <strong>{formSettings[studioRole].isOpen ? "OPEN" : "CLOSED"}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleRoleOpen(studioRole)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
                        formSettings[studioRole].isOpen
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-rose-100 text-rose-800 hover:bg-rose-200"
                      }`}
                    >
                      {formSettings[studioRole].isOpen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                      <span>{formSettings[studioRole].isOpen ? "Turn Form OFF" : "Turn Form ON"}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Role Header Info */}
              {formSettings && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl border border-[#E9E7E1] bg-[#FAFAFA]">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#737883] mb-1">
                      Role Headline
                    </label>
                    <input
                      type="text"
                      value={formSettings[studioRole].headline}
                      onChange={(e) => {
                        setFormSettings({
                          ...formSettings,
                          [studioRole]: { ...formSettings[studioRole], headline: e.target.value },
                        });
                      }}
                      className="w-full px-3 py-1.5 rounded-xl border border-[#E9E7E1] bg-white text-xs font-medium text-[#0B0C0E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#737883] mb-1">
                      Message Shown When Application is Closed
                    </label>
                    <input
                      type="text"
                      value={formSettings[studioRole].closedMessage}
                      onChange={(e) => {
                        setFormSettings({
                          ...formSettings,
                          [studioRole]: { ...formSettings[studioRole], closedMessage: e.target.value },
                        });
                      }}
                      className="w-full px-3 py-1.5 rounded-xl border border-[#E9E7E1] bg-white text-xs font-medium text-[#0B0C0E]"
                    />
                  </div>
                </div>
              )}

              {/* Field Configuration Header & Action */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-[#0B0C0E]">Form Field Requirements &amp; Steps</h4>
                  <p className="text-xs text-[#737883]">
                    Toggle field visibility and mark requirements as mandatory so candidates cannot go to the next step without filling.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setNewFieldStep(6);
                    setCustomFieldModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl border border-[#2F5BFF] bg-[#2F5BFF]/10 text-[#2F5BFF] hover:bg-[#2F5BFF] hover:text-white text-xs font-medium transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Custom Question</span>
                </button>
              </div>

              {/* Step-by-Step Fields Studio */}
              {formSettings && (
                <div className="space-y-6">
                  {[1, 2, 3, 4, 5, 6, 7].map((stepNumber) => {
                    const stepFields = formSettings[studioRole].fields.filter((f) => f.step === stepNumber);
                    if (stepFields.length === 0 && stepNumber !== 6) return null;

                    const stepLabels: Record<number, string> = {
                      1: "Step 1: Personal & Identification Details",
                      2: "Step 2: Academic Qualifications",
                      3: "Step 3: Target Role & Position Track",
                      4: "Step 4: Technical Skills & Profile Links",
                      5: "Step 5: Relocation & In-person Presence",
                      6: "Step 6: Custom Role Questions & Assessments",
                      7: "Step 7: Curriculum Vitae / Resume Document",
                    };

                    return (
                      <div key={stepNumber} className="border border-[#E9E7E1] rounded-2xl overflow-hidden bg-white">
                        <div className="px-4 py-2.5 bg-[#FAFAFA] border-b border-[#E9E7E1] flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-[#0B0C0E]">
                            {stepLabels[stepNumber] || `Step ${stepNumber}`}
                          </span>
                          <span className="text-[11px] text-[#737883] font-mono">
                            {stepFields.length} field{stepFields.length !== 1 ? "s" : ""}
                          </span>
                        </div>

                        {stepFields.length === 0 ? (
                          <div className="p-4 text-center text-xs text-[#737883]">
                            No custom questions added yet. Click &quot;+ Add Custom Question&quot; above to add questions for this step.
                          </div>
                        ) : (
                          <div className="divide-y divide-[#E9E7E1]">
                            {stepFields.map((field) => (
                              <div
                                key={field.id}
                                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAFAFA]/60 transition-colors"
                              >
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-[#0B0C0E]">{field.label}</span>
                                    {field.required && (
                                      <span className="text-rose-500 font-bold" title="Required field">*</span>
                                    )}
                                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#F0EFEB] text-[#737883]">
                                      {field.id}
                                    </span>
                                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                      {field.type}
                                    </span>
                                    {field.isCustom && (
                                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                                        Custom
                                      </span>
                                    )}
                                  </div>
                                  {field.placeholder && (
                                    <p className="text-[11px] text-[#737883]">Placeholder: {field.placeholder}</p>
                                  )}
                                </div>

                                <div className="flex items-center gap-4 shrink-0">
                                  {/* Enabled Toggle */}
                                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                                    <input
                                      type="checkbox"
                                      checked={field.enabled}
                                      onChange={() => toggleFieldEnabled(studioRole, field.id)}
                                      className="rounded border-[#E9E7E1] text-[#2F5BFF] focus:ring-0"
                                    />
                                    <span className={field.enabled ? "text-[#0B0C0E] font-medium" : "text-[#737883]"}>
                                      Visible in Form
                                    </span>
                                  </label>

                                  {/* Required Toggle */}
                                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                                    <input
                                      type="checkbox"
                                      checked={field.required}
                                      onChange={() => toggleFieldRequired(studioRole, field.id)}
                                      className="rounded border-[#E9E7E1] text-rose-600 focus:ring-0"
                                    />
                                    <span className={field.required ? "text-rose-600 font-semibold" : "text-[#737883]"}>
                                      Mandatory (* Required to proceed)
                                    </span>
                                  </label>

                                  {/* Delete Custom Field */}
                                  {field.isCustom && (
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteCustomField(studioRole, field.id)}
                                      className="p-1 rounded text-red-500 hover:bg-red-50 transition-colors"
                                      title="Delete custom question"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Bottom Save Action Button */}
              <div className="pt-4 border-t border-[#E9E7E1] flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveSettings()}
                  disabled={formSettingsSaving}
                  className="px-6 py-3 rounded-xl bg-[#0B0C0E] hover:bg-black text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {formSettingsSaving ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-[#2F5BFF]" />
                  ) : (
                    <Check className="w-4 h-4 text-emerald-400" />
                  )}
                  <span>{formSettingsSaving ? "Saving Configuration..." : "Save All Form Configuration"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =========================================================================
          APPLICANT DETAIL DRAWER / MODAL
      ========================================================================= */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-2xl h-full bg-white border-l border-[#E9E7E1] flex flex-col justify-between shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#E9E7E1] sticky top-0 bg-white z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#2F5BFF]">
                    {selectedApp.application.application_reference}
                  </span>
                  {renderStatusBadge(selectedApp.application.application_status)}
                </div>
                <h3 className="text-xl font-semibold text-[#0B0C0E] mt-1">
                  {selectedApp.application.full_name}
                </h3>
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                className="w-8 h-8 rounded-full border border-[#E9E7E1] flex items-center justify-center text-[#737883] hover:text-[#0B0C0E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-6 flex-1">
              {/* Contact & Personal */}
              <div className="p-4 rounded-2xl border border-[#E9E7E1] bg-[#FAFAFA] space-y-3">
                <span className="font-mono text-[10px] uppercase text-[#737883] tracking-wide block font-semibold">
                  Contact Channels
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#737883] block">Email:</span>
                    <a
                      href={`mailto:${selectedApp.application.email}`}
                      className="font-mono text-[#0B0C0E] hover:underline"
                    >
                      {selectedApp.application.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-[#737883] block">Mobile:</span>
                    <span className="font-mono text-[#0B0C0E]">{selectedApp.application.mobile}</span>
                  </div>
                  <div>
                    <span className="text-[#737883] block">Roll Number:</span>
                    <span className="font-mono text-[#0B0C0E]">
                      {selectedApp.application.college_roll_number}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#737883] block">College:</span>
                    <span className="text-[#0B0C0E]">
                      {selectedApp.application.college_name || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Academics & Positions */}
              <div className="p-4 rounded-2xl border border-[#E9E7E1] bg-[#FAFAFA] space-y-3">
                <span className="font-mono text-[10px] uppercase text-[#737883] tracking-wide block font-semibold">
                  Academic &amp; Role Credentials
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#737883] block">Branch / Specialization:</span>
                    <span className="font-medium text-[#0B0C0E]">
                      {selectedApp.application.branch || selectedApp.application.mba_specialization || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#737883] block">CGPA / Percentage:</span>
                    <span className="font-mono font-medium text-[#0B0C0E]">
                      {selectedApp.application.current_cgpa || selectedApp.application.current_percentage || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#737883] block">Graduation Batch:</span>
                    <span className="font-mono text-[#0B0C0E]">
                      {selectedApp.application.graduation_year}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#737883] block">Relocate to Hyderabad:</span>
                    <span className="font-medium text-[#0B0C0E]">
                      {selectedApp.application.relocation_willingness}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E9E7E1]">
                  <span className="text-[#737883] text-xs block mb-1">Applied Roles:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedApp.positions || []).map((p: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-white border border-[#E9E7E1] text-xs font-medium text-[#0B0C0E]"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Skills & Portfolio Links */}
              <div className="p-4 rounded-2xl border border-[#E9E7E1] bg-white space-y-3">
                <span className="font-mono text-[10px] uppercase text-[#737883] tracking-wide block font-semibold">
                  Skills, Portfolio &amp; Experience
                </span>

                <div className="text-xs space-y-2">
                  <div>
                    <span className="text-[#737883] block">Skills / Strengths:</span>
                    <p className="text-[#0B0C0E] mt-0.5 leading-relaxed">
                      {selectedApp.application.technical_skills || selectedApp.application.skills_strengths || "N/A"}
                    </p>
                  </div>

                  {selectedApp.application.previous_experience && (
                    <div>
                      <span className="text-[#737883] block">Previous Experience:</span>
                      <p className="text-[#0B0C0E] mt-0.5 leading-relaxed">
                        {selectedApp.application.previous_experience}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-4 pt-2">
                    {selectedApp.application.github_url && (
                      <a
                        href={selectedApp.application.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#2F5BFF] hover:underline"
                      >
                        <span>GitHub Profile</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {selectedApp.application.linkedin_url && (
                      <a
                        href={selectedApp.application.linkedin_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#2F5BFF] hover:underline"
                      >
                        <span>LinkedIn Profile</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Resume Download / Preview Section */}
              <div className="p-4 rounded-2xl border border-[#E9E7E1] bg-[#FAFAFA] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-[#2F5BFF]" />
                  <div>
                    <span className="text-xs font-semibold text-[#0B0C0E] block">
                      Applicant Resume Document
                    </span>
                    <span className="font-mono text-[10px] text-[#737883]">
                      Secure Private R2 Storage
                    </span>
                  </div>
                </div>

                {selectedApp.application.resume_object_key ? (
                  <a
                    href={`/api/ca/admin/applications/${selectedApp.application.id}/resume`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B0C0E] text-white text-xs font-medium hover:bg-black transition-colors"
                  >
                    <span>View / Download Resume</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-xs text-[#737883] font-mono">No resume attached</span>
                )}
              </div>

              {/* Status Update Control */}
              <div className="p-4 rounded-2xl border border-[#E9E7E1] bg-white space-y-3">
                <span className="font-mono text-[10px] uppercase text-[#737883] tracking-wide block font-semibold">
                  Update Application Status
                </span>
                <div className="flex gap-2">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-[#E9E7E1] text-xs font-medium text-[#0B0C0E] bg-[#FAFAFA]"
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview">Interview</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <button
                    onClick={handleStatusUpdate}
                    disabled={statusUpdating || newStatus === selectedApp.application.application_status}
                    className="px-4 py-2 rounded-xl bg-[#0B0C0E] text-white text-xs font-semibold hover:bg-black transition-all disabled:opacity-40"
                  >
                    {statusUpdating ? "Saving..." : "Commit Status"}
                  </button>
                </div>
              </div>

              {/* Admin Notes Section */}
              <div className="p-4 rounded-2xl border border-[#E9E7E1] bg-white space-y-3">
                <span className="font-mono text-[10px] uppercase text-[#737883] tracking-wide block font-semibold flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#2F5BFF]" />
                  <span>Admin Evaluation Notes</span>
                </span>

                <form onSubmit={handleAddNote} className="space-y-2">
                  <textarea
                    rows={2}
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Log internal interviewer impressions or evaluation notes..."
                    className="w-full px-3 py-2 rounded-xl border border-[#E9E7E1] text-xs text-[#0B0C0E] placeholder-[#737883] focus:outline-none focus:border-[#0B0C0E] resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={noteSubmitting || !newNote.trim()}
                      className="px-3 py-1.5 rounded-lg bg-[#0B0C0E] text-white text-xs font-medium disabled:opacity-40"
                    >
                      {noteSubmitting ? "Logging..." : "Add Note"}
                    </button>
                  </div>
                </form>

                {selectedApp.notes && selectedApp.notes.length > 0 && (
                  <div className="space-y-2 pt-2 divide-y divide-[#E9E7E1]">
                    {selectedApp.notes.map((n) => (
                      <div key={n.id} className="pt-2 text-xs">
                        <div className="flex justify-between font-mono text-[10px] text-[#737883]">
                          <span>{n.admin_id}</span>
                          <span>{new Date(n.created_at).toLocaleString()}</span>
                        </div>
                        <p className="text-[#0B0C0E] mt-0.5">{n.note}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Application Timeline Audit Log */}
              <div className="p-4 rounded-2xl border border-[#E9E7E1] bg-[#FAFAFA] space-y-3">
                <span className="font-mono text-[10px] uppercase text-[#737883] tracking-wide block font-semibold flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-[#737883]" />
                  <span>Audit History Timeline</span>
                </span>

                <div className="space-y-2 text-xs">
                  {selectedApp.events &&
                    selectedApp.events.map((ev) => (
                      <div key={ev.id} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2F5BFF] mt-1.5 shrink-0" />
                        <div>
                          <p className="text-[#0B0C0E]">{ev.event_description}</p>
                          <span className="font-mono text-[10px] text-[#737883]">
                            {new Date(ev.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Loading indicator */}
      {modalLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-xs">
          <div className="bg-white p-4 rounded-xl border border-[#E9E7E1] shadow-lg flex items-center gap-2 text-xs font-mono">
            <RefreshCw className="w-4 h-4 animate-spin text-[#2F5BFF]" />
            <span>Loading applicant dossier...</span>
          </div>
        </div>
      )}

      {/* CREATE NEW BIN MODAL */}
      {newBinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-3xl border border-[#E9E7E1] p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E7E1]">
              <div className="flex items-center gap-2">
                <FolderArchive className="w-4 h-4 text-[#2F5BFF]" />
                <h3 className="text-sm font-bold text-[#0B0C0E]">Create New Intake Cohort Bin</h3>
              </div>
              <button onClick={() => setNewBinModalOpen(false)} className="text-[#737883] hover:text-[#0B0C0E]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#0B0C0E] mb-1">
                  Cohort / Bin Name *
                </label>
                <input
                  type="text"
                  required
                  value={newBinName}
                  onChange={(e) => setNewBinName(e.target.value)}
                  placeholder="e.g. Spring 2027 Walk-in Drive"
                  className="w-full px-3 py-2 rounded-xl border border-[#E9E7E1] bg-[#FAFAFA] text-xs text-[#0B0C0E] focus:outline-none focus:border-[#0B0C0E]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#0B0C0E] mb-1">
                  Description / Purpose
                </label>
                <textarea
                  rows={2}
                  value={newBinDesc}
                  onChange={(e) => setNewBinDesc(e.target.value)}
                  placeholder="e.g. Intake cohort for Spring 2027 recruitment cycle"
                  className="w-full px-3 py-2 rounded-xl border border-[#E9E7E1] bg-[#FAFAFA] text-xs text-[#0B0C0E] focus:outline-none focus:border-[#0B0C0E] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#0B0C0E] mb-1">
                  Target Candidate Roles
                </label>
                <select
                  value={newBinRole}
                  onChange={(e) => setNewBinRole(e.target.value as "all" | "btech" | "mba")}
                  className="w-full px-3 py-2 rounded-xl border border-[#E9E7E1] bg-[#FAFAFA] text-xs text-[#0B0C0E] focus:outline-none"
                >
                  <option value="all">All Roles (Both B.Tech &amp; MBA)</option>
                  <option value="btech">B.Tech ML Only</option>
                  <option value="mba">MBA Commercial Only</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewBinModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E9E7E1] text-xs font-medium text-[#737883] hover:text-[#0B0C0E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={newBinCreating || !newBinName.trim()}
                  className="px-5 py-2 rounded-xl bg-[#0B0C0E] text-white text-xs font-semibold hover:bg-black transition-colors disabled:opacity-50"
                >
                  {newBinCreating ? "Creating..." : "Create Bin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD CUSTOM FIELD MODAL */}
      {customFieldModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-[#E9E7E1] p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E7E1]">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#2F5BFF]" />
                <h3 className="text-sm font-bold text-[#0B0C0E]">Add Question to {studioRole.toUpperCase()} Form</h3>
              </div>
              <button onClick={() => setCustomFieldModalOpen(false)} className="text-[#737883] hover:text-[#0B0C0E]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomField} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-[#0B0C0E] mb-1">
                    Question / Field Label *
                  </label>
                  <input
                    type="text"
                    required
                    value={newFieldLabel}
                    onChange={(e) => setNewFieldLabel(e.target.value)}
                    placeholder="e.g. Portfolio Website or Kaggle Profile"
                    className="w-full px-3 py-2 rounded-xl border border-[#E9E7E1] bg-[#FAFAFA] text-xs text-[#0B0C0E] focus:outline-none focus:border-[#0B0C0E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#0B0C0E] mb-1">
                    Input Field Type
                  </label>
                  <select
                    value={newFieldType}
                    onChange={(e) => setNewFieldType(e.target.value as "text" | "number" | "select" | "textarea" | "url")}
                    className="w-full px-3 py-2 rounded-xl border border-[#E9E7E1] bg-[#FAFAFA] text-xs text-[#0B0C0E] focus:outline-none"
                  >
                    <option value="text">Single Line Text</option>
                    <option value="textarea">Multi-line Paragraph</option>
                    <option value="number">Numeric</option>
                    <option value="url">Web Link (URL)</option>
                    <option value="select">Dropdown Selection</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#0B0C0E] mb-1">
                    Form Step Placement
                  </label>
                  <select
                    value={newFieldStep}
                    onChange={(e) => setNewFieldStep(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E9E7E1] bg-[#FAFAFA] text-xs text-[#0B0C0E] focus:outline-none"
                  >
                    <option value={1}>Step 1: Personal</option>
                    <option value={2}>Step 2: Academics</option>
                    <option value={3}>Step 3: Position</option>
                    <option value={4}>Step 4: Skills</option>
                    <option value={5}>Step 5: Relocation</option>
                    <option value={6}>Step 6: Custom Questions</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-[#0B0C0E] mb-1">
                    Placeholder Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={newFieldPlaceholder}
                    onChange={(e) => setNewFieldPlaceholder(e.target.value)}
                    placeholder="e.g. https://portfolio.dev or Enter details..."
                    className="w-full px-3 py-2 rounded-xl border border-[#E9E7E1] bg-[#FAFAFA] text-xs text-[#0B0C0E] focus:outline-none focus:border-[#0B0C0E]"
                  />
                </div>

                {newFieldType === "select" && (
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-[#0B0C0E] mb-1">
                      Options (Comma-separated) *
                    </label>
                    <input
                      type="text"
                      value={newFieldOptions}
                      onChange={(e) => setNewFieldOptions(e.target.value)}
                      placeholder="e.g. Option A, Option B, Option C"
                      className="w-full px-3 py-2 rounded-xl border border-[#E9E7E1] bg-[#FAFAFA] text-xs text-[#0B0C0E] focus:outline-none focus:border-[#0B0C0E]"
                    />
                  </div>
                )}

                <div className="col-span-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-rose-200 bg-rose-50/50">
                    <input
                      type="checkbox"
                      checked={newFieldRequired}
                      onChange={(e) => setNewFieldRequired(e.target.checked)}
                      className="rounded border-rose-300 text-rose-600 focus:ring-0"
                    />
                    <div>
                      <span className="text-xs font-bold text-rose-700 block">
                        Mandatory Requirement (* Required)
                      </span>
                      <span className="text-[11px] text-rose-600">
                        Candidates will not be allowed to go to the next step without answering this field.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#E9E7E1]">
                <button
                  type="button"
                  onClick={() => setCustomFieldModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E9E7E1] text-xs font-medium text-[#737883] hover:text-[#0B0C0E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newFieldLabel.trim()}
                  className="px-5 py-2 rounded-xl bg-[#2F5BFF] hover:bg-[#2563EB] text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
                >
                  Add Field to Form
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
