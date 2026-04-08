import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { posts: true, followers: true },
        },
      },
    });
    return NextResponse.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, slug, description, icon, isDefault, sortOrder } = await request.json();

    if (!name || !slug || !description) {
      return NextResponse.json(
        { error: "name, slug, and description are required" },
        { status: 400 }
      );
    }

    const room = await prisma.room.create({
      data: {
        name,
        slug,
        description,
        icon: icon || null,
        isDefault: isDefault || false,
        sortOrder: sortOrder || 0,
      },
      include: {
        _count: {
          select: { posts: true, followers: true },
        },
      },
    });

    return NextResponse.json(room, { status: 201 });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A room with this slug already exists" },
        { status: 409 }
      );
    }
    console.error("Error creating room:", error);
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }
}
