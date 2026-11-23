import { NextRequest, NextResponse } from "next/server";
import { dbExecute, generateApplicationReference } from "@/lib/career/db";
import { saveResumeFile, validatePdfFile } from "@/lib/career/storage";
import { persistNewApplication } from "@/lib/career/cloud-store";
import { getCareerFormSettings } from "@/lib/career/form-config";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const settings = await getCareerFormSettings();

    // Check if applications are open for BTech
    if (!settings.globalOpen || !settings.btech.isOpen) {
      return NextResponse.json(
        {
          success: false,
          error: settings.btech.closedMessage || "Applications for the B.Tech Machine Learning cohort are currently closed.",
          closed: true,
        },
        { status: 403 }
      );
    }

    const formData = await req.formData();

    const fullName = (formData.get("fullName") as string)?.trim() || "";
    const email = (formData.get("email") as string)?.trim().toLowerCase() || "";
    const mobile = (formData.get("mobile") as string)?.trim() || "";
    const collegeName = (formData.get("collegeName") as string)?.trim() || null;
    const collegeRollNumber = (formData.get("collegeRollNumber") as string)?.trim() || "";
    const branch = (formData.get("branch") as string)?.trim() || "";
    const currentCgpa = (formData.get("currentCgpa") as string)?.trim() || "";
    const graduationYear = (formData.get("graduationYear") as string)?.trim() || "2026";
    const relocationWillingness = (formData.get("relocationWillingness") as string)?.trim() || "";
    const technicalSkills = (formData.get("technicalSkills") as string)?.trim() || "";
    const githubUrl = (formData.get("githubUrl") as string)?.trim() || null;
    const linkedinUrl = (formData.get("linkedinUrl") as string)?.trim() || null;
    const positionsRaw = formData.get("positions") as string;
    const resumeFile = formData.get("resume") as File | null;

    // Check required fields based on dynamic field config
    const fieldMap = new Map(settings.btech.fields.map((f) => [f.id, f]));

    const checkRequired = (id: string, val: unknown, label: string) => {
      const cfg = fieldMap.get(id);
      if (cfg && cfg.enabled && cfg.required) {
        if (!val || (typeof val === "string" && !val.trim())) {
          throw new Error(`${label} is required to complete this application.`);
        }
      }
    };

    checkRequired("fullName", fullName, "Full Legal Name");
    checkRequired("email", email, "Email Address");
    checkRequired("mobile", mobile, "Mobile Number");
    checkRequired("collegeRollNumber", collegeRollNumber, "College Roll Number");
    checkRequired("branch", branch, "Branch / Specialization");
    checkRequired("currentCgpa", currentCgpa, "Current CGPA / Percentage");
    checkRequired("graduationYear", graduationYear, "Graduation Year");
    checkRequired("technicalSkills", technicalSkills, "Technical Skills");
    checkRequired("relocationWillingness", relocationWillingness, "Relocation preference");

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { success: false, error: "Please provide a valid email address." },
          { status: 400 }
        );
      }
    }

    let positions: string[] = [];
    try {
      positions = JSON.parse(positionsRaw || "[]");
    } catch {
      positions = positionsRaw ? [positionsRaw] : [];
    }

    if (!Array.isArray(positions) || positions.length === 0) {
      positions = ["Machine Learning Engineer"];
    }

    // Collect custom fields
    const customFields: Record<string, unknown> = {};
    for (const field of settings.btech.fields) {
      if (field.isCustom && field.enabled) {
        const val = formData.get(field.id);
        if (field.required && (!val || (typeof val === "string" && !val.trim()))) {
          return NextResponse.json(
            { success: false, error: `${field.label} is required to complete this application.` },
            { status: 400 }
          );
        }
        if (val) {
          customFields[field.id] = val;
        }
      }
    }

    // Resume check
    const resumeCfg = fieldMap.get("resume");
    if (resumeCfg && resumeCfg.enabled && resumeCfg.required && !resumeFile) {
      return NextResponse.json(
        { success: false, error: "Please upload your resume in PDF format (under 4 MB)." },
        { status: 400 }
      );
    }

    let storageKey: string | null = null;
    const reference = generateApplicationReference("btech");

    if (resumeFile) {
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
        return NextResponse.json({ success: false, error: pdfCheck.error }, { status: 400 });
      }

      const storageResult = await saveResumeFile(reference, fileMeta);
      storageKey = storageResult.key;
    }

    // Determine target bin
    const targetBinId = settings.btech.targetBinId || settings.activeBinId || "bin-2";
    const targetBin = settings.bins.find((b) => b.id === targetBinId) || settings.bins[0];

    // Insert into local SQLite
    let appId = 0;
    try {
      const insertResult = await dbExecute(
        `INSERT INTO applications (
          application_reference, applicant_type, full_name, email, mobile,
          college_name, college_roll_number, branch, current_cgpa, graduation_year,
          relocation_willingness, technical_skills, github_url, linkedin_url,
          resume_object_key, application_status, cohort_id, cohort_name, custom_fields
        ) VALUES (?, 'btech', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Submitted', ?, ?, ?)`,
        [
          reference,
          fullName,
          email,
          mobile,
          collegeName,
          collegeRollNumber,
          branch,
          currentCgpa,
          graduationYear,
          relocationWillingness,
          technicalSkills,
          githubUrl,
          linkedinUrl,
          storageKey,
          targetBin.id,
          targetBin.name,
          JSON.stringify(customFields),
        ]
      );
      appId = Number(insertResult.lastInsertRowid);

      for (const posTitle of positions) {
        await dbExecute(
          `INSERT INTO application_positions (application_id, position_id, position_name)
           VALUES (?, ?, ?)`,
          [appId, posTitle.toLowerCase().replace(/[^a-z0-9]/g, "-"), posTitle]
        );
      }
    } catch (dbErr) {
      console.warn("[Apply BTech] Local SQLite insert warning:", (dbErr as Error).message);
    }

    // Persist across Cloudflare R2 and Supabase cloud store
    await persistNewApplication(
      {
        id: appId || Date.now(),
        application_reference: reference,
        applicant_type: "btech",
        full_name: fullName,
        email,
        mobile,
        college_name: collegeName,
        college_roll_number: collegeRollNumber,
        branch,
        mba_specialization: null,
        current_cgpa: currentCgpa,
        current_percentage: null,
        graduation_year: graduationYear,
        relocation_willingness: (relocationWillingness as "Yes" | "No") || "Yes",
        technical_skills: technicalSkills,
        skills_strengths: null,
        github_url: githubUrl,
        linkedin_url: linkedinUrl,
        previous_experience: null,
        resume_object_key: storageKey,
        application_status: "Submitted",
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      positions,
      targetBin.id,
      targetBin.name,
      customFields
    );

    return NextResponse.json({
      success: true,
      reference,
      applicantType: "btech",
      fullName,
      email,
      positions,
      cohortId: targetBin.id,
      cohortName: targetBin.name,
      submittedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    console.error("Error processing BTech application:", (err as Error).message);
    return NextResponse.json(
      { success: false, error: (err as Error).message || "Failed to process application" },
      { status: 400 }
    );
  }
}
