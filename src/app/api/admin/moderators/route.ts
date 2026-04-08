import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const moderators = await prisma.roomModerator.findMany({
      include: {
        user: { include: { profile: true } },
        room: true,
      },
    });
    return NextResponse.json(moderators);
  } catch (error) {
    console.error("Error fetching moderators:", error);
    return NextResponse.json({ error: "Failed to fetch moderators" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, roomId, role } = await request.json();

    if (!userId || !roomId || !role) {
      return NextResponse.json(
        { error: "userId, roomId, and role are required" },
        { status: 400 }
      );
    }

    const moderator = await prisma.roomModerator.create({
      data: { userId, roomId, role },
      include: {
        user: { include: { profile: true } },
        room: true,
      },
    });

    return NextResponse.json(moderator, { status: 201 });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "This user is already a moderator in this room" },
        { status: 409 }
      );
    }
    console.error("Error creating moderator:", error);
    return NextResponse.json({ error: "Failed to create moderator" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await prisma.roomModerator.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting moderator:", error);
    return NextResponse.json({ error: "Failed to delete moderator" }, { status: 500 });
  }
}
