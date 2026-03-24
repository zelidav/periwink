"use client";

import { useState } from "react";
import { colors as C, fonts } from "@/lib/design";

// ─── Types ───
type Room = {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string | null;
  _count: { followers: number; posts: number };
};

type Post = {
  id: string;
  title: string;
  body: string;
  identity: string;
  isPinned: boolean;
  createdAt: string;
  reactionCount: number;
  commentCount: number;
  author: { profile: { displayName: string | null } | null };
  room: { name: string; slug: string; icon: string | null };
};

// ─── Shared Components ───

function Avi({ name, size = 34 }: { name: string; size?: number }) {
  const isAnon = name === "Anonymous";
  const hues = [
    `linear-gradient(135deg, ${C.mutedRose}, ${C.lavender})`,
    `linear-gradient(135deg, ${C.softPeriwinkle}, ${C.lavender})`,
    `linear-gradient(135deg, ${C.lavender}, ${C.dustyPlum})`,
    `linear-gradient(135deg, ${C.softGlow}, ${C.periwinkle})`,
    `linear-gradient(135deg, ${C.mutedRose}, ${C.softGlow})`,
  ];
  const h = name.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        background: isAnon ? C.ivory3 : hues[h % hues.length],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.38,
        fontWeight: 500,
        color: isAnon ? C.text3 : "rgba(255,255,255,0.9)",
      }}
    >
      {isAnon ? "?" : name[0]?.toUpperCase()}
    </div>
  );
}

function Reactions({
  reactions,
  small,
}: {
  reactions: Record<string, number>;
  small?: boolean;
}) {
  const icons: Record<string, string> = {
    heart: "♥",
    hug: "🤗",
    same: "✦",
    helpful: "✧",
  };
  return (
    <div style={{ display: "flex", gap: small ? 6 : 8, flexWrap: "wrap" }}>
      {Object.entries(reactions)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => (
          <button
            key={k}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "transparent",
              border: `1px solid ${C.borderWarm}`,
              borderRadius: 20,
              padding: small ? "3px 10px" : "5px 14px",
              fontSize: small ? 11 : 12,
              color: C.text2,
              cursor: "pointer",
              transition: "all 0.25s ease",
              fontFamily: fonts.body,
            }}
          >
            <span style={{ fontSize: small ? 11 : 13, opacity: 0.8 }}>
              {icons[k] || "•"}
            </span>
            <span>{v}</span>
          </button>
        ))}
    </div>
  );
}

function SevDots({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const labels = ["", "Mild", "Light", "Moderate", "Strong", "Severe"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const active = value >= n;
        const warmth =
          n <= 2 ? C.lavender : n <= 4 ? C.mutedRose : C.dustyPlum;
        return (
          <button
            key={n}
            onClick={() => onChange(n === value ? 0 : n)}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: active ? "none" : `1.5px solid ${C.borderWarm}`,
              background: active ? warmth : "transparent",
              color: active ? "rgba(255,255,255,0.9)" : C.text3,
              fontSize: 11,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontFamily: fonts.body,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {n}
          </button>
        );
      })}
      {value > 0 && (
        <span
          style={{
            fontSize: 11,
            color: C.mutedRose,
            marginLeft: 4,
            fontStyle: "italic",
          }}
        >
          {labels[value]}
        </span>
      )}
    </div>
  );
}

// ─── Mock data for when DB is empty ───
const MOCK_ROOMS = [
  { id: "1", slug: "hot-flashes", name: "Hot Flashes & Night Sweats", description: "Share experiences and strategies for managing vasomotor symptoms", icon: "🔥", _count: { followers: 2847, posts: 234 } },
  { id: "2", slug: "sleep", name: "Sleep & Fatigue", description: "Finding rest when your body won't cooperate", icon: "🌙", _count: { followers: 3201, posts: 312 } },
  { id: "3", slug: "hrt", name: "HRT & Hormone Therapy", description: "Navigating hormone replacement options together", icon: "💊", _count: { followers: 4102, posts: 456 } },
  { id: "4", slug: "mood", name: "Mood & Mental Health", description: "Anxiety, brain fog, mood swings — you're not alone", icon: "🧠", _count: { followers: 2956, posts: 289 } },
  { id: "5", slug: "supplements", name: "Supplements & Nutrition", description: "What's working, what's not, and the science behind it", icon: "🌿", _count: { followers: 2103, posts: 178 } },
];

