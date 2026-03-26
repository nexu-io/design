import { render } from "@testing-library/react";

import { Skeleton } from "./skeleton";

describe("Skeleton", () => {
  it("renders with pulse class", () => {
    const { container } = render(<Skeleton className="h-10 w-20" />);

    expect(container.firstChild).toHaveClass("animate-pulse");
  });
});
