import { Badge, Button, ScrollArea } from "@nexu/ui-web";
import { Calendar, Link2, Mail, MessageSquare, Shield } from "lucide-react";

const INTEGRATIONS = [
  {
    id: "slack",
    name: "Slack",
    desc: "IM 远程指派、代办回复、状态同步",
    icon: MessageSquare,
    connected: true,
  },
  {
    id: "feishu",
    name: "飞书",
    desc: "消息处理、日程与会议协调",
    icon: MessageSquare,
    connected: true,
  },
  { id: "linear", name: "Linear", desc: "Bug/Issue 触发、状态更新", icon: Link2, connected: true },
  { id: "email", name: "Email", desc: "代办回复、通知", icon: Mail, connected: false },
  {
    id: "calendar",
    name: "Calendar",
    desc: "日程与会议管理、多方协调",
    icon: Calendar,
    connected: false,
  },
];

export default function NexuSettingsPage() {
  return (
    <ScrollArea className="h-full">
      <div className="mx-auto max-w-3xl px-6 py-8 space-y-8">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary">集成与设置</h1>
          <p className="mt-1 text-sm text-text-secondary">
            连接 Slack、飞书等办公软件随时调用分身；为分身授予各第三方工具权限以便执行任务。
          </p>
        </div>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Link2 size={18} className="text-accent" />
            <h2 className="text-sm font-semibold text-text-primary">跨平台连接</h2>
          </div>
          <ul className="space-y-3">
            {INTEGRATIONS.map((i) => (
              <li key={i.id} className="card flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-white border border-border">
                    <i.icon size={18} className="text-text-muted" />
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-text-primary">{i.name}</div>
                    <div className="text-[11px] text-text-secondary">{i.desc}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={i.connected ? "success" : "default"} size="sm">
                    {i.connected ? "已连接" : "未连接"}
                  </Badge>
                  <Button variant="outline" size="xs">
                    {i.connected ? "管理" : "连接"}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-accent" />
            <h2 className="text-sm font-semibold text-text-primary">权限授予</h2>
          </div>
          <p className="text-[12px] text-text-secondary">
            为各分身授予第三方工具访问权限，以便其执行任务（如读写 Linear、发 Slack 消息等）。
          </p>
          <div className="card p-4">
            <p className="text-[12px] text-text-muted">
              在分身详情页可单独配置该分身可访问的 Linear 项目、Slack 频道等。
            </p>
            <Button size="xs" className="mt-3">
              前往分身管理
            </Button>
          </div>
        </section>
      </div>
    </ScrollArea>
  );
}
