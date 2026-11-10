-- ==========================================================
-- MENTNEO CAREER PORTAL 2026 — RELATIONAL DATABASE SCHEMA
-- Compatible with Cloudflare D1 (SQLite) and local node:sqlite
-- ==========================================================

CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  application_reference TEXT UNIQUE NOT NULL,
  applicant_type TEXT NOT NULL, -- 'btech' | 'mba' | 'internship'
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
  relocation_willingness TEXT NOT NULL, -- 'Yes' | 'No'
  technical_skills TEXT,
  skills_strengths TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  previous_experience TEXT,
  resume_object_key TEXT,
  application_status TEXT NOT NULL DEFAULT 'Submitted', -- 'Submitted' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected'
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
  category TEXT NOT NULL, -- 'btech' | 'mba' | 'internship'
  description TEXT NOT NULL,
  skills TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS application_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  application_id INTEGER NOT NULL,
  event_type TEXT NOT NULL, -- 'application_submitted' | 'status_change' | 'note_added'
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

-- Indexes for rapid lookup and filtering
CREATE INDEX IF NOT EXISTS idx_applications_ref ON applications(application_reference);
CREATE INDEX IF NOT EXISTS idx_applications_type ON applications(applicant_type);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(application_status);
CREATE INDEX IF NOT EXISTS idx_applications_grad_year ON applications(graduation_year);
CREATE INDEX IF NOT EXISTS idx_app_positions_app ON application_positions(application_id);
CREATE INDEX IF NOT EXISTS idx_app_events_app ON application_events(application_id);
CREATE INDEX IF NOT EXISTS idx_app_notes_app ON application_notes(application_id);
