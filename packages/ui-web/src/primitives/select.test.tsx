import { render, screen } from "@testing-library/react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

describe("Select", () => {
  it("renders trigger with placeholder", () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose a model" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="gemini">Gemini</SelectItem>
          <SelectItem value="gpt">GPT</SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Choose a model")).toBeInTheDocument();
  });
});
