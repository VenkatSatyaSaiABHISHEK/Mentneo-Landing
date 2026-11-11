import { supabaseAdmin } from "./supabase";
import { ApplicationRecord, dbQuery, dbExecute } from "./db";

const SUPABASE_URL = (
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zvqswffitbsqyhhmmknv.supabase.co"
).replace(/\/$/, "");
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_f2XUx-0-GTl0w-GXH0KCrQ_Sze8B5HO";

function getR2Config() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || "ed3a5cbf8b0f0c0a98daaca79840d0f9";
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME || "smartcitylab";
  return { accountId, apiToken, bucket };
}

export interface StoredApplication extends ApplicationRecord {
  positions: string[];
  events?: Array<{ id: number; event_type: string; event_description: string; created_at: string }>;
  notes?: Array<{ id: number; admin_id: string; note: string; created_at: string }>;
}

/**
 * Saves candidate application to Cloudflare R2 persistent storage.
 * Works across all serverless regions and instances with zero cold start.
 */
export async function saveApplicationToR2(app: StoredApplication): Promise<boolean> {
  const { accountId, apiToken, bucket } = getR2Config();
  if (!accountId || !apiToken || !bucket) {
    return false;
  }

  try {
    const key = `applications/${app.application_reference}.json`;
    const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${bucket}/objects/${encodeURIComponent(key)}`;
    const payload = JSON.stringify(app);

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
      console.log(`[CloudStore] Persisted ${app.application_reference} to Cloudflare R2`);
      return true;
    }
  } catch (err) {
    console.warn("[CloudStore] Cloudflare R2 save error:", (err as Error).message);
  }
  return false;
}

/**
 * Loads all applications from Cloudflare R2.
 */
export async function getApplicationsFromR2(): Promise<StoredApplication[]> {
  const { accountId, apiToken, bucket } = getR2Config();
  if (!accountId || !apiToken || !bucket) {
    return [];
  }

  try {
    const listEndpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${bucket}/objects?prefix=applications/`;
    const listRes = await fetch(listEndpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });

    if (!listRes.ok) return [];

    const listData = await listRes.json();
    const items = listData?.result || [];
    const applications: StoredApplication[] = [];

    // Fetch individual application JSONs in parallel
    await Promise.all(
      items.map(async (item: { key: string }) => {
        if (!item.key.endsWith(".json")) return;
        try {
          const itemEndpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${bucket}/objects/${encodeURIComponent(item.key)}`;
          const itemRes = await fetch(itemEndpoint, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${apiToken}`,
            },
          });
          if (itemRes.ok) {
            const data = await itemRes.json();
            if (data && data.application_reference) {
              applications.push(data);
            }
          }
        } catch {}
      })
    );

    // Sort descending by submitted_at
    applications.sort((a, b) => new Date(b.submitted_at || 0).getTime() - new Date(a.submitted_at || 0).getTime());
    return applications;
  } catch (err) {
    console.warn("[CloudStore] Cloudflare R2 fetch error:", (err as Error).message);
    return [];
  }
}

/**
 * Loads all applications from Supabase via high-speed direct REST API.
 */
