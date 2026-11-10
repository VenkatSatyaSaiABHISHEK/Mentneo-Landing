import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/career/auth";
import { getAllStoredApplications } from "@/lib/career/cloud-store";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const isAuth = await isAuthenticatedAdmin(req);
  if (!isAuth) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rawId = params.id;
    const all = await getAllStoredApplications();
    const app = all.find(
      (a) =>
        a.application_reference === rawId ||
        String(a.id) === rawId ||
        a.application_reference.toLowerCase() === rawId.toLowerCase()
    );

    if (!app) {
      return NextResponse.json({ success: false, error: "Applicant not found" }, { status: 404 });
    }

    const events = app.events || [
      {
        id: 1,
        event_type: "STATUS_CHANGE",
        event_description: "Application successfully submitted via Mentneo Careers Portal",
        created_at: app.submitted_at || new Date().toISOString(),
      },
    ];

    const notes = app.notes || [];

    return NextResponse.json({
      success: true,
      data: {
        application: app,
        positions: app.positions || [],
        events,
        notes,
      },
    });
  } catch (err: unknown) {
    console.error("Error fetching applicant details:", (err as Error).message);
    return NextResponse.json(
      { success: false, error: "Failed to load applicant profile" },
      { status: 500 }
    );
  }
}
