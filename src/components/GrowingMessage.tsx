"use client";

import { useState, useEffect, type ReactNode } from "react";

const messages: Record<string, { heading: string; body: string }> = {
  "share a post": {
    heading: "Your voice matters here",
    body: "We're building the posting experience with the same care we want you to feel. Soon you'll be able to share your story.",
  },
  react: {
    heading: "Support is coming",
    body: "Soon you'll be able to show support with hearts, hugs, and 'me too' reactions. Every gesture of recognition matters.",
  },
  "sign in": {
    heading: "Accounts are coming soon",
    body: "For now, explore what this space will feel like. When we open, your place will be here.",
  },
  join: {
    heading: "We're almost ready for you",
    body: "Account creation is coming soon. For now, take a look around and feel what this community will be.",
  },
  "follow this room": {
    heading: "Room following is on its way",
    body: "This room will be waiting for you. Soon you'll be able to follow the conversations that matter most.",
  },
  "edit your profile": {
    heading: "Your profile is being crafted",
    body: "Soon you'll choose a pseudonym, write your bio, and make this space your own — on your terms.",
  },
  "save your check-in": {
    heading: "Tracking is almost here",
    body: "We're building a check-in experience that honors what you're feeling — not just what you're measuring. It's coming soon.",
  },
  "share your thoughts": {
    heading: "Conversation is coming",
    body: "Soon you'll be able to reply, share, and connect with women who understand. For now, know that you're already part of this.",
  },
  default: {
    heading: "Periwink is still growing",
    body: "This feature is being built with care. Every part of this space is designed to help you feel seen, supported, and less alone.",
  },
};

function getMsg(action: string) {
  return messages[action] || messages.default;
}

export default function GrowingMessage({
  isOpen,
  onClose,
  action = "default",
}: {
  isOpen: boolean;
  onClose: () => void;
  action?: string;
}) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const msg = getMsg(action);

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
        background: "rgba(43,36,51,0.35)", backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        style={{
          background: "var(--color-card, #FDFBF8)", borderRadius: 24,
          maxWidth: 400, width: "100%", padding: "44px 36px",
          textAlign: "center",
          border: "1px solid var(--color-border-warm, #DDD7CE)",
          boxShadow: "0 20px 60px rgba(43,36,51,0.12)",
          animation: "fadeUp 0.3s ease-out",
        }}
      >
        <div style={{
          width: 48, height: 48, borderRadius: "50%", margin: "0 auto 20px",
          background: "var(--color-soft-mist, #E8E3EA)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20,
        }}>
          🌱
        </div>
        <h3 style={{
          fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)",
          fontSize: 24, fontWeight: 400, marginBottom: 12,
          color: "var(--color-ink, #2B2433)",
        }}>
          {msg.heading}
        </h3>
        <p style={{
          fontSize: 15, lineHeight: 1.7, marginBottom: 20,
          color: "var(--color-text-2, #6B6575)",
        }}>
          {msg.body}
        </p>
        <p style={{
          fontSize: 14, fontStyle: "italic", marginBottom: 28,
          color: "var(--color-muted-rose, #C99AA5)",
        }}>
          You are not early. You are exactly on time.
        </p>
        <button
          onClick={onClose}
          style={{
            background: "var(--color-dusty-plum, #6E5A7E)", color: "#fff",
            border: "none", borderRadius: 999, padding: "12px 32px",
            fontSize: 14, fontWeight: 400,
            fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
            cursor: "pointer",
          }}
        >
          I'll be here
        </button>
      </div>
    </div>
  );
}

export function LockedButton({
  children,
  action,
  className,
  style,
}: {
  children: ReactNode;
  action: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className={className} style={style}>
        {children}
      </button>
      <GrowingMessage isOpen={open} onClose={() => setOpen(false)} action={action} />
    </>
  );
}
