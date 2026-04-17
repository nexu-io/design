import { Button, Card, TextLink } from "@nexu-design/ui-web";
import {
  ArrowUp,
  ArrowUpRight,
  ChevronDown,
  Paperclip,
  Settings,
  Shield,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocale } from "../../hooks/useLocale";
import { type BotMessage, getChannel, getChannelMessages, getPlatformLabel } from "./data";

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
  const navigate = useNavigate();
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
              <Button
                className="w-full"
                size="sm"
                onClick={() => navigate(`/openclaw/oauth/${msg.oauthPrompt?.toolId}`)}
              >
                <span className="inline-flex items-center gap-1.5">
                  <ArrowUpRight size={12} />
                  <span>Connect {msg.oauthPrompt.toolName}</span>
                </span>
              </Button>
            </div>
          )}
          {msg.deployment && (
            <TextLink
              href={msg.deployment.url}
              target="_blank"
              rel="noreferrer"
              size="sm"
              showArrowUpRight
              className="text-[12px] leading-none text-[var(--color-link)]"
            >
              <span className="min-w-0">{msg.deployment.title}</span>
            </TextLink>
          )}
          {msg.contentArtifact && (
            <TextLink
              href={msg.contentArtifact.url}
              target="_blank"
              rel="noreferrer"
              size="sm"
              showArrowUpRight
              className="text-[12px] leading-none text-[var(--color-link)]"
            >
              <span className="min-w-0">{msg.contentArtifact.title}</span>
            </TextLink>
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
  const { t } = useLocale();
  const channel = getChannel(channelId);

  if (!channel) {
    return (
      <div className="flex flex-col justify-center items-center h-full text-center">
        <div className="mb-2 text-lg font-semibold text-text-primary">Channel not found</div>
      </div>
    );
  }

  const messages = getChannelMessages(channelId);
  return (
    <div className="flex flex-col h-full w-full">
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

      {/* Input bar */}
      <div className="shrink-0 px-6 py-4">
        <Card variant="static" padding="none" className="w-full max-w-[640px] mx-auto">
          <div className="px-4 pt-4 pb-2">
            <textarea
              rows={3}
              placeholder={t("ws.home.chatPlaceholder")}
              className="w-full resize-none bg-transparent text-[14px] text-text-primary placeholder:text-text-muted/50 outline-none leading-relaxed"
            />
          </div>
          <div className="flex items-center justify-between px-4 pb-3 pt-1">
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-text-secondary hover:bg-surface-2 transition-colors"
              >
                <Sparkles size={14} />
                <span className="truncate max-w-[120px]">DeepSeek V3.2</span>
                <ChevronDown size={10} className="text-text-muted" />
              </button>
              <button
                type="button"
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors"
              >
                <Paperclip size={16} />
              </button>
              <button
                type="button"
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors"
              >
                <Settings size={16} />
              </button>
            </div>
            <button
              type="button"
              className="flex items-center justify-center w-8 h-8 rounded-lg transition-all bg-surface-2 text-text-muted cursor-default"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
