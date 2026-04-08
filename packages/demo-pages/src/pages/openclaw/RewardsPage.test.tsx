// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import RewardsPage from "./RewardsPage";

type MockButtonProps = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  asChild?: boolean;
};

vi.mock("@nexu-design/ui-web", () => {
  return {
    Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
    Button: ({ children, onClick, asChild }: MockButtonProps) => {
      if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children);
      }

      return (
        <button type="button" onClick={onClick}>
          {children}
        </button>
      );
    },
    Dialog: ({ children, open }: { children: React.ReactNode; open?: boolean }) =>
      open ? <div>{children}</div> : null,
    DialogBody: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DialogDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
    DialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DialogTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
    InteractiveRow: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    InteractiveRowContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    InteractiveRowLeading: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    InteractiveRowTrailing: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    PageHeader: ({ title, description }: { title: string; description: string }) => (
      <header>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
    ),
    StatCard: ({ label, value, meta }: { label: string; value: string; meta: string }) => (
      <div>
        <div>{label}</div>
        <div>{value}</div>
        <div>{meta}</div>
      </div>
    ),
  };
});

describe("RewardsPage", () => {
  afterEach(() => {
    cleanup();
  });

  function renderRewardsPage() {
    render(
      <MemoryRouter>
        <RewardsPage />
      </MemoryRouter>,
    );
  }

  it("renders rewards heading and key share/task content", () => {
    renderRewardsPage();

    expect(screen.getByRole("heading", { name: "Rewards" })).toBeTruthy();
    expect(screen.getByText("Supported share channels")).toBeTruthy();
    expect(screen.getByText("小红书")).toBeTruthy();
    expect(screen.getByText("即刻")).toBeTruthy();
    expect(screen.getByText("飞书")).toBeTruthy();
    expect(screen.getAllByText("Post on 即刻").length).toBeGreaterThan(0);
  });

  it("locks social share actions after signing out", () => {
    renderRewardsPage();

    fireEvent.click(screen.getAllByRole("button", { name: "Signed out" })[0]);

    const lockedButtons = screen.getAllByRole("button", { name: "Sign in to unlock" });
    expect(lockedButtons.length).toBeGreaterThan(0);
  });

  it("opens share material flow, confirms, and claims credits", () => {
    renderRewardsPage();

    fireEvent.click(screen.getAllByRole("button", { name: "Get material" })[0]);

    expect(screen.getByText(/material pack/i)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Copy caption & continue" }));

    expect(screen.getByText(/Confirm Post on/i)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Confirm & claim credits" }));

    expect(screen.getAllByRole("button", { name: "Get material" }).length).toBe(1);
    expect(screen.getAllByText(/Available in \d days/).length).toBeGreaterThan(0);
  });
});
