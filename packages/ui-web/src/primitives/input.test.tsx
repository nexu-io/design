import { render, screen } from "@testing-library/react";

import { Input } from "./input";

describe("Input", () => {
  it("applies aria-invalid when invalid", () => {
    render(<Input invalid defaultValue="bad-token" />);

    expect(screen.getByDisplayValue("bad-token")).toHaveAttribute("aria-invalid", "true");
  });

  it("renders placeholder text", () => {
    render(<Input placeholder="Enter API key" />);

    expect(screen.getByPlaceholderText("Enter API key")).toBeInTheDocument();
  });
});
