import type { Meta, StoryObj } from "@storybook/react-vite";
import type { LucideIcon } from "lucide-react";
import { Bot, BrainCircuit, Sparkles } from "lucide-react";

import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger,
  PageHeader,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@nexu-design/ui-web";

type ModelOption = {
  badge?: string;
  cost: string;
  disabled?: boolean;
  keywords: string[];
  label: string;
  provider: "Anthropic" | "OpenAI" | "Google";
  providerIcon: LucideIcon;
  value: string;
};

const modelOptions: ModelOption[] = [
  {
    badge: "New",
    cost: "$0.003 / 1K",
    keywords: ["anthropic", "claude", "sonnet", "4"],
    label: "Claude Sonnet 4",
    provider: "Anthropic",
    providerIcon: Sparkles,
    value: "claude-sonnet-4",
  },
  {
    cost: "$0.003 / 1K",
    keywords: ["anthropic", "claude", "3.7", "sonnet"],
    label: "Claude 3.7 Sonnet",
    provider: "Anthropic",
    providerIcon: Sparkles,
    value: "claude-3-7-sonnet",
  },
  {
    cost: "$0.002 / 1K",
    keywords: ["openai", "gpt", "4.1"],
    label: "GPT-4.1",
    provider: "OpenAI",
    providerIcon: BrainCircuit,
    value: "gpt-4-1",
  },
  {
    cost: "$0.0004 / 1K",
    keywords: ["openai", "gpt", "4.1", "mini"],
    label: "GPT-4.1 mini",
    provider: "OpenAI",
    providerIcon: BrainCircuit,
    value: "gpt-4-1-mini",
  },
  {
    cost: "$0.0012 / 1K",
    keywords: ["google", "gemini", "2.5", "flash"],
    label: "Gemini 2.5 Flash",
    provider: "Google",
    providerIcon: Bot,
    value: "gemini-2-5-flash",
  },
  {
    cost: "$0.004 / 1K",
    disabled: true,
    keywords: ["google", "gemini", "1.5", "legacy"],
    label: "Gemini 1.5 Pro",
    provider: "Google",
    providerIcon: Bot,
    value: "gemini-1-5-pro",
  },
];

const providers = ["Anthropic", "OpenAI", "Google"] as const;

const groupedModelOptions = modelOptions.reduce<Record<ModelOption["provider"], ModelOption[]>>(
  (groups, option) => {
    groups[option.provider].push(option);
    return groups;
  },
  {
    Anthropic: [],
    OpenAI: [],
    Google: [],
  },
);

function ModelPickerRow({ option }: { option: ModelOption }) {
  const ProviderIcon = option.providerIcon;

  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="flex size-4 shrink-0 items-center justify-center rounded-sm bg-surface-2 text-text-secondary">
        <ProviderIcon size={14} />
      </span>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="truncate text-base font-medium text-text-primary">{option.label}</span>
        {option.badge ? (
          <Badge className="shrink-0" radius="md" size="xs" variant="accent">
            {option.badge}
          </Badge>
        ) : null}
      </div>
      <span className="shrink-0 text-xs text-text-tertiary">
        {option.provider} · {option.cost}
      </span>
    </div>
  );
}

function ModelPickerScenario() {
  return (
    <div className="space-y-8 bg-surface-0 p-8">
      <PageHeader
        title="Dense model picker baseline"
        description="Use this scenario to review compact provider/model rows before shipping dense dropdowns into host apps. Keep rows single-line, 13px label-first, and reserve the muted trailing slot for provider + cost metadata."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle>Select for short grouped lists</CardTitle>
            <p className="text-sm text-text-secondary">
              Closed-list baseline for provider settings and short model lists. Keep provider groups
              visible and avoid growing rows beyond the default dense height.
            </p>
          </CardHeader>
          <CardContent>
            <div className="w-[360px] max-w-full">
              <Select defaultOpen defaultValue="claude-sonnet-4">
                <SelectTrigger>
                  <SelectValue placeholder="Choose a model" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider, index) => (
                    <div key={provider}>
                      {index > 0 ? <SelectSeparator /> : null}
                      <SelectGroup>
                        <SelectLabel>{provider}</SelectLabel>
                        {groupedModelOptions[provider].map((option) => (
                          <SelectItem
                            key={option.value}
                            disabled={option.disabled}
                            value={option.value}
                          >
                            <ModelPickerRow option={option} />
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-2">
            <CardTitle>Combobox for searchable provider/model lists</CardTitle>
            <p className="text-sm text-text-secondary">
              Search-first baseline when users need to jump across providers, aliases, or model
              families without scanning every group label.
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[356px] w-[360px] max-w-full">
              <Combobox defaultOpen defaultValue="claude-sonnet-4">
                <ComboboxTrigger>Choose a model</ComboboxTrigger>
                <ComboboxContent>
                  <ComboboxInput placeholder="Search models" />
                  <div className="p-1">
                    {modelOptions.map((option) => (
                      <ComboboxItem
                        key={option.value}
                        disabled={option.disabled}
                        keywords={option.keywords}
                        textValue={`${option.label} ${option.provider}`}
                        value={option.value}
                      >
                        <ModelPickerRow option={option} />
                      </ComboboxItem>
                    ))}
                  </div>
                </ComboboxContent>
              </Combobox>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const meta = {
  title: "Scenarios/Model Picker",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Dense provider/model picker baseline showing when to use grouped Select vs searchable Combobox, with single-line rows, 16px provider icons, muted trailing metadata, and one optional inline badge.",
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DenseProviderModelPicker: Story = {
  name: "Dense provider/model picker",
  render: () => <ModelPickerScenario />,
};
