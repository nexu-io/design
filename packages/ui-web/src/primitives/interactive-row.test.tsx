import { fireEvent, render, screen } from "@testing-library/react";

import {
  InteractiveRow,
  InteractiveRowContent,
  InteractiveRowLeading,
  InteractiveRowTrailing,
} from "./interactive-row";

describe("InteractiveRow", () => {
  it("renders leading, content, and trailing slots", () => {
    const onClick = vi.fn();

    render(
      <InteractiveRow onClick={onClick}>
        <InteractiveRowLeading>Lead</InteractiveRowLeading>
        <InteractiveRowContent>Main</InteractiveRowContent>
        <InteractiveRowTrailing>Trail</InteractiveRowTrailing>
      </InteractiveRow>,
    );

    fireEvent.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Lead")).toBeInTheDocument();
    expect(screen.getByText("Main")).toBeInTheDocument();
    expect(screen.getByText("Trail")).toBeInTheDocument();
  });
});
