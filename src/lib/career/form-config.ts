import fs from "fs";
import path from "path";
import os from "os";

export interface FormFieldConfig {
  id: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "number" | "url" | "file";
  placeholder?: string;
  step: number; // 1: Personal, 2: Academic, 3: Position, 4: Skills, 5: Relocation, 6: Custom, 7: Resume
  enabled: boolean;
  required: boolean; // "Importance: Cannot go to next step without filling"
  options?: string[];
  isCustom?: boolean;
  helpText?: string;
}

export interface FormBin {
  id: string;
  name: string;
  description: string;
  targetRole: "all" | "btech" | "mba";
  status: "active" | "archived" | "closed";
  createdAt: string;
  applicationCount?: number;
}

export interface RoleFormSettings {
  isOpen: boolean;
  roleId: "btech" | "mba";
  roleTitle: string;
  headline: string;
  description: string;
  targetBinId: string;
  closedMessage: string;
  fields: FormFieldConfig[];
}

export interface CareerFormSettings {
  globalOpen: boolean;
  activeBinId: string;
  bins: FormBin[];
  btech: RoleFormSettings;
  mba: RoleFormSettings;
  updatedAt: string;
}

export const DEFAULT_BINS: FormBin[] = [
  {
    id: "bin-1",
    name: "KIET Group of Institutions (Nov 2026 Archive)",
    description: "Historical registry containing all 566 candidate submissions from KIET campus drive.",
    targetRole: "all",
    status: "archived",
    createdAt: "2026-11-10T00:00:00.000Z",
  },
  {
    id: "bin-2",
    name: "Active Cohort · 2026-2027 Recruitment",
    description: "Current intake bin for incoming candidate submissions.",
    targetRole: "all",
    status: "active",
    createdAt: "2026-11-23T00:00:00.000Z",
  },
];

export const DEFAULT_BTECH_FIELDS: FormFieldConfig[] = [
  // Step 1: Personal
  { id: "fullName", label: "Full Legal Name", type: "text", placeholder: "e.g. John Doe", step: 1, enabled: true, required: true },
  { id: "email", label: "Email Address", type: "email", placeholder: "e.g. john@university.edu", step: 1, enabled: true, required: true },
  { id: "mobile", label: "Mobile Number", type: "tel", placeholder: "e.g. +91 98765 43210", step: 1, enabled: true, required: true },
  { id: "collegeRollNumber", label: "College Roll / Registration Number", type: "text", placeholder: "e.g. 21B01A0501", step: 1, enabled: true, required: true },
  
  // Step 2: Academics
  { id: "collegeName", label: "College / University Name", type: "text", placeholder: "e.g. KIET Group of Institutions", step: 2, enabled: true, required: true },
  { id: "branch", label: "Engineering Branch / Specialization", type: "text", placeholder: "e.g. Computer Science (AI & ML)", step: 2, enabled: true, required: true },
  { id: "currentCgpa", label: "Current CGPA (or Percentage)", type: "text", placeholder: "e.g. 8.85 / 10", step: 2, enabled: true, required: true },
  { id: "graduationYear", label: "Graduation Year", type: "select", step: 2, enabled: true, required: true, options: ["2024", "2025", "2026", "2027", "2028"] },
  
  // Step 3: Position Track
  { id: "positions", label: "Target Position Track", type: "select", step: 3, enabled: true, required: true, options: ["Machine Learning Engineer"] },
  
  // Step 4: Technical Skills
  { id: "technicalSkills", label: "Core Technical Skills & Frameworks", type: "textarea", placeholder: "e.g. Python, PyTorch, Transformers, LLM Fine-Tuning, TensorRT, Vector Databases", step: 4, enabled: true, required: true },
  { id: "githubUrl", label: "GitHub Profile URL", type: "url", placeholder: "https://github.com/yourhandle", step: 4, enabled: true, required: false },
  { id: "linkedinUrl", label: "LinkedIn Profile URL", type: "url", placeholder: "https://linkedin.com/in/yourprofile", step: 4, enabled: true, required: false },
  
  // Step 5: Relocation
  { id: "relocationWillingness", label: "Are you willing to work in-person at Mentneo Labs, Hyderabad?", type: "select", step: 5, enabled: true, required: true, options: ["Yes", "No"] },
  
  // Step 7: Resume Upload
  { id: "resume", label: "Curriculum Vitae / Resume (PDF)", type: "file", helpText: "Upload PDF up to 4 MB", step: 7, enabled: true, required: true },
];

