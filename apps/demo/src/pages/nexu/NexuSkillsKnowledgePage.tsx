import {
  Badge,
  Button,
  EntityCard,
  EntityCardContent,
  EntityCardDescription,
  EntityCardFooter,
  EntityCardHeader,
  EntityCardMedia,
  EntityCardMeta,
  EntityCardTitle,
} from "@nexu-design/ui-web";
import { BookOpen, FileText, Plus, Sparkles, Wrench } from "lucide-react";

const SKILLS_BY_AVATAR = [
  {
    avatar: "研发助手",
    skills: ["Linear 同步", "Git 操作", "代码摘要", "文档生成", "PR Review 助手"],
  },
  { avatar: "运营助手", skills: ["日报生成", "指标拉取", "Slack 推送", "周报模板"] },
  { avatar: "内容助手", skills: ["多平台发布", "文案润色", "配图建议"] },
];

const MEMORY_SOURCES = [
  { name: "公司风格指南", count: 24, type: "doc" },
  { name: "产品 PRD 摘要", count: 8, type: "doc" },
  { name: "联系人偏好", count: 15, type: "memory" },
];

export default function NexuSkillsKnowledgePage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-4xl px-6 py-8 space-y-8">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary">技能与知识库</h1>
          <p className="mt-1 text-sm text-text-secondary">
            为分身添加或更新技能（工作流编排 / 对话配置），并注入公司文档、风格指南与业务知识到
            Memory。
          </p>
        </div>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-accent" />
            <h2 className="text-sm font-semibold text-text-primary">技能进化</h2>
          </div>
          <p className="text-[12px] text-text-secondary">
            通过工作流编排或对话为分身添加新技能、更新最佳实践模板。
          </p>
          <div className="space-y-4">
            {SKILLS_BY_AVATAR.map((row) => (
              <EntityCard key={row.avatar}>
                <EntityCardHeader>
                  <div>
                    <EntityCardTitle>{row.avatar}</EntityCardTitle>
                    <EntityCardDescription>当前已配置的能力组合</EntityCardDescription>
                  </div>
                </EntityCardHeader>
                <EntityCardContent>
                  <div className="flex flex-wrap gap-2">
                    {row.skills.map((s) => (
                      <Badge key={s} variant="accent" size="lg">
                        <Wrench size={12} />
                        {s}
                      </Badge>
                    ))}
                    <Button
                      variant="outline"
                      size="xs"
                      className="rounded-lg border-dashed px-2.5 py-1.5 text-[12px] text-text-muted hover:border-accent hover:text-accent"
                    >
                      <Plus size={12} />
                      添加
                    </Button>
                  </div>
                </EntityCardContent>
              </EntityCard>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-accent" />
            <h2 className="text-sm font-semibold text-text-primary">知识库 / Memory</h2>
          </div>
          <p className="text-[12px] text-text-secondary">
            将公司文档、风格指南或业务知识注入分身记忆，增强背景理解与输出一致性。
          </p>
          <ul className="space-y-2">
            {MEMORY_SOURCES.map((m) => (
              <li key={m.name}>
                <EntityCard>
                  <EntityCardHeader className="items-center justify-between">
                    <div className="flex items-center gap-3">
                      <EntityCardMedia className="h-9 w-9 rounded-lg bg-surface-3">
                        <FileText size={16} className="text-text-muted" />
                      </EntityCardMedia>
                      <div>
                        <EntityCardTitle className="text-[13px]">{m.name}</EntityCardTitle>
                        <EntityCardDescription className="text-[11px]">
                          {m.count} 条
                        </EntityCardDescription>
                      </div>
                    </div>
                    <Button variant="outline" size="xs" className="px-3 py-1.5">
                      管理
                    </Button>
                  </EntityCardHeader>
                  <EntityCardFooter className="justify-between">
                    <EntityCardMeta className="mt-0">
                      {m.type === "doc" ? "文档知识源" : "Memory 条目"}
                    </EntityCardMeta>
                  </EntityCardFooter>
                </EntityCard>
              </li>
            ))}
          </ul>
          <Button
            variant="outline"
            className="w-full rounded-xl border-dashed py-3 h-auto text-[12px] text-text-muted hover:border-accent hover:text-accent"
          >
            <Plus size={14} />
            添加知识源
          </Button>
        </section>
      </div>
    </div>
  );
}
