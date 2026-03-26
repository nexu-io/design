import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RadioGroup, RadioGroupItem } from "./radio-group";

describe("RadioGroup", () => {
  it("updates checked item", async () => {
    const user = userEvent.setup();

    render(
      <RadioGroup defaultValue="cloud">
        <RadioGroupItem value="cloud" aria-label="Cloud" />
        <RadioGroupItem value="byok" aria-label="BYOK" />
      </RadioGroup>,
    );

    const byok = screen.getByRole("radio", { name: "BYOK" });
    await user.click(byok);

    expect(byok).toHaveAttribute("data-state", "checked");
  });
});