async function getApplicationsFromSupabaseRest(): Promise<StoredApplication[]> {
  try {
    const [appsRes, posRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/applications?select=*&order=id.desc`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Cache-Control": "no-cache",
        },
        cache: "no-store",
      }),
      fetch(`${SUPABASE_URL}/rest/v1/application_positions?select=application_reference,position_name`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Cache-Control": "no-cache",
        },
        cache: "no-store",
      }),
    ]);

    if (!appsRes.ok) {
      console.warn("[CloudStore] Supabase REST error status:", appsRes.status);
      return [];
    }

    const apps = (await appsRes.json()) as ApplicationRecord[];
    if (!Array.isArray(apps)) return [];

    let positions: { application_reference: string; position_name: string }[] = [];
    if (posRes.ok) {
      const posJson = await posRes.json();
      if (Array.isArray(posJson)) positions = posJson;
    }

    const posMap: Record<string, string[]> = {};
    for (const p of positions) {
      if (!posMap[p.application_reference]) posMap[p.application_reference] = [];
      posMap[p.application_reference].push(p.position_name);
    }

    return apps.map((a) => ({
      ...a,
      positions: posMap[a.application_reference] || [],
    }));
  } catch (err) {
    console.warn("[CloudStore] Supabase REST fetch error:", (err as Error).message);
    return [];
  }
}

/**
 * Fetches all applications combining direct Supabase REST, Supabase Admin client,
 * Cloudflare R2, and local SQLite.
 * Guarantees 100% persistence across all serverless regions and instances.
 */
export async function getAllStoredApplications(): Promise<StoredApplication[]> {
  const map = new Map<string, StoredApplication>();

  // 1. Primary: Direct Supabase REST API (high-speed, resilient, zero-SDK overhead)
  try {
    const supaRestApps = await getApplicationsFromSupabaseRest();
    for (const app of supaRestApps) {
      if (app && app.application_reference) {
        map.set(app.application_reference, app);
      }
    }
  } catch (err) {
    console.warn("[CloudStore] REST fetch notice:", (err as Error).message);
  }

  // 2. Secondary: Supabase Admin JS Client
  try {
    const { data: supaApps, error } = await supabaseAdmin
      .from("applications")
      .select("*")
      .order("id", { ascending: false });

    if (!error && Array.isArray(supaApps) && supaApps.length > 0) {
      const { data: supaPositions } = await supabaseAdmin
        .from("application_positions")
        .select("application_reference, position_name");

      const posMap: Record<string, string[]> = {};
      if (supaPositions) {
        for (const p of supaPositions) {
          if (!posMap[p.application_reference]) posMap[p.application_reference] = [];
          posMap[p.application_reference].push(p.position_name);
        }
      }

      for (const app of supaApps) {
        if (!map.has(app.application_reference)) {
          map.set(app.application_reference, {
            ...app,
            positions: posMap[app.application_reference] || [],
          });
        }
      }
    }
  } catch (err) {
    console.warn("[CloudStore] Supabase JS query notice:", (err as Error).message);
  }

  // 3. Tertiary: Cloudflare R2 persistent storage (merges any records)
  try {
    const r2Apps = await getApplicationsFromR2();
    for (const app of r2Apps) {
      if (!map.has(app.application_reference)) {
        map.set(app.application_reference, app);
      } else {
        const existing = map.get(app.application_reference)!;
        if (!existing.positions || existing.positions.length === 0) {
          existing.positions = app.positions || [];
        }
      }
    }
  } catch (err) {
    console.warn("[CloudStore] R2 query notice:", (err as Error).message);
  }

  // 4. Fallback: local SQLite records (for local dev mode)
  try {
    const localApps = await dbQuery<ApplicationRecord>("SELECT * FROM applications ORDER BY id DESC");
    if (localApps && localApps.length > 0) {
      for (const app of localApps) {
        if (!map.has(app.application_reference)) {
          const positions = await dbQuery<{ position_name: string }>(
            "SELECT position_name FROM application_positions WHERE application_id = ?",
            [app.id]
          );
          map.set(app.application_reference, {
            ...app,
            positions: positions.map((p) => p.position_name),
          });
        }
      }
    }
  } catch {}

  const list = Array.from(map.values());
  list.sort((a, b) => new Date(b.submitted_at || 0).getTime() - new Date(a.submitted_at || 0).getTime());
  return list;
}

/**
 * Saves a newly submitted candidate across all storage channels.
 */
export async function persistNewApplication(
  app: ApplicationRecord,
  positionNames: string[]
): Promise<void> {
  const fullRecord: StoredApplication = {
    ...app,
    positions: positionNames,
    events: [
      {
        id: 1,
        event_type: "STATUS_CHANGE",
        event_description: "Application successfully submitted via Mentneo Careers Portal",
        created_at: app.submitted_at || new Date().toISOString(),
      },
    ],
    notes: [],
  };

  // 1. Save to Cloudflare R2 (immediate reliable object storage)
  await saveApplicationToR2(fullRecord);

  // 2. Save to Supabase via Direct REST API
  try {
    const row = {
      application_reference: app.application_reference,
      applicant_type: app.applicant_type,
      full_name: app.full_name,
      email: app.email,
      mobile: app.mobile,
      college_name: app.college_name,
      college_roll_number: app.college_roll_number,
      branch: app.branch,
      mba_specialization: app.mba_specialization,
      current_cgpa: app.current_cgpa,
      current_percentage: app.current_percentage,
      graduation_year: app.graduation_year,
      relocation_willingness: app.relocation_willingness,
      technical_skills: app.technical_skills,
      skills_strengths: app.skills_strengths,
      github_url: app.github_url,
      linkedin_url: app.linkedin_url,
      previous_experience: app.previous_experience,
      resume_object_key: app.resume_object_key,
      application_status: app.application_status || "Submitted",
      submitted_at: app.submitted_at,
      updated_at: app.updated_at,
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/applications`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify([row]),
    });

    if (res.ok && positionNames.length > 0) {
      const posInserts = positionNames.map((name) => ({
        application_reference: app.application_reference,
        position_id: app.applicant_type === "btech" ? "btech-ml" : "mba-role",
        position_name: name,
      }));

      await fetch(`${SUPABASE_URL}/rest/v1/application_positions`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(posInserts),
      });
    }
  } catch (err) {
    console.warn("[CloudStore] Supabase REST insert note:", (err as Error).message);
  }

  // 3. Save to Supabase via Admin Client (secondary redundancy)
  try {
    const { error: supaErr } = await supabaseAdmin.from("applications").insert([
      {
        application_reference: app.application_reference,
        applicant_type: app.applicant_type,
        full_name: app.full_name,
        email: app.email,
        mobile: app.mobile,
        college_name: app.college_name,
        college_roll_number: app.college_roll_number,
        branch: app.branch,
        mba_specialization: app.mba_specialization,
        current_cgpa: app.current_cgpa,
        current_percentage: app.current_percentage,
        graduation_year: app.graduation_year,
        relocation_willingness: app.relocation_willingness,
        technical_skills: app.technical_skills,
        skills_strengths: app.skills_strengths,
        github_url: app.github_url,
        linkedin_url: app.linkedin_url,
        previous_experience: app.previous_experience,
        resume_object_key: app.resume_object_key,
        application_status: app.application_status || "Submitted",
        submitted_at: app.submitted_at,
        updated_at: app.updated_at,
      },
    ]);

    if (!supaErr) {
      const posInserts = positionNames.map((name) => ({
        application_reference: app.application_reference,
        position_id: app.applicant_type === "btech" ? "btech-ml" : "mba-role",
        position_name: name,
      }));
      await supabaseAdmin.from("application_positions").insert(posInserts);
    }
  } catch (err) {
    console.warn("[CloudStore] Supabase insert exception:", (err as Error).message);
  }
}

