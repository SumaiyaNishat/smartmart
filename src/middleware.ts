import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function decodeJwt(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  let user = null;
  if (token) {
    user = decodeJwt(token);
    // Check if token is expired
    if (user && user.exp && Date.now() >= user.exp * 1000) {
      user = null;
    }
  }

  // Define route checks
  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/dashboard");
  // const isCustomerRoute = pathname.startsWith("/checkout");
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  if (isAdminRoute) {
    if (!user) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    if (user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // if (isCustomerRoute) {
  //   if (!user) {
  //     const url = new URL("/login", request.url);
  //     url.searchParams.set("redirect", pathname);
  //     return NextResponse.redirect(url);
  //   }
  //   if (user.role !== "customer") {
  //     return NextResponse.redirect(new URL("/dashboard", request.url));
  //   }
  // }

  if (isAuthRoute) {
    if (user) {
      if (user.role === "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    // "/checkout/:path*",
    "/login",
    "/register",
  ],
};
