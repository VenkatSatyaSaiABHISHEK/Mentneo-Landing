import fs from "fs";
import path from "path";

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

// Global cached connection for local development
interface LocalSqliteDb {
  exec: (sql: string) => void;
  prepare: (sql: string) => {
    all: (...params: unknown[]) => unknown[];
    run: (...params: unknown[]) => { lastInsertRowid: number | bigint; changes: number };
  };
}

let localDbInstance: LocalSqliteDb | null = null;

function getLocalDb(): LocalSqliteDb {
  if (localDbInstance) return localDbInstance;

  // Use Node.js built-in sqlite module
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { DatabaseSync } = require("node:sqlite");

  const dataDir = path.resolve(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, "career.db");
  const db = new DatabaseSync(dbPath);

  // Initialize schema
  const schemaPath = path.resolve(process.cwd(), "src/lib/career/schema.sql");
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, "utf-8");
    db.exec(schemaSql);
  }

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
 * If Cloudflare D1 environment variables are set, dispatches via Cloudflare D1 REST API.
 * Otherwise, runs locally via native node:sqlite.
 */
export async function dbQuery<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
  const token = process.env.CLOUDFLARE_D1_TOKEN;

  // Cloudflare D1 REST API Execution
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
          body: JSON.stringify({
            sql,
            params,
          }),
        }
      );

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.errors?.[0]?.message || "Cloudflare D1 query error");
      }
      return (data.result?.[0]?.results || []) as T[];
    } catch (err: unknown) {
      console.warn("Cloudflare D1 query failed, falling back to local DB:", (err as Error).message);
    }
  }

  // Local SQLite fallback
  const db = getLocalDb();
  const stmt = db.prepare(sql);
  const rows = stmt.all(...params) as T[];
  return rows;
}

/**
 * Universal statement executor (INSERT / UPDATE / DELETE)
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
          body: JSON.stringify({
            sql,
            params,
          }),
        }
      );

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.errors?.[0]?.message || "Cloudflare D1 execute error");
      }
      const meta = data.result?.[0]?.meta;
      return {
        lastInsertRowid: meta?.last_row_id || 0,
        changes: meta?.changes || 0,
      };
    } catch (err: unknown) {
      console.warn("Cloudflare D1 execute failed, falling back to local DB:", (err as Error).message);
    }
  }

  const db = getLocalDb();
  const stmt = db.prepare(sql);
  const result = stmt.run(...params);
  return {
    lastInsertRowid: result.lastInsertRowid,
    changes: result.changes,
  };
}

/**
 * Generates an architectural application reference number:
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
