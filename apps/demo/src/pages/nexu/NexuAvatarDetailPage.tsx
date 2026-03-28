import {
  Badge,
  Button,
  EntityCard,
  EntityCardContent,
  EntityCardDescription,
  EntityCardFooter,
  EntityCardHeader,
  EntityCardMeta,
  EntityCardTitle,
  TagGroup,
  TagGroupItem,
} from "@nexu-design/ui-web";
import { BookOpen, ChevronLeft, GitBranch, Send, Shield, Users, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MOCK_AVATAR = {
  id: "dev",
  name: "研发助手",
  desc: "Bug 跟进、代码 Review、文档、Linear 同步",
  status: "busy",
  currentTask: "正在执行：汇总 Linear 中 assigned to 我的未关闭 issue，并生成今日待办摘要",
  progress: 65,
  skills: ["Linear 同步", "Git 操作", "代码摘要", "文档生成", "PR Review 助手"],
  memoryCount: 12,
  permissions: ["Linear", "GitHub", "Slack #dev"],
};

const THINKING_STEPS = [
  { step: "查询 Linear API", skill: "Linear 同步", time: "10:32" },
  { step: "过滤 assignee = me", skill: "Linear 同步", time: "10:32" },
  { step: "调用 LLM 生成摘要", skill: "代码摘要", time: "10:33" },
];

export default function NexuAvatarDetailPage() {
  const navigate = useNavigate();
  const avatar = MOCK_AVATAR;

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-4xl px-6 py-8 space-y-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/nexu/avatars")}
          className="text-[12px] text-text-muted hover:text-text-primary h-auto px-0"
        >
          <ChevronLeft size={14} />
          返回分身列表
        </Button>

        {/* 基本信息 + 当前任务 */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <Users size={26} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">{avatar.name}</h1>
              <p className="mt-1 text-sm text-text-secondary">{avatar.desc}</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="warning">执行中</Badge>
              </div>
            </div>
          </div>
          <Button onClick={() => navigate("/nexu/task")}>
            <Send size={16} />
            下达任务
          </Button>
        </div>

        {/* 当前任务进度 */}
        <section className="card p-5">
          <h3 className="text-xs font-medium uppercase tracking-wider text-text-muted">当前任务</h3>
          <p className="mt-2 text-[13px] text-text-primary">{avatar.currentTask}</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-3">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${avatar.progress}%` }}
              />
            </div>
            <span className="text-[12px] font-medium tabular-nums text-text-secondary">
              {avatar.progress}%
            </span>
          </div>
        </section>

        {/* 中间路径审阅 */}
        <section className="card p-5">
          <div className="flex items-center gap-2">
            <GitBranch size={16} className="text-text-muted" />
            <h3 className="text-xs font-medium uppercase tracking-wider text-text-muted">
              思考轨迹（可审阅与干预）
            </h3>
          </div>
          <p className="mt-1 text-[11px] text-text-secondary">
            查看分身调用的知识库与 Skill，必要时可中途介入引导。
          </p>
          <ul className="mt-3 space-y-2">
            {THINKING_STEPS.map((s) => (
              <li
                key={s.step}
                className="flex items-center gap-3 rounded-lg border border-border-subtle bg-surface-2/50 px-3 py-2 text-[12px]"
              >
                <span className="text-text-muted">{s.time}</span>
                <span className="text-text-primary">{s.step}</span>
                <Badge variant="default" size="sm" className="ml-auto">
                  {s.skill}
                </Badge>
              </li>
            ))}
          </ul>
        </section>

        {/* 技能 / 知识库 / 权限 */}
        <div className="grid gap-4 sm:grid-cols-3">
          <EntityCard>
            <EntityCardHeader>
              <div className="flex items-center gap-2">
                <Wrench size={14} className="text-text-muted" />
                <EntityCardTitle className="text-xs uppercase tracking-wider text-text-muted">
                  技能
                </EntityCardTitle>
              </div>
            </EntityCardHeader>
            <EntityCardContent>
              <TagGroup>
                {avatar.skills.map((skill) => (
                  <TagGroupItem key={skill} variant="brand" radius="md">
                    {skill}
                  </TagGroupItem>
                ))}
              </TagGroup>
            </EntityCardContent>
            <EntityCardFooter>
              <Button
                variant="link"
                size="sm"
                onClick={() => navigate("/nexu/skills")}
                className="h-auto px-0 text-[11px]"
              >
                管理技能
              </Button>
            </EntityCardFooter>
          </EntityCard>
          <EntityCard>
            <EntityCardHeader>
              <div className="flex items-center gap-2">
                <BookOpen size={14} className="text-text-muted" />
                <EntityCardTitle className="text-xs uppercase tracking-wider text-text-muted">
                  知识库 / Memory
                </EntityCardTitle>
              </div>
            </EntityCardHeader>
            <EntityCardContent>
              <EntityCardDescription className="mt-0 text-[12px]">
                {avatar.memoryCount} 条记忆与文档
              </EntityCardDescription>
              <EntityCardMeta>持续注入工作上下文与团队知识</EntityCardMeta>
            </EntityCardContent>
            <EntityCardFooter>
              <Button
                variant="link"
                size="sm"
                onClick={() => navigate("/nexu/skills")}
                className="h-auto px-0 text-[11px]"
              >
                管理知识库
              </Button>
            </EntityCardFooter>
          </EntityCard>
          <EntityCard>
            <EntityCardHeader>
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-text-muted" />
                <EntityCardTitle className="text-xs uppercase tracking-wider text-text-muted">
                  已授权
                </EntityCardTitle>
              </div>
            </EntityCardHeader>
            <EntityCardContent>
              <TagGroup>
                {avatar.permissions.map((p) => (
                  <TagGroupItem key={p} variant="default" radius="md">
                    {p}
                  </TagGroupItem>
                ))}
              </TagGroup>
            </EntityCardContent>
            <EntityCardFooter>
              <Button
                variant="link"
                size="sm"
                onClick={() => navigate("/nexu/settings")}
                className="h-auto px-0 text-[11px]"
              >
                权限设置
              </Button>
            </EntityCardFooter>
          </EntityCard>
        </div>
      </div>
    </div>
  );
}
