import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  ConversationMessage,
} from "@nexu-design/ui-web";
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
      <div className="mb-2.5">
        <ConversationMessage
          variant="user"
          bubbleClassName="bg-accent text-accent-fg px-3 py-2 text-[13px]"
        >
          {children}
        </ConversationMessage>
      </div>
    );
  }
  return (
    <div className="mb-2.5">
      <ConversationMessage
        variant="assistant"
        avatar={
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-clone/15 text-xs">
            {from === "clone" ? "😊" : (name?.[0] ?? "?")}
          </div>
        }
        bubbleClassName="bg-surface-2 px-3 py-2 text-[13px]"
        meta={name && from === "other" ? name : undefined}
      >
        {children}
      </ConversationMessage>
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
    <Collapsible open={open} onOpenChange={setOpen} className="border-b border-border">
      <CollapsibleTrigger className="flex w-full items-center justify-between py-4 text-left">
        <span className="text-sm font-medium text-text-primary">{q}</span>
        <ChevronDown
          size={16}
          className={`ml-4 shrink-0 text-text-tertiary transition-transform ${open ? "rotate-180" : ""}`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pb-4 text-sm leading-relaxed text-text-secondary">
        {a}
      </CollapsibleContent>
    </Collapsible>
  );
}
