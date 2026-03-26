import { render, screen } from "@testing-library/react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";

describe("Card", () => {
  it("renders card sections", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Slack</CardTitle>
          <CardDescription>Connect your workspace</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );

    expect(screen.getByText("Slack")).toBeInTheDocument();
    expect(screen.getByText("Connect your workspace")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });
});
