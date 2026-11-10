import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/career/auth";
import { dbQuery, dbExecute } from "@/lib/career/db";

export const dynamic = "force-dynamic";

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
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "Invalid applicant ID" }, { status: 400 });
    }

    const body = await req.json();
    const newStatus = body.status?.trim();

    if (!newStatus || !VALID_STATUSES.includes(newStatus)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    // Get current status
    const current = await dbQuery<{ application_status: string; full_name: string }>(
      "SELECT application_status, full_name FROM applications WHERE id = ?",
      [id]
    );

    if (!current || current.length === 0) {
      return NextResponse.json({ success: false, error: "Applicant not found" }, { status: 404 });
    }

    const prevStatus = current[0].application_status;

    if (prevStatus === newStatus) {
      return NextResponse.json({
        success: true,
        message: "Status unchanged",
        status: newStatus,
      });
    }

    // Update status
    await dbExecute(
      "UPDATE applications SET application_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [newStatus, id]
    );

    // Record history event
    await dbExecute(
      "INSERT INTO application_events (application_id, event_type, event_description) VALUES (?, 'status_change', ?)",
      [id, `Status updated from "${prevStatus}" to "${newStatus}"`]
    );

    return NextResponse.json({
      success: true,
      message: `Status updated to ${newStatus}`,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    console.error("Error updating application status:", (err as Error).message);
    return NextResponse.json(
      { success: false, error: "Failed to update application status" },
      { status: 500 }
    );
  }
}
