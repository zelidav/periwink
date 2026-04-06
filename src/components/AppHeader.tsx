"use client";

import Link from "next/link";
import { LockedButton } from "@/components/GrowingMessage";

export default function AppHeader() {
  return (
    <header
      style={{
        position: "sticky", top: 0, zIndex: 30,
        padding: "14px 20px",
        background: "rgba(247,243,238,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--color-border-warm, #DDD7CE)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}
    >
      <Link
        href="/app"
        style={{
          fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)",
          fontSize: 22, fontWeight: 400, color: "var(--color-dusty-plum, #6E5A7E)",
          textDecoration: "none", letterSpacing: 0.5,
        }}
      >
        periwink
      </Link>
      <div style={{ display: "flex", gap: 8 }}>
        <LockedButton
          action="sign in"
          style={{
            background: "none", border: "1px solid var(--color-border-warm, #DDD7CE)",
            borderRadius: 999, padding: "7px 18px", fontSize: 13,
            color: "var(--color-text-2, #6B6575)", cursor: "pointer",
            fontFamily: "var(--font-body, 'DM Sans', sans-serif)", fontWeight: 400,
          }}
        >
          Sign in
        </LockedButton>
        <LockedButton
          action="join"
          style={{
            background: "var(--color-dusty-plum, #6E5A7E)", color: "#fff",
            border: "none", borderRadius: 999, padding: "7px 18px",
            fontSize: 13, cursor: "pointer",
            fontFamily: "var(--font-body, 'DM Sans', sans-serif)", fontWeight: 400,
          }}
        >
          Join
        </LockedButton>
      </div>
    </header>
  );
}
