import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";
import { supabaseAdmin } from "./supabase";

export interface UploadedFile {
  name: string;
  type: string;
  size: number;
  buffer: Buffer;
}

export interface StorageResult {
  key: string;
  size: number;
  originalName: string;
}

// 4.0 MB limit to guarantee safety under Vercel Serverless Function 4.5 MB body limit
const MAX_FILE_SIZE = 4 * 1024 * 1024;

/**
 * Safe writable directory resolver for temporary buffers.
 * On serverless environments (e.g. Vercel, AWS Lambda), `/var/task` is read-only.
 * Only `os.tmpdir()` (`/tmp`) is writable.
 */
function getSafeTempDir(): string {
  const baseTmp = os.tmpdir() || "/tmp";
  const resumesDir = path.join(baseTmp, "mentneo_resumes");
  try {
    if (!fs.existsSync(resumesDir)) {
      fs.mkdirSync(resumesDir, { recursive: true });
    }
    return resumesDir;
  } catch {
    return baseTmp;
  }
}

/**
 * Validates that an incoming file is a legitimate PDF document and within size limits.
 */
export function validatePdfFile(file: { name: string; type: string; size: number; buffer: Buffer }): {
  valid: boolean;
  error?: string;
} {
  if (!file || !file.buffer || file.buffer.length === 0) {
    return { valid: false, error: "Resume PDF file is required." };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Resume file is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Please upload a PDF under 4.0 MB.`,
    };
  }

  // Validate filename extension
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return { valid: false, error: "Only PDF documents (.pdf) are accepted." };
  }

  // Validate declared MIME type
  if (file.type && file.type !== "application/pdf" && file.type !== "application/x-pdf") {
    return { valid: false, error: "Invalid document type. Please upload a standard PDF." };
  }

  // Validate magic bytes: PDF files MUST begin with %PDF- (hex: 25 50 44 46 2D)
  const header = file.buffer.slice(0, 5).toString("ascii");
  if (header !== "%PDF-") {
    return { valid: false, error: "Invalid or corrupted PDF format. Please upload a genuine PDF document." };
  }

  return { valid: true };
}

/**
 * Stores resume into Cloudflare R2 / Supabase Storage with local temp resilience.
 * Never crashes on serverless read-only filesystems.
 */
export async function saveResumeFile(
  reference: string,
  file: { name: string; type: string; size: number; buffer: Buffer }
): Promise<StorageResult> {
  const validation = validatePdfFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const cleanName = path.basename(file.name).replace(/[^a-zA-Z0-9._-]/g, "_");
  const randomSuffix = crypto.randomBytes(4).toString("hex");
  const key = `resumes/${reference}_${Date.now()}_${randomSuffix}.pdf`;

  let uploadedRemote = false;

  // 1. Upload to Supabase Storage (Primary Serverless Storage)
  try {
    const { error: supaErr } = await supabaseAdmin.storage
      .from("resumes")
      .upload(key, file.buffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (!supaErr) {
      uploadedRemote = true;
      console.log(`[Storage] Saved resume to Supabase Storage: ${key}`);
    } else {
      console.warn("[Storage] Supabase bucket notice:", supaErr.message);
    }
  } catch (err: unknown) {
    console.warn("[Storage] Supabase storage exception:", (err as Error).message);
  }

  // 2. Upload to Cloudflare R2 (Secondary / Redundant Storage)
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || "smartcitylab";
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (accountId && bucketName && apiToken) {
    try {
      // Cloudflare API Object PUT
      const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${bucketName}/objects/${key}`;
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/pdf",
          "Content-Length": file.buffer.length.toString(),
        },
        body: new Uint8Array(file.buffer),
      });

      if (res.ok) {
        uploadedRemote = true;
        console.log(`[Storage] Saved resume to Cloudflare R2: ${key}`);
      }
    } catch (err: unknown) {
      console.warn("[Storage] Cloudflare R2 upload notice:", (err as Error).message);
    }
  }

  // 3. Fallback: Save to safe serverless writable temp directory (/tmp)
  try {
    const tempDir = getSafeTempDir();
    const tempFilePath = path.join(tempDir, path.basename(key));
    fs.writeFileSync(tempFilePath, file.buffer);
    console.log(`[Storage] Cached local temp resume: ${tempFilePath}`);
  } catch (diskErr) {
    // If disk is completely unavailable, ignore if remote storage succeeded
    if (!uploadedRemote) {
      console.warn("[Storage] Warning: Local disk write failed:", (diskErr as Error).message);
    }
  }

  return {
    key,
    size: file.buffer.length,
    originalName: cleanName,
  };
}

/**
 * Retrieves a resume buffer for authenticated admin viewing or downloading.
 */
export async function getResumeFile(key: string): Promise<{ buffer: Buffer; contentType: string } | null> {
  // 1. Try Supabase Storage
  try {
    const { data, error } = await supabaseAdmin.storage.from("resumes").download(key);
    if (!error && data) {
      const arrayBuf = await data.arrayBuffer();
      return {
        buffer: Buffer.from(arrayBuf),
        contentType: "application/pdf",
      };
    }
  } catch (err) {
    console.warn("[Storage] Supabase download notice:", (err as Error).message);
  }

  // 2. Try Cloudflare R2 Public URL
  const publicUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL;
  if (publicUrl) {
    try {
      const res = await fetch(`${publicUrl}/${key}`);
      if (res.ok) {
        const arrayBuf = await res.arrayBuffer();
        return {
          buffer: Buffer.from(arrayBuf),
          contentType: "application/pdf",
        };
      }
    } catch {}
  }

  // 3. Try Safe Temp Directory
  try {
    const fileName = path.basename(key);
    const tempDir = getSafeTempDir();
    const tempFilePath = path.join(tempDir, fileName);
    if (fs.existsSync(tempFilePath)) {
      const buffer = fs.readFileSync(tempFilePath);
      return {
        buffer,
        contentType: "application/pdf",
      };
    }
  } catch {}

  // 4. Try local project data/resumes if on development machine
  try {
    const fileName = path.basename(key);
    const localFilePath = path.resolve(process.cwd(), "data/resumes", fileName);
    if (fs.existsSync(localFilePath)) {
      const buffer = fs.readFileSync(localFilePath);
      return {
        buffer,
        contentType: "application/pdf",
      };
    }
  } catch {}

  return null;
}
