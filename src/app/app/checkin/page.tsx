"use client";

import { useState } from "react";
import GrowingMessage from "@/components/GrowingMessage";

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
  const [showSave, setShowSave] = useState(false);
  const [openCat, setOpenCat] = useState<string>("Mood & Mind");

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
          Take a moment to notice what's present. There are no wrong answers —
          only what's true for you right now.
        </p>
      </section>

      {/* Reflective prompts */}
      <div style={{
        background: "linear-gradient(135deg, var(--color-soft-mist), rgba(215,204,255,0.1))",
        border: "1px solid var(--color-lavender)",
        borderRadius: 16, padding: "20px 24px", marginBottom: 28,
      }}>
        <p style={{
          fontFamily: "var(--font-heading)", fontSize: 17, fontWeight: 400,
          color: "var(--color-dusty-plum)", fontStyle: "italic",
        }}>
          "What is your body asking you to notice today?"
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

      {/* Save button */}
      <button
        onClick={() => setShowSave(true)}
        style={{
          width: "100%", marginTop: 20, padding: "14px",
          background: "var(--color-dusty-plum)", color: "#fff",
          border: "none", borderRadius: 12, fontSize: 15, fontWeight: 400,
          fontFamily: "var(--font-body)", cursor: "pointer",
        }}
      >
        Save today's check-in
      </button>

      <GrowingMessage
        isOpen={showSave}
        onClose={() => setShowSave(false)}
        action="save your check-in"
      />
    </>
  );
}
