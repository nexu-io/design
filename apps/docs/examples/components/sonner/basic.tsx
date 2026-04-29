import { Button, Toaster } from "@nexu-design/ui-web";

export function SonnerBasicExample() {
  return (
    <div className="flex gap-3">
      <Toaster position="top-center" />
      <Button>Show success toast</Button>
      <Button variant="outline">Show error toast</Button>
    </div>
  );
}
