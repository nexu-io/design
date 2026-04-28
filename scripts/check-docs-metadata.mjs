import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const inventoryPath = "apps/docs/lib/public-api-inventory.ts";
const metadataPath = "apps/docs/lib/docs-metadata.ts";
const examplesPath = "apps/docs/lib/examples.tsx";
const storybookPath = "apps/docs/lib/storybook.ts";

const coverageFlags = ["docs", "storybook", "examples", "props"];
const coverageValues = ["complete", "planned", "missing", "not-applicable"];

const failures = [];

const inventorySource = readRepoFile(inventoryPath);
const metadataSource = readRepoFile(metadataPath);
const examplesSource = readRepoFile(examplesPath);
const storybookSource = readRepoFile(storybookPath);

const documentedDocsIds = extractSet(inventorySource, "documentedDocsIds");
const provisionalPropsIds = extractSet(inventorySource, "provisionalPropsIds", documentedDocsIds);
const mvpComponentDocsIds = extractSet(inventorySource, "mvpComponentDocsIds");
const plannedPatternDocsIds = extractSet(inventorySource, "plannedPatternDocsIds");
const componentDocs = extractComponentDocs(metadataSource);
const exampleIds = extractStringArray(examplesSource, "exampleIds");
const exampleDefinitions = new Set(extractRecordKeys(examplesSource, "examples"));
const storybookLinks = new Set(extractRecordKeys(storybookSource, "storybookLinks"));
const inventoryItems = extractInventoryItems(inventorySource);

validateUniqueIds(inventoryItems);
validateInventoryItems(inventoryItems);
validateComponentMetadata(inventoryItems);
validateExampleRegistry();
validateStorybookRegistry(inventoryItems);

