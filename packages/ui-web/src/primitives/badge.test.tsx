import { render, screen } from "@testing-library/react";

import { Badge } from "./badge";

describe("Badge", () => {
  it("renders content", () => {
    render(<Badge>Connected</Badge>);

    expect(screen.getByText("Connected")).toBeInTheDocument();
  });

  it("supports variants via className output", () => {
    render(<Badge variant="success">Healthy</Badge>);

    expect(screen.getByText("Healthy")).toHaveClass("bg-success");
  });
});
