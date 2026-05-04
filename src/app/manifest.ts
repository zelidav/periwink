import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Periwink",
    short_name: "Periwink",
    description: "A community for women navigating perimenopause and menopause.",
    start_url: "/app",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F7F3EE",
    theme_color: "#6E5A7E",
    icons: [
      { src: "/icon-192", sizes: "192x192", type: "image/png", purpose: "any maskable" },
      { src: "/icon-512", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
  };
}
