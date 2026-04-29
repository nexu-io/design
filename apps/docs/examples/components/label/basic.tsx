import { Input, Label } from "@nexu-design/ui-web";

export function LabelBasicExample() {
  return (
    <div className="grid w-[320px] gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="email">Email address</Label>
        <Input id="email" placeholder="you@example.com" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="disabled-input">Disabled field</Label>
        <Input id="disabled-input" placeholder="Cannot edit" disabled />
      </div>
    </div>
  );
}
