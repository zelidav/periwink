"use client";

import { useState } from "react";
import { avatarGradient, dicebearUrl } from "@/lib/demo-helpers";

export default function Avatar({
  name,
  size = 36,
  style,
  avatarStyle,
}: {
  name: string;
  size?: number;
  style?: React.CSSProperties;
  avatarStyle?: string | null;
}) {
  const [imgError, setImgError] = useState(false);
  const initial = (name || "?")[0].toUpperCase();

  // DiceBear avatar
  if (avatarStyle && avatarStyle.startsWith("dicebear") && !imgError) {
    const variant = avatarStyle.split(":")[1] || "avataaars";
    return (
      <img
        src={dicebearUrl(name, variant, size * 2)}
        alt={name}
        loading="lazy"
        onError={() => setImgError(true)}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          flexShrink: 0,
          background: avatarGradient(name),
          ...style,
        }}
      />
    );
  }

  // Default gradient avatar
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: avatarGradient(name || "anonymous"),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.4,
        fontWeight: 500,
        color: "rgba(255,255,255,0.85)",
        flexShrink: 0,
        ...style,
      }}
    >
      {initial}
    </div>
  );
}
