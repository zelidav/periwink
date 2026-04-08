import Avatar from "@/components/Avatar";
import { ReactionBar } from "@/components/ReactionBar";
import { timeAgo } from "@/lib/demo-helpers";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    body: string;
    identity: string;
    createdAt: Date;
    isPinned: boolean;
    author: { id: string | null; profile: { displayName: string | null; avatarStyle: string | null } | null };
    room?: { name: string; slug: string; icon: string | null } | null;
    _count: { comments: number; reactions: number };
  };
  showRoom?: boolean;
  expanded?: boolean;
  comments?: Array<{
    id: string;
    body: string;
    createdAt: Date;
    identity: string;
    author: { profile: { displayName: string | null; avatarStyle?: string | null } | null };
  }>;
}

export default function PostCard({ post, showRoom = false, expanded = false, comments }: PostCardProps) {
  const displayName = post.author.profile?.displayName || "Anonymous member";
  const isAnon = post.identity === "ANONYMOUS";
  const bodyPreview = expanded ? post.body : post.body.length > 280 ? post.body.slice(0, 280) + "..." : post.body;

  return (
    <article
      style={{
        background: "var(--color-card, #FDFBF8)",
        border: "1px solid var(--color-border-warm, #DDD7CE)",
        borderRadius: 16,
        padding: "24px",
        marginBottom: 12,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <Avatar name={isAnon ? "anonymous" : displayName} size={34} avatarStyle={isAnon ? null : post.author.profile?.avatarStyle} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 400, color: "var(--color-ink, #2B2433)" }}>
            {isAnon ? "Anonymous member" : displayName}
          </div>
          <div style={{ fontSize: 12, color: "var(--color-text-3, #9B94A3)", display: "flex", gap: 8 }}>
            <span>{timeAgo(new Date(post.createdAt))}</span>
            {showRoom && post.room && (
              <span>in {post.room.icon} {post.room.name}</span>
            )}
          </div>
        </div>
        {post.isPinned && (
          <span style={{
            fontSize: 11, padding: "3px 10px", borderRadius: 999,
            background: "var(--color-soft-mist, #E8E3EA)",
            color: "var(--color-dusty-plum, #6E5A7E)",
            fontWeight: 500, letterSpacing: 0.3,
          }}>
            Featured
          </span>
        )}
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)",
        fontSize: 20, fontWeight: 400, lineHeight: 1.3,
        marginBottom: 8, color: "var(--color-ink, #2B2433)",
      }}>
        {post.title}
      </h3>

      {/* Body */}
      <p style={{
        fontSize: 14, lineHeight: 1.75, color: "var(--color-text-2, #6B6575)",
        marginBottom: 16, whiteSpace: "pre-wrap",
      }}>
        {bodyPreview}
      </p>

      {/* Reactions + Comments */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingTop: 12, borderTop: "1px solid var(--color-border-warm, #DDD7CE)",
      }}>
        <ReactionBar count={post._count.reactions} />
        <span style={{ fontSize: 13, color: "var(--color-text-3, #9B94A3)" }}>
          {post._count.comments > 0 && `${post._count.comments} ${post._count.comments === 1 ? "reply" : "replies"}`}
        </span>
      </div>

      {/* Inline comments */}
      {expanded && comments && comments.length > 0 && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--color-border-warm, #DDD7CE)" }}>
          {comments.map((c) => {
            const cName = c.identity === "ANONYMOUS"
              ? "Anonymous member"
              : c.author?.profile?.displayName || "Member";
            return (
              <div key={c.id} style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                <Avatar name={c.identity === "ANONYMOUS" ? "anon" : cName} size={28} avatarStyle={c.identity === "ANONYMOUS" ? null : c.author?.profile?.avatarStyle} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "var(--color-ink, #2B2433)", fontWeight: 400 }}>
                    {cName}
                    <span style={{ color: "var(--color-text-3, #9B94A3)", fontWeight: 300, marginLeft: 8 }}>
                      {timeAgo(new Date(c.createdAt))}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: "var(--color-text-2, #6B6575)", marginTop: 3 }}>
                    {c.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
}
