import { StatusDot } from "@nexu-design/ui-web";

export function StatusDotBasicExample() {
  return (
    <div className="inline-flex items-center gap-2 text-sm text-text-secondary">
      <StatusDot status="success" pulse />
      <span className="text-text-primary">Connected</span>
    </div>
  );
}
