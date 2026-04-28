import {
  Button,
  EntityCard,
  EntityCardContent,
  EntityCardDescription,
  EntityCardFooter,
  EntityCardHeader,
  EntityCardMedia,
  EntityCardMediaImage,
  EntityCardMeta,
  EntityCardTitle,
} from "@nexu-design/ui-web";

const logo =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="%23111827"/><path d="M18 32h28" stroke="%23fff" stroke-width="6" stroke-linecap="round"/><path d="M32 18v28" stroke="%2360a5fa" stroke-width="6" stroke-linecap="round"/></svg>';

export function EntityCardBasicExample() {
  return (
    <EntityCard interactive className="w-[320px]">
      <EntityCardHeader>
        <EntityCardMedia>
          <EntityCardMediaImage src={logo} alt="Relay" />
        </EntityCardMedia>
        <div>
          <EntityCardTitle>Slack Relay</EntityCardTitle>
          <EntityCardMeta className="mt-0.5">latest</EntityCardMeta>
        </div>
      </EntityCardHeader>
      <EntityCardContent>
        <EntityCardDescription>
          Route messages, trigger workflows, and manage channels from Slack.
        </EntityCardDescription>
      </EntityCardContent>
      <EntityCardFooter className="justify-end border-0 pt-0">
        <Button variant="outline" size="sm">
          Install
        </Button>
      </EntityCardFooter>
    </EntityCard>
  );
}
