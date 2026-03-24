import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      where: { isArchived: false },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { followers: true, posts: true } },
      },
    });

    return NextResponse.json(rooms);
  } catch (error) {
    console.error("Rooms fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load rooms" },
      { status: 500 }
    );
  }
}
