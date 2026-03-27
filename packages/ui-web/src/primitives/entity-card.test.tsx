import { render, screen } from "@testing-library/react";

import {
  EntityCard,
  EntityCardContent,
  EntityCardDescription,
  EntityCardFooter,
  EntityCardHeader,
  EntityCardMedia,
  EntityCardMeta,
  EntityCardTitle,
} from "./entity-card";

describe("EntityCard", () => {
  it("renders header, content, meta, and footer", () => {
    render(
      <EntityCard>
        <EntityCardHeader>
          <EntityCardMedia>⚡</EntityCardMedia>
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
});
