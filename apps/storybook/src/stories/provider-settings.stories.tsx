import type { Meta, StoryObj } from "@storybook/react-vite";
import { KeyRound, ShieldCheck } from "lucide-react";
import { useState } from "react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FormField,
  FormFieldControl,
  Input,
  PageHeader,
  PanelFooter,
  PanelFooterActions,
  PanelFooterMeta,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ToggleGroup,
  ToggleGroupItem,
} from "@nexu-design/ui-web";

type Region = "global" | "cn";
type AuthMethod = "oauth" | "api-key";

const regionCopy: Record<Region, { label: string; proxyPlaceholder: string; helper: string }> = {
  global: {
    label: "Global",
    proxyPlaceholder: "https://proxy.example.com",
    helper: "Default scope for shared provider traffic and managed routing.",
  },
  cn: {
    label: "CN",
    proxyPlaceholder: "https://cn-proxy.example.com",
    helper: "Keep regional routing and compliance overrides separate from global settings.",
  },
};

function ProviderSettingsScenario() {
  const [region, setRegion] = useState<Region>("global");
  const [authMethod, setAuthMethod] = useState<AuthMethod>("api-key");
  const [isReplacingKey, setIsReplacingKey] = useState(false);

  const currentRegion = regionCopy[region];

  return (
    <div className="space-y-8 bg-[var(--color-surface-0)] p-8">
      <PageHeader
        title="Provider settings"
        description={
          <>
            Use this BYOK scenario to review the recommended Region → Auth method → Inputs → Save
            hierarchy. <a href="#provider-settings-spec">Open provider settings spec</a>.
          </>
        }
        actions={<Button variant="outline">View integration docs</Button>}
      />

      <div className="max-w-4xl">
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle>Bring your own key</CardTitle>
            <p className="text-sm text-text-secondary">
              Keep scope, auth mode, and editable fields visually separated so dense provider
              configuration stays scannable.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <Tabs
              value={region}
              onValueChange={(value) => setRegion(value as Region)}
              className="w-full"
            >
              <TabsList variant="compact">
                <TabsTrigger value="global" variant="compact">
                  Global
                </TabsTrigger>
                <TabsTrigger value="cn" variant="compact">
                  CN
                </TabsTrigger>
              </TabsList>

              {(["global", "cn"] as const).map((value) => {
                const copy = regionCopy[value];

                return (
                  <TabsContent key={value} value={value} className="mt-4 space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-text-primary">{copy.label} scope</p>
                      <p className="text-sm text-text-secondary">{copy.helper}</p>
                    </div>

                    <ToggleGroup
                      type="single"
                      variant="compact"
                      value={authMethod}
                      onValueChange={(nextValue) => {
                        if (nextValue === "oauth" || nextValue === "api-key") {
                          setAuthMethod(nextValue);
                          setIsReplacingKey(false);
                        }
                      }}
                      aria-label="Provider auth method"
                    >
                      <ToggleGroupItem variant="compact" value="oauth">
                        OAuth
                      </ToggleGroupItem>
                      <ToggleGroupItem variant="compact" value="api-key">
                        API Key
                      </ToggleGroupItem>
                    </ToggleGroup>

                    {authMethod === "oauth" ? (
                      <Alert variant="info">
                        <ShieldCheck size={16} />
                        <AlertTitle>OAuth keeps long-lived keys out of the form</AlertTitle>
                        <AlertDescription>
                          Use OAuth when the provider supports workspace-managed auth. Keep Save as
                          the final confirmation for regional defaults and network overrides.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            label="API key"
                            description="Stored keys stay masked until replaced."
                          >
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                              <FormFieldControl>
                                {isReplacingKey ? (
                                  <Input className="sm:flex-1" placeholder="sk-live-..." />
                                ) : (
                                  <Input
                                    className="sm:flex-1"
                                    readOnly
                                    value="sk-••••••••••••1234"
                                  />
                                )}
                              </FormFieldControl>
                              <Button
                                type="button"
                                variant="outline"
                                disabled={isReplacingKey}
                                onClick={() => setIsReplacingKey(true)}
                              >
                                {isReplacingKey ? "Replacing key" : "Replace key"}
                              </Button>
                            </div>
                          </FormField>

                          <FormField
                            label="Proxy URL"
                            description="Optional override for managed gateways or self-hosted routing."
                          >
                            <FormFieldControl>
                              <Input placeholder={currentRegion.proxyPlaceholder} />
                            </FormFieldControl>
                          </FormField>
                        </div>

                        <Alert>
                          <KeyRound size={16} />
                          <AlertTitle>Masked key + inline replace</AlertTitle>
                          <AlertDescription>
                            Keep the saved-secret state inside the form instead of moving it into a
                            detached success banner or redundant connected pill.
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          </CardContent>

          <PanelFooter>
            <PanelFooterMeta>
              {region === "global"
                ? "Global defaults apply across shared provider traffic"
                : "CN settings stay scoped to regional traffic only"}
            </PanelFooterMeta>
            <PanelFooterActions>
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </PanelFooterActions>
          </PanelFooter>
        </Card>
      </div>

      <div id="provider-settings-spec" className="max-w-4xl text-sm text-text-secondary">
        This scenario is the dedicated Storybook reference for BYOK composition. It keeps Global /
        CN scope, OAuth / API Key switching, masked saved keys, proxy overrides, and a right-aligned
        Save CTA in one review surface.
      </div>
    </div>
  );
}

const meta = {
  title: "Scenarios/Provider Settings",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Dedicated BYOK scenario showing the recommended Region → Auth method → Inputs → Save hierarchy for provider settings surfaces.",
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ByokHierarchy: Story = {
  name: "BYOK hierarchy",
  render: () => <ProviderSettingsScenario />,
};
