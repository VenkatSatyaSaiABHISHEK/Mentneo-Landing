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
      btech: { ...settings.btech, targetBinId: newBinId },
      mba: { ...settings.mba, targetBinId: newBinId },
    };

    await saveCareerFormSettings(updatedSettings);

    return NextResponse.json({
      success: true,
      message: `Created cohort bin '${name}'`,
      bin: newBin,
      bins: updatedBins,
      activeBinId: newBinId,
      data: updatedSettings,
      settings: updatedSettings,
    });
  } catch (err: unknown) {
    console.error("Error creating bin:", (err as Error).message);
    return NextResponse.json(
      { success: false, error: "Failed to create cohort bin" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const isAuth = await isAuthenticatedAdmin(req);
  if (!isAuth) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const binId = body.binId?.trim();

    if (!binId) {
      return NextResponse.json({ success: false, error: "Cohort Bin ID is required" }, { status: 400 });
    }

    const settings = await getCareerFormSettings();
    const targetBin = settings.bins.find((b) => b.id === binId);
    if (!targetBin) {
      return NextResponse.json({ success: false, error: "Cohort bin not found" }, { status: 404 });
    }

    const updatedBins = settings.bins.map((b) => ({
      ...b,
      status: b.id === binId ? ("active" as const) : ("archived" as const),
    }));

    const updatedSettings = {
      ...settings,
      bins: updatedBins,
      activeBinId: binId,
      btech: { ...settings.btech, targetBinId: binId },
      mba: { ...settings.mba, targetBinId: binId },
    };

    await saveCareerFormSettings(updatedSettings);

    return NextResponse.json({
      success: true,
      message: `Set '${targetBin.name}' as the active intake destination bin`,
      bins: updatedBins,
      activeBinId: binId,
      settings: updatedSettings,
      data: updatedSettings,
    });
  } catch (err: unknown) {
    console.error("Error activating bin:", (err as Error).message);
    return NextResponse.json(
      { success: false, error: "Failed to set active cohort bin" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const isAuth = await isAuthenticatedAdmin(req);
  if (!isAuth) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const binId = body.binId?.trim();
    const confirmText = body.confirmText?.trim();

    if (!binId) {
      return NextResponse.json({ success: false, error: "Cohort Bin ID is required" }, { status: 400 });
    }

    const settings = await getCareerFormSettings();
    const binToDelete = settings.bins.find((b) => b.id === binId);
    if (!binToDelete) {
      return NextResponse.json({ success: false, error: "Cohort bin not found" }, { status: 404 });
    }

    // 1. Safety check for KIET archive (bin-1)
    if (binId === "bin-1") {
      if (confirmText !== "DELETE KIET ARCHIVE") {
        return NextResponse.json(
          {
            success: false,
            error: "The KIET Historical Archive is protected. Type 'DELETE KIET ARCHIVE' to confirm deletion.",
          },
          { status: 400 }
        );
      }
    } else {
      if (confirmText !== "DELETE") {
        return NextResponse.json(
          {
            success: false,
            error: "Confirmation text must be 'DELETE' to confirm deletion of this cohort bin.",
          },
          { status: 400 }
        );
      }
    }

    // 2. Prevent deleting the only remaining bin
    if (settings.bins.length <= 1) {
      return NextResponse.json(
        { success: false, error: "Cannot delete the only remaining cohort bin. At least one bin must exist." },
        { status: 400 }
      );
    }

    // 3. If deleting active bin, reassign activeBinId to another bin
    let nextActiveBinId = settings.activeBinId;
    if (settings.activeBinId === binId) {
      const remaining = settings.bins.filter((b) => b.id !== binId);
      nextActiveBinId = remaining[0]?.id || "bin-1";
    }

    // 4. Filter out bin
    const updatedBins = settings.bins
      .filter((b) => b.id !== binId)
      .map((b) => ({
        ...b,
        status: b.id === nextActiveBinId ? ("active" as const) : ("archived" as const),
      }));

    const updatedSettings = {
      ...settings,
      bins: updatedBins,
      activeBinId: nextActiveBinId,
      btech: { ...settings.btech, targetBinId: nextActiveBinId },
      mba: { ...settings.mba, targetBinId: nextActiveBinId },
    };

    await saveCareerFormSettings(updatedSettings);

    return NextResponse.json({
      success: true,
      message: `Deleted cohort bin '${binToDelete.name}'`,
      bins: updatedBins,
      activeBinId: nextActiveBinId,
      settings: updatedSettings,
      data: updatedSettings,
    });
  } catch (err: unknown) {
    console.error("Error deleting bin:", (err as Error).message);
    return NextResponse.json(
      { success: false, error: "Failed to delete cohort bin" },
      { status: 500 }
    );
  }
}
