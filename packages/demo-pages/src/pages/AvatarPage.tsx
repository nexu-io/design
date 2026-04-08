import { Button } from "@nexu-design/ui-web";
import { PageHeader, PageShell } from "@nexu-design/ui-web";
import { useState } from "react";

import { SectionHeader } from "@nexu-design/ui-web";

const SKIN_TONES = [
  "#FDEBD0",
  "#F5CBA7",
  "#E6B88A",
  "#D4A574",
  "#C68E5E",
  "#A0785A",
  "#7D5E4A",
  "#5A3E36",
];
const _FACES = ["圆形", "椭圆", "方形", "心形", "长形", "菱形"];
const _EYES = ["圆眼", "杏眼", "狭长眼", "下垂眼", "大眼", "笑眼", "单眼皮", "戴眼镜"];
void _FACES;
void _EYES;
const HAIRS = [
  "短发整齐",
  "短发蓬松",
  "中长发",
  "长直发",
  "卷发",
  "马尾辫",
  "丸子头",
  "侧分",
  "背头",
  "寸头",
  "莫西干",
  "光头",
];
const HAIR_COLORS = [
  "#1a1a2e",
  "#3d2b1f",
  "#8b6914",
  "#d4a843",
  "#8b3a2f",
  "#9ca3af",
  "#3b82f6",
  "#8b5cf6",
];
const ACCESSORIES = ["无", "耳机", "圆框眼镜", "贝雷帽", "领带", "太阳镜", "蝴蝶结", "星星发卡"];
const EXPRESSIONS = [
  "😊 专注",
  "🤔 思考",
  "😄 开心",
  "😅 抱歉",
  "🥺 不舍",
  "😴 休息",
  "🤩 兴奋",
  "😏 自信",
];
const EXPR_EMOJI = ["😊", "🤔", "😄", "😅", "🥺", "😴", "🤩", "😏"];

const ROLE_PRESETS = [
  {
    role: "程序员",
    color: "#10b981",
    emoji: "💻",
    skin: 2,
    hair: 0,
    hairColor: 0,
    accessory: 1,
    expr: 0,
    desc: "耳机 + 专注",
  },
  {
    role: "运营/PM",
    color: "#3b82f6",
    emoji: "📊",
    skin: 1,
    hair: 7,
    hairColor: 2,
    accessory: 2,
    expr: 0,
    desc: "圆框眼镜 + 侧分",
  },
  {
    role: "设计师",
    color: "#ec4899",
    emoji: "🎨",
    skin: 0,
    hair: 5,
    hairColor: 7,
    accessory: 3,
    expr: 6,
    desc: "贝雷帽 + 兴奋",
  },
  {
    role: "创始人",
    color: "#f59e0b",
    emoji: "🚀",
    skin: 3,
    hair: 8,
    hairColor: 0,
    accessory: 4,
    expr: 7,
    desc: "领带 + 自信",
  },
  {
    role: "通用",
    color: "#8b5cf6",
    emoji: "✨",
    skin: 2,
    hair: 1,
    hairColor: 0,
    accessory: 0,
    expr: 0,
    desc: "默认",
  },
];

