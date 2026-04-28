import { BrandLogo, BrandRail, Button } from "@nexu-design/ui-web";

export function BrandRailBasicExample() {
  return (
    <div className="h-[420px] overflow-hidden rounded-2xl border border-border bg-surface-1">
      <BrandRail
        logo={<BrandLogo brand="nexu" title="Nexu" size={24} />}
        topRight={
          <Button variant="ghost" size="sm">
            Contact sales
          </Button>
        }
        title={
          <h2 className="text-3xl font-semibold">
            Operate every customer workflow from one place.
          </h2>
        }
        description="Unified copilots for support, finance, and growth teams."
        footer={<p className="text-sm text-white/60">Trusted by modern AI operations teams.</p>}
      >
        <div className="grid gap-3 text-sm text-white/80">
          <div>Shared context across Slack, email, and internal tools.</div>
          <div>Operator-ready approvals, escalations, and audit history.</div>
        </div>
      </BrandRail>
    </div>
  );
}
