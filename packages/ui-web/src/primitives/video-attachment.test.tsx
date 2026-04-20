import { fireEvent, render, screen } from "@testing-library/react";

import { VideoAttachment } from "./video-attachment";

describe("VideoAttachment", () => {
  it("renders thumbnail, duration, title, and meta", () => {
    render(
      <VideoAttachment thumbnail="/thumb.jpg" duration="02:37" title="repro.mp4" meta="8.4 MB" />,
    );

    expect(screen.getByRole("img", { name: "repro.mp4" })).toBeInTheDocument();
    expect(screen.getByText("02:37")).toBeInTheDocument();
    expect(screen.getByText("repro.mp4")).toBeInTheDocument();
    expect(screen.getByText("8.4 MB")).toBeInTheDocument();
  });

  it("fires onClick", () => {
    const onClick = vi.fn();

    render(<VideoAttachment thumbnail="/x.jpg" duration="00:30" title="x" onClick={onClick} />);

    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
