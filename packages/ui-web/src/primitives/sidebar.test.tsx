import { render, screen } from "@testing-library/react";

import { NavigationMenuButton, Sidebar } from "./sidebar";

describe("NavigationMenuButton", () => {
  it("marks the active item as current page", () => {
    render(<NavigationMenuButton active>Workspace</NavigationMenuButton>);

    expect(screen.getByRole("button", { name: "Workspace" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("uses the current sidebar button spacing recipe", () => {
    render(<NavigationMenuButton>Workspace</NavigationMenuButton>);

    expect(screen.getByRole("button", { name: "Workspace" })).toHaveClass(
      "mt-0.5",
      "px-2.5",
      "py-[7px]",
    );
  });
});

describe("Sidebar", () => {
  it("renders the base sidebar shell", () => {
    const { container } = render(<Sidebar aria-label="Workspace sidebar" />);

    const sidebar = container.querySelector("aside");

    expect(sidebar).toHaveAttribute("data-slot", "sidebar");
    expect(sidebar).toHaveAttribute("aria-label", "Workspace sidebar");
    expect(sidebar).toHaveClass("border-r", "bg-surface-1");
  });
});
