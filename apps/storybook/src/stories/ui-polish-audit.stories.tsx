import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowUpRight } from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FormField,
  FormFieldControl,
  Input,
  PageHeader,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TextLink,
  ToggleGroup,
  ToggleGroupItem,
} from "@nexu-design/ui-web";

const meta = {
  title: "Scenarios/UI Polish Audit",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Cross-check surface for link color, focus ring usage, 12px compact controls, page-header spacing, and provider settings hierarchy.",
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="space-y-8 bg-[var(--color-surface-0)] p-8">
      <PageHeader
        title="UI polish audit"
        description={
          <>
            Use this page to review shared polish rules. <a href="#spec">Open the spec</a>
          </>
        }
        actions={
          <Button autoFocus variant="outline">
            Focused action
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Link + external-link icon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-text-secondary">
            <TextLink href="#" target="_blank" rel="noopener noreferrer">
              View API docs
              <ArrowUpRight size={12} />
            </TextLink>
            <TextLink href="#" variant="muted" target="_blank" rel="noopener noreferrer">
              Open community guide
              <ArrowUpRight size={12} />
            </TextLink>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compact typography floor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="global" className="w-full">
              <TabsList variant="compact">
                <TabsTrigger value="global" variant="compact">
                  Global
                </TabsTrigger>
                <TabsTrigger value="cn" variant="compact">
                  China Mainland
                </TabsTrigger>
              </TabsList>
              <TabsContent value="global" className="mt-3 text-sm text-text-secondary">
                Compact tabs keep labels at 12px minimum.
              </TabsContent>
              <TabsContent value="cn" className="mt-3 text-sm text-text-secondary">
                Dense controls stay readable in settings surfaces.
              </TabsContent>
            </Tabs>

            <ToggleGroup
              type="single"
              variant="compact"
              defaultValue="api-key"
              aria-label="Auth mode"
            >
              <ToggleGroupItem variant="compact" value="oauth">
                OAuth
              </ToggleGroupItem>
              <ToggleGroupItem variant="compact" value="api-key">
                API Key
              </ToggleGroupItem>
            </ToggleGroup>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Provider settings hierarchy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="global" className="w-full">
              <TabsList variant="compact">
                <TabsTrigger value="global" variant="compact">
                  Global
                </TabsTrigger>
                <TabsTrigger value="cn" variant="compact">
                  CN
                </TabsTrigger>
              </TabsList>
              <TabsContent value="global" className="mt-4 space-y-4">
                <ToggleGroup
                  type="single"
                  variant="compact"
                  defaultValue="api-key"
                  aria-label="Provider auth method"
                >
                  <ToggleGroupItem variant="compact" value="oauth">
                    OAuth
                  </ToggleGroupItem>
                  <ToggleGroupItem variant="compact" value="api-key">
                    API Key
                  </ToggleGroupItem>
                </ToggleGroup>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField label="API key">
                    <FormFieldControl>
                      <Input value="sk-••••••••••••1234" readOnly />
                    </FormFieldControl>
                  </FormField>
                  <FormField label="Proxy URL">
                    <FormFieldControl>
                      <Input placeholder="https://proxy.example.com" />
                    </FormFieldControl>
                  </FormField>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Replace key</Button>
                  <Button>Save</Button>
                </div>
              </TabsContent>
              <TabsContent value="cn" className="mt-4 text-sm text-text-secondary">
                Use the same Region → Auth method → Inputs → Save hierarchy for regional variants.
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};
