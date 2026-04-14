import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      include: {
        author: { include: { profile: { select: { displayName: true } } } },
        room: { select: { name: true, slug: true } },
        _count: { select: { comments: true, reactions: true } },
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, isHidden, isPinned, isLocked, moderationNote } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const data: Record<string, unknown> = {};
    if (typeof isHidden === "boolean") data.isHidden = isHidden;
    if (typeof isPinned === "boolean") data.isPinned = isPinned;
    if (typeof isLocked === "boolean") data.isLocked = isLocked;
    if (typeof moderationNote === "string") data.moderationNote = moderationNote;

    const post = await prisma.post.update({ where: { id }, data });
    return NextResponse.json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    await prisma.post.update({ where: { id }, data: { deletedAt: new Date() } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
