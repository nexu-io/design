/** Paths that render without the design-system chrome (matches apps/cloud-demo). */
const fullScreenPrefixes = ["/docs/"];

const fullScreenExactPaths = new Set([
  "/openclaw/workspace",
  "/openclaw/welcome",
  "/openclaw/invite",
  "/openclaw/onboarding",
  "/openclaw/whatsapp-qr",
  "/openclaw/privacy",
  "/openclaw/terms",
  "/openclaw/channels",
  "/openclaw/skills",
  "/openclaw/pricing",
  "/openclaw/usage",
  "/openclaw/rewards",
  "/openclaw/changelog",
]);

export function isFullScreenPath(pathname: string) {
  return (
    fullScreenExactPaths.has(pathname) ||
    pathname.startsWith("/openclaw/auth") ||
    pathname.startsWith("/openclaw/changelog/") ||
    pathname.startsWith("/openclaw/skill/") ||
    pathname.startsWith("/openclaw/growth-demo") ||
    pathname.startsWith("/openclaw/growth-ops-dashboard") ||
    fullScreenPrefixes.some((prefix) => pathname.startsWith(prefix))
  );
}

/** Shell-only cloud marketing entry (no design-system sidebar). */
export function isCloudShellPath(pathname: string) {
  return pathname === "/openclaw" || pathname === "/growth-landing";
}
