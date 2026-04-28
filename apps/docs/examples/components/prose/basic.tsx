import { Prose } from "@nexu-design/ui-web";

export function ProseBasicExample() {
  return (
    <Prose className="max-w-2xl">
      <h2>Release checklist</h2>
      <p>Run validation, capture screenshots, and notify stakeholders before publishing.</p>
      <ul>
        <li>Confirm docs and examples are in sync.</li>
        <li>Verify accessibility and keyboard behavior.</li>
      </ul>
    </Prose>
  );
}
