import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/career/auth";
import { getAllStoredApplications } from "@/lib/career/cloud-store";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const isAuth = await isAuthenticatedAdmin(req);
  if (!isAuth) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const apps = await getAllStoredApplications();

    const categoryMap: Record<string, number> = {};
    const statusMap: Record<string, number> = {};
    const posMap: Record<string, number> = {};
    const gradMap: Record<string, number> = {};
    const branchMap: Record<string, number> = {};

    for (const app of apps) {
      categoryMap[app.applicant_type] = (categoryMap[app.applicant_type] || 0) + 1;
      statusMap[app.application_status] = (statusMap[app.application_status] || 0) + 1;

      if (Array.isArray(app.positions)) {
        for (const p of app.positions) {
          posMap[p] = (posMap[p] || 0) + 1;
        }
      }

      if (app.graduation_year) {
        gradMap[app.graduation_year] = (gradMap[app.graduation_year] || 0) + 1;
      }

      const branchName = app.branch || app.mba_specialization || "General";
      branchMap[branchName] = (branchMap[branchName] || 0) + 1;
    }

    const categoryStats = Object.entries(categoryMap).map(([applicant_type, count]) => ({ applicant_type, count }));
    const statusStats = Object.entries(statusMap).map(([application_status, count]) => ({ application_status, count }));
    const positionStats = Object.entries(posMap).map(([position_name, count]) => ({ position_name, count })).sort((a, b) => b.count - a.count);
    const gradYearStats = Object.entries(gradMap).map(([graduation_year, count]) => ({ graduation_year, count })).sort((a, b) => a.graduation_year.localeCompare(b.graduation_year));
    const branchStats = Object.entries(branchMap).map(([branch, count]) => ({ branch, count })).sort((a, b) => b.count - a.count).slice(0, 8);

    return NextResponse.json({
      success: true,
      analytics: {
        categoryStats,
        statusStats,
        positionStats,
        gradYearStats,
        branchStats,
      },
    });
  } catch (err: unknown) {
    console.error("Analytics error:", (err as Error).message);
    return NextResponse.json({ success: false, error: "Failed to load analytics" }, { status: 500 });
  }
}
