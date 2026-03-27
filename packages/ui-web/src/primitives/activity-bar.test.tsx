import { render, screen } from "@testing-library/react";

import { ActivityBarIndicator, ActivityBarItem } from "./activity-bar";

describe("ActivityBarItem", () => {
  it("marks the active destination as current page", () => {
    render(
      <ActivityBarItem active>
        <ActivityBarIndicator />
        Inbox
      </ActivityBarItem>,
    );

    expect(screen.getByRole("button", { name: "Inbox" })).toHaveAttribute("aria-current", "page");
  });
});
