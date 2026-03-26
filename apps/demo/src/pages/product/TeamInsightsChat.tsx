import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Sparkles,
  ChevronUp,
  ChevronDown,
  BarChart3,
  Target,
  Users,
  Link2,
  Lightbulb,
  Maximize2,
  Minimize2,
} from "lucide-react";
import {
  INSIGHT_SUGGESTIONS,
  INSIGHT_CONVERSATIONS,
  type InsightMessage,
} from "./teamData";

const REF_TYPE_STYLES: Record<
  string,
  { icon: React.ElementType; color: string }
> = {
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
        <div className="text-[9px] text-text-muted uppercase tracking-wider mb-2">
          成员进度对比
        </div>
        <div className="space-y-1.5">
          {chart.data.map((d) => (
            <div key={d.label} className="flex items-center gap-2">
              <span className="text-[10px] text-text-primary w-8 shrink-0">
                {d.label}
              </span>
              <div className="flex-1 h-[14px] bg-surface-3 rounded overflow-hidden">
                <div
                  className={`h-full rounded ${
                    d.color || "bg-clone"
                  } transition-all flex items-center justify-end pr-1`}
                  style={{ width: `${(d.value / max) * 100}%` }}
                >
                  {d.value > 15 && (
                    <span className="text-[8px] font-bold text-white/90">
                      {d.value}%
                    </span>
                  )}
                </div>
              </div>
              {d.value <= 15 && (
                <span className="text-[9px] text-text-muted tabular-nums">
                  {d.value}%
                </span>
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
            <svg width={36} height={36} className="transform -rotate-90">
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
          <div className="text-[9px] text-text-muted leading-tight">
            {d.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function ChatMessage({ msg }: { msg: InsightMessage }) {
  const isAgent = msg.from === "agent";

  return (
    <div className={`flex gap-2.5 ${isAgent ? "" : "flex-row-reverse"}`}>
      {isAgent && (
        <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
          <Sparkles size={12} className="text-accent" />
        </div>
      )}
      <div className={`max-w-[85%] ${isAgent ? "" : "ml-auto"}`}>
        <div
          className={`rounded-xl px-3.5 py-2.5 text-[12px] leading-relaxed ${
            isAgent
              ? "bg-surface-1 border border-border text-text-primary rounded-bl-sm"
              : "bg-accent text-accent-fg rounded-br-sm"
          }`}
        >
          <div className="whitespace-pre-line">
            {msg.content.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={i} className="font-semibold">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return <span key={i}>{part}</span>;
            })}
          </div>
          {msg.chart && <InlineChart chart={msg.chart} />}
        </div>

        {/* References */}
        {msg.references && msg.references.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {msg.references.map((ref, i) => {
              const st = REF_TYPE_STYLES[ref.type];
              return (
                <button
                  key={i}
                  className={`inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full font-medium ${st.color} hover:opacity-80 transition-opacity`}
                >
                  <st.icon size={8} />
                  {ref.label}
                  <Link2 size={7} />
                </button>
              );
            })}
          </div>
        )}
        <div
          className={`text-[9px] text-text-muted mt-0.5 ${
            isAgent ? "" : "text-right"
          }`}
        >
          {msg.time}
        </div>
      </div>
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
  const [messages, setMessages] = useState<InsightMessage[]>(
    INSIGHT_CONVERSATIONS
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  const isOpen = mode !== "collapsed";

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [isOpen, messages.length]);

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
        onClick={toggleCollapse}
        className="w-full px-4 h-[44px] flex items-center gap-2 bg-surface-1 hover:bg-surface-1/80 transition-colors"
      >
        <Sparkles size={14} className="text-accent" />
        <span className="text-[12px] font-medium text-text-primary">
          Team Insights
        </span>
        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
          Scoped Session
        </span>
        <span className="text-[10px] text-text-muted">
          — 限定团队分析 Skills
        </span>
        <div className="ml-auto flex items-center gap-2">
          {!isOpen && (
            <span className="text-[10px] text-text-muted">点击展开对话...</span>
          )}
          {isOpen && (
            <span
              role="button"
              tabIndex={0}
              onClick={toggleFullscreen}
              className="p-1 rounded hover:bg-surface-3 text-text-muted hover:text-text-secondary transition-colors"
              title={mode === "fullscreen" ? "缩小" : "展开到近全屏"}
            >
              {mode === "fullscreen" ? (
                <Minimize2 size={12} />
              ) : (
                <Maximize2 size={12} />
              )}
            </span>
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
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
          >
            {/* Welcome message if empty */}
            {messages.length === 0 && (
              <div className="text-center py-6">
                <Lightbulb
                  size={24}
                  className="text-accent mx-auto mb-2 opacity-60"
                />
                <div className="text-[13px] text-text-secondary font-medium">
                  问我任何关于团队的问题
                </div>
                <div className="text-[11px] text-text-muted mt-1">
                  我可以分析 Sprint 进度、OKR 健康度、成员负载、依赖风险等
                </div>
                <div className="text-[10px] text-text-muted mt-3 px-6">
                  这是一个 <span className="text-cyan-400 font-medium">Scoped Session</span> — 和主 Session 一样是 Chat，但限定了团队分析相关的 Skills 和上下文。更通用的操作可以回到主线会话
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
              <button
                key={s}
                onClick={() => {
                  setInput(s);
                }}
                className="text-[10px] px-2 py-1 bg-surface-2 text-text-secondary rounded-md hover:bg-surface-3 hover:text-text-primary transition-colors whitespace-nowrap shrink-0"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-4 py-2.5 border-t border-border shrink-0">
            <div className="flex items-end gap-2 bg-surface-1 border border-border rounded-xl px-3 py-2">
              <textarea
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
                className="flex-1 bg-transparent text-[12px] text-text-primary placeholder:text-text-muted resize-none focus:outline-none leading-relaxed"
              />
              <button
                onClick={handleSend}
                className="p-1.5 bg-accent text-accent-fg rounded-lg shrink-0 hover:bg-accent-hover transition-colors"
              >
                <Send size={12} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
