import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger,
} from "@nexu-design/ui-web";

const pickerItems: Array<{
  keywords: string[];
  label: string;
  textValue: string;
  value: string;
}> = [
  {
    keywords: ['anthropic', 'sonnet'],
    label: 'Claude Sonnet 4',
    textValue: 'Claude Sonnet 4 Anthropic',
    value: 'claude-sonnet-4',
  },
  {
    keywords: ['anthropic', '3.7'],
    label: 'Claude 3.7 Sonnet',
    textValue: 'Claude 3.7 Sonnet Anthropic',
    value: 'claude-3-7-sonnet',
  },
  {
    keywords: ['openai', 'gpt'],
    label: 'GPT-4.1',
    textValue: 'GPT-4.1 OpenAI',
    value: 'gpt-4-1',
  },
  {
    keywords: ['openai', 'mini'],
    label: 'GPT-4.1 mini',
    textValue: 'GPT-4.1 mini OpenAI',
    value: 'gpt-4-1-mini',
  },
  {
    keywords: ['google', 'gemini'],
    label: 'Gemini 2.5 Pro',
    textValue: 'Gemini 2.5 Pro Google',
    value: 'gemini-2-5-pro',
  },
  {
    keywords: ['google', 'flash'],
    label: 'Gemini 2.5 Flash',
    textValue: 'Gemini 2.5 Flash Google',
    value: 'gemini-2-5-flash',
  },
];

const meta = {
  title: "Primitives/Combobox",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Searchable value picker with type-ahead filtering. Defaults are tuned to match Select readability: 13px input/item text, ~36px option rows, and 16px affordance icons. For simple closed lists use **Select**; for action menus use **DropdownMenu**.",
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

export const ReadabilityDefaults: Story = {
  render: () => (
    <div className="h-[360px] w-[360px]">
      <Combobox defaultOpen defaultValue="claude-sonnet-4">
        <ComboboxTrigger>Choose a model</ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput placeholder="Search model or provider" />
          <div className="p-1">
            {pickerItems.map((item) => (
              <ComboboxItem
                key={item.value}
                keywords={item.keywords}
                textValue={item.textValue}
                value={item.value}
              >
                {item.label}
              </ComboboxItem>
            ))}
          </div>
        </ComboboxContent>
      </Combobox>
    </div>
  ),
};
