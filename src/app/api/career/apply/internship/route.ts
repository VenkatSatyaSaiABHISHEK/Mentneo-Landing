import { NextRequest, NextResponse } from "next/server";
import { dbExecute, generateApplicationReference } from "@/lib/career/db";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const fullName = body.fullName?.trim();
    const email = body.email?.trim().toLowerCase();
    const mobile = body.mobile?.trim();
    const collegeName = body.collegeName?.trim() || null;
    const graduationYear = body.graduationYear?.trim() || "2026";
    const interestedDomain = body.interestedDomain?.trim() || "AI & Software Engineering";
    const notes = body.notes?.trim() || null;

    if (!fullName || !email || !mobile) {
      return NextResponse.json(
        { success: false, error: "Name, email, and mobile number are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const reference = generateApplicationReference("internship");

    const insertAppResult = await dbExecute(
      `INSERT INTO applications (
        application_reference, applicant_type, full_name, email, mobile,
        college_name, college_roll_number, branch, graduation_year,
        relocation_willingness, skills_strengths, application_status
      ) VALUES (?, 'internship', ?, ?, ?, ?, 'INTERN-PENDING', ?, ?, 'Yes', ?, 'Submitted')`,
      [
        reference,
        fullName,
        email,
        mobile,
        collegeName,
        interestedDomain,
        graduationYear,
        notes,
      ]
    );

    const appId = Number(insertAppResult.lastInsertRowid);

    await dbExecute(
      `INSERT INTO application_positions (application_id, position_id, position_name)
       VALUES (?, 'internship-2026', ?)`,
      [appId, `Internship: ${interestedDomain}`]
    );

    await dbExecute(
      `INSERT INTO application_events (application_id, event_type, event_description)
       VALUES (?, 'application_submitted', ?)`,
      [appId, `Internship interest registered for ${interestedDomain} by ${fullName} (${reference})`]
    );

    return NextResponse.json({
      success: true,
      reference,
      applicantType: "internship",
      fullName,
      email,
      domain: interestedDomain,
      submittedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    console.error("Error processing internship registration:", (err as Error).message);
    return NextResponse.json(
      { success: false, error: (err as Error).message || "Failed to submit registration" },
      { status: 500 }
    );
  }
}
