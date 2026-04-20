import { render, screen } from "@testing-library/react";

import { ChatMessage, Mention } from "./chat-message";

const alice = {
  id: "u-alice",
  name: "Alice Chen",
  fallback: "AC",
};

const agent = {
  id: "a-coder",
  name: "Coder",
  fallback: "CD",
  isAgent: true,
};

describe("ChatMessage", () => {
  it("renders sender name, time, and body", () => {
    render(
      <ChatMessage sender={alice} time="09:02">
        Shipped the new FormField API.
      </ChatMessage>,
    );
    expect(screen.getByText("Alice Chen")).toBeInTheDocument();
    expect(screen.getByText("09:02")).toBeInTheDocument();
    expect(screen.getByText(/Shipped the new FormField API/)).toBeInTheDocument();
  });

  it("hides avatar and header when compact", () => {
    const { container } = render(
      <ChatMessage sender={alice} time="09:03" compact>
        follow-up
      </ChatMessage>,
    );
    expect(container.querySelector('[data-slot="chat-message"]')).toHaveAttribute("data-compact");
    expect(screen.queryByText("Alice Chen")).not.toBeInTheDocument();
  });

  it("shows Agent pill for agent senders", () => {
    render(
      <ChatMessage sender={agent} time="09:14">
        Running tests…
      </ChatMessage>,
    );
    expect(screen.getByText("Agent")).toBeInTheDocument();
  });

  it("renders leading mention pill when `mention` is provided", () => {
    render(
      <ChatMessage sender={alice} time="09:05" mention="Coder">
        please run the tests.
      </ChatMessage>,
    );
    expect(screen.getByText("@Coder")).toBeInTheDocument();
  });

  it("renders reactions and an add-reaction button when handler is provided", () => {
    render(
      <ChatMessage
        sender={alice}
        time="09:10"
        reactions={[{ emoji: "🎉", count: 2 }]}
        onAddReaction={() => {}}
      >
        merged!
      </ChatMessage>,
    );
    expect(screen.getByText("🎉")).toBeInTheDocument();
    expect(screen.getByLabelText("Add reaction")).toBeInTheDocument();
  });
});

describe("Mention", () => {
  it("renders as @name pill", () => {
    render(<Mention name="design-review" />);
    expect(screen.getByText("@design-review")).toBeInTheDocument();
  });
});
