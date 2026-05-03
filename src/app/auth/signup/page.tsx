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

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [displayName, setDisplayName] = useState(searchParams.get("name") || "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const passwordMismatch = confirm.length > 0 && password !== confirm;
  const canSubmit = email && displayName && password.length >= 8 && password === confirm;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError("");
    setLoading(true);

    // Step 1: Create the account
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        password,
        displayName: displayName.trim(),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    // Step 2: Auto sign-in
    const result = await signIn("credentials", {
      email: email.toLowerCase().trim(),
      password,
      redirect: false,
    });

    if (result?.error) {
      // Account was created — send them to sign in manually
      router.push(`/auth/signin?email=${encodeURIComponent(email)}`);
    } else {
      router.push("/app/onboarding");
    }
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
        Join Periwink
      </h1>
      <p style={{
        fontSize: 14, color: "var(--color-text-3, #9B94A3)",
        textAlign: "center", marginBottom: 28,
      }}>
        Your community for perimenopause & menopause
      </p>

      {error && (
        <div style={{
          background: "rgba(201,154,165,0.12)",
          border: "1px solid var(--color-muted-rose, #C99AA5)",
          borderRadius: 10, padding: "12px 16px",
          fontSize: 14, color: "var(--color-text-2, #6B6575)",
          marginBottom: 20,
        }}>
          {error === "An account with this email already exists" ? (
            <>
              An account with this email already exists.{" "}
              <Link href={`/auth/signin?email=${encodeURIComponent(email)}`} style={{ color: "var(--color-dusty-plum, #6E5A7E)" }}>
                Sign in instead
              </Link>
            </>
          ) : error}
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
            Your pseudonym{" "}
            <span style={{ color: "var(--color-text-3, #9B94A3)", fontWeight: 300 }}>
              (how you&apos;ll appear in the community)
            </span>
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            onFocus={() => setFocused("displayName")}
            onBlur={() => setFocused(null)}
            placeholder="e.g. MoonlitSage, WinterBloom…"
            autoComplete="username"
            required
            style={inputStyle(focused === "displayName")}
          />
        </div>

        <div>
          <label style={{
            display: "block", fontSize: 13, color: "var(--color-text-2, #6B6575)",
            marginBottom: 6, fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
          }}>
            Password{" "}
            <span style={{ color: "var(--color-text-3, #9B94A3)", fontWeight: 300 }}>
              (8+ characters)
            </span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocused("password")}
            onBlur={() => setFocused(null)}
            autoComplete="new-password"
            required
            minLength={8}
            style={inputStyle(focused === "password")}
          />
        </div>

        <div>
          <label style={{
            display: "block", fontSize: 13, color: "var(--color-text-2, #6B6575)",
            marginBottom: 6, fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
          }}>
            Confirm password
          </label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            onFocus={() => setFocused("confirm")}
            onBlur={() => setFocused(null)}
            autoComplete="new-password"
            required
            style={{
              ...inputStyle(focused === "confirm"),
              borderColor: passwordMismatch
                ? "var(--color-muted-rose, #C99AA5)"
                : focused === "confirm"
                ? "var(--color-dusty-plum, #6E5A7E)"
                : "var(--color-border-warm, #DDD7CE)",
            }}
          />
          {passwordMismatch && (
            <p style={{ fontSize: 12, color: "var(--color-muted-rose, #C99AA5)", marginTop: 4 }}>
              Passwords don&apos;t match
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !canSubmit}
          style={{
            width: "100%", padding: "13px",
            background: loading || !canSubmit
              ? "var(--color-border-warm, #DDD7CE)"
              : "var(--color-dusty-plum, #6E5A7E)",
            color: loading || !canSubmit ? "var(--color-text-3, #9B94A3)" : "#fff",
            border: "none", borderRadius: 12, fontSize: 15,
            fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
            cursor: loading || !canSubmit ? "not-allowed" : "pointer",
            marginTop: 6,
          }}
        >
          {loading ? "Creating your account…" : "Create account"}
        </button>
      </form>

      <p style={{
        fontSize: 12, color: "var(--color-text-3, #9B94A3)",
        textAlign: "center", marginTop: 20, lineHeight: 1.6,
      }}>
        By joining, you agree to our privacy-first principles — your identity is always yours to control.
      </p>

      <p style={{
        fontSize: 13, color: "var(--color-text-3, #9B94A3)",
        textAlign: "center", marginTop: 16,
      }}>
        Already have an account?{" "}
        <Link href="/auth/signin" style={{ color: "var(--color-dusty-plum, #6E5A7E)", textDecoration: "none" }}>
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignUpForm />
    </Suspense>
  );
}
