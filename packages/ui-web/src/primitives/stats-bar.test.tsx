import { fireEvent, render, screen } from "@testing-library/react";

import { StatsBar } from "./stats-bar";

describe("StatsBar", () => {
  it("renders each stat item", () => {
    render(
      <StatsBar
        items={[
          { id: "success", label: "Success rate", value: "96%", tone: "success" },
          { id: "active", label: "Active agents", value: "4", tone: "accent" },
        ]}
      />,
    );

    expect(screen.getByText((_, el) => el?.textContent === "96%")).toBeInTheDocument();
    expect(screen.getByText("Success rate")).toBeInTheDocument();
    expect(screen.getAllByText((_, el) => el?.textContent === "4")[0]).toBeInTheDocument();
    expect(screen.getByText("Active agents")).toBeInTheDocument();
  });

  it("supports interactive selected items", () => {
    const onSelect = vi.fn();

    render(
      <StatsBar
        items={[{ id: "success", label: "Success rate", value: "96%", selected: true, onSelect }]}
      />,
    );

    const button = screen.getByRole("button", { name: /96\s*%\s*success rate/i });
    fireEvent.click(button);

    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
