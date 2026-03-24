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

// ─── SVG Line Art (Picasso-inspired botanical) ───

function BotanicalArt({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", ...style }}>
      {/* Flowing stem */}
      <path d="M200 480 C200 400, 180 350, 160 300 C140 250, 170 200, 190 150 C210 100, 200 60, 210 20" stroke={C.lavender} strokeWidth="1.5" fill="none" opacity="0.6" />
      {/* Leaf 1 - large, veined */}
      <path d="M160 300 C120 270, 80 260, 60 230 C40 200, 60 180, 100 190 C140 200, 155 250, 160 300Z" stroke={C.dustyPlum} strokeWidth="1" fill="none" opacity="0.35" />
      <path d="M160 300 C130 275, 90 260, 70 240" stroke={C.dustyPlum} strokeWidth="0.5" fill="none" opacity="0.2" />
      <path d="M140 280 C120 265, 95 258, 80 248" stroke={C.dustyPlum} strokeWidth="0.5" fill="none" opacity="0.15" />
      <path d="M125 265 C110 255, 90 250, 78 242" stroke={C.dustyPlum} strokeWidth="0.4" fill="none" opacity="0.12" />
      {/* Leaf 2 - right side */}
      <path d="M190 200 C230 180, 280 190, 310 170 C340 150, 330 130, 290 135 C250 140, 210 170, 190 200Z" stroke={C.mutedRose} strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M190 200 C230 185, 275 185, 300 175" stroke={C.mutedRose} strokeWidth="0.5" fill="none" opacity="0.2" />
      <path d="M210 190 C240 180, 270 180, 295 172" stroke={C.mutedRose} strokeWidth="0.4" fill="none" opacity="0.15" />
      {/* Leaf 3 - small, delicate */}
      <path d="M190 150 C160 120, 130 110, 120 80 C110 50, 130 50, 150 70 C170 90, 185 120, 190 150Z" stroke={C.periwinkle} strokeWidth="0.8" fill="none" opacity="0.25" />
      {/* Flower bud */}
      <circle cx="210" cy="20" r="12" stroke={C.softPeriwinkle} strokeWidth="0.8" fill="none" opacity="0.3" />
      <circle cx="210" cy="20" r="6" stroke={C.mutedRose} strokeWidth="0.5" fill="none" opacity="0.2" />
      {/* Scattered dots like pollen */}
      {[
        [95, 210], [280, 160], [150, 90], [230, 50], [170, 350],
        [120, 150], [260, 200], [200, 100], [140, 180], [300, 140],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.5} fill={C.lavender} opacity={0.15 + (i % 3) * 0.08} />
      ))}
    </svg>
  );
}

function WaveDivider() {
  return (
    <svg viewBox="0 0 800 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: 40, display: "block" }}>
      <path d="M0 30 C200 10, 300 50, 400 30 C500 10, 600 50, 800 30" stroke={C.lavender} strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M0 35 C150 55, 350 15, 500 35 C650 55, 750 20, 800 35" stroke={C.mutedRose} strokeWidth="0.7" fill="none" opacity="0.2" />
    </svg>
  );
}

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
    <div style={{ width: size, height: size, borderRadius: "50%", flexShrink: 0, background: isAnon ? C.ivory3 : hues[h % hues.length], display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.38, fontWeight: 500, color: isAnon ? C.text3 : "rgba(255,255,255,0.9)" }}>
      {isAnon ? "?" : name[0]?.toUpperCase()}
    </div>
  );
}

function Reactions({ reactions, small }: { reactions: Record<string, number>; small?: boolean }) {
  const icons: Record<string, string> = { heart: "♥", hug: "🤗", same: "☮", helpful: "✧" };
  return (
    <div style={{ display: "flex", gap: small ? 6 : 8, flexWrap: "wrap" }}>
      {Object.entries(reactions).filter(([, v]) => v > 0).map(([k, v]) => (
        <button key={k} style={{ display: "flex", alignItems: "center", gap: 4, background: "transparent", border: `1px solid ${C.borderWarm}`, borderRadius: 20, padding: small ? "3px 10px" : "5px 14px", fontSize: small ? 11 : 12, color: C.text2, cursor: "pointer", fontFamily: fonts.body }}>
          <span style={{ fontSize: small ? 11 : 13, opacity: 0.8 }}>{icons[k] || "•"}</span>
          <span>{v}</span>
        </button>
      ))}
    </div>
  );
}

