"use client";

import { useState } from "react";
import Link from "next/link";

const categories = [
  {
    name: "Vasomotor",
    symptoms: [
      { key: "HOT_FLASHES", label: "Hot flashes" },
      { key: "NIGHT_SWEATS", label: "Night sweats" },
      { key: "CHILLS", label: "Chills" },
    ],
  },
  {
    name: "Sleep",
    symptoms: [
      { key: "INSOMNIA", label: "Insomnia" },
      { key: "SLEEP_DISRUPTION", label: "Disrupted sleep" },
      { key: "FATIGUE", label: "Fatigue" },
    ],
  },
  {
    name: "Mood & Mind",
    symptoms: [
      { key: "ANXIETY", label: "Anxiety" },
      { key: "IRRITABILITY", label: "Irritability" },
      { key: "MOOD_SWINGS", label: "Mood swings" },
      { key: "BRAIN_FOG", label: "Brain fog" },
      { key: "DEPRESSION", label: "Low mood" },
    ],
  },
  {
    name: "Physical",
    symptoms: [
      { key: "JOINT_PAIN", label: "Joint pain" },
      { key: "HEADACHES", label: "Headaches" },
      { key: "WEIGHT_CHANGES", label: "Weight changes" },
      { key: "BLOATING", label: "Bloating" },
      { key: "HEART_PALPITATIONS", label: "Heart palpitations" },
    ],
  },
];

function SeverityDots({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onChange(value === n ? 0 : n)}
          style={{
            width: 24, height: 24, borderRadius: "50%",
            border: n <= value
              ? "none"
              : "1.5px solid var(--color-border-warm, #DDD7CE)",
            background: n <= value
              ? "var(--color-dusty-plum, #6E5A7E)"
              : "transparent",
            cursor: "pointer", transition: "all 0.15s",
          }}
        />
      ))}
    </div>
  );
}

