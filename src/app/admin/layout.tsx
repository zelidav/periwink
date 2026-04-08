export const dynamic = "force-dynamic";

export const metadata = {
  title: "Periwink Admin",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-warm-ivory, #F7F3EE)" }}>
      <header
        style={{
          background: "var(--color-dusty-plum, #6E5A7E)",
          color: "#fff",
          padding: "16px 24px",
          fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)",
          fontSize: "1.5rem",
          fontWeight: 400,
          letterSpacing: "0.02em",
        }}
      >
        periwink admin
      </header>
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>
        {children}
      </main>
    </div>
  );
}
