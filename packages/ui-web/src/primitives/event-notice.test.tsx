import { render, screen } from "@testing-library/react";

import { EventNotice } from "./event-notice";

describe("EventNotice", () => {
  it("renders text content", () => {
    render(<EventNotice>Bob Li joined #backend-platform</EventNotice>);
    expect(screen.getByText("Bob Li joined #backend-platform")).toBeInTheDocument();
  });

  it("includes flanking hairlines by default and omits them when plain", () => {
    const { container, rerender } = render(<EventNotice>content</EventNotice>);
    expect(container.querySelectorAll("[aria-hidden]").length).toBeGreaterThanOrEqual(2);

    rerender(<EventNotice plain>content</EventNotice>);
    expect(container.querySelectorAll("[aria-hidden]").length).toBe(0);
  });
});
