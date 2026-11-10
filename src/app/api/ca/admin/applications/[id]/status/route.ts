import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/career/auth";
import { updateCloudApplicationStatus, getAllStoredApplications } from "@/lib/career/cloud-store";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const VALID_STATUSES = [
  "Submitted",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Selected",
  "Rejected",
];

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const isAuth = await isAuthenticatedAdmin(req);
  if (!isAuth) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rawId = params.id;
    const body = await req.json();
    const newStatus = body.status?.trim();

    if (!newStatus || !VALID_STATUSES.includes(newStatus)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const all = await getAllStoredApplications();
    const target = all.find(
      (a) =>
        a.application_reference === rawId ||
        String(a.id) === rawId ||
        a.application_reference.toLowerCase() === rawId.toLowerCase()
    );

    if (!target) {
      return NextResponse.json({ success: false, error: "Applicant not found" }, { status: 404 });
    }

    await updateCloudApplicationStatus(target.application_reference, newStatus);

    return NextResponse.json({
      success: true,
      message: `Status updated to ${newStatus}`,
      status: newStatus,
    });
  } catch (err: unknown) {
    console.error("Status update error:", (err as Error).message);
    return NextResponse.json(
      { success: false, error: "Failed to update candidate status" },
      { status: 500 }
    );
  }
}
