"use client";

import { useEffect, useState } from "react";

type Platform = "android" | "ios" | null;

function FlowerIcon() {
  return (
    <div style={{
      width: 48, height: 48, borderRadius: 12, flexShrink: 0,
      background: "linear-gradient(135deg, #6E5A7E, #5A4668)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <svg width="32" height="32" viewBox="0 0 22 22" fill="none">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse key={deg} cx="11" cy="4.5" rx="3" ry="5.5"
            fill="white" fillOpacity="0.92"
            transform={`rotate(${deg} 11 11)`} />
        ))}
        <circle cx="11" cy="11" r="3" fill="#D7CCFF" />
        <circle cx="11" cy="11" r="1.5" fill="#6E5A7E" />
      </svg>
    </div>
  );
}

export default function InstallBanner() {
  const [platform, setPlatform] = useState<Platform>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<Event & { prompt: () => void } | null>(null);
  const [visible, setVisible] = useState(false);
  const [showIOSSteps, setShowIOSSteps] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Already installed as standalone
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window.navigator as any).standalone === true) return;

    // Dismissed before
    if (localStorage.getItem("pw-install-dismissed")) return;

    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !/CriOS/.test(ua);
    const isAndroid = /Android/.test(ua);

    if (isIOS) {
      setPlatform("ios");
      setVisible(true);
    }

    if (isAndroid || (!isIOS && !isAndroid)) {
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as Event & { prompt: () => void });
        setPlatform("android");
        setVisible(true);
      };
      window.addEventListener("beforeinstallprompt", handler);
      return () => window.removeEventListener("beforeinstallprompt", handler);
    }
  }, []);

  function dismiss() {
    localStorage.setItem("pw-install-dismissed", "1");
    setVisible(false);
  }

  async function install() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <>
      {/* Backdrop for iOS steps */}
      {showIOSSteps && (
        <div
          onClick={() => setShowIOSSteps(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 49,
            background: "rgba(43,36,51,0.4)", backdropFilter: "blur(4px)",
          }}
        />
      )}

      {/* iOS step-by-step sheet */}
      {showIOSSteps && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 51,
          background: "#FDFBF8", borderRadius: "20px 20px 0 0",
          padding: "28px 24px 40px",
          boxShadow: "0 -8px 40px rgba(110,90,126,0.2)",
          animation: "slideUp 0.25s ease",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)", fontSize: 20, fontWeight: 300, color: "#2B2433", margin: 0 }}>
              Add to Home Screen
            </h3>
            <button onClick={() => setShowIOSSteps(false)} style={{ background: "none", border: "none", fontSize: 20, color: "#9B94A3", cursor: "pointer", padding: "4px 8px" }}>×</button>
          </div>
          {[
            { step: "1", icon: "□↑", text: 'Tap the Share button at the bottom of your browser' },
            { step: "2", icon: "⊞+", text: 'Scroll down and tap "Add to Home Screen"' },
            { step: "3", icon: "✓", text: 'Tap "Add" — Periwink will appear on your home screen' },
          ].map(item => (
            <div key={item.step} style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", background: "#6E5A7E",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 13, fontWeight: 500, flexShrink: 0,
              }}>
                {item.step}
              </div>
              <p style={{ fontSize: 15, color: "#6B6575", lineHeight: 1.6, margin: 0, paddingTop: 4 }}>{item.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Main banner */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
        background: "rgba(253,251,248,0.97)", backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid #E8E1F0",
        padding: "14px 20px max(14px, env(safe-area-inset-bottom))",
        display: "flex", alignItems: "center", gap: 14,
        boxShadow: "0 -4px 24px rgba(110,90,126,0.12)",
        animation: "slideUp 0.3s ease",
      }}>
        <FlowerIcon />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: "#2B2433", lineHeight: 1.2, marginBottom: 2 }}>
            Periwink
          </div>
          <div style={{ fontSize: 12, color: "#9B94A3", lineHeight: 1.3 }}>
            Add to your home screen for quick access
          </div>
        </div>

        <button
          onClick={platform === "ios" ? () => setShowIOSSteps(true) : install}
          style={{
            padding: "9px 18px", borderRadius: 999, border: "none",
            background: "#6E5A7E", color: "#fff", fontSize: 13, fontWeight: 500,
            fontFamily: "inherit", cursor: "pointer", flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          Add
        </button>

        <button
          onClick={dismiss}
          style={{
            background: "none", border: "none", color: "#9B94A3",
            fontSize: 20, cursor: "pointer", padding: "4px 2px", lineHeight: 1, flexShrink: 0,
          }}
        >
          ×
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
