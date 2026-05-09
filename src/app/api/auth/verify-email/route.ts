import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendFoundersNote } from "@/lib/email";

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${origin}/auth/signin?error=invalid_token`);
  }

  const record = await prisma.verificationToken.findUnique({ where: { token } });

  if (!record) {
    return NextResponse.redirect(`${origin}/auth/signin?error=invalid_token`);
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });
    return NextResponse.redirect(`${origin}/auth/signin?error=token_expired`);
  }

  const user = await prisma.user.update({
    where: { email: record.identifier },
    data: { emailVerified: new Date() },
    include: { profile: { select: { displayName: true } } },
  });

  await prisma.verificationToken.delete({ where: { token } });

  // Send founder's note now that account is confirmed
  const name = user.profile?.displayName || undefined;
  sendFoundersNote({ to: record.identifier, name }).catch((err) =>
    console.error("Failed to send founder's note after verification:", err)
  );

  return NextResponse.redirect(`${origin}/auth/signin?verified=1`);
}
