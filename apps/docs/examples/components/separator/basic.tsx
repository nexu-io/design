import { Separator } from "@nexu-design/ui-web";

export function SeparatorBasicExample() {
  return (
    <div className="grid w-[360px] gap-4">
      <Separator />
      <div className="flex h-12 items-center gap-3">
        <span>Left</span>
        <Separator orientation="vertical" />
        <span>Right</span>
      </div>
    </div>
  );
}
