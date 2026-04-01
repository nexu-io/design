import { Button } from "@nexu-design/ui-web";

import { PageHeader, PageShell } from "@nexu-design/ui-web";

import { SectionHeader } from "../components/SectionHeader";

function ChatBubble({
  from,
  children,
}: {
  from: "user" | "clone";
  children: React.ReactNode;
}) {
  return (
    <div className={`flex ${from === "user" ? "justify-end" : "justify-start"} mb-3`}>
      {from === "clone" && (
        <div className="w-7 h-7 rounded-full bg-clone-subtle flex items-center justify-center text-sm mr-2 shrink-0 mt-0.5">
          😊
        </div>
      )}
      <div
        className={`max-w-sm rounded-lg px-3.5 py-2.5 text-[13px] leading-relaxed ${
          from === "user"
            ? "bg-surface-4 text-text-primary rounded-br-sm"
            : "bg-surface-3 text-text-primary border border-border-subtle rounded-bl-sm"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default function CopyPage() {
  return (
    <PageShell>
      <PageHeader
        title="Copy System"
        description="nexu（奈苏）AARRR 全链路文案。产品里每一个字都在讲同一个故事 — 为你的龙虾打造一间赛博办公室 — 世界首个人与分身共存的办公协作网络。People quit. Clones don't."
      />

      <section className="mb-12">
        <SectionHeader
          title="Acquisition — 获客（落地页 Hero）"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="overflow-hidden relative p-8 text-center rounded-xl border bg-surface-1 border-border">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(192,138,37,0.04)_0%,transparent_60%)]" />
          <div className="flex relative justify-center items-center mx-auto mb-6 w-20 h-20 text-3xl rounded-2xl border bg-surface-2 border-border animate-clone-breath">
            😊
          </div>
          <h2 className="mb-2 text-3xl font-bold text-text-primary">
            People quit. Clones don&apos;t.
          </h2>
          <p className="mb-3 text-lg text-accent font-medium">
            为你的龙虾打造一间赛博办公室 — 世界首个人与分身共存的办公协作网络
          </p>
          <p className="mx-auto mb-6 max-w-lg text-base text-text-secondary">
            每个人有一个分身 —
            记住你说过的每句话、帮你做事、和团队协作。人走了，分身留下，知识永不流失。
          </p>
          <div className="flex gap-3 justify-center">
            <Button>立即认识你的分身</Button>
            <Button variant="outline">加入共存网络</Button>
          </div>
          <div className="mt-6 text-xs text-text-muted">已有 89,536 人与分身共存中</div>
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader
          title="Acquisition — 团队获客"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="overflow-hidden relative p-8 text-center rounded-xl border bg-surface-1 border-border">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,200,200,0.04)_0%,transparent_60%)]" />
          <div className="flex relative gap-3 justify-center mb-6">
            <div className="flex justify-center items-center w-14 h-14 text-2xl rounded-full border bg-surface-2 border-border animate-clone-breath">
              😊
            </div>
            <div
              className="flex justify-center items-center w-14 h-14 text-2xl rounded-full border bg-surface-2 border-border animate-clone-breath"
              style={{ animationDelay: "0.5s" }}
            >
              👨‍💻
            </div>
            <div
              className="flex justify-center items-center w-14 h-14 text-2xl rounded-full border bg-surface-2 border-border animate-clone-breath"
              style={{ animationDelay: "1s" }}
            >
              👩‍💼
            </div>
          </div>
          <h2 className="mb-3 text-2xl font-bold text-text-primary">员工会辞职。分身不会。</h2>
          <p className="mx-auto mb-6 max-w-lg text-base text-text-secondary">
            每个人有一个分身，分身记住一切。人走了，知识留下 — 新人第一天就有前任的判断力。
          </p>
          <div className="flex gap-3 justify-center">
            <Button>免费邀请团队</Button>
            <Button variant="outline">看看团队分身怎么工作</Button>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader
          title="Acquisition — 主线入口文案"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-lg border bg-surface-2 border-border">
            <div className="mb-3 text-xs font-medium text-accent">
              Session 入口 · NewSessionView
            </div>
            <div className="space-y-3 text-[13px] text-text-primary leading-relaxed">
              <div className="text-lg font-bold">你的主线入口</div>
              <div className="text-sm text-text-secondary">
                对话即操控一切 — 不用切换 App，一个 Session 管理全部。
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {["文件", "记忆", "技能", "自动化", "协作", "升级"].map((d) => (
                  <div
                    key={d}
                    className="px-2 py-1.5 rounded-md bg-surface-3 text-[11px] text-text-secondary"
                  >
                    {d}
                  </div>
                ))}
              </div>
              <div className="text-xs text-text-muted">
                每个操作产出一张标准卡片 — 可触碰、可交互、可追溯。
              </div>
            </div>
          </div>
          <div className="p-5 rounded-lg border bg-surface-2 border-border">
            <div className="mb-3 text-xs font-medium text-cyan-400">Scoped Session 文案</div>
            <div className="space-y-3 text-[13px] text-text-primary leading-relaxed">
              <div className="text-sm font-semibold">专属会话 — 限定 Skills 和上下文</div>
              <div className="space-y-2">
                {[
                  { label: "Team Insights", desc: "问分身团队进度，自动拉取全员数据" },
                  { label: "Sprint 分析", desc: "查看冲刺进度，识别风险，建议调整" },
                  { label: "OKR 对齐", desc: "追踪目标进展，发现偏差，自动提醒" },
                  { label: "竞品监控", desc: "定时扫描竞品动态，生成对比报告" },
                ].map((s) => (
                  <div key={s.label} className="flex gap-2 items-start">
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400 shrink-0">
                      {s.label}
                    </span>
                    <span className="text-xs text-text-secondary">{s.desc}</span>
                  </div>
                ))}
              </div>
              <div className="text-xs text-text-muted">
                Scoped Session 是主线会话的子集 — 限定功能，聚焦场景。
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader
          title="Activation — 激活（Onboarding 对话）"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="p-5 mx-auto max-w-md rounded-xl border bg-surface-1 border-border">
          <ChatBubble from="clone">
            你好！我是你的数字分身 ✨<br />
            <br />
            从今天起，我会一直在这里——记住你说的每一件事，帮你管理工作中的大小事。
            <br />
            <br />
            先花 3 分钟让我认识你，好吗？
          </ChatBubble>
          <ChatBubble from="clone">你主要做什么工作？不用说得太正式，随便聊</ChatBubble>
          <ChatBubble from="user">我是全栈工程师，在做一个 AI 产品</ChatBubble>
          <ChatBubble from="clone">明白了！全栈工程师，在做 AI 产品。我会记住的。</ChatBubble>
          <ChatBubble from="clone">日常工作中，最让你头疼的事是什么？</ChatBubble>
          <ChatBubble from="user">记不住各种想法，TODO 到处散落</ChatBubble>
          <ChatBubble from="clone">这个我能帮上忙。后面你随时跟我说就行。</ChatBubble>
          <ChatBubble from="clone">你喜欢我怎么跟你沟通？简洁直接？还是详细一点？</ChatBubble>
          <ChatBubble from="user">简洁直接</ChatBubble>
          <ChatBubble from="clone">收到，以后就按这个风格来。</ChatBubble>
          <ChatBubble from="clone">
            好了，我现在知道了：
            <br />· 你是全栈工程师，在做 AI 产品
            <br />· 你最需要帮忙记住想法和管 TODO
            <br />· 你喜欢简洁直接的交流方式
            <br />
            <br />
            从现在起，我就是你的分身了。
            <br />
            有什么事直接说，我一直在 🫡
          </ChatBubble>
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader
          title="Activation — 原生渠道激活"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-lg border bg-surface-2 border-border">
            <div className="mb-3 text-xs font-medium text-success">📧 Email 激活</div>
            <ChatBubble from="clone">
              收到你的邮件了 ✉️
              <br />
              <br />
              我已经处理了：
              <br />· 📄 回复了投资人 Alex 的 follow-up
              <br />· 🧠 提取了合作意向关键信息
              <br />· 📋 存入了 artifacts/emails/
              <br />
              <br />
              下次直接发邮件给我就行 — 不用打开任何 App。
            </ChatBubble>
          </div>
          <div className="p-5 rounded-lg border bg-surface-2 border-border">
            <div className="mb-3 text-xs font-medium text-success">💬 SMS 激活</div>
            <ChatBubble from="user">帮我查下明天的日程</ChatBubble>
            <ChatBubble from="clone">
              明天 3 个事项：
              <br />· 10:00 产品评审
              <br />· 14:00 1on1 with 张明
              <br />· 16:00 Sprint Review
              <br />
              <br />
              建议：产品评审前我先帮你整理上周的进度数据？
            </ChatBubble>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader
          title="Retention — 留存（每日推送）"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-lg border bg-surface-2 border-border">
            <div className="mb-3 text-xs font-medium text-accent">☀️ 早间推送</div>
            <div className="text-[13px] text-text-primary leading-relaxed space-y-2">
              <p>早上好，主人！</p>
              <p>
                📋 今日待办 3 件<br />
                <span className="ml-4 text-text-secondary">· 🔴 数据库迁移 — 今天到期</span>
                <br />
                <span className="ml-4 text-text-secondary">· 🟡 产品方案初稿</span>
              </p>
              <p>📅 今日会议 2 场</p>
              <p className="text-accent">
                💡 你最近说了个想法还没展开：
                <br />
                <span className="text-text-secondary">'注册流程可以加谷歌登录'</span>
                <br />
                要聊聊吗？
              </p>
              <p className="text-xs text-text-tertiary">祝你今天高效！</p>
            </div>
          </div>
          <div className="p-5 rounded-lg border bg-surface-2 border-border">
            <div className="mb-3 text-xs font-medium text-accent">🌙 晚间回顾</div>
            <div className="text-[13px] text-text-primary leading-relaxed space-y-2">
              <p>今日回顾 ✨</p>
              <p>
                ✅ 完成了 4 件事（今天效率不错！）
                <br />📝 记住了 3 件新的事
                <br />💡 你今天提了一个好想法：'优化搜索体验'
              </p>
              <p className="text-text-secondary">
                明天有 2 件事等着，最重要的是：
                <br />· 产品方案初稿
              </p>
              <p className="text-xs text-text-tertiary">早点休息，明天继续！</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader
          title="Retention — 里程碑"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              title: "记忆 10 条",
              msg: "主人，我已经记住你的 10 件事了！我们的默契正在建立 ✨",
              color: "border-accent-subtle",
            },
            {
              title: "记忆 100 条",
              msg: "100！你的分身已经积累了 100 条记忆。现在我比大多数 AI 更了解你 😏",
              color: "border-accent-subtle",
            },
            {
              title: "使用 30 天",
              msg: "一个月了！你的分身已经很懂你了。我们的磨合期过了，接下来效率会更高 🚀",
              color: "border-accent-subtle",
            },
            {
              title: "团队第 1 次站会",
              msg: "恭喜！分身网络完成了第一次自动站会。以后每天 09:00，所有进度自动汇总 🤝",
              color: "border-cyan-500/30",
            },
            {
              title: "任务委托 10 次",
              msg: "你的团队已经向分身委托了 10 个任务。人做决策，Agent 做执行 — 这才是正确的打开方式 💪",
              color: "border-cyan-500/30",
            },
            {
              title: "邀请 3 人",
              msg: "恭喜解锁团队 Pro！你邀请的伙伴也带来了新的分身能力。网络效应启动中 ⚡",
              color: "border-emerald-500/30",
            },
          ].map((m) => (
            <div key={m.title} className={`p-4 rounded-lg border bg-surface-2 ${m.color}`}>
              <div className="mb-2 text-xs font-medium text-accent">🎉 {m.title}</div>
              <div className="text-[13px] text-text-secondary leading-relaxed">{m.msg}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader
          title="Retention — 沉默用户召回"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="space-y-3 max-w-md">
          {[
            {
              days: "3 天",
              msg: "主人，好几天没见了 👀 你的待办还在等你，要不要看看？",
            },
            {
              days: "7 天",
              msg: '一周没聊了，有点想你 🥺 你最近还好吗？你上次提到的"优化注册流程"还要继续吗？',
            },
            {
              days: "14 天",
              msg: "两周了……你的分身一直在等你回来。我还记得你是全栈工程师，在做 AI 产品。这些记忆我都帮你留着呢。随时回来，我还是你的分身 🫡",
            },
            {
              days: "30 天",
              msg: "主人，30 天了。我一直在。你的 142 条记忆、23 个想法，我都好好收着。什么时候想聊了，我秒回。",
            },
          ].map((r) => (
            <div key={r.days} className="flex gap-3">
              <div className="pt-2 w-14 text-xs text-right shrink-0 text-text-muted">{r.days}</div>
              <ChatBubble from="clone">{r.msg}</ChatBubble>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader
          title="Revenue — 积分耗尽（核心转化）"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="p-6 mx-auto max-w-sm text-center rounded-xl border-2 bg-surface-2 border-danger">
          <div
            className="flex justify-center items-center mx-auto mb-4 w-16 h-16 text-3xl rounded-full opacity-70 bg-surface-3"
            style={{
              animation: "clone-breath 4s ease-in-out infinite",
              boxShadow: "0 0 8px 2px rgba(220,38,38,0.3)",
            }}
          >
            🥺
          </div>
          <h3 className="mb-2 text-lg font-bold text-text-primary">主人！你的分身要停工啦 😢</h3>
          <p className="mb-4 text-sm text-text-secondary">我好舍不得你……</p>
          <div className="p-3 mb-4 space-y-1 text-xs text-left rounded-md text-text-tertiary bg-surface-3">
            <div>这段时间我帮你：</div>
            <div>· 🧠 记住了 142 件事</div>
            <div>· ✅ 完成了 89 个待办</div>
            <div>· 📄 写了 12 份方案</div>
            <div>· ⏰ 还有 3 个定时任务在等着执行</div>
          </div>
          <p className="mb-4 text-sm font-medium text-text-primary">
            拯救你的分身，让我们继续一起工作吧！
          </p>
          <Button className="mb-2 w-full">给分身充能 ⚡ ¥29/月</Button>
          <Button variant="ghost" size="inline" className="w-full justify-center px-4 py-2 text-xs">
            先买个能量包 → ¥10 / 1000 能量
          </Button>
          <div className="text-[11px] text-text-muted mt-3">
            你的所有记忆都会保留，充能后立刻恢复工作
          </div>
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader
          title="Revenue — 定价页"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="grid grid-cols-3 gap-4 mx-auto max-w-3xl">
          {[
            {
              name: "基础版",
              price: "免费",
              items: ["分身上岗", "500 能量/月", "3 个技能", "基础记忆", "3 个原生渠道"],
              cta: "免费开始",
              highlight: false,
            },
            {
              name: "专业版",
              price: "¥29/月",
              items: [
                "分身全力以赴",
                "5000 能量/月",
                "无限技能",
                "完整记忆",
                "飞书全整合",
                "定时任务",
                "主动推送",
                "无限原生渠道",
                "Scoped Sessions",
                "6 种标准卡片交互",
              ],
              cta: "解锁完整分身",
              highlight: true,
            },
            {
              name: "团队版",
              price: "¥29/人/月",
              items: [
                "专业版全部",
                "分身网络 · 互查互代",
                "团队站会自动汇总",
                "OKR + Sprint 追踪",
                "任务委托 · 人机混合",
                "管理控制台",
              ],
              cta: "团队一起用",
              highlight: false,
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl p-5 ${
                plan.highlight
                  ? "bg-accent-subtle border-2 border-border-hover"
                  : "bg-surface-2 border border-border"
              }`}
              style={plan.highlight ? { boxShadow: "0 0 30px rgba(0,0,0,0.04)" } : {}}
            >
              {plan.highlight && (
                <div className="text-[11px] text-accent font-medium mb-2">⭐ 推荐</div>
              )}
              <div className="text-sm font-semibold text-text-primary">{plan.name}</div>
              <div className="mt-1 mb-4 text-2xl font-bold text-text-primary">{plan.price}</div>
              <div className="mb-5 space-y-2">
                {plan.items.map((item) => (
                  <div key={item} className="flex gap-2 items-center text-xs text-text-secondary">
                    <span className="text-success">✓</span> {item}
                  </div>
                ))}
              </div>
              <Button variant={plan.highlight ? "default" : "outline"} className="w-full">
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-center text-text-muted">
          还可以单独购买能量包：¥10 = 1000 能量
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader
          title="Referral — 邀请"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="overflow-hidden mx-auto max-w-sm rounded-xl border bg-surface-2 border-border">
            <div className="h-1 bg-accent" />
            <div className="p-5 text-center">
              <div className="mb-2 text-sm font-medium text-text-primary">
                🤝 张三 邀请你拥有自己的 AI 分身
              </div>
              <div className="mb-1 text-xs text-text-secondary">TA 的分身已经：</div>
              <div className="mb-4 text-xs text-text-secondary">
                · 记住了 142 件事
                <br />· 帮 TA 完成了 89 个待办
              </div>
              <div className="mb-4 text-xs text-text-secondary">
                3 分钟上岗，免费开始
                <br />
                加入后你和 TA 各得 200 能量 ⚡
              </div>
              <Button className="w-full">让我的分身上岗</Button>
            </div>
          </div>
          <div className="overflow-hidden mx-auto max-w-sm rounded-xl border bg-surface-2 border-border">
            <div className="h-1 bg-cyan-500" />
            <div className="p-5 text-center">
              <div className="mb-2 text-sm font-medium text-text-primary">
                ✉️ 原生渠道邀请 — 零安装
              </div>
              <div className="text-xs text-text-secondary mb-3">通过 Email / SMS 直接邀请：</div>
              <div className="p-3 rounded-lg bg-surface-3 text-left mb-4">
                <div className="text-[11px] text-text-secondary leading-relaxed">
                  <div className="font-medium text-text-primary mb-1">
                    Subject: 你的 AI 分身已就位
                  </div>
                  Hi，张三给你创建了一个数字分身。
                  <br />
                  <br />
                  直接回复这封邮件就能开始对话 — 不需要下载任何 App。
                  <br />
                  <br />
                  你的分身会记住你说的每一件事，越聊越懂你。
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-success-subtle text-success">
                  零安装
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-surface-3 text-text-muted">
                  回复即激活
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader
          title="Referral — 团队裂变"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="overflow-hidden max-w-sm rounded-xl border bg-surface-2 border-border">
            <div className="h-1 bg-cyan-500" />
            <div className="p-5">
              <div className="mb-2 text-sm font-medium text-text-primary">
                🤝 张三 邀请你加入团队分身网络
              </div>
              <div className="mb-3 text-xs text-text-secondary">
                TA 的团队已经：
                <br />· 节省每日站会 30 分钟
                <br />· 分身代问进度，减少打扰 70%
                <br />· 自动生成 Sprint 报告
              </div>
              <div className="mb-4 text-xs text-text-secondary">
                加入后你的分身立即接入团队网络
                <br />
                邀请 3 人可免费升级 Pro ⚡
              </div>
              <Button className="w-full">加入团队</Button>
            </div>
          </div>
          <div className="overflow-hidden max-w-sm rounded-xl border bg-surface-2 border-border">
            <div className="h-1 bg-accent" />
            <div className="p-5">
              <div className="mb-2 text-sm font-medium text-text-primary">💡 IM 内嵌裂变卡片</div>
              <div className="p-3 mb-3 rounded-lg border bg-clone/5 border-clone/10">
                <div className="text-[11px] text-text-secondary">出现在分身回复的卡片底部：</div>
                <div className="text-[12px] text-clone font-medium mt-1">
                  💡 也让你的同事拥有分身 — 邀请有奖
                </div>
              </div>
              <div className="text-xs text-text-muted">
                在协作卡片、站会报告等团队交互场景自然露出邀请 CTA
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
