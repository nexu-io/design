import { render, screen } from "@testing-library/react";

import { expectNoA11yViolations } from "../test/a11y";
import { BrandLogo, ModelLogo, PlatformLogo, ProviderLogo, RuntimeLogo } from "./logo";

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

  it("resolves canonical provider aliases", () => {
    render(
      <>
        <ProviderLogo provider="google" />
        <ProviderLogo provider="qwen" />
        <ProviderLogo provider="xiaomi" />
      </>,
    );

    expect(screen.getByAltText("aistudio")).toBeInTheDocument();
    expect(screen.getByAltText("alibabacloud")).toBeInTheDocument();
    expect(screen.getByAltText("xiaomimimo")).toBeInTheDocument();
  });

  it("resolves model logos from model id patterns", () => {
    render(
      <>
        <ModelLogo model="openai/gpt-4o" />
        <ModelLogo model="claude-code" />
        <ModelLogo model="qianfan/ernie" />
      </>,
    );

    expect(screen.getByAltText("openai")).toBeInTheDocument();
    expect(screen.getByAltText("claudecode")).toBeInTheDocument();
    expect(screen.getByAltText("baiducloud")).toBeInTheDocument();
  });

  it("falls back model logo to provider then monogram", () => {
    const { rerender } = render(
      <ModelLogo model="custom-model" provider="openai" title="fallback" />,
    );

    expect(screen.getByRole("img", { name: "fallback" })).toBeInTheDocument();

    rerender(<ModelLogo model="custom-model" title="custom-model" />);
    expect(screen.getByRole("img", { name: "custom-model" })).toBeInTheDocument();
  });

  it("resolves runtime logos for supported runtimes", () => {
    render(
      <>
        <RuntimeLogo runtime="claude-code" />
        <RuntimeLogo runtime="codex" />
        <RuntimeLogo runtime="cursor" />
        <RuntimeLogo runtime="opencode" />
        <RuntimeLogo runtime="gemini-cli" />
        <RuntimeLogo runtime="openclaw" />
        <RuntimeLogo runtime="pi" />
        <RuntimeLogo runtime="hermes" />
      </>,
    );

    expect(screen.getByAltText("claude-code")).toBeInTheDocument();
    expect(screen.getByAltText("codex")).toBeInTheDocument();
    expect(screen.getByAltText("cursor")).toBeInTheDocument();
    expect(screen.getByAltText("opencode")).toBeInTheDocument();
    expect(screen.getByAltText("gemini-cli")).toBeInTheDocument();
    expect(screen.getByAltText("openclaw")).toBeInTheDocument();
    expect(screen.getByAltText("pi")).toBeInTheDocument();
    expect(screen.getByAltText("hermes")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <div>
        <ProviderLogo provider="google" title="Google" />
        <PlatformLogo platform="discord" title="Discord" />
        <BrandLogo brand="nexu" title="nexu" />
        <RuntimeLogo runtime="codex" title="Codex" />
      </div>,
    );

    await expectNoA11yViolations(container);
  });
});
