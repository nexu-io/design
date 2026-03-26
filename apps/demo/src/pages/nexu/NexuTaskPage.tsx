import {
  Badge,
  Button,
  DataTableHeader as ComposedDataTableHeader,
  DataTable,
  DataTableDescription,
  DataTableTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from "@nexu/ui-web";
import { Clock, Sparkles, Users, Zap } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AVATAR_OPTIONS = [
  {
    id: "auto",
    name: "自动分配",
    desc: "由系统根据任务类型选择最合适分身",
    focus: "复杂任务自动路由",
  },
  { id: "ops", name: "运营助手", desc: "日报、周报、指标", focus: "报表、群发、运营执行" },
  { id: "dev", name: "研发助手", desc: "Bug、代码、文档", focus: "修复、实现、技术分析" },
  { id: "content", name: "内容助手", desc: "文案、排版、发布", focus: "内容产出与分发" },
  { id: "founder", name: "创始人分身", desc: "战略、投资人、决策", focus: "高层判断与外部沟通" },
];

export default function NexuTaskPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialQuery = (location.state as { initialQuery?: string })?.initialQuery ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [selectedAvatar, setSelectedAvatar] = useState("auto");

  useEffect(() => {
    if (initialQuery) setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    // In real app: submit task, then redirect to progress or approvals
    navigate("/nexu");
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-2xl px-6 py-8 space-y-8">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary">任务下达</h1>
          <p className="mt-1 text-sm text-text-secondary">
            即时下达单次任务，或设置自动化规则在指定时间/事件触发时由分身执行。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="card p-5">
            <h3 className="text-xs font-medium uppercase tracking-wider text-text-muted">
              任务描述（自然语言）
            </h3>
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={4}
              placeholder="e.g. 每天上午 9 点汇总昨日 Linear 里我负责的 issue 状态变更，并发到 Slack #standup"
              className="mt-3 resize-none bg-surface-0 px-4 py-3 text-[14px]"
            />
          </section>

          <section className="card p-5">
            <h3 className="text-xs font-medium uppercase tracking-wider text-text-muted">指派给</h3>
            <DataTable className="mt-3 bg-surface-0">
              <ComposedDataTableHeader>
                <div>
                  <DataTableTitle>分身候选</DataTableTitle>
                  <DataTableDescription>
                    选择最适合执行当前任务的分身，或交给系统自动分配。
                  </DataTableDescription>
                </div>
              </ComposedDataTableHeader>
              <Table density="compact">
                <TableHeader>
                  <TableRow>
                    <TableHead>分身</TableHead>
                    <TableHead>能力概览</TableHead>
                    <TableHead>适用场景</TableHead>
                    <TableHead className="w-[92px] text-right">状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {AVATAR_OPTIONS.map((a) => {
                    const isSelected = selectedAvatar === a.id;

                    return (
                      <TableRow
                        key={a.id}
                        selected={isSelected}
                        className="cursor-pointer"
                        onClick={() => setSelectedAvatar(a.id)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                              <Users size={16} className="text-accent" />
                            </div>
                            <div>
                              <div className="text-[13px] font-medium text-text-primary">
                                {a.name}
                              </div>
                              <div className="text-[11px] text-text-muted">
                                {a.id === "auto" ? "推荐" : "专属分身"}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-[11px] text-text-secondary">{a.desc}</TableCell>
                        <TableCell className="text-[11px] text-text-secondary">{a.focus}</TableCell>
                        <TableCell className="text-right">
                          {isSelected ? (
                            <Badge variant="accent" size="sm">
                              已选
                            </Badge>
                          ) : (
                            <span className="text-[11px] text-text-muted">点击选择</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </DataTable>
          </section>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" className="rounded-xl px-5 font-semibold shadow-sm">
              <Sparkles size={16} />
              立即下达
            </Button>
            <Button variant="outline" className="rounded-xl">
              <Clock size={16} />
              设为自动化
            </Button>
          </div>
        </form>

        <section className="rounded-xl border border-border bg-surface-2/50 p-4">
          <div className="flex items-center gap-2 text-[12px] text-text-muted">
            <Zap size={14} />
            <span>
              自动化：可基于时间（如每日 9:00）或外部事件（如 Linear 新
              Bug、电商差评）触发，分身自动执行任务。
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
