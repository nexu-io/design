import { BrandLogo, ModelLogo, ProviderLogo, RuntimeLogo } from "@nexu-design/ui-web";

export function LogoBasicExample() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-surface-1 p-4 text-text-primary">
      <BrandLogo brand="nexu" size={24} title="Nexu" />
      <ProviderLogo provider="openai" size={24} title="OpenAI" />
      <ModelLogo model="openai/gpt-4.1" size={24} title="GPT-4.1" />
      <RuntimeLogo runtime="codex" size={24} title="Codex" />
    </div>
  );
}
