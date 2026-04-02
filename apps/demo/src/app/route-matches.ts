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
  "/openclaw/changelog",
]);

export function isFullScreenPath(pathname: string) {
  return (
    fullScreenExactPaths.has(pathname) ||
    pathname.startsWith("/openclaw/auth") ||
    pathname.startsWith("/openclaw/skill/") ||
    pathname.startsWith("/openclaw/growth-demo") ||
    fullScreenPrefixes.some((prefix) => pathname.startsWith(prefix))
  );
}
