import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/career/auth";
import { dbExecute } from "@/lib/career/db";

export const dynamic = "force-dynamic";

export async function POST(
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
    const note = body.note?.trim();

    if (!note) {
      return NextResponse.json(
        { success: false, error: "Note content cannot be empty." },
        { status: 400 }
      );
    }

    // Insert note
    await dbExecute(
      "INSERT INTO application_notes (application_id, admin_id, note) VALUES (?, 'admin', ?)",
      [id, note]
    );

    // Record timeline event
    await dbExecute(
      "INSERT INTO application_events (application_id, event_type, event_description) VALUES (?, 'note_added', ?)",
      [id, `Admin note added: "${note.slice(0, 60)}${note.length > 60 ? "..." : ""}"`]
    );

    return NextResponse.json({
      success: true,
      message: "Note logged successfully.",
      created_at: new Date().toISOString(),
    });
  } catch (err: unknown) {
    console.error("Error adding note:", (err as Error).message);
    return NextResponse.json(
      { success: false, error: "Failed to record admin note." },
      { status: 500 }
    );
  }
}
