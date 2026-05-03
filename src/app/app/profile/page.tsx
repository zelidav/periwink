import Avatar from "@/components/Avatar";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const STAGE_LABELS: Record<string, string> = {
  EARLY_PERIMENOPAUSE: "Early perimenopause",
  LATE_PERIMENOPAUSE: "Late perimenopause",
  MENOPAUSE: "Menopause",
  POSTMENOPAUSE: "Postmenopause",
  UNSURE: "Still figuring it out",
  PREFER_NOT_TO_SAY: "Prefer not to say",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const [profile, postCount, symptomCount, followedRooms] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: session.user.id } }),
    prisma.post.count({ where: { authorId: session.user.id, deletedAt: null } }),
    prisma.symptomLog.count({ where: { userId: session.user.id } }),
    prisma.roomFollow.findMany({
      where: { userId: session.user.id },
      include: { room: { select: { name: true, icon: true, slug: true } } },
      take: 8,
    }),
  ]);

  const displayName = profile?.displayName || session.user.name || session.user.email || "Member";
  const stage = profile?.menopauseStage ? STAGE_LABELS[profile.menopauseStage] : null;

  return (
    <>
      {/* Profile card */}
      <div style={{
        background: "var(--color-card, #FDFBF8)",
        border: "1px solid var(--color-border-warm, #DDD7CE)",
        borderRadius: 20, padding: "32px 28px", textAlign: "center",
        marginBottom: 24,
      }}>
        <Avatar name={displayName} size={72} style={{ margin: "0 auto 16px" }} />
        <h1 style={{
          fontFamily: "var(--font-heading)", fontSize: 24, fontWeight: 400,
          color: "var(--color-ink)", marginBottom: 4,
        }}>
          {displayName}
        </h1>
        {stage && (
          <p style={{
            fontSize: 13, color: "var(--color-dusty-plum, #6E5A7E)",
            marginBottom: 6,
          }}>
            {stage}
          </p>
        )}
        {profile?.bio && (
          <p style={{
            fontSize: 14, color: "var(--color-text-2, #6B6575)",
            lineHeight: 1.6, marginBottom: 16, maxWidth: 320, margin: "0 auto 16px",
          }}>
            {profile.bio}
          </p>
        )}
        {!profile?.bio && (
          <p style={{ fontSize: 14, color: "var(--color-text-3, #9B94A3)", marginBottom: 20 }}>
            Your story. Your pace. Your terms.
          </p>
        )}
      </div>

      {/* Stats row */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
        gap: 10, marginBottom: 24,
      }}>
        {[
          { num: postCount, label: postCount === 1 ? "post" : "posts" },
          { num: symptomCount, label: "check-ins" },
          { num: followedRooms.length, label: followedRooms.length === 1 ? "room" : "rooms" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "var(--color-card, #FDFBF8)",
              border: "1px solid var(--color-border-warm, #DDD7CE)",
              borderRadius: 14, padding: "16px 8px", textAlign: "center",
            }}
          >
            <div style={{
              fontFamily: "var(--font-heading)", fontSize: 26, fontWeight: 300,
              color: "var(--color-dusty-plum, #6E5A7E)", lineHeight: 1,
            }}>
              {stat.num}
            </div>
            <div style={{ fontSize: 12, color: "var(--color-text-3, #9B94A3)", marginTop: 4 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Followed rooms */}
      {followedRooms.length > 0 && (
        <div style={{
          background: "var(--color-card, #FDFBF8)",
          border: "1px solid var(--color-border-warm, #DDD7CE)",
          borderRadius: 14, padding: "20px 24px", marginBottom: 14,
        }}>
          <h2 style={{
            fontFamily: "var(--font-heading)", fontSize: 17, fontWeight: 400,
            color: "var(--color-ink)", marginBottom: 14,
          }}>
            Your Rooms
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {followedRooms.map(({ room }) => (
              <Link
                key={room.slug}
                href={`/app/rooms/${room.slug}`}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 4px", textDecoration: "none",
                  borderBottom: "1px solid var(--color-border-warm, #DDD7CE)",
                }}
              >
                <span style={{ fontSize: 18 }}>{room.icon}</span>
                <span style={{ fontSize: 14, color: "var(--color-text-2, #6B6575)" }}>
                  {room.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Symptom history teaser */}
      {symptomCount === 0 ? (
        <div style={{
          background: "var(--color-card, #FDFBF8)",
          border: "1px solid var(--color-border-warm, #DDD7CE)",
          borderRadius: 14, padding: "20px 24px", marginBottom: 14,
        }}>
          <h2 style={{
            fontFamily: "var(--font-heading)", fontSize: 17, fontWeight: 400,
            color: "var(--color-ink)", marginBottom: 8,
          }}>
            Symptom History
          </h2>
          <p style={{ fontSize: 13, color: "var(--color-text-3, #9B94A3)", lineHeight: 1.65, marginBottom: 14 }}>
            Your check-in history builds a picture over time — patterns only you can see.
          </p>
          <Link
            href="/app/checkin"
            style={{
              display: "inline-block", fontSize: 13,
              color: "var(--color-dusty-plum, #6E5A7E)", textDecoration: "none",
            }}
          >
            Start your first check-in →
          </Link>
        </div>
      ) : (
        <div style={{
          background: "var(--color-card, #FDFBF8)",
          border: "1px solid var(--color-border-warm, #DDD7CE)",
          borderRadius: 14, padding: "20px 24px", marginBottom: 14,
        }}>
          <h2 style={{
            fontFamily: "var(--font-heading)", fontSize: 17, fontWeight: 400,
            color: "var(--color-ink)", marginBottom: 8,
          }}>
            Symptom History
          </h2>
          <p style={{ fontSize: 13, color: "var(--color-text-2, #6B6575)", lineHeight: 1.65 }}>
            {symptomCount} check-in{symptomCount === 1 ? "" : "s"} logged.
          </p>
          <Link
            href="/app/checkin"
            style={{
              display: "inline-block", fontSize: 13, marginTop: 10,
              color: "var(--color-dusty-plum, #6E5A7E)", textDecoration: "none",
            }}
          >
            Check in today →
          </Link>
        </div>
      )}

      {/* Sign out */}
      <div style={{ textAlign: "center", marginTop: 24, paddingBottom: 8 }}>
        <Link
          href="/auth/signin"
          style={{ fontSize: 13, color: "var(--color-text-3, #9B94A3)", textDecoration: "none" }}
        >
          Account settings
        </Link>
      </div>
    </>
  );
}
