// Utility functions for the demo app

export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function avatarHue(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

export function avatarGradient(name: string): string {
  const hue = avatarHue(name);
  return `linear-gradient(135deg, hsl(${hue}, 35%, 75%), hsl(${(hue + 40) % 360}, 30%, 82%))`;
}

export function dicebearUrl(name: string, style: string = "avataaars", size: number = 64): string {
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(name)}&size=${size}`;
}