function SevDots({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const labels = ["", "Mild", "Light", "Moderate", "Strong", "Severe"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const active = value >= n;
        const warmth = n <= 2 ? C.lavender : n <= 4 ? C.mutedRose : C.dustyPlum;
        return (
          <button key={n} onClick={() => onChange(n === value ? 0 : n)} style={{ width: 28, height: 28, borderRadius: "50%", border: active ? "none" : `1.5px solid ${C.borderWarm}`, background: active ? warmth : "transparent", color: active ? "rgba(255,255,255,0.9)" : C.text3, fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: fonts.body, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {n}
          </button>
        );
      })}
      {value > 0 && <span style={{ fontSize: 11, color: C.mutedRose, marginLeft: 4, fontStyle: "italic" }}>{labels[value]}</span>}
    </div>
  );
}

// ─── Mock data ───
const MOCK_ROOMS: Room[] = [
  { id: "1", slug: "hot-flashes", name: "Hot Flashes & Night Sweats", description: "Share experiences and strategies for managing vasomotor symptoms. What's working, what's not, and the science behind it.", icon: "🔥", _count: { followers: 2847, posts: 234 } },
  { id: "2", slug: "sleep", name: "Sleep & Fatigue", description: "Finding rest when your body won't cooperate. Strategies, supplements, and solidarity for the 3am wake-up club.", icon: "🌙", _count: { followers: 3201, posts: 312 } },
  { id: "3", slug: "hrt", name: "HRT & Hormone Therapy", description: "Navigating hormone replacement options together. Dosing, delivery methods, side effects, and switching stories.", icon: "💊", _count: { followers: 4102, posts: 456 } },
  { id: "4", slug: "mood", name: "Mood & Mental Health", description: "Anxiety, brain fog, mood swings — you're not alone. Coping strategies and professional resources.", icon: "🧠", _count: { followers: 2956, posts: 289 } },
  { id: "5", slug: "supplements", name: "Supplements & Nutrition", description: "What's working, what's not, and the science behind it. Evidence-based discussion.", icon: "🌿", _count: { followers: 2103, posts: 178 } },
  { id: "6", slug: "relationships", name: "Relationships & Intimacy", description: "Honest conversations about changing dynamics, desire, and communication with partners.", icon: "💜", _count: { followers: 1890, posts: 145 } },
  { id: "7", slug: "body-changes", name: "Body Changes", description: "Weight, skin, hair, and everything in between. What to expect, what helps, and body acceptance.", icon: "🦋", _count: { followers: 1654, posts: 123 } },
  { id: "8", slug: "work-life", name: "Work & Career", description: "Managing symptoms at work, disclosure decisions, and professional impact. You're still that powerhouse.", icon: "💼", _count: { followers: 1432, posts: 98 } },
];

