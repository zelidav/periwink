export const dynamic = "force-dynamic";

import Link from "next/link";
import { getRooms, getFeaturedPosts, getRecentPosts } from "@/lib/queries";
import PostCard from "@/components/PostCard";

export default async function AppHome() {
  const [rooms, featured, recent] = await Promise.all([
    getRooms(),
    getFeaturedPosts(4),
    getRecentPosts(8),
  ]);

  return (
    <>
      {/* Welcome */}
      <section style={{ marginBottom: 36 }}>
        <h1 style={{
          fontFamily: "var(--font-heading)", fontSize: 30, fontWeight: 300,
          color: "var(--color-ink)", lineHeight: 1.25, marginBottom: 8,
        }}>
          Welcome to Periwink
        </h1>
        <p style={{ fontSize: 15, color: "var(--color-text-2)", lineHeight: 1.7 }}>
          A space where women navigating change find each other, share what they're noticing, and feel held.
        </p>
      </section>

      {/* Check-in prompt */}
      <Link href="/app/checkin" style={{ textDecoration: "none" }}>
        <div style={{
          background: "linear-gradient(135deg, var(--color-soft-mist), rgba(215,204,255,0.15))",
          border: "1px solid var(--color-lavender)",
          borderRadius: 20, padding: "24px 28px", marginBottom: 36,
          transition: "transform 0.2s",
        }}>
          <p style={{
            fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 400,
            color: "var(--color-dusty-plum)", marginBottom: 6,
          }}>
            How are you feeling today?
          </p>
          <p style={{ fontSize: 14, color: "var(--color-text-2)" }}>
            Take a moment to notice. There are no wrong answers.
          </p>
        </div>
      </Link>

      {/* Room pills */}
      <section style={{ marginBottom: 36 }}>
        <h2 style={{
          fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 400,
          color: "var(--color-ink)", marginBottom: 14,
        }}>
          Circles
        </h2>
        <div style={{
          display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8,
          scrollbarWidth: "none",
        }}>
          {rooms.map((room) => (
            <Link
              key={room.id}
              href={`/app/rooms/${room.slug}`}
              style={{
                flexShrink: 0, display: "flex", alignItems: "center", gap: 8,
                padding: "10px 18px", borderRadius: 999,
                background: "var(--color-card)", border: "1px solid var(--color-border-warm)",
                textDecoration: "none", color: "var(--color-ink)",
                fontSize: 14, whiteSpace: "nowrap",
                transition: "border-color 0.2s",
              }}
            >
              <span>{room.icon}</span>
              <span>{room.name}</span>
              <span style={{ fontSize: 12, color: "var(--color-text-3)" }}>
                {room._count.posts}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured stories */}
      {featured.length > 0 && (
        <section style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
            <h2 style={{
              fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 400,
              color: "var(--color-ink)",
            }}>
              Featured stories
            </h2>
            <Link href="/app/stories" style={{
              fontSize: 13, color: "var(--color-dusty-plum)", textDecoration: "none",
            }}>
              See all
            </Link>
          </div>
          {featured.map((post) => (
            <PostCard key={post.id} post={post} showRoom />
          ))}
        </section>
      )}

      {/* Recent activity */}
      <section>
        <h2 style={{
          fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 400,
          color: "var(--color-ink)", marginBottom: 14,
        }}>
          Recent
        </h2>
        {recent.map((post) => (
          <PostCard key={post.id} post={post} showRoom />
        ))}
      </section>
    </>
  );
}
