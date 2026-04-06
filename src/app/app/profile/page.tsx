import Avatar from "@/components/Avatar";
import { LockedButton } from "@/components/GrowingMessage";

export default function ProfilePage() {
  return (
    <>
      {/* Profile card */}
      <div style={{
        background: "var(--color-card)", border: "1px solid var(--color-border-warm)",
        borderRadius: 20, padding: "32px 28px", textAlign: "center",
        marginBottom: 28,
      }}>
        <Avatar name="You" size={72} style={{ margin: "0 auto 16px" }} />
        <h1 style={{
          fontFamily: "var(--font-heading)", fontSize: 24, fontWeight: 400,
          color: "var(--color-ink)", marginBottom: 4,
        }}>
          Your Pseudonym
        </h1>
        <p style={{ fontSize: 14, color: "var(--color-text-3)", marginBottom: 20 }}>
          Your story. Your pace. Your terms.
        </p>
        <LockedButton
          action="edit your profile"
          style={{
            background: "var(--color-dusty-plum)", color: "#fff",
            border: "none", borderRadius: 999, padding: "10px 24px",
            fontSize: 14, cursor: "pointer",
            fontFamily: "var(--font-body)", fontWeight: 400,
          }}
        >
          Edit Profile
        </LockedButton>
      </div>

      {/* Empty state sections */}
      {[
        { title: "Your Rooms", empty: "The rooms you follow will appear here — your corners of this community." },
        { title: "Your Posts", empty: "When you share your story, it will live here. Every voice matters." },
        { title: "Symptom History", empty: "Your check-in history will build a picture over time — patterns only you can see." },
      ].map((section) => (
        <div
          key={section.title}
          style={{
            background: "var(--color-card)", border: "1px solid var(--color-border-warm)",
            borderRadius: 14, padding: "20px 24px", marginBottom: 12,
          }}
        >
          <h2 style={{
            fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 400,
            color: "var(--color-ink)", marginBottom: 8,
          }}>
            {section.title}
          </h2>
          <p style={{ fontSize: 13, color: "var(--color-text-3)", lineHeight: 1.65 }}>
            {section.empty}
          </p>
        </div>
      ))}
    </>
  );
}
