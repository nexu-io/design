import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Card,
  CardContent,
  FilterPills,
  FilterPillsContent,
  FilterPillsList,
  FilterPillTrigger,
} from "@nexu-design/ui-web";

const meta = {
  title: "Patterns/FilterPills",
  component: FilterPills,
  tags: ["autodocs"],
} satisfies Meta<typeof FilterPills>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <FilterPills defaultValue="plus" className="w-[420px]">
      <FilterPillsList className="mb-4">
        <FilterPillTrigger value="free">Free</FilterPillTrigger>
        <FilterPillTrigger value="plus">Plus</FilterPillTrigger>
        <FilterPillTrigger value="pro">Pro</FilterPillTrigger>
      </FilterPillsList>
      <FilterPillsContent value="free">
        <Card>
          <CardContent className="mt-0 text-base text-muted-foreground">
            Shared queue and starter credits.
          </CardContent>
        </Card>
      </FilterPillsContent>
      <FilterPillsContent value="plus">
        <Card>
          <CardContent className="mt-0 text-base text-muted-foreground">
            Solo plan with faster queue priority.
          </CardContent>
        </Card>
      </FilterPillsContent>
      <FilterPillsContent value="pro">
        <Card>
          <CardContent className="mt-0 text-base text-muted-foreground">
            Higher caps and advanced automation.
          </CardContent>
        </Card>
      </FilterPillsContent>
    </FilterPills>
  ),
};
