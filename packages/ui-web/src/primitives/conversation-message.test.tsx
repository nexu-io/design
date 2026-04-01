import { render, screen } from "@testing-library/react";

import { expectNoA11yViolations } from "../test/a11y";
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

  it("renders user message with right-aligned meta", () => {
    const { container } = render(
      <ConversationMessage variant="user" meta="19:45">
        Hi there
      </ConversationMessage>,
    );

    expect(screen.getByText("Hi there")).toBeInTheDocument();
    expect(screen.getByText("19:45")).toBeInTheDocument();
    const metaEl = screen.getByText("19:45").closest("div");
    expect(metaEl).toHaveClass("text-right");
  });

  it("renders status messages without avatar", () => {
    render(<ConversationMessage variant="status">Completed</ConversationMessage>);

    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.queryByLabelText("avatar")).not.toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <ConversationMessage avatar={<span aria-label="avatar">AI</span>} meta="now">
        Accessible message
      </ConversationMessage>,
    );

    await expectNoA11yViolations(container);
  });
});
