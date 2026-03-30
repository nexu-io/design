import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { expectNoA11yViolations } from "../test/a11y";
import { FileTree } from "./file-tree";

const TREE = [
  {
    name: "src",
    type: "folder" as const,
    children: [
      { name: "index.ts", type: "file" as const, active: true },
      { name: "styles.css", type: "file" as const, modified: true },
    ],
  },
  {
    name: "README.md",
    type: "file" as const,
    isNew: true,
  },
];

describe("FileTree", () => {
  it("renders tree content, expands folders, and reports selection", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <div className="h-96 w-72">
        <FileTree
          tree={TREE}
          rootLabel="~/workspace"
          footer={<div className="text-[10px] text-text-muted">3 files</div>}
          defaultExpandedPaths={["src"]}
          defaultSelectedPath="src/index.ts"
          onItemSelect={handleSelect}
        />
      </div>,
    );

    expect(screen.getByText("~/workspace")).toBeInTheDocument();
    expect(screen.getByText("index.ts")).toBeInTheDocument();
    expect(screen.getByText("styles.css")).toBeInTheDocument();
    expect(screen.getByText("README.md")).toBeInTheDocument();
    expect(screen.getByText("3 files")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /readme.md/i }));

    expect(handleSelect).toHaveBeenLastCalledWith(expect.objectContaining({ path: "README.md" }));

    await user.click(screen.getByRole("button", { name: /src/i }));

    expect(screen.queryByText("index.ts")).not.toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <div className="h-96 w-72">
        <FileTree tree={TREE} rootLabel="~/workspace" defaultExpandedPaths={["src"]} />
      </div>,
    );

    await expectNoA11yViolations(container);
  });
});
