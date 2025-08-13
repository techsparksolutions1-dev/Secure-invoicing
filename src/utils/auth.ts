import { cookies } from "next/headers";

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token");

    if (!token) return false;

    const sessionData = JSON.parse(atob(token.value));

    if (Date.now() > sessionData.expires) {
      return false;
    }

    return sessionData.username === process.env.APP_USERNAME;
  } catch (error) {
    console.error("Auth check error:", error);
    return false;
  }
}

export async function requireAuth() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    throw new Error("Authentication required");
  }
}
