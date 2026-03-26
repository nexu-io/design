import { render, screen } from "@testing-library/react";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "./alert";

describe("Alert", () => {
  it("renders accessible alert content", () => {
    render(
      <Alert>
        <AlertCircle aria-hidden="true" />
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>
          <p>Finish connecting Slack to continue.</p>
        </AlertDescription>
      </Alert>,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Heads up")).toBeInTheDocument();
    expect(screen.getByText("Finish connecting Slack to continue.")).toBeInTheDocument();
  });

  it("supports tone variants", () => {
    render(<Alert variant="warning">Warning</Alert>);

    expect(screen.getByRole("alert")).toHaveClass("border-warning/20");
  });
});
