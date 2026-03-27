import { fireEvent, render, screen } from "@testing-library/react";

import { ResizableHandle, SplitView } from "./split-view";

describe("ResizableHandle", () => {
  it("reports drag delta while resizing", () => {
    const handleResize = vi.fn();
    const handleResizeEnd = vi.fn();

    render(
      <SplitView>
        <div>left</div>
        <ResizableHandle onResize={handleResize} onResizeEnd={handleResizeEnd} />
        <div>right</div>
      </SplitView>,
    );

    const handle = screen.getByRole("separator");

    fireEvent.mouseDown(handle, { clientX: 100 });
    fireEvent.mouseMove(document, { clientX: 132 });
    fireEvent.mouseUp(document);

    expect(handleResize).toHaveBeenCalledWith(32);
    expect(handleResizeEnd).toHaveBeenCalled();
  });
});
