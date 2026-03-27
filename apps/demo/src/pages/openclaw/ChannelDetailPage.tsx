import {
  ExternalLink,
  ArrowUpRight,
  Shield,
  FolderOpen,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getChannel,
  getChannelMessages,
  getPlatformLabel,
  type Platform,
  type BotMessage,
} from './data';
import { Badge, Button } from '@nexu-design/ui-web';

function SlackIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#E01E5A" />
      <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.527 2.527 0 0 1 2.521 2.521 2.527 2.527 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#36C5F0" />
      <path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.27 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.163 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" fill="#2EB67D" />
      <path d="M15.163 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.163 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.27a2.527 2.527 0 0 1-2.52-2.523 2.527 2.527 0 0 1 2.52-2.52h6.315A2.528 2.528 0 0 1 24 15.163a2.528 2.528 0 0 1-2.522 2.523h-6.315z" fill="#ECB22E" />
    </svg>
  );
}

function FeishuIcon({ size = 16 }: { size?: number }) {
  return <img src="/feishu-logo.png" width={size} height={size} alt="Feishu" style={{ objectFit: 'contain' }} />;
}

function DiscordIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 127.14 96.36" fill="#5865F2">
      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
    </svg>
  );
}

const PLATFORM_ICONS: Record<Platform, typeof SlackIcon> = {
  slack: SlackIcon,
  feishu: FeishuIcon,
  discord: DiscordIcon,
};

const PLATFORM_OPEN_LABELS: Record<Platform, string> = {
  slack: 'Open in Slack',
  feishu: 'Open in Feishu',
  discord: 'Open in Discord',
};

function PlatformIcon({ platform, size = 20 }: { platform: Platform; size?: number }) {
  const config: Record<Platform, { bg: string; emoji: string }> = {
    slack: { bg: 'bg-[rgba(217,153,247,0.15)]', emoji: '#' },
    feishu: { bg: 'bg-[var(--color-info-subtle)]', emoji: '#' },
    discord: { bg: 'bg-[var(--color-info-subtle)]', emoji: '#' },
  };
  const { bg, emoji } = config[platform];
  return (
    <div className={`flex justify-center items-center rounded-lg ${bg}`} style={{ width: size + 8, height: size + 8 }}>
      <span style={{ fontSize: size * 0.6 }}>{emoji}</span>
    </div>
  );
}

const USER_AVATAR = 'https://api.dicebear.com/7.x/lorelei/svg?seed=user&backgroundColor=b6e3f4,c0aede';
const BOT_AVATAR = '/brand/ip-nexu.svg';

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
          <span className="animate-dot-fade" style={{ animationDelay: '0s' }}>.</span>
          <span className="animate-dot-fade" style={{ animationDelay: '0.3s' }}>.</span>
          <span className="animate-dot-fade" style={{ animationDelay: '0.6s' }}>.</span>
        </span>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: BotMessage }) {
  const isBot = msg.role === 'bot';
  return (
    <div className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'}`}>
      <img
        src={isBot ? BOT_AVATAR : USER_AVATAR}
        alt=""
        className={`shrink-0 ${isBot ? 'w-9 h-9 -ml-1 mt-0 object-contain' : 'w-7 h-7 mt-0.5 rounded-lg object-cover ring-1 ring-border/50'}`}
      />
      <div className={`max-w-[75%] ${isBot ? '' : 'text-right'}`}>
        <div className={`inline-block px-3.5 py-2.5 rounded-xl text-[13px] leading-relaxed whitespace-pre-line ${
          isBot
            ? 'bg-surface-1 border border-border text-text-primary rounded-tl-sm'
            : 'bg-surface-3 text-text-primary rounded-tr-sm'
        }`}>
          {msg.content}
        </div>
        {msg.oauthPrompt && (
          <div className="mt-2 rounded-xl border border-border bg-surface-1 p-4 max-w-xs text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--color-info-subtle)] flex items-center justify-center shrink-0">
                <Shield size={16} className="text-[var(--color-info)]" />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-text-primary">{msg.oauthPrompt.toolName}</div>
                <div className="text-[11px] text-text-muted">{msg.oauthPrompt.provider} · OAuth 2.0</div>
              </div>
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed mb-3">
              nexu needs permission to access your {msg.oauthPrompt.toolName} account to complete this task.
            </p>
            <Button asChild className="w-full" size="sm">
              <Link to={`/openclaw/oauth/${msg.oauthPrompt.toolId}`}>
                <ExternalLink size={12} />
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
            className="flex items-center gap-1.5 mt-1.5 text-[11px] text-brand-primary hover:underline"
          >
            <ExternalLink size={10} />
            {msg.deployment.title}
          </a>
        )}
        {msg.contentArtifact && (
          <a
            href={msg.contentArtifact.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 mt-1.5 text-[11px] text-brand-primary hover:underline"
          >
            <ExternalLink size={10} />
            {msg.contentArtifact.title}
          </a>
        )}
        <div className={`text-[10px] text-text-muted mt-1 ${isBot ? '' : 'text-right'}`}>{msg.time}</div>
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
                  variant={channel.chatType === 'group' ? 'brand' : 'default'}
                  className={channel.chatType === 'group' ? 'bg-[var(--color-info-subtle)] text-[var(--color-info)]' : 'bg-[rgba(217,153,247,0.10)] text-[var(--color-pink)]'}
                >
                  {channel.chatType === 'group' ? 'Group' : 'DM'}
                </Badge>
              </div>
              <div className="text-[11px] text-text-muted mt-0.5">
                {getPlatformLabel(channel.platform)} · {channel.messageCount} messages · Last active {channel.lastMessage ?? channel.createdAt}
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
              <div className="text-[13px] text-text-muted">No messages yet. Start a conversation in {getPlatformLabel(channel.platform)}.</div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
