import { Button, SectionHeader } from "@nexu-design/ui-web";

export function SectionHeaderBasicExample() {
  return (
    <SectionHeader
      title={<span className="text-sm font-semibold text-text-primary">Recent activity</span>}
      action={
        <Button size="sm" variant="outline">
          View all
        </Button>
      }
    />
  );
}
