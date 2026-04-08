import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

describe("Tabs", () => {
  it("switches visible content", async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="models">
        <TabsList>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
        </TabsList>
        <TabsContent value="models">Models content</TabsContent>
        <TabsContent value="channels">Channels content</TabsContent>
      </Tabs>,
    );

    expect(screen.getByText("Models content")).toBeVisible();
    expect(screen.getByRole("tab", { name: "Models" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Channels" })).toHaveAttribute("aria-selected", "false");

    await user.click(screen.getByRole("tab", { name: "Channels" }));

    expect(screen.getByRole("tab", { name: "Channels" })).toHaveAttribute("aria-selected", "true");
  });

  it("renders compact variant triggers", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList variant="compact">
          <TabsTrigger value="a" variant="compact">
            A
          </TabsTrigger>
          <TabsTrigger value="b" variant="compact">
            B
          </TabsTrigger>
        </TabsList>
        <TabsContent value="a">A content</TabsContent>
        <TabsContent value="b">B content</TabsContent>
      </Tabs>,
    );

    const a = screen.getByRole("tab", { name: "A" });
    expect(a).toHaveAttribute("aria-selected", "true");
    expect(a.className).toContain("h-6");
  });
});
