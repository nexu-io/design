import Link from "next/link";

import { Button } from "../../../packages/ui-web/src/primitives/button";

interface StorybookLinkProps {
  href?: string;
  title?: string;
}

export function StorybookLink({ href, title }: StorybookLinkProps) {
  return (
    <div className="not-prose my-8 rounded-2xl border border-border-subtle bg-surface-1 p-5 shadow-rest">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text-heading">Open in Storybook</h2>
          <p className="mt-1 text-sm leading-6 text-text-secondary">
            {href
              ? `Review ${title ?? "this component"} state matrices and maintenance-focused stories.`
              : "No dedicated Storybook docs link is registered for this component yet."}
          </p>
        </div>
        {href ? (
          <Button asChild variant="outline">
            <Link href={href}>View state matrix</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
