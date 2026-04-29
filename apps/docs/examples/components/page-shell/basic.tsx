import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  PageShell,
} from "@nexu-design/ui-web";

export function PageShellBasicExample() {
  return (
    <div className="h-[420px] overflow-hidden rounded-xl border border-border bg-surface-0">
      <PageShell>
        <div className="grid gap-4 p-6 lg:grid-cols-[280px_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Navigation</CardTitle>
              <CardDescription>Browse shared primitives and patterns.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Workspace</CardTitle>
              <CardDescription>Preview content inside the main page shell area.</CardDescription>
            </CardHeader>
            <CardContent>Use the shell to anchor side navigation and page content.</CardContent>
          </Card>
        </div>
      </PageShell>
    </div>
  );
}
