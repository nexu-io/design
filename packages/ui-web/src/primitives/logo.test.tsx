import { render, screen } from "@testing-library/react";

import { expectNoA11yViolations } from "../test/a11y";
import { BrandLogo, PlatformLogo, ProviderLogo } from "./logo";

describe("logo primitives", () => {
  it("renders provider, platform, and brand logos with accessible titles", () => {
    render(
      <div>
        <ProviderLogo provider="anthropic" title="Anthropic" />
        <PlatformLogo platform="slack" title="Slack" />
        <PlatformLogo platform="whatsapp" title="WhatsApp" />
        <BrandLogo brand="github" title="GitHub" />
      </div>,
    );

    expect(screen.getByRole("img", { name: "Anthropic" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Slack" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "WhatsApp" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "GitHub" })).toBeInTheDocument();
  });

  it("falls back to a monogram for unknown providers", () => {
    render(<ProviderLogo provider="custom" title="Custom provider" />);

    expect(screen.getByRole("img", { name: "Custom provider" })).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <div>
        <ProviderLogo provider="google" title="Google" />
        <PlatformLogo platform="discord" title="Discord" />
        <BrandLogo brand="nexu" title="nexu" />
      </div>,
    );

    await expectNoA11yViolations(container);
  });
});
