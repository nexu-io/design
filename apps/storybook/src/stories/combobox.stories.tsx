import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger,
} from "@nexu-design/ui-web";

const meta = {
  title: "Primitives/Combobox",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Searchable value picker with type-ahead filtering. For simple closed lists use **Select**; for action menus use **DropdownMenu**.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="h-[320px] w-[360px]">
      <Combobox defaultOpen defaultValue="gamma">
        <ComboboxTrigger>Select skill</ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput placeholder="Search skills" />
          <div className="p-1">
            <ComboboxItem value="alpha" textValue="Alpha research">
              Alpha research
            </ComboboxItem>
            <ComboboxItem value="beta" textValue="Beta ops">
              Beta ops
            </ComboboxItem>
            <ComboboxItem value="gamma" textValue="Gamma automation">
              Gamma automation
            </ComboboxItem>
          </div>
        </ComboboxContent>
      </Combobox>
    </div>
  ),
};
