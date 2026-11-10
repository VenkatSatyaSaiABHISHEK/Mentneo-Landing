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
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim().toLowerCase();
    const type = searchParams.get("type"); // btech, mba, internship
    const status = searchParams.get("status");
    const position = searchParams.get("position");
    const gradYear = searchParams.get("gradYear");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "15", 10)));

    let all = await getAllStoredApplications();

    // Filters
    if (type && ["btech", "mba", "internship"].includes(type)) {
      all = all.filter((a) => a.applicant_type === type);
    }

    if (status && status !== "all") {
      all = all.filter((a) => a.application_status === status);
    }

    if (gradYear && gradYear !== "all") {
      all = all.filter((a) => a.graduation_year === gradYear);
    }

    if (position && position !== "all") {
      all = all.filter((a) =>
        a.positions?.some((p) => p.toLowerCase().includes(position.toLowerCase()))
      );
    }

    if (search) {
      all = all.filter((a) => {
        return (
          a.full_name?.toLowerCase().includes(search) ||
          a.email?.toLowerCase().includes(search) ||
          a.mobile?.includes(search) ||
          a.college_roll_number?.toLowerCase().includes(search) ||
          a.application_reference?.toLowerCase().includes(search) ||
          a.positions?.some((p) => p.toLowerCase().includes(search))
        );
      });
    }

    const total = all.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginated = all.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: {
        applications: paginated,
        pagination: {
          total,
          page,
          limit,
          totalPages,
        },
      },
    });
  } catch (err: unknown) {
    console.error("Error querying applications:", (err as Error).message);
    return NextResponse.json(
      { success: false, error: "Failed to load candidate applications" },
      { status: 500 }
    );
  }
}
