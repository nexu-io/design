import { Badge, Button, ConversationMessage, Progress, Textarea } from "@nexu-design/ui-web";
import {
  BarChart3,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Link2,
  Maximize2,
  MessageSquare,
  Minimize2,
  Send,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { INSIGHT_CONVERSATIONS, INSIGHT_SUGGESTIONS, type InsightMessage } from "./teamData";

const REF_TYPE_STYLES: Record<string, { icon: React.ElementType; color: string }> = {
  task: { icon: BarChart3, color: "text-clone bg-clone/10" },
  member: { icon: Users, color: "text-info bg-info-subtle" },
  okr: { icon: Target, color: "text-accent bg-accent/10" },
  card: { icon: MessageSquare, color: "text-warning bg-warning-subtle" },
};

function InlineChart({
  chart,
}: {
  chart: NonNullable<InsightMessage["chart"]>;
}) {
  if (chart.type === "bar") {
    const max = Math.max(...chart.data.map((d) => d.value));
    return (
      <div className="my-2 p-3 bg-surface-1 border border-border rounded-lg">
        <div className="text-[9px] text-text-muted uppercase tracking-wider mb-2">成员进度对比</div>
        <div className="space-y-1.5">
          {chart.data.map((d) => (
            <div key={d.label} className="flex items-center gap-2">
              <span className="text-[10px] text-text-primary w-8 shrink-0">{d.label}</span>
              <div className="flex-1">
                <Progress
                  value={(d.value / max) * 100}
                  size="md"
                  className="h-[14px]"
                  indicatorClassName={`${d.color || "bg-clone"} flex items-center justify-end pr-1`}
                />
                  {d.value > 15 && (
                    <span className="text-[8px] font-bold text-white/90">{d.value}%</span>
                  )}
              </div>
              {d.value <= 15 && (
                <span className="text-[9px] text-text-muted tabular-nums">{d.value}%</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="my-2 grid grid-cols-3 gap-2">
      {chart.data.map((d) => (
        <div
          key={d.label}
          className="p-2.5 bg-surface-1 border border-border rounded-lg text-center"
        >
          <div className="relative h-[36px] w-[36px] mx-auto mb-1">
            <svg
              width={36}
              height={36}
              className="transform -rotate-90"
              role="img"
              aria-label="圆环进度图"
            >
              <circle
                cx={18}
                cy={18}
                r={14}
                fill="none"
                strokeWidth={3}
                className="stroke-surface-3"
              />
              <circle
                cx={18}
                cy={18}
                r={14}
                fill="none"
                strokeWidth={3}
                strokeDasharray={88}
                strokeDashoffset={88 - (d.value / 100) * 88}
                strokeLinecap="round"
                className={d.color?.replace("bg-", "stroke-") || "stroke-clone"}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-text-primary">
              {d.value}%
            </span>
          </div>
          <div className="text-[9px] text-text-muted leading-tight">{d.label}</div>
        </div>
      ))}
    </div>
  );
}

function ChatMessage({ msg }: { msg: InsightMessage }) {
  const isAgent = msg.from === "agent";

  return (
    <div className={isAgent ? undefined : 'ml-auto'}>
      <ConversationMessage
        variant={isAgent ? 'assistant' : 'user'}
        avatar={
          isAgent ? (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10">
              <Sparkles size={12} className="text-accent" />
            </div>
          ) : undefined
        }
        bubbleClassName={isAgent ? 'bg-surface-1 text-[12px]' : 'bg-accent text-accent-fg text-[12px]'}
        meta={msg.time}
      >
          <div className="whitespace-pre-line">
            {msg.content.split(/(\*\*[^*]+\*\*)/g).map((part) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={part} className="font-semibold">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return <span key={part}>{part}</span>;
            })}
          </div>
          {msg.chart && <InlineChart chart={msg.chart} />}
      </ConversationMessage>

      {msg.references && msg.references.length > 0 && (
        <div className={`mt-1.5 flex flex-wrap gap-1 ${isAgent ? 'ml-9' : 'justify-end'}`}>
            {msg.references.map((ref) => {
              const st = REF_TYPE_STYLES[ref.type];
              return (
                <Badge
                  key={ref.id}
                  variant="outline"
                  size="xs"
                  className={`${st.color} cursor-default`}
                >
                  <st.icon size={8} />
                  {ref.label}
                  <Link2 size={7} />
                </Badge>
              );
            })}
        </div>
      )}
    </div>
  );
}

type ChatMode = "collapsed" | "default" | "fullscreen";

const MODE_HEIGHT: Record<ChatMode, string> = {
  collapsed: "h-[44px]",
  default: "h-[380px]",
  fullscreen: "h-[80vh]",
};

export default function TeamInsightsChat() {
  const [mode, setMode] = useState<ChatMode>("collapsed");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<InsightMessage[]>(INSIGHT_CONVERSATIONS);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isOpen = mode !== "collapsed";

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [isOpen]);

  const toggleCollapse = () => {
    setMode((prev) => (prev === "collapsed" ? "default" : "collapsed"));
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMode((prev) => (prev === "fullscreen" ? "default" : "fullscreen"));
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: InsightMessage = {
      id: `i-${Date.now()}`,
      from: "user",
      content: input,
      time: new Date().toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    setTimeout(() => {
      const reply: InsightMessage = {
        id: `i-${Date.now()}-r`,
        from: "agent",
        content:
          "正在分析团队数据...\n\n我已检索了 Sprint 任务状态、OKR 进度、成员负载和 IM 卡片流。基于当前数据，我建议关注以下几点：\n\n1. 优先推动 Gateway 重构加速\n2. 重新评估王五的任务分配\n3. 在下周站会中同步 OKR 进展",
        time: new Date().toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        references: [
          { type: "task", label: "T-003 Gateway 重构", id: "T-003" },
          { type: "member", label: "王五", id: "王五" },
        ],
      };
      setMessages((prev) => [...prev, reply]);
    }, 800);
  };

  return (
    <div
      className={`border-t border-border bg-surface-0 transition-all duration-300 ${MODE_HEIGHT[mode]}`}
    >
      {/* Header bar — always visible */}
      <button
        type="button"
        onClick={toggleCollapse}
        className="w-full px-4 h-[44px] flex items-center gap-2 bg-surface-1 hover:bg-surface-1/80 transition-colors"
      >
        <Sparkles size={14} className="text-accent" />
        <span className="text-[12px] font-medium text-text-primary">Team Insights</span>
          <Badge variant="accent" size="xs">
            Scoped Session
          </Badge>
        <span className="text-[10px] text-text-muted">— 限定团队分析 Skills</span>
        <div className="ml-auto flex items-center gap-2">
          {!isOpen && <span className="text-[10px] text-text-muted">点击展开对话...</span>}
          {isOpen && (
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1 rounded hover:bg-surface-3 text-text-muted hover:text-text-secondary transition-colors"
              title={mode === "fullscreen" ? "缩小" : "展开到近全屏"}
            >
              {mode === "fullscreen" ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            </button>
          )}
          {isOpen ? (
            <ChevronDown size={14} className="text-text-muted" />
          ) : (
            <ChevronUp size={14} className="text-text-muted" />
          )}
        </div>
      </button>

      {/* Chat area */}
      {isOpen && (
        <div className="flex flex-col h-[calc(100%-44px)]">
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {/* Welcome message if empty */}
            {messages.length === 0 && (
              <div className="text-center py-6">
                <Lightbulb size={24} className="text-accent mx-auto mb-2 opacity-60" />
                <div className="text-[13px] text-text-secondary font-medium">
                  问我任何关于团队的问题
                </div>
                <div className="text-[11px] text-text-muted mt-1">
                  我可以分析 Sprint 进度、OKR 健康度、成员负载、依赖风险等
                </div>
                <div className="text-[10px] text-text-muted mt-3 px-6">
                  这是一个 <span className="text-cyan-400 font-medium">Scoped Session</span> — 和主
                  Session 一样是 Chat，但限定了团队分析相关的 Skills
                  和上下文。更通用的操作可以回到主线会话
                </div>
              </div>
            )}
            {messages.map((msg) => (
              <ChatMessage key={msg.id} msg={msg} />
            ))}
          </div>

          {/* Suggestions */}
          <div className="px-4 py-2 border-t border-border/50 flex items-center gap-1.5 overflow-x-auto shrink-0">
            <span className="text-[9px] text-text-muted shrink-0">快捷：</span>
            {INSIGHT_SUGGESTIONS.slice(0, 4).map((s) => (
              <Button
                key={s}
                type="button"
                variant="outline"
                size="xs"
                onClick={() => {
                  setInput(s);
                }}
                className="h-6 whitespace-nowrap"
              >
                {s}
              </Button>
            ))}
          </div>

          {/* Input */}
          <div className="px-4 py-2.5 border-t border-border shrink-0">
            <div className="flex items-end gap-2 rounded-xl border border-border bg-surface-1 px-3 py-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="分析 Sprint 风险、查询 OKR 进展、对比成员负载..."
                rows={1}
                className="min-h-0 flex-1 resize-none border-0 bg-transparent px-0 py-0 text-[12px] shadow-none focus-visible:ring-0"
              />
              <Button
                type="button"
                size="icon-sm"
                onClick={handleSend}
              >
                <Send size={12} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
