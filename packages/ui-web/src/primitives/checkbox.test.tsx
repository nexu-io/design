import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("toggles checked state", async () => {
    const user = userEvent.setup();

    render(<Checkbox aria-label="Accept terms" />);

    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(checkbox).toHaveAttribute("data-state", "unchecked");

    await user.click(checkbox);

    expect(checkbox).toHaveAttribute("data-state", "checked");
  });
});
