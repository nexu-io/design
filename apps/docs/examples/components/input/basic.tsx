import { Input } from "@nexu-design/ui-web";

export function InputBasicExample() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <label className="text-sm font-medium text-text-heading" htmlFor="docs-input-search">
        Search skills
      </label>
      <Input id="docs-input-search" placeholder="Search skills" />
    </div>
  );
}
