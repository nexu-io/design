import { fireEvent, render, screen } from "@testing-library/react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";

describe("Accordion", () => {
  it("renders trigger and content", () => {
    render(
      <Accordion type="single" defaultValue="first">
        <AccordionItem value="first">
          <AccordionTrigger>Question</AccordionTrigger>
          <AccordionContent>Answer</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.getByText("Answer")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Question" }));

    expect(screen.getByRole("button", { name: "Question" })).toBeInTheDocument();
  });
});
