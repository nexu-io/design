import { StatsBar } from "@nexu-design/ui-web";

export function StatsBarBasicExample() {
  return (
    <StatsBar
      items={[
        { id: "credits", label: "Credits remaining", value: "18,420", tone: "accent" },
        { id: "success", label: "Success rate", value: "99.2%", tone: "success" },
        { id: "latency", label: "Avg. latency", value: "284ms", tone: "info" },
        { id: "alerts", label: "Open alerts", value: "3", tone: "warning" },
      ]}
    />
  );
}
