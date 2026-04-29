import { Toggle, ToggleGroup, ToggleGroupItem } from "@nexu-design/ui-web";

export function ToggleBasicExample() {
  return (
    <div className="flex flex-col gap-4">
      <Toggle defaultPressed>Pin note</Toggle>
      <ToggleGroup type="multiple" variant="outline" defaultValue={["bold"]}>
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
        <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
