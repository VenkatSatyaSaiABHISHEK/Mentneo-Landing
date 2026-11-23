import { NextRequest, NextResponse } from "next/server";
import { getCareerFormSettings } from "@/lib/career/form-config";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role"); // "btech" | "mba" | undefined

    const settings = await getCareerFormSettings();

    const activeBin = settings.bins.find((b) => b.id === settings.activeBinId) || settings.bins[0];

    // Filter fields to only return enabled fields to public client
    const sanitizeRole = (roleSettings: typeof settings.btech) => ({
      isOpen: settings.globalOpen && roleSettings.isOpen,
      roleId: roleSettings.roleId,
      roleTitle: roleSettings.roleTitle,
      headline: roleSettings.headline,
      description: roleSettings.description,
      closedMessage: roleSettings.closedMessage,
      targetBinId: roleSettings.targetBinId || settings.activeBinId,
      fields: (roleSettings.fields || []).filter((f) => f.enabled),
    });

    if (role === "btech") {
      const roleConfig = sanitizeRole(settings.btech);
      return NextResponse.json(
        {
          success: true,
          data: roleConfig,
          roleConfig,
          globalOpen: settings.globalOpen,
          activeBinName: activeBin?.name || "Active Cohort",
        },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate",
          },
        }
      );
    }

    if (role === "mba") {
      const roleConfig = sanitizeRole(settings.mba);
      return NextResponse.json(
        {
          success: true,
          data: roleConfig,
          roleConfig,
          globalOpen: settings.globalOpen,
          activeBinName: activeBin?.name || "Active Cohort",
        },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate",
          },
        }
      );
    }

    const dataObj = {
      globalOpen: settings.globalOpen,
      btech: sanitizeRole(settings.btech),
      mba: sanitizeRole(settings.mba),
      activeBinName: activeBin?.name || "Active Cohort",
    };

    return NextResponse.json(
      {
        success: true,
        data: dataObj,
        ...dataObj,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (err: unknown) {
    console.error("Error retrieving public form config:", (err as Error).message);
    return NextResponse.json(
      { success: false, error: "Failed to load form configuration" },
      { status: 500 }
    );
  }
}
