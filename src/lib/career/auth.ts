import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const DEFAULT_SECRET = "mentneo-super-secure-career-auth-secret-key-2026";
const SESSION_COOKIE_NAME = "ca_session";
const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60; // 8 hours

// Simple in-memory rate limiting map for login attempts
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();

export function checkLoginRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) return { allowed: true };

  if (record.lockedUntil > now) {
    const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  if (record.lockedUntil <= now && record.count >= 5) {
    // Reset after lock expires
    loginAttempts.delete(ip);
  }

  return { allowed: true };
}

export function recordFailedLogin(ip: string): void {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { count: 0, lockedUntil: 0 };
  record.count += 1;

  if (record.count >= 5) {
    record.lockedUntil = now + 15 * 60 * 1000; // Lock for 15 minutes
  }

  loginAttempts.set(ip, record);
}

export function resetLoginAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

/**
 * Creates an HMAC signed session token
 */
export function createSessionToken(): string {
  const secret = process.env.CAREER_SESSION_SECRET || DEFAULT_SECRET;
  const payload = {
    role: "admin",
    iat: Date.now(),
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
    nonce: crypto.randomBytes(8).toString("hex"),
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");

  return `${payloadB64}.${signature}`;
}

/**
 * Validates session token signature and expiration
 */
export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const secret = process.env.CAREER_SESSION_SECRET || DEFAULT_SECRET;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payloadB64, signature] = parts;
  const expectedSig = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
    return false;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf-8"));
    if (payload.role !== "admin") return false;
    if (Date.now() > payload.exp) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates admin 8-digit PIN (and optional password).
 * Default expected PIN is "31012005".
 */
export function validateAdminCredentials(password?: string, pin?: string): boolean {
  const expectedPin = (process.env.CAREER_ADMIN_PIN || "31012005").trim();
  const expectedPassword = (process.env.CAREER_ADMIN_PASSWORD || expectedPin).trim();

  const inputPin = (pin || "").trim();
  const inputPass = (password || "").trim();

  // Primary check: Direct 8-digit PIN match
  if (inputPin === expectedPin) {
    return true;
  }

  // Secondary check: Password provided matches PIN or configured password
  if (inputPass === expectedPin || inputPass === expectedPassword) {
    return true;
  }

  return false;
}

/**
 * Extracts and verifies admin session from an incoming NextRequest or cookies()
 */
export async function isAuthenticatedAdmin(req?: NextRequest): Promise<boolean> {
  let token: string | undefined;

  if (req) {
    token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      const authHeader = req.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.slice(7);
      }
    }
  } else {
    try {
      const cookieStore = cookies();
      token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    } catch {
      token = undefined;
    }
  }

  return verifySessionToken(token);
}

export { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS };
