import { render, screen } from "@testing-library/react";

import { TopicCard } from "./topic-card";

describe("TopicCard", () => {
  it("renders title, author, last activity, and reply count", () => {
    render(
      <TopicCard
        title="Billing retry storms"
        author="Alice Chen"
        lastActivity="2 min ago"
        replies={14}
        participants={["AC", "BL"]}
      />,
    );
    expect(screen.getByText("Billing retry storms")).toBeInTheDocument();
    expect(screen.getByText("Alice Chen")).toBeInTheDocument();
    expect(screen.getByText("2 min ago", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("14")).toBeInTheDocument();
  });

  it("shows the correct label for each status", () => {
    const { rerender } = render(
      <TopicCard
        title="t"
        author="a"
        lastActivity="now"
        replies={0}
        participants={[]}
        status="needs-review"
      />,
    );
    expect(screen.getByText("Needs review")).toBeInTheDocument();

    rerender(
      <TopicCard
        title="t"
        author="a"
        lastActivity="now"
        replies={0}
        participants={[]}
        status="archived"
      />,
    );
    expect(screen.getByText("Archived")).toBeInTheDocument();
  });

  it("shows preview text when provided", () => {
    render(
      <TopicCard
        title="t"
        author="a"
        lastActivity="now"
        replies={0}
        participants={[]}
        preview="Root cause looks like the new backoff config."
      />,
    );
    expect(screen.getByText(/Root cause looks like/)).toBeInTheDocument();
  });

  it("collapses participants beyond 5 into a +N counter", () => {
    render(
      <TopicCard
        title="t"
        author="a"
        lastActivity="now"
        replies={0}
        participants={["AC", "BL", "CD", "DE", "EF", "FG", "GH"]}
      />,
    );
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("renders the assignee when provided", () => {
    render(
      <TopicCard
        title="t"
        author="a"
        lastActivity="now"
        replies={0}
        participants={[]}
        assignee={{ name: "Coder", isAgent: true }}
      />,
    );
    expect(screen.getByText("Coder")).toBeInTheDocument();
  });
});
