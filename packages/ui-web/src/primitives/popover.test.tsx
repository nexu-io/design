import { render, screen } from "@testing-library/react";

import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

describe("Popover", () => {
  it("renders content when opened by default", () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <Button>Open</Button>
        </PopoverTrigger>
        <PopoverContent>Workspace details</PopoverContent>
      </Popover>,
    );

    expect(screen.getByText("Workspace details")).toBeInTheDocument();
  });
});
