import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@nexu-design/ui-web";

const modelOptions = {
  anthropic: [
    { label: 'Claude Sonnet 4', value: 'claude-sonnet-4' },
    { label: 'Claude 3.7 Sonnet', value: 'claude-3-7-sonnet' },
  ],
  openai: [
    { label: 'GPT-4.1', value: 'gpt-4-1' },
    { label: 'GPT-4.1 mini', value: 'gpt-4-1-mini' },
  ],
  google: [
    { label: 'Gemini 2.5 Pro', value: 'gemini-2-5-pro' },
    { label: 'Gemini 2.5 Flash', value: 'gemini-2-5-flash' },
  ],
} as const;

const meta = {
  title: "Primitives/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Form value picker for closed lists. Defaults are tuned for readability in dense pickers: 13px item text, ~36px rows, and 16px affordance icons. For action/command menus use **DropdownMenu**; for searchable lists use **Combobox**.",
      },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-72">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose a model" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="gemini">Gemini 2.5 Pro</SelectItem>
          <SelectItem value="gpt">GPT-4.1</SelectItem>
          <SelectItem value="claude">Claude Sonnet</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const ReadabilityDefaults: Story = {
  render: () => (
    <div className="w-80">
      <Select defaultValue="claude-sonnet-4">
        <SelectTrigger>
          <SelectValue placeholder="Choose a model" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Anthropic</SelectLabel>
            {modelOptions.anthropic.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>OpenAI</SelectLabel>
            {modelOptions.openai.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Google</SelectLabel>
            {modelOptions.google.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectSeparator />
          <SelectItem disabled value="legacy-model">
            Claude Instant (legacy)
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};
