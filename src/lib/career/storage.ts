import fs from "fs";
import path from "path";
import crypto from "crypto";

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

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * Validates that an incoming file is a legitimate PDF document.
 */
export function validatePdfFile(file: { name: string; type: string; size: number; buffer: Buffer }): {
  valid: boolean;
  error?: string;
} {
  if (!file || !file.buffer || file.buffer.length === 0) {
    return { valid: false, error: "Resume file is required." };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "Resume file exceeds the 10 MB limit." };
  }

  // Validate filename extension
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return { valid: false, error: "Only PDF files (.pdf) are accepted." };
  }

  // Validate declared MIME type
  if (file.type && file.type !== "application/pdf" && file.type !== "application/x-pdf") {
    return { valid: false, error: "Invalid document type. Please upload a PDF." };
  }

  // Validate magic bytes: PDF files MUST begin with %PDF- (hex: 25 50 44 46 2D)
  const header = file.buffer.slice(0, 5).toString("ascii");
  if (header !== "%PDF-") {
    return { valid: false, error: "Corrupted or non-standard PDF format. Please upload a genuine PDF." };
  }

  return { valid: true };
}

/**
 * Stores resume in Cloudflare R2 or local private secure directory.
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

  // Check Cloudflare R2 configuration
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || "smartcitylab";
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const accessKey = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

  if (accountId && bucketName && (apiToken || (accessKey && secretKey))) {
    try {
      const endpoint = `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${key}`;
      const headers: Record<string, string> = {
        "Content-Type": "application/pdf",
        "Content-Length": file.buffer.length.toString(),
      };
      if (apiToken) {
        headers["Authorization"] = `Bearer ${apiToken}`;
      }

      const res = await fetch(endpoint, {
        method: "PUT",
        headers,
        body: new Uint8Array(file.buffer),
      });

      if (res.ok) {
        console.log(`Successfully uploaded resume to Cloudflare R2: ${key}`);
      }
    } catch (err: unknown) {
      console.warn("R2 upload note (storing locally as well):", (err as Error).message);
    }
  }

  // Local fallback storage in data/resumes
  const resumesDir = path.resolve(process.cwd(), "data/resumes");
  if (!fs.existsSync(resumesDir)) {
    fs.mkdirSync(resumesDir, { recursive: true });
  }

  const localFilePath = path.join(resumesDir, path.basename(key));
  fs.writeFileSync(localFilePath, file.buffer);

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
  // Check Cloudflare R2
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;

  if (accountId && bucketName && process.env.CLOUDFLARE_R2_ACCESS_KEY_ID) {
    try {
      const endpoint = `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${key}`;
      const res = await fetch(endpoint);
      if (res.ok) {
        const arrayBuf = await res.arrayBuffer();
        return {
          buffer: Buffer.from(arrayBuf),
          contentType: "application/pdf",
        };
      }
    } catch (err: unknown) {
      console.warn("R2 fetch error, checking local fallback:", (err as Error).message);
    }
  }

  // Local file lookup
  const fileName = path.basename(key);
  const localFilePath = path.resolve(process.cwd(), "data/resumes", fileName);
  if (fs.existsSync(localFilePath)) {
    const buffer = fs.readFileSync(localFilePath);
    return {
      buffer,
      contentType: "application/pdf",
    };
  }

  return null;
}
