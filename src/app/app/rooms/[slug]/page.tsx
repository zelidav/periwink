export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { getRoomBySlug, getPostsForRoom, getCommentsForPosts } from "@/lib/queries";
import PostCard from "@/components/PostCard";
import { LockedButton } from "@/components/GrowingMessage";

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const room = await getRoomBySlug(slug);
  if (!room) notFound();

  const posts = await getPostsForRoom(room.id);
  const postIds = posts.map((p) => p.id);
  const allComments = postIds.length > 0 ? await getCommentsForPosts(postIds) : [];

  const commentsByPost = new Map<string, typeof allComments>();
  for (const c of allComments) {
    const list = commentsByPost.get(c.postId) || [];
    list.push(c);
    commentsByPost.set(c.postId, list);
  }

  return (
    <>
      {/* Room header */}
      <section style={{ marginBottom: 28 }}>
        <Link
          href="/app/rooms"
          style={{
            fontSize: 13, color: "var(--color-text-3)", textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 16,
          }}
        >
          ← All rooms
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
          <span style={{ fontSize: 36 }}>{room.icon}</span>
          <div>
            <h1 style={{
              fontFamily: "var(--font-heading)", fontSize: 28, fontWeight: 400,
              color: "var(--color-ink)", lineHeight: 1.2,
            }}>
              {room.name}
            </h1>
            <p style={{ fontSize: 13, color: "var(--color-text-3)" }}>
              {room._count.followers} members · {room._count.posts} posts
            </p>
          </div>
        </div>
        <p style={{ fontSize: 14, color: "var(--color-text-2)", lineHeight: 1.7, marginBottom: 16 }}>
          {room.description}
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <LockedButton
            action="share a post"
            style={{
              background: "var(--color-dusty-plum)", color: "#fff",
              border: "none", borderRadius: 999, padding: "10px 22px",
              fontSize: 14, cursor: "pointer",
              fontFamily: "var(--font-body)", fontWeight: 400,
            }}
          >
            New post
          </LockedButton>
          <LockedButton
            action="follow this room"
            style={{
              background: "none", color: "var(--color-dusty-plum)",
              border: "1px solid var(--color-lavender)", borderRadius: 999,
              padding: "10px 22px", fontSize: 14, cursor: "pointer",
              fontFamily: "var(--font-body)", fontWeight: 400,
            }}
          >
            Follow
          </LockedButton>
        </div>
      </section>

      {/* Posts */}
      {posts.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "48px 24px",
          color: "var(--color-text-3)", fontSize: 15,
        }}>
          <p style={{ fontFamily: "var(--font-heading)", fontSize: 20, marginBottom: 8 }}>
            This room is waiting for its first story.
          </p>
          <p>When we open, this will be a place for honest conversation.</p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            expanded
            comments={commentsByPost.get(post.id)}
          />
        ))
      )}
    </>
  );
}
