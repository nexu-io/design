import type { User } from "@/types";

/**
 * Shared user-presence mapping.
 *
 * The app standardises on three visible presence states — green `online`,
 * yellow `away` (DND collapses into the same color-wise), and gray
 * `offline`. Keep this helper as the single source of truth so every
 * surface (sidebar row, profile header, mention hover-card, etc.) ends
 * up with the same chip color and human label for any given status.
 *
 * Tokens are defined in `apps/slark/src/renderer/src/app/globals.css`
 * as `--color-nexu-online / nexu-away / nexu-offline`.
 */
export function presenceDotClass(status: User["status"]): string {
  if (status === "online") return "bg-nexu-online";
  if (status === "away" || status === "dnd") return "bg-nexu-away";
  return "bg-nexu-offline";
}

export function presenceLabel(status: User["status"]): string {
  if (status === "online") return "Online";
  if (status === "away") return "Away";
  if (status === "dnd") return "Do not disturb";
  return "Offline";
}
