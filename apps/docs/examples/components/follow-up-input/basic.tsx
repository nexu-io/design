import { FollowUpInput } from "@nexu-design/ui-web";

export function FollowUpInputBasicExample() {
  return (
    <div className="w-full max-w-[560px]">
      <FollowUpInput
        placeholder="Ask a follow-up about rollout risks"
        defaultValue="Summarize the biggest launch blockers."
      />
    </div>
  );
}
