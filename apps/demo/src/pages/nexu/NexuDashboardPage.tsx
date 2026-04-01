import { Badge, Button, SectionHeader } from "@nexu-design/ui-web";
import { BarChart3, ChevronRight, Clock, MessageSquare, Send, Sparkles, Users } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

const PRESET_AVATARS = [
  {
    id: "ops",
    name: "运营助手",
    desc: "日报、周报、指标跟进",
    status: "idle",
    roleColor: "role-ops",
  },
  {
    id: "dev",
    name: "研发助手",
    desc: "Bug 跟进、代码 Review、文档",
    status: "busy",
    roleColor: "role-programmer",
  },
  {
    id: "content",
    name: "内容助手",
    desc: "文案、排版、多平台发布",
    status: "idle",
    roleColor: "role-designer",
  },
  {
    id: "founder",
    name: "创始人分身",
    desc: "战略摘要、投资人同步、决策备忘",
    status: "waiting",
    roleColor: "role-founder",
  },
];

const PENDING_APPROVALS = [
  { id: "1", avatar: "研发助手", action: "合并 PR #234 到 main", at: "2 min ago" },
  { id: "2", avatar: "运营助手", action: "发送本周周报给全员", at: "15 min ago" },
];

const QUICK_TASKS = [
  "帮我汇总今天 Linear 里 assigned to 我的未完成事项",
  "写一份产品迭代的周报摘要",
  "检查 Slack #product 里 @我 的消息并总结",
];

export default function NexuDashboardPage() {
  const [taskInput, setTaskInput] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    navigate("/nexu/task", { state: { initialQuery: taskInput } });
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-4xl px-6 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary">分身监控管理</h1>
          <p className="mt-1 text-sm text-text-secondary">
            随时指派任务、查看进度、审批关键节点 — 多数字员工，你的赛博工作室。
          </p>
        </div>

        {/* Hero: 即时任务下达 */}
        <section className="rounded-2xl border-2 border-accent/20 bg-accent-subtle p-6 shadow-[var(--shadow-refine)]">
          <div className="mb-4 flex items-center gap-2">
            <Send size={18} className="text-accent" />
            <h2 className="text-base font-semibold text-text-primary">即时任务下达</h2>
          </div>
          <p className="mb-4 text-sm text-text-secondary">
            用自然语言描述任务，选择要执行的分身或让系统自动分配。
          </p>
          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-xl border-2 border-border bg-surface-1 shadow-sm transition-all duration-200 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20"
          >
            <div className="flex items-end gap-3 px-4 pt-4 pb-3">
              <textarea
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                rows={2}
                placeholder="e.g. 汇总本周各渠道的转化数据并生成一页摘要"
                className="min-h-[52px] flex-1 resize-none border-0 bg-transparent text-[14px] leading-relaxed text-text-primary placeholder:text-text-muted focus:outline-none"
              />
              <Button
                type="submit"
                className="shrink-0 rounded-xl px-4 py-2.5 font-semibold shadow-sm"
              >
                <Sparkles size={16} />
                下达
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2 border-t border-border bg-surface-2/60 px-4 py-2.5 text-[11px] text-text-muted">
              <span>快捷：</span>
              {QUICK_TASKS.map((text) => (
                <Button
                  key={text}
                  variant="outline"
                  size="sm"
                  onClick={() => setTaskInput(text)}
                  className="rounded-full text-[11px] text-text-secondary hover:text-text-primary"
                >
                  {text}
                </Button>
              ))}
            </div>
          </form>
        </section>

        {/* 分身概览 + 待审批 */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* 我的分身 */}
          <section className="space-y-3">
            <SectionHeader
              title={
                <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
                  我的分身
                </span>
              }
              action={
                <Button
                  variant="ghost"
                  size="inline"
                  onClick={() => navigate("/nexu/avatars")}
                  className="text-[11px] hover:text-accent"
                >
                  管理全部
                </Button>
              }
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {PRESET_AVATARS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => navigate(`/nexu/avatars/${a.id}`)}
                  className="card flex items-start gap-3 p-4 text-left"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Users size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-text-primary">{a.name}</span>
                      <Badge
                        variant={
                          a.status === "busy"
                            ? "warning"
                            : a.status === "waiting"
                              ? "accent"
                              : "success"
                        }
                        size="xs"
                      >
                        {a.status === "busy"
                          ? "执行中"
                          : a.status === "waiting"
                            ? "待审批"
                            : "空闲"}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-[11px] text-text-secondary">{a.desc}</p>
                  </div>
                  <ChevronRight size={14} className="shrink-0 text-text-muted" />
                </button>
              ))}
            </div>
          </section>

          {/* 待审批 */}
          <section className="space-y-3">
            <SectionHeader
              title={
                <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
                  关键节点审批
                </span>
              }
              action={
                PENDING_APPROVALS.length > 0 ? (
                  <Button
                    variant="link"
                    size="inline"
                    onClick={() => navigate("/nexu/approvals")}
                    className="text-[11px]"
                  >
                    全部处理
                  </Button>
                ) : undefined
              }
            />
            <div className="card p-4">
              {PENDING_APPROVALS.length === 0 ? (
                <p className="text-[12px] text-text-muted">暂无待审批项</p>
              ) : (
                <ul className="space-y-3">
                  {PENDING_APPROVALS.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border-subtle bg-surface-2/50 p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-[12px] font-medium text-text-primary">
                          {item.avatar}
                        </div>
                        <div className="mt-0.5 truncate text-[11px] text-text-secondary">
                          {item.action}
                        </div>
                        <div className="mt-1 text-[10px] text-text-muted">{item.at}</div>
                      </div>
                      <div className="flex shrink-0 gap-1.5">
                        <Button size="xs">批准</Button>
                        <Button variant="outline" size="xs">
                          驳回
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>

        {/* 快捷入口：进度、自动化、Slack */}
        <section className="space-y-3">
          <h3 className="text-xs font-medium uppercase tracking-wider text-text-muted">快捷入口</h3>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/nexu/progress")}
              className="rounded-xl px-4 py-3 h-auto hover:border-accent/40 hover:bg-accent-subtle"
            >
              <BarChart3 size={16} className="text-accent" />
              <span className="text-[13px] font-medium text-text-primary">进度与 ROI</span>
            </Button>
            <Button variant="outline" className="rounded-xl px-4 py-3 h-auto">
              <Clock size={16} className="text-text-muted" />
              <span className="text-[13px] font-medium text-text-primary">自动化规则</span>
            </Button>
            <Button variant="outline" className="rounded-xl px-4 py-3 h-auto">
              <MessageSquare size={16} className="text-text-muted" />
              <span className="text-[13px] font-medium text-text-primary">Slack 远程指派</span>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
