import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ThemeRoot,
} from "@nexu-design/ui-web";

export function ThemeRootBasicExample() {
  return (
    <ThemeRoot theme="dark" className="rounded-2xl border border-border p-6 shadow-sm">
      <Card className="max-w-md bg-card shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Dark theme</CardTitle>
              <CardDescription>
                Render a themed subtree without changing the whole app.
              </CardDescription>
            </div>
            <Badge variant="secondary">dark</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg text-text-secondary">
            ThemeRoot applies token-backed theme styles locally.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
          </div>
        </CardContent>
      </Card>
    </ThemeRoot>
  );
}
