import type { Meta, StoryObj } from "@storybook/react";

import { Button, FormField, Input, SettingsSection } from "@nexu/ui-web";

const meta = {
  title: "Patterns/SettingsSection",
  component: SettingsSection,
  tags: ["autodocs"],
  args: {
    title: "Settings",
    children: null,
  },
} satisfies Meta<typeof SettingsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[640px]">
      <SettingsSection
        title="API Key"
        description="Use a project-scoped key for server calls."
        action={<Button size="sm">Rotate</Button>}
      >
        <FormField label="Key" description="Stored encrypted at rest.">
          <Input value="sk_live_xxx" readOnly />
        </FormField>
      </SettingsSection>
    </div>
  ),
};