if (failures.length > 0) {
  console.error("Docs metadata validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Docs metadata validation passed (${inventoryItems.length} inventory items checked).`);

function validateUniqueIds(items) {
  const seen = new Set();

  for (const item of items) {
    if (seen.has(item.id)) {
      fail(`${item.id}: duplicate public API inventory id`);
    }
    seen.add(item.id);
  }
}

function validateInventoryItems(items) {
  for (const item of items) {
    const coverage = resolveCoverage(item);

    if (!item.name) fail(`${item.id}: missing public API name`);
    if (!item.sourcePath) fail(`${item.id}: missing sourcePath`);
    if (item.sourcePath && !existsInRepo(item.sourcePath)) {
      fail(`${item.id}: sourcePath does not exist (${item.sourcePath})`);
    }
    if (item.exports.length === 0) fail(`${item.id}: missing exports list`);

    for (const flag of coverageFlags) {
      if (!coverageValues.includes(coverage[flag])) {
        fail(`${item.id}: invalid or missing coverage.${flag} (${String(coverage[flag])})`);
      }
    }

    if (item.documentable && coverage.docs !== "not-applicable" && !item.docsSlug) {
      fail(`${item.id}: documentable inventory item is missing docsSlug`);
    }

    if (coverage.docs === "complete") {
      if (!item.docsSlug) fail(`${item.id}: complete docs coverage requires docsSlug`);
      if (!componentDocs.has(item.id)) fail(`${item.id}: complete docs coverage requires metadata`);
    }

    if (coverage.storybook === "complete") {
      if (!item.storybookSlug && !item.storybookId) {
        fail(`${item.id}: complete Storybook coverage requires storybookSlug or storybook id`);
      }
      if (!existsInRepo(`apps/storybook/src/stories/${item.id}.stories.tsx`)) {
        fail(`${item.id}: complete Storybook coverage requires a matching story file`);
      }
      if (coverage.docs === "complete" && !storybookLinks.has(item.id)) {
        fail(
          `${item.id}: documented Storybook component is missing from apps/docs/lib/storybook.ts`,
        );
      }
    }

    if (coverage.examples === "complete") {
      if (item.examples.length === 0) {
        fail(`${item.id}: complete example coverage requires example ids`);
      }

      for (const exampleId of item.examples) {
        if (!exampleIds.includes(exampleId))
          fail(`${item.id}: ${exampleId} missing from exampleIds`);
        if (!exampleDefinitions.has(exampleId)) {
          fail(`${item.id}: ${exampleId} missing from examples registry`);
        }

        const expectedFile = `apps/docs/examples/components/${exampleId}.tsx`;
        if (!existsInRepo(expectedFile)) fail(`${item.id}: example file missing (${expectedFile})`);
      }
    }

    if (coverage.props === "complete") {
      const componentDoc = componentDocs.get(item.id);
      if (!componentDoc) {
        fail(`${item.id}: complete prop coverage requires metadata`);
      } else if (!componentDoc.hasProps) {
        fail(`${item.id}: complete prop coverage requires non-empty props metadata`);
      }
    }
  }
}

function validateComponentMetadata(items) {
  const inventoryIds = new Set(items.map((item) => item.id));
  const itemById = new Map(items.map((item) => [item.id, item]));

  for (const [id, componentDoc] of componentDocs) {
    const item = itemById.get(id);
    if (!inventoryIds.has(id)) fail(`${id}: component metadata is missing inventory item`);
    if (item && !item.docsSlug) fail(`${id}: component metadata item is missing docsSlug`);

    for (const exampleId of componentDoc.examples) {
      if (!exampleIds.includes(exampleId))
        fail(`${id}: metadata example ${exampleId} missing from exampleIds`);
      if (!exampleDefinitions.has(exampleId)) {
        fail(`${id}: metadata example ${exampleId} missing from examples registry`);
      }
    }
  }
}

function validateExampleRegistry() {
  const seen = new Set();

  for (const exampleId of exampleIds) {
    if (seen.has(exampleId)) fail(`${exampleId}: duplicate example id`);
    seen.add(exampleId);

    if (!exampleDefinitions.has(exampleId)) fail(`${exampleId}: missing from examples registry`);

    const expectedFile = `apps/docs/examples/components/${exampleId}.tsx`;
    if (!existsInRepo(expectedFile)) fail(`${exampleId}: example file missing (${expectedFile})`);
  }
}

function validateStorybookRegistry(items) {
  const itemById = new Map(items.map((item) => [item.id, item]));

  for (const id of storybookLinks) {
    const item = itemById.get(id);
    if (!item) fail(`${id}: Storybook docs link is missing public API inventory item`);
    if (item && resolveCoverage(item).storybook !== "complete") {
      fail(`${id}: Storybook docs link points to an item without complete Storybook coverage`);
    }
  }
}

function extractInventoryItems(source) {
  const calls = extractDefineCalls(source);

  return calls.map((call) => {
    const id = parseStringProp(call.body, "id");
    const kind = call.kind.toLowerCase();
    const storybookSlug = parseStringProp(call.body, "storybookSlug");
    const explicitSourcePath = parseStringProp(call.body, "sourcePath");
    const storybookObject = parseObjectProp(call.body, "storybook");
    const storybookId = storybookObject ? parseStringProp(storybookObject, "id") : undefined;
    const documentable = parseBooleanProp(call.body, "documentable") ?? kind !== "utility";

    return {
      id,
      kind,
      name: parseStringProp(call.body, "name"),
      status: parseStringProp(call.body, "status") ?? "stable",
      sourcePath: explicitSourcePath ?? resolveSourcePath(kind, id),
      exports: parseStringArrayProp(call.body, "exports"),
      docsSlug: parseStringProp(call.body, "docsSlug") ?? resolveDocsSlug(kind, id),
      storybookSlug,
      storybookId,
      examples: parseStringArrayProp(call.body, "examples"),
      documentable,
      coverageOverrides: parseCoverageOverrides(call.body),
    };
  });
}

function resolveCoverage(item) {
  const defaults = item.documentable
    ? {
        docs: getDocsCoverage(item),
        storybook: item.storybookSlug || item.storybookId ? "complete" : "missing",
        examples: item.examples.length > 0 ? "complete" : "planned",
        props: provisionalPropsIds.has(item.id) ? "complete" : "planned",
      }
    : {
        docs: "not-applicable",
        storybook: "not-applicable",
        examples: "not-applicable",
        props: "not-applicable",
      };

  return { ...defaults, ...item.coverageOverrides };
}

function getDocsCoverage(item) {
  if (documentedDocsIds.has(item.id)) return "complete";
  if (mvpComponentDocsIds.has(item.id) || plannedPatternDocsIds.has(item.id)) return "planned";

  return item.docsSlug ? "missing" : "not-applicable";
}

function extractDefineCalls(source) {
  const calls = [];
  const defineCall = /define(Primitive|Pattern|Utility)\(\{/g;
  let match = defineCall.exec(source);

  while (match) {
    const objectStart = source.indexOf("{", match.index);
    const objectEnd = findMatchingBrace(source, objectStart);
    calls.push({ kind: match[1], body: source.slice(objectStart, objectEnd + 1) });
    defineCall.lastIndex = objectEnd + 1;
    match = defineCall.exec(source);
  }

  return calls;
}

function extractComponentDocs(source) {
  const start = source.indexOf("const componentDocDefinitions");
  const end = source.indexOf("export const componentMetadata", start);
  const docsSource = source.slice(start, end);
  const docs = new Map();
  const entryStart = /\n\s{2}\{\n\s{4}id: "([^"]+)"/g;
  let match = entryStart.exec(docsSource);

  while (match) {
    const objectStart = docsSource.indexOf("{", match.index);
    const objectEnd = findMatchingBrace(docsSource, objectStart);
    const body = docsSource.slice(objectStart, objectEnd + 1);
    const props = parseArrayProp(body, "props");
    docs.set(match[1], {
      examples: parseStringArrayProp(body, "examples"),
      hasProps: Boolean(props && /name:\s*"[^"]+"/.test(props)),
    });
    entryStart.lastIndex = objectEnd + 1;
    match = entryStart.exec(docsSource);
  }

  return docs;
}

function extractSet(source, name, fallback) {
  const assignment = new RegExp(`const ${name} = ([^;]+);`).exec(source);
  if (!assignment) return fallback ?? new Set();

  if (!/^new\s+Set\s*\(\s*\[/.test(assignment[1].trim())) {
    const aliasedSet = new RegExp(`const ${name} = ([a-zA-Z0-9_]+);`).exec(source);
    return aliasedSet ? extractSet(source, aliasedSet[1], fallback) : (fallback ?? new Set());
  }

  const start = source.indexOf("[", assignment.index);
  const end = findMatchingBracket(source, start);
  return new Set(parseStrings(source.slice(start, end + 1)));
}

function extractStringArray(source, name) {
  const assignment = new RegExp(`const ${name} = \\[`).exec(source);
  if (!assignment) return [];

  const start = source.indexOf("[", assignment.index);
  const end = findMatchingBracket(source, start);
  return parseStrings(source.slice(start, end + 1));
}

function extractRecordKeys(source, name) {
  const assignment = new RegExp(`const ${name} = \\{`).exec(source);
  if (!assignment) return [];

  const start = source.indexOf("{", assignment.index);
  const end = findMatchingBrace(source, start);
  const body = source.slice(start + 1, end);
  const keys = [];
  const keyPattern = /(?:^|\n)\s*(?:"([^"]+)"|'([^']+)'|([a-zA-Z0-9_-]+))\s*:/g;
  let match = keyPattern.exec(body);

  while (match) {
    keys.push(match[1] ?? match[2] ?? match[3]);
    match = keyPattern.exec(body);
  }

  return keys;
}

function parseCoverageOverrides(source) {
  const coverage = parseObjectProp(source, "coverage");
  if (!coverage) return {};

  return Object.fromEntries(
    coverageFlags.flatMap((flag) => {
      const value = parseStringProp(coverage, flag);
      return value ? [[flag, value]] : [];
    }),
  );
}

function parseStringProp(source, name) {
  return new RegExp(`${name}:\\s*["']([^"']+)["']`).exec(source)?.[1];
}

function parseBooleanProp(source, name) {
  const value = new RegExp(`${name}:\\s*(true|false)`).exec(source)?.[1];
  return value ? value === "true" : undefined;
}

function parseStringArrayProp(source, name) {
  const array = parseArrayProp(source, name);
  return array ? parseStrings(array) : [];
}

function parseArrayProp(source, name) {
  const match = new RegExp(`${name}:\\s*\\[`).exec(source);
  if (!match) return undefined;

  const start = source.indexOf("[", match.index);
  const end = findMatchingBracket(source, start);
  return source.slice(start, end + 1);
}

function parseObjectProp(source, name) {
  const match = new RegExp(`${name}:\\s*\\{`).exec(source);
  if (!match) return undefined;

  const start = source.indexOf("{", match.index);
  const end = findMatchingBrace(source, start);
  return source.slice(start, end + 1);
}

function parseStrings(source) {
  return [...source.matchAll(/["']([^"']+)["']/g)].map((match) => match[1]);
}

function resolveSourcePath(kind, id) {
  if (!id) return undefined;
  if (kind === "primitive") return `packages/ui-web/src/primitives/${id}.tsx`;
  if (kind === "pattern") return `packages/ui-web/src/patterns/${id}.tsx`;
  return undefined;
}

function resolveDocsSlug(kind, id) {
  if (!id) return undefined;
  if (kind === "primitive") return `/components/${id}`;
  if (kind === "pattern") return `/patterns/${id}`;
  return undefined;
}

function findMatchingBrace(source, start) {
  return findMatchingPair(source, start, "{", "}");
}

function findMatchingBracket(source, start) {
  return findMatchingPair(source, start, "[", "]");
}

function findMatchingPair(source, start, open, close) {
  let depth = 0;
  let quote;
  let escaped = false;

  for (let index = start; index < source.length; index += 1) {
    const character = source[index];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === quote) {
        quote = undefined;
      }
      continue;
    }

    if (character === '"' || character === "'" || character === "`") {
      quote = character;
      continue;
    }

    if (character === open) depth += 1;
    if (character === close) depth -= 1;
    if (depth === 0) return index;
  }

  throw new Error(`Unable to find matching ${close} from index ${start}`);
}

function readRepoFile(filePath) {
  return readFileSync(path.join(repoRoot, filePath), "utf8");
}

function existsInRepo(filePath) {
  return existsSync(path.join(repoRoot, filePath));
}

function fail(message) {
  failures.push(message);
}
