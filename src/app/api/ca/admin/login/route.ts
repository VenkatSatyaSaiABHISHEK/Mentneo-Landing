import { NextRequest, NextResponse } from "next/server";
import {
  validateAdminCredentials,
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  checkLoginRateLimit,
  recordFailedLogin,
  resetLoginAttempts,
} from "@/lib/career/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const rateCheck = checkLoginRateLimit(ip);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed attempts. Account temporarily locked for ${rateCheck.retryAfterSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const pin = body.pin || body.password;
    const password = body.password || body.pin;

    if (!pin && !password) {
      return NextResponse.json(
        { success: false, error: "8-digit Admin Security PIN is required." },
        { status: 400 }
      );
    }

    const isValid = validateAdminCredentials(password, pin);

    if (!isValid) {
      recordFailedLogin(ip);
      return NextResponse.json(
        { success: false, error: "Invalid admin password or security PIN." },
        { status: 401 }
      );
    }

    // Success: reset attempts & issue signed session cookie
    resetLoginAttempts(ip);
    const token = createSessionToken();

    const response = NextResponse.json({
      success: true,
      message: "Admin session authenticated successfully.",
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: "/",
    });

    return response;
  } catch (err: unknown) {
    console.error("Login route error:", (err as Error).message);
    return NextResponse.json(
      { success: false, error: "Authentication service error." },
      { status: 500 }
    );
  }
}
