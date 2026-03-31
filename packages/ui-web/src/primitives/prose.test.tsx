import { render, screen } from "@testing-library/react";

import { Prose } from "./prose";

describe("Prose", () => {
  it("renders children", () => {
    render(
      <Prose>
        <p>Hello world</p>
      </Prose>,
    );
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("applies default size class", () => {
    const { container } = render(<Prose>Content</Prose>);
    expect(container.firstChild).toHaveClass("text-[13px]");
  });

  it("applies compact size", () => {
    const { container } = render(<Prose size="compact">Content</Prose>);
    expect(container.firstChild).toHaveClass("text-[11px]");
  });

  it("has data-slot attribute", () => {
    const { container } = render(<Prose>Content</Prose>);
    expect(container.firstChild).toHaveAttribute("data-slot", "prose");
  });

  it("merges custom className", () => {
    const { container } = render(<Prose className="mt-4">Content</Prose>);
    expect(container.firstChild).toHaveClass("mt-4");
  });
});
