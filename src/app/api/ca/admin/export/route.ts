import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/career/auth";
import { dbQuery, ApplicationRecord } from "@/lib/career/db";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";

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

    const whereClauses: string[] = [];
    const params: (string | number)[] = [];

    if (type && ["btech", "mba", "internship"].includes(type)) {
      whereClauses.push("a.applicant_type = ?");
      params.push(type);
    }

    if (status && status !== "all") {
      whereClauses.push("a.application_status = ?");
      params.push(status);
    }

    if (gradYear && gradYear !== "all") {
      whereClauses.push("a.graduation_year = ?");
      params.push(gradYear);
    }

    if (position && position !== "all") {
      whereClauses.push(
        "a.id IN (SELECT application_id FROM application_positions WHERE position_name LIKE ?)"
      );
      params.push(`%${position}%`);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const sql = `
      SELECT a.*
      FROM applications a
      ${whereSql}
      ORDER BY a.id DESC
    `;

    const apps = await dbQuery<ApplicationRecord>(sql, params);

    // Fetch positions map
    const appIds = apps.map((a) => a.id);
    const appPositionsMap: Record<number, string> = {};

    if (appIds.length > 0) {
      const placeholders = appIds.map(() => "?").join(",");
      const positionsList = await dbQuery<{ application_id: number; position_name: string }>(
        `SELECT application_id, position_name FROM application_positions WHERE application_id IN (${placeholders})`,
        appIds
      );
      for (const p of positionsList) {
        if (!appPositionsMap[p.application_id]) {
          appPositionsMap[p.application_id] = p.position_name;
        } else {
          appPositionsMap[p.application_id] += `, ${p.position_name}`;
        }
      }
    }

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const baseUrl = `${protocol}://${host}`;

    // Map rows to structured export format
    const rows = apps.map((a) => {
      const resumeLink = a.resume_object_key
        ? `${baseUrl}/api/ca/admin/applications/${a.id}/resume`
        : "N/A";

      return {
        "Application Reference": a.application_reference,
        "Applicant Type": a.applicant_type.toUpperCase(),
        "Full Name": a.full_name,
        "Email ID": a.email,
        "Mobile Number": a.mobile,
        "College Name": a.college_name || "N/A",
        "Roll Number": a.college_roll_number,
        "Branch / Specialization": a.branch || a.mba_specialization || "N/A",
        "CGPA / Percentage": a.current_cgpa || a.current_percentage || "N/A",
        "Graduation Year": a.graduation_year,
        "Applied Positions": appPositionsMap[a.id] || "N/A",
        "Technical Skills / Strengths": a.technical_skills || a.skills_strengths || "N/A",
        "Previous Experience": a.previous_experience || "N/A",
        "GitHub URL": a.github_url || "N/A",
        "LinkedIn URL": a.linkedin_url || "N/A",
        "Relocation Willingness": a.relocation_willingness,
        "Application Status": a.application_status,
        "Submission Date": a.submitted_at,
        "Secure Resume Link": resumeLink,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Auto-fit column widths
    const colWidths = Object.keys(rows[0] || {}).map((key) => {
      const maxLen = Math.max(
        key.length,
        ...rows.map((r) => String((r as Record<string, unknown>)[key] || "").length)
      );
      return { wch: Math.min(maxLen + 4, 45) };
    });
    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants");

    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `Mentneo_Applicants_${type || "all"}_${dateStr}`;

    if (format === "csv") {
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}.csv"`,
          "Cache-Control": "no-store",
        },
      });
    }

    // Default: XLSX
    const buf = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(new Uint8Array(buf), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}.xlsx"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err: unknown) {
    console.error("Export error:", (err as Error).message);
    return NextResponse.json({ success: false, error: "Export generation failed" }, { status: 500 });
  }
}
