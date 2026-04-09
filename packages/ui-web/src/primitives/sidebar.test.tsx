import { render, screen } from "@testing-library/react";

import { NavigationMenuButton, Sidebar, SidebarSessionRow } from "./sidebar";

describe("NavigationMenuButton", () => {
  it("marks the active item as current page", () => {
    render(<NavigationMenuButton active>Workspace</NavigationMenuButton>);

    expect(screen.getByRole("button", { name: "Workspace" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("supports a compact density", () => {
    render(<NavigationMenuButton density="compact">Workspace</NavigationMenuButton>);

    expect(screen.getByRole("button", { name: "Workspace" })).toHaveClass("py-1.5");
  });
});

describe("Sidebar", () => {
  it("supports a translucent surface recipe", () => {
    const { container } = render(<Sidebar surface="translucent" aria-label="Workspace sidebar" />);

    const sidebar = container.querySelector("aside");

    expect(sidebar).toHaveAttribute("data-surface", "translucent");
    expect(sidebar).toHaveClass("supports-[backdrop-filter]:backdrop-blur-xl");
  });
});

describe("SidebarSessionRow", () => {
  it("announces its status label for assistive technology", () => {
    render(
      <SidebarSessionRow
        title="Customer onboarding flow"
        meta="Slack · 2m ago"
        status="success"
        statusLabel="Live session"
      />,
    );

    expect(screen.getByRole("button", { name: /customer onboarding flow/i })).toBeInTheDocument();
    expect(screen.getByText("Live session")).toHaveClass("sr-only");
  });
});
