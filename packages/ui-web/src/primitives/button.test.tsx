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

  it("keeps outline buttons visible on hover", () => {
    render(<Button variant="outline">Cancel</Button>);

    const button = screen.getByRole("button", { name: "Cancel" });

    expect(button).toHaveClass("border-input");
    expect(button).toHaveClass("hover:border-foreground/15");
    expect(button).toHaveClass("hover:bg-foreground/[0.03]");
    expect(button).toHaveClass("hover:text-foreground");
  });

  it("keeps ghost buttons on surface hover states", () => {
    render(<Button variant="ghost">More</Button>);

    const button = screen.getByRole("button", { name: "More" });

    expect(button).toHaveClass("text-[var(--color-text-muted)]");
    expect(button).toHaveClass("hover:bg-surface-2");
    expect(button).toHaveClass("hover:text-[var(--color-text-secondary)]");
  });
});
