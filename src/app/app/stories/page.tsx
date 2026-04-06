export const dynamic = "force-dynamic";

import { getFeaturedPosts } from "@/lib/queries";
import PostCard from "@/components/PostCard";

export default async function StoriesPage() {
  const stories = await getFeaturedPosts(12);

  return (
    <>
      <section style={{ marginBottom: 32 }}>
        <h1 style={{
          fontFamily: "var(--font-heading)", fontSize: 30, fontWeight: 300,
          color: "var(--color-ink)", marginBottom: 8,
        }}>
          Stories from women who understand
        </h1>
        <p style={{ fontSize: 15, color: "var(--color-text-2)", lineHeight: 1.7 }}>
          Honest reflections from the community. Each one is a reminder: you are not alone in this.
        </p>
      </section>

      {stories.map((post) => (
        <PostCard key={post.id} post={post} showRoom expanded />
      ))}

      {stories.length === 0 && (
        <div style={{
          textAlign: "center", padding: "48px 24px",
          color: "var(--color-text-3)", fontFamily: "var(--font-heading)", fontSize: 18,
        }}>
          Stories are being gathered. Every woman here carries one worth sharing.
        </div>
      )}
    </>
  );
}
