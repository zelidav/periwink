// Periwink Design System — single source of truth
export const colors = {
  // Primary
  periwinkle: "#8C92FF",
  softPeriwinkle: "#A7AEFF",
  // Secondary
  lavender: "#B7A8C9",
  dustyPlum: "#6E5A7E",
  // Backgrounds
  warmIvory: "#F7F3EE",
  ivory2: "#F2EDE6",
  ivory3: "#EBE5DC",
  softMist: "#E8E3EA",
  // Accents
  mutedRose: "#C99AA5",
  roseLight: "#D4B0B9",
  softGlow: "#D7CCFF",
  // Text
  ink: "#2B2433",
  text2: "#6B6575",
  text3: "#9B94A3",
  // Borders / UI
  border: "#E2DDE8",
  borderWarm: "#DDD7CE",
  card: "#FDFBF8",
  cardHover: "#FAF7F2",
  warmWhite: "#FFFDF9",
} as const;

export const fonts = {
  heading: "'Cormorant Garamond', Georgia, serif",
  body: "'DM Sans', -apple-system, sans-serif",
} as const;

export const gradients = {
  primary: `linear-gradient(135deg, ${colors.periwinkle}, ${colors.lavender})`,
  warm: `linear-gradient(135deg, ${colors.lavender}, ${colors.mutedRose})`,
  glow: `radial-gradient(circle, ${colors.softGlow}22, transparent)`,
  mistGlow: `radial-gradient(circle, ${colors.softMist}30, transparent)`,
} as const;
