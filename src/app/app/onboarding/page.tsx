"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const steps = [
  {
    heading: "What brings you here?",
    subtitle: "There's no wrong answer. Just what's true right now.",
    options: [
      "I've recently noticed changes in my body",
      "I've been navigating this for a while",
      "I'm through the other side and want to give back",
      "I'm supporting someone I love",
      "I'm just curious",
    ],
  },
  {
    heading: "What feels most familiar?",
    subtitle: "Choose as many as resonate.",
    options: [
      "I don't feel like myself lately",
      "My sleep has changed and I can't fix it",
      "I feel more emotional — or less patient — or both",
      "My body is doing things I didn't expect",
      "I want information that doesn't feel patronizing",
      "I feel alone in this",
      "I'm looking for women who understand",
    ],
  },
  {
    heading: "What matters most to you here?",
    subtitle: "Pick two or three.",
    options: [
      "Honest conversations with real women",
      "Understanding what's happening in my body",
      "Tracking symptoms and seeing patterns",
      "Learning what's actually working for others",
      "Contributing to research and citizen science",
      "Just knowing I'm not alone",
    ],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Record<number, Set<string>>>({});

  const current = steps[step];
  const selected = selections[step] || new Set();

  const toggle = (option: string) => {
    const next = new Set(selected);
    if (next.has(option)) next.delete(option);
    else next.add(option);
    setSelections({ ...selections, [step]: next });
  };

  if (step >= steps.length) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: 40, marginBottom: 20 }}>🌿</div>
        <h1 style={{
          fontFamily: "var(--font-heading)", fontSize: 32, fontWeight: 300,
          color: "var(--color-ink)", marginBottom: 12,
        }}>
          You're home.
        </h1>
        <p style={{
          fontSize: 16, color: "var(--color-text-2)", lineHeight: 1.7,
          maxWidth: 400, margin: "0 auto 12px",
        }}>
          You don't have to figure this out by yourself.
          There are women here who understand what you're feeling —
          because they're feeling it too.
        </p>
        <p style={{
          fontSize: 15, fontStyle: "italic",
          color: "var(--color-muted-rose)", marginBottom: 32,
        }}>
          Held in change. Changed in community.
        </p>
        <button
          onClick={() => router.push("/app")}
          style={{
            background: "var(--color-dusty-plum)", color: "#fff",
            border: "none", borderRadius: 999, padding: "14px 36px",
            fontSize: 16, fontWeight: 400, cursor: "pointer",
            fontFamily: "var(--font-body)",
          }}
        >
          Enter Periwink
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "40px 0" }}>
      {/* Progress */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 40 }}>
        {steps.map((_, i) => (
          <div
            key={i}
            style={{
              width: 10, height: 10, borderRadius: "50%",
              background: i <= step
                ? "var(--color-dusty-plum)"
                : "var(--color-border-warm)",
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>

      <h1 style={{
        fontFamily: "var(--font-heading)", fontSize: 28, fontWeight: 300,
        color: "var(--color-ink)", marginBottom: 8, textAlign: "center",
      }}>
        {current.heading}
      </h1>
      <p style={{
        fontSize: 15, color: "var(--color-text-3)", textAlign: "center",
        marginBottom: 32,
      }}>
        {current.subtitle}
      </p>

      <div style={{ display: "grid", gap: 10 }}>
        {current.options.map((option) => {
          const isSelected = selected.has(option);
          return (
            <button
              key={option}
              onClick={() => toggle(option)}
              style={{
                padding: "14px 20px", borderRadius: 12,
                border: isSelected
                  ? "1.5px solid var(--color-dusty-plum)"
                  : "1.5px solid var(--color-border-warm)",
                background: isSelected
                  ? "var(--color-soft-mist)"
                  : "var(--color-card)",
                color: "var(--color-ink)", fontSize: 14,
                textAlign: "left", cursor: "pointer",
                fontFamily: "var(--font-body)", fontWeight: 300,
                transition: "all 0.15s",
              }}
            >
              {option}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            style={{
              flex: 1, padding: "13px",
              background: "var(--color-warm-ivory)", color: "var(--color-ink)",
              border: "1px solid var(--color-border-warm)", borderRadius: 10,
              fontSize: 14, cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 400,
            }}
          >
            Back
          </button>
        )}
        <button
          onClick={() => setStep(step + 1)}
          style={{
            flex: 2, padding: "13px",
            background: "var(--color-dusty-plum)", color: "#fff",
            border: "none", borderRadius: 10,
            fontSize: 14, cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 400,
          }}
        >
          {step === steps.length - 1 ? "Finish" : "Continue"}
        </button>
      </div>
    </div>
  );
}
