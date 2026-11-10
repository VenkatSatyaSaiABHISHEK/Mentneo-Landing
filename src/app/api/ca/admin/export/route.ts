import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/career/auth";
import { getAllStoredApplications } from "@/lib/career/cloud-store";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const isAuth = await isAuthenticatedAdmin(req);
  if (!isAuth) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const format = (searchParams.get("format") || "xlsx").toLowerCase();
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const position = searchParams.get("position");
    const gradYear = searchParams.get("gradYear");

    let apps = await getAllStoredApplications();

    if (type && ["btech", "mba", "internship"].includes(type)) {
      apps = apps.filter((a) => a.applicant_type === type);
    }

    if (status && status !== "all") {
      apps = apps.filter((a) => a.application_status === status);
    }

    if (gradYear && gradYear !== "all") {
      apps = apps.filter((a) => a.graduation_year === gradYear);
    }

    if (position && position !== "all") {
      apps = apps.filter((a) =>
        a.positions?.some((p) => p.toLowerCase().includes(position.toLowerCase()))
      );
    }

    const rows = apps.map((a) => ({
      Reference: a.application_reference,
      Cohort: a.applicant_type.toUpperCase(),
      "Full Name": a.full_name,
      Email: a.email,
      Mobile: a.mobile,
      College: a.college_name || "N/A",
      "Roll Number": a.college_roll_number,
      Branch: a.branch || a.mba_specialization || "N/A",
      "Applied Roles": (a.positions || []).join(", "),
      "CGPA / %": a.current_cgpa || a.current_percentage || "N/A",
      "Grad Year": a.graduation_year,
      "Relocate to Hyd": a.relocation_willingness,
      Skills: a.technical_skills || a.skills_strengths || "N/A",
      GitHub: a.github_url || "N/A",
      LinkedIn: a.linkedin_url || "N/A",
      Experience: a.previous_experience || "N/A",
      Status: a.application_status,
      "Submitted At": a.submitted_at,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");

    // Format widths
    const columnWidths = [
      { wch: 18 }, // Reference
      { wch: 10 }, // Cohort
      { wch: 22 }, // Full Name
      { wch: 26 }, // Email
      { wch: 14 }, // Mobile
      { wch: 28 }, // College
      { wch: 16 }, // Roll Number
      { wch: 22 }, // Branch
      { wch: 30 }, // Applied Roles
      { wch: 10 }, // CGPA
      { wch: 10 }, // Grad Year
      { wch: 14 }, // Relocate
      { wch: 35 }, // Skills
      { wch: 25 }, // GitHub
      { wch: 25 }, // LinkedIn
      { wch: 25 }, // Experience
      { wch: 14 }, // Status
      { wch: 20 }, // Submitted At
    ];
    worksheet["!cols"] = columnWidths;

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);

    if (format === "csv") {
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="mentneo-candidates-${timestamp}.csv"`,
        },
      });
    }

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="mentneo-candidates-${timestamp}.xlsx"`,
      },
    });
  } catch (err: unknown) {
    console.error("Export error:", (err as Error).message);
    return NextResponse.json(
      { success: false, error: "Failed to generate candidates export file" },
      { status: 500 }
    );
  }
}
