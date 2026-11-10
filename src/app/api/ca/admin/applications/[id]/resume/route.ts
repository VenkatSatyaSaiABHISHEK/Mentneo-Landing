import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/career/auth";
import { getAllStoredApplications } from "@/lib/career/cloud-store";
import { getResumeFile } from "@/lib/career/storage";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

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
    const rawId = params.id;
    const all = await getAllStoredApplications();
    const app = all.find(
      (a) =>
        a.application_reference === rawId ||
        String(a.id) === rawId ||
        a.application_reference.toLowerCase() === rawId.toLowerCase()
    );

    if (!app) {
      return new NextResponse("Applicant not found", { status: 404 });
    }

    const key = app.resume_object_key;
    if (!key) {
      return new NextResponse("No resume attached to this application", { status: 404 });
    }

    const file = await getResumeFile(key);
    if (!file) {
      return new NextResponse("Resume file not found in storage", { status: 404 });
    }

    const cleanName = `${app.full_name.replace(/[^a-zA-Z0-9_-]/g, "_")}_${app.application_reference}.pdf`;

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
