import { render, screen } from "@testing-library/react";

import { NavigationMenuButton } from "./sidebar";

describe("NavigationMenuButton", () => {
  it("marks the active item as current page", () => {
    render(<NavigationMenuButton active>Workspace</NavigationMenuButton>);

    expect(screen.getByRole("button", { name: "Workspace" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
