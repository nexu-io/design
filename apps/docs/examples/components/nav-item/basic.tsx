import { NavItem } from "@nexu-design/ui-web";

export function NavItemBasicExample() {
  return (
    <div className="grid w-[240px] gap-1 rounded-xl border border-border bg-surface-1 p-2">
      <NavItem selected>
        <span className="text-xs">Home</span>
      </NavItem>
      <NavItem>
        <span className="text-xs">Messages</span>
      </NavItem>
      <NavItem tone="accent">
        <span className="text-xs">Automations</span>
      </NavItem>
    </div>
  );
}
