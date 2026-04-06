import { avatarGradient } from "@/lib/demo-helpers";

export default function Avatar({
  name,
  size = 36,
  style,
}: {
  name: string;
  size?: number;
  style?: React.CSSProperties;
}) {
  const initial = (name || "?")[0].toUpperCase();
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
