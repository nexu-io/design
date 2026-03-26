import { render, screen } from "@testing-library/react";

import { expectNoA11yViolations } from "../test/a11y";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./dialog";

describe("Dialog", () => {
  it("renders content when open", () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Connect channel</DialogTitle>
          <DialogDescription>Add credentials</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Connect channel")).toBeInTheDocument();
  });

  it("has no accessibility violations when open", async () => {
    const { container } = render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Connect channel</DialogTitle>
          <DialogDescription>Add credentials</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    await expectNoA11yViolations(container);
  });
});
