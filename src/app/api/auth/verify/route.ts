import { NextResponse } from "next/server";

import { isAuthenticated } from "@/utils/auth";

export async function GET() {
  try {
    const authenticated = await isAuthenticated();

    if (authenticated) {
      return NextResponse.json({
        success: true,
        authenticated: true,
      });
    }

    return NextResponse.json(
      { success: false, authenticated: false },
      { status: 401 }
    );
  } catch (error) {
    console.error("Auth verification error:", error);
    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}