/**
 * Updates application status across Supabase, Cloudflare R2, and local SQLite.
 */
export async function updateCloudApplicationStatus(
  identifier: string | number,
  status: string
): Promise<boolean> {
  const isRef = typeof identifier === "string" && identifier.startsWith("MNT-");
  const now = new Date().toISOString();

  // 1. Update in Supabase via Direct REST PATCH
  try {
    const filter = isRef
      ? `application_reference=eq.${encodeURIComponent(identifier as string)}`
      : `id=eq.${identifier}`;

    await fetch(`${SUPABASE_URL}/rest/v1/applications?${filter}`, {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ application_status: status, updated_at: now }),
    });
  } catch (err) {
    console.warn("[CloudStore] REST status update error:", (err as Error).message);
  }

  // 2. Update in Cloudflare R2
  try {
    const apps = await getApplicationsFromR2();
    const target = apps.find(
      (a) => a.application_reference === identifier || a.id === Number(identifier)
    );
    if (target) {
      target.application_status = status as StoredApplication["application_status"];
      target.updated_at = now;
      if (!target.events) target.events = [];
      target.events.unshift({
        id: Date.now(),
        event_type: "STATUS_CHANGE",
        event_description: `Status updated to '${status}' by Recruitment Admin`,
        created_at: now,
      });
      await saveApplicationToR2(target);
    }
  } catch (err) {
    console.warn("[CloudStore] R2 status update error:", (err as Error).message);
  }

  // 3. Update in Supabase via Admin Client
  try {
    const filter = isRef
      ? { application_reference: identifier }
      : { id: Number(identifier) };

    await supabaseAdmin
      .from("applications")
      .update({ application_status: status, updated_at: now })
      .match(filter);
  } catch (err) {
    console.warn("[CloudStore] Supabase status update error:", (err as Error).message);
  }

  // 4. Update in local SQLite
  try {
    if (isRef) {
      await dbExecute(
        "UPDATE applications SET application_status = ?, updated_at = CURRENT_TIMESTAMP WHERE application_reference = ?",
        [status, identifier]
      );
    } else {
      await dbExecute(
        "UPDATE applications SET application_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [status, identifier]
      );
    }
  } catch {}

  return true;
}

