import { loadMetadata } from "./metadata.js";
import type { ComponentMetadataRecord, TokenMetadataRecord } from "./types.js";

export interface SearchComponentsArgs {
  query?: string;
  limit?: number;
}

export interface GetComponentArgs {
  name: string;
}

export interface GetExampleArgs {
  component?: string;
  example?: string;
}

export interface SearchTokensArgs {
  query?: string;
  category?: string;
  limit?: number;
}

export interface GetTokenArgs {
  name: string;
}

export async function searchComponents(args: SearchComponentsArgs = {}) {
  const { componentsApi } = await loadMetadata();
  const query = normalizeSearchText(args.query ?? "");
  const limit = normalizeLimit(args.limit);

  return {
    schemaVersion: componentsApi.schemaVersion,
    source: componentsApi.generatedFrom,
    query: args.query ?? "",
    count: componentsApi.components.length,
    results: componentsApi.components
      .filter((component) => (query ? componentMatches(component, query) : true))
      .slice(0, limit)
      .map(summarizeComponent),
  };
}

export async function getComponent(args: GetComponentArgs) {
  const { componentsApi } = await loadMetadata();
  const component = findComponent(componentsApi.components, args.name);

  if (!component) {
    throw new Error(`Unknown Nexu Design component: ${args.name}`);
  }

  return component;
}

export async function getComponentProps(args: GetComponentArgs) {
  const component = await getComponent(args);

  return {
    id: component.id,
    name: component.name,
    import: component.import,
    inheritedProps: component.inheritedProps,
    props: component.props ?? [],
  };
}

export async function getExample(args: GetExampleArgs = {}) {
  const { examplesApi } = await loadMetadata();
  const examples = examplesApi.examples;
  const component = normalizeIdentifier(args.component ?? "");
  const example = normalizeIdentifier(args.example ?? "");
  const exactId =
    example && component && !example.includes("/") ? `${component}/${example}` : example;

  if (exactId) {
    const found = examples.find((item) => normalizeIdentifier(item.id) === exactId);
    if (found) return found;
  }

  if (example && !component) {
    const shortNameMatches = examples.filter((item) => {
      const shortName = item.id.split("/").at(-1) ?? item.id;
      return normalizeIdentifier(shortName) === example;
    });

    if (shortNameMatches.length === 1) return shortNameMatches[0];

    if (shortNameMatches.length > 1) {
      const matches = shortNameMatches.map((item) => item.id).join(", ");
      throw new Error(
        `Ambiguous Nexu Design example: ${args.example}. Pass a full example id. Matches: ${matches}`,
      );
    }
  }

  if (component && !example) {
    const componentExamples = examples.filter(
      (item) => normalizeIdentifier(item.componentId) === component,
    );
    if (componentExamples.length > 0) {
      return {
        componentId: component,
        count: componentExamples.length,
        examples: componentExamples,
      };
    }
  }

  throw new Error("Unknown Nexu Design example. Pass an example id or component name.");
}

export async function searchTokens(args: SearchTokensArgs = {}) {
  const { tokensApi } = await loadMetadata();
  const query = normalizeSearchText(args.query ?? "");
  const category = normalizeIdentifier(args.category ?? "");
  const limit = normalizeLimit(args.limit);

  return {
    schemaVersion: tokensApi.schemaVersion,
    source: tokensApi.generatedFrom,
    query: args.query ?? "",
    category: args.category,
    count: tokensApi.tokens.length,
    results: tokensApi.tokens
      .filter((token) => (query ? tokenMatches(token, query) : true))
      .filter((token) => (category ? normalizeIdentifier(token.category ?? "") === category : true))
      .slice(0, limit),
  };
}

export async function getToken(args: GetTokenArgs) {
  const { tokensApi } = await loadMetadata();
  const token = findToken(tokensApi.tokens, args.name);

  if (!token) {
    throw new Error(`Unknown Nexu Design token: ${args.name}`);
  }

  return token;
}

function summarizeComponent(component: ComponentMetadataRecord) {
  return {
    id: component.id,
    name: component.name,
    status: component.status,
    category: component.category,
    package: component.package,
    import: component.import,
    description: component.description,
    docsUrl: component.docsUrl,
    storybookUrl: component.storybookUrl,
    examples: component.examples,
  };
}

function findComponent(components: ComponentMetadataRecord[], value: string) {
  const identifier = normalizeIdentifier(value);

  return components.find((component) => {
    const aliases = [
      component.id,
      component.name,
      component.docsUrl?.split("/").at(-1),
      ...(component.exports ?? []),
    ];

    return aliases.some((alias) => normalizeIdentifier(alias ?? "") === identifier);
  });
}

function findToken(tokens: TokenMetadataRecord[], value: string) {
  const identifier = normalizeIdentifier(value);

  return tokens.find((token) => {
    const aliases = [token.name, token.cssVar, token.resolvedValue];
    return aliases.some((alias) => normalizeIdentifier(String(alias ?? "")) === identifier);
  });
}

function componentMatches(component: ComponentMetadataRecord, query: string) {
  return [
    component.id,
    component.name,
    component.description,
    component.overview,
    component.usage,
    component.import,
    component.docsUrl,
    component.storybookId,
    ...(component.exports ?? []),
    ...(component.examples ?? []),
  ]
    .filter(Boolean)
    .some((value) => normalizeSearchText(String(value)).includes(query));
}

function tokenMatches(token: TokenMetadataRecord, query: string) {
  return [
    token.name,
    token.category,
    token.page,
    token.group,
    token.cssVar,
    token.description,
    token.usage,
    token.value,
    token.resolvedValue,
  ]
    .filter(Boolean)
    .some((value) => normalizeSearchText(String(value)).includes(query));
}

function normalizeIdentifier(value: string) {
  return value.trim().toLowerCase().replace(/^--/, "").replaceAll("_", "-");
}

function normalizeSearchText(value: string) {
  return normalizeIdentifier(value).replaceAll("/", " ");
}

function normalizeLimit(value: number | undefined) {
  if (!value || !Number.isFinite(value)) return 20;

  return Math.max(1, Math.min(100, Math.trunc(value)));
}
