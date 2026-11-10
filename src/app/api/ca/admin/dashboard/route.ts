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
    // 1. Overview counts by applicant_type
    const typeCounts = await dbQuery<{ applicant_type: string; count: number }>(
      "SELECT applicant_type, COUNT(*) as count FROM applications GROUP BY applicant_type"
    );

    let btechTotal = 0;
    let mbaTotal = 0;
    let internshipTotal = 0;

    for (const r of typeCounts) {
      if (r.applicant_type === "btech") btechTotal = r.count;
      if (r.applicant_type === "mba") mbaTotal = r.count;
      if (r.applicant_type === "internship") internshipTotal = r.count;
    }

    const totalApplicants = btechTotal + mbaTotal + internshipTotal;

    // 2. Status counts
    const statusCounts = await dbQuery<{ application_status: string; count: number }>(
      "SELECT application_status, COUNT(*) as count FROM applications GROUP BY application_status"
    );

    const statusMap: Record<string, number> = {
      Submitted: 0,
      "Under Review": 0,
      Shortlisted: 0,
      Interview: 0,
      Selected: 0,
      Rejected: 0,
    };

    for (const s of statusCounts) {
      if (statusMap[s.application_status] !== undefined) {
        statusMap[s.application_status] = s.count;
      }
    }

    // 3. Position-wise counts
    const positionStats = await dbQuery<{ position_name: string; count: number }>(
      `SELECT position_name, COUNT(*) as count
       FROM application_positions
       GROUP BY position_name
       ORDER BY count DESC`
    );

    // 4. Graduation Year counts
    const gradYearStats = await dbQuery<{ graduation_year: string; count: number }>(
      `SELECT graduation_year, COUNT(*) as count
       FROM applications
       GROUP BY graduation_year
       ORDER BY graduation_year ASC`
    );

    // 5. Recent applications (latest 8)
    const recentApps = await dbQuery<ApplicationRecord>(
      `SELECT id, application_reference, applicant_type, full_name, email, mobile,
              branch, current_cgpa, graduation_year, application_status, submitted_at
       FROM applications
       ORDER BY id DESC
       LIMIT 8`
    );

    // Fetch applied positions for recent applications
    const recentAppIds = recentApps.map((a) => a.id);
    const appPositionsMap: Record<number, string[]> = {};

    if (recentAppIds.length > 0) {
      const placeholders = recentAppIds.map(() => "?").join(",");
      const positionsList = await dbQuery<{ application_id: number; position_name: string }>(
        `SELECT application_id, position_name FROM application_positions WHERE application_id IN (${placeholders})`,
        recentAppIds
      );
      for (const p of positionsList) {
        if (!appPositionsMap[p.application_id]) {
          appPositionsMap[p.application_id] = [];
        }
        appPositionsMap[p.application_id].push(p.position_name);
      }
    }

    const recentApplications = recentApps.map((a) => ({
      ...a,
      positions: appPositionsMap[a.id] || [],
    }));

    return NextResponse.json({
      success: true,
      data: {
        metrics: {
          total: totalApplicants,
          btech: btechTotal,
          mba: mbaTotal,
          internship: internshipTotal,
          submitted: statusMap["Submitted"],
          underReview: statusMap["Under Review"],
          shortlisted: statusMap["Shortlisted"],
          interview: statusMap["Interview"],
          selected: statusMap["Selected"],
          rejected: statusMap["Rejected"],
        },
        positionStats,
        gradYearStats,
        recentApplications,
      },
    });
  } catch (err: unknown) {
    console.error("Dashboard error:", (err as Error).message);
    return NextResponse.json(
      { success: false, error: "Failed to load dashboard metrics" },
      { status: 500 }
    );
  }
}
