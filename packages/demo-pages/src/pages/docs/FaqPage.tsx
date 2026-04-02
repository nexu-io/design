import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";
import { usePageTitle } from "../../hooks/usePageTitle";

const FAQ_ITEMS = [
  {
    q: "How is nexu different from ChatGPT or Claude?",
    a: "nexu is not a chatbot — it's a persistent AI teammate embedded in your IM. It remembers your context across sessions, learns your team's patterns, and proactively follows up.",
  },
  {
    q: "Which IM platforms are supported?",
    a: "Slack and Feishu (Lark) are fully supported today. Discord is coming soon, and Microsoft Teams is on our roadmap.",
  },
  {
    q: "How should teams get started?",
    a: "Start small: one channel, one owner, one high-value workflow. Run the 20-minute quick start. Expand once the first team validates the value.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. Your team's memory and context are isolated per workspace. We never use your data to train models. See our Privacy Policy for full details.",
  },
  {
    q: "How often is this page updated?",
    a: "The changelog is generated from recent commits and refreshed with every deployment.",
  },
  {
    q: "Can I use nexu with my own LLM?",
    a: "nexu is model-agnostic by design. The default model is Claude, but enterprise customers can connect their own LLM endpoints.",
  },
];

export default function FaqPage() {
  usePageTitle("FAQ");
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <>
      <h1 className="text-[22px] font-semibold text-text-primary flex items-center gap-2">
        <HelpCircle size={20} className="text-text-muted" />
        FAQ
      </h1>

      <section className="mt-8 space-y-1 max-w-2xl">
        {FAQ_ITEMS.map((item, idx) => {
          const id = `faq-${idx}`;
          const isOpen = openId === id;
          return (
            <div key={id} className="border border-border rounded-xl overflow-hidden bg-surface-1">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : id)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-surface-2/50 transition-colors"
              >
                <span className="text-[13px] font-medium text-text-primary">{item.q}</span>
                <ChevronDown
                  size={16}
                  className={`text-text-muted shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <div className="px-4 pb-3 pt-0">
                  <p className="text-[12px] text-text-tertiary leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </section>
    </>
  );
}
