import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordReset } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ ok: true });

  const normalizedEmail = email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (user && user.passwordHash) {
    const identifier = `password-reset:${normalizedEmail}`;
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Remove any existing reset tokens for this email then create fresh
    await prisma.verificationToken.deleteMany({ where: { identifier } });
    await prisma.verificationToken.create({ data: { identifier, token, expires } });

    await sendPasswordReset({ to: normalizedEmail, token });
  }

  // Always return ok — never reveal whether email exists
  return NextResponse.json({ ok: true });
}