const MOCK_POSTS = [
  { id: "p1", title: "Finally found the right estradiol dose after 8 months", body: "I wanted to share my journey because I know how frustrating dose adjustments can be. Started at 0.5mg, went up to 1mg, then my doctor suggested splitting into twice daily...", identity: "PSEUDONYM", isPinned: false, createdAt: new Date(Date.now() - 3*3600000).toISOString(), reactionCount: 221, commentCount: 34, author: { profile: { displayName: "MoonlitSage" } }, room: { name: "HRT & Hormone Therapy", slug: "hrt", icon: "💊" } },
  { id: "p2", title: "3am wake-ups every single night — is this the new normal?", body: "I've tried everything. Magnesium, melatonin, sleep hygiene, cooling sheets. Still waking up at 3am drenched in sweat...", identity: "ANONYMOUS", isPinned: false, createdAt: new Date(Date.now() - 5*3600000).toISOString(), reactionCount: 258, commentCount: 56, author: { profile: null }, room: { name: "Sleep & Fatigue", slug: "sleep", icon: "🌙" } },
  { id: "p3", title: "The cooling towel trick that actually changed my life", body: "Get a cooling towel, wet it, keep it in the fridge. When a flash hits, drape it over the back of your neck...", identity: "PSEUDONYM", isPinned: true, createdAt: new Date(Date.now() - 12*3600000).toISOString(), reactionCount: 491, commentCount: 45, author: { profile: { displayName: "DesertRose" } }, room: { name: "Hot Flashes & Night Sweats", slug: "hot-flashes", icon: "🔥" } },
  { id: "p4", title: "Brain fog so bad I forgot my own phone number", body: "Please tell me I'm not the only one. I've been sharp my whole life — ran teams, managed budgets, could multitask like nobody's business...", identity: "PSEUDONYM", isPinned: false, createdAt: new Date(Date.now() - 7*3600000).toISOString(), reactionCount: 288, commentCount: 71, author: { profile: { displayName: "QuietStorm42" } }, room: { name: "Mood & Mental Health", slug: "mood", icon: "🧠" } },
];

const SYMPTOMS = [
  { key: "HOT_FLASHES", label: "Hot flashes", cat: "Vasomotor" },
  { key: "NIGHT_SWEATS", label: "Night sweats", cat: "Vasomotor" },
  { key: "INSOMNIA", label: "Insomnia", cat: "Sleep" },
  { key: "FATIGUE", label: "Fatigue", cat: "Sleep" },
  { key: "ANXIETY", label: "Anxiety", cat: "Mood" },
  { key: "BRAIN_FOG", label: "Brain fog", cat: "Mood" },
  { key: "MOOD_SWINGS", label: "Mood swings", cat: "Mood" },
  { key: "JOINT_PAIN", label: "Joint pain", cat: "Physical" },
  { key: "HEADACHES", label: "Headaches", cat: "Physical" },
];

// ─── Views ───