export default function AvatarPage() {
  const [skin, setSkin] = useState(2);
  const [hair, setHair] = useState(0);
  const [hairColor, setHairColor] = useState(0);
  const [accessory, setAccessory] = useState(0);
  const [expression, setExpression] = useState(0);

  const applyPreset = (p: (typeof ROLE_PRESETS)[0]) => {
    setSkin(p.skin);
    setHair(p.hair);
    setHairColor(p.hairColor);
    setAccessory(p.accessory);
    setExpression(p.expr);
  };

  return (
    <PageShell>
      <PageHeader
        title="Avatar System"
        description="每个用户的分身都有可自定义的 Avatar。7 层可组合，有状态、有表情、会成长。风格介于 Notion Avatar 和 Memoji 之间。"
      />

      <section className="mb-12">
        <SectionHeader
          title="Role Presets — 角色预设（一键选择）"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="grid grid-cols-5 gap-4">
          {ROLE_PRESETS.map((p) => (
            <button
              type="button"
              key={p.role}
              onClick={() => applyPreset(p)}
              className="p-5 text-center rounded-xl border transition-colors cursor-pointer bg-surface-2 border-border hover:border-border-hover group"
            >
              <div
                className="flex justify-center items-center mx-auto mb-3 w-20 h-20 text-3xl rounded-full animate-clone-breath"
                style={{
                  backgroundColor: SKIN_TONES[p.skin],
                  border: `3px solid ${p.color}`,
                }}
              >
                {EXPR_EMOJI[p.expr]}
              </div>
              <div className="text-sm font-medium text-text-primary">
                {p.emoji} {p.role}
              </div>
              <div className="text-[11px] text-text-tertiary mt-0.5">{p.desc}</div>
              <div className="text-[11px] font-medium mt-2 text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                选择
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader
          title="Avatar Editor — 捏脸编辑器"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="flex gap-8">
          {/* Preview */}
          <div className="w-64 shrink-0">
            <div className="sticky top-8 p-6 text-center rounded-xl border bg-surface-2 border-border">
              <div
                className="flex justify-center items-center mx-auto mb-4 w-28 h-28 text-4xl rounded-full animate-clone-breath"
                style={{ backgroundColor: SKIN_TONES[skin] }}
              >
                {EXPR_EMOJI[expression]}
              </div>
              <div className="space-y-1 text-xs text-text-tertiary">
                <div>发型: {HAIRS[hair]}</div>
                <div>配饰: {ACCESSORIES[accessory]}</div>
                <div>表情: {EXPRESSIONS[expression]}</div>
              </div>
              <Button size="sm" className="mt-4 w-full text-sm font-medium">
                保存
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 px-4 py-1.5 text-text-secondary text-xs hover:text-text-primary transition-colors"
                onClick={() => {
                  setSkin(Math.floor(Math.random() * SKIN_TONES.length));
                  setHair(Math.floor(Math.random() * HAIRS.length));
                  setHairColor(Math.floor(Math.random() * HAIR_COLORS.length));
                  setAccessory(Math.floor(Math.random() * ACCESSORIES.length));
                  setExpression(Math.floor(Math.random() * EXPRESSIONS.length));
                }}
              >
                随机生成 🎲
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex-1 space-y-6">
            <div>
              <div className="mb-2 text-xs font-medium text-text-secondary">肤色</div>
              <div className="flex gap-2">
                {SKIN_TONES.map((c, i) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setSkin(i)}
                    className={`w-9 h-9 rounded-full border-2 transition-all ${
                      skin === i
                        ? "border-accent scale-110"
                        : "border-transparent hover:border-border-hover"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs font-medium text-text-secondary">发型</div>
              <div className="flex flex-wrap gap-2">
                {HAIRS.map((h, i) => (
                  <button
                    type="button"
                    key={h}
                    onClick={() => setHair(i)}
                    className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
                      hair === i
                        ? "bg-accent text-accent-fg"
                        : "bg-surface-3 text-text-secondary hover:bg-surface-4"
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs font-medium text-text-secondary">发色</div>
              <div className="flex gap-2">
                {HAIR_COLORS.map((c, i) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setHairColor(i)}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${
                      hairColor === i
                        ? "border-accent scale-110"
                        : "border-transparent hover:border-border-hover"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs font-medium text-text-secondary">配饰</div>
              <div className="flex flex-wrap gap-2">
                {ACCESSORIES.map((a, i) => (
                  <button
                    type="button"
                    key={a}
                    onClick={() => setAccessory(i)}
                    className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
                      accessory === i
                        ? "bg-accent text-accent-fg"
                        : "bg-surface-3 text-text-secondary hover:bg-surface-4"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs font-medium text-text-secondary">默认表情</div>
              <div className="flex flex-wrap gap-2">
                {EXPRESSIONS.map((e, i) => (
                  <button
                    type="button"
                    key={e}
                    onClick={() => setExpression(i)}
                    className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
                      expression === i
                        ? "bg-accent text-accent-fg"
                        : "bg-surface-3 text-text-secondary hover:bg-surface-4"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader
          title="Avatar Sizes — 尺寸规范"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="flex gap-8 items-end">
          {[
            { size: 32, label: "IM 头像", radius: "9999px" },
            { size: 40, label: "侧边栏", radius: "9999px" },
            { size: 64, label: "状态卡片", radius: "9999px" },
            { size: 80, label: "个人页", radius: "16px" },
            { size: 120, label: "Onboarding", radius: "16px" },
            { size: 160, label: "落地页", radius: "20px" },
          ].map((s) => (
            <div key={s.size} className="text-center">
              <div
                className="flex justify-center items-center mx-auto bg-surface-3 animate-clone-breath"
                style={{
                  width: s.size,
                  height: s.size,
                  borderRadius: s.radius,
                  fontSize: Math.max(s.size * 0.35, 14),
                  backgroundColor: SKIN_TONES[skin],
                }}
              >
                {EXPR_EMOJI[expression]}
              </div>
              <div className="text-[11px] text-text-secondary mt-2">{s.size}px</div>
              <div className="text-[11px] text-text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader
          title="Clone Status Card — 分身状态卡片"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="p-5 max-w-xs rounded-xl border bg-surface-2 border-border">
          <div className="flex gap-4 items-center mb-4">
            <div
              className="flex justify-center items-center w-16 h-16 text-2xl rounded-full animate-clone-breath"
              style={{ backgroundColor: SKIN_TONES[skin] }}
            >
              {EXPR_EMOJI[expression]}
            </div>
            <div>
              <div className="text-sm font-semibold text-text-primary">我的分身</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-success" />
                <span className="text-xs text-text-secondary">在线 · 陪你 47 天</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-surface-3 rounded-md p-2.5 text-center">
              <div className="text-lg font-bold text-text-primary">142</div>
              <div className="text-[11px] text-text-muted">🧠 条记忆</div>
            </div>
            <div className="bg-surface-3 rounded-md p-2.5 text-center">
              <div className="text-lg font-bold text-text-primary">5</div>
              <div className="text-[11px] text-text-muted">📋 项技能</div>
            </div>
            <div className="bg-surface-3 rounded-md p-2.5 text-center">
              <div className="text-lg font-bold text-text-primary">89</div>
              <div className="text-[11px] text-text-muted">✅ 个完成</div>
            </div>
            <div className="bg-surface-3 rounded-md p-2.5 text-center">
              <div className="text-lg font-bold text-accent">3,200</div>
              <div className="text-[11px] text-text-muted">⚡ 能量</div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-text-secondary">了解你的程度</span>
              <span className="text-xs font-medium text-accent">72%</span>
            </div>
            <div className="overflow-hidden w-full h-2 rounded-full bg-surface-4">
              <div className="h-full rounded-full bg-accent" style={{ width: "72%" }} />
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader
          title="Team Status Card — 团队分身状态"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="p-5 max-w-xs rounded-xl border bg-surface-2 border-border">
          <div className="flex gap-4 items-center mb-4">
            <div
              className="flex justify-center items-center w-16 h-16 text-2xl rounded-full animate-clone-breath"
              style={{ backgroundColor: SKIN_TONES[skin] }}
            >
              {EXPR_EMOJI[expression]}
            </div>
            <div>
              <div className="text-sm font-semibold text-text-primary">我的分身</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-success" />
                <span className="text-xs text-text-secondary">在线 · 陪你 49 天</span>
              </div>
              <div className="flex gap-1 items-center mt-1">
                <span className="text-[9px] px-1.5 py-0.5 bg-clone/10 text-clone rounded-full font-medium">
                  Lv.3
                </span>
                <span className="text-[9px] px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 rounded-full">
                  团队版
                </span>
              </div>
            </div>
          </div>

          {/* Individual stats */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-surface-3 rounded-md p-2.5 text-center">
              <div className="text-lg font-bold text-text-primary">1,770</div>
              <div className="text-[11px] text-text-muted">💬 对话轮次</div>
            </div>
            <div className="bg-surface-3 rounded-md p-2.5 text-center">
              <div className="text-lg font-bold text-text-primary">223</div>
              <div className="text-[11px] text-text-muted">🧠 记忆条目</div>
            </div>
            <div className="bg-surface-3 rounded-md p-2.5 text-center">
              <div className="text-lg font-bold text-text-primary">162</div>
              <div className="text-[11px] text-text-muted">📄 文件数</div>
            </div>
            <div className="bg-surface-3 rounded-md p-2.5 text-center">
              <div className="text-lg font-bold text-accent">78%</div>
              <div className="text-[11px] text-text-muted">🎯 对齐率</div>
            </div>
          </div>

          {/* Team stats */}
          <div className="pt-3 border-t border-border">
            <div className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-2">
              团队协作
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 text-center rounded-md bg-cyan-500/5">
                <div className="text-sm font-bold text-cyan-400">5</div>
                <div className="text-[9px] text-text-muted">团队成员</div>
              </div>
              <div className="p-2 text-center rounded-md bg-cyan-500/5">
                <div className="text-sm font-bold text-cyan-400">23</div>
                <div className="text-[9px] text-text-muted">代问/代答</div>
              </div>
              <div className="p-2 text-center rounded-md bg-cyan-500/5">
                <div className="text-sm font-bold text-cyan-400">12</div>
                <div className="text-[9px] text-text-muted">站会报告</div>
              </div>
            </div>
          </div>

          {/* Alignment bar */}
          <div className="mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-text-secondary">对齐率</span>
              <span className="text-xs font-medium text-clone">78%</span>
            </div>
            <div className="overflow-hidden w-full h-2 rounded-full bg-surface-4">
              <div className="h-full rounded-full bg-clone" style={{ width: "78%" }} />
            </div>
            <div className="text-[9px] text-text-muted mt-1">
              多聊天多"喂养"，对齐率越高分身越懂你
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader
          title="Team Avatar Network — 分身网络"
          className="mb-4 border-b border-border-subtle pb-2"
        />
        <div className="p-5 max-w-md rounded-xl border bg-surface-2 border-border">
          <div className="mb-4 text-sm font-medium text-text-primary">🤖 分身网络</div>
          <div className="flex gap-4 items-center mb-4">
            {/* Overlapping avatar stack */}
            <div className="flex -space-x-3">
              {[
                { emoji: "😊", bg: "#E6B88A" },
                { emoji: "👨‍💻", bg: "#F5CBA7" },
                { emoji: "👩‍🎨", bg: "#FDEBD0" },
                { emoji: "🧑‍💻", bg: "#D4A574" },
                { emoji: "👩‍💼", bg: "#C68E5E" },
              ].map((m) => (
                <div
                  key={m.emoji}
                  className="flex justify-center items-center w-10 h-10 text-lg rounded-full border-2 border-surface-2"
                  style={{ backgroundColor: m.bg }}
                >
                  {m.emoji}
                </div>
              ))}
            </div>
            <div>
              <div className="text-[12px] font-medium text-text-primary">5 个分身在线</div>
              <div className="text-[10px] text-text-muted">分身间可互查进度、代问代答</div>
            </div>
          </div>

          {/* Recent team interactions */}
          <div className="space-y-2">
            {[
              {
                from: "👨‍💻 张三的分身",
                action: "查询了你的任务进度",
                time: "10 分钟前",
                type: "代问",
              },
              {
                from: "👩‍🎨 王五的分身",
                action: "自动回复了设计稿状态",
                time: "30 分钟前",
                type: "代答",
              },
              {
                from: "👩‍💼 赵六的分身",
                action: "生成了站会汇总",
                time: "09:05",
                type: "站会",
              },
            ].map((item) => (
              <div
                key={`${item.from}-${item.time}`}
                className="flex items-center gap-2.5 p-2 bg-surface-3 rounded-lg"
              >
                <span className="text-sm shrink-0">{item.from.split(" ")[0]}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-text-primary truncate">
                    {item.from.split(" ").slice(1).join(" ")} {item.action}
                  </div>
                  <div className="text-[10px] text-text-muted">{item.time}</div>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 rounded-full shrink-0">
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
