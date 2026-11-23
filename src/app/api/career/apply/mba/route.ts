import { NextRequest, NextResponse } from "next/server";
import { dbExecute, generateApplicationReference } from "@/lib/career/db";
import { saveResumeFile, validatePdfFile } from "@/lib/career/storage";
import { persistNewApplication, getAllStoredApplications } from "@/lib/career/cloud-store";
import { getCareerFormSettings } from "@/lib/career/form-config";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const settings = await getCareerFormSettings();

    // Check if applications are open for MBA
    if (!settings.globalOpen || !settings.mba.isOpen) {
      return NextResponse.json(
        {
          success: false,
          error: settings.mba.closedMessage || "Applications for the MBA Commercial cohort are currently closed.",
          closed: true,
        },
        { status: 403 }
      );
    }

    const formData = await req.formData();

    const fullName = (formData.get("fullName") as string)?.trim() || "";
    const email = (formData.get("email") as string)?.trim().toLowerCase() || "";
    const mobile = (formData.get("mobile") as string)?.trim() || "";
    const collegeName = (formData.get("collegeName") as string)?.trim() || "KIET Group of Institutions";
    const collegeRollNumber = (formData.get("collegeRollNumber") as string)?.trim() || "";
    const mbaSpecialization = (formData.get("mbaSpecialization") as string)?.trim() || "Marketing";
    const currentCgpa = (formData.get("currentCgpa") as string)?.trim() || "";
    const graduationYear = (formData.get("graduationYear") as string)?.trim() || "2026";
    const relocationWillingness = (formData.get("relocationWillingness") as string)?.trim() || "";
    const skillsStrengths = (formData.get("skillsStrengths") as string)?.trim() || "";
    const previousExperience = (formData.get("previousExperience") as string)?.trim() || null;
    const linkedinUrl = (formData.get("linkedinUrl") as string)?.trim() || null;
    const positionsRaw = formData.get("positions") as string;
    const resumeFile = formData.get("resume") as File | null;

    // Check required fields based on dynamic field config
    const fieldMap = new Map(settings.mba.fields.map((f) => [f.id, f]));

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
    checkRequired("collegeName", collegeName, "Business School / College Name");
    checkRequired("collegeRollNumber", collegeRollNumber, "Roll / Registration Number");
    checkRequired("mbaSpecialization", mbaSpecialization, "MBA Specialization");
    checkRequired("currentCgpa", currentCgpa, "Current CGPA / Percentage");
    checkRequired("graduationYear", graduationYear, "Graduation Year");
    checkRequired("skillsStrengths", skillsStrengths, "Key Strengths");
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

    // Duplicate submission prevention: check existing applications
    try {
      const existingApps = await getAllStoredApplications();
      const cleanMobile = mobile.replace(/\D/g, "");
      const cleanRoll = collegeRollNumber.toLowerCase().trim();
      const cleanEmail = email.toLowerCase().trim();

      const duplicate = existingApps.find((a) => {
        const dupEmail = a.email && a.email.toLowerCase().trim() === cleanEmail;
        const dupMobile = cleanMobile.length >= 10 && a.mobile && a.mobile.replace(/\D/g, "") === cleanMobile;
        const dupRoll = cleanRoll && a.college_roll_number && a.college_roll_number.toLowerCase().trim() === cleanRoll;
        return dupEmail || dupMobile || dupRoll;
      });

      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            error: `An application has already been registered with this Email, Mobile number, or Roll number. Your reference code is ${duplicate.application_reference}. Duplicate submissions are not allowed.`,
            duplicate: true,
            reference: duplicate.application_reference,
          },
          { status: 409 }
        );
      }
    } catch (dupErr) {
      console.warn("[Apply MBA] Duplicate check notice:", (dupErr as Error).message);
    }

    let positions: string[] = [];
    try {
      positions = JSON.parse(positionsRaw || "[]");
    } catch {
      positions = positionsRaw ? [positionsRaw] : [];
    }

    if (!Array.isArray(positions) || positions.length === 0) {
      positions = ["Management & Business Operations"];
    }

    // Collect custom fields
    const customFields: Record<string, unknown> = {};
    for (const field of settings.mba.fields) {
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
    const reference = generateApplicationReference("mba");

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
    const targetBinId = settings.mba.targetBinId || settings.activeBinId || "bin-2";
    const targetBin = settings.bins.find((b) => b.id === targetBinId) || settings.bins[0];

    // Insert into local SQLite
    let appId = 0;
    try {
      const insertResult = await dbExecute(
        `INSERT INTO applications (
          application_reference, applicant_type, full_name, email, mobile,
          college_name, college_roll_number, mba_specialization, current_cgpa, graduation_year,
          relocation_willingness, skills_strengths, previous_experience, linkedin_url,
          resume_object_key, application_status, cohort_id, cohort_name, custom_fields
        ) VALUES (?, 'mba', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Submitted', ?, ?, ?)`,
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
      console.warn("[Apply MBA] Local SQLite insert warning:", (dbErr as Error).message);
    }

    // Persist across Cloudflare R2 and Supabase cloud store
    await persistNewApplication(
      {
        id: appId || Date.now(),
        application_reference: reference,
        applicant_type: "mba",
        full_name: fullName,
        email,
        mobile,
        college_name: collegeName,
        college_roll_number: collegeRollNumber,
        branch: null,
        mba_specialization: mbaSpecialization,
        current_cgpa: currentCgpa,
        current_percentage: null,
        graduation_year: graduationYear,
        relocation_willingness: (relocationWillingness as "Yes" | "No") || "Yes",
        technical_skills: null,
        skills_strengths: skillsStrengths,
        github_url: null,
        linkedin_url: linkedinUrl,
        previous_experience: previousExperience,
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
      applicantType: "mba",
      fullName,
      email,
      positions,
      cohortId: targetBin.id,
      cohortName: targetBin.name,
      submittedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    console.error("Error processing MBA application:", (err as Error).message);
    return NextResponse.json(
      { success: false, error: (err as Error).message || "Failed to process application" },
      { status: 400 }
    );
  }
}
