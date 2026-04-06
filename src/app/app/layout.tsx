import AppHeader from "@/components/AppHeader";
import AppNav from "@/components/AppNav";

export const metadata = {
  title: "Periwink — Community",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" as const }}>
      <AppHeader />
      <main style={{
        flex: 1,
        maxWidth: 780,
        width: "100%",
        margin: "0 auto",
        padding: "24px 20px 100px",
      }}>
        {children}
      </main>
      <AppNav />
    </div>
  );
}
