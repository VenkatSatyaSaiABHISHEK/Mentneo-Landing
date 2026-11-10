import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/career/auth";
import { getDashboardOverviewMetrics } from "@/lib/career/cloud-store";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const isAuth = await isAuthenticatedAdmin(req);
  if (!isAuth) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getDashboardOverviewMetrics();
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: unknown) {
    console.error("Dashboard overview calculation error:", (err as Error).message);
    return NextResponse.json(
      { success: false, error: "Failed to compile recruitment dashboard analytics" },
      { status: 500 }
    );
  }
}
