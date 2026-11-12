import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: "Applications for the 2026 MBA hiring cycle are now officially closed. Thank you for your interest in Mentneo.",
      closed: true,
    },
    { status: 403 }
  );
}
