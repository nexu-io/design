import { Check, Download, LoaderCircle } from "lucide-react";
import { useState } from "react";

import {
  Badge,
  BrandLogo,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  EntityCardMedia,
  PlatformLogo,
  cn,
} from "@nexu-design/ui-web";

import type { RewardChannel } from "../../hooks/useBudget";
import { ChannelIcon } from "./iconHelpers";

function formatRewardAmount(n: number): string {
  return String(Math.round(n));
}

function downloadShareCard() {
  const W = 1080;
  const H = 1080;
  const PAD = 80;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, "#f8fafc");
  grad.addColorStop(1, "#e2e8f0");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 64px system-ui, -apple-system, sans-serif";
  ctx.fillText("nexu", PAD, 160);

  ctx.fillStyle = "#475569";
  ctx.font = "32px system-ui, -apple-system, sans-serif";
  const tagline = "The simplest open-source openclaw desktop app";
  ctx.fillText(tagline, PAD, 220);

  ctx.fillStyle = "#64748b";
  ctx.font = "28px system-ui, -apple-system, sans-serif";
  const lines = [
    "Bridge your Agent to WeChat, Feishu,",
    "Slack & Discord in one click.",
    "",
    "Works with Claude Code, Codex & any LLM.",
    "BYOK, OAuth, local-first.",
  ];
  let y = 320;
  for (const line of lines) {
    if (line) ctx.fillText(line, PAD, y);
    y += 42;
  }

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 28px system-ui, -apple-system, sans-serif";
  ctx.fillText("github.com/refly-ai/nexu", PAD, H - 120);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "24px system-ui, -apple-system, sans-serif";
  ctx.fillText("Star ⭐ & try it free", PAD, H - 76);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nexu-share.png";
    a.click();
    URL.revokeObjectURL(url);
  }, "image/png");
}

export function RewardConfirmLead({ channel }: { channel: RewardChannel }) {
  const isDaily = channel.repeatable === "daily";
  const logoSize = 22;

  const inner =
    channel.icon === "github" ? (
      <BrandLogo brand="github" size={logoSize} className="text-text-primary" />
    ) : channel.icon === "wechat" ? (
      <PlatformLogo platform="wechat" size={logoSize} />
    ) : channel.icon === "whatsapp" ? (
      <PlatformLogo platform="whatsapp" size={logoSize} />
    ) : channel.icon === "feishu" ? (
      <PlatformLogo platform="feishu" size={logoSize} />
    ) : (
      <ChannelIcon icon={channel.icon} size={logoSize} accent={isDaily ? "brand" : "default"} />
    );

  return (
    <EntityCardMedia
      className={cn(
        "mb-4",
        isDaily &&
          "border-[var(--color-brand-primary)]/28 bg-[var(--color-brand-subtle)] ring-1 ring-inset ring-[var(--color-brand-primary)]/12",
      )}
      aria-hidden
    >
      {inner}
    </EntityCardMedia>
  );
}

