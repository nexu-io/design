// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LocaleProvider } from "../hooks/useLocale";
import LanguageSwitcher from "./LanguageSwitcher";

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem("nexu_locale", "zh");
  });

  afterEach(() => {
    cleanup();
  });

  it("shows the current language as a single trigger and reveals menu options on click", () => {
    render(
      <LocaleProvider>
        <LanguageSwitcher variant="dark" />
      </LocaleProvider>,
    );

    const trigger = screen.getByRole("button", { name: /简体中文/i });
    expect(trigger).toBeTruthy();

    fireEvent.click(trigger);

    expect(screen.getByRole("menuitem", { name: "English" })).toBeTruthy();
    expect(screen.getAllByRole("menuitem", { name: /简体中文/i }).length).toBeGreaterThan(0);
  });

  it("switches locale after choosing an option from the dropdown", () => {
    render(
      <LocaleProvider>
        <LanguageSwitcher variant="dark" />
      </LocaleProvider>,
    );

    fireEvent.click(screen.getAllByRole("button", { name: /简体中文/i })[0]);
    fireEvent.click(screen.getByRole("menuitem", { name: "English" }));

    expect(screen.getByRole("button", { name: "English" })).toBeTruthy();
    expect(screen.queryByRole("menuitem", { name: /简体中文/i })).toBeNull();
  });
});
