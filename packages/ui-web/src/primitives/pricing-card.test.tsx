import { render, screen, within } from "@testing-library/react";

import { Button } from "./button";
import { PricingCard } from "./pricing-card";

describe("PricingCard", () => {
  it("renders pricing content and features", () => {
    render(
      <PricingCard
        name="Pro"
        price="$29"
        period="/ month"
        description="Best for solo operators"
        features={["50,000 credits / month", "Priority compute"]}
        footer={<Button className="w-full">Upgrade</Button>}
      />,
    );

    expect(screen.getByText("Pro")).toBeInTheDocument();
    expect(screen.getByText((_, el) => el?.textContent === "$29")).toBeInTheDocument();
    expect(screen.getByText("/ month")).toBeInTheDocument();
    expect(screen.getByText("Best for solo operators")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Upgrade" })).toBeInTheDocument();

    const list = screen.getByRole("list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(2);
  });

  it("renders featured badge when provided", () => {
    render(
      <PricingCard
        name="Team"
        price="$99"
        badge="Recommended"
        featured
        features={["Dedicated compute"]}
      />,
    );

    expect(screen.getByText("Recommended")).toBeInTheDocument();
  });
});
