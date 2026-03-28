import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { expectNoA11yViolations } from "../test/a11y";
import { FileEditor } from "./file-editor";

describe("FileEditor", () => {
  it("switches to edit mode and saves draft content", async () => {
    const user = userEvent.setup();
    const handleSave = vi.fn();

    render(
      <div className="h-[420px] w-[420px]">
        <FileEditor
          filePath="memory/context/current.md"
          initialContent="# Current sprint"
          fileType="markdown"
          lastEditedAt="10:30"
          onSave={handleSave}
        />
      </div>,
    );

    await user.click(screen.getByRole("button", { name: /edit/i }));
    const editor = screen.getByRole("textbox");
    await user.clear(editor);
    await user.type(editor, "# Updated sprint");
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(handleSave).toHaveBeenCalledWith("# Updated sprint");
    expect(screen.getByText(/saved/i)).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <div className="h-[420px] w-[420px]">
        <FileEditor
          filePath="memory/context/current.md"
          initialContent="# Current sprint"
          fileType="markdown"
        />
      </div>,
    );

    await expectNoA11yViolations(container);
  });
});
