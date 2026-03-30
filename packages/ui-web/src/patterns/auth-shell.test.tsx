import { render, screen } from "@testing-library/react";

import { expectNoA11yViolations } from "../test/a11y";
import { AuthShell } from "./auth-shell";

describe("AuthShell", () => {
  it("renders the rail and main content", () => {
    render(
      <AuthShell rail={<aside>Brand rail</aside>}>
        <div>Auth content</div>
      </AuthShell>,
    );

    expect(screen.getByText("Brand rail")).toBeInTheDocument();
    expect(screen.getByText("Auth content")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <AuthShell rail={<aside>Brand rail</aside>}>
        <form aria-label="Login form">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" />
        </form>
      </AuthShell>,
    );

    await expectNoA11yViolations(container);
  });
});
