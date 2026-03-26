import { render } from "@testing-library/react";

import { Separator } from "./separator";

describe("Separator", () => {
  it("renders horizontal separator by default", () => {
    const { container } = render(<Separator />);

    expect(container.firstChild).toHaveClass("h-px");
  });
});
