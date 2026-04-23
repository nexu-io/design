import type { Agent, Channel } from "@/types";
import { useAgentsStore } from "@/stores/agents";
import { useChatStore } from "@/stores/chat";
import { useMemoriesStore } from "@/stores/memories";
import { useTopicsStore } from "@/stores/topics";
import type { ScriptCtx } from "../ctx";
import { switchChannelTab } from "../tabs";

/**
 * UC-02 · File-driven Channel Collaboration (full 6-scene spec)
 *
 * 1. 小吴建 #会员体系改版，拉 阿杰 + Researcher + UX Writer
 * 2. 上传 3 张竞品截图 + Excel + 旧 PRD（带文字说明）
 * 3. @ 两个 Agent 派活
 * 4. Researcher 返回对比表；UX Writer 返回摘要 + Approval Block
 * 5. 阿杰在对比表下 reply → 触发 Topic
 * 6. 决定沉淀为 Memory；下周一出设计初稿 落为 Issue
 */
export async function runUC02(ctx: ScriptCtx): Promise<void> {
  ctx.resetToAppState();

  const researcher: Agent = {
    id: "a-demo-researcher",
    name: "Researcher",
    avatar: "https://api.dicebear.com/9.x/bottts/svg?seed=researcher&backgroundColor=10b981",
    description: "Pulls competitive data, summarizes long docs, finds precedents.",
    systemPrompt: "You are a research agent. Be thorough and cite sources.",
    status: "online",
    skills: [],
    runtimeId: "rt-1",
    templateId: null,
    createdBy: "u-1",
    createdAt: Date.now(),
  };
  const writer: Agent = {
    id: "a-demo-writer",
    name: "UX Writer",
    avatar: "https://api.dicebear.com/9.x/bottts/svg?seed=ux-writer&backgroundColor=a855f7",
    description: "Rewrites copy, extracts requirements, polishes PRDs.",
    systemPrompt: "You are a UX writer. Be clear, concise, and user-focused.",
    status: "online",
    skills: [],
    runtimeId: "rt-1",
    templateId: null,
    createdBy: "u-1",
    createdAt: Date.now(),
  };
  useAgentsStore.getState().addAgent(researcher);
  useAgentsStore.getState().addAgent(writer);

  const wu = { kind: "user" as const, id: "u-1" };
  const jie = { kind: "user" as const, id: "u-2" };

  ctx.go("/chat/ch-welcome");
  await ctx.find("textarea", { timeout: 6000 });
  await ctx.say("UC-02 · PM 小吴要做「会员体系改版」", 1800);

  // ── Scene 1: Create the channel ──────────────────────────────────────────
  await ctx.say("① 新建频道 #会员体系改版，拉阿杰 + Researcher + UX Writer 入群", 1500);
  const channel: Channel = {
    id: "ch-demo-membership",
    name: "membership-revamp",
    description: "会员体系改版：资料归拢、竞调、PRD 整理",
    type: "channel",
    members: [wu, jie, { kind: "agent", id: researcher.id }, { kind: "agent", id: writer.id }],
    lastMessageAt: Date.now(),
    unreadCount: 0,
    createdAt: Date.now(),
  };
  useChatStore.getState().addChannel(channel);
  await ctx.wait(700);
  useChatStore.getState().setActiveChannel(channel.id);
  ctx.go(`/chat/${channel.id}`);
  await ctx.find("textarea", { timeout: 6000 });
  await ctx.wait(500);

  // ── Scene 2: Drop reference files with an explanatory note ───────────────
  await ctx.say("② 拖 3 张竞品截图 + Excel 分层数据 + 旧 PRD 进聊天框", 1400);
  ctx.send(channel.id, {
    sender: wu,
    content: "这些是参考资料，先看一下：",
    blocks: [
      {
        type: "gallery",
        images: [
          {
            url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=60",
            alt: "竞品 A 会员页",
          },
          {
            url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=60",
            alt: "竞品 B 会员页",
          },
          {
            url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=60",
            alt: "竞品 C 会员页",
          },
        ],
      },
      {
        type: "file",
        name: "member_cohort_2025Q1.xlsx",
        size: 128_400,
        url: "#",
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      {
        type: "file",
        name: "v3-PRD-会员体系.md",
        size: 42_100,
        url: "#",
        mimeType: "text/markdown",
      },
    ],
  });
  await ctx.wait(1800);

  // ── Scene 3: Dispatch work via @ mentions (store-injected to avoid the
  //    built-in MessageInput auto-reply which would double up with scenes 4). ─
  await ctx.say("③ @Researcher 抽对比表；@UX Writer 过旧 PRD", 1200);
  ctx.send(channel.id, {
    sender: wu,
    content:
      "@Researcher 把这三个竞品的会员权益差异抽成对比表；\n@UX Writer 把旧 PRD 里还适用的需求抽出来，过期的标掉。",
    mentions: [
      { kind: "agent", id: researcher.id },
      { kind: "agent", id: writer.id },
    ],
  });
  await ctx.wait(1400);

  // ── Scene 4a: Researcher reads the screenshots directly and replies ──────
  await ctx.say("④ Researcher 看完三张截图，直接给出对比表", 1200);
  const tableMsg = await ctx.streamReply(
    channel.id,
    { sender: { kind: "agent", id: researcher.id } },
    "对比出来了，三家都有 3 档会员，核心差异在**独占内容**和**售后响应**：\n\n| 维度 | 竞品 A | 竞品 B | 竞品 C |\n|---|---|---|---|\n| 最高档价格 | ¥198/月 | ¥168/月 | ¥228/月 |\n| 独占内容 | ✅ 每周更新 | ❌ | ✅ 每月 |\n| 7×24 客服 | ✅ | ❌ | ✅ |\n| 退款承诺 | 7 天 | 15 天 | 30 天 |\n\n建议我们在「售后响应」这一档做差异化。",
    70,
  );
  await ctx.wait(800);

  // ── Scene 4b: UX Writer — summary + Approval block ───────────────────────
  await ctx.say("UX Writer 整理完 PRD，写操作前先请求审批", 1400);
  await ctx.streamReply(
    channel.id,
    { sender: { kind: "agent", id: writer.id } },
    "旧 PRD 我过了一遍，**还适用的需求有 7 条**（积分、等级、续费提醒…），**过期的 4 条**（线下活动相关）。",
    65,
  );
  await ctx.wait(500);

  ctx.send(channel.id, {
    sender: { kind: "agent", id: writer.id },
    content: "",
    blocks: [
      {
        type: "approval",
        id: "apv-demo-1",
        title: "要把标注写回原 PRD 文档吗？",
        description: "会在原文件生成新版本，过期需求会被删除线标记",
        status: "pending",
        options: [
          { id: "yes", label: "确认写回", tone: "primary" },
          { id: "no", label: "先不用", tone: "neutral" },
        ],
      },
    ],
  });
  await ctx.wait(1800);

  // ── Scene 5: 阿杰 replies to the comparison table → triggers a Topic ─────
  await ctx.say("⑤ 阿杰在对比表下回复，开出一个 Topic", 1200);
  const discussionTopicId = useTopicsStore.getState().createTopic({
    rootChannelId: channel.id,
    rootMessageId: tableMsg.id,
    title: "独占内容差异化调研",
    participants: [jie, { kind: "agent", id: researcher.id }],
  });
  useTopicsStore.getState().addTopicMessage(discussionTopicId, {
    id: `msg-topic-${Date.now()}-1`,
    channelId: channel.id,
    sender: jie,
    content: "第三项「独占内容」我们可以做差异化，@Researcher 再查一下国内有没有类似案例？",
    mentions: [{ kind: "agent", id: researcher.id }],
    reactions: [],
    createdAt: Date.now(),
  });
  await ctx.wait(900);
  useTopicsStore.getState().addTopicMessage(discussionTopicId, {
    id: `msg-topic-${Date.now()}-2`,
    channelId: channel.id,
    sender: { kind: "agent", id: researcher.id },
    content:
      "收到，我去查一下。初步看下来 B 站「大会员」和爱奇艺「星钻」都走独占内容路线，稍后把 case 整理回来。",
    mentions: [],
    reactions: [],
    createdAt: Date.now(),
  });
  await ctx.wait(1600);

  // ── Scene 6a: Save the decision as a Memory ──────────────────────────────
  await ctx.say("⑥ 讨论到第二天：把「采用 3 档结构」存为 Memory", 1200);
  useMemoriesStore.getState().addMemory({
    channelId: channel.id,
    kind: "decision",
    source: "user",
    authorId: wu.id,
    method: "explicit",
    content: "会员体系改版：采用 3 档结构，差异化聚焦独占内容 + 售后响应。",
  });
  // Switch to the Memory tab so the new decision card is visible.
  await switchChannelTab(ctx, "memory");
  await ctx.wait(1800);

  // ── Scene 6b: File "下周一出设计初稿" as an Issue (Topic + IssueMeta) ─────
  // Bounce back to Chat so the root message is obviously tied to the conversation.
  await switchChannelTab(ctx, "chat");
  await ctx.wait(500);
  await ctx.say("把「下周一出设计初稿」落为 Issue 指派给阿杰", 1200);
  const issueRootMsg = ctx.send(channel.id, {
    sender: wu,
    content: "@阿杰 下周一前出 v1 设计初稿，重点是 3 档权益卡的信息层级。",
    mentions: [],
  });
  await ctx.wait(1400);

  // Create the Issue FIRST, then switch to the Issues tab — that way the row is
  // guaranteed to be present the moment the tab is shown, even if the click flow
  // ever lags. (An earlier version switched first and created after, so any tiny
  // hiccup in the click sequence meant the tab landed empty.)
  useTopicsStore.getState().createTopic({
    rootChannelId: channel.id,
    rootMessageId: issueRootMsg.id,
    title: "下周一出 v1 设计初稿",
    participants: [wu, jie],
    issue: {
      status: "todo",
      createdAt: Date.now(),
    },
  });
  await ctx.wait(400);
  await switchChannelTab(ctx, "issues");
  await ctx.wait(2800);

  await ctx.say("频道里同时沉淀了：文件、对比表、审批、话题、记忆、议题", 2800);
}
