"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

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

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/app";
  const prefillEmail = searchParams.get("email") || "";
  const justVerified = searchParams.get("verified") === "1";
  const tokenError = searchParams.get("error");

  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: email.toLowerCase().trim(),
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("sign_in_failed");
      setLoading(false);
    } else {
      router.push(callbackUrl);
    }
  }

  async function handleResend() {
    setResendState("sending");
    await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.toLowerCase().trim() }),
    });
    setResendState("sent");
  }

  const bannerStyle = {
    borderRadius: 10, padding: "12px 16px",
    fontSize: 14, marginBottom: 20,
  };

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
        Welcome back
      </h1>
      <p style={{
        fontSize: 14, color: "var(--color-text-3, #9B94A3)",
        textAlign: "center", marginBottom: 28,
      }}>
        Sign in to your Periwink account
      </p>

      {justVerified && (
        <div style={{
          ...bannerStyle,
          background: "rgba(140,146,255,0.1)",
          border: "1px solid var(--color-periwinkle, #8C92FF)",
          color: "var(--color-text-2, #6B6575)",
        }}>
          Your email has been verified. You can now sign in.
        </div>
      )}

      {tokenError === "token_expired" && (
        <div style={{
          ...bannerStyle,
          background: "rgba(201,154,165,0.12)",
          border: "1px solid var(--color-muted-rose, #C99AA5)",
          color: "var(--color-text-2, #6B6575)",
        }}>
          That verification link has expired.{" "}
          {email ? (
            <button
              onClick={handleResend}
              disabled={resendState !== "idle"}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 14, color: "var(--color-dusty-plum, #6E5A7E)", textDecoration: "underline" }}
            >
              {resendState === "idle" ? "Send a new one" : resendState === "sending" ? "Sending…" : "Sent!"}
            </button>
          ) : "Enter your email below and request a new link."}
        </div>
      )}

      {tokenError === "invalid_token" && (
        <div style={{
          ...bannerStyle,
          background: "rgba(201,154,165,0.12)",
          border: "1px solid var(--color-muted-rose, #C99AA5)",
          color: "var(--color-text-2, #6B6575)",
        }}>
          That verification link isn't valid. It may have already been used.
        </div>
      )}

      {error === "sign_in_failed" && (
        <div style={{
          ...bannerStyle,
          background: "rgba(201,154,165,0.12)",
          border: "1px solid var(--color-muted-rose, #C99AA5)",
          color: "var(--color-text-2, #6B6575)",
        }}>
          <div>Incorrect email or password, or your email isn't verified yet.</div>
          {resendState === "sent" ? (
            <div style={{ marginTop: 8, fontSize: 13, color: "var(--color-text-3, #9B94A3)" }}>
              A new verification link has been sent.
            </div>
          ) : (
            <button
              onClick={handleResend}
              disabled={!email || resendState === "sending"}
              style={{
                marginTop: 8, background: "none", border: "none",
                cursor: !email || resendState === "sending" ? "not-allowed" : "pointer",
                padding: 0, fontSize: 13,
                color: "var(--color-dusty-plum, #6E5A7E)",
                textDecoration: "underline",
              }}
            >
              {resendState === "sending" ? "Sending…" : "Resend verification email"}
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={{
            display: "block", fontSize: 13, color: "var(--color-text-2, #6B6575)",
            marginBottom: 6, fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
          }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused(null)}
            autoComplete="email"
            required
            style={inputStyle(focused === "email")}
          />
        </div>

        <div>
          <label style={{
            display: "block", fontSize: 13, color: "var(--color-text-2, #6B6575)",
            marginBottom: 6, fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
          }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocused("password")}
            onBlur={() => setFocused(null)}
            autoComplete="current-password"
            required
            style={inputStyle(focused === "password")}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !email || !password}
          style={{
            width: "100%", padding: "13px",
            background: loading || !email || !password
              ? "var(--color-border-warm, #DDD7CE)"
              : "var(--color-dusty-plum, #6E5A7E)",
            color: loading || !email || !password ? "var(--color-text-3, #9B94A3)" : "#fff",
            border: "none", borderRadius: 12, fontSize: 15,
            fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
            cursor: loading || !email || !password ? "not-allowed" : "pointer",
            marginTop: 6,
          }}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p style={{
        fontSize: 13, color: "var(--color-text-3, #9B94A3)",
        textAlign: "center", marginTop: 24,
      }}>
        New here?{" "}
        <Link href="/auth/signup" style={{ color: "var(--color-dusty-plum, #6E5A7E)", textDecoration: "none" }}>
          Create your account
        </Link>
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
