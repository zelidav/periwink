import Link from "next/link";

export const metadata = { title: "Periwink — Account" };

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--color-warm-ivory, #F7F3EE)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 20px",
    }}>
      <Link href="/" style={{
        fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)",
        fontSize: 26, fontWeight: 400,
        color: "var(--color-dusty-plum, #6E5A7E)",
        textDecoration: "none", letterSpacing: 0.5,
        marginBottom: 32, display: "block", textAlign: "center",
      }}>
        periwink
      </Link>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {children}
      </div>
    </div>
  );
}
