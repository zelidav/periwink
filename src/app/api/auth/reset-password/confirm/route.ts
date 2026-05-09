import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();
  if (!token || !password || password.length < 8) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const record = await prisma.verificationToken.findUnique({ where: { token } });

  if (!record || !record.identifier.startsWith("password-reset:")) {
    return NextResponse.json({ error: "invalid_token" }, { status: 400 });
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });
    return NextResponse.json({ error: "token_expired" }, { status: 400 });
  }

  const email = record.identifier.replace("password-reset:", "");
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.update({ where: { email }, data: { passwordHash } });
  await prisma.verificationToken.delete({ where: { token } });

  return NextResponse.json({ ok: true });
}
