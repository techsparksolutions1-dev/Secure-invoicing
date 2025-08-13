import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (
      username === process.env.APP_USERNAME &&
      password === process.env.APP_PASSWORD
    ) {
      const sessionToken = btoa(
        JSON.stringify({
          username,
          timestamp: Date.now(),
          expires: Date.now() + 24 * 60 * 60 * 1000,
        })
      );

      const cookieStore = await cookies();

      cookieStore.set("auth-token", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60,
        path: "/",
      });

      return NextResponse.json({
        success: true,
        message: "Login successful",
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}
