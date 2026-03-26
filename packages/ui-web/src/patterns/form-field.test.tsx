import { render, screen } from "@testing-library/react";

import { Input } from "../primitives/input";
import { expectNoA11yViolations } from "../test/a11y";
import { FormField } from "./form-field";

describe("FormField", () => {
  it("wires label, description and error to the control", () => {
    render(
      <FormField label="API Key" description="Stored locally." error="Required" invalid required>
        <Input />
      </FormField>,
    );

    const input = screen.getByRole("textbox");

    expect(screen.getByText("API Key")).toBeInTheDocument();
    expect(screen.getByText("Stored locally.")).toBeInTheDocument();
    expect(screen.getByText("Required")).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Stored locally. Required");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <FormField label="API Key" description="Stored locally." required>
        <Input />
      </FormField>,
    );

    await expectNoA11yViolations(container);
  });
});
