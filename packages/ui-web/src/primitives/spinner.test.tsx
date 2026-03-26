import { render } from "@testing-library/react";

import { Spinner } from "./spinner";

describe("Spinner", () => {
  it("renders spinner icon", () => {
    const { container } = render(<Spinner />);

    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
