# Provider Settings Hierarchy

Stable guidance for provider-configuration surfaces in the `design` repository.

See also:

- Alignment checklist: `specs/2026-04-08-pr-105-ui-design-polish-alignment-checklist.md`
- Shared polish rules: `specs/ui-polish-conventions.md#7-provider-settings-hierarchy`
- Storybook reference: `apps/storybook/src/stories/ui-polish-audit.stories.tsx`

---

## Goal

Provider settings should feel structured and scannable, especially in dense BYOK flows.

The default hierarchy is:

1. **Region / scope selector**
2. **Auth method switcher**
3. **Inputs + trailing Save action**

Express this as **Region > Auth tab > Inputs > Save**.

---

## 1. Layout hierarchy

### Layer 1 — Region or scope

Use the first row for top-level context that changes the provider scope, for example:

- `Global` vs `CN`
- workspace vs personal scope
- cloud region variants when the endpoint contract changes

This row answers **where this configuration applies**.

### Layer 2 — Auth method

Use the second row for mutually exclusive auth modes, for example:

- `OAuth`
- `API Key`

This row answers **how this provider authenticates**.

Do not merge auth switching into the same row as region switching. They represent different decisions and should remain visually separate.

### Layer 3 — Form body

Show only the fields relevant to the selected auth method.

Typical fields include:

- API key
- proxy URL / base URL
- organization / project ID
- optional advanced fields that are still part of the saveable provider config

The save row belongs to the form body, after the inputs.

---

## 2. Recommended composition in `ui-web`

Prefer existing reusable pieces before inventing a dedicated pattern component.

- **Container:** `Card`
- **Layer 1:** `Tabs` or another segmented top-level selector
- **Layer 2:** `ToggleGroup` / segmented control for auth method
- **Layer 3:** `FormField` + `Input` (and related field primitives)
- **Actions:** trailing row with `Button`

Recommended structure:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Provider settings</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <Tabs defaultValue="global">
      <TabsList variant="compact">
        <TabsTrigger value="global" variant="compact">Global</TabsTrigger>
        <TabsTrigger value="cn" variant="compact">CN</TabsTrigger>
      </TabsList>

      <TabsContent value="global" className="mt-4 space-y-4">
        <ToggleGroup type="single" variant="compact" defaultValue="api-key">
          <ToggleGroupItem value="oauth" variant="compact">OAuth</ToggleGroupItem>
          <ToggleGroupItem value="api-key" variant="compact">API Key</ToggleGroupItem>
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
    </Tabs>
  </CardContent>
</Card>
```

---

## 3. Saved API key pattern

For an already configured API key, prefer a **masked field with inline replace**.

### Do

- show a masked value such as `sk-••••••••••••1234`
- keep the field in the normal form layout
- use an inline secondary action such as `Replace key` or `Edit`
- keep `Save` as the final confirmation action for the overall form

### Do not

- move the saved-key state into a detached success banner above the form
- replace the entire field area with passive “Connected” messaging
- force users into a separate modal just to understand whether a key is stored

The saved-secret state should remain legible inside the same configuration surface where it can be edited.

---

## 4. Save CTA contract

The primary confirmation action belongs at the bottom-right of the configuration area.

### Rules

- Use a trailing row: `flex justify-end gap-2`
- Secondary actions sit to the **left** of the primary `Save`
- Keep only one visually primary CTA in the row
- Use `loading` on `Save` during async submission
- Keep the action row inside the same card / panel as the inputs it saves

### Example

```tsx
<div className="flex justify-end gap-2">
  <Button variant="outline">Cancel</Button>
  <Button loading={isSaving}>Save</Button>
</div>
```

---

## 5. Content and density guidance

- Prefer concise labels: `API key`, `Proxy URL`, `Base URL`
- Keep helper text directly under the relevant field instead of above the whole card
- Use compact selectors only if they still respect the 12px interactive typography floor
- For dense layouts, keep spacing at `space-y-4` between layers and `gap-4` inside field grids

---

## 6. When to create a dedicated `ui-web` pattern

Do **not** add a new `provider settings card` primitive until the composition gap is proven.

Consider a dedicated pattern only if multiple real surfaces repeatedly need all of the following at once:

- region switching
- auth switching
- saved-secret masking
- field-grid layout
- standardized right-aligned save actions

Until then, the preferred approach is documented composition with existing `Card`, selector, form, and button primitives.
