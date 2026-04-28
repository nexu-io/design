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
    keywords: ["anthropic", "sonnet"],
    label: "Claude Sonnet 4",
    textValue: "Claude Sonnet 4 Anthropic",
    value: "claude-sonnet-4",
  },
  {
    keywords: ["anthropic", "3.7"],
    label: "Claude 3.7 Sonnet",
    textValue: "Claude 3.7 Sonnet Anthropic",
    value: "claude-3-7-sonnet",
  },
  {
    keywords: ["openai", "gpt"],
    label: "GPT-4.1",
    textValue: "GPT-4.1 OpenAI",
    value: "gpt-4-1",
  },
  {
    keywords: ["openai", "mini"],
    label: "GPT-4.1 mini",
    textValue: "GPT-4.1 mini OpenAI",
    value: "gpt-4-1-mini",
  },
  {
    keywords: ["google", "gemini"],
    label: "Gemini 2.5 Pro",
    textValue: "Gemini 2.5 Pro Google",
    value: "gemini-2-5-pro",
  },
  {
    keywords: ["google", "flash"],
    label: "Gemini 2.5 Flash",
    textValue: "Gemini 2.5 Flash Google",
    value: "gemini-2-5-flash",
  },
];

export function ComboboxBasicExample() {
  return (
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
  );
}
