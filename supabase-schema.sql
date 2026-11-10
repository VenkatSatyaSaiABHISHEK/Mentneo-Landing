-- =========================================================================
-- MENTNEO CAREERS PORTAL - SUPABASE DATABASE SCHEMA & RLS POLICIES
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- URL: https://supabase.com/dashboard/project/zvqswffitbsqyhhmmknv/sql
-- =========================================================================

-- 1. Applications Master Table
CREATE TABLE IF NOT EXISTS public.applications (
  id BIGSERIAL PRIMARY KEY,
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
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Application Positions Mapping Table
CREATE TABLE IF NOT EXISTS public.application_positions (
  id BIGSERIAL PRIMARY KEY,
  application_id BIGINT REFERENCES public.applications(id) ON DELETE CASCADE,
  application_reference TEXT,
  position_id TEXT NOT NULL,
  position_name TEXT NOT NULL
);

-- 3. Application Events / Activity History
CREATE TABLE IF NOT EXISTS public.application_events (
  id BIGSERIAL PRIMARY KEY,
  application_id BIGINT REFERENCES public.applications(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Application Admin Notes
CREATE TABLE IF NOT EXISTS public.application_notes (
  id BIGSERIAL PRIMARY KEY,
  application_id BIGINT REFERENCES public.applications(id) ON DELETE CASCADE,
  admin_id TEXT NOT NULL DEFAULT 'admin',
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_applications_ref ON public.applications(application_reference);
CREATE INDEX IF NOT EXISTS idx_applications_type ON public.applications(applicant_type);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(application_status);
CREATE INDEX IF NOT EXISTS idx_app_positions_ref ON public.application_positions(application_reference);

-- 6. Row Level Security Policies (Enables Anon / Publishable key to INSERT, SELECT, UPDATE)
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon insert applications" ON public.applications;
DROP POLICY IF EXISTS "Allow anon select applications" ON public.applications;
DROP POLICY IF EXISTS "Allow anon update applications" ON public.applications;

CREATE POLICY "Allow anon insert applications" ON public.applications FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anon select applications" ON public.applications FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow anon update applications" ON public.applications FOR UPDATE TO anon, authenticated USING (true);

ALTER TABLE public.application_positions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon all application_positions" ON public.application_positions;
CREATE POLICY "Allow anon all application_positions" ON public.application_positions FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.application_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon all application_events" ON public.application_events;
CREATE POLICY "Allow anon all application_events" ON public.application_events FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.application_notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon all application_notes" ON public.application_notes;
CREATE POLICY "Allow anon all application_notes" ON public.application_notes FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
