import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/career/auth";
import { dbQuery, ApplicationRecord } from "@/lib/career/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const isAuth = await isAuthenticatedAdmin(req);
  if (!isAuth) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim().toLowerCase();
    const type = searchParams.get("type"); // btech, mba, internship
    const status = searchParams.get("status");
    const position = searchParams.get("position");
    const gradYear = searchParams.get("gradYear");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "15", 10)));
    const offset = (page - 1) * limit;

    const whereClauses: string[] = [];
    const params: (string | number)[] = [];

    if (type && ["btech", "mba", "internship"].includes(type)) {
      whereClauses.push("a.applicant_type = ?");
      params.push(type);
    }

    if (status && status !== "all") {
      whereClauses.push("a.application_status = ?");
      params.push(status);
    }

    if (gradYear && gradYear !== "all") {
      whereClauses.push("a.graduation_year = ?");
      params.push(gradYear);
    }

    if (position && position !== "all") {
      whereClauses.push(
        "a.id IN (SELECT application_id FROM application_positions WHERE position_name LIKE ?)"
      );
      params.push(`%${position}%`);
    }

    if (search) {
      whereClauses.push(`(
        LOWER(a.full_name) LIKE ? OR
        LOWER(a.email) LIKE ? OR
        LOWER(a.college_roll_number) LIKE ? OR
        LOWER(a.application_reference) LIKE ? OR
        a.id IN (SELECT application_id FROM application_positions WHERE LOWER(position_name) LIKE ?)
      )`);
      const term = `%${search}%`;
      params.push(term, term, term, term, term);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    // Count total matches
    const countSql = `SELECT COUNT(*) as total FROM applications a ${whereSql}`;
    const countRes = await dbQuery<{ total: number }>(countSql, params);
    const total = countRes[0]?.total || 0;

    // Fetch paginated rows
    const dataSql = `
      SELECT a.id, a.application_reference, a.applicant_type, a.full_name, a.email, a.mobile,
             a.college_name, a.college_roll_number, a.branch, a.mba_specialization,
             a.current_cgpa, a.current_percentage, a.graduation_year, a.relocation_willingness,
             a.technical_skills, a.skills_strengths, a.github_url, a.linkedin_url,
             a.resume_object_key, a.application_status, a.submitted_at, a.updated_at
      FROM applications a
      ${whereSql}
      ORDER BY a.id DESC
      LIMIT ? OFFSET ?
    `;

    const apps = await dbQuery<ApplicationRecord>(dataSql, [...params, limit, offset]);

    // Attach positions to each application
    const appIds = apps.map((a) => a.id);
    const appPositionsMap: Record<number, string[]> = {};

    if (appIds.length > 0) {
      const placeholders = appIds.map(() => "?").join(",");
      const positionsList = await dbQuery<{ application_id: number; position_name: string }>(
        `SELECT application_id, position_name FROM application_positions WHERE application_id IN (${placeholders})`,
        appIds
      );
      for (const p of positionsList) {
        if (!appPositionsMap[p.application_id]) {
          appPositionsMap[p.application_id] = [];
        }
        appPositionsMap[p.application_id].push(p.position_name);
      }
    }

    const applications = apps.map((a) => ({
      ...a,
      positions: appPositionsMap[a.id] || [],
    }));

    return NextResponse.json({
      success: true,
      data: {
        applications,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
      },
    });
  } catch (err: unknown) {
    console.error("Error fetching applications:", (err as Error).message);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve applicants" },
      { status: 500 }
    );
  }
}
