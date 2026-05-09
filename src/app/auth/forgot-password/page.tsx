"use client";

import { useState } from "react";
import Link from "next/link";

function inputStyle(focused: boolean) {
  return {
    width: "100%", padding: "12px 14px",
    border: `1px solid ${focused ? "var(--color-dusty-plum, #6E5A7E)" : "var(--color-border-warm, #DDD7CE)"}`,
    borderRadius: 10, fontSize: 15, outline: "none",
    background: "var(--color-warm-ivory, #F7F3EE)",
    color: "var(--color-ink, #2B2433)",
    fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
    transition: "border-color 0.15s",
    boxSizing: "border-box" as const,
  };
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "sent">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    await fetch("/api/auth/reset-password/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setState("sent");
  }

  return (
    <div style={{
      background: "var(--color-card, #FDFBF8)",
      border: "1px solid var(--color-border-warm, #DDD7CE)",
      borderRadius: 20, padding: "36px 32px",
    }}>
      <h1 style={{
        fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)",
        fontSize: 24, fontWeight: 300, color: "var(--color-ink, #2B2433)",
        marginBottom: 6, textAlign: "center",
      }}>
        Reset your password
      </h1>
      <p style={{ fontSize: 14, color: "var(--color-text-3, #9B94A3)", textAlign: "center", marginBottom: 28 }}>
        Enter your email and we&apos;ll send you a link to create a new password.
      </p>

      {state === "sent" ? (
        <div style={{
          background: "rgba(140,146,255,0.1)",
          border: "1px solid var(--color-periwinkle, #8C92FF)",
          borderRadius: 10, padding: "16px 18px",
          fontSize: 14, color: "var(--color-text-2, #6B6575)",
          lineHeight: 1.6, textAlign: "center",
        }}>
          If an account exists for that email, you&apos;ll receive a reset link shortly. Check your inbox.
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, color: "var(--color-text-2, #6B6575)", marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              autoComplete="email"
              style={inputStyle(focused)}
            />
          </div>
          <button
            type="submit"
            disabled={state === "loading" || !email}
            style={{
              width: "100%", padding: "13px",
              background: state === "loading" || !email ? "var(--color-border-warm, #DDD7CE)" : "var(--color-dusty-plum, #6E5A7E)",
              color: state === "loading" || !email ? "var(--color-text-3, #9B94A3)" : "#fff",
              border: "none", borderRadius: 12, fontSize: 15,
              fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
              cursor: state === "loading" || !email ? "not-allowed" : "pointer",
              marginTop: 6,
            }}
          >
            {state === "loading" ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}

      <p style={{ fontSize: 13, color: "var(--color-text-3, #9B94A3)", textAlign: "center", marginTop: 24 }}>
        <Link href="/auth/signin" style={{ color: "var(--color-dusty-plum, #6E5A7E)", textDecoration: "none" }}>
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
