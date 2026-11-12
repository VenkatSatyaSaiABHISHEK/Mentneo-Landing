import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/career/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const appCounts = await dbQuery<{ count: number }>("SELECT COUNT(*) as count FROM applications");
    const totalApplicants = appCounts[0]?.count || 0;

    return NextResponse.json({
      success: true,
      statistics: {
        totalOpenings: 0,
        btechCount: 0,
        mbaCount: 0,
        internshipCount: 0,
        totalApplicants,
        applicationsOpen: false,
      },
    });
  } catch (err: unknown) {
    console.error("Error fetching statistics:", (err as Error).message);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve statistics" },
      { status: 500 }
    );
  }
}
