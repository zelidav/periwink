import { NextRequest, NextResponse, after } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { postBotResponse } from "@/lib/bot";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("roomId");
    const sort = searchParams.get("sort") || "recent";
    const limit = parseInt(searchParams.get("limit") || "20");

    const orderBy =
      sort === "top"
        ? { reactionCount: "desc" as const }
        : { createdAt: "desc" as const };

    const posts = await prisma.post.findMany({
      where: {
        ...(roomId ? { roomId } : {}),
        deletedAt: null,
        isHidden: false,
      },
      orderBy,
      take: limit,
      include: {
        author: {
          include: { profile: { select: { displayName: true } } },
        },
        room: { select: { name: true, slug: true, icon: true } },
        _count: { select: { comments: true, reactions: true } },
      },
    });

    // Strip author info for anonymous posts
    const safePosts = posts.map((post) => ({
      ...post,
      author:
        post.identity === "ANONYMOUS"
          ? { id: null, profile: null }
          : {
              id: post.author.id,
              profile: post.author.profile,
            },
    }));

    return NextResponse.json(safePosts);
  } catch (error) {
    console.error("Posts fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load posts" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, body, roomId, identity } = await req.json();

    if (!title || !body || !roomId) {
      return NextResponse.json(
        { error: "Title, body, and room are required" },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title,
        body,
        roomId,
        authorId: session.user.id,
        identity: identity === "ANONYMOUS" ? "ANONYMOUS" : "PSEUDONYM",
      },
    });

    // Trigger bot response after reply is sent to user
    const room = await prisma.room.findUnique({ where: { id: roomId }, select: { slug: true } });
    if (room) {
      after(() => postBotResponse(post.id, room.slug, `${title}\n\n${body}`));
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Post creation error:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
