import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { StatsBar } from "@nexu-design/ui-web";

const meta = {
  title: "Primitives/StatsBar",
  component: StatsBar,
  tags: ["autodocs"],
} satisfies Meta<typeof StatsBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { id: "credits", label: "Credits remaining", value: "18,420", tone: "accent" },
      { id: "success", label: "Success rate", value: "99.2%", tone: "success" },
      { id: "latency", label: "Avg. latency", value: "284ms", tone: "info" },
      { id: "alerts", label: "Open alerts", value: "3", tone: "warning" },
    ],
  },
};

export const InteractiveFilters: Story = {
  args: {
    items: [],
  },
  render: () => {
    function InteractiveStatsBar() {
      const [selectedId, setSelectedId] = useState("all");

      return (
        <StatsBar
          items={[
            {
              id: "all",
              label: "All agents",
              value: "128",
              selected: selectedId === "all",
              onSelect: () => setSelectedId("all"),
            },
            {
              id: "healthy",
              label: "Healthy",
              value: "118",
              tone: "success",
              selected: selectedId === "healthy",
              onSelect: () => setSelectedId("healthy"),
            },
            {
              id: "degraded",
              label: "Degraded",
              value: "7",
              tone: "warning",
              selected: selectedId === "degraded",
              onSelect: () => setSelectedId("degraded"),
            },
            {
              id: "offline",
              label: "Offline",
              value: "3",
              tone: "danger",
              selected: selectedId === "offline",
              onSelect: () => setSelectedId("offline"),
            },
          ]}
        />
      );
    }

    return <InteractiveStatsBar />;
  },
};
