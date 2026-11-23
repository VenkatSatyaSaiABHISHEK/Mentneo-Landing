import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/career/auth";
import {
  getCareerFormSettings,
  saveCareerFormSettings,
  CareerFormSettings,
} from "@/lib/career/form-config";
import { getAllStoredApplications } from "@/lib/career/cloud-store";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const isAuth = await isAuthenticatedAdmin(req);
  if (!isAuth) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await getCareerFormSettings();
    const allApps = await getAllStoredApplications();

    // Compute live application counts per bin
    const binCountMap: Record<string, number> = {};
    for (const app of allApps) {
      const bId = app.cohort_id || "bin-1";
      binCountMap[bId] = (binCountMap[bId] || 0) + 1;
    }

    const binsWithCounts = settings.bins.map((bin) => ({
      ...bin,
      applicationCount: binCountMap[bin.id] || 0,
    }));

    return NextResponse.json(
      {
        success: true,
        settings: {
          ...settings,
          bins: binsWithCounts,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (err: unknown) {
    console.error("Error retrieving admin form config:", (err as Error).message);
    return NextResponse.json(
      { success: false, error: "Failed to load form configuration" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const isAuth = await isAuthenticatedAdmin(req);
  if (!isAuth) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as CareerFormSettings;
    if (!body || !body.btech || !body.mba || !Array.isArray(body.bins)) {
      return NextResponse.json(
        { success: false, error: "Invalid form configuration payload" },
        { status: 400 }
      );
    }

    await saveCareerFormSettings(body);

    return NextResponse.json({
      success: true,
      message: "Form configuration and cohort bins updated successfully",
      settings: body,
    });
  } catch (err: unknown) {
    console.error("Error saving admin form config:", (err as Error).message);
    return NextResponse.json(
      { success: false, error: "Failed to save form configuration" },
      { status: 500 }
    );
  }
}
