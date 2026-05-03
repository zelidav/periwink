import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Periwink â Community for Perimenopause & Menopause",
  description:
    "A calm, intelligent community for women navigating perimenopause and menopause. Track symptoms, share experiences, and contribute to citizen science.",
  openGraph: {
    title: "Periwink",
    description: "You're not alone in this.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
        <div className="relative min-h-screen">
          {/* Ambient warm glows */}
          <div
            className="fixed pointer-events-none z-0"
            style={{
              top: -300,
              right: -200,
              width: 700,
              height: 700,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(215,204,255,0.05), rgba(247,243,238,0.02), transparent)",
            }}
          />
          <div
            className="fixed pointer-events-none z-0"
            style={{
              bottom: -250,
              left: -150,
              width: 550,
              height: 550,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(232,227,234,0.1), transparent)",
            }}
          />
          {children}
        </div>
        </Providers>
      </body>
    </html>
  );
}
