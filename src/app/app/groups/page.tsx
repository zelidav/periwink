"use client";

import { useState } from "react";
import Link from "next/link";

const c = {
  plum: "#6E5A7E",
  plumLight: "#B7A8C9",
  plumMist: "#E8E1F0",
  plumWhisper: "#F5F2F9",
  lavender: "#8C92FF",
  ivory: "#F7F3EE",
  card: "#FDFBF8",
  ink: "#2B2433",
  inkSoft: "#6B6575",
  inkMuted: "#9B94A3",
  border: "#DDD7CE",
  rose: "#C99AA5",
  sage: "#7CB07F",
};

function ApplyForm() {
  const offerings = [
    "Midlife Group — 6-Week Virtual Program (Thursdays 4:30–6 PM EST)",
    "Retreat (notify me when available)",
    "One-on-one with Dr. Tubero",
    "Other / not sure yet",
  ];

  const [form, setForm] = useState({ name: "", email: "", interest: "", message: "" });
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [focused, setFocused] = useState<string | null>(null);

  const inputStyle = (field: string) => ({
    width: "100%",
    padding: "12px 14px",
    border: `1px solid ${focused === field ? c.plum : c.border}`,
    borderRadius: 10,
    fontSize: 15,
    outline: "none",
    background: c.ivory,
    color: c.ink,
    fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
    transition: "border-color 0.15s",
    boxSizing: "border-box" as const,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/groups/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setState(res.ok ? "success" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%", background: "rgba(124,176,127,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, margin: "0 auto 20px",
        }}>
          ✓
        </div>
        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 300, color: c.ink, marginBottom: 12 }}>
          Application received.
        </h3>
        <p style={{ fontSize: 15, color: c.inkSoft, lineHeight: 1.7, maxWidth: 360, margin: "0 auto" }}>
          Dr. Tubero will be in touch within a few days. Check your email for a confirmation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label style={{ display: "block", fontSize: 13, color: c.inkSoft, marginBottom: 6 }}>
          Your name <span style={{ color: c.rose }}>*</span>
        </label>
        <input
          required
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          onFocus={() => setFocused("name")}
          onBlur={() => setFocused(null)}
          placeholder="How you'd like to be addressed"
          style={inputStyle("name")}
        />
      </div>

      <div>
        <label style={{ display: "block", fontSize: 13, color: c.inkSoft, marginBottom: 6 }}>
          Email <span style={{ color: c.rose }}>*</span>
        </label>
        <input
          required
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          onFocus={() => setFocused("email")}
          onBlur={() => setFocused(null)}
          placeholder="you@example.com"
          style={inputStyle("email")}
        />
      </div>

      <div>
        <label style={{ display: "block", fontSize: 13, color: c.inkSoft, marginBottom: 6 }}>
          I'm interested in <span style={{ color: c.rose }}>*</span>
        </label>
        <select
          required
          value={form.interest}
          onChange={e => setForm({ ...form, interest: e.target.value })}
          onFocus={() => setFocused("interest")}
          onBlur={() => setFocused(null)}
          style={{ ...inputStyle("interest"), appearance: "none" as const }}
        >
          <option value="">Select an offering...</option>
          {offerings.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      <div>
        <label style={{ display: "block", fontSize: 13, color: c.inkSoft, marginBottom: 6 }}>
          A little about yourself{" "}
          <span style={{ color: c.inkMuted, fontWeight: 300 }}>(optional)</span>
        </label>
        <textarea
          value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
          onFocus={() => setFocused("message")}
          onBlur={() => setFocused(null)}
          placeholder="What brings you here? What are you hoping for?"
          rows={4}
          style={{
            ...inputStyle("message"),
            resize: "vertical",
            minHeight: 96,
          }}
        />
      </div>

      {state === "error" && (
        <p style={{ fontSize: 13, color: c.rose }}>Something went wrong — please try again.</p>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        style={{
          padding: "14px",
          background: state === "loading" ? c.border : c.plum,
          color: state === "loading" ? c.inkMuted : "#fff",
          border: "none", borderRadius: 12, fontSize: 15,
          fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
          cursor: state === "loading" ? "not-allowed" : "pointer",
          marginTop: 4,
        }}
      >
        {state === "loading" ? "Sending…" : "Submit application"}
      </button>
    </form>
  );
}

export default function GroupsPage() {
  return (
    <div style={{ color: c.ink }}>

      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${c.plumWhisper}, ${c.ivory})`,
        borderRadius: 20,
        padding: "48px 36px",
        marginBottom: 40,
        textAlign: "center",
        border: `1px solid ${c.plumMist}`,
      }}>
        <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: c.plum, marginBottom: 16 }}>
          Optional offerings
        </p>
        <h1 style={{
          fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)",
          fontSize: "clamp(28px, 5vw, 40px)",
          fontWeight: 300,
          lineHeight: 1.2,
          color: c.ink,
          marginBottom: 16,
        }}>
          Go deeper —{" "}
          <em style={{ color: c.plum }}>with others who understand.</em>
        </h1>
        <p style={{ fontSize: 16, color: c.inkSoft, lineHeight: 1.75, maxWidth: 520, margin: "0 auto 20px" }}>
          For women who want structured support alongside the community — intimate groups, immersive retreats, and other offerings led by Dr. Adrian Tubero, Psy.D.
        </p>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(124,176,127,0.12)", border: "1px solid rgba(124,176,127,0.3)",
          borderRadius: 999, padding: "8px 16px", fontSize: 13, color: "#3d7a40",
        }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.sage, display: "inline-block" }} />
          The Periwink community is always free &amp; open — these offerings are entirely optional
        </div>
      </div>

      {/* Featured Group */}
      <div style={{
        background: c.card,
        border: `1px solid ${c.border}`,
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: 24,
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${c.plum}, #5A4668)`,
          padding: "28px 32px",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <span style={{
                fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.7)", display: "block", marginBottom: 8,
              }}>
                Now forming · Virtual
              </span>
              <h2 style={{
                fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)",
                fontSize: 26, fontWeight: 400, color: "#fff", margin: 0,
              }}>
                Midlife Group for Women
              </h2>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, margin: "6px 0 0" }}>
                Perimenopause &amp; Menopause · 6 weeks
              </p>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: 12, padding: "10px 16px", textAlign: "center",
              backdropFilter: "blur(8px)",
            }}>
              <div style={{ fontSize: 18, fontWeight: 500, color: "#fff" }}>$80–90</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>per session</div>
            </div>
          </div>
        </div>

        <div style={{ padding: "28px 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 24 }}>
            {[
              { icon: "📅", label: "Schedule", value: "Thursdays, 4:30–6 PM EST" },
              { icon: "🗓", label: "Duration", value: "6 weeks" },
              { icon: "💻", label: "Format", value: "Virtual (Zoom)" },
              { icon: "👥", label: "Size", value: "Small, intimate group" },
            ].map(item => (
              <div key={item.label} style={{
                background: c.ivory, borderRadius: 12, padding: "14px 16px",
                border: `1px solid ${c.border}`,
              }}>
                <div style={{ fontSize: 18, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ fontSize: 11, color: c.inkMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 14, color: c.ink, fontWeight: 400 }}>{item.value}</div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 15, color: c.inkSoft, lineHeight: 1.8, marginBottom: 16 }}>
            A small, closed group for women navigating perimenopause and menopause together. Facilitated by Dr. Tubero using AEDP and relational trauma-informed approaches — this is not just psychoeducation. It's real, experiential work with women who truly get it.
          </p>
          <p style={{ fontSize: 15, color: c.inkSoft, lineHeight: 1.8 }}>
            Sessions move gently but meaningfully — from symptom to self, from isolation to recognition. Many women find that something shifts in the first session simply from being in a room where nobody needs an explanation.
          </p>

          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            marginTop: 24, padding: "16px 20px",
            background: c.plumWhisper, borderRadius: 12,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: `linear-gradient(135deg, ${c.plumLight}, ${c.rose})`,
              flexShrink: 0,
            }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: c.ink }}>Dr. Adrian Tubero, Psy.D.</div>
              <div style={{ fontSize: 13, color: c.plum }}>Clinical Psychologist · AEDP · CSRT · 22 years experience</div>
            </div>
          </div>
        </div>
      </div>

      {/* Coming soon */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16,
        marginBottom: 40,
      }}>
        {[
          { icon: "🌿", title: "Retreats", desc: "Immersive in-person retreats. Dates and locations coming soon." },
          { icon: "💬", title: "Workshops", desc: "Focused single-session workshops on specific themes. More soon." },
          { icon: "🤝", title: "One-on-one", desc: "Individual sessions with Dr. Tubero in NYC or via video." },
        ].map(item => (
          <div key={item.title} style={{
            background: c.card, border: `1px solid ${c.border}`,
            borderRadius: 16, padding: "24px 20px",
          }}>
            <div style={{ fontSize: 24, marginBottom: 10 }}>{item.icon}</div>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 400, color: c.ink, marginBottom: 6 }}>
              {item.title}
            </h3>
            <p style={{ fontSize: 13, color: c.inkSoft, lineHeight: 1.6 }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Application form */}
      <div style={{
        background: c.card, border: `1px solid ${c.border}`,
        borderRadius: 20, padding: "36px 32px", marginBottom: 32,
      }}>
        <h2 style={{
          fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)",
          fontSize: 26, fontWeight: 300, color: c.ink, marginBottom: 8,
        }}>
          Apply for an upcoming session
        </h2>
        <p style={{ fontSize: 15, color: c.inkSoft, lineHeight: 1.7, marginBottom: 28 }}>
          Tell us a little about yourself and which offering interests you. Dr. Tubero will follow up personally.
        </p>
        <ApplyForm />
      </div>

      {/* Community reassurance */}
      <div style={{
        background: `linear-gradient(135deg, ${c.plumWhisper}, ${c.ivory})`,
        border: `1px solid ${c.plumMist}`,
        borderRadius: 20, padding: "32px",
        display: "flex", gap: 20, alignItems: "flex-start",
      }}>
        <div style={{ fontSize: 28, flexShrink: 0, marginTop: 2 }}>💜</div>
        <div>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 400, color: c.ink, marginBottom: 8 }}>
            You don't need a group to belong here.
          </h3>
          <p style={{ fontSize: 15, color: c.inkSoft, lineHeight: 1.75, marginBottom: 16 }}>
            The Periwink community — the rooms, the conversations, the shared experiences — is entirely free and always open. Groups, retreats, and one-on-one work are optional deepening paths, not prerequisites. Come as you are.
          </p>
          <Link
            href="/auth/signup"
            style={{
              display: "inline-block",
              background: c.plum, color: "#fff",
              textDecoration: "none", borderRadius: 10,
              padding: "11px 22px", fontSize: 14,
            }}
          >
            Join the community — free, always →
          </Link>
        </div>
      </div>

    </div>
  );
}
