import { NextRequest, NextResponse } from "next/server";
import { dbExecute, generateApplicationReference } from "@/lib/career/db";
import { saveResumeFile, validatePdfFile } from "@/lib/career/storage";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const fullName = (formData.get("fullName") as string)?.trim();
    const email = (formData.get("email") as string)?.trim().toLowerCase();
    const mobile = (formData.get("mobile") as string)?.trim();
    const collegeName = (formData.get("collegeName") as string)?.trim();
    const collegeRollNumber = (formData.get("collegeRollNumber") as string)?.trim();
    const mbaSpecialization = (formData.get("mbaSpecialization") as string)?.trim();
    const currentCgpa = (formData.get("currentCgpa") as string)?.trim();
    const graduationYear = (formData.get("graduationYear") as string)?.trim();
    const relocationWillingness = (formData.get("relocationWillingness") as string)?.trim();
    const skillsStrengths = (formData.get("skillsStrengths") as string)?.trim();
    const previousExperience = (formData.get("previousExperience") as string)?.trim() || null;
    const positionsRaw = formData.get("positions") as string;
    const resumeFile = formData.get("resume") as File | null;

    // Field validations
    if (!fullName || !email || !mobile || !collegeName || !collegeRollNumber) {
      return NextResponse.json(
        { success: false, error: "Personal information fields (Name, Email, Mobile, College Name, Roll Number) are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!mbaSpecialization || !currentCgpa || !graduationYear) {
      return NextResponse.json(
        { success: false, error: "Academic details (Specialization, CGPA/Percentage, Graduation Year) are required." },
        { status: 400 }
      );
    }

    let positions: string[] = [];
    try {
      positions = JSON.parse(positionsRaw || "[]");
    } catch {
      positions = positionsRaw ? [positionsRaw] : [];
    }

    if (!Array.isArray(positions) || positions.length === 0) {
      return NextResponse.json(
        { success: false, error: "Please select at least one interested position." },
        { status: 400 }
      );
    }

    if (!skillsStrengths) {
      return NextResponse.json(
        { success: false, error: "Skills & Strengths field is required." },
        { status: 400 }
      );
    }

    if (relocationWillingness !== "Yes" && relocationWillingness !== "No") {
      return NextResponse.json(
        { success: false, error: "Please answer the relocation question." },
        { status: 400 }
      );
    }

    if (!resumeFile) {
      return NextResponse.json(
        { success: false, error: "Please upload your resume in PDF format." },
        { status: 400 }
      );
    }

    // Convert resume File to Buffer
    const arrayBuffer = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileMeta = {
      name: resumeFile.name,
      type: resumeFile.type,
      size: resumeFile.size,
      buffer,
    };

    const pdfCheck = validatePdfFile(fileMeta);
    if (!pdfCheck.valid) {
      return NextResponse.json(
        { success: false, error: pdfCheck.error },
        { status: 400 }
      );
    }

    const reference = generateApplicationReference("mba");

    // Save resume to R2 / local secure storage
    const storageResult = await saveResumeFile(reference, fileMeta);

    // Insert into applications table
    const insertAppResult = await dbExecute(
      `INSERT INTO applications (
        application_reference, applicant_type, full_name, email, mobile,
        college_name, college_roll_number, mba_specialization, current_cgpa,
        graduation_year, relocation_willingness, skills_strengths, previous_experience,
        resume_object_key, application_status
      ) VALUES (?, 'mba', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Submitted')`,
      [
        reference,
        fullName,
        email,
        mobile,
        collegeName,
        collegeRollNumber,
        mbaSpecialization,
        currentCgpa,
        graduationYear,
        relocationWillingness,
        skillsStrengths,
        previousExperience,
        storageResult.key,
      ]
    );

    const appId = Number(insertAppResult.lastInsertRowid);

    // Insert each position
    for (const posTitle of positions) {
      await dbExecute(
        `INSERT INTO application_positions (application_id, position_id, position_name)
         VALUES (?, ?, ?)`,
        [appId, posTitle.toLowerCase().replace(/[^a-z0-9]/g, "-"), posTitle]
      );
    }

    // Log application event
    await dbExecute(
      `INSERT INTO application_events (application_id, event_type, event_description)
       VALUES (?, 'application_submitted', ?)`,
      [
        appId,
        `MBA Application submitted for ${positions.join(", ")} by ${fullName} (${reference})`,
      ]
    );

    return NextResponse.json({
      success: true,
      reference,
      applicantType: "mba",
      fullName,
      email,
      positions,
      submittedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    console.error("Error processing MBA application:", (err as Error).message);
    return NextResponse.json(
      { success: false, error: (err as Error).message || "Failed to process application" },
      { status: 500 }
    );
  }
}
