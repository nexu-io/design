import type { Meta, StoryObj } from "@storybook/react-vite";

import { VoiceMessage } from "@nexu-design/ui-web";

import { docsDescription } from "../storybook/docs-links";

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
        component: `Voice-note attachment with a play button, stable waveform, duration, and optional transcript. The transcript is hidden by default to keep the feed compact — a captions toggle appears on hover and expands the text inline. Pass \`defaultTranscriptOpen\` to start expanded.

${docsDescription("/components/voice-message")}`,
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
  parameters: {
    docs: {
      description: {
        story:
          "Hover the card to reveal the captions toggle (top-right of the waveform row), then click it to expand the transcript. Click again to collapse.",
      },
    },
  },
};

export const TranscriptOpen: Story = {
  args: {
    transcript:
      "Starts expanded via `defaultTranscriptOpen` — useful when the transcript is the primary content (e.g. in search results or accessibility-first contexts).",
    defaultTranscriptOpen: true,
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
    waveform: [1, 1, 2, 3, 3, 4, 3, 3, 2, 1, 1, 1, 2, 3, 3, 4, 3, 3, 2, 1],
  },
};
