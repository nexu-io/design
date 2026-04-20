import { fireEvent, render, screen } from "@testing-library/react";

import { VoiceMessage } from "./voice-message";

describe("VoiceMessage", () => {
  it("renders duration and transcript", () => {
    render(<VoiceMessage duration="0:24" transcript="Hello from the team." />);

    expect(screen.getByText("0:24")).toBeInTheDocument();
    expect(screen.getByText(/Hello from the team/)).toBeInTheDocument();
  });

  it("exposes an accessible play button and forwards clicks", () => {
    const onPlay = vi.fn();

    render(<VoiceMessage duration="0:10" onPlay={onPlay} />);

    const button = screen.getByRole("button", { name: /play voice note/i });
    fireEvent.click(button);
    expect(onPlay).toHaveBeenCalledTimes(1);
  });
});
