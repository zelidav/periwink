"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "success" | "error_expired" | "error_mismatch" | "error_short" | "error_other">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setState("error_short"); return; }
    if (password !== confirm) { setState("error_mismatch"); return; }
    setState("loading");

    const res = await fetch("/api/auth/reset-password/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    if (res.ok) {
      setState("success");
      setTimeout(() => router.push("/auth/signin?reset=1"), 2000);
    } else {
      const data = await res.json();
      setState(data.error === "token_expired" ? "error_expired" : "error_other");
    }
  }

  const bannerStyle = {
    borderRadius: 10, padding: "12px 16px",
    fontSize: 14, marginBottom: 20,
    background: "rgba(201,154,165,0.12)",
    border: "1px solid var(--color-muted-rose, #C99AA5)",
    color: "var(--color-text-2, #6B6575)",
  };

  if (!token) {
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <p style={{ fontSize: 14, color: "var(--color-text-2, #6B6575)" }}>
          This link isn&apos;t valid.{" "}
          <Link href="/auth/forgot-password" style={{ color: "var(--color-dusty-plum, #6E5A7E)", textDecoration: "none" }}>
            Request a new one
          </Link>
        </p>
      </div>
    );
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
        Choose a new password
      </h1>
      <p style={{ fontSize: 14, color: "var(--color-text-3, #9B94A3)", textAlign: "center", marginBottom: 28 }}>
        At least 8 characters.
      </p>

      {state === "success" && (
        <div style={{
          borderRadius: 10, padding: "12px 16px", fontSize: 14, marginBottom: 20,
          background: "rgba(140,146,255,0.1)", border: "1px solid var(--color-periwinkle, #8C92FF)",
          color: "var(--color-text-2, #6B6575)", textAlign: "center",
        }}>
          Password updated. Redirecting to sign in…
        </div>
      )}
      {state === "error_expired" && (
        <div style={bannerStyle}>
          This link has expired.{" "}
          <Link href="/auth/forgot-password" style={{ color: "var(--color-dusty-plum, #6E5A7E)", textDecoration: "none" }}>
            Request a new one
          </Link>
        </div>
      )}
      {state === "error_mismatch" && <div style={bannerStyle}>Passwords don&apos;t match — please try again.</div>}
      {state === "error_short" && <div style={bannerStyle}>Password must be at least 8 characters.</div>}
      {state === "error_other" && (
        <div style={bannerStyle}>
          Something went wrong.{" "}
          <Link href="/auth/forgot-password" style={{ color: "var(--color-dusty-plum, #6E5A7E)", textDecoration: "none" }}>
            Try again
          </Link>
        </div>
      )}

      {state !== "success" && (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, color: "var(--color-text-2, #6B6575)", marginBottom: 6 }}>
              New password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              autoComplete="new-password"
              style={inputStyle(focused === "password")}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, color: "var(--color-text-2, #6B6575)", marginBottom: 6 }}>
              Confirm new password
            </label>
            <input
              type="password"
              required
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              onFocus={() => setFocused("confirm")}
              onBlur={() => setFocused(null)}
              autoComplete="new-password"
              style={inputStyle(focused === "confirm")}
            />
          </div>
          <button
            type="submit"
            disabled={state === "loading" || !password || !confirm}
            style={{
              width: "100%", padding: "13px",
              background: state === "loading" || !password || !confirm ? "var(--color-border-warm, #DDD7CE)" : "var(--color-dusty-plum, #6E5A7E)",
              color: state === "loading" || !password || !confirm ? "var(--color-text-3, #9B94A3)" : "#fff",
              border: "none", borderRadius: 12, fontSize: 15,
              fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
              cursor: state === "loading" || !password || !confirm ? "not-allowed" : "pointer",
              marginTop: 6,
            }}
          >
            {state === "loading" ? "Updating…" : "Update password"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