export const DEFAULT_MBA_FIELDS: FormFieldConfig[] = [
  // Step 1: Personal
  { id: "fullName", label: "Full Legal Name", type: "text", placeholder: "e.g. Jane Smith", step: 1, enabled: true, required: true },
  { id: "email", label: "Email Address", type: "email", placeholder: "e.g. jane@businessschool.edu", step: 1, enabled: true, required: true },
  { id: "mobile", label: "Mobile Number", type: "tel", placeholder: "e.g. +91 98765 43210", step: 1, enabled: true, required: true },
  { id: "collegeName", label: "Business School / University Name", type: "text", placeholder: "e.g. Indian Institute of Management", step: 1, enabled: true, required: true },
  { id: "collegeRollNumber", label: "Roll / Student Registration Number", type: "text", placeholder: "e.g. MBA-2026-042", step: 1, enabled: true, required: true },
  
  // Step 2: Academics
  { id: "mbaSpecialization", label: "MBA Specialization", type: "select", step: 2, enabled: true, required: true, options: ["Marketing", "Finance", "Human Resources (HR)", "Business Analytics", "Operations", "General Management", "Other"] },
  { id: "currentCgpa", label: "Current CGPA (or Percentage)", type: "text", placeholder: "e.g. 8.5 / 10", step: 2, enabled: true, required: true },
  { id: "graduationYear", label: "Graduation Year", type: "select", step: 2, enabled: true, required: true, options: ["2024", "2025", "2026", "2027", "2028"] },
  
  // Step 3: Position Track
  { id: "positions", label: "Target Position Track", type: "select", step: 3, enabled: true, required: true, options: ["Management & Business Operations"] },
  
  // Step 4: Skills & Experience
  { id: "skillsStrengths", label: "Key Strengths & Commercial Acumen", type: "textarea", placeholder: "e.g. Enterprise Partnerships, Growth Operations, B2B Deal Negotiations, Strategic Market Analysis", step: 4, enabled: true, required: true },
  { id: "previousExperience", label: "Prior Experience / Internship Details", type: "textarea", placeholder: "Briefly outline any past leadership, internships, or corporate engagements.", step: 4, enabled: true, required: false },
  { id: "linkedinUrl", label: "LinkedIn Profile URL", type: "url", placeholder: "https://linkedin.com/in/yourprofile", step: 4, enabled: true, required: false },
  
  // Step 5: Relocation
  { id: "relocationWillingness", label: "Are you willing to work in-person at Mentneo Labs, Hyderabad?", type: "select", step: 5, enabled: true, required: true, options: ["Yes", "No"] },
  
  // Step 7: Resume Upload
  { id: "resume", label: "Curriculum Vitae / Resume (PDF)", type: "file", helpText: "Upload PDF up to 4 MB", step: 7, enabled: true, required: true },
];

export const DEFAULT_FORM_SETTINGS: CareerFormSettings = {
  globalOpen: true,
  activeBinId: "bin-2",
  bins: DEFAULT_BINS,
  btech: {
    isOpen: true,
    roleId: "btech",
    roleTitle: "Machine Learning Engineer",
    headline: "Core AI & Foundation Model Architecture",
    description: "Work on Mentneo's proprietary foundation models, neural inference pipelines, and agentic reasoning systems.",
    targetBinId: "bin-2",
    closedMessage: "Applications for the B.Tech Machine Learning cohort are currently closed.",
    fields: DEFAULT_BTECH_FIELDS,
  },
  mba: {
    isOpen: true,
    roleId: "mba",
    roleTitle: "Management & Business Operations",
    headline: "Enterprise Strategy & GTM Scaling",
    description: "Lead commercial expansion, enterprise partnerships, and operational scale for sovereign artificial intelligence.",
    targetBinId: "bin-2",
    closedMessage: "Applications for the MBA Commercial cohort are currently closed.",
    fields: DEFAULT_MBA_FIELDS,
  },
  updatedAt: new Date().toISOString(),
};

