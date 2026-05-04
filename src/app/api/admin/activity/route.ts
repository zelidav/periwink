import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "60");

  const [posts, comments] = await Promise.all([
    prisma.post.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        body: true,
        identity: true,
        createdAt: true,
        isHidden: true,
        room: { select: { name: true, slug: true, icon: true } },
        author: {
          select: {
            id: true,
            email: true,
            isBot: true,
            profile: { select: { displayName: true } },
          },
        },
        _count: { select: { comments: true, reactions: true } },
      },
    }),
    prisma.comment.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        body: true,
        identity: true,
        createdAt: true,
        isHidden: true,
        post: { select: { id: true, title: true, room: { select: { name: true, icon: true } } } },
        author: {
          select: {
            id: true,
            email: true,
            isBot: true,
            profile: { select: { displayName: true } },
          },
        },
      },
    }),
  ]);

  const feed = [
    ...posts.map((p) => ({
      type: "post" as const,
      id: p.id,
      createdAt: p.createdAt.toISOString(),
      identity: p.identity,
      isHidden: p.isHidden,
      room: p.room,
      author: p.identity === "ANONYMOUS"
        ? { displayName: "Anonymous member", isBot: false }
        : { displayName: p.author.profile?.displayName || p.author.email, isBot: p.author.isBot },
      title: p.title,
      body: p.body,
      commentCount: p._count.comments,
      reactionCount: p._count.reactions,
    })),
    ...comments.map((c) => ({
      type: "comment" as const,
      id: c.id,
      createdAt: c.createdAt.toISOString(),
      identity: c.identity,
      isHidden: c.isHidden,
      room: c.post?.room || null,
      author: c.identity === "ANONYMOUS"
        ? { displayName: "Anonymous member", isBot: false }
        : { displayName: c.author.profile?.displayName || c.author.email, isBot: c.author.isBot },
      postId: c.post?.id,
      postTitle: c.post?.title,
      body: c.body,
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json(feed);
}
