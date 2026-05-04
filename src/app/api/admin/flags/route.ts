import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const flags = await prisma.moderationFlag.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      post: {
        select: {
          id: true,
          title: true,
          body: true,
          identity: true,
          isHidden: true,
          room: { select: { name: true, icon: true } },
          author: { select: { email: true, profile: { select: { displayName: true } } } },
        },
      },
      comment: {
        select: {
          id: true,
          body: true,
          identity: true,
          isHidden: true,
          post: { select: { id: true, title: true, room: { select: { name: true, icon: true } } } },
          author: { select: { email: true, profile: { select: { displayName: true } } } },
        },
      },
    },
  });

  return NextResponse.json(flags);
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();
  if (!id || !["REVIEWED", "DISMISSED"].includes(status)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const flag = await prisma.moderationFlag.update({
    where: { id },
    data: { status, reviewedAt: new Date() },
  });

  return NextResponse.json(flag);
}
