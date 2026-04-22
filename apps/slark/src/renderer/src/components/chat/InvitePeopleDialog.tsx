import { useState, useEffect, useRef } from "react";
import { Mail, Send, Check, Eye, Link2 } from "lucide-react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  FormFieldControl,
  Input,
  Spinner,
} from "@nexu-design/ui-web";
import { useT } from "@/i18n";
import { InviteEmailPreview } from "@/components/invite/InviteEmailPreview";

interface InvitePeopleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PendingInvite {
  email: string;
  status: "sending" | "sent";
  token: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function InvitePeopleDialog({
  open,
  onOpenChange,
}: InvitePeopleDialogProps): React.ReactElement {
  const t = useT();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [invites, setInvites] = useState<PendingInvite[]>([]);
  const [previewEmail, setPreviewEmail] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [inviteToken, setInviteToken] = useState(
    () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36),
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const inviteLinkUrl = `${window.location.origin}/invite/${inviteToken}`;

  const handleCopyLink = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(inviteLinkUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  useEffect(() => {
    if (open && !previewEmail) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open, previewEmail]);

  useEffect(() => {
    if (open) {
      setInviteToken(Math.random().toString(36).slice(2, 10) + Date.now().toString(36));
    }
  }, [open]);

  const generateToken = (): string =>
    Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

  const handleInvite = (): void => {
    const trimmed = email.trim();
    if (!trimmed) {
      setError(t("invitePeople.enterEmail"));
      return;
    }
    if (!EMAIL_RE.test(trimmed)) {
      setError(t("workspace.invalidEmail"));
      return;
    }
    if (invites.some((i) => i.email === trimmed)) {
      setError(t("workspace.alreadyInvited"));
      return;
    }

    setError("");
    const token = generateToken();
    setInvites((prev) => [...prev, { email: trimmed, status: "sending", token }]);
    setEmail("");

    setTimeout(() => {
      setInvites((prev) => prev.map((i) => (i.email === trimmed ? { ...i, status: "sent" } : i)));
    }, 1200);
  };

  const handleClose = (): void => {
    onOpenChange(false);
    setEmail("");
    setError("");
    setInvites([]);
    setPreviewEmail(null);
  };

  const previewInvite = invites.find((i) => i.email === previewEmail);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleClose();
          return;
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent size="md" className={previewEmail ? "max-w-[860px]" : "max-w-[460px]"}>
        <DialogHeader>
          <DialogTitle>
            {previewEmail ? t("invitePeople.emailPreview") : t("invitePeople.title")}
          </DialogTitle>
          {!previewEmail ? <DialogDescription>{t("invitePeople.intro")}</DialogDescription> : null}
        </DialogHeader>

        {previewEmail && previewInvite ? (
          <DialogBody className="space-y-3">
            <div className="text-xs text-muted-foreground space-y-1 px-1">
              <div>
                <span className="font-medium text-foreground">{t("invitePeople.to")}</span>{" "}
                {previewInvite.email}
              </div>
              <div>
                <span className="font-medium text-foreground">{t("invitePeople.from")}</span>{" "}
                nexu@notifications.nexu.app
              </div>
              <div>
                <span className="font-medium text-foreground">{t("invitePeople.subject")}</span>{" "}
                Alice Chen invited you to Acme Engineering on Nexu
              </div>
            </div>
            <div className="rounded-lg overflow-hidden border border-border">
              <InviteEmailPreview
                inviterName="Alice Chen"
                workspaceName="Acme Engineering"
                inviteLink={`${window.location.origin}/invite/${previewInvite.token}`}
              />
            </div>
          </DialogBody>
        ) : (
          <DialogBody className="space-y-4">
            <FormField invalid={Boolean(error)} error={error}>
              <div className="flex items-center gap-2">
                <FormFieldControl className="flex-1">
                  <Input
                    ref={inputRef}
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleInvite();
                      if (e.key === "Escape") handleClose();
                    }}
                    placeholder={t("workspace.invitePlaceholder")}
                    leadingIcon={<Mail className="h-3.5 w-3.5 text-muted-foreground" />}
                    invalid={Boolean(error)}
                  />
                </FormFieldControl>
                <Button
                  onClick={handleInvite}
                  className="h-9 shrink-0"
                  size="sm"
                  leadingIcon={<Send className="h-3.5 w-3.5" />}
                >
                  {t("common.send")}
                </Button>
              </div>
            </FormField>

            <div className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-secondary/40 px-3 py-2.5">
              <Link2 className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground mb-0.5">
                  {t("onboarding.shareInviteLink")}
                </div>
                <div className="text-xs font-mono text-foreground truncate">{inviteLinkUrl}</div>
              </div>
              <Button onClick={handleCopyLink} variant="outline" size="xs" className="h-7 shrink-0">
                {linkCopied ? t("common.copied") : t("common.copy")}
              </Button>
            </div>

            {invites.length > 0 && (
              <div className="-mx-1 max-h-[240px] space-y-2 overflow-y-auto px-1">
                {invites.map((inv) => (
                  <div
                    key={inv.email}
                    className="flex items-center gap-3 rounded-xl bg-surface-2 p-3"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-0">
                      <Send className="size-3.5 text-text-muted" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] text-text-primary">{inv.email}</div>
                      <div className="text-[11px] text-text-muted">
                        {inv.status === "sending"
                          ? t("invitePeople.sending")
                          : t("invitePeople.sent")}
                      </div>
                    </div>
                    {inv.status === "sending" ? (
                      <Spinner className="size-4 shrink-0 text-text-muted" />
                    ) : (
                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setPreviewEmail(inv.email)}
                          title={t("invitePeople.previewEmail")}
                        >
                          <Eye className="size-3.5 text-text-muted" />
                        </Button>
                        <Check className="size-4 text-[var(--color-success)]" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </DialogBody>
        )}

        {previewEmail && previewInvite ? (
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewEmail(null)}>
              {t("common.back")}
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
