import { Button } from "@nexu-design/ui-web";

export function ButtonLoadingExample() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button loading>Saving...</Button>
      <Button disabled variant="outline">
        Disabled
      </Button>
    </div>
  );
}
