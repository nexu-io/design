import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  PageHeader,
  SectionHeader,
  Separator,
  StatCard,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TextLink,
  cn,
} from "@nexu-design/ui-web";
import {
  BarChart3,
  Download,
  ExternalLink,
  GitFork,
  Globe,
  KeyRound,
  Rocket,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { useState } from "react";

const TAB_ITEMS = [
  { value: "overview", label: "概览", icon: BarChart3 },
  { value: "content", label: "内容营销", icon: Sparkles },
  { value: "devrel", label: "开发者运营", icon: Wrench },
  { value: "seo", label: "SEO", icon: Search },
  { value: "product", label: "增长产品需求", icon: Rocket },
] as const;

function ChartPlaceholder({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Card variant="static" padding="lg" className="min-h-[220px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-[var(--color-text-heading)]">
          {title}
        </CardTitle>
        {subtitle ? (
          <CardDescription className="text-[var(--color-text-muted)]">{subtitle}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "flex h-[148px] items-center justify-center rounded-lg border border-dashed",
            "border-[var(--color-border-subtle)] bg-[var(--color-surface-2)]/40",
            "text-sm text-[var(--color-text-muted)]",
          )}
        >
          接入数据后在此渲染图表
        </div>
      </CardContent>
    </Card>
  );
}

function FocusCard({
  title,
  owner,
  badge,
}: {
  title: string;
  owner: string;
  badge: string;
}) {
  return (
    <Card variant="outline" padding="md" className="h-full">
      <CardHeader className="space-y-2 pb-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" size="xs">
            {badge}
          </Badge>
          <span className="text-xs text-[var(--color-text-tertiary)]">{owner}</span>
        </div>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="h-2 w-3/4 rounded bg-[var(--color-surface-3)]" />
          <div className="h-2 w-full rounded bg-[var(--color-surface-3)]" />
          <div className="h-2 w-[84%] rounded bg-[var(--color-surface-3)]" />
        </div>
        <p className="mt-3 text-xs text-[var(--color-text-muted)]">
          示例骨架；可替换为实时摘要组件
        </p>
      </CardContent>
    </Card>
  );
}

function PipelineItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-1)] p-4">
      <div className="text-sm font-medium text-[var(--color-text-primary)]">{title}</div>
      <p className="mt-1 text-xs text-[var(--color-text-secondary)] leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default function GrowthOpsDashboard() {
  const [tab, setTab] = useState<string>("overview");
  const [token, setToken] = useState("");

  return (
    <div className="min-h-full bg-[var(--color-surface-0)] text-[var(--color-text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-0)]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <PageHeader
            title="nexu 增长数据大屏"
            description={
              <span className="text-[var(--color-text-secondary)]">
                开源进度与增长指标一览 · 目标 10,000 Stars（示例布局，数据可对接 GitHub / 内部 API）
              </span>
            }
            actions={
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://github.com/nexu-io/nexu"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5"
                >
                  nexu-io/nexu
                  <ExternalLink size={14} />
                </a>
              </Button>
            }
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-muted)]">
              <Badge variant="secondary" size="xs">
                设计系统参考
              </Badge>
              <span>对齐 Vercel 看板信息架构 · 使用 @nexu-design/ui-web</span>
            </div>
            <div className="flex w-full max-w-md flex-col gap-1.5 sm:w-auto">
              <label
                className="text-xs font-medium text-[var(--color-text-secondary)]"
                htmlFor="gh-token"
              >
                GitHub Token（repo）
              </label>
              <Input
                id="gh-token"
                type="password"
                size="sm"
                placeholder="用于流量等敏感接口…"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
        <Tabs value={tab} onValueChange={setTab} className="w-full space-y-8">
          <TabsList
            variant="underline"
            className="flex h-auto w-full flex-wrap justify-start gap-0 p-0 sm:flex-nowrap"
          >
            {TAB_ITEMS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                variant="underline"
                className="gap-1.5 text-xs sm:text-sm"
              >
                <Icon size={14} className="shrink-0 opacity-70" aria-hidden />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="mt-0 space-y-10 outline-none">
            <section className="space-y-4">
              <SectionHeader
                title={
                  <h2 className="text-lg font-semibold text-[var(--color-text-heading)]">
                    STAR 目标
                  </h2>
                }
              />
              <Card
                variant="outline"
                padding="lg"
                className="border-[var(--color-border-card)] shadow-[var(--shadow-card)]"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Star size={20} className="text-[var(--color-warning)]" aria-hidden />
                      <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                        当前 / 目标
                      </span>
                    </div>
                    <p className="text-4xl font-bold tracking-tight text-[var(--color-text-heading)] sm:text-5xl">
                      3,842
                      <span className="text-2xl font-semibold text-[var(--color-text-tertiary)] sm:text-3xl">
                        {" "}
                        / 10,000
                      </span>
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      剩余 <strong className="text-[var(--color-text-secondary)]">48</strong> 天 ·
                      需 <strong className="text-[var(--color-text-secondary)]">128</strong> / 天 ·
                      当前 <strong className="text-[var(--color-success)]">156</strong> / 天
                    </p>
                  </div>
                  <div className="grid w-full max-w-sm grid-cols-2 gap-3 sm:grid-cols-2">
                    <StatCard
                      label="需达成 / 天"
                      value="128"
                      variant="outline"
                      padding="sm"
                      tone="warning"
                      icon={TrendingUp}
                    />
                    <StatCard
                      label="7 日净增"
                      value="+1.1k"
                      variant="outline"
                      padding="sm"
                      tone="success"
                      trend={{ label: "↑ 12%", variant: "success" }}
                      icon={BarChart3}
                    />
                  </div>
                </div>
              </Card>
            </section>

            <section className="space-y-4">
              <SectionHeader
                title={
                  <h2 className="text-lg font-semibold text-[var(--color-text-heading)]">健康度</h2>
                }
              />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  label="Stars"
                  value="3,842"
                  icon={Star}
                  tone="default"
                  variant="outline"
                  trend={{ label: "+2.4%", variant: "success" }}
                />
                <StatCard
                  label="Forks"
                  value="412"
                  icon={GitFork}
                  tone="default"
                  variant="outline"
                />
                <StatCard
                  label="Open issues"
                  value="23"
                  icon={BarChart3}
                  tone="warning"
                  variant="outline"
                  meta={<span className="text-xs">首响 SLA：24h 内</span>}
                />
                <StatCard
                  label="Downloads"
                  value="12.4k"
                  icon={Download}
                  tone="success"
                  variant="outline"
                />
              </div>
            </section>

            <section className="space-y-4">
              <SectionHeader
                title={
                  <h2 className="text-lg font-semibold text-[var(--color-text-heading)]">
                    趋势数据
                  </h2>
                }
              />
              <div className="grid gap-4 lg:grid-cols-2">
                <ChartPlaceholder title="Star 增量趋势（14 天）" />
                <ChartPlaceholder title="流量趋势 + 来源" subtitle="需有效 Token 后展示" />
              </div>
            </section>

            {!token.trim() ? (
              <Alert variant="default" className="border-[var(--color-border-subtle)]">
                <KeyRound size={16} />
                <AlertTitle>需要 GitHub Token</AlertTitle>
                <AlertDescription>
                  在页首输入具备{" "}
                  <code className="rounded bg-[var(--color-surface-2)] px-1">repo</code> 权限的
                  Token 以查看流量等敏感指标（与线上一致的行为）。
                </AlertDescription>
              </Alert>
            ) : null}

            <section className="space-y-4">
              <SectionHeader
                title={
                  <h2 className="text-lg font-semibold text-[var(--color-text-heading)]">
                    今日焦点
                  </h2>
                }
              />
              <div className="grid gap-4 md:grid-cols-3">
                <FocusCard title="内容营销要点" owner="Joey" badge="内容" />
                <FocusCard title="开发者运营要点" owner="麒麟" badge="DevRel" />
                <FocusCard title="SEO 要点" owner="李林欣" badge="SEO" />
              </div>
            </section>

            <section className="space-y-4">
              <SectionHeader
                title={
                  <h2 className="text-lg font-semibold text-[var(--color-text-heading)]">
                    社区 & 版本
                  </h2>
                }
              />
              <div className="grid gap-4 lg:grid-cols-2">
                <ChartPlaceholder title="贡献者分布" />
                <ChartPlaceholder title="下载统计（最近版本）" />
              </div>
            </section>
          </TabsContent>

          <TabsContent value="content" className="mt-0 space-y-8 outline-none">
            <Card variant="outline" padding="lg">
              <CardHeader>
                <CardTitle className="text-[var(--color-text-heading)]">
                  内容营销 & 自动化管线
                </CardTitle>
                <CardDescription>负责人：Joey · 𝕏 与矩阵账号示例数据</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard
                    label="官方 @nexu06"
                    value="—"
                    variant="outline"
                    padding="sm"
                    icon={Globe}
                  />
                  <StatCard label="CEO @tuturetom" value="3.2万" variant="outline" padding="sm" />
                  <StatCard label="Joey @JoyLi629" value="228" variant="outline" padding="sm" />
                  <StatCard
                    label="活跃矩阵账号"
                    value="3"
                    variant="outline"
                    padding="sm"
                    tone="default"
                  />
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-semibold text-[var(--color-text-heading)]">
                    今日推荐选题
                  </h3>
                  <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-[var(--color-text-secondary)]">
                    <li>蒸馏 Skill：如何用 nexu 把同事的专业知识变成 AI Agent</li>
                    <li>Agent-Native IM vs 传统 AI 助手：为什么 nexu 选择了不同的路</li>
                    <li>从 0 到 1 搭建开源 Agent 生态的实战经验</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-[var(--color-text-heading)]">
                    内容自动化管线
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <PipelineItem
                      title="公众号 · WeWrite"
                      description="选题 → 写作 → 配图 → 排版 → 推送"
                    />
                    <PipelineItem
                      title="Twitter / X"
                      description="Agent Reach + post-to-x：Thread、Article"
                    />
                    <PipelineItem title="小红书" description="XHS MCP：发布、趋势、评论" />
                    <PipelineItem title="视频" description="Medeo + LiblibAI：生成与封面" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devrel" className="mt-0 space-y-6 outline-none">
            <Card variant="outline" padding="lg">
              <CardHeader>
                <CardTitle className="text-[var(--color-text-heading)]">开发者运营</CardTitle>
                <CardDescription>负责人：麒麟 · Issue、贡献者、版本发布区块</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <ChartPlaceholder title="运营事件时间线" />
                <ChartPlaceholder title="Issue 统计" />
                <ChartPlaceholder title="贡献者 & 版本" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="mt-0 space-y-6 outline-none">
            <Card variant="outline" padding="lg">
              <CardHeader>
                <CardTitle className="text-[var(--color-text-heading)]">SEO</CardTitle>
                <CardDescription>
                  负责人：李林欣 · 团队可通过 PR 更新{" "}
                  <code className="rounded bg-[var(--color-surface-2)] px-1 text-xs">
                    data/events.json
                  </code>
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 lg:grid-cols-2">
                <ChartPlaceholder title="SEO 事件" />
                <ChartPlaceholder title="SEO 指标" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="product" className="mt-0 space-y-6 outline-none">
            <Card variant="outline" padding="lg">
              <CardHeader>
                <CardTitle className="text-[var(--color-text-heading)]">增长产品需求</CardTitle>
                <CardDescription>负责人：Eli · 链接到 GitHub Project</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href="https://github.com/orgs/nexu-io/projects/3/views/8"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5"
                  >
                    打开 Roadmap
                    <ExternalLink size={14} />
                  </a>
                </Button>
                <p className="mt-4 text-sm text-[var(--color-text-muted)]">
                  可将项目视图嵌入为只读卡片或同步 checklist。
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <footer className="border-t border-[var(--color-border-subtle)] pt-8 text-center text-xs text-[var(--color-text-tertiary)]">
          本页为设计系统演示，非生产数据。正式环境请参考{" "}
          <TextLink
            href="https://nexu-dashboard-six.vercel.app"
            variant="muted"
            size="xs"
            target="_blank"
            rel="noreferrer"
          >
            nexu-dashboard-six.vercel.app
          </TextLink>
          。
        </footer>
      </main>
    </div>
  );
}
