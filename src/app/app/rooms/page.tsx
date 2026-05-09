export const dynamic = "force-dynamic";

import Link from "next/link";
import { getRooms } from "@/lib/queries";

export default async function RoomsPage() {
  const rooms = await getRooms();

  return (
    <>
      <section style={{ marginBottom: 32 }}>
        <h1 style={{
          fontFamily: "var(--font-heading)", fontSize: 30, fontWeight: 300,
          color: "var(--color-ink)", marginBottom: 8,
        }}>
          Community Conversations
        </h1>
        <p style={{ fontSize: 15, color: "var(--color-text-2)", lineHeight: 1.7 }}>
          A space for every part of the midlife experience. Find the conversations that feel like yours.
        </p>
      </section>

      <div style={{ display: "grid", gap: 14 }}>
        {rooms.map((room) => {
          const isBecoming = room.slug === "becoming";
          return (
            <Link
              key={room.id}
              href={`/app/rooms/${room.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div style={{
                background: isBecoming
                  ? "linear-gradient(135deg, rgba(240,236,255,.5), rgba(255,250,248,.9))"
                  : "var(--color-card)",
                border: isBecoming
                  ? "1px solid rgba(140,146,255,.3)"
                  : "1px solid var(--color-border-warm)",
                borderRadius: 18, padding: "22px 24px",
                display: "flex", alignItems: "flex-start", gap: 16,
                transition: "transform 0.15s, box-shadow 0.15s",
              }}>
                <span style={{ fontSize: 28, flexShrink: 0, lineHeight: 1 }}>{room.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    fontFamily: "var(--font-heading)", fontSize: 19, fontWeight: 400,
                    color: isBecoming ? "#4A3866" : "var(--color-ink)", marginBottom: 4,
                  }}>
                    {room.name}
                  </h3>
                  <p style={{ fontSize: 13, color: "var(--color-text-3)", lineHeight: 1.6, marginBottom: 10 }}>
                    {room.description}
                  </p>
                  <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--color-text-3)" }}>
                    <span>{room._count.posts} posts</span>
                    <span>{room._count.followers} members</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
