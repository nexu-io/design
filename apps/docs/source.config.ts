import { pageSchema } from "fumadocs-core/source/schema";
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { z } from "zod";

const docsPageFrontmatterSchema = pageSchema.extend({
  kind: z
    .enum(["guide", "foundation", "component", "pattern", "reference", "changelog", "api"])
    .default("guide"),
  status: z.enum(["stub", "draft", "mvp", "stable", "generated"]).default("draft"),
  navTitle: z.string().optional(),
  section: z
    .enum(["guide", "foundations", "components", "patterns", "reference", "changelog"])
    .optional(),
  order: z.number().int().nonnegative().optional(),
  sourceDocs: z.array(z.string()).default([]),
  sourceFiles: z.array(z.string()).default([]),
  related: z.array(z.string()).default([]),
  componentId: z.string().optional(),
  packageName: z.enum(["@nexu-design/ui-web", "@nexu-design/tokens"]).optional(),
  import: z.string().optional(),
  storybookId: z.string().optional(),
  examples: z.array(z.string()).default([]),
  a11yStatus: z.enum(["not-reviewed", "reviewed", "tested"]).optional(),
  propsStatus: z.enum(["manual", "curated", "generated"]).optional(),
});

export const docs = defineDocs({
  dir: "content",
  docs: {
    schema: docsPageFrontmatterSchema,
  },
});

export default defineConfig();
