"use client";

import { useState } from "react";
import GrowingMessage from "@/components/GrowingMessage";

export function ReactionBar({ count }: { count: number }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "none", border: "none", cursor: "pointer",
          fontSize: 13, color: "var(--color-text-3, #9B94A3)",
          padding: 0,
        }}
      >
        <span style={{ display: "flex", gap: 2, fontSize: 14 }}>
          ♥ 🤗 ☮
        </span>
        {count > 0 && <span>{count}</span>}
      </button>
      <GrowingMessage isOpen={open} onClose={() => setOpen(false)} action="react" />
    </>
  );
}
