import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Verify admin access via the ADMIN_SECRET header or query param.
 * Returns null if authorized, or a 401 NextResponse if not.
 *
 * The admin password is set via ADMIN_SECRET env var (defaults to PERIADMIN
 * for backwards compatibility, but MUST be changed in production).
 */
export function verifyAdmin(request: NextRequest): NextResponse | null {
  const secret = process.env.ADMIN_SECRET || "PERIADMIN";

  // Check header first, then query param (for the browser-based dashboard)
  const headerToken = request.headers.get("x-admin-token");
  const queryToken = request.nextUrl.searchParams.get("token");

  if (headerToken === secret || queryToken === secret) {
    return null; // authorized
  }

  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}