export default function CheckInPage() {
  const [entries, setEntries] = useState<Record<string, number>>({});
  const [contribute, setContribute] = useState(false);
  const [openCat, setOpenCat] = useState<string>("Mood & Mind");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "auth" | "error">("idle");

  const setSeverity = (key: string, val: number) => {
    setEntries((prev) => {
      const next = { ...prev };
      if (val === 0) delete next[key];
      else next[key] = val;
      return next;
    });
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const entryCount = Object.keys(entries).length;

  async function handleSave() {
    if (entryCount === 0) return;
    setStatus("saving");
    try {
      const res = await fetch("/api/symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entries: Object.entries(entries).map(([symptom, severity]) => ({
            symptom,
            severity,
          })),
          contribute,
        }),
      });
      if (res.status === 401) {
        setStatus("auth");
      } else if (res.ok) {
        setStatus("saved");
        setEntries({});
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "saved") {
    return (
      <>
        <section style={{ marginBottom: 28 }}>
          <h1 style={{
            fontFamily: "var(--font-heading)", fontSize: 28, fontWeight: 300,
            color: "var(--color-ink)", marginBottom: 6,
          }}>
            Check-in saved.
          </h1>
          <p style={{ fontSize: 14, color: "var(--color-text-3)" }}>{today}</p>
        </section>
        <div style={{
          background: "linear-gradient(135deg, var(--color-soft-mist), rgba(215,204,255,0.1))",
          border: "1px solid var(--color-lavender)",
          borderRadius: 16, padding: "28px 24px", marginBottom: 28,
        }}>
          <p style={{
            fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 300,
            color: "var(--color-dusty-plum)", marginBottom: 12,
          }}>
            You noticed. That matters.
          </p>
          <p style={{ fontSize: 14, color: "var(--color-text-2)", lineHeight: 1.7 }}>
            Tracking is one of the most powerful things you can do — for yourself, and eventually for all of us.
          </p>
          {contribute && (
            <p style={{ fontSize: 13, color: "var(--color-text-3)", marginTop: 10, fontStyle: "italic" }}>
              Your anonymized data has been added to the community insights. Thank you.
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => setStatus("idle")}
            style={{
              flex: 1, padding: "14px",
              background: "var(--color-dusty-plum)", color: "#fff",
              border: "none", borderRadius: 12, fontSize: 15,
              fontFamily: "var(--font-body)", cursor: "pointer",
            }}
          >
            Check in again
          </button>
          <Link href="/app/insights" style={{
            flex: 1, padding: "14px",
            background: "transparent",
            border: "1px solid var(--color-border-warm)",
            borderRadius: 12, fontSize: 15,
            fontFamily: "var(--font-body)", cursor: "pointer",
            textDecoration: "none", color: "var(--color-text-2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            See insights
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <section style={{ marginBottom: 28 }}>
        <h1 style={{
          fontFamily: "var(--font-heading)", fontSize: 28, fontWeight: 300,
          color: "var(--color-ink)", marginBottom: 6,
        }}>
          How are you feeling?
        </h1>
        <p style={{ fontSize: 14, color: "var(--color-text-3)" }}>{today}</p>
        <p style={{
          fontSize: 15, color: "var(--color-text-2)", lineHeight: 1.7, marginTop: 12,
        }}>
          Take a moment to notice what&apos;s present. There are no wrong answers —
          only what&apos;s true for you right now.
        </p>
      </section>

      {/* Reflective prompt */}
      <div style={{
        background: "linear-gradient(135deg, var(--color-soft-mist), rgba(215,204,255,0.1))",
        border: "1px solid var(--color-lavender)",
        borderRadius: 16, padding: "20px 24px", marginBottom: 28,
      }}>
        <p style={{
          fontFamily: "var(--font-heading)", fontSize: 17, fontWeight: 400,
          color: "var(--color-dusty-plum)", fontStyle: "italic",
        }}>
          &ldquo;What is your body asking you to notice today?&rdquo;
        </p>
      </div>

      {/* Symptom categories */}
      {categories.map((cat) => {
        const isOpen = openCat === cat.name;
        return (
          <div
            key={cat.name}
            style={{
              background: "var(--color-card)", border: "1px solid var(--color-border-warm)",
              borderRadius: 14, marginBottom: 10, overflow: "hidden",
            }}
          >
            <button
              onClick={() => setOpenCat(isOpen ? "" : cat.name)}
              style={{
                width: "100%", display: "flex", justifyContent: "space-between",
                alignItems: "center", padding: "16px 20px",
                background: "none", border: "none", cursor: "pointer",
                fontSize: 15, fontWeight: 400, color: "var(--color-ink)",
                fontFamily: "var(--font-body)",
              }}
            >
              <span>{cat.name}</span>
              <span style={{
                fontSize: 12, color: "var(--color-text-3)",
                transform: isOpen ? "rotate(180deg)" : "none",
                transition: "transform 0.2s",
              }}>
                ▼
              </span>
            </button>
            {isOpen && (
              <div style={{ padding: "0 20px 16px" }}>
                {cat.symptoms.map((s) => (
                  <div
                    key={s.key}
                    style={{
                      display: "flex", justifyContent: "space-between",
                      alignItems: "center", padding: "10px 0",
                      borderBottom: "1px solid var(--color-border-warm)",
                    }}
                  >
                    <span style={{ fontSize: 14, color: "var(--color-text-2)" }}>
                      {s.label}
                    </span>
                    <SeverityDots
                      value={entries[s.key] || 0}
                      onChange={(v) => setSeverity(s.key, v)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Contribute toggle */}
      {entryCount > 0 && (
        <div style={{
          background: "var(--color-card)",
          border: "1px solid var(--color-border-warm)",
          borderRadius: 14, padding: "16px 20px", marginTop: 16,
        }}>
          <label style={{
            display: "flex", alignItems: "flex-start", gap: 14, cursor: "pointer",
          }}>
            <div
              onClick={() => setContribute(!contribute)}
              style={{
                width: 20, height: 20, borderRadius: 5, flexShrink: 0, marginTop: 2,
                border: contribute ? "none" : "1.5px solid var(--color-border-warm)",
                background: contribute ? "var(--color-dusty-plum)" : "transparent",
                cursor: "pointer", transition: "all 0.15s",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {contribute && <span style={{ color: "#fff", fontSize: 12, lineHeight: 1 }}>✓</span>}
            </div>
            <div>
              <div style={{ fontSize: 14, color: "var(--color-ink)", marginBottom: 3 }}>
                Share anonymously with community insights
              </div>
              <div style={{ fontSize: 12, color: "var(--color-text-3)", lineHeight: 1.5 }}>
                Your data is aggregated with others — never individually identifiable. You can change this any time.
              </div>
            </div>
          </label>
        </div>
      )}

      {/* Status messages */}
      {status === "auth" && (
        <div style={{
          background: "rgba(201, 154, 165, 0.1)",
          border: "1px solid var(--color-muted-rose, #C99AA5)",
          borderRadius: 12, padding: "14px 18px", marginTop: 16,
          fontSize: 14, color: "var(--color-text-2)",
        }}>
          You&apos;ll need to sign in to save your check-in. Your entries above are still here when you return.
        </div>
      )}
      {status === "error" && (
        <div style={{
          background: "rgba(201, 154, 165, 0.1)",
          border: "1px solid var(--color-muted-rose, #C99AA5)",
          borderRadius: 12, padding: "14px 18px", marginTop: 16,
          fontSize: 14, color: "var(--color-text-2)",
        }}>
          Something went wrong saving. Please try again.
        </div>
      )}

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={entryCount === 0 || status === "saving"}
        style={{
          width: "100%", marginTop: 20, padding: "14px",
          background: entryCount === 0 ? "var(--color-border-warm)" : "var(--color-dusty-plum)",
          color: entryCount === 0 ? "var(--color-text-3)" : "#fff",
          border: "none", borderRadius: 12, fontSize: 15, fontWeight: 400,
          fontFamily: "var(--font-body)",
          cursor: entryCount === 0 ? "not-allowed" : "pointer",
          transition: "background 0.2s",
        }}
      >
        {status === "saving"
          ? "Saving…"
          : entryCount === 0
          ? "Select at least one symptom"
          : `Save today's check-in${entryCount > 0 ? ` (${entryCount})` : ""}`}
      </button>
    </>
  );
}
