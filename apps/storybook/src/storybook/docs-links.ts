const defaultDocsBaseUrl = "https://design.nexu.io";
const docsBaseUrl = (import.meta.env.STORYBOOK_DOCS_URL || defaultDocsBaseUrl).replace(/\/$/, "");

export function getDocsUrl(path: string) {
  return docsBaseUrl ? `${docsBaseUrl}${path}` : path;
}

export function docsDescription(path: string) {
  const url = getDocsUrl(path);

  return `Full documentation: [${path}](${url})`;
}
