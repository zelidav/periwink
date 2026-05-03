"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/app", label: "Home", icon: "🏠" },
  { href: "/app/rooms", label: "Rooms", icon: "💬" },
  { href: "/app/checkin", label: "Check-in", icon: "📝" },
  { href: "/app/insights", label: "Insights", icon: "📊" },
  { href: "/app/profile", label: "Profile", icon: "👤" },
];

export default function AppNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 30,
        background: "rgba(247,243,238,0.95)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: "1px solid var(--color-border-warm, #DDD7CE)",
        display: "flex", justifyContent: "space-around",
        padding: "8px 0 max(8px, env(safe-area-inset-bottom))",
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.href === "/app"
          ? pathname === "/app"
          : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              textDecoration: "none", padding: "4px 12px",
              color: isActive
                ? "var(--color-dusty-plum, #6E5A7E)"
                : "var(--color-text-3, #9B94A3)",
              fontSize: 10, fontWeight: isActive ? 500 : 300,
              transition: "color 0.2s",
            }}
          >
            <span style={{ fontSize: 20 }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
