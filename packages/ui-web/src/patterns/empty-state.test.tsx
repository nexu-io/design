import { render, screen } from "@testing-library/react";

import { Button } from "../primitives/button";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("renders title, description and action", () => {
    render(
      <EmptyState
        title="No channels yet"
        description="Connect Slack to start receiving events."
        action={<Button>Connect Slack</Button>}
      />,
    );

    expect(screen.getByText("No channels yet")).toBeInTheDocument();
    expect(screen.getByText("Connect Slack to start receiving events.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Connect Slack" })).toBeInTheDocument();
  });
});
