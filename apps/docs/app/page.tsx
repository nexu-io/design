import Link from "next/link";

import { DocsHeader } from "../components/docs-shell";
import { HomeCards } from "../lib/docs";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <DocsHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <section className="max-w-3xl">
          <p className="mb-5 inline-flex rounded-full bg-brand-subtle px-3 py-1 text-sm font-semibold text-brand-primary">
            Phase 0 shell
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-text-heading sm:text-6xl">
            Product-grade docs for Nexu Design.
          </h1>
          <p className="mt-6 text-lg leading-8 text-text-secondary">
            A dedicated documentation portal for installation, tokens, components, examples,
            accessibility notes, and API references while Storybook remains the component QA
            workspace.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/guide/introduction"
              className="inline-flex h-12 items-center rounded-xl bg-accent px-6 text-lg font-semibold text-accent-foreground shadow-sm hover:bg-accent/90"
            >
              Start reading
            </Link>
            <Link
              href="/components/button"
              className="inline-flex h-12 items-center rounded-xl border border-input bg-foreground/[0.03] px-6 text-lg font-semibold text-foreground hover:bg-foreground/[0.06]"
            >
              Explore components
            </Link>
          </div>
        </section>
        <section className="mt-16" aria-label="Documentation entry points">
          <HomeCards />
        </section>
      </main>
    </div>
  );
}
