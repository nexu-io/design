import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { expectNoA11yViolations } from "../test/a11y";
import { FollowUpInput } from "./follow-up-input";

describe("FollowUpInput", () => {
  it("sends trimmed values and clears uncontrolled input", async () => {
    const user = userEvent.setup();
    const handleSend = vi.fn();

    render(
      <FollowUpInput
        placeholder="Ask a follow-up"
        sendLabel="Send follow-up"
        onSend={handleSend}
      />,
    );

    const textbox = screen.getByPlaceholderText("Ask a follow-up");
    await user.type(textbox, "  Review the rollout  ");
    await user.click(screen.getByRole("button", { name: "Send follow-up" }));

    expect(handleSend).toHaveBeenCalledWith("Review the rollout");
    expect(textbox).toHaveValue("");
  });

  it("submits on Enter without Shift and keeps controlled value in sync", async () => {
    const user = userEvent.setup();
    const handleSend = vi.fn();
    const handleValueChange = vi.fn();

    render(
      <FollowUpInput
        value="Need approval"
        onValueChange={handleValueChange}
        onSend={handleSend}
        sendLabel="Send follow-up"
      />,
    );

    await user.type(screen.getByRole("textbox"), "{enter}");

    expect(handleSend).toHaveBeenCalledWith("Need approval");
    expect(handleValueChange).toHaveBeenCalledWith("");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <FollowUpInput placeholder="Ask a follow-up" sendLabel="Send follow-up" />,
    );

    await expectNoA11yViolations(container);
  });
});
