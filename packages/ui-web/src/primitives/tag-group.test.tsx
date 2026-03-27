import { render, screen } from "@testing-library/react";

import { TagGroup, TagGroupItem } from "./tag-group";

describe("TagGroup", () => {
  it("renders grouped tags with list semantics", () => {
    render(
      <TagGroup>
        <TagGroupItem variant="brand">Alpha</TagGroupItem>
        <TagGroupItem variant="default">Beta</TagGroupItem>
      </TagGroup>,
    );

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });
});
