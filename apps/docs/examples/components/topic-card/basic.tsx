import { TopicCard } from "@nexu-design/ui-web";

export function TopicCardBasicExample() {
  return (
    <TopicCard
      title="Billing retry storms"
      author="Alice Chen"
      status="needs-review"
      lastActivity="2 min ago"
      replies={14}
      participants={["AC", "BL", "MN"]}
      preview="Root cause looks tied to the new exponential backoff threshold for invoice syncs."
      assignee={{ name: "Coder", isAgent: true, accent: "var(--color-brand-primary)" }}
    />
  );
}
