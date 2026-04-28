import { Button, SkillMarketplaceCard } from "@nexu-design/ui-web";

export function SkillMarketplaceCardBasicExample() {
  return (
    <div className="w-[260px]">
      <SkillMarketplaceCard
        name="Web Search"
        description="Search the web for real-time information and return summarized results."
        categoryLabel="Research"
        icon={() => <span className="text-sm">WS</span>}
        footer={<Button size="sm">Install</Button>}
      />
    </div>
  );
}
