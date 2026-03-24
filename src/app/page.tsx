import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/AppShell";

export default async function Home() {
  // Server-side data fetching for initial load
  let rooms: Array<{
    id: string;
    slug: string;
    name: string;
    description: string;
    icon: string | null;
    _count: { followers: number; posts: number };
  }> = [];

  let posts: Array<{
    id: string;
    title: string;
    body: string;
    identity: string;
    isPinned: boolean;
    createdAt: Date;
    reactionCount: number;
    commentCount: number;
    author: { profile: { displayName: string | null } | null };
    room: { name: string; slug: string; icon: string | null };
  }> = [];

  try {
    rooms = await prisma.room.findMany({
      where: { isArchived: false },
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { followers: true, posts: true } } },
    });

    posts = await prisma.post.findMany({
      where: { deletedAt: null, isHidden: false },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        author: { include: { profile: { select: { displayName: true } } } },
        room: { select: { name: true, slug: true, icon: true } },
      },
    });
  } catch {
    // DB not connected yet â render with empty data (seed page will show)
  }

  return (
    <AppShell
      initialRooms={JSON.parse(JSON.stringify(rooms))}
      initialPosts={JSON.parse(JSON.stringify(posts))}
    />
  );
}
