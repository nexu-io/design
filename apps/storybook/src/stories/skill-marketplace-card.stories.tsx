import type { Meta, StoryObj } from "@storybook/react-vite";

import { Bot, Code, FileSearch, Globe, MessageSquare, PenTool } from "lucide-react";

import { Button, SkillMarketplaceCard } from "@nexu-design/ui-web";

import { docsDescription } from "../storybook/docs-links";

const meta = {
  title: "Patterns/SkillMarketplaceCard",
  component: SkillMarketplaceCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docsDescription("/patterns/skill-marketplace-card"),
      },
    },
  },
  args: {
    name: "Web Search",
    description: "Search the web for real-time information and return summarized results.",
    icon: Globe,
  },
} satisfies Meta<typeof SkillMarketplaceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    categoryLabel: "Research",
    footer: (
      <Button variant="default" size="sm">
        Install
      </Button>
    ),
  },
  decorators: [
    (Story) => (
      <div className="w-[260px]">
        <Story />
      </div>
    ),
  ],
};

export const WithLogo: Story = {
  args: {
    name: "GitHub Copilot",
    description:
      "AI pair programming that helps you write code faster with contextual suggestions.",
    categoryLabel: "Coding",
    logo: "https://github.githubassets.com/favicons/favicon-dark.svg",
    icon: Code,
    footer: (
      <Button variant="default" size="sm">
        Install
      </Button>
    ),
  },
  decorators: [
    (Story) => (
      <div className="w-[260px]">
        <Story />
      </div>
    ),
  ],
};

export const Dimmed: Story = {
  args: {
    name: "Content Writer",
    description: "Generate high-quality articles, blog posts, and marketing copy.",
    categoryLabel: "Writing",
    icon: PenTool,
    dimmed: true,
    footer: (
      <Button variant="ghost" size="sm" disabled>
        Installed
      </Button>
    ),
  },
  decorators: [
    (Story) => (
      <div className="w-[260px]">
        <Story />
      </div>
    ),
  ],
};

export const Grid: Story = {
  render: () => (
    <div className="grid max-w-3xl grid-cols-3 gap-4">
      <SkillMarketplaceCard
        name="Web Search"
        description="Search the web for real-time information and return summarized results."
        categoryLabel="Research"
        icon={Globe}
        footer={
          <Button variant="default" size="sm">
            Install
          </Button>
        }
      />
      <SkillMarketplaceCard
        name="Code Review"
        description="Analyze code for bugs, style issues, and suggest improvements."
        categoryLabel="Coding"
        icon={Code}
        footer={
          <Button variant="default" size="sm">
            Install
          </Button>
        }
      />
      <SkillMarketplaceCard
        name="Chat Agent"
        description="Conversational AI that handles customer support queries across channels."
        categoryLabel="Social"
        icon={MessageSquare}
        footer={
          <Button variant="default" size="sm">
            Install
          </Button>
        }
      />
      <SkillMarketplaceCard
        name="Document Scanner"
        description="Extract and summarize key information from uploaded documents."
        categoryLabel="Research"
        icon={FileSearch}
        footer={
          <Button variant="default" size="sm">
            Install
          </Button>
        }
      />
      <SkillMarketplaceCard
        name="Content Writer"
        description="Generate high-quality articles, blog posts, and marketing copy."
        categoryLabel="Writing"
        icon={PenTool}
        dimmed
        footer={
          <Button variant="ghost" size="sm" disabled>
            Installed
          </Button>
        }
      />
      <SkillMarketplaceCard
        name="AI Assistant"
        description="General-purpose AI assistant for task automation and workflow management."
        icon={Bot}
        footer={
          <Button variant="default" size="sm">
            Install
          </Button>
        }
      />
    </div>
  ),
};
