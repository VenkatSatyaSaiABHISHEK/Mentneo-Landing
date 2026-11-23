import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/career/auth";
import {
  getCareerFormSettings,
  saveCareerFormSettings,
  FormBin,
} from "@/lib/career/form-config";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const isAuth = await isAuthenticatedAdmin(req);
  if (!isAuth) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const name = body.name?.trim();
    const description = body.description?.trim() || "";
    const targetRole = body.targetRole || "all";

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Cohort Bin name is required" },
        { status: 400 }
      );
    }

    const settings = await getCareerFormSettings();

    const newBinId = `bin-${Date.now().toString(36)}`;
    const newBin: FormBin = {
      id: newBinId,
      name,
      description,
      targetRole,
      status: "active",
      createdAt: new Date().toISOString(),
      applicationCount: 0,
    };

    const updatedBins = [...settings.bins, newBin];
    const updatedSettings = {
      ...settings,
      bins: updatedBins,
      activeBinId: newBinId, // newly created bin becomes active intake bin
    };

    await saveCareerFormSettings(updatedSettings);

    return NextResponse.json({
      success: true,
      message: `Created cohort bin '${name}'`,
      bin: newBin,
      bins: updatedBins,
      activeBinId: newBinId,
    });
  } catch (err: unknown) {
    console.error("Error creating bin:", (err as Error).message);
    return NextResponse.json(
      { success: false, error: "Failed to create cohort bin" },
      { status: 500 }
    );
  }
}
