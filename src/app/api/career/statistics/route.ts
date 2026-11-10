import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/career/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posCounts = await dbQuery<{ category: string; count: number }>(
      "SELECT category, COUNT(*) as count FROM positions WHERE active = 1 GROUP BY category"
    );

    let btechCount = 0;
    let mbaCount = 0;
    let internshipCount = 0;

    for (const row of posCounts) {
      if (row.category === "btech") btechCount = row.count;
      if (row.category === "mba") mbaCount = row.count;
      if (row.category === "internship") internshipCount = row.count;
    }

    const appCounts = await dbQuery<{ count: number }>("SELECT COUNT(*) as count FROM applications");
    const totalApplicants = appCounts[0]?.count || 0;

    const totalOpenings = btechCount + mbaCount;

    return NextResponse.json({
      success: true,
      statistics: {
        totalOpenings,
        btechCount,
        mbaCount,
        internshipCount,
        totalApplicants,
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
