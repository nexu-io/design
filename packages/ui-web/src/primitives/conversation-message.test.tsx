import { render, screen } from "@testing-library/react";

import { ConversationMessage } from "./conversation-message";

describe("ConversationMessage", () => {
  it("renders assistant message metadata and actions", () => {
    render(
      <ConversationMessage
        avatar={<span aria-label="avatar">AI</span>}
        meta="now"
        actions={<button type="button">Open</button>}
      >
        Hello
      </ConversationMessage>,
    );

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("AI")).toBeInTheDocument();
    expect(screen.getByText("now")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
  });

  it("renders status messages without avatar", () => {
    render(<ConversationMessage variant="status">Completed</ConversationMessage>);

    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.queryByLabelText("avatar")).not.toBeInTheDocument();
  });
});
