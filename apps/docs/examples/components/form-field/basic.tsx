import { FormField, Input } from "@nexu-design/ui-web";

export function FormFieldBasicExample() {
  return (
    <div className="w-[420px]">
      <FormField label="API Key" description="Stored locally on your machine.">
        <Input placeholder="sk-..." />
      </FormField>
    </div>
  );
}