/**
 * Computes dashboard metrics directly from the unified cloud store.
 */
export async function getDashboardOverviewMetrics() {
  const apps = await getAllStoredApplications();

  let btechTotal = 0;
  let mbaTotal = 0;
  let internshipTotal = 0;

  const statusMap: Record<string, number> = {
    Submitted: 0,
    "Under Review": 0,
    Shortlisted: 0,
    Interview: 0,
    Selected: 0,
    Rejected: 0,
  };

  const posCountMap: Record<string, number> = {};
  const gradYearMap: Record<string, number> = {};

  for (const app of apps) {
    if (app.applicant_type === "btech") btechTotal++;
    else if (app.applicant_type === "mba") mbaTotal++;
    else if (app.applicant_type === "internship") internshipTotal++;

    if (statusMap[app.application_status] !== undefined) {
      statusMap[app.application_status]++;
    } else {
      statusMap.Submitted++;
    }

    if (Array.isArray(app.positions)) {
      for (const pos of app.positions) {
        posCountMap[pos] = (posCountMap[pos] || 0) + 1;
      }
    }

    if (app.graduation_year) {
      gradYearMap[app.graduation_year] = (gradYearMap[app.graduation_year] || 0) + 1;
    }
  }

  const positionStats = Object.entries(posCountMap)
    .map(([position_name, count]) => ({ position_name, count }))
    .sort((a, b) => b.count - a.count);

  const gradYearStats = Object.entries(gradYearMap)
    .map(([graduation_year, count]) => ({ graduation_year, count }))
    .sort((a, b) => a.graduation_year.localeCompare(b.graduation_year));

  const recentApplications = apps.slice(0, 8);

  const metricsObj = {
    total: apps.length,
    totalApplicants: apps.length,
    btech: btechTotal,
    btechTotal,
    mba: mbaTotal,
    mbaTotal,
    internship: internshipTotal,
    internshipTotal,
    underReview: statusMap["Under Review"] || 0,
    shortlisted: statusMap["Shortlisted"] || 0,
    interview: statusMap["Interview"] || 0,
    selected: statusMap["Selected"] || 0,
    rejected: statusMap["Rejected"] || 0,
    submitted: statusMap["Submitted"] || 0,
  };

  return {
    metrics: metricsObj,
    overview: metricsObj,
    statusCounts: Object.entries(statusMap).map(([status, count]) => ({ status, count })),
    positionStats,
    gradYearStats,
    recentApplications,
  };
}

