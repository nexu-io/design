// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { LocaleProvider } from "../../hooks/useLocale";
import AuthPage from "./AuthPage";
import AuthShell from "./AuthShell";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock("../../hooks/useGitHubStars", () => ({
  useGitHubStars: () => ({ stars: 4200, repo: "refly-ai/nexu" }),
}));

describe("AuthPage", () => {
  function renderAuthPage() {
    render(
      <LocaleProvider>
        <MemoryRouter initialEntries={["/openclaw/auth"]}>
          <Routes>
            <Route element={<AuthShell />}>
              <Route path="/openclaw/auth" element={<AuthPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </LocaleProvider>,
    );
  }

  it("reuses the same positioning rail as the welcome page", () => {
    window.localStorage.clear();
    window.localStorage.setItem("nexu_locale", "zh");
    renderAuthPage();

    expect(screen.getByRole("heading", { name: /OpenClaw，开箱即用/i })).toBeTruthy();
    expect(
      screen.getByText(
        "nexu 让 OpenClaw 变成一个安装即可使用的完整产品。飞书文档、日历、审批等工具能力开箱可用，同时接入 Claude、GPT 等顶级模型，所有工作都在一个工作台里完成。",
      ),
    ).toBeTruthy();
    expect(screen.getByText("安装即用，无需额外配置 OpenClaw")).toBeTruthy();
    expect(screen.getByText("飞书文档、日历、审批等工具能力开箱可用")).toBeTruthy();
    expect(screen.getAllByRole("button", { name: /简体中文/i }).length).toBeGreaterThan(0);
  });

  it("updates auth copy when switching language", () => {
    window.localStorage.clear();
    window.localStorage.setItem("nexu_locale", "zh");
    renderAuthPage();

    fireEvent.click(screen.getAllByRole("button", { name: /简体中文/i })[0]);
    fireEvent.click(screen.getAllByRole("menuitem", { name: "English" })[0]);

    expect(screen.getAllByText("Create account").length).toBeGreaterThan(0);
    expect(screen.getByText("Continue with Google")).toBeTruthy();
    expect(screen.getByText("Terms of Service")).toBeTruthy();
  });
});