const MOCK_POSTS: Post[] = [
  { id: "p1", title: "Finally found the right estradiol dose after 8 months", body: "I wanted to share my journey because I know how frustrating dose adjustments can be. Started at 0.5mg, went up to 1mg, then my doctor suggested splitting into twice daily. The difference was night and day — hot flashes went from 12/day to maybe 2. Don't give up if the first dose doesn't work.", identity: "PSEUDONYM", isPinned: false, createdAt: new Date(Date.now() - 3 * 3600000).toISOString(), reactionCount: 221, commentCount: 34, author: { profile: { displayName: "MoonlitSage" } }, room: { name: "HRT & Hormone Therapy", slug: "hrt", icon: "💊" } },
  { id: "p2", title: "3am wake-ups every single night — is this the new normal?", body: "I've tried everything. Magnesium, melatonin, sleep hygiene, cooling sheets. Still waking up at 3am drenched in sweat. Has anyone found something that actually works for the middle-of-the-night insomnia? I'm exhausted.", identity: "ANONYMOUS", isPinned: false, createdAt: new Date(Date.now() - 5 * 3600000).toISOString(), reactionCount: 258, commentCount: 56, author: { profile: null }, room: { name: "Sleep & Fatigue", slug: "sleep", icon: "🌙" } },
  { id: "p3", title: "The cooling towel trick that actually changed my life", body: "Get a cooling towel, wet it, keep it in the fridge. When a flash hits, drape it over the back of your neck. The relief is almost instant. I keep one at home, one at work, and one in my car. Game changer.", identity: "PSEUDONYM", isPinned: true, createdAt: new Date(Date.now() - 12 * 3600000).toISOString(), reactionCount: 491, commentCount: 45, author: { profile: { displayName: "DesertRose" } }, room: { name: "Hot Flashes & Night Sweats", slug: "hot-flashes", icon: "🔥" } },
  { id: "p4", title: "Brain fog so bad I forgot my own phone number", body: "Please tell me I'm not the only one. I've been sharp my whole life — ran teams, managed budgets, could multitask like nobody's business. Now I can't remember why I walked into a room. When does this get better?", identity: "PSEUDONYM", isPinned: false, createdAt: new Date(Date.now() - 7 * 3600000).toISOString(), reactionCount: 288, commentCount: 71, author: { profile: { displayName: "QuietStorm42" } }, room: { name: "Mood & Mental Health", slug: "mood", icon: "🧠" } },
  { id: "p5", title: "PSA: Ashwagandha + Magnesium Glycinate combo", body: "My naturopath suggested this combination and it's been remarkable for anxiety. Ashwagandha 600mg in the morning, Magnesium Glycinate 400mg before bed. Two weeks in and I feel like myself again. Obviously check with your doctor first.", identity: "PSEUDONYM", isPinned: false, createdAt: new Date(Date.now() - 14 * 3600000).toISOString(), reactionCount: 176, commentCount: 38, author: { profile: { displayName: "WildSage" } }, room: { name: "Supplements & Nutrition", slug: "supplements", icon: "🌿" } },
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

// ─── Helpers ───
function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

// ─── Landing Page ───

function LandingView({ onEnter }: { onEnter: () => void }) {
  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Botanical art background */}
      <div style={{ position: "absolute", top: -40, right: -60, width: 340, height: 420, opacity: 0.4, pointerEvents: "none" }}>
        <BotanicalArt />
      </div>
      <div style={{ position: "absolute", bottom: -80, left: -40, width: 280, height: 350, opacity: 0.25, pointerEvents: "none", transform: "scaleX(-1) rotate(15deg)" }}>
        <BotanicalArt />
      </div>

      {/* Hero section */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "80px 28px 60px", position: "relative", zIndex: 1 }} className="animate-fade-up">
        <div style={{ marginBottom: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 400, letterSpacing: 2.5, textTransform: "uppercase", color: C.lavender }}>A community for every stage</span>
        </div>

        <h1 style={{ fontFamily: fonts.heading, fontSize: 52, fontWeight: 300, color: C.ink, lineHeight: 1.15, margin: "0 0 24px", letterSpacing: -0.5 }}>
          You&apos;re not alone<br />
          <span style={{ color: C.dustyPlum }}>in this.</span>
        </h1>

        <p style={{ fontSize: 17, color: C.text2, lineHeight: 1.8, fontWeight: 300, margin: "0 0 20px", maxWidth: 520 }}>
          Periwink is a calm, intelligent community for women navigating perimenopause and menopause. Track your symptoms, share experiences anonymously, and contribute to research that helps everyone.
        </p>

        <p style={{ fontSize: 15, color: C.text3, lineHeight: 1.75, fontWeight: 300, margin: "0 0 44px", maxWidth: 480, fontStyle: "italic" }}>
          Because the conversation about menopause deserves more than whispers.
        </p>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 60 }}>
          <button onClick={onEnter} style={{ padding: "16px 36px", background: C.dustyPlum, color: "rgba(255,255,255,0.95)", border: "none", borderRadius: 24, fontSize: 16, fontWeight: 500, cursor: "pointer", fontFamily: fonts.body, letterSpacing: 0.3, transition: "all 0.3s ease" }}>
            Join the community
          </button>
          <button onClick={onEnter} style={{ padding: "16px 36px", background: "transparent", color: C.dustyPlum, border: `1.5px solid ${C.borderWarm}`, borderRadius: 24, fontSize: 16, fontWeight: 500, cursor: "pointer", fontFamily: fonts.body, letterSpacing: 0.3 }}>
            Explore rooms
          </button>
        </div>

        <WaveDivider />

        {/* What is Periwink */}
        <section style={{ marginTop: 50, marginBottom: 50 }}>
          <h2 style={{ fontFamily: fonts.heading, fontSize: 28, fontWeight: 300, color: C.ink, margin: "0 0 28px" }}>
            What is Periwink?
          </h2>
          <div style={{ display: "grid", gap: 20 }}>
            {[
              { icon: "💬", title: "Community Rooms", desc: "Topic-based spaces for real conversations — hot flashes, HRT, sleep, mood, relationships. Post with your pseudonym or fully anonymously." },
              { icon: "📝", title: "Symptom Tracker", desc: "Log how you're feeling each day. Track patterns across vasomotor, sleep, mood, and physical categories over time." },
              { icon: "📊", title: "Citizen Science", desc: "Opt in to share anonymized data. See what symptoms are most common, which treatments work, and how your experience compares." },
              { icon: "🔒", title: "Privacy First", desc: "Pseudonyms by default. Full anonymity per post. Your data is yours — granular consent controls for everything." },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 18, padding: "22px 24px", background: C.card, border: `1px solid ${C.borderWarm}`, borderRadius: 20, transition: "all 0.3s ease" }}>
                <span style={{ fontSize: 24, flexShrink: 0, lineHeight: 1 }}>{item.icon}</span>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 500, color: C.ink, margin: "0 0 6px" }}>{item.title}</h3>
                  <p style={{ fontSize: 13.5, color: C.text2, lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <WaveDivider />

        {/* Community stats */}
        <section style={{ marginTop: 50, marginBottom: 50, textAlign: "center" }}>
          <h2 style={{ fontFamily: fonts.heading, fontSize: 24, fontWeight: 300, color: C.ink, margin: "0 0 32px" }}>
            A growing community of support
          </h2>
          <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
            {[
              { num: "8", label: "topic rooms" },
              { num: "78%", label: "report hot flashes" },
              { num: "100%", label: "anonymous option" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, fontWeight: 400, color: C.dustyPlum, fontFamily: fonts.heading }}>{s.num}</div>
                <div style={{ fontSize: 12, color: C.text3, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        <WaveDivider />

        {/* Peek at rooms */}
        <section style={{ marginTop: 50, marginBottom: 60 }}>
          <h2 style={{ fontFamily: fonts.heading, fontSize: 24, fontWeight: 300, color: C.ink, margin: "0 0 20px" }}>
            Active rooms
          </h2>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
            {MOCK_ROOMS.slice(0, 5).map((r) => (
              <button key={r.id} onClick={onEnter} style={{ display: "flex", alignItems: "center", gap: 8, background: C.card, border: `1px solid ${C.borderWarm}`, borderRadius: 16, padding: "14px 18px", cursor: "pointer", whiteSpace: "nowrap", fontFamily: fonts.body, minWidth: 200, transition: "all 0.25s ease" }}>
                <span style={{ fontSize: 18 }}>{r.icon}</span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>{r._count.followers.toLocaleString()} members</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <div style={{ textAlign: "center", padding: "40px 0 80px" }}>
          <p style={{ fontFamily: fonts.heading, fontSize: 20, color: C.ink, fontStyle: "italic", margin: "0 0 24px", lineHeight: 1.6 }}>
            &ldquo;I wish I&apos;d found this place a year ago.&rdquo;
          </p>
          <button onClick={onEnter} style={{ padding: "16px 44px", background: C.dustyPlum, color: "rgba(255,255,255,0.95)", border: "none", borderRadius: 24, fontSize: 16, fontWeight: 500, cursor: "pointer", fontFamily: fonts.body }}>
            Get started — it&apos;s free
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Views ───

function HomeView({ rooms, posts, onRoomClick, onPostClick }: { rooms: Room[]; posts: Post[]; onRoomClick: (r: Room) => void; onPostClick: (p: Post) => void }) {
  const displayRooms = rooms.length > 0 ? rooms : MOCK_ROOMS;
  const displayPosts = posts.length > 0 ? posts : MOCK_POSTS;
  const sorted = [...displayPosts].sort((a, b) => b.reactionCount - a.reactionCount);

  return (
    <div className="animate-fade-up">
      <div style={{ marginBottom: 44 }}>
        <h1 style={{ fontSize: 32, fontWeight: 300, color: C.ink, margin: "0 0 8px", fontFamily: fonts.heading, letterSpacing: -0.3 }}>Welcome back</h1>
        <p style={{ fontSize: 15, color: C.text2, margin: 0, lineHeight: 1.6 }}>You&apos;re not alone in this. Here&apos;s what the community is sharing.</p>
      </div>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 13, fontWeight: 600, color: C.text2, margin: "0 0 14px", letterSpacing: 0.5, textTransform: "uppercase" }}>Rooms</h2>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
          {(displayRooms as Room[]).map((r) => (
            <button key={r.id} onClick={() => onRoomClick(r)} style={{ display: "flex", alignItems: "center", gap: 8, background: C.card, border: `1px solid ${C.borderWarm}`, borderRadius: 16, padding: "14px 18px", cursor: "pointer", whiteSpace: "nowrap", fontFamily: fonts.body, minWidth: 200 }}>
              <span style={{ fontSize: 18 }}>{r.icon}</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>{r.name}</div>
                <div style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>{r._count.followers.toLocaleString()} members</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: 13, fontWeight: 600, color: C.text2, margin: "0 0 16px", letterSpacing: 0.5, textTransform: "uppercase" }}>Trending</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sorted.slice(0, 5).map((p) => {
            const authorName = p.identity === "ANONYMOUS" ? "Anonymous" : p.author?.profile?.displayName || "Member";
            return (
              <div key={p.id} onClick={() => onPostClick(p)} style={{ background: C.card, border: `1px solid ${C.borderWarm}`, borderRadius: 20, padding: "24px 26px", cursor: "pointer" }}>
                {p.isPinned && <div style={{ fontSize: 10, color: C.mutedRose, fontWeight: 600, marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>Pinned</div>}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <Avi name={authorName} size={30} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: C.ink, opacity: 0.85 }}>{p.identity === "ANONYMOUS" ? "Anonymous member" : authorName}</span>
                  <span style={{ fontSize: 11, color: C.text3 }}>{getTimeAgo(p.createdAt)}</span>
                  <span style={{ fontSize: 11, color: C.lavender, marginLeft: "auto" }}>{p.room.icon} {p.room.name}</span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 400, color: C.ink, margin: "0 0 8px", lineHeight: 1.5, fontFamily: fonts.heading }}>{p.title}</h3>
                <p style={{ fontSize: 13.5, color: C.text2, lineHeight: 1.65, margin: "0 0 18px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{p.body}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Reactions reactions={{ heart: Math.floor(p.reactionCount * 0.3), same: Math.floor(p.reactionCount * 0.4), helpful: Math.floor(p.reactionCount * 0.3) }} small />
                  <span style={{ fontSize: 11, color: C.text3 }}>{p.commentCount} replies</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function RoomDetailView({ room, onBack }: { room: Room; onBack: () => void }) {
  const roomPosts = MOCK_POSTS.filter((p) => p.room.slug === room.slug);
  const allPosts = roomPosts.length > 0 ? roomPosts : MOCK_POSTS.slice(0, 3).map((p) => ({ ...p, room: { name: room.name, slug: room.slug, icon: room.icon } }));

  return (
    <div className="animate-fade-up">
      <button onClick={onBack} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.text3, fontSize: 13, fontFamily: fonts.body, marginBottom: 24, padding: 0 }}>
        ← Back
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
        <span style={{ fontSize: 32 }}>{room.icon}</span>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 300, color: C.ink, margin: 0, fontFamily: fonts.heading }}>{room.name}</h1>
          <div style={{ fontSize: 12, color: C.text3, marginTop: 4 }}>{room._count.followers.toLocaleString()} members · {room._count.posts} posts</div>
        </div>
      </div>
      <p style={{ fontSize: 14, color: C.text2, lineHeight: 1.65, margin: "12px 0 32px", maxWidth: 560 }}>{room.description}</p>

      <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
        <button style={{ padding: "8px 20px", background: C.dustyPlum, color: "rgba(255,255,255,0.92)", border: "none", borderRadius: 16, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: fonts.body }}>New post</button>
        <button style={{ padding: "8px 20px", background: "transparent", color: C.text2, border: `1px solid ${C.borderWarm}`, borderRadius: 16, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: fonts.body }}>Follow room</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {allPosts.map((p) => {
          const authorName = p.identity === "ANONYMOUS" ? "Anonymous" : p.author?.profile?.displayName || "Member";
          return (
            <div key={p.id} style={{ background: C.card, border: `1px solid ${C.borderWarm}`, borderRadius: 18, padding: "22px 24px", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <Avi name={authorName} size={28} />
                <span style={{ fontSize: 13, fontWeight: 500, color: C.ink, opacity: 0.85 }}>{p.identity === "ANONYMOUS" ? "Anonymous" : authorName}</span>
                <span style={{ fontSize: 11, color: C.text3 }}>{getTimeAgo(p.createdAt)}</span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 400, color: C.ink, margin: "0 0 8px", lineHeight: 1.5, fontFamily: fonts.heading }}>{p.title}</h3>
              <p style={{ fontSize: 13, color: C.text2, lineHeight: 1.6, margin: "0 0 14px" }}>{p.body}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Reactions reactions={{ heart: Math.floor(p.reactionCount * 0.3), same: Math.floor(p.reactionCount * 0.4), helpful: Math.floor(p.reactionCount * 0.3) }} small />
                <span style={{ fontSize: 11, color: C.text3 }}>{p.commentCount} replies</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TrackerView() {
  const [logs, setLogs] = useState<Record<string, number>>({});
  const [expanded, setExpanded] = useState<string | null>("Vasomotor");
  const cats = [...new Set(SYMPTOMS.map((s) => s.cat))];
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const logged = Object.values(logs).filter((v) => v > 0).length;

  return (
    <div className="animate-fade-up">
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 28, fontWeight: 300, color: C.ink, margin: "0 0 6px", fontFamily: fonts.heading }}>How are you feeling today?</h1>
        <p style={{ fontSize: 14, color: C.text2, margin: 0 }}>{today}</p>
      </div>
      {logged > 0 && <div style={{ background: `${C.softGlow}15`, borderRadius: 14, padding: "12px 18px", marginBottom: 20, fontSize: 12, color: C.dustyPlum }}>{logged} symptom{logged > 1 ? "s" : ""} logged today</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
        {cats.map((cat) => {
          const syms = SYMPTOMS.filter((s) => s.cat === cat);
          const open = expanded === cat;
          return (
            <div key={cat} style={{ background: C.card, border: `1px solid ${C.borderWarm}`, borderRadius: 18, overflow: "hidden" }}>
              <button onClick={() => setExpanded(open ? null : cat)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 22px", background: "transparent", border: "none", cursor: "pointer", fontFamily: fonts.body }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: C.ink }}>{cat}</span>
                <span style={{ fontSize: 10, color: C.text3, transition: "transform 0.25s", transform: open ? "rotate(180deg)" : "none", display: "inline-block" }}>▾</span>
              </button>
              {open && (
                <div style={{ padding: "0 22px 18px" }}>
                  {syms.map((s, i) => (
                    <div key={s.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderTop: i > 0 ? `1px solid ${C.borderWarm}22` : "none" }}>
                      <span style={{ fontSize: 14, color: C.ink, opacity: 0.85 }}>{s.label}</span>
                      <SevDots value={logs[s.key] || 0} onChange={(v) => setLogs((p) => ({ ...p, [s.key]: v }))} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <button style={{ width: "100%", padding: "15px", background: C.dustyPlum, color: "rgba(255,255,255,0.95)", border: "none", borderRadius: 20, fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: fonts.body }}>Save today&apos;s log</button>
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
        <h1 style={{ fontSize: 28, fontWeight: 300, color: C.ink, margin: "0 0 6px", fontFamily: fonts.heading }}>Community insights</h1>
        <p style={{ fontSize: 14, color: C.text2, margin: 0 }}>Anonymized patterns from contributing members</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {data.symptoms.map((s, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.borderWarm}`, borderRadius: 14, padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: C.ink }}>{s.name}</span>
              <span style={{ fontSize: 13, color: C.dustyPlum, fontWeight: 500 }}>{s.pct}%</span>
            </div>
            <div style={{ height: 5, background: C.ivory3, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${s.pct}%`, height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${C.lavender}, ${C.mutedRose})` }} />
            </div>
            <span style={{ fontSize: 11, color: C.text3, marginTop: 6, display: "inline-block" }}>{s.n.toLocaleString()} members</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Shell ───
export function AppShell({ initialRooms, initialPosts }: { initialRooms: Room[]; initialPosts: Post[] }) {
  const [view, setView] = useState("landing");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [, setSelectedPost] = useState<Post | null>(null);

  const go = (v: string) => setView(v);

  // Landing page has no header/nav
  if (view === "landing") {
    return <LandingView onEnter={() => go("home")} />;
  }

  return (
    <>
      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 40, background: `${C.warmIvory}EE`, backdropFilter: "blur(14px)", borderBottom: `1px solid ${C.borderWarm}33` }}>
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => go("home")} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
            <span style={{ fontSize: 24, fontWeight: 300, color: C.dustyPlum, fontFamily: fonts.heading, letterSpacing: 0.3 }}>periwink</span>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button style={{ background: "transparent", border: `1px solid ${C.borderWarm}`, borderRadius: 16, padding: "5px 14px", fontSize: 12, color: C.text2, cursor: "pointer", fontWeight: 500, fontFamily: fonts.body }}>Sign in</button>
            <button style={{ background: C.dustyPlum, border: "none", borderRadius: 16, padding: "5px 14px", fontSize: 12, color: "rgba(255,255,255,0.92)", cursor: "pointer", fontWeight: 500, fontFamily: fonts.body }}>Join</button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 780, margin: "0 auto", padding: "36px 24px 130px", position: "relative", zIndex: 1 }}>
        {view === "home" && (
          <HomeView rooms={initialRooms} posts={initialPosts} onRoomClick={(r) => { setSelectedRoom(r); go("room"); }} onPostClick={(p) => { setSelectedPost(p); go("post"); }} />
        )}
        {view === "tracker" && <TrackerView />}
        {view === "insights" && <InsightsView />}
        {view === "room" && selectedRoom && (
          <RoomDetailView room={selectedRoom} onBack={() => go("home")} />
        )}
        {view === "post" && (
          <div className="animate-fade-up">
            <button onClick={() => go("home")} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.text3, fontSize: 13, fontFamily: fonts.body, marginBottom: 24 }}>← Back</button>
            <p style={{ color: C.text2 }}>Post detail — coming soon</p>
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 40, background: `${C.warmIvory}EE`, backdropFilter: "blur(14px)", borderTop: `1px solid ${C.borderWarm}33` }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "4px 8px 8px", display: "flex", justifyContent: "space-around" }}>
          {[
            { icon: "🏠", label: "Home", key: "home" },
            { icon: "💬", label: "Rooms", key: "rooms" },
            { icon: "📝", label: "Track", key: "tracker" },
            { icon: "📊", label: "Insights", key: "insights" },
          ].map((item) => (
            <button key={item.key} onClick={() => { if (item.key === "rooms") go("home"); else go(item.key); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "transparent", border: "none", cursor: "pointer", padding: "8px 14px", color: view === item.key ? C.dustyPlum : C.text3, fontFamily: fonts.body, fontSize: 10, fontWeight: view === item.key ? 600 : 400 }}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
