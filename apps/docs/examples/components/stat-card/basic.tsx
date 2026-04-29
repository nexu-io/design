import { StatCard } from "@nexu-design/ui-web";

export function StatCardBasicExample() {
  return (
    <StatCard
      label="Monthly credits"
      value="128,400"
      meta="Compared with last 30 days"
      trend={{ label: "+4.8%", variant: "success" }}
    />
  );
}
