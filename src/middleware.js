import { NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  if (token) {
    try {

      if (pathname === "/login" || pathname === "/register") {
        return NextResponse.redirect(new URL("/", request.url));
      }

      return NextResponse.next();
    } catch (err) {
        console.log(err);
      if (pathname !== "/login" && pathname !== "/register") {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      return NextResponse.next();
    }
  }

  if (pathname === "/" || pathname.startsWith("/todos")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
