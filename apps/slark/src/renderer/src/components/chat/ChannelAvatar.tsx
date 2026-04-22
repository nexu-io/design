import { cn } from "@nexu-design/ui-web";
import type { Channel } from "@/types";

/**
 * Stable 32-bit hash for a string. Used to derive a deterministic gradient
 * for a given channel id, so the "default avatar" is the same every render.
 */
function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Curated gradient palette. Each entry is a 2-3 stop linear gradient.
 * Colors are tuned to stay readable with white initials on top.
 */
const GRADIENTS: Array<{ from: string; via?: string; to: string }> = [
  { from: "#6366f1", to: "#ec4899" }, // indigo → pink
  { from: "#0ea5e9", to: "#22d3ee" }, // sky → cyan
  { from: "#f97316", to: "#f43f5e" }, // orange → rose
  { from: "#10b981", to: "#0ea5e9" }, // emerald → sky
  { from: "#8b5cf6", to: "#06b6d4" }, // violet → cyan
  { from: "#f59e0b", via: "#ef4444", to: "#8b5cf6" }, // amber → red → violet
  { from: "#14b8a6", to: "#6366f1" }, // teal → indigo
  { from: "#e11d48", to: "#7c3aed" }, // rose → violet
  { from: "#65a30d", to: "#0891b2" }, // lime → cyan
  { from: "#db2777", via: "#f97316", to: "#facc15" }, // pink → orange → yellow
  { from: "#1e40af", to: "#7e22ce" }, // blue → purple
  { from: "#0f766e", to: "#84cc16" }, // teal → lime
];

function pickGradient(seed: string): { from: string; via?: string; to: string } {
  return GRADIENTS[hashString(seed) % GRADIENTS.length]!;
}

/**
 * Derive 1–2 uppercase initials from a channel name. Strips `#` prefix if
 * present, splits on separators, and falls back to the first two characters.
 */
export function getChannelInitials(name: string): string {
  const cleaned = name.replace(/^#/, "").trim();
  if (!cleaned) return "?";
  const parts = cleaned.split(/[\s\-_./]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
  }
  return cleaned.slice(0, 2).toUpperCase();
}

interface ChannelAvatarProps {
  channel: Pick<Channel, "id" | "name" | "avatar">;
  /** Rendered size in px (width + height). Defaults to 32. */
  size?: number;
  /** Override border-radius. Defaults to `rounded-lg`. */
  className?: string;
  /** Decorative ring around the avatar (e.g. for sidebar active state). */
  ring?: string;
}

/**
 * Renders the channel's uploaded avatar if set, otherwise a deterministic
 * gradient + initials fallback so every channel always has a visible avatar.
 */
export function ChannelAvatar({
  channel,
  size = 32,
  className,
  ring,
}: ChannelAvatarProps): React.ReactElement {
  const gradient = pickGradient(channel.id);
  const initials = getChannelInitials(channel.name);
  const fontSize = Math.max(10, Math.round(size * 0.4));

  if (channel.avatar) {
    return (
      <img
        src={channel.avatar}
        alt={channel.name}
        style={{ width: size, height: size }}
        className={cn("shrink-0 rounded-lg object-cover", ring, className)}
      />
    );
  }

  const bg = gradient.via
    ? `linear-gradient(135deg, ${gradient.from}, ${gradient.via}, ${gradient.to})`
    : `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`;

  return (
    <div
      style={{ width: size, height: size, background: bg, fontSize }}
      className={cn(
        "flex shrink-0 select-none items-center justify-center rounded-lg font-semibold leading-none tracking-tight text-white",
        ring,
        className,
      )}
      aria-label={channel.name}
    >
      {initials}
    </div>
  );
}
