// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LocaleProvider } from "../../hooks/useLocale";
import AuthShell from "./AuthShell";
import ClientWelcomePage from "./ClientWelcomePage";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("../../hooks/useGitHubStars", () => ({
  useGitHubStars: () => ({ stars: 4200, repo: "refly-ai/nexu" }),
}));

describe("ClientWelcomePage", () => {
  function renderWelcomePage() {
    render(
      <LocaleProvider>
        <MemoryRouter initialEntries={["/openclaw/welcome"]}>
          <Routes>
            <Route element={<AuthShell />}>
              <Route path="/openclaw/welcome" element={<ClientWelcomePage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </LocaleProvider>,
    );
  }

  beforeEach(() => {
    navigateMock.mockReset();
    window.localStorage.clear();
    window.localStorage.setItem("nexu_locale", "zh");
  });

  afterEach(() => {
    cleanup();
  });

  it("separates product positioning on the left from entry methods on the right", () => {
    renderWelcomePage();

    expect(screen.getByRole("heading", { name: /OpenClaw，开箱即用/i })).toBeTruthy();
    expect(screen.queryByText("你的工作 AI 客户端")).toBeNull();
    expect(
      screen.getByText(
        "nexu 让 OpenClaw 变成一个安装即可使用的完整产品。飞书文档、日历、审批等工具能力开箱可用，同时接入 Claude、GPT 等顶级模型，所有工作都在一个工作台里完成。",
      ),
    ).toBeTruthy();
    expect(screen.getByText("安装即用，无需额外配置 OpenClaw")).toBeTruthy();
    expect(screen.getByText("飞书文档、日历、审批等工具能力开箱可用")).toBeTruthy();
    expect(
      screen.getByText(
        "连接了 Claude Opus 4.6、GPT-5.4、MiniMax 2.5、GLM 5.0、Kimi K2.5 等顶级模型",
      ),
    ).toBeTruthy();
    expect(screen.getByRole("link", { name: /在 GitHub 上 Star nexu/i })).toBeTruthy();
    expect(screen.getByText("选择你的开始方式")).toBeTruthy();
    expect(screen.queryByText("开始使用")).toBeNull();
    expect(
      screen.queryByText(
        "选择一种方式开始使用 nexu。你可以使用官方账号获得完整体验，或直接连接你自己的 API Key。",
      ),
    ).toBeNull();
    expect(screen.getByRole("button", { name: /使用 nexu 账号/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /使用你自己的模型/i })).toBeTruthy();
  });

  it("uses a larger logo in the brand rail", () => {
    renderWelcomePage();

    const logoButton = screen.getAllByRole("button")[0];
    const logo = logoButton.querySelector("svg");

    expect(logo?.getAttribute("class")).toContain("h-8");
  });

  it("renders the brand rail in English when locale is set to english", () => {
    window.localStorage.setItem("nexu_locale", "en");

    renderWelcomePage();

    expect(screen.getByRole("heading", { name: /OpenClaw,\s*ready to use\./i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Star us on GitHub/i })).toBeTruthy();
  });

  it("navigates to the auth flow from the primary entry", () => {
    renderWelcomePage();

    fireEvent.click(screen.getAllByRole("button", { name: /使用 nexu 账号/i })[0]);

    expect(navigateMock).toHaveBeenCalledWith("/openclaw/auth");
  });

  it("opens workspace settings with anthropic selected from the secondary entry", () => {
    renderWelcomePage();

    fireEvent.click(screen.getAllByRole("button", { name: /使用你自己的模型/i })[0]);

    expect(navigateMock).toHaveBeenCalledWith(
      "/openclaw/workspace?view=settings&tab=providers&provider=anthropic",
    );
  });

  it("shows a language switcher on the welcome page", () => {
    renderWelcomePage();

    expect(screen.getAllByRole("button", { name: /简体中文/i }).length).toBeGreaterThan(0);
  });

  it("renders each entry icon on the same row as its title", () => {
    renderWelcomePage();

    const loginCard = screen.getAllByRole("button", { name: /使用 nexu 账号/i })[0];
    const byokCard = screen.getAllByRole("button", { name: /使用你自己的模型/i })[0];

    const loginTitleRow = within(loginCard).getByText("使用 nexu 账号").parentElement;
    const byokTitleRow = within(byokCard).getByText("使用你自己的模型").parentElement;

    expect(loginTitleRow?.querySelector("svg")).toBeTruthy();
    expect(byokTitleRow?.querySelector("svg")).toBeTruthy();
  });

  it("does not leave an empty spacer above the entry titles", () => {
    renderWelcomePage();

    const loginCard = screen.getAllByRole("button", { name: /使用 nexu 账号/i })[0];
    const byokCard = screen.getAllByRole("button", { name: /使用你自己的模型/i })[0];

    expect(loginCard.querySelector(".flex-1")).toBeNull();
    expect(byokCard.querySelector(".flex-1")).toBeNull();
  });
});
