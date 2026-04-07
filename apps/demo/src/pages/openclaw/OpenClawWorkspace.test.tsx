// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import OpenClawWorkspace from "./OpenClawWorkspace";

vi.mock("../../hooks/useGitHubStars", () => ({
  useGitHubStars: () => ({ stars: 4200, repo: "refly-ai/nexu" }),
}));

describe("OpenClawWorkspace bot manager panel", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem("nexu_channel_connected", "feishu");
    localStorage.setItem("nexu_welcome_last_shown", Date.now().toString());

    Object.defineProperty(HTMLMediaElement.prototype, "play", {
      configurable: true,
      value: vi.fn().mockResolvedValue(undefined),
    });
    Object.defineProperty(HTMLMediaElement.prototype, "pause", {
      configurable: true,
      value: vi.fn(),
    });
  });

  afterEach(cleanup);

  it("opens settings providers with anthropic selected from query params", () => {
    render(
      <MemoryRouter
        initialEntries={["/openclaw/workspace?view=settings&tab=providers&provider=anthropic"]}
      >
        <OpenClawWorkspace />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "ws.settings.title" })).toBeTruthy();
    expect(
      screen.getByRole("tab", { name: "ws.settings.tab.providers" }).getAttribute("aria-selected"),
    ).toBe("true");
    expect(screen.getAllByText("Anthropic").length).toBeGreaterThan(0);
    expect(
      screen.getByText("Claude models, strong at reasoning, coding and long context"),
    ).toBeTruthy();
    expect(screen.getByDisplayValue("https://api.anthropic.com")).toBeTruthy();
    expect(screen.getByText("ws.settings.model")).toBeTruthy();
    expect(screen.getByText("Claude Opus 4.6")).toBeTruthy();
  });

  it("shows a login guide for nexu official provider", () => {
    render(
      <MemoryRouter
        initialEntries={["/openclaw/workspace?view=settings&tab=providers&provider=nexu"]}
      >
        <OpenClawWorkspace />
      </MemoryRouter>,
    );

    expect(screen.getAllByText("nexu Official").length).toBeGreaterThan(0);
    expect(screen.getByText("ws.settings.signInDesc")).toBeTruthy();
    expect(screen.getByRole("button", { name: "ws.settings.signInBtn" })).toBeTruthy();
    expect(screen.getByText("ws.settings.model")).toBeTruthy();
    expect(screen.getByText("Claude Opus 4.6")).toBeTruthy();
  });

  it("defaults settings to the general tab and supports account state switching", () => {
    render(
      <MemoryRouter initialEntries={["/openclaw/workspace?view=settings"]}>
        <OpenClawWorkspace />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("tab", { name: "ws.settings.tab.general" }).getAttribute("aria-selected"),
    ).toBe("true");
    expect(
      screen.getByRole("tab", { name: "ws.settings.tab.providers" }).getAttribute("aria-selected"),
    ).toBe("false");
    expect(screen.getByText("ws.settings.account.title")).toBeTruthy();
    expect(screen.getByRole("switch", { name: "ws.settings.behavior.launchAtLogin" })).toBeTruthy();
    expect(screen.getByRole("switch", { name: "ws.settings.behavior.showInDock" })).toBeTruthy();
    expect(screen.getByRole("switch", { name: "ws.settings.privacy.usageAnalytics" })).toBeTruthy();
    expect(screen.getByRole("switch", { name: "ws.settings.privacy.crashReports" })).toBeTruthy();
    expect(screen.getByText("v0.2.0")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "ws.settings.account.signIn" }));

    expect(screen.getByText("ws.settings.account.connected")).toBeTruthy();
    expect(screen.getByText("ralph.wiggum@nexu.ai")).toBeTruthy();
    expect(screen.getByRole("button", { name: "ws.settings.account.signOut" })).toBeTruthy();
  });

  it("opens the usage settings tab from query params", () => {
    render(
      <MemoryRouter initialEntries={["/openclaw/workspace?view=settings&tab=usage"]}>
        <OpenClawWorkspace />
      </MemoryRouter>,
    );

    expect(screen.getByRole("tab", { name: "Usage" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByText("Usage & billing")).toBeTruthy();
    expect(screen.getByText("Current package")).toBeTruthy();
    expect(screen.getByText("Rewards credits split")).toBeTruthy();
  });

  it("opens settings from the sidebar navigation", () => {
    render(
      <MemoryRouter>
        <OpenClawWorkspace />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "ws.nav.settings" }));

    expect(screen.getByRole("heading", { name: "ws.settings.title" })).toBeTruthy();
    expect(
      screen.getByRole("tab", { name: "ws.settings.tab.general" }).getAttribute("aria-selected"),
    ).toBe("true");
  });

  it("hides the top stats cards after workspace is configured", () => {
    render(
      <MemoryRouter>
        <OpenClawWorkspace />
      </MemoryRouter>,
    );

    expect(screen.queryByText("Active channels")).toBeNull();
    expect(screen.queryByText("Total messages")).toBeNull();
    expect(screen.queryByText("Skills enabled")).toBeNull();
  });

  it("shows the GitHub star banner on the home dashboard", () => {
    render(
      <MemoryRouter>
        <OpenClawWorkspace />
      </MemoryRouter>,
    );

    expect(screen.getByText("4,200")).toBeTruthy();
    expect(
      screen
        .getAllByRole("link")
        .some((link) => link.getAttribute("href")?.includes("github.com/refly-ai/nexu")),
    ).toBe(true);
  });

  it("uses a segmented switcher for the skills source and updates selected state", () => {
    render(
      <MemoryRouter>
        <OpenClawWorkspace />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /ws\.nav\.skills/i }));

    const yoursTab = screen.getByRole("tab", { name: /ws\.skills\.yours/i });
    const exploreTab = screen.getByRole("tab", { name: /ws\.skills\.explore/i });

    expect(yoursTab.getAttribute("data-state")).toBe("active");
    expect(exploreTab.getAttribute("data-state")).toBe("inactive");

    fireEvent.click(exploreTab);

    expect(screen.getByRole("tab", { name: /ws\.skills\.yours/i }).getAttribute("data-state")).toBe(
      "inactive",
    );
    expect(
      screen.getByRole("tab", { name: /ws\.skills\.explore/i }).getAttribute("data-state"),
    ).toBe("active");
  });

  it("shows category tag filters under yours", () => {
    render(
      <MemoryRouter>
        <OpenClawWorkspace />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /ws\.nav\.skills/i }));

    expect(screen.getByRole("radio", { name: /ws\.common\.all/i })).toBeTruthy();
    expect(screen.getByRole("radio", { name: /Audio & Video/i })).toBeTruthy();
    expect(screen.getByRole("radio", { name: /Info & Content/i })).toBeTruthy();
    expect(screen.getByRole("radio", { name: /Dev & Tools/i })).toBeTruthy();
  });

  it("toggles installed skill switches from the skills grid", () => {
    render(
      <MemoryRouter>
        <OpenClawWorkspace />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /ws\.nav\.skills/i }));

    const claudeCodeSwitch = screen.getByRole("switch", { name: /Claude Code/i });

    expect(claudeCodeSwitch.getAttribute("aria-checked")).toBe("true");

    fireEvent.click(claudeCodeSwitch);
    expect(claudeCodeSwitch.getAttribute("aria-checked")).toBe("false");

    fireEvent.click(claudeCodeSwitch);
    expect(claudeCodeSwitch.getAttribute("aria-checked")).toBe("true");
  });
});
