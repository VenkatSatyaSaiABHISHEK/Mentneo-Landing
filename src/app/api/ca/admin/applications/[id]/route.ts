import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/career/auth";
import {
  dbQuery,
  ApplicationRecord,
  ApplicationPositionRecord,
  ApplicationEventRecord,
  ApplicationNoteRecord,
} from "@/lib/career/db";

export const dynamic = "force-dynamic";

export async function GET(
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

    const apps = await dbQuery<ApplicationRecord>(
      "SELECT * FROM applications WHERE id = ?",
      [id]
    );

    if (!apps || apps.length === 0) {
      return NextResponse.json({ success: false, error: "Applicant not found" }, { status: 404 });
    }

    const application = apps[0];

    // Fetch applied positions
    const positions = await dbQuery<ApplicationPositionRecord>(
      "SELECT * FROM application_positions WHERE application_id = ?",
      [id]
    );

    // Fetch application history events
    const events = await dbQuery<ApplicationEventRecord>(
      "SELECT * FROM application_events WHERE application_id = ? ORDER BY id DESC",
      [id]
    );

    // Fetch admin notes
    const notes = await dbQuery<ApplicationNoteRecord>(
      "SELECT * FROM application_notes WHERE application_id = ? ORDER BY id DESC",
      [id]
    );

    return NextResponse.json({
      success: true,
      data: {
        application,
        positions: positions.map((p) => p.position_name),
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
