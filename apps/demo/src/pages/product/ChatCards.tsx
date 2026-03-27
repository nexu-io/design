import { Badge, Button, ConversationMessage, ConversationMessageStatusIcon } from "@nexu-design/ui-web";
import {
  Brain,
  ChevronRight,
  Clock,
  Crown,
  ExternalLink,
  FileText,
  Minus,
  Plus,
  Users,
  Wrench,
} from "lucide-react";
import type { CardStatus, CardType, ChatCard } from "./sessionsData";

export type CardActionType = "openFile" | "navigate" | "showPricing";

export interface CardAction {
  type: CardActionType;
  payload: string;
}

export interface ChatCardGroupProps {
  cards: ChatCard[];
  onCardAction?: (action: CardAction) => void;
  interactive?: boolean;
}

function resolveCardAction(card: ChatCard): CardAction | null {
  switch (card.type) {
    case "file":
    case "memory":
      return card.path ? { type: "openFile", payload: card.path } : null;
    case "skill":
      return { type: "navigate", payload: "/app/skills" };
    case "automation":
      return card.path
        ? { type: "openFile", payload: card.path }
        : { type: "navigate", payload: "/app/automation" };
    case "collaboration":
      return { type: "navigate", payload: "/app/team" };
    case "upgrade":
      return { type: "showPricing", payload: "" };
    default:
      return null;
  }
}

const CARD_CONFIG: Record<
  CardType,
  {
    icon: typeof FileText;
    label: string;
    accent: string;
    border: string;
    iconBg: string;
  }
> = {
  file: {
    icon: FileText,
    label: "文件",
    accent: "text-emerald-400",
    border: "border-l-emerald-500/60",
    iconBg: "bg-emerald-500/10",
  },
  memory: {
    icon: Brain,
    label: "记忆",
    accent: "text-violet-400",
    border: "border-l-violet-500/60",
    iconBg: "bg-violet-500/10",
  },
  skill: {
    icon: Wrench,
    label: "技能",
    accent: "text-amber-400",
    border: "border-l-amber-500/60",
    iconBg: "bg-amber-500/10",
  },
  automation: {
    icon: Clock,
    label: "自动化",
    accent: "text-blue-400",
    border: "border-l-blue-500/60",
    iconBg: "bg-blue-500/10",
  },
  collaboration: {
    icon: Users,
    label: "协作",
    accent: "text-cyan-400",
    border: "border-l-cyan-500/60",
    iconBg: "bg-cyan-500/10",
  },
  upgrade: {
    icon: Crown,
    label: "升级",
    accent: "text-orange-400",
    border: "border-l-orange-500/60",
    iconBg: "bg-orange-500/10",
  },
};

const STATUS_CONFIG: Record<CardStatus, { label: string; dot: string; bg: string }> = {
  success: { label: "完成", dot: "bg-emerald-400", bg: "bg-emerald-500/10 text-emerald-400" },
  running: {
    label: "执行中",
    dot: "bg-blue-400 animate-pulse",
    bg: "bg-blue-500/10 text-blue-400",
  },
  warning: { label: "注意", dot: "bg-amber-400", bg: "bg-amber-500/10 text-amber-400" },
  info: { label: "信息", dot: "bg-slate-400", bg: "bg-slate-500/10 text-slate-400" },
  locked: { label: "锁定", dot: "bg-orange-400", bg: "bg-orange-500/10 text-orange-400" },
};

function CardItem({
  card,
  onCardAction,
  interactive = false,
}: {
  card: ChatCard;
  onCardAction?: (action: CardAction) => void;
  interactive?: boolean;
}) {
  const cfg = CARD_CONFIG[card.type];
  const st = STATUS_CONFIG[card.status];
  const Icon = cfg.icon;
  const action = interactive ? resolveCardAction(card) : null;

  const handleClick = () => {
    if (action && onCardAction) onCardAction(action);
  };

  const handleActionBtn = (btn: { label: string; primary?: boolean }, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onCardAction) return;
    if (btn.primary && action) {
      onCardAction(action);
    } else if (card.type === "upgrade") {
      onCardAction({ type: "showPricing", payload: "" });
    } else if (action) {
      onCardAction(action);
    }
  };

  return (
    <ConversationMessage
      onClick={handleClick}
      variant={card.type === "upgrade" ? "system" : "assistant"}
      avatar={
        <div className={`flex h-7 w-7 items-center justify-center rounded-full ${cfg.iconBg}`}>
          <Icon size={13} className={cfg.accent} />
        </div>
      }
      className={interactive && action ? "cursor-pointer" : ""}
      bubbleClassName={`w-full border ${cfg.border} border-l-2 bg-surface-2/80 shadow-none ${
        interactive && action ? "group hover:bg-surface-2" : ""
      }`}
      meta={
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-medium text-text-primary">{card.title}</span>
          <Badge
            className="gap-1 text-[9px]"
            variant={
              card.status === "success"
                ? "success"
                : card.status === "warning"
                  ? "warning"
                  : card.status === "locked"
                    ? "outline"
                    : "secondary"
            }
          >
            <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
            {st.label}
          </Badge>
          {card.path && (
            <span className="flex items-center gap-1 text-[10px] text-text-muted group-hover:text-accent transition-colors">
              <span className="font-mono truncate">~/clone/{card.path}</span>
              <ExternalLink size={9} className="shrink-0 opacity-50 group-hover:opacity-100" />
            </span>
          )}
        </div>
      }
    >
      <div className="space-y-2">
        <p className="text-[11px] text-text-secondary leading-relaxed whitespace-pre-line">
          {card.body}
        </p>

        {card.diff && (
          <div className="flex items-center gap-2 mt-1.5">
            <span className="flex items-center gap-0.5 text-[10px] text-emerald-400">
              <Plus size={9} />
              {card.diff.added}
            </span>
            {card.diff.removed > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] text-red-400">
                <Minus size={9} />
                {card.diff.removed}
              </span>
            )}
          </div>
        )}

        {card.meta && <div className="text-[10px] text-text-muted opacity-70">{card.meta}</div>}

        {card.actions && card.actions.length > 0 && (
          <div className="flex items-center gap-1.5 border-t border-border/30 pt-2">
            {card.actions.map((btn, i) => (
              <Button
                key={i}
                type="button"
                onClick={(e) => handleActionBtn(btn, e)}
                size="xs"
                variant={btn.primary ? "default" : "secondary"}
                className="text-[10px]"
              >
                {btn.label}
              </Button>
            ))}
            <ChevronRight
              size={10}
              className="ml-auto text-text-muted opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
            />
          </div>
        )}

        {card.viralCta && (
          <div className="flex items-center gap-2 border-t border-accent/10 bg-gradient-to-r from-accent/5 to-transparent px-1 py-2">
            <ConversationMessageStatusIcon className="h-4 w-4" />
            <span className="text-[9px] text-accent cursor-pointer hover:underline">
              {card.viralCta}
            </span>
          </div>
        )}
      </div>
    </ConversationMessage>
  );
}

export default function ChatCardGroup({
  cards,
  onCardAction,
  interactive = false,
}: ChatCardGroupProps) {
  return (
    <div className="space-y-1.5">
      {cards.map((card, i) => (
        <CardItem key={i} card={card} onCardAction={onCardAction} interactive={interactive} />
      ))}
    </div>
  );
}
