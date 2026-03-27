import type { Meta, StoryObj } from "@storybook/react-vite";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@nexu/ui-web";

const meta = {
  title: "Primitives/Accordion",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[560px] rounded-xl border border-border bg-surface-1 p-2">
      <Accordion type="single" collapsible defaultValue="sources">
        <AccordionItem value="sources">
          <AccordionTrigger>Connected sources</AccordionTrigger>
          <AccordionContent>Slack, Linear, and HubSpot are synced.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="automation">
          <AccordionTrigger>Running automations</AccordionTrigger>
          <AccordionContent>Eight automations are active this week.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};
