import { fireEvent, render, screen } from "@testing-library/react";

import { ImageAttachment } from "./image-attachment";

describe("ImageAttachment", () => {
  it("renders the image with alt text and a caption", () => {
    render(<ImageAttachment src="https://example.com/x.png" alt="graph" caption="explanation" />);

    expect(screen.getByRole("img", { name: "graph" })).toBeInTheDocument();
    expect(screen.getByText("explanation")).toBeInTheDocument();
  });

  it("is keyboard-activatable when onSelect is provided", () => {
    const onSelect = vi.fn();

    render(<ImageAttachment src="/x.png" alt="x" onSelect={onSelect} />);

    const trigger = screen.getByRole("button");
    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledTimes(1);

    fireEvent.click(trigger);
    expect(onSelect).toHaveBeenCalledTimes(2);
  });
});
