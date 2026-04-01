import { render, screen } from "@testing-library/react";

import {
  EntityCard,
  EntityCardContent,
  EntityCardDescription,
  EntityCardFooter,
  EntityCardHeader,
  EntityCardMedia,
  EntityCardMediaFallback,
  EntityCardMediaImage,
  EntityCardMeta,
  EntityCardTitle,
} from "./entity-card";

describe("EntityCard", () => {
  it("renders header, content, meta, and footer", () => {
    render(
      <EntityCard>
        <EntityCardHeader>
          <EntityCardMedia>
            <EntityCardMediaFallback>Icon</EntityCardMediaFallback>
          </EntityCardMedia>
          <div>
            <EntityCardTitle>Workflow</EntityCardTitle>
            <EntityCardDescription>Automate tasks</EntityCardDescription>
            <EntityCardMeta>3 installs</EntityCardMeta>
          </div>
        </EntityCardHeader>
        <EntityCardContent>Body</EntityCardContent>
        <EntityCardFooter>Footer</EntityCardFooter>
      </EntityCard>,
    );

    expect(screen.getByText("Workflow")).toBeInTheDocument();
    expect(screen.getByText("Automate tasks")).toBeInTheDocument();
    expect(screen.getByText("3 installs")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("renders EntityCardMediaImage with correct attributes", () => {
    render(
      <EntityCardMedia>
        <EntityCardMediaImage src="/logos/slack.svg" alt="Slack logo" />
      </EntityCardMedia>,
    );

    const img = screen.getByRole("img", { name: "Slack logo" });
    expect(img).toHaveAttribute("src", "/logos/slack.svg");
    expect(img).toHaveClass("object-contain", "p-2");
  });

  it("renders EntityCardMediaFallback with icon content", () => {
    render(
      <EntityCardMedia>
        <EntityCardMediaFallback>
          <span data-testid="icon">Z</span>
        </EntityCardMediaFallback>
      </EntityCardMedia>,
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
    const fallback = screen.getByTestId("icon").parentElement;
    expect(fallback).toBeTruthy();
    expect(fallback).toHaveClass("text-text-primary");
  });

  it("EntityCardMedia has default border and background styles", () => {
    const { container } = render(<EntityCardMedia>content</EntityCardMedia>);
    const media = container.querySelector("[data-slot='entity-card-media']");
    expect(media).toBeTruthy();
    expect(media).toHaveClass("border", "border-border-subtle", "bg-surface-0", "rounded-xl");
  });
});
