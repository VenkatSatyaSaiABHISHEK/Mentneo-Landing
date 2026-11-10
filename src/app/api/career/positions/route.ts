import { NextRequest, NextResponse } from "next/server";
import { dbQuery, PositionRecord } from "@/lib/career/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let sql = "SELECT * FROM positions WHERE active = 1 ORDER BY id ASC";
    const params: string[] = [];

    if (category && ["btech", "mba", "internship"].includes(category)) {
      sql = "SELECT * FROM positions WHERE active = 1 AND category = ? ORDER BY id ASC";
      params.push(category);
    }

    const positions = await dbQuery<PositionRecord>(sql, params);
    return NextResponse.json({ success: true, positions });
  } catch (err: unknown) {
    console.error("Error fetching positions:", (err as Error).message);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve positions" },
      { status: 500 }
    );
  }
}
