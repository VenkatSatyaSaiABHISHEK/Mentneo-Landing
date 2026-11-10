import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/career/auth";
import { dbQuery, ApplicationRecord } from "@/lib/career/db";
import { getResumeFile } from "@/lib/career/storage";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const isAuth = await isAuthenticatedAdmin(req);
  if (!isAuth) {
    return new NextResponse("Unauthorized: Admin credentials required to inspect applicant resumes", {
      status: 401,
      headers: { "Content-Type": "text/plain" },
    });
  }

  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return new NextResponse("Invalid Applicant ID", { status: 400 });
    }

    const apps = await dbQuery<ApplicationRecord>(
      "SELECT application_reference, full_name, resume_object_key FROM applications WHERE id = ?",
      [id]
    );

    if (!apps || apps.length === 0) {
      return new NextResponse("Applicant not found", { status: 404 });
    }

    const key = apps[0].resume_object_key;
    if (!key) {
      return new NextResponse("No resume attached to this application", { status: 404 });
    }

    const file = await getResumeFile(key);
    if (!file) {
      return new NextResponse("Resume file not found in storage", { status: 404 });
    }

    const cleanName = `${apps[0].full_name.replace(/[^a-zA-Z0-9_-]/g, "_")}_${apps[0].application_reference}.pdf`;

    return new NextResponse(new Uint8Array(file.buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${cleanName}"`,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err: unknown) {
    console.error("Resume retrieval error:", (err as Error).message);
    return new NextResponse("Failed to load resume", { status: 500 });
  }
}
