import { BookOpen, Brain, Settings, User } from "lucide-react";
import Callout from "../../components/docs/Callout";
import { usePageTitle } from "../../hooks/usePageTitle";

const SECTIONS = [
  {
    icon: User,
    title: "Persona",
    desc: "Define how nexu communicates — tone, language, formality level, and domain expertise. Your clone adapts to match your team's culture.",
    color: "text-purple-600 bg-purple-500/10",
  },
  {
    icon: Brain,
    title: "Memory",
    desc: "nexu accumulates context over time — preferences, past decisions, team patterns, and project history. Memory is isolated per workspace and never shared.",
    color: "text-blue-600 bg-blue-500/10",
  },
  {
    icon: BookOpen,
    title: "Knowledge base",
    desc: "Upload documents, link Notion pages, or connect Google Drive. nexu uses this knowledge to produce more accurate, context-aware outputs.",
    color: "text-emerald-600 bg-emerald-500/10",
  },
  {
    icon: Settings,
    title: "Preferences",
    desc: "Set output format defaults (bullet points vs prose), language preferences, follow-up behavior, and notification rules.",
    color: "text-amber-600 bg-amber-500/10",
  },
];

export default function YourClonePage() {
  usePageTitle("Your Clone");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[20px] font-semibold text-text-primary flex items-center gap-2">
          <Brain size={18} className="text-text-muted" />
          Your Clone
        </h1>
        <p className="mt-3 text-[14px] text-text-secondary leading-relaxed max-w-2xl">
          Your clone is your personalized AI teammate. The more you customize it, the better it
          understands your team's context, style, and workflows.
        </p>
      </div>

      <div className="space-y-3 max-w-2xl">
        {SECTIONS.map((s) => (
          <div
            key={s.title}
            className="flex items-start gap-3 p-4 rounded-xl border border-border bg-surface-1"
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${s.color}`}
            >
              <s.icon size={16} />
            </div>
            <div className="min-w-0">
              <div className="text-[14px] font-semibold text-text-primary">{s.title}</div>
              <div className="text-[13px] text-text-tertiary mt-1 leading-relaxed">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-2xl">
        <h2 className="text-[16px] font-semibold text-text-primary">Why clones matter</h2>
        <p className="mt-2 text-[13px] text-text-tertiary leading-relaxed">
          Generic AI tools forget everything after each conversation. Your nexu clone remembers — it
          builds up a persistent understanding of your team over time. When someone leaves, their
          clone stays, preserving institutional knowledge for the next person.
        </p>
      </div>

      <Callout variant="tip">
        <strong>Next to you, not replacing you.</strong> nexu = Next U. Your clone augments your
        capabilities — it doesn't replace you. Think of it as a second brain that handles execution
        while you focus on decisions.
      </Callout>
    </div>
  );
}
