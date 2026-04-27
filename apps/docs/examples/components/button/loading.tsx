import { Button } from "../../../../../packages/ui-web/src/primitives/button";

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
