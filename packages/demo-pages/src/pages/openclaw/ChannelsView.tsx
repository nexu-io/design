import {
  Button,
  Card,
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  PageHeader,
} from "@nexu-design/ui-web";
import { AlertTriangle, CheckCircle2, Eye, EyeOff, ExternalLink, MessageSquare, Smartphone } from "lucide-react";
import { useState } from "react";
import { useLocale } from "../../hooks/useLocale";
import { CHANNEL_CONFIG_FIELDS, ONBOARDING_CHANNELS } from "./channelSetup";

const QR_CHANNELS = new Set(["wechat", "whatsapp"]);

export type ChannelId = (typeof ONBOARDING_CHANNELS)[number]["id"];

const MOCK_MESSAGE_COUNTS: Partial<Record<ChannelId, number>> = {
  wechat: 0,
  feishu: 1_284,
  wecom: 0,
  slack: 347,
  telegram: 0,
  discord: 89,
  whatsapp: 0,
  dingtalk: 0,
  qqbot: 0,
};

export function getDefaultConnectedChannels(): Set<ChannelId> {
  return new Set(ONBOARDING_CHANNELS.filter((c) => c.recommended).map((c) => c.id));
}

type ChannelsViewProps = {
  connectedChannels: Set<ChannelId>;
  onConnectedChange: (next: Set<ChannelId>) => void;
};

