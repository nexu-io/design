import {
  Button,
  DataTable,
  DataTableDescription,
  DataTableFooter,
  DataTableHeader,
  DataTableTitle,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@nexu-design/ui-web";
import { Check, ClipboardCheck, Users, X } from "lucide-react";

const MOCK_ITEMS = [
  {
    id: "1",
    avatar: "研发助手",
    action: "合并 PR #234 到 main",
    detail: "已通过 CI，无冲突。请确认是否合并。",
    at: "2 min ago",
    type: "merge",
  },
  {
    id: "2",
    avatar: "运营助手",
    action: "发送本周周报给全员",
    detail: "周报已生成，将发送至 #all-hands。",
    at: "15 min ago",
    type: "send",
  },
  {
    id: "3",
    avatar: "内容助手",
    action: "发布推文到 Twitter",
    detail: "文案与配图已就绪，请确认发布。",
    at: "1 hour ago",
    type: "publish",
  },
];

export default function NexuApprovalsPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-3xl px-6 py-8 space-y-8">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary">审批中心</h1>
          <p className="mt-1 text-sm text-text-secondary">
            分身执行到关键节点时需要你的批准或驳回，可附上反馈以帮助分身学习你的偏好。
          </p>
        </div>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <ClipboardCheck size={18} className="text-accent" />
            <h2 className="text-sm font-semibold text-text-primary">待处理</h2>
          </div>
          <DataTable>
            <DataTableHeader>
              <div>
                <DataTableTitle>审批请求队列</DataTableTitle>
                <DataTableDescription>在关键动作执行前提供反馈并决定去留。</DataTableDescription>
              </div>
            </DataTableHeader>
            <Table density="compact">
              <TableHeader>
                <TableRow>
                  <TableHead>分身</TableHead>
                  <TableHead>待确认动作</TableHead>
                  <TableHead>反馈</TableHead>
                  <TableHead className="w-[88px]">时间</TableHead>
                  <TableHead className="w-[150px] text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_ITEMS.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                          <Users size={16} className="text-accent" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[12px] font-medium text-text-primary">
                            {item.avatar}
                          </div>
                          <div className="text-[11px] text-text-muted">{item.type}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-[13px] font-medium text-text-primary">
                          {item.action}
                        </div>
                        <div className="text-[11px] leading-relaxed text-text-secondary">
                          {item.detail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="text"
                        placeholder="可选：填写反馈，帮助分身纠偏学习"
                        className="min-w-[220px] bg-surface-0 text-[12px]"
                      />
                    </TableCell>
                    <TableCell className="text-[11px] text-text-muted">{item.at}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button size="xs" className="px-3 text-[12px]">
                          <Check size={14} />
                          批准
                        </Button>
                        <Button
                          variant="outline"
                          size="xs"
                          className="px-3 text-[12px] hover:border-danger hover:text-danger"
                        >
                          <X size={14} />
                          驳回
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <DataTableFooter>
              <span>共 {MOCK_ITEMS.length} 条待处理请求</span>
              <span>可选反馈会用于纠偏学习</span>
            </DataTableFooter>
          </DataTable>
        </section>
      </div>
    </div>
  );
}
