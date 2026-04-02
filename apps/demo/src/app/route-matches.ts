const fullScreenPrefixes = ["/docs/"];

export function isFullScreenPath(pathname: string) {
  return fullScreenPrefixes.some((prefix) => pathname.startsWith(prefix));
}
