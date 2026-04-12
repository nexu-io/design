import { Button } from "@nexu-design/ui-web";
import {
  ArrowRight,
  Brain,
  Check,
  CheckCircle2,
  ChevronRight,
  FolderOpen,
  Loader2,
  RefreshCw,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

// ─── Mock data: what we "detected" from the existing Openclaw installation ───

interface DetectedItem {
  type: "memory" | "skill";
  path: string;
  label: string;
  detail: string;
  selected: boolean;
}

const DETECTED_ITEMS: DetectedItem[] = [
  {
    type: "memory",
    path: "~/.openclaw/memory/CLAUDE.md",
    label: "项目记忆",
    detail: "3.2 KB · 上次更新 2天前",
    selected: true,
  },
  {
    type: "memory",
    path: "~/.openclaw/memory/user.md",
    label: "用户偏好",
    detail: "1.1 KB · 上次更新 5天前",
    selected: true,
  },
  {
    type: "memory",
    path: "~/.openclaw/memory/feedback_testing.md",
    label: "测试反馈记录",
    detail: "0.8 KB · 上次更新 1周前",
    selected: true,
  },
  {
    type: "skill",
    path: "~/.openclaw/skills/lark-im/",
    label: "飞书 IM",
    detail: "Skill 包 · v1.2.0",
    selected: true,
  },
  {
    type: "skill",
    path: "~/.openclaw/skills/linear/",
    label: "Linear 集成",
    detail: "Skill 包 · v0.9.5",
    selected: true,
  },
  {
    type: "skill",
    path: "~/.openclaw/skills/weather/",
    label: "天气查询",
    detail: "Skill 包 · v1.0.1",
    selected: false,
  },
];

// ─── Scan animation step ──────────────────────────────────────────────────────

function ScanStep({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("正在扫描 ~/.openclaw …");

  useEffect(() => {
    const stages = [
      { at: 400, pct: 30, text: "找到记忆文件 …" },
      { at: 900, pct: 65, text: "找到 Skill 包 …" },
      { at: 1400, pct: 90, text: "整理清单 …" },
      { at: 1800, pct: 100, text: "扫描完成！" },
    ];

    const timers = stages.map(({ at, pct, text }) =>
      setTimeout(() => {
        setProgress(pct);
        setStatusText(text);
      }, at),
    );

    const done = setTimeout(onDone, 2100);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [onDone]);

  return (
    <div className="flex flex-col items-center justify-center gap-5 py-10">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
        <Loader2 size={28} className="animate-spin text-accent" />
      </div>
      <div className="w-full max-w-[260px] space-y-2">
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-3">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-[12px] text-text-muted">{statusText}</p>
      </div>
    </div>
  );
}

// ─── Selection step ───────────────────────────────────────────────────────────

function SelectStep({
  items,
  onToggle,
  onMigrate,
  onSkip,
}: {
  items: DetectedItem[];
  onToggle: (path: string) => void;
  onMigrate: () => void;
  onSkip: () => void;
}) {
  const memories = items.filter((i) => i.type === "memory");
  const skills = items.filter((i) => i.type === "skill");
  const selectedCount = items.filter((i) => i.selected).length;

  return (
    <div className="space-y-4">
      <p className="text-[13px] leading-relaxed text-text-secondary">
        检测到你本地已有 Openclaw 配置，以下文件可以一键迁移到 Nexu：
      </p>

      {/* Memory files */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Brain size={12} className="text-text-muted" />
          <span className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
            记忆文件（{memories.length}）
          </span>
        </div>
        {memories.map((item) => (
          <ItemRow key={item.path} item={item} onToggle={onToggle} />
        ))}
      </div>

      {/* Skill packages */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Sparkles size={12} className="text-text-muted" />
          <span className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
            Skill 包（{skills.length}）
          </span>
        </div>
        {skills.map((item) => (
          <ItemRow key={item.path} item={item} onToggle={onToggle} />
        ))}
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between border-t border-border pt-3">
        <button
          type="button"
          onClick={onSkip}
          className="text-[12px] text-text-muted transition-colors hover:text-text-primary"
        >
          跳过，手动配置
        </button>
        <Button
          size="sm"
          onClick={onMigrate}
          disabled={selectedCount === 0}
          className="gap-1.5"
        >
          <Zap size={13} />
          一键迁移 {selectedCount > 0 ? `(${selectedCount} 项)` : ""}
        </Button>
      </div>
    </div>
  );
}

function ItemRow({ item, onToggle }: { item: DetectedItem; onToggle: (path: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(item.path)}
      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${
        item.selected
          ? "border-accent/30 bg-accent/5"
          : "border-border bg-surface-1 hover:border-border-hover"
      }`}
    >
      {/* Checkbox */}
      <div
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
          item.selected ? "border-accent bg-accent" : "border-border-strong bg-surface-0"
        }`}
      >
        {item.selected && <Check size={10} className="text-accent-fg" />}
      </div>

      {/* Icon */}
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-3">
        {item.type === "memory" ? (
          <Brain size={13} className="text-text-secondary" />
        ) : (
          <Sparkles size={13} className="text-text-secondary" />
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-medium text-text-primary">{item.label}</div>
        <div className="truncate text-[10px] text-text-muted font-mono">{item.path}</div>
      </div>

      {/* Meta */}
      <span className="shrink-0 text-[10px] text-text-muted">{item.detail}</span>
    </button>
  );
}

// ─── Progress step ────────────────────────────────────────────────────────────

function MigratingStep({
  items,
  onDone,
}: {
  items: DetectedItem[];
  onDone: () => void;
}) {
  const selected = items.filter((i) => i.selected);
  const [done, setDone] = useState<Set<string>>(new Set());

  useEffect(() => {
    selected.forEach((item, i) => {
      const timer = setTimeout(() => {
        setDone((prev) => new Set([...prev, item.path]));
      }, (i + 1) * 400);
      return () => clearTimeout(timer);
    });

    const finishTimer = setTimeout(onDone, selected.length * 400 + 500);
    return () => clearTimeout(finishTimer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-2.5 py-2">
      {selected.map((item) => {
        const isDone = done.has(item.path);
        return (
          <div key={item.path} className="flex items-center gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-2">
              {isDone ? (
                <CheckCircle2 size={14} className="text-success" />
              ) : (
                <Loader2 size={14} className="animate-spin text-text-muted" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] text-text-primary">{item.label}</div>
              <div className="truncate text-[10px] font-mono text-text-muted">{item.path}</div>
            </div>
            {isDone && (
              <span className="shrink-0 text-[10px] text-success">已迁移</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Done step ────────────────────────────────────────────────────────────────

function DoneStep({
  migratedCount,
  onContinue,
}: {
  migratedCount: number;
  onContinue: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
        <CheckCircle2 size={28} className="text-success" />
      </div>
      <div className="space-y-1">
        <p className="text-[15px] font-semibold text-text-primary">迁移完成！</p>
        <p className="text-[12px] text-text-muted">
          {migratedCount} 项配置已复制到 Nexu，你的记忆和 Skill 都已就位。
        </p>
      </div>
      <div className="w-full rounded-xl border border-border bg-surface-1 px-4 py-3 text-left space-y-2">
        {[
          { icon: FolderOpen, text: "记忆已存入 ~/.nexu/memory/" },
          { icon: Sparkles, text: "Skill 已安装到 ~/.nexu/skills/" },
          { icon: RefreshCw, text: "原始 Openclaw 文件未修改" },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2 text-[12px] text-text-secondary">
            <Icon size={12} className="shrink-0 text-text-muted" />
            {text}
          </div>
        ))}
      </div>
      <Button onClick={onContinue} className="gap-1.5 w-full">
        开始使用 Nexu
        <ArrowRight size={14} />
      </Button>
    </div>
  );
}

// ─── Main export: the popup rendered in the journey demo ──────────────────────

type Phase = "scan" | "select" | "migrating" | "done" | "skipped";

export default function StepOpenclawMigration() {
  const [phase, setPhase] = useState<Phase>("scan");
  const [items, setItems] = useState<DetectedItem[]>(DETECTED_ITEMS);
  const [open, setOpen] = useState(true);

  const handleToggle = (path: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.path === path ? { ...item, selected: !item.selected } : item,
      ),
    );
  };

  const migratedCount = items.filter((i) => i.selected).length;

  return (
    <div className="flex min-h-[480px] items-center justify-center px-4 py-8">
      {/* Dimmed backdrop */}
      <div className="pointer-events-none fixed inset-0 bg-black/40" />

      {!open ? (
        /* Dismissed state */
        <div className="relative z-10 flex flex-col items-center gap-3 text-center">
          <p className="text-[13px] text-text-muted">弹窗已关闭（用户选择跳过）</p>
          <Button variant="outline" size="sm" onClick={() => { setPhase("scan"); setItems(DETECTED_ITEMS); setOpen(true); }}>
            重新演示
          </Button>
        </div>
      ) : (
        /* Dialog */
        <div className="relative z-10 w-full max-w-[480px] rounded-2xl border border-border bg-surface-0 shadow-[var(--shadow-dropdown)]">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-border px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                <Zap size={18} className="text-accent" />
              </div>
              <div>
                <h2 className="text-[14px] font-semibold text-text-primary">
                  检测到已有 Openclaw 配置
                </h2>
                <p className="text-[11px] text-text-muted">
                  {phase === "scan"
                    ? "正在扫描本地目录…"
                    : phase === "select"
                      ? `找到 ${DETECTED_ITEMS.length} 项可迁移内容`
                      : phase === "migrating"
                        ? "正在迁移中…"
                        : "迁移完成"}
                </p>
              </div>
            </div>
            {phase !== "migrating" && phase !== "done" && (
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-text-muted transition-colors hover:bg-surface-3"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Breadcrumb */}
          {phase !== "done" && (
            <div className="flex items-center gap-1 border-b border-border/50 bg-surface-1/50 px-5 py-2">
              {[
                { id: "scan", label: "扫描" },
                { id: "select", label: "选择" },
                { id: "migrating", label: "迁移" },
              ].map((step, i, arr) => {
                const phases: Phase[] = ["scan", "select", "migrating"];
                const idx = phases.indexOf(step.id as Phase);
                const currentIdx = phases.indexOf(phase as Phase);
                const isDone = idx < currentIdx;
                const isActive = idx === currentIdx;
                return (
                  <div key={step.id} className="flex items-center gap-1">
                    <span
                      className={`text-[11px] font-medium ${
                        isActive
                          ? "text-accent"
                          : isDone
                            ? "text-success"
                            : "text-text-muted"
                      }`}
                    >
                      {isDone ? <CheckCircle2 size={11} className="inline mr-0.5 -mt-0.5" /> : null}
                      {step.label}
                    </span>
                    {i < arr.length - 1 && (
                      <ChevronRight size={10} className="text-text-muted" />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Body */}
          <div className="px-5 py-4">
            {phase === "scan" && (
              <ScanStep onDone={() => setPhase("select")} />
            )}
            {phase === "select" && (
              <SelectStep
                items={items}
                onToggle={handleToggle}
                onMigrate={() => setPhase("migrating")}
                onSkip={() => setOpen(false)}
              />
            )}
            {phase === "migrating" && (
              <MigratingStep items={items} onDone={() => setPhase("done")} />
            )}
            {phase === "done" && (
              <DoneStep migratedCount={migratedCount} onContinue={() => setOpen(false)} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
