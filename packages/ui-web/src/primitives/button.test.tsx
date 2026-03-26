import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { expectNoA11yViolations } from "../test/a11y";
import { Button } from "./button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("disables interaction while loading", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button loading onClick={handleClick}>
        Saving
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Saving" });
    expect(button).toBeDisabled();

    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Button>Save</Button>);

    await expectNoA11yViolations(container);
  });
});
