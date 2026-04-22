import type { ScriptCtx } from "./ctx";

/** Labels for the in-channel tab strip (Chat / Issues / Routines / Memory). */
const TAB_LABELS = {
  chat: ["Chat", "聊天", "チャット", "채팅", "Discussion", "Conversas", "Trò chuyện", "Чат"],
  issues: [
    "Issues",
    "议题",
    "議題",
    "Incidencias",
    "Sujets",
    "Vorgänge",
    "Questões",
    "Задачи",
    "Issue",
    "Vấn đề",
    "課題",
    "이슈",
  ],
  routines: ["Routines", "例行任务", "例行任務", "ルーチン", "루틴"],
  memory: [
    "Memory",
    "记忆",
    "記憶",
    "メモリー",
    "메모리",
    "Memoria",
    "Mémoire",
    "Memória",
    "Память",
    "Bộ nhớ",
  ],
} as const;

/** Click the Chat/Issues/Routines/Memory tab pill inside ChatView. No-op if it isn't rendered (e.g. DM). */
export async function switchChannelTab(
  ctx: ScriptCtx,
  tab: keyof typeof TAB_LABELS,
): Promise<void> {
  const labels = [...TAB_LABELS[tab]];
  // The tab strip sits inside ChatView (`<div class="... border-b ... px-2">`). We first try
  // to scope our text-search to that strip so we never accidentally click a sidebar/nav item
  // that happens to contain the same word.
  const strip = document.querySelector<HTMLElement>(
    "div.flex.h-10.shrink-0.items-center.gap-0\\.5.border-b",
  );
  try {
    if (strip) {
      const btn = await ctx.findByText<HTMLButtonElement>(labels, {
        root: strip,
        timeout: 2500,
      });
      ctx.click(btn);
      return;
    }
    const btn = await ctx.findByText<HTMLButtonElement>(labels, { timeout: 2500 });
    ctx.click(btn);
  } catch (err) {
    console.warn("[demo] switchChannelTab failed", tab, err);
  }
}