function HomeView({
  rooms,
  posts,
  onRoomClick,
  onPostClick,
}: {
  rooms: Room[];
  posts: Post[];
  onRoomClick: (r: Room) => void;
  onPostClick: (p: Post) => void;
}) {
  const displayRooms = rooms.length > 0 ? rooms : MOCK_ROOMS;
  const displayPosts = posts.length > 0 ? posts : MOCK_POSTS;
  const sorted = [...displayPosts].sort(
    (a, b) => b.reactionCount - a.reactionCount
  );

  return (
    <div className="animate-fade-up">
      <div style={{ marginBottom: 44 }}>
        <h1
          style={{
            fontSize: 30,
            fontWeight: 400,
            color: C.ink,
            margin: "0 0 8px",
            fontFamily: fonts.heading,
            letterSpacing: -0.3,
          }}
        >
          Welcome back
        </h1>
        <p style={{ fontSize: 15, color: C.text2, margin: 0, lineHeight: 1.6 }}>
          You&apos;re not alone in this. Here&apos;s what the community is sharing.
        </p>
      </div>

      <section style={{ marginBottom: 40 }}>
        <h2
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: C.text2,
            margin: "0 0 14px",
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          Rooms
        </h2>
        <div
          style={{
            display: "flex",
            gap: 10,
            overflowX: "auto",
            paddingBottom: 4,
          }}
        >
          {(displayRooms as Room[]).map((r) => (
            <button
              key={r.id}
              onClick={() => onRoomClick(r)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: C.card,
                border: `1px solid ${C.borderWarm}`,
                borderRadius: 16,
                padding: "14px 18px",
                cursor: "pointer",
                transition: "all 0.25s ease",
                whiteSpace: "nowrap",
                fontFamily: fonts.body,
                minWidth: 200,
              }}
            >
              <span style={{ fontSize: 18 }}>{r.icon}</span>
              <div style={{ textAlign: "left" }}>
                <div
                  style={{ fontSize: 13, fontWeight: 500, color: C.ink }}
                >
                  {r.name}
                </div>
                <div
                  style={{ fontSize: 11, color: C.text3, marginTop: 2 }}
                >
                  {r._count.followers.toLocaleString()} members
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: C.text2,
            margin: "0 0 16px",
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          Trending
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {sorted.slice(0, 5).map((p) => {
            const authorName =
              p.identity === "ANONYMOUS"
                ? "Anonymous"
                : p.author?.profile?.displayName || "Member";
            const timeAgo = getTimeAgo(p.createdAt);
            return (
              <div
                key={p.id}
                onClick={() => onPostClick(p)}
                style={{
                  background: C.card,
                  border: `1px solid ${C.borderWarm}`,
                  borderRadius: 20,
                  padding: "24px 26px",
                  cursor: "pointer",
                  transition: "all 0.35s ease",
                }}
              >
                {p.isPinned && (
                  <div
                    style={{
                      fontSize: 10,
                      color: C.mutedRose,
                      fontWeight: 600,
                      marginBottom: 8,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    Pinned
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 14,
                  }}
                >
                  <Avi name={authorName} size={30} />
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: C.ink,
                      opacity: 0.85,
                    }}
                  >
                    {p.identity === "ANONYMOUS"
                      ? "Anonymous member"
                      : authorName}
                  </span>
                  <span style={{ fontSize: 11, color: C.text3 }}>
                    {timeAgo}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: C.lavender,
                      marginLeft: "auto",
                    }}
                  >
                    {p.room.icon} {p.room.name}
                  </span>
                </div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: C.ink,
                    margin: "0 0 8px",
                    lineHeight: 1.45,
                    fontFamily: fonts.heading,
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    fontSize: 13.5,
                    color: C.text2,
                    lineHeight: 1.65,
                    margin: "0 0 18px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as const,
                    overflow: "hidden",
                  }}
                >
                  {p.body}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Reactions
                    reactions={{ heart: Math.floor(p.reactionCount * 0.3), same: Math.floor(p.reactionCount * 0.4), helpful: Math.floor(p.reactionCount * 0.3) }}
                    small
                  />
                  <span style={{ fontSize: 11, color: C.text3 }}>
                    {p.commentCount} replies
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function TrackerView() {
  const [logs, setLogs] = useState<Record<string, number>>({});
  const [expanded, setExpanded] = useState<string | null>("Vasomotor");
  const cats = [...new Set(SYMPTOMS.map((s) => s.cat))];
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const logged = Object.values(logs).filter((v) => v > 0).length;

  return (
    <div className="animate-fade-up">
      <div style={{ marginBottom: 36 }}>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 400,
            color: C.ink,
            margin: "0 0 6px",
            fontFamily: fonts.heading,
          }}
        >
          How are you feeling today?
        </h1>
        <p style={{ fontSize: 14, color: C.text2, margin: 0 }}>{today}</p>
      </div>

      {logged > 0 && (
        <div
          style={{
            background: `${C.softGlow}15`,
            borderRadius: 14,
            padding: "12px 18px",
            marginBottom: 20,
            fontSize: 12,
            color: C.dustyPlum,
          }}
        >
          {logged} symptom{logged > 1 ? "s" : ""} logged today
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginBottom: 28,
        }}
      >
        {cats.map((cat) => {
          const syms = SYMPTOMS.filter((s) => s.cat === cat);
          const open = expanded === cat;
          return (
            <div
              key={cat}
              style={{
                background: C.card,
                border: `1px solid ${C.borderWarm}`,
                borderRadius: 18,
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => setExpanded(open ? null : cat)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 22px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: fonts.body,
                }}
              >
                <span
                  style={{ fontSize: 14, fontWeight: 500, color: C.ink }}
                >
                  {cat}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: C.text3,
                    transition: "transform 0.25s",
                    transform: open ? "rotate(180deg)" : "none",
                    display: "inline-block",
                  }}
                >
                  ▾
                </span>
              </button>
              {open && (
                <div style={{ padding: "0 22px 18px" }}>
                  {syms.map((s, i) => (
                    <div
                      key={s.key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "11px 0",
                        borderTop:
                          i > 0
                            ? `1px solid ${C.borderWarm}22`
                            : "none",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 14,
                          color: C.ink,
                          opacity: 0.85,
                        }}
                      >
                        {s.label}
                      </span>
                      <SevDots
                        value={logs[s.key] || 0}
                        onChange={(v) =>
                          setLogs((p) => ({ ...p, [s.key]: v }))
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        style={{
          width: "100%",
          padding: "15px",
          background: C.dustyPlum,
          color: "rgba(255,255,255,0.95)",
          border: "none",
          borderRadius: 20,
          fontSize: 15,
          fontWeight: 500,
          cursor: "pointer",
          fontFamily: fonts.body,
        }}
      >
        Save today&apos;s log
      </button>
    </div>
  );
}

function InsightsView() {
  const data = {
    symptoms: [
      { name: "Hot flashes", pct: 78, n: 4231 },
      { name: "Sleep disruption", pct: 72, n: 3901 },
      { name: "Brain fog", pct: 68, n: 3684 },
      { name: "Anxiety", pct: 61, n: 3305 },
      { name: "Fatigue", pct: 58, n: 3142 },
    ],
  };

  return (
    <div className="animate-fade-up">
      <div style={{ marginBottom: 36 }}>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 400,
            color: C.ink,
            margin: "0 0 6px",
            fontFamily: fonts.heading,
          }}
        >
          Community insights
        </h1>
        <p style={{ fontSize: 14, color: C.text2, margin: 0 }}>
          Anonymized patterns from contributing members
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {data.symptoms.map((s, i) => (
          <div
            key={i}
            style={{
              background: C.card,
              border: `1px solid ${C.borderWarm}`,
              borderRadius: 14,
              padding: "16px 18px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span
                style={{ fontSize: 14, fontWeight: 500, color: C.ink }}
              >
                {s.name}
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: C.dustyPlum,
                  fontWeight: 500,
                }}
              >
                {s.pct}%
              </span>
            </div>
            <div
              style={{
                height: 5,
                background: C.ivory3,
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${s.pct}%`,
                  height: "100%",
                  borderRadius: 3,
                  background: `linear-gradient(90deg, ${C.lavender}, ${C.mutedRose})`,
                }}
              />
            </div>
            <span
              style={{
                fontSize: 11,
                color: C.text3,
                marginTop: 6,
                display: "inline-block",
              }}
            >
              {s.n.toLocaleString()} members
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Helpers ───
function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

// ─── Main Shell ───
export function AppShell({
  initialRooms,
  initialPosts,
}: {
  initialRooms: Room[];
  initialPosts: Post[];
}) {
  const [view, setView] = useState("home");
  const [, setSelectedRoom] = useState<Room | null>(null);
  const [, setSelectedPost] = useState<Post | null>(null);

  const go = (v: string) => setView(v);

  return (
    <>
      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: `${C.warmIvory}EE`,
          backdropFilter: "blur(14px)",
          borderBottom: `1px solid ${C.borderWarm}33`,
        }}
      >
        <div
          style={{
            maxWidth: 780,
            margin: "0 auto",
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={() => go("home")}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <span
              style={{
                fontSize: 22,
                fontWeight: 400,
                color: C.dustyPlum,
                fontFamily: fonts.heading,
                letterSpacing: 0.3,
              }}
            >
              periwink
            </span>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              style={{
                background: "transparent",
                border: `1px solid ${C.borderWarm}`,
                borderRadius: 16,
                padding: "5px 14px",
                fontSize: 12,
                color: C.text2,
                cursor: "pointer",
                fontWeight: 500,
                fontFamily: fonts.body,
              }}
            >
              Sign in
            </button>
            <button
              style={{
                background: C.dustyPlum,
                border: "none",
                borderRadius: 16,
                padding: "5px 14px",
                fontSize: 12,
                color: "rgba(255,255,255,0.92)",
                cursor: "pointer",
                fontWeight: 500,
                fontFamily: fonts.body,
              }}
            >
              Join
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main
        style={{
          maxWidth: 780,
          margin: "0 auto",
          padding: "36px 24px 130px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {view === "home" && (
          <HomeView
            rooms={initialRooms}
            posts={initialPosts}
            onRoomClick={(r) => {
              setSelectedRoom(r);
              go("room");
            }}
            onPostClick={(p) => {
              setSelectedPost(p);
              go("post");
            }}
          />
        )}
        {view === "tracker" && <TrackerView />}
        {view === "insights" && <InsightsView />}
        {view === "room" && (
          <div className="animate-fade-up">
            <button
              onClick={() => go("home")}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: C.text3,
                fontSize: 13,
                fontFamily: fonts.body,
                marginBottom: 24,
              }}
            >
              ← Home
            </button>
            <p style={{ color: C.text2 }}>
              Room view — connect database to populate
            </p>
          </div>
        )}
        {view === "post" && (
          <div className="animate-fade-up">
            <button
              onClick={() => go("home")}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: C.text3,
                fontSize: 13,
                fontFamily: fonts.body,
                marginBottom: 24,
              }}
            >
              ← Back
            </button>
            <p style={{ color: C.text2 }}>
              Post view — connect database to populate
            </p>
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          background: `${C.warmIvory}EE`,
          backdropFilter: "blur(14px)",
          borderTop: `1px solid ${C.borderWarm}33`,
        }}
      >
        <div
          style={{
            maxWidth: 480,
            margin: "0 auto",
            padding: "4px 8px 8px",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          {[
            { icon: "🏠", label: "Home", key: "home" },
            { icon: "💬", label: "Rooms", key: "room" },
            { icon: "📝", label: "Track", key: "tracker" },
            { icon: "📊", label: "Insights", key: "insights" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => go(item.key)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "8px 14px",
                color: view === item.key ? C.dustyPlum : C.text3,
                fontFamily: fonts.body,
                fontSize: 10,
                fontWeight: view === item.key ? 600 : 400,
              }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
