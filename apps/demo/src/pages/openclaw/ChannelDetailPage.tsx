import { Badge, Button, DiscordIcon, FeishuIcon, SlackIcon } from "@nexu-design/ui-web";
import { ArrowUpRight, FolderOpen, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import {
  type BotMessage,
  type Platform,
  getChannel,
  getChannelMessages,
  getPlatformLabel,
} from "./data";

const PLATFORM_ICONS: Record<Platform, typeof SlackIcon> = {
  slack: SlackIcon,
  feishu: FeishuIcon,
  discord: DiscordIcon,
};

const PLATFORM_OPEN_LABELS: Record<Platform, string> = {
  slack: "Open in Slack",
  feishu: "Open in Feishu",
  discord: "Open in Discord",
};

function PlatformIcon({ platform, size = 20 }: { platform: Platform; size?: number }) {
  const config: Record<Platform, { bg: string; emoji: string }> = {
    slack: { bg: "bg-[rgba(217,153,247,0.15)]", emoji: "#" },
    feishu: { bg: "bg-[var(--color-info-subtle)]", emoji: "#" },
    discord: { bg: "bg-[var(--color-info-subtle)]", emoji: "#" },
  };
  const { bg, emoji } = config[platform];
  return (
    <div
      className={`flex justify-center items-center rounded-lg ${bg}`}
      style={{ width: size + 8, height: size + 8 }}
    >
      <span style={{ fontSize: size * 0.6 }}>{emoji}</span>
    </div>
  );
}

const USER_AVATAR =
  "https://api.dicebear.com/7.x/lorelei/svg?seed=user&backgroundColor=b6e3f4,c0aede";
const BOT_AVATAR = "/brand/ip-nexu.svg";

function NexuThinking() {
  return (
    <div className="flex items-center gap-3">
      <img
        src={BOT_AVATAR}
        alt=""
        className="w-9 h-9 -ml-1 object-contain shrink-0 animate-nexu-bounce"
      />
      <div className="flex items-center gap-0.5 text-[13px] text-text-tertiary">
        <span>thinking</span>
        <span className="inline-flex gap-[2px] ml-[1px]">
          <span className="animate-dot-fade" style={{ animationDelay: "0s" }}>
            .
          </span>
          <span className="animate-dot-fade" style={{ animationDelay: "0.3s" }}>
            .
          </span>
          <span className="animate-dot-fade" style={{ animationDelay: "0.6s" }}>
            .
          </span>
        </span>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: BotMessage }) {
  const isBot = msg.role === "bot";
  return (
    <div className={`flex gap-3 ${isBot ? "" : "flex-row-reverse"}`}>
      <img
        src={isBot ? BOT_AVATAR : USER_AVATAR}
        alt=""
        className={`shrink-0 ${isBot ? "w-9 h-9 -ml-1 mt-0 object-contain" : "w-7 h-7 mt-0.5 rounded-lg object-cover ring-1 ring-border/50"}`}
      />
      <div className={`max-w-[75%] ${isBot ? "" : "text-right"}`}>
        <div className={`flex flex-col gap-2 ${isBot ? "items-start" : "items-end"}`}>
          <div
            className={`inline-block px-3.5 py-2.5 rounded-xl text-[13px] leading-relaxed whitespace-pre-line ${
              isBot
                ? "bg-surface-1 border border-border text-text-primary rounded-tl-sm"
                : "bg-surface-3 text-text-primary rounded-tr-sm"
            }`}
          >
            {msg.content}
          </div>
          {msg.oauthPrompt && (
            <div className="rounded-xl border border-border bg-surface-1 p-4 max-w-xs text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--color-info-subtle)] flex items-center justify-center shrink-0">
                  <Shield size={16} className="text-[var(--color-info)]" />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-text-primary">
                    {msg.oauthPrompt.toolName}
                  </div>
                  <div className="text-[11px] text-text-muted">
                    {msg.oauthPrompt.provider} · OAuth 2.0
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed mb-3">
                nexu needs permission to access your {msg.oauthPrompt.toolName} account to complete
                this task.
              </p>
              <Button asChild className="w-full" size="sm">
                <Link to={`/openclaw/oauth/${msg.oauthPrompt.toolId}`}>
                  <ArrowUpRight size={12} />
                  Connect {msg.oauthPrompt.toolName}
                </Link>
              </Button>
            </div>
          )}
          {msg.deployment && (
            <a
              href={msg.deployment.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[12px] text-link hover:underline"
            >
              <span className="min-w-0">{msg.deployment.title}</span>
              <ArrowUpRight size={12} className="shrink-0 translate-y-px" aria-hidden />
            </a>
          )}
          {msg.contentArtifact && (
            <a
              href={msg.contentArtifact.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[12px] text-link hover:underline"
            >
              <span className="min-w-0">{msg.contentArtifact.title}</span>
              <ArrowUpRight size={12} className="shrink-0 translate-y-px" aria-hidden />
            </a>
          )}
        </div>
        <div className={`text-[10px] text-text-muted mt-1 ${isBot ? "" : "text-right"}`}>
          {msg.time}
        </div>
      </div>
    </div>
  );
}

export default function ChannelDetailPage({ channelId }: { channelId: string }) {
  const channel = getChannel(channelId);

  if (!channel) {
    return (
      <div className="flex flex-col justify-center items-center h-full text-center">
        <div className="mb-2 text-lg font-semibold text-text-primary">Channel not found</div>
      </div>
    );
  }

  const messages = getChannelMessages(channelId);
  const PIcon = PLATFORM_ICONS[channel.platform];

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="shrink-0 border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-3 items-center">
            <PlatformIcon platform={channel.platform} size={22} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[15px] font-bold text-text-heading">{channel.name}</h1>
                <Badge
                  variant={channel.chatType === "group" ? "accent" : "default"}
                  className={
                    channel.chatType === "group"
                      ? "bg-[var(--color-info-subtle)] text-[var(--color-info)]"
                      : "bg-[rgba(217,153,247,0.10)] text-[var(--color-pink)]"
                  }
                >
                  {channel.chatType === "group" ? "Group" : "DM"}
                </Badge>
              </div>
              <div className="text-[11px] text-text-muted mt-0.5">
                {getPlatformLabel(channel.platform)} · {channel.messageCount} messages · Last active{" "}
                {channel.lastMessage ?? channel.createdAt}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Opens the local folder containing all chat artifacts
              }}
              title="Open local folder"
            >
              <FolderOpen size={14} />
              Open Folder
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // In production, this would deep-link to the actual Slack conversation
              }}
            >
              <PIcon size={16} />
              {PLATFORM_OPEN_LABELS[channel.platform]}
              <ArrowUpRight size={12} className="text-text-muted size-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6 space-y-8">
          {/* Messages */}
          {messages.length > 0 && (
            <div className="space-y-4">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}
              <NexuThinking />
            </div>
          )}

          {messages.length === 0 && (
            <div className="text-center py-16">
              <div className="text-[13px] text-text-muted">
                No messages yet. Start a conversation in {getPlatformLabel(channel.platform)}.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
