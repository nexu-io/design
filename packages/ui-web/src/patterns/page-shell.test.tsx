import { render, screen } from "@testing-library/react";

import { expectNoA11yViolations } from "../test/a11y";
import { PageHeader } from "./page-header";
import { PageShell } from "./page-shell";

describe("PageShell", () => {
  it("renders content and merges className", () => {
    render(
      <PageShell data-testid="page-shell" className="bg-surface-1">
        <PageHeader title="Design system" description="Core tokens and patterns." />
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold">Typography</h2>
          <p>Body copy</p>
        </section>
      </PageShell>,
    );

    expect(screen.getByTestId("page-shell")).toHaveClass(
      "mx-auto",
      "max-w-5xl",
      "p-8",
      "bg-surface-1",
    );
    expect(screen.getByRole("heading", { level: 1, name: "Design system" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Typography" })).toBeInTheDocument();
    expect(screen.getByText("Body copy")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <PageShell>
        <PageHeader title="Design system" description="Core tokens and patterns." />
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold">Typography</h2>
          <p>Body copy</p>
        </section>
      </PageShell>,
    );

    await expectNoA11yViolations(container);
  });
});
