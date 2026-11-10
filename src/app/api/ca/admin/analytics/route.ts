import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/career/auth";
import { dbQuery } from "@/lib/career/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const isAuth = await isAuthenticatedAdmin(req);
  if (!isAuth) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const categoryStats = await dbQuery<{ applicant_type: string; count: number }>(
      "SELECT applicant_type, COUNT(*) as count FROM applications GROUP BY applicant_type"
    );

    const statusStats = await dbQuery<{ application_status: string; count: number }>(
      "SELECT application_status, COUNT(*) as count FROM applications GROUP BY application_status"
    );

    const positionStats = await dbQuery<{ position_name: string; count: number }>(
      `SELECT position_name, COUNT(*) as count
       FROM application_positions
       GROUP BY position_name
       ORDER BY count DESC`
    );

    const gradYearStats = await dbQuery<{ graduation_year: string; count: number }>(
      `SELECT graduation_year, COUNT(*) as count
       FROM applications
       GROUP BY graduation_year
       ORDER BY graduation_year ASC`
    );

    const branchStats = await dbQuery<{ branch: string; count: number }>(
      `SELECT COALESCE(branch, mba_specialization, 'General') as branch_name, COUNT(*) as count
       FROM applications
       WHERE branch IS NOT NULL OR mba_specialization IS NOT NULL
       GROUP BY branch_name
       ORDER BY count DESC
       LIMIT 8`
    );

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
