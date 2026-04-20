import { fireEvent, render, screen } from "@testing-library/react";

import { FileAttachment } from "./file-attachment";

describe("FileAttachment", () => {
  it("renders name, meta, and fires onClick", () => {
    const onClick = vi.fn();

    render(<FileAttachment name="logs.tar.gz" meta="14 MB · archive" onClick={onClick} />);

    expect(screen.getByText("logs.tar.gz")).toBeInTheDocument();
    expect(screen.getByText("14 MB · archive")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("defaults to type=button", () => {
    render(<FileAttachment name="x.pdf" />);

    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });
});
