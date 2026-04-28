import { Label, RadioGroup, RadioGroupItem } from "@nexu-design/ui-web";

export function RadioGroupBasicExample() {
  return (
    <RadioGroup defaultValue="cloud" className="gap-3">
      <div className="flex items-center gap-3">
        <RadioGroupItem value="cloud" id="cloud" />
        <Label htmlFor="cloud">Cloud models</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="byok" id="byok" />
        <Label htmlFor="byok">Bring your own key</Label>
      </div>
    </RadioGroup>
  );
}
