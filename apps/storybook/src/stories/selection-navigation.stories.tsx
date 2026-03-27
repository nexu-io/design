import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger,
  TagGroup,
  TagGroupItem,
} from "@nexu/ui-web";

const meta = {
  title: "Primitives/SelectionNavigation",
  component: Combobox,
  tags: ["autodocs"],
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ComboboxExample: Story = {
  args: {
    children: null,
  },
  render: () => (
    <div className="h-[320px] w-[360px]">
      <Combobox defaultOpen defaultValue="gamma">
        <ComboboxTrigger>Select skill</ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput placeholder="Search skills" />
          <div className="p-1">
            <ComboboxItem value="alpha" textValue="Alpha research">
              Alpha research
            </ComboboxItem>
            <ComboboxItem value="beta" textValue="Beta ops">
              Beta ops
            </ComboboxItem>
            <ComboboxItem value="gamma" textValue="Gamma automation">
              Gamma automation
            </ComboboxItem>
          </div>
        </ComboboxContent>
      </Combobox>
    </div>
  ),
};

export const BreadcrumbExample: Story = {
  args: {
    children: null,
  },
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/workspace">Workspace</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbLink href="/workspace/components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Combobox</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

export const TagGroupExample: Story = {
  args: {
    children: null,
  },
  render: () => (
    <TagGroup>
      <TagGroupItem variant="brand">AI</TagGroupItem>
      <TagGroupItem variant="accent">Slack</TagGroupItem>
      <TagGroupItem variant="success">Healthy</TagGroupItem>
      <TagGroupItem variant="warning">Needs review</TagGroupItem>
    </TagGroup>
  ),
};
