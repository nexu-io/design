import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@nexu-design/ui-web";

export function AccordionBasicExample() {
  return (
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
  );
}
