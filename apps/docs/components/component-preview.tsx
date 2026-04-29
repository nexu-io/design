import type { ExampleId } from "../lib/examples";
import { getExample } from "../lib/examples";
import { ExampleRenderer } from "../lib/examples-client";
import { CodeBlock } from "./code-block";

interface ComponentPreviewProps {
  id: ExampleId;
}

export function ComponentPreview({ id }: ComponentPreviewProps) {
  const example = getExample(id);

  return (
    <section className="not-prose my-6 overflow-hidden rounded-2xl border border-border-subtle bg-card shadow-rest">
      <div className="border-b border-border-subtle px-5 py-4">
        <h3 className="m-0 text-lg font-semibold text-text-heading">{example.title}</h3>
        {example.description ? (
          <p className="mt-1 text-sm leading-6 text-text-secondary">{example.description}</p>
        ) : null}
      </div>
      <div className="grid min-h-36 place-items-center bg-surface-0 p-6 sm:p-8">
        <ExampleRenderer id={id} />
      </div>
      <CodeBlock code={example.source} title={example.filePath} variant="embedded" collapsible />
    </section>
  );
}
