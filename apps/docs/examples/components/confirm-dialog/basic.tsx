import { Button, ConfirmDialog } from "@nexu-design/ui-web";

export function ConfirmDialogBasicExample() {
  return (
    <ConfirmDialog
      trigger={<Button variant="destructive">Delete channel</Button>}
      title="Delete Slack channel"
      description="This will permanently remove connection credentials."
      confirmLabel="Delete"
    />
  );
}
