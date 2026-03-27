import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DetailPanelCloseButton } from "./detail-panel";

describe("DetailPanelCloseButton", () => {
  it("calls onClick when activated", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<DetailPanelCloseButton onClick={handleClick} srLabel="Close details" />);

    await user.click(screen.getByRole("button", { name: "Close details" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
