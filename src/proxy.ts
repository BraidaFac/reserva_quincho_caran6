import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const PUBLIC_ROUTES = ["/login", "/api/auth", "/signup"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));

  let session = null;
  try {
    session = await auth.api.getSession({ headers: request.headers });
  } catch {
    // getSession falló (DB timeout, error de red, etc.).
    // Dejamos pasar: las páginas protegidas tienen su propio check de sesión.
    return NextResponse.next();
  }

  if (!session && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (session && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|manifest.json|icons/|screenshots/|sw.js|workbox-.*|api/auth).*)"],
};
