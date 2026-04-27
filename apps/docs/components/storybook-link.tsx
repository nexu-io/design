import Link from "next/link";

import { Button } from "../../../packages/ui-web/src/primitives/button";

import type { StorybookComponentId } from "../lib/storybook";
import { getStorybookUrl } from "../lib/storybook";

interface StorybookLinkProps {
  component: StorybookComponentId;
}

export function StorybookLink({ component }: StorybookLinkProps) {
  return (
    <div className="not-prose my-8 rounded-2xl border border-border-subtle bg-surface-1 p-5 shadow-rest">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text-heading">Open in Storybook</h2>
          <p className="mt-1 text-sm leading-6 text-text-secondary">
            Review the full state matrix and maintenance-focused stories in Storybook.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={getStorybookUrl(component)}>View state matrix</Link>
        </Button>
      </div>
    </div>
  );
}
