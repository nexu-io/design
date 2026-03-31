import type { Meta, StoryObj } from "@storybook/react-vite";

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

const meta = {
  title: "Primitives/ThemeRoot",
  component: ThemeRoot,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ThemeRoot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LightAndDark: Story = {
  render: () => (
    <div className="grid min-h-screen gap-6 p-6 lg:grid-cols-2">
      <ThemePreview theme="light" title="Light theme" />
      <ThemePreview theme="dark" title="Dark theme" />
    </div>
  ),
};

function ThemePreview({ theme, title }: { theme: "light" | "dark"; title: string }) {
  return (
    <ThemeRoot theme={theme} className="rounded-2xl border border-border p-6 shadow-sm">
      <Card className="max-w-md bg-card shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>
                Render a themed subtree without changing the whole app.
              </CardDescription>
            </div>
            <Badge variant="secondary">{theme}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-text-secondary">
            ThemeRoot applies the token-backed light or dark theme locally.
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