export function RewardConfirmModal({
  channel,
  onConfirm,
  onCancel,
  t,
}: {
  channel: RewardChannel;
  onConfirm: () => void;
  onCancel: () => void;
  t: (key: string) => string;
}) {
  const isDaily = channel.repeatable === "daily";
  const isImage = channel.shareMode === "image";
  const isSocialShare = !isDaily && !isImage && channel.id !== "github_star";
  const [imageDownloaded, setImageDownloaded] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [linkStatus, setLinkStatus] = useState<"idle" | "verifying" | "valid" | "invalid">("idle");

  const descKey = isDaily
    ? "budget.confirm.checkinDesc"
    : isImage
      ? "budget.confirm.imageDesc"
      : channel.requiresScreenshot
        ? "budget.confirm.screenshotDesc"
        : "budget.confirm.desc";
  const amt = formatRewardAmount(channel.reward);
  const creditsBadge =
    channel.reward === 1
      ? t("rewards.creditsPlusOne")
      : t("rewards.creditsPlusMany").replace("{n}", amt);

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <DialogContent
        size="sm"
        className={cn(
          "max-w-[min(100vw-2rem,380px)] gap-0 border-border-subtle bg-surface-0 p-6 shadow-[var(--shadow-dropdown)] sm:p-8",
          "[&>button.absolute]:hidden",
        )}
      >
        <div className="flex flex-col items-center text-center">
          <DialogHeader className="w-full items-center gap-0 space-y-0 text-center">
            <RewardConfirmLead channel={channel} />
            <DialogTitle className="text-base font-semibold leading-tight text-text-primary">
              {t("budget.confirm.title").replace("{channel}", t(`reward.${channel.id}.name`))}
            </DialogTitle>
            <DialogDescription className="pt-1.5 text-sm leading-relaxed text-text-secondary">
              {t(descKey).replaceAll("{n}", amt)}
            </DialogDescription>
          </DialogHeader>

          <Badge
            variant="outline"
            size="default"
            radius="full"
            className="mb-5 mt-4 border-[var(--color-brand-primary)]/25 bg-[var(--color-brand-subtle)] tabular-nums text-sm font-semibold text-[var(--color-brand-primary)]"
          >
            {creditsBadge}
          </Badge>

          {isImage && !imageDownloaded ? (
            <Button
              type="button"
              variant="brand"
              size="sm"
              className="mb-4 w-full"
              onClick={() => {
                downloadShareCard();
                setImageDownloaded(true);
              }}
            >
              <Download size={14} className="shrink-0" aria-hidden />
              {t("budget.confirm.downloadImage")}
            </Button>
          ) : null}
          {isImage && imageDownloaded ? (
            <div className="mb-4 flex w-full items-center justify-center gap-1.5 text-sm font-medium text-[var(--color-brand-primary)]">
              <Check size={14} className="shrink-0" aria-hidden />
              {t("budget.confirm.downloadImage")} ✓
            </div>
          ) : null}

          {isSocialShare && (
            <div className="mb-4 w-full">
              <label className="mb-1.5 block text-left text-[12px] font-medium text-text-secondary">
                Paste your share link to verify
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={shareLink}
                  onChange={(e) => {
                    setShareLink(e.target.value);
                    setLinkStatus("idle");
                  }}
                  placeholder="https://..."
                  className={cn(
                    "w-full rounded-lg border bg-surface-0 px-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 transition-colors",
                    linkStatus === "invalid"
                      ? "border-destructive focus:border-destructive/30 focus:ring-destructive/20"
                      : linkStatus === "valid"
                        ? "border-[var(--color-success)] focus:ring-[var(--color-success)]/20"
                        : "border-border focus:border-[var(--color-brand-primary)]/30 focus:ring-[var(--color-brand-primary)]/20",
                  )}
                />
                {linkStatus === "verifying" && (
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                    <LoaderCircle size={14} className="animate-spin text-text-muted" />
                  </div>
                )}
                {linkStatus === "valid" && (
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                    <Check size={14} className="text-[var(--color-success)]" />
                  </div>
                )}
              </div>
              {linkStatus === "invalid" && (
                <p className="mt-1 text-left text-[12px] text-destructive">
                  Invalid link. Please paste the URL of your shared post.
                </p>
              )}
              {linkStatus === "valid" && (
                <p className="mt-1 text-left text-[12px] text-[var(--color-success)]">
                  Link verified successfully!
                </p>
              )}
            </div>
          )}

          <DialogFooter className="mt-1 w-full flex-row gap-2 p-0 sm:flex-row sm:justify-stretch [&>button]:min-h-9 [&>button]:flex-1">
            <Button type="button" variant="outline" size="sm" onClick={onCancel}>
              {t("budget.confirm.cancel")}
            </Button>
            {isSocialShare ? (
              linkStatus === "valid" ? (
                <Button
                  type="button"
                  variant="brand"
                  size="sm"
                  className="bg-[var(--color-text-heading)] text-white hover:bg-[var(--color-text-heading)]/90"
                  onClick={onConfirm}
                >
                  {t("budget.confirm.done")}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="brand"
                  size="sm"
                  className="bg-[var(--color-text-heading)] text-white hover:bg-[var(--color-text-heading)]/90"
                  disabled={!shareLink.trim() || linkStatus === "verifying"}
                  loading={linkStatus === "verifying"}
                  onClick={() => {
                    setLinkStatus("verifying");
                    setTimeout(() => {
                      try {
                        const url = new URL(shareLink.trim());
                        const valid = /^https?:/.test(url.protocol);
                        setLinkStatus(valid ? "valid" : "invalid");
                      } catch {
                        setLinkStatus("invalid");
                      }
                    }, 1200);
                  }}
                >
                  Verify link
                </Button>
              )
            ) : (
              <Button
                type="button"
                variant="brand"
                size="sm"
                className="bg-[var(--color-text-heading)] text-white hover:bg-[var(--color-text-heading)]/90"
                onClick={onConfirm}
              >
                {t("budget.confirm.done")}
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
