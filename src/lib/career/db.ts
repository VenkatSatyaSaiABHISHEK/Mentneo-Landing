import fs from "fs";
import path from "path";
import os from "os";

export interface PositionRecord {
  id: string;
  title: string;
  category: "btech" | "mba" | "internship";
  description: string;
  skills: string;
  active: number;
  created_at?: string;
}

export interface ApplicationRecord {
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
  updated_at: string;
}

export interface ApplicationPositionRecord {
  id: number;
  application_id: number;
  position_id: string;
  position_name: string;
}

export interface ApplicationEventRecord {
  id: number;
  application_id: number;
  event_type: string;
  event_description: string;
  created_at: string;
}

export interface ApplicationNoteRecord {
  id: number;
  application_id: number;
  admin_id: string;
  note: string;
  created_at: string;
}

// Global cached connection for local development / serverless instances
interface LocalSqliteDb {
  exec: (sql: string) => void;
  prepare: (sql: string) => {
    all: (...params: unknown[]) => unknown[];
    get: (...params: unknown[]) => unknown;
    run: (...params: unknown[]) => { lastInsertRowid: number | bigint; changes: number };
  };
}

let localDbInstance: LocalSqliteDb | null = null;

const EMBEDDED_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  application_reference TEXT UNIQUE NOT NULL,
  applicant_type TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT NOT NULL,
  college_name TEXT,
  college_roll_number TEXT NOT NULL,
  branch TEXT,
  mba_specialization TEXT,
  current_cgpa TEXT,
  current_percentage TEXT,
  graduation_year TEXT NOT NULL,
  relocation_willingness TEXT NOT NULL,
  technical_skills TEXT,
  skills_strengths TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  previous_experience TEXT,
  resume_object_key TEXT,
  application_status TEXT NOT NULL DEFAULT 'Submitted',
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS application_positions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  application_id INTEGER NOT NULL,
  position_id TEXT NOT NULL,
  position_name TEXT NOT NULL,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS positions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  skills TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS application_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  application_id INTEGER NOT NULL,
  event_type TEXT NOT NULL,
  event_description TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS application_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  application_id INTEGER NOT NULL,
  admin_id TEXT NOT NULL DEFAULT 'admin',
  note TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_applications_ref ON applications(application_reference);
CREATE INDEX IF NOT EXISTS idx_applications_type ON applications(applicant_type);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(application_status);
`;

/**
 * Resolves safe writable data directory.
 * On Vercel / AWS Lambda (/var/task), filesystems are strictly read-only except /tmp (os.tmpdir()).
 */
function getSafeDbPath(): string {
  const isServerless =
    process.env.VERCEL === "1" ||
    !!process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.cwd().startsWith("/var/task");

  if (isServerless) {
    const tmpDataDir = path.join(os.tmpdir() || "/tmp", "mentneo_db");
    try {
      if (!fs.existsSync(tmpDataDir)) {
        fs.mkdirSync(tmpDataDir, { recursive: true });
      }
      return path.join(tmpDataDir, "career.db");
    } catch {
      return path.join(os.tmpdir() || "/tmp", "career.db");
    }
  }

  try {
    const dataDir = path.resolve(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    return path.join(dataDir, "career.db");
  } catch {
    return path.join(os.tmpdir() || "/tmp", "career.db");
  }
}

function getLocalDb(): LocalSqliteDb {
  if (localDbInstance) return localDbInstance;

  // Use Node.js built-in sqlite module
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { DatabaseSync } = require("node:sqlite");

  const dbPath = getSafeDbPath();
  const db = new DatabaseSync(dbPath);

  // Initialize schema with embedded SQL
  db.exec(EMBEDDED_SCHEMA_SQL);

  // Ensure positions contains only the TWO official openings: BTech ML & MBA
  db.exec("DELETE FROM positions WHERE id NOT IN ('btech-ml', 'mba-role')");

  const existingPositions = db.prepare("SELECT id FROM positions").all() as { id: string }[];
  const existingIds = new Set(existingPositions.map((p) => p.id));

  const insertOrReplace = db.prepare(
    "INSERT OR REPLACE INTO positions (id, title, category, description, skills, active) VALUES (?, ?, ?, ?, ?, 1)"
  );

  if (!existingIds.has("btech-ml")) {
    insertOrReplace.run(
      "btech-ml",
      "Machine Learning Engineer",
      "btech",
      "Core machine learning, neural architectures, LLM fine-tuning, inference pipelines, and agentic workflows.",
      "Python, PyTorch, Transformers, LLMs, Vector Databases, TensorRT, Model Quantization"
    );
  }

  if (!existingIds.has("mba-role")) {
    insertOrReplace.run(
      "mba-role",
      "Management & Business Operations",
      "mba",
      "Lead strategic enterprise partnerships, corporate growth operations, and go-to-market scaling for sovereign AI solutions.",
      "Enterprise Strategy, Corporate Partnerships, Growth Operations, Business Analytics, B2B Commercials"
    );
  }

  localDbInstance = db;
  return db;
}

/**
 * Universal query runner:
 * Dispatches via Cloudflare D1 if configured; otherwise runs via safe local SQLite.
 */
export async function dbQuery<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
  const token = process.env.CLOUDFLARE_D1_TOKEN;

  if (accountId && databaseId && token) {
    try {
      const res = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sql, params }),
        }
      );

      const data = await res.json();
      if (data.success) {
        return (data.result?.[0]?.results || []) as T[];
      }
    } catch (err: unknown) {
      console.warn("[DB] Cloudflare D1 query note:", (err as Error).message);
    }
  }

  const db = getLocalDb();
  const stmt = db.prepare(sql);
  const rows = stmt.all(...params) as T[];
  return rows;
}

/**
 * Universal statement executor (INSERT / UPDATE / DELETE) with concurrency retry
 */
export async function dbExecute(
  sql: string,
  params: unknown[] = []
): Promise<{ lastInsertRowid: number | bigint; changes: number }> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
  const token = process.env.CLOUDFLARE_D1_TOKEN;

  if (accountId && databaseId && token) {
    try {
      const res = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sql, params }),
        }
      );

      const data = await res.json();
      if (data.success) {
        const meta = data.result?.[0]?.meta;
        return {
          lastInsertRowid: meta?.last_row_id || 0,
          changes: meta?.changes || 0,
        };
      }
    } catch (err: unknown) {
      console.warn("[DB] Cloudflare D1 execute note:", (err as Error).message);
    }
  }

  // Local execute with micro retry for concurrency / SQLite busy states
  let attempts = 0;
  while (attempts < 3) {
    try {
      const db = getLocalDb();
      const stmt = db.prepare(sql);
      const result = stmt.run(...params);
      return {
        lastInsertRowid: result.lastInsertRowid,
        changes: result.changes,
      };
    } catch (err: unknown) {
      attempts++;
      if (attempts >= 3) throw err;
      await new Promise((r) => setTimeout(r, 40 * attempts));
    }
  }

  return { lastInsertRowid: 0, changes: 0 };
}

/**
 * Generates an architectural application reference code:
 * E.g., MNT-2026-BT-A98F2 or MNT-2026-MB-7C2E1
 */
export function generateApplicationReference(type: "btech" | "mba" | "internship"): string {
  const prefix = type === "btech" ? "BT" : type === "mba" ? "MB" : "IN";
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `MNT-2026-${prefix}-${code}`;
}
