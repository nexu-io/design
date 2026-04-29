import { Spinner } from "@nexu-design/ui-web";

export function SpinnerBasicExample() {
  return (
    <div className="flex items-center gap-3 text-sm text-text-secondary">
      <Spinner size="sm" />
      Syncing workspace changes…
    </div>
  );
}
