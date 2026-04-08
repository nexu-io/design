import { CheckCircle2, ChevronDown, type LucideIcon } from "lucide-react";
import { type ReactNode, useState } from "react";

export function ChatMsg({
  from,
  name,
  children,
}: {
  from: "clone" | "user" | "other";
  name?: string;
  children: ReactNode;
}) {
  if (from === "user") {
    return (
      <div className="flex justify-end mb-2.5">
        <div className="max-w-[78%] rounded-lg rounded-br-sm bg-accent text-accent-fg px-3 py-2 text-[13px] leading-relaxed">
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-2 mb-2.5">
      <div className="w-6 h-6 rounded-full bg-clone/15 flex items-center justify-center text-xs shrink-0 mt-0.5">
        {from === "clone" ? "😊" : (name?.[0] ?? "?")}
      </div>
      <div className="flex-1 min-w-0">
        {name && from === "other" && (
          <div className="text-[11px] text-text-tertiary mb-0.5">{name}</div>
        )}
        <div className="inline-block max-w-[90%] rounded-lg rounded-bl-sm bg-surface-2 border border-border px-3 py-2 text-[13px] text-text-primary leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

export function ChatWindow({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-surface-1 border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-surface-0">
        <div className="w-5 h-5 rounded-full bg-clone/20 flex items-center justify-center text-[10px]">
          😊
        </div>
        <span className="text-xs font-medium text-text-primary">{title}</span>
        {badge && (
          <span className="text-[10px] text-text-muted bg-surface-3 px-1.5 py-0.5 rounded">
            {badge}
          </span>
        )}
        <div className="ml-auto w-2 h-2 rounded-full bg-success" />
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export function ChatDivider({ text }: { text: string }) {
  return <div className="text-center text-[11px] text-text-muted my-3">—— {text} ——</div>;
}

export function ScenarioSection({
  tag,
  tagIcon: Icon,
  title,
  desc,
  features,
  chatContent,
  reverse,
}: {
  tag: string;
  tagIcon: LucideIcon;
  title: string;
  desc: string;
  features: string[];
  chatContent: ReactNode;
  reverse?: boolean;
}) {
  const textBlock = (
    <div>
      <div className="text-xs font-medium text-clone mb-3 flex items-center gap-1.5">
        <Icon size={14} /> {tag}
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-3">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed mb-6">{desc}</p>
      <div className="space-y-3">
        {features.map((f) => (
          <div key={f} className="flex items-center gap-2.5 text-[13px] text-text-secondary">
            <CheckCircle2 size={14} className="text-clone shrink-0" /> {f}
          </div>
        ))}
      </div>
    </div>
  );

  const first = reverse ? chatContent : textBlock;
  const second = reverse ? textBlock : chatContent;

  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <div className="grid grid-cols-2 gap-16 items-center">
        <div>{first}</div>
        <div>{second}</div>
      </div>
    </section>
  );
}

export function SectionHeading({
  tag,
  title,
  desc,
}: {
  tag?: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="text-center mb-14">
      {tag && (
        <div className="text-[11px] font-semibold text-clone mb-3 tracking-widest uppercase">
          {tag}
        </div>
      )}
      <h2 className="text-2xl font-bold text-text-primary tracking-tight">{title}</h2>
      {desc && (
        <p className="text-sm text-text-tertiary mt-3 max-w-lg mx-auto leading-relaxed">{desc}</p>
      )}
    </div>
  );
}

export function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left cursor-pointer"
      >
        <span className="text-sm font-medium text-text-primary">{q}</span>
        <ChevronDown
          size={16}
          className={`text-text-tertiary shrink-0 ml-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="pb-4 text-sm text-text-secondary leading-relaxed">{a}</div>}
    </div>
  );
}
