import { fireEvent, render, screen } from "@testing-library/react";

import { VoiceMessage } from "./voice-message";

describe("VoiceMessage", () => {
  it("renders duration but hides transcript by default", () => {
    render(<VoiceMessage duration="0:24" transcript="Hello from the team." />);

    expect(screen.getByText("0:24")).toBeInTheDocument();
    expect(screen.queryByText(/Hello from the team/)).not.toBeInTheDocument();
  });

  it("reveals transcript when the toggle is clicked", () => {
    render(<VoiceMessage duration="0:24" transcript="Hello from the team." />);

    const toggle = screen.getByRole("button", { name: /show transcript/i });
    fireEvent.click(toggle);

    expect(screen.getByText(/Hello from the team/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /hide transcript/i })).toBeInTheDocument();
  });

  it("starts expanded when defaultTranscriptOpen is true", () => {
    render(
      <VoiceMessage duration="0:24" transcript="Hello from the team." defaultTranscriptOpen />,
    );

    expect(screen.getByText(/Hello from the team/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /hide transcript/i })).toBeInTheDocument();
  });

  it("omits the transcript toggle entirely when no transcript is provided", () => {
    render(<VoiceMessage duration="0:10" />);

    expect(screen.queryByRole("button", { name: /transcript/i })).not.toBeInTheDocument();
  });

  it("exposes an accessible play button and forwards clicks", () => {
    const onPlay = vi.fn();

    render(<VoiceMessage duration="0:10" onPlay={onPlay} />);

    const button = screen.getByRole("button", { name: /play voice note/i });
    fireEvent.click(button);
    expect(onPlay).toHaveBeenCalledTimes(1);
  });
});
