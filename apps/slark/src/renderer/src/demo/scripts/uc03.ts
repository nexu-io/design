import type { Agent, Channel } from "@/types";
import { useAgentsStore } from "@/stores/agents";
import { useChatStore } from "@/stores/chat";
import { useRoutinesStore } from "@/stores/routines";
import type { ScriptCtx } from "../ctx";
import { switchChannelTab } from "../tabs";

/**
 * UC-03 · Scheduled Routine
 *
 * SRE "Ma" builds a weekly incident-report Routine in #sre-weekly, test-runs it,
 * watches it auto-fire, then recovers from a Connector failure. The intro
 * message is typed into the real textarea; everything else is driven through
 * the chat + routines stores to keep the rich blocks (action, tool-result,
 * schedule, approval) intact.
 */
export async function runUC03(ctx: ScriptCtx): Promise<void> {
  ctx.resetToAppState();

  const onCall: Agent = {
    id: "a-demo-oncall",
    name: "On-Call Agent",
    avatar: "https://api.dicebear.com/9.x/bottts/svg?seed=on-call&backgroundColor=ef4444",
    description: "Reads Grafana + Linear, posts incident summaries, handles runbooks.",
    systemPrompt: "You are an on-call SRE assistant. Be factual and data-driven.",
    status: "online",
    skills: [],
    runtimeId: "rt-1",
    templateId: null,
    createdBy: "u-1",
    createdAt: Date.now(),
  };
  useAgentsStore.getState().addAgent(onCall);

  const ma = { kind: "user" as const, id: "u-1" };

  ctx.go("/chat/ch-welcome");
  await ctx.find("textarea", { timeout: 6000 });
  await ctx.say("UC-03 · SRE 小马要把「上周异常 Top10」做成自动化", 1800);

  // ── Scene 1: Create #sre-weekly ─────────────────────────────────────────
  await ctx.say("① 新建频道 #sre-weekly，拉 On-Call Agent 入群", 1200);
  const channel: Channel = {
    id: "ch-demo-sre",
    name: "sre-weekly",
    description: "SRE 周报与值班协作",
    type: "channel",
    members: [ma, { kind: "agent", id: onCall.id }],
    lastMessageAt: Date.now(),
    unreadCount: 0,
    createdAt: Date.now(),
  };
  useChatStore.getState().addChannel(channel);
  await ctx.wait(700);
  useChatStore.getState().setActiveChannel(channel.id);
  ctx.go(`/chat/${channel.id}`);
  await ctx.find("textarea", { timeout: 6000 });
  await ctx.wait(600);

  // ── Scene 2: Kick-off note typed into the real textarea ─────────────────
  await ctx.say("② 小马在频道里开个头", 900);
  const ta = await ctx.find<HTMLTextAreaElement>("textarea");
  await ctx.type(ta, "把「每周一 9:00 自动出上周异常 Top10」做成一个 Routine。", 24);
  await ctx.wait(400);
  ctx.press(ta, "Enter");
  await ctx.wait(1200);

  // ── Scene 3: Switch to Routines tab and manually create via the dialog ───
  await ctx.say("③ 切到 Routines Tab，手动新建一个", 1200);
  await switchChannelTab(ctx, "routines");
  await ctx.wait(1000);

  // Pick the "Weekly digest" template card — it pre-fills the dialog with a
  // weekly Monday schedule, close to what we want (we'll rename + rewrite body).
  await ctx.say("挑「Weekly digest」模板起手", 900);
  const weeklyCard = await ctx.findByText<HTMLButtonElement>("Weekly digest", {
    timeout: 4000,
  });
  ctx.click(weeklyCard);

  // Dialog opens. Wait for Radix role="dialog" to mount, then edit the fields.
  const dialog = await ctx.find<HTMLElement>('[role="dialog"]', { timeout: 4000 });
  // The template's useEffect populates the inputs on open; give React a beat
  // to flush state before we overwrite.
  await ctx.wait(400);

  await ctx.say("改名为 Weekly Incident Top10", 900);
  const nameInput = await ctx.find<HTMLInputElement>('input[type="text"]', { root: dialog });
  ctx.clearInput(nameInput);
  await ctx.wait(200);
  await ctx.type(nameInput, "Weekly Incident Top10", 26);
  await ctx.wait(400);

  await ctx.say("描述这条 Routine 的工作", 900);
  const descTextarea = await ctx.find<HTMLTextAreaElement>("textarea", { root: dialog });
  ctx.clearInput(descTextarea);
  await ctx.wait(200);
  await ctx.type(
    descTextarea,
    "每周一 9:00，从 Grafana 拉上周 P0/P1 告警，合并 Linear 事件工单，按服务聚合排 Top10 发到本频道。",
    28,
  );
  await ctx.wait(500);

  await ctx.say("把 On-Call Agent 绑上去", 900);
  const agentSelect = await ctx.find<HTMLElement>('[role="combobox"]', { root: dialog });
  ctx.click(agentSelect);
  await ctx.wait(500);
  try {
    const onCallOption = await ctx.findByText<HTMLElement>("On-Call Agent", {
      selector: '[role="option"]',
      timeout: 2500,
    });
    ctx.click(onCallOption);
  } catch {
    // Radix listbox renders in a portal — if the option isn't found, press Escape
    // to close and leave agentId empty. The routine will still be created.
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  }
  await ctx.wait(500);

  await ctx.say("点 Create 提交", 600);
  const createBtn = await ctx.findByText<HTMLButtonElement>(
    ["Create", "创建", "建立", "作成", "만들기", "Crear", "Créer", "Erstellen"],
    { root: dialog, timeout: 3000 },
  );
  ctx.click(createBtn);

  // Wait for the routine to land in the store + dialog to close.
  const routineStart = Date.now();
  let createdRoutineId: string | null = null;
  while (Date.now() - routineStart < 4000) {
    const r = useRoutinesStore.getState().routines.find((it) => it.channelId === channel.id);
    if (r) {
      createdRoutineId = r.id;
      break;
    }
    await ctx.wait(120);
  }
  if (!createdRoutineId) {
    // Fallback: build the routine via store so the rest of the demo can proceed.
    const fallbackId = `ro-demo-weekly-${Date.now()}`;
    useRoutinesStore.getState().addRoutine({
      id: fallbackId,
      channelId: channel.id,
      name: "Weekly Incident Top10",
      description: "Weekly incident top 10",
      agentId: onCall.id,
      trigger: { kind: "schedule", cron: "0 9 * * 1" },
      status: "active",
      nextRunAt: Date.now() + 1000 * 60 * 60 * 72,
      runs: [],
      createdBy: ma.id,
      createdAt: Date.now(),
    });
    createdRoutineId = fallbackId;
  }
  const routineId = createdRoutineId;
  // Make sure the routine is selected so the detail pane is shown.
  useRoutinesStore.getState().selectRoutine(routineId);
  await ctx.wait(1200);

  await ctx.say("授权 Grafana（读）+ Linear（读）两个 Connector", 1600);

  // ── Scene 4: Manual test run ─────────────────────────────────────────────
  await ctx.say("④ 点「Run now」手动试跑，验证脚本没问题", 1200);
  const runId1 = useRoutinesStore.getState().runNow(routineId);
  // Jump back to Chat so the Agent's action/result blocks are visible.
  await switchChannelTab(ctx, "chat");
  await ctx.wait(400);
  ctx.send(channel.id, {
    sender: { kind: "agent", id: onCall.id },
    content: "",
    blocks: [
      {
        type: "action",
        title: "Fetching Grafana alerts · last 7 days",
        description: "grafana.query → aggregate by service",
        status: "running",
        tool: "grafana",
      },
    ],
  });
  await ctx.wait(1400);

  ctx.send(channel.id, {
    sender: { kind: "agent", id: onCall.id },
    content: "",
    blocks: [
      {
        type: "tool-result",
        tool: "grafana + linear",
        input: "range=last_7d severity=P0,P1",
        output: "Fetched 24 alerts · 11 incidents · joining by service…",
        status: "success",
      },
    ],
  });
  await ctx.wait(1200);

  await ctx.streamReply(
    channel.id,
    { sender: { kind: "agent", id: onCall.id } },
    "**Weekly Incident Top 10 · 2026-W16**\n\n| # | Service | Severity | Duration | Owner |\n|---|---|---|---|---|\n| 1 | auth-api | P0 | 47m | @bob |\n| 2 | ingest-worker | P1 | 32m | @diana |\n| 3 | cdn-edge | P1 | 21m | @alice |\n| 4 | billing | P1 | 18m | @bob |\n| 5 | search-svc | P1 | 14m | @charlie |\n\n（略去后 5 条）试跑成功 ✓",
    80,
  );
  useRoutinesStore.getState().completeRun(routineId, runId1, "success");
  await ctx.wait(1400);

  // ── Scene 5: Scheduled run fires ─────────────────────────────────────────
  await ctx.say("⑤ 周一 9:00 到了，Routine 自动触发", 1400);
  const runId2 = useRoutinesStore.getState().runNow(routineId);
  ctx.send(channel.id, {
    sender: { kind: "agent", id: onCall.id },
    content: "",
    blocks: [
      {
        type: "action",
        title: "Scheduled run · 0 9 * * 1",
        description: "auto-triggered by cron",
        status: "running",
        tool: "scheduler",
      },
    ],
  });
  await ctx.wait(1200);

  // ── Scene 6: Failure — connector token expired ──────────────────────────
  await ctx.say("⑥ 坏消息：Grafana Token 过期，Run 失败", 1400);
  ctx.send(channel.id, {
    sender: { kind: "agent", id: onCall.id },
    content: "",
    blocks: [
      {
        type: "tool-result",
        tool: "grafana",
        output: "401 Unauthorized · token expired on 2026-04-20. Routine paused automatically.",
        status: "failed",
      },
    ],
  });
  useRoutinesStore.getState().completeRun(routineId, runId2, "error");
  useRoutinesStore.getState().updateRoutine(routineId, { status: "error" });
  await ctx.wait(1800);

  // ── Scene 7: Recovery ────────────────────────────────────────────────────
  await ctx.say("⑦ 小马在 Runs 历史看到报错，点「重新授权」→「Retry」", 1200);
  // Open the Routines tab so the failed run history + status badge is visible.
  await switchChannelTab(ctx, "routines");
  await ctx.wait(1400);
  const runId3 = useRoutinesStore.getState().runNow(routineId);
  await switchChannelTab(ctx, "chat");
  await ctx.wait(900);

  ctx.send(channel.id, {
    sender: { kind: "agent", id: onCall.id },
    content: "",
    blocks: [
      {
        type: "tool-result",
        tool: "grafana",
        output: "Reconnected · fetched 19 alerts. Resuming Routine.",
        status: "success",
      },
    ],
  });
  useRoutinesStore.getState().completeRun(routineId, runId3, "success");
  useRoutinesStore.getState().updateRoutine(routineId, { status: "active" });
  await ctx.wait(1400);

  await ctx.say("✅ 定时任务 = Agent 在群里按时发言；失败有对话可追踪，人机接力无缝", 3000);
}
