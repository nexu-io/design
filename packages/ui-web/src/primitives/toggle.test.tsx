import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Toggle, ToggleGroup, ToggleGroupItem } from "./toggle";

describe("Toggle", () => {
  it("toggles pressed state", async () => {
    const user = userEvent.setup();

    render(<Toggle aria-label="Pin" />);

    const toggle = screen.getByRole("button", { name: "Pin" });
    expect(toggle).toHaveAttribute("data-state", "off");

    await user.click(toggle);

    expect(toggle).toHaveAttribute("data-state", "on");
  });

  it("updates single toggle groups", async () => {
    const user = userEvent.setup();

    render(
      <ToggleGroup type="single" defaultValue="list" aria-label="View">
        <ToggleGroupItem value="list">List</ToggleGroupItem>
        <ToggleGroupItem value="board">Board</ToggleGroupItem>
      </ToggleGroup>,
    );

    const list = screen.getByRole("radio", { name: "List" });
    const board = screen.getByRole("radio", { name: "Board" });

    expect(list).toHaveAttribute("data-state", "on");
    expect(board).toHaveAttribute("data-state", "off");

    await user.click(board);

    expect(list).toHaveAttribute("data-state", "off");
    expect(board).toHaveAttribute("data-state", "on");
  });

  it("renders compact tab group with selected state", () => {
    render(
      <ToggleGroup type="single" defaultValue="a" variant="compact" aria-label="Tabs">
        <ToggleGroupItem value="a" variant="compact">
          A
        </ToggleGroupItem>
        <ToggleGroupItem value="b" variant="compact">
          B
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    const a = screen.getByRole("radio", { name: "A" });
    expect(a).toHaveAttribute("data-state", "on");
    expect(a).toHaveClass("h-6");
  });
});
