import { fallbackMetadata } from "./fallback-data.js";
import type {
  ComponentsApiResponse,
  ExamplesApiResponse,
  MetadataStore,
  TokensApiResponse,
} from "./types.js";

const defaultDocsUrl = "https://design.nexu.io";
const requestTimeoutMs = 3500;

let metadataPromise: Promise<MetadataStore> | undefined;

export function getDocsBaseUrl() {
  return normalizeBaseUrl(process.env.NEXU_DESIGN_DOCS_URL ?? defaultDocsUrl);
}

export function resetMetadataCache() {
  metadataPromise = undefined;
}

export async function loadMetadata(): Promise<MetadataStore> {
  metadataPromise ??= loadRemoteMetadata().catch(() => fallbackMetadata);

  return metadataPromise;
}

async function loadRemoteMetadata(): Promise<MetadataStore> {
  const baseUrl = getDocsBaseUrl();
  const [componentsApi, examplesApi, tokensApi] = await Promise.all([
    fetchJson<ComponentsApiResponse>(baseUrl, "api/components.json"),
    fetchJson<ExamplesApiResponse>(baseUrl, "api/examples.json"),
    fetchJson<TokensApiResponse>(baseUrl, "api/tokens.json"),
  ]);

  if (!Array.isArray(componentsApi.components)) {
    throw new Error("Invalid Nexu Design components metadata response.");
  }

  if (!Array.isArray(examplesApi.examples)) {
    throw new Error("Invalid Nexu Design examples metadata response.");
  }

  if (!Array.isArray(tokensApi.tokens)) {
    throw new Error("Invalid Nexu Design tokens metadata response.");
  }

  return { componentsApi, examplesApi, tokensApi };
}

async function fetchJson<T>(baseUrl: string, pathname: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const response = await fetch(new URL(pathname, baseUrl), {
      headers: { accept: "application/json" },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Nexu Design docs API returned HTTP ${response.status} for ${pathname}.`);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeBaseUrl(value: string) {
  return value.endsWith("/") ? value : `${value}/`;
}
