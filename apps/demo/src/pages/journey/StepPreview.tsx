import { Bell, Brain, Check, Globe, MessageSquare, Sparkles, Star, Users, Zap } from "lucide-react";
import ChatCardGroup from "../product/ChatCards";
import type { ChatCard } from "../product/sessionsData";

function FeishuMsg({
  from,
  name,
  avatar,
  children,
  time,
}: {
  from: "user" | "clone" | "other";
  name?: string;
  avatar?: string;
  children: React.ReactNode;
  time?: string;
}) {
  const isUser = from === "user";
  return (
    <div className={`flex gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
      <div className="w-7 h-7 rounded-lg bg-surface-3 flex items-center justify-center text-sm shrink-0">
        {avatar || (from === "clone" ? "😊" : "👤")}
      </div>
      <div className={`max-w-[75%] ${isUser ? "items-end" : ""}`}>
        {name && <div className="text-[9px] text-text-muted mb-0.5">{name}</div>}
        <div
          className={`rounded-lg px-3 py-2 text-[11px] leading-relaxed ${
            isUser
              ? "bg-[#4f83f1] text-white rounded-tr-sm"
              : from === "clone"
                ? "bg-clone/10 border border-clone/20 text-text-primary rounded-tl-sm"
                : "bg-surface-1 border border-border text-text-primary rounded-tl-sm"
          }`}
        >
          {children}
        </div>
        {time && <div className="text-[8px] text-text-muted mt-0.5">{time}</div>}
      </div>
    </div>
  );
}

const PREVIEW_CARDS: Record<string, ChatCard[]> = {
  digest: [
    {
      type: "automation",
      title: "今日战况复盘",
      status: "success",
      body: "✅ 完成任务 12 个\n📄 生成文档 3 份\n🧠 新增记忆 5 条\n📈 对齐率 73% → 75%",
      path: "automation/daily-digest.yaml",
      actions: [{ label: "查看详情", primary: true }],
    },
    {
      type: "memory",
      title: "3 条记忆需确认",
      status: "warning",
      body: "发现矛盾记忆，需要你来定夺",
      path: "memory/conflicts/",
      actions: [{ label: "立即处理", primary: true }],
    },
  ],
  skill: [
    {
      type: "skill",
      title: "深度调研 · Web Research",
      status: "success",
      body: "检索 23 篇文章 + 5 个竞品",
      meta: "耗时 45s · 引用 23 篇",
    },
    {
      type: "file",
      title: "AI Agent 竞品分析报告",
      status: "success",
      body: "8,200 字 · 3 个关键发现：记忆壁垒、IM 入口、团队协作",
      path: "artifacts/research/ai-agent-market-2026.md",
      diff: { added: 389, removed: 0 },
      actions: [{ label: "查看报告", primary: true }],
    },
    {
      type: "automation",
      title: "竞品监控已创建",
      status: "success",
      body: "每天 09:00 自动检查竞品动态，有更新推送飞书",
      path: "automation/competitor-watch.yaml",
    },
  ],
  proactive: [
    {
      type: "automation",
      title: "截止日提醒",
      status: "warning",
      body: "数据库迁移 PR 今天到期。需要帮你拆解步骤吗？",
      actions: [{ label: "帮我拆解", primary: true }, { label: "延期" }],
    },
    {
      type: "memory",
      title: "灵感关联",
      status: "info",
      body: '你 3 天前说的"搜索加相关推荐"跟今天的优化方向很相关',
      meta: "根据 17 条相关记忆推荐",
      actions: [{ label: "合并处理", primary: true }],
    },
  ],
};

export default function StepPreview() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-text-primary">接入效果预览</h1>
        <p className="text-[13px] text-text-secondary mt-1">
          分身已上线，来看看它在各个场景中的表现
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Feishu group chat */}
        <div className="bg-surface-1 border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 bg-[#2b5fd9]/5 border-b border-border flex items-center gap-2">
            <span className="text-sm">🐦</span>
            <span className="text-[12px] font-medium text-text-primary">飞书 · 产品核心群</span>
            <span className="text-[9px] bg-surface-3 px-1.5 py-0.5 rounded text-text-muted ml-auto">
              6 人
            </span>
          </div>
          <div className="p-3 space-y-2.5 max-h-[360px] overflow-y-auto">
            <FeishuMsg from="other" name="老板" avatar="👔">
              @all 项目进度怎么样了？
            </FeishuMsg>
            <FeishuMsg from="clone" name="Tom 的分身" time="10:02">
              <div>我来帮 Tom 汇总 📊</div>
              <div className="mt-1.5 space-y-0.5 text-[10px]">
                <div>✅ 前端登录 — 已完成（王浩）</div>
                <div>🔄 接口对接 — 完成 60%（Tom）</div>
                <div>⏳ 支付模块 — 明天开始（陈杰）</div>
                <div className="text-warning">⚠️ 风险：接口对接需要等第三方升级</div>
              </div>
              <div className="mt-1.5 text-[9px] text-text-muted">
                数据来自本周 12 次对话 + Linear
              </div>
            </FeishuMsg>
            <FeishuMsg from="other" name="李薇" avatar="👩‍💼">
              你这 AI 同事太强了……怎么弄的？
            </FeishuMsg>
            <FeishuMsg from="user" avatar="🧑‍💻" time="10:05">
              加个机器人，3 分钟搞定 😏
            </FeishuMsg>
          </div>
        </div>

        {/* Daily digest card — using standardized ChatCards */}
        <div className="bg-surface-1 border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 bg-clone/5 border-b border-border flex items-center gap-2">
            <span className="text-sm">📊</span>
            <span className="text-[12px] font-medium text-text-primary">飞书 · 今日战况复盘</span>
            <span className="text-[9px] bg-clone/10 text-clone px-1.5 py-0.5 rounded ml-auto">
              自动推送
            </span>
          </div>
          <div className="p-3 space-y-2.5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-clone/10 flex items-center justify-center text-[10px]">
                😊
              </div>
              <span className="text-[10px] font-semibold text-text-primary">我的分身</span>
              <span className="text-[8px] px-1 py-0.5 bg-clone/10 text-clone rounded">BOT</span>
              <span className="text-[9px] text-text-muted">22:00</span>
            </div>
            <ChatCardGroup cards={PREVIEW_CARDS.digest} />
          </div>
        </div>

        {/* Proactive alert — using standardized ChatCards */}
        <div className="bg-surface-1 border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border flex items-center gap-2">
            <Bell size={13} className="text-warning" />
            <span className="text-[12px] font-medium text-text-primary">主动提醒</span>
            <span className="text-[9px] bg-warning-subtle text-warning px-1.5 py-0.5 rounded ml-auto">
              Proactive
            </span>
          </div>
          <div className="p-3 space-y-2.5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-clone/10 flex items-center justify-center text-[10px]">
                😊
              </div>
              <span className="text-[10px] font-semibold text-text-primary">我的分身</span>
              <span className="text-[9px] text-text-muted">09:15 ~ 16:30</span>
            </div>
            <ChatCardGroup cards={PREVIEW_CARDS.proactive} />
          </div>
        </div>

        {/* Skill execution in IM — with ChatCards */}
        <div className="bg-surface-1 border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border flex items-center gap-2">
            <Sparkles size={13} className="text-clone" />
            <span className="text-[12px] font-medium text-text-primary">IM 中使用 Skills</span>
            <span className="text-[9px] bg-clone/10 text-clone px-1.5 py-0.5 rounded ml-auto">
              Skills
            </span>
          </div>
          <div className="p-3 space-y-2.5">
            <FeishuMsg from="user" avatar="🧑‍💻" time="11:00">
              帮我做一份 AI 赛道的竞品分析，然后设个每天自动监控
            </FeishuMsg>
            <FeishuMsg from="clone" name="我的分身" time="11:01">
              收到，开始调研 📂
            </FeishuMsg>
            <div className="ml-9">
              <ChatCardGroup cards={PREVIEW_CARDS.skill} />
            </div>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="mt-6 bg-surface-1 border border-border rounded-xl p-5">
        <div className="text-[12px] font-medium text-text-primary mb-3">完整用户旅程 — 已走完</div>
        <div className="grid grid-cols-7 gap-2">
          {[
            { icon: Globe, label: "Landing", status: "了解产品" },
            { icon: MessageSquare, label: "Onboarding", status: "初始化分身" },
            { icon: Users, label: "分身入口", status: "Feeds 动态" },
            { icon: Brain, label: "Session", status: "对话协作" },
            { icon: Zap, label: "Automation", status: "自动化 + Skills" },
            { icon: Star, label: "IM 接入", status: "飞书 / Slack" },
            { icon: Sparkles, label: "上线运行", status: "全天候工作" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center mb-1.5">
                <Check size={14} className="text-white" />
              </div>
              <div className="text-[10px] font-medium text-text-primary">{s.label}</div>
              <div className="text-[9px] text-text-muted">{s.status}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-border text-center">
          <div className="text-[13px] text-text-primary font-medium mb-1">
            分身已上岗，从此越用越懂你 🎉
          </div>
          <div className="text-[11px] text-text-muted">
            记忆跨平台同步 · 自动任务全天运转 · 群聊协作天然传播
          </div>
        </div>
      </div>
    </div>
  );
}
