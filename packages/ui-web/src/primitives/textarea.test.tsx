import { render, screen } from "@testing-library/react";

import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("renders placeholder", () => {
    render(<Textarea placeholder="Describe workflow" />);

    expect(screen.getByPlaceholderText("Describe workflow")).toBeInTheDocument();
  });

  it("applies invalid aria state", () => {
    render(<Textarea invalid defaultValue="bad" />);

    expect(screen.getByDisplayValue("bad")).toHaveAttribute("aria-invalid", "true");
  });
});
