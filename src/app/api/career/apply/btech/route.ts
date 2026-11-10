import { NextRequest, NextResponse } from "next/server";
import { dbExecute, generateApplicationReference } from "@/lib/career/db";
import { saveResumeFile, validatePdfFile } from "@/lib/career/storage";
import { persistNewApplication } from "@/lib/career/cloud-store";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const fullName = (formData.get("fullName") as string)?.trim();
    const email = (formData.get("email") as string)?.trim().toLowerCase();
    const mobile = (formData.get("mobile") as string)?.trim();
    const collegeRollNumber = (formData.get("collegeRollNumber") as string)?.trim();
    const branch = (formData.get("branch") as string)?.trim();
    const currentCgpa = (formData.get("currentCgpa") as string)?.trim();
    const graduationYear = (formData.get("graduationYear") as string)?.trim();
    const relocationWillingness = (formData.get("relocationWillingness") as string)?.trim();
    const technicalSkills = (formData.get("technicalSkills") as string)?.trim();
    const githubUrl = (formData.get("githubUrl") as string)?.trim() || null;
    const linkedinUrl = (formData.get("linkedinUrl") as string)?.trim() || null;
    const positionsRaw = formData.get("positions") as string;
    const resumeFile = formData.get("resume") as File | null;

    // Field validations
    if (!fullName || !email || !mobile || !collegeRollNumber) {
      return NextResponse.json(
        { success: false, error: "Personal information fields are required." },
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

    if (!branch || !currentCgpa || !graduationYear) {
      return NextResponse.json(
        { success: false, error: "Academic details (Branch, CGPA, Graduation Year) are required." },
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
        { success: false, error: "Please select at least one position." },
        { status: 400 }
      );
    }

    if (!technicalSkills) {
      return NextResponse.json(
        { success: false, error: "Technical skills are required." },
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

    const reference = generateApplicationReference("btech");

    // Save resume to R2 / local secure storage
    const storageResult = await saveResumeFile(reference, fileMeta);

    // Insert into applications table
    const insertAppResult = await dbExecute(
      `INSERT INTO applications (
        application_reference, applicant_type, full_name, email, mobile,
        college_roll_number, branch, current_cgpa, graduation_year,
        relocation_willingness, technical_skills, github_url, linkedin_url,
        resume_object_key, application_status
      ) VALUES (?, 'btech', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Submitted')`,
      [
        reference,
        fullName,
        email,
        mobile,
        collegeRollNumber,
        branch,
        currentCgpa,
        graduationYear,
        relocationWillingness,
        technicalSkills,
        githubUrl,
        linkedinUrl,
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
        `BTech Application submitted for ${positions.join(", ")} by ${fullName} (${reference})`,
      ]
    );

    // Persist immediately across Cloudflare R2 and Supabase cloud store
    await persistNewApplication(
      {
        id: appId,
        application_reference: reference,
        applicant_type: "btech",
        full_name: fullName,
        email,
        mobile,
        college_name: null,
        college_roll_number: collegeRollNumber,
        branch,
        mba_specialization: null,
        current_cgpa: currentCgpa,
        current_percentage: null,
        graduation_year: graduationYear,
        relocation_willingness: relocationWillingness,
        technical_skills: technicalSkills,
        skills_strengths: null,
        github_url: githubUrl,
        linkedin_url: linkedinUrl,
        previous_experience: null,
        resume_object_key: storageResult.key,
        application_status: "Submitted",
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      positions
    );

    return NextResponse.json({
      success: true,
      reference,
      applicantType: "btech",
      fullName,
      email,
      positions,
      submittedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    console.error("Error processing BTech application:", (err as Error).message);
    return NextResponse.json(
      { success: false, error: (err as Error).message || "Failed to process application" },
      { status: 500 }
    );
  }
}
