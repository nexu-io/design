import { render, screen } from "@testing-library/react";

import { StatusDot } from "./status-dot";

describe("StatusDot", () => {
  it("renders with default neutral status", () => {
    render(<StatusDot />);
    const dot = screen.getByRole("status");
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveAttribute("aria-label", "neutral");
  });

  it("applies status variant class", () => {
    render(<StatusDot status="success" />);
    expect(screen.getByRole("status")).toHaveClass("bg-[var(--color-success)]");
  });

  it("applies size variant", () => {
    render(<StatusDot size="lg" />);
    expect(screen.getByRole("status")).toHaveClass("size-2.5");
  });

  it("supports pulse animation", () => {
    render(<StatusDot pulse />);
    expect(screen.getByRole("status")).toHaveClass("animate-pulse");
  });

  it("merges custom className", () => {
    render(<StatusDot className="ml-2" />);
    expect(screen.getByRole("status")).toHaveClass("ml-2");
  });
});
