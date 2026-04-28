import { Button, ConversationMessage } from "@nexu-design/ui-web";

const avatar = (label: string) => (
  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-3 text-xs font-semibold text-text-primary">
    {label}
  </div>
);

export function ConversationMessageBasicExample() {
  return (
    <div className="grid w-[720px] gap-4">
      <ConversationMessage avatar={avatar("AI")} meta="Just now">
        I summarized the latest support requests and drafted the follow-up plan.
      </ConversationMessage>
      <ConversationMessage avatar={avatar("AL")} meta="1 min ago" variant="user">
        Please send the recap to the ops team and flag anything urgent.
      </ConversationMessage>
      <ConversationMessage
        avatar={avatar("AI")}
        meta="Just now"
        actions={
          <Button size="sm" variant="ghost">
            Open task
          </Button>
        }
      >
        A follow-up task was created for the billing review.
      </ConversationMessage>
    </div>
  );
}
