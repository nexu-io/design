import { render, screen } from "@testing-library/react";

import { TextLink } from "./text-link";

describe("TextLink", () => {
  it("renders as an anchor by default", () => {
    render(<TextLink href="https://example.com">Docs</TextLink>);
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "https://example.com");
  });

  it("applies variant class", () => {
    render(
      <TextLink variant="muted" href="#">
        Muted
      </TextLink>,
    );
    expect(screen.getByRole("link")).toHaveClass("text-[var(--color-text-muted)]");
  });

  it("applies size class", () => {
    render(
      <TextLink size="xs" href="#">
        Small
      </TextLink>,
    );
    expect(screen.getByRole("link")).toHaveClass("text-[11px]");
  });

  it("merges custom className", () => {
    render(
      <TextLink className="font-bold" href="#">
        Bold
      </TextLink>,
    );
    expect(screen.getByRole("link")).toHaveClass("font-bold");
  });
});
