export type CardType = "file" | "memory" | "skill" | "automation" | "collaboration" | "upgrade";

export type CardStatus = "success" | "running" | "warning" | "info" | "locked";

export interface ChatCard {
  type: CardType;
  title: string;
  status: CardStatus;
  body: string;
  path?: string;
  diff?: { added: number; removed: number };
  actions?: { label: string; primary?: boolean }[];
  viralCta?: string;
  meta?: string;
}
