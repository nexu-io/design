import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger,
} from "./combobox";

function TestCombobox() {
  const [value, setValue] = React.useState<string | undefined>();

  return (
    <Combobox value={value} onValueChange={setValue}>
      <ComboboxTrigger>{value ?? "Select skill"}</ComboboxTrigger>
      <ComboboxContent>
        <ComboboxInput placeholder="Search skills" />
        <div className="p-1">
          <ComboboxItem value="alpha" textValue="Alpha research">
            Alpha
          </ComboboxItem>
          <ComboboxItem value="beta" textValue="Beta ops">
            Beta
          </ComboboxItem>
          <ComboboxItem value="gamma" textValue="Gamma automation">
            Gamma
          </ComboboxItem>
        </div>
      </ComboboxContent>
    </Combobox>
  );
}

describe("Combobox", () => {
  it("filters and selects items", async () => {
    const user = userEvent.setup();

    render(<TestCombobox />);

    await user.click(screen.getByRole("button", { name: /select skill/i }));

    const input = screen.getByPlaceholderText("Search skills");
    await user.type(input, "gam");

    expect(screen.queryByText("Alpha")).not.toBeInTheDocument();
    expect(screen.getByText("Gamma")).toBeInTheDocument();

    await user.click(screen.getByText("Gamma"));

    expect(screen.getByRole("button", { name: /gamma/i })).toBeInTheDocument();
  });

  it("supports keyboard selection", async () => {
    const user = userEvent.setup();

    render(<TestCombobox />);

    await user.click(screen.getByRole("button", { name: /select skill/i }));
    await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");

    expect(screen.getByRole("button", { name: /gamma/i })).toBeInTheDocument();
  });
});
