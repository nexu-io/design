import { render, screen } from "@testing-library/react";

import { ThemeRoot } from "./theme-root";

describe("ThemeRoot", () => {
  it("renders children", () => {
    render(
      <ThemeRoot>
        <button type="button">Open</button>
      </ThemeRoot>,
    );

    expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
  });

  it("applies the dark class for dark mode", () => {
    render(<ThemeRoot theme="dark">Dark content</ThemeRoot>);

    expect(screen.getByText("Dark content")).toHaveClass("dark");
    expect(screen.getByText("Dark content")).toHaveAttribute("data-theme", "dark");
  });

  it("does not apply the dark class for light mode", () => {
    render(<ThemeRoot theme="light">Light content</ThemeRoot>);

    expect(screen.getByText("Light content")).not.toHaveClass("dark");
    expect(screen.getByText("Light content")).toHaveAttribute("data-theme", "light");
  });
});
