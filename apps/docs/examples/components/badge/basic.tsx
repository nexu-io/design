import { Badge } from "@nexu-design/ui-web";

export function BadgeBasicExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="accent">New</Badge>
      <Badge variant="success">Live</Badge>
      <Badge variant="warning">Review</Badge>
      <Badge variant="danger">Blocked</Badge>
    </div>
  );
}