export function ChannelsView({ connectedChannels, onConnectedChange }: ChannelsViewProps) {
  const { t } = useLocale();
  const [selectedId, setSelectedId] = useState<ChannelId>(ONBOARDING_CHANNELS[0].id);
  const saved = connectedChannels;
  const setSaved = (updater: (prev: Set<ChannelId>) => Set<ChannelId>) => {
    onConnectedChange(updater(connectedChannels));
  };
  const [showSecrets, setShowSecrets] = useState<Set<string>>(() => new Set());
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

  const selected = ONBOARDING_CHANNELS.find((c) => c.id === selectedId) ?? ONBOARDING_CHANNELS[0];
  const fields = CHANNEL_CONFIG_FIELDS[selectedId] ?? [];
  const isSaved = saved.has(selectedId);

  const toggleSecret = (fieldId: string) => {
    setShowSecrets((prev) => {
      const next = new Set(prev);
      if (next.has(fieldId)) next.delete(fieldId);
      else next.add(fieldId);
      return next;
    });
  };

  const handleSave = () => {
    setSaved((prev) => new Set(prev).add(selectedId));
  };

  const handleDisconnect = () => {
    setSaved((prev) => {
      const next = new Set(prev);
      next.delete(selectedId);
      return next;
    });
    setShowDisconnectConfirm(false);
  };

  const messageCount = MOCK_MESSAGE_COUNTS[selectedId] ?? 0;

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-[800px] px-4 sm:px-6 pt-2 pb-6 sm:pb-8">
        <PageHeader density="shell" title="Channel" description="Connect IM platforms to nexu" />

        <div className="flex gap-6 mt-2">
          {/* Left: channel list — connected channels sorted to top */}
          <div className="w-[220px] shrink-0 space-y-1">
            {[...ONBOARDING_CHANNELS]
              .sort((a, b) => {
                const aConn = saved.has(a.id) ? 0 : 1;
                const bConn = saved.has(b.id) ? 0 : 1;
                return aConn - bConn;
              })
              .map((ch) => {
                const active = ch.id === selectedId;
                const connected = saved.has(ch.id);
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setSelectedId(ch.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                      active
                        ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                        : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                    }`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-1 border border-border shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                      <ch.icon size={20} />
                    </span>
                    <span className="flex-1 truncate text-[13px] font-medium">{ch.name}</span>
                    {connected && (
                      <span className="shrink-0 text-[10px] font-medium text-[var(--color-success)]">
                        Connected
                      </span>
                    )}
                  </button>
                );
              })}
          </div>

          {/* Right: config panel */}
          <div className="flex-1 min-w-0">
            <Card variant="static" padding="none" className="overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-border px-5 py-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-1 border border-border shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                  <selected.icon size={22} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-text-primary">
                    {selected.name} Settings
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    isSaved
                      ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                      : "bg-surface-2 text-text-muted"
                  }`}
                >
                  {isSaved ? "Connected" : "Disconnected"}
                </span>
              </div>

              {isSaved ? (
                /* ── Save 后：成功状态 ── */
                <div className="px-5 py-8 flex flex-col items-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-success)]/10 mb-4">
                    <CheckCircle2 size={28} className="text-[var(--color-success)]" />
                  </div>
                  <h3 className="text-[15px] font-semibold text-text-primary mb-1">
                    {selected.name} connected
                  </h3>
                  <p className="text-[12px] text-text-muted mb-5">
                    Bot is active and receiving messages
                  </p>

                  <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-0 px-4 py-3 mb-6">
                    <MessageSquare size={16} className="text-text-muted shrink-0" />
                    <span className="text-[13px] font-medium text-text-primary tabular-nums">
                      {messageCount.toLocaleString()}
                    </span>
                    <span className="text-[12px] text-text-muted">messages sent</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowDisconnectConfirm(true)}
                      className="text-[12px] font-medium text-[var(--color-danger)] hover:underline"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              ) : QR_CHANNELS.has(selectedId) ? (
                /* ── 扫码流程：WeChat / WhatsApp ── */
                <div className="px-5 py-8 flex flex-col items-center text-center">
                  <div className="flex justify-center mb-5">
                    <div className="w-14 h-14 rounded-xl bg-surface-1 border border-border flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                      <selected.icon size={28} />
                    </div>
                  </div>

                  <h3 className="text-[15px] font-semibold text-text-primary mb-1">
                    Connect {selected.name}
                  </h3>
                  <p className="text-[13px] text-text-muted mb-6 max-w-[280px]">
                    {selected.id === "wechat"
                      ? "Scan the QR code with WeChat to log in and connect the bot."
                      : "Scan the QR code with WhatsApp to join and connect the bot."}
                  </p>

                  {/* QR code placeholder */}
                  <div className="w-[200px] h-[200px] rounded-xl border-2 border-dashed border-border bg-surface-1 flex items-center justify-center mb-5">
                    <div className="text-center">
                      <Smartphone size={32} className="mx-auto text-text-muted/40 mb-2" />
                      <span className="text-[11px] text-text-muted">
                        QR Code
                      </span>
                    </div>
                  </div>

                  <p className="text-[12px] text-text-muted leading-relaxed mb-5 max-w-[280px]">
                    {selected.id === "wechat"
                      ? "Open WeChat on your phone → Scan → Start chatting"
                      : "Open WhatsApp on your phone → Scan → Start chatting"}
                  </p>

                  <a
                    href={selected.docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--color-accent)] hover:underline"
                  >
                    Setup Manual
                    <ExternalLink size={11} />
                  </a>
                </div>
              ) : (
                /* ── Credential 配置表单 ── */
                <>
                  {/* Setup instructions */}
                  <div className="px-5 pt-4 pb-2">
                    <div className="rounded-lg border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/[0.04] px-4 py-3">
                      <ol className="space-y-1.5 text-[12px] text-[var(--color-accent)] leading-relaxed list-decimal list-inside">
                        {selected.id === "dingtalk" && (
                          <>
                            <li>
                              Go to DingTalk Open Platform, create or pick an enterprise app under
                              "App Development &gt; Bot"
                            </li>
                            <li>
                              Copy the Client ID (AppKey) and Client Secret (AppSecret) from the
                              credentials page
                            </li>
                            <li>
                              Turn on the "Bot" capability and enter Client ID and Client Secret
                              below
                            </li>
                            <li>Once saved, the bot will auto-connect via Stream mode</li>
                          </>
                        )}
                        {selected.id === "feishu" && (
                          <>
                            <li>
                              Go to Feishu Open Platform, create an enterprise app in "App
                              Development"
                            </li>
                            <li>Copy App ID and App Secret from App Credentials</li>
                            <li>Enable the Bot capability and configure event subscriptions</li>
                            <li>Enter the credentials below and save</li>
                          </>
                        )}
                        {selected.id === "slack" && (
                          <>
                            <li>Create a Slack App in the API dashboard</li>
                            <li>Copy Bot User OAuth Token and Signing Secret</li>
                            <li>Set the event subscription URL and enable event types</li>
                            <li>Enter the credentials below and save</li>
                          </>
                        )}
                        {selected.id === "discord" && (
                          <>
                            <li>Create an application in the Discord Developer Portal</li>
                            <li>Copy the App ID and Bot Token from the Bot section</li>
                            <li>Enable the required intents (Message Content, etc.)</li>
                            <li>Enter the credentials below and save</li>
                          </>
                        )}
                        {selected.id === "telegram" && (
                          <>
                            <li>Create a bot via @BotFather on Telegram</li>
                            <li>Copy the Bot Token from the BotFather message</li>
                            <li>Enter the token below and save</li>
                          </>
                        )}
                        {selected.id === "qqbot" && (
                          <>
                            <li>Register in the QQ Bot Open Platform</li>
                            <li>Copy App ID and App Secret from App Management</li>
                            <li>Configure intents and event callbacks</li>
                            <li>Enter the credentials below and save</li>
                          </>
                        )}
                        {selected.id === "wecom" && (
                          <>
                            <li>Go to WeCom Admin Console and create an app</li>
                            <li>Copy Corp ID from My Enterprise &gt; Enterprise Info</li>
                            <li>Copy Agent Secret from App Management</li>
                            <li>Enter the credentials below and save</li>
                          </>
                        )}
                      </ol>
                      <a
                        href={selected.docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-[var(--color-accent)] hover:underline"
                      >
                        Setup Manual
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>

                  {/* Config fields */}
                  <div className="space-y-4 px-5 pt-3 pb-5">
                    {fields.map((field) => {
                      const isSecret =
                        field.id.toLowerCase().includes("secret") ||
                        field.id.toLowerCase().includes("token");
                      const visible = showSecrets.has(field.id);
                      return (
                        <div key={field.id}>
                          <label className="block text-[12px] font-medium text-text-secondary mb-1.5">
                            {field.label}
                          </label>
                          <div className="relative">
                            <input
                              type={isSecret && !visible ? "password" : "text"}
                              placeholder={field.placeholder}
                              className="w-full rounded-lg border border-border bg-surface-0 px-3 py-2.5 text-[13px] text-text-primary placeholder:text-text-muted/40 outline-none transition-colors focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 font-mono"
                            />
                            {isSecret && (
                              <button
                                type="button"
                                onClick={() => toggleSecret(field.id)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                              >
                                {visible ? <Eye size={15} /> : <EyeOff size={15} />}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3">
                    <Button variant="outline" size="sm">
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                      Save
                    </Button>
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Disconnect confirmation dialog */}
      <Dialog open={showDisconnectConfirm} onOpenChange={setShowDisconnectConfirm}>
        <DialogContent size="sm" className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[15px] font-semibold text-text-primary">
              <AlertTriangle size={16} className="text-[var(--color-danger)]" />
              Disconnect {selected.name}?
            </DialogTitle>
          </DialogHeader>
          <DialogBody className="py-2">
            <p className="text-[13px] text-text-muted leading-relaxed">
              This will remove the {selected.name} bot connection. All configuration will be
              cleared and the bot will stop responding to messages.
            </p>
            <div className="flex items-center justify-end gap-2 mt-5">
              <Button variant="outline" size="sm" onClick={() => setShowDisconnectConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </div>
  );
}
