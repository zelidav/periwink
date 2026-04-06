import { prisma } from "@/lib/prisma";

const postInclude = {
  author: {
    include: { profile: { select: { displayName: true, avatarStyle: true } } },
  },
  room: { select: { name: true, slug: true, icon: true } },
  _count: { select: { comments: true, reactions: true } },
} as const;

function safePost(post: any) {
  if (post.identity === "ANONYMOUS") {
    return {
      ...post,
      author: { id: null, profile: { displayName: "Anonymous member", avatarStyle: null } },
    };
  }
  return post;
}

export async function getRooms() {
  return prisma.room.findMany({
    where: { isArchived: false },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { followers: true, posts: true } } },
  });
}

export async function getRoomBySlug(slug: string) {
  return prisma.room.findUnique({
    where: { slug },
    include: { _count: { select: { followers: true, posts: true } } },
  });
}

export async function getPostsForRoom(roomId: string, limit = 30) {
  const posts = await prisma.post.findMany({
    where: { roomId, deletedAt: null, isHidden: false },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    take: limit,
    include: postInclude,
  });
  return posts.map(safePost);
}

export async function getFeaturedPosts(limit = 8) {
  const posts = await prisma.post.findMany({
    where: { deletedAt: null, isHidden: false, isPinned: true },
    orderBy: { reactionCount: "desc" },
    take: limit,
    include: postInclude,
  });
  return posts.map(safePost);
}

export async function getRecentPosts(limit = 15) {
  const posts = await prisma.post.findMany({
    where: { deletedAt: null, isHidden: false },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: postInclude,
  });
  return posts.map(safePost);
}

export async function getCommentsForPosts(postIds: string[]) {
  return prisma.comment.findMany({
    where: {
      postId: { in: postIds },
      deletedAt: null,
      isHidden: false,
    },
    orderBy: { createdAt: "asc" },
    include: {
      author: {
        include: { profile: { select: { displayName: true } } },
      },
    },
  });
}

export async function getReactionsForPosts(postIds: string[]) {
  return prisma.reaction.findMany({
    where: { postId: { in: postIds } },
    select: { postId: true, type: true },
  });
}
