import type { Meta, StoryObj } from "@storybook/react-vite";

import { VideoAttachment } from "@nexu-design/ui-web";

const meta = {
  title: "Primitives/VideoAttachment",
  component: VideoAttachment,
  tags: ["autodocs"],
  args: {
    thumbnail: "https://picsum.photos/seed/video-attachment/640/360",
    duration: "02:37",
    title: "Bug-2174-repro.mp4",
    meta: "8.4 MB",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Video attachment card with play-overlay thumbnail and a single-line footer for title and optional meta.",
      },
    },
  },
} satisfies Meta<typeof VideoAttachment>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoMeta: Story = {
  args: {
    meta: undefined,
  },
};

export const LongTitle: Story = {
  args: {
    title: "onboarding-wizard-step-3-drop-off-recorded.mp4",
  },
};
