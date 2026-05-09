import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendFoundersNote } from "@/lib/email";
import { requireAdminAuth } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const authError = await requireAdminAuth(req);
  if (authError) return authError;

  const signups = await prisma.communitySignup.findMany({
    select: { email: true, name: true },
    orderBy: { createdAt: "asc" },
  });

  const results = { sent: 0, failed: 0, total: signups.length };

  for (const signup of signups) {
    try {
      await sendFoundersNote({
        to: signup.email,
        name: signup.name || undefined,
      });
      results.sent++;
      // Small pause to stay within Resend rate limits
      await new Promise((r) => setTimeout(r, 200));
    } catch {
      results.failed++;
    }
  }

  return NextResponse.json(results);
}
