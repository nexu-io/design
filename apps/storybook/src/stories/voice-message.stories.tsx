import type { Meta, StoryObj } from "@storybook/react-vite";

import { VoiceMessage } from "@nexu-design/ui-web";

const meta = {
  title: "Primitives/VoiceMessage",
  component: VoiceMessage,
  tags: ["autodocs"],
  args: {
    duration: "0:24",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Voice-note attachment with a play button, stable waveform, duration, and optional transcript. The waveform is decorative by default and uses brand-subtle fills at rest.",
      },
    },
  },
} satisfies Meta<typeof VoiceMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithTranscript: Story = {
  args: {
    transcript:
      "We sized the SLO at 99.5 so we've got room, and I'd rather trip the breaker less often than page someone.",
  },
};

export const Playing: Story = {
  args: {
    state: "playing",
    transcript: "Playing state fills the waveform in full brand colour.",
  },
};

export const CustomWaveform: Story = {
  args: {
    waveform: [4, 8, 14, 18, 22, 24, 22, 18, 14, 8, 4, 8, 14, 18, 22, 24, 22, 18, 14, 8],
  },
};