// In-memory cache
let cachedSettings: CareerFormSettings | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 5000; // 5 seconds

function getR2Config() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || "ed3a5cbf8b0f0c0a98daaca79840d0f9";
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME || "smartcitylab";
  return { accountId, apiToken, bucket };
}

function getSafeSettingsPath(): string {
  const isServerless =
    process.env.VERCEL === "1" ||
    !!process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.cwd().startsWith("/var/task");

  if (isServerless) {
    const tmpDataDir = path.join(os.tmpdir() || "/tmp", "mentneo_db");
    try {
      if (!fs.existsSync(tmpDataDir)) fs.mkdirSync(tmpDataDir, { recursive: true });
      return path.join(tmpDataDir, "career_form_settings.json");
    } catch {
      return path.join(os.tmpdir() || "/tmp", "career_form_settings.json");
    }
  }

  try {
    const dataDir = path.resolve(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    return path.join(dataDir, "career_form_settings.json");
  } catch {
    return path.join(os.tmpdir() || "/tmp", "career_form_settings.json");
  }
}

/**
 * Loads career form settings from Cloudflare R2, falling back to local file and defaults.
 */
export async function getCareerFormSettings(): Promise<CareerFormSettings> {
  const now = Date.now();
  if (cachedSettings && now - lastCacheTime < CACHE_TTL_MS) {
    return cachedSettings;
  }

  // 1. Try Cloudflare R2
  const { accountId, apiToken, bucket } = getR2Config();
  if (accountId && apiToken && bucket) {
    try {
      const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${bucket}/objects/settings%2Fcareer_form_settings.json`;
      const res = await fetch(endpoint, {
        method: "GET",
        headers: { Authorization: `Bearer ${apiToken}` },
        cache: "no-store",
      });
      if (res.ok) {
        const data = (await res.json()) as CareerFormSettings;
        if (data && data.bins && data.btech && data.mba) {
          cachedSettings = data;
          lastCacheTime = now;
          return data;
        }
      }
    } catch (err) {
      console.warn("[FormConfig] R2 settings fetch notice:", (err as Error).message);
    }
  }

  // 2. Try Local File
  try {
    const localPath = getSafeSettingsPath();
    if (fs.existsSync(localPath)) {
      const raw = fs.readFileSync(localPath, "utf-8");
      const data = JSON.parse(raw) as CareerFormSettings;
      if (data && data.bins && data.btech && data.mba) {
        cachedSettings = data;
        lastCacheTime = now;
        return data;
      }
    }
  } catch {}

  // 3. Fallback to default
  cachedSettings = DEFAULT_FORM_SETTINGS;
  lastCacheTime = now;
  return DEFAULT_FORM_SETTINGS;
}

/**
 * Persists career form settings to Cloudflare R2 and local filesystem.
 */
export async function saveCareerFormSettings(settings: CareerFormSettings): Promise<boolean> {
  const updatedSettings: CareerFormSettings = {
    ...settings,
    updatedAt: new Date().toISOString(),
  };

  cachedSettings = updatedSettings;
  lastCacheTime = Date.now();

  let savedR2 = false;

  // 1. Save to Cloudflare R2
  const { accountId, apiToken, bucket } = getR2Config();
  if (accountId && apiToken && bucket) {
    try {
      const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${bucket}/objects/settings%2Fcareer_form_settings.json`;
      const payload = JSON.stringify(updatedSettings, null, 2);
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload).toString(),
        },
        body: payload,
      });
      if (res.ok) {
        savedR2 = true;
      }
    } catch (err) {
      console.warn("[FormConfig] R2 settings save error:", (err as Error).message);
    }
  }

  // 2. Save to Local file
  try {
    const localPath = getSafeSettingsPath();
    fs.writeFileSync(localPath, JSON.stringify(updatedSettings, null, 2), "utf-8");
  } catch (err) {
    console.warn("[FormConfig] Local file settings write note:", (err as Error).message);
  }

  return savedR2;
}
