import { useWorkspaceStore } from "@/stores/workspace";
import type { ScriptCtx } from "../ctx";

/**
 * UC-01 · Team Initialization
 *
 * Solo developer "Chen" spins up ChenCorp: login → workspace → scan runtimes →
 * pick template → rename agent → Create Agent → land in #welcome.
 *
 * Every caption corresponds to a real DOM action (typing, clicking) so the
 * page visibly reacts every time the caption advances.
 */
export async function runUC01(ctx: ScriptCtx): Promise<void> {
  ctx.resetToWelcome();
  ctx.go("/");
  await ctx.say("UC-01 · 老陈打开 Slark", 1400);

  // ── ① Welcome → login ────────────────────────────────────────────────────
  await ctx.say("① 点击「Continue with GitHub」登录", 900);
  // All three auth buttons call login() → same destination; pick the GitHub one
  // via text match with both English and Simplified Chinese.
  const loginBtn = await ctx.findByText<HTMLButtonElement>([
    "Continue with GitHub",
    "使用 GitHub 继续",
    "GitHub で続行",
    "GitHub로 계속",
  ]);
  ctx.click(loginBtn);

  // ── ② Workspace name ────────────────────────────────────────────────────
  await ctx.say("② 填 Workspace 名字：ChenCorp", 700);
  const nameInput = await ctx.find<HTMLInputElement>("input[type='text']");
  await ctx.type(nameInput, "ChenCorp", 22);
  await ctx.wait(500);

  await ctx.say("→ 点击「Continue」", 500);
  // The Continue button on this step has class h-11 and is the only such button.
  const continueBtn = await ctx.findByText<HTMLButtonElement>([
    "Continue",
    "继续",
    "繼續",
    "続ける",
    "계속",
    "Weiter",
    "Продолжить",
  ]);
  ctx.click(continueBtn);

  // ── ③ Runtime scan ───────────────────────────────────────────────────────
  await ctx.say("③ 扫描本地 Runtime… 识别到 Claude Code / OpenCode / Gemini", 4000);

  await ctx.say("选中可用的几个", 700);
  // "Continue with N runtimes" is hardcoded English in ConnectRuntimeStep.
  const rtContinue = await ctx.findByText<HTMLButtonElement>("Continue with", {
    timeout: 8000,
  });
  ctx.click(rtContinue);

  // ── ④ Switch to the Agent tab ────────────────────────────────────────────
  await ctx.say("④ 切到「Create an agent」Tab", 700);
  const agentTab = await ctx.findByText<HTMLElement>(
    ["Create an agent", "创建 Agent", "創建 Agent", "Agent 作成", "에이전트 만들기"],
    { selector: "[role='tab']" },
  );
  ctx.click(agentTab);
  await ctx.wait(500);

  await ctx.say("选一个模板：Coder", 700);
  // Target the Coder avatar (reliable key) and click its parent button.
  const coderAvatar = await ctx.find<HTMLImageElement>("img[src*='seed=coder']");
  const coderTpl = coderAvatar.closest("button") as HTMLButtonElement | null;
  ctx.click(coderTpl);
  await ctx.wait(600);

  // ── ⑤ Rename the agent to Biz Assistant ─────────────────────────────────
  await ctx.say("⑤ 改名为 Biz Assistant", 700);
  // On the settings phase, the Agent Name input is the first text input.
  const agentNameInput = await ctx.find<HTMLInputElement>("input[type='text']");
  ctx.clearInput(agentNameInput);
  await ctx.wait(200);
  await ctx.type(agentNameInput, "Biz Assistant", 24);
  await ctx.wait(500);

  await ctx.say("→ 点击「Create Agent」", 500);
  const createBtn = await ctx.findByText<HTMLButtonElement>([
    "Create Agent",
    "创建 Agent",
    "創建 Agent",
  ]);
  ctx.click(createBtn);

  // ── ⑥ Land in #welcome — the built-in welcome flow will stream a reply ───
  await ctx.say("⑥ 进入主界面 #welcome — 刚建的 Agent 已入群", 1200);
  // Wait until chat UI actually mounts (textarea present).
  await ctx.find("textarea", { timeout: 6000 });

  // The onboarding flow wired setPendingWelcomeAgent → ChatView auto-streams
  // a welcome message from the new agent. Give it some airtime to finish.
  const seeAgentWelcome = async (): Promise<void> => {
    const start = Date.now();
    while (Date.now() - start < 9000) {
      if (useWorkspaceStore.getState().pendingWelcomeAgentId === null) return;
      await ctx.wait(200);
    }
  };
  await seeAgentWelcome();
  await ctx.wait(1200);

  await ctx.say("✅ 3 分钟入职：1 Workspace · 多个 Runtime · 1 可用 Agent", 2800);
}
