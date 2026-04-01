import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, action, className }: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between gap-3 ${className ?? ""}`.trim()}>
      <div className="min-w-0">{title}</div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
