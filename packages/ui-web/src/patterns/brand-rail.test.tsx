import { fireEvent, render, screen } from "@testing-library/react";

import { expectNoA11yViolations } from "../test/a11y";
import { BrandRail } from "./brand-rail";

describe("BrandRail", () => {
  it("renders structured brand content and handles logo clicks", () => {
    const onLogoClick = vi.fn();

    render(
      <BrandRail
        logo={<span>Nexu</span>}
        logoLabel="Open home"
        onLogoClick={onLogoClick}
        topRight={<button type="button">Language</button>}
        title={<h1>OpenClaw, ready to use.</h1>}
        description="Desktop AI that ships with the right tools already wired in."
        footer={<a href="https://github.com/refly-ai/nexu">Star us on GitHub</a>}
      >
        <p>Bring your workspace online in minutes.</p>
      </BrandRail>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open home" }));

    expect(onLogoClick).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("heading", { level: 1, name: "OpenClaw, ready to use." }),
    ).toBeInTheDocument();
    expect(screen.getByText("Bring your workspace online in minutes.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Star us on GitHub" })).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <BrandRail
        logo={<span>Nexu</span>}
        title={<h1>Brand rail</h1>}
        description="Helpful onboarding context."
      >
        <ul>
          <li>Connect your tools</li>
          <li>Keep your memory</li>
        </ul>
      </BrandRail>,
    );

    await expectNoA11yViolations(container);
  });
});
