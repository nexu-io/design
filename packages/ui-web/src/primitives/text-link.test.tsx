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
    expect(screen.getByRole("link")).toHaveClass("text-sm");
  });

  it('inherits font size from the surrounding container when size="inherit"', () => {
    render(
      <TextLink size="inherit" href="#">
        Inline
      </TextLink>,
    );
    const link = screen.getByRole("link");
    expect(link).not.toHaveClass("text-sm");
    expect(link).not.toHaveClass("text-base");
    expect(link).not.toHaveClass("text-lg");
  });

  it("merges custom className", () => {
    render(
      <TextLink className="font-bold" href="#">
        Bold
      </TextLink>,
    );
    expect(screen.getByRole("link")).toHaveClass("font-bold");
  });

  it("renders ArrowUpRight when enabled", () => {
    const { container } = render(
      <TextLink href="#" showArrowUpRight>
        Open in browser
      </TextLink>,
    );

    expect(screen.getByRole("link", { name: "Open in browser" })).toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("does not render ArrowUpRight for asChild links", () => {
    const { container } = render(
      <TextLink asChild showArrowUpRight>
        <a href="https://example.com">Open in browser</a>
      </TextLink>,
    );

    expect(screen.getByRole("link", { name: "Open in browser" })).toBeInTheDocument();
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });
});
