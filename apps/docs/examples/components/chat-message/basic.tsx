import { Button, ChatMessage } from "@nexu-design/ui-web";

const sender = {
  id: "agent-1",
  name: "Nexu Copilot",
  fallback: "NC",
  isAgent: true,
  accent: "var(--color-brand-primary)",
  role: "Support agent",
};

export function ChatMessageBasicExample() {
  return (
    <div className="w-full max-w-[640px] rounded-xl border border-border bg-surface-1 py-2">
      <ChatMessage
        sender={sender}
        time="09:24"
        mention="ops"
        highlighted
        reactions={[
          { emoji: "✅", count: 3, reacted: true },
          { emoji: "👀", count: 1 },
        ]}
        rowActions={
          <Button size="sm" variant="ghost">
            Reply
          </Button>
        }
      >
        The refund rule is live. I also added a fallback path for invoices above $2,500.
      </ChatMessage>
    </div>
  );
}
