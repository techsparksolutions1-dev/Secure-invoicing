import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token");

  const protectedRoutes = [
    "/home",
    "/generate-invoice",
    "/view-invoices",
    "/delete-url",
  ];

  const publicPaymentRoutes = ["/pay-invoice", "/payment-success"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isPublicPaymentRoute = publicPaymentRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isPublicPaymentRoute) {
    return NextResponse.next();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isValidToken = (token: any) => {
    if (!token) return false;
    try {
      const sessionData = JSON.parse(atob(token.value));
      return (
        Date.now() < sessionData.expires &&
        sessionData.username === process.env.APP_USERNAME
      );
    } catch {
      return false;
    }
  };

  if (isProtectedRoute && !isValidToken(token)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname === "/" && isValidToken(token)) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
