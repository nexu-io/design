import { InviteEmailPreview } from "@/components/invite/InviteEmailPreview";
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  Input,
} from "@nexu-design/ui-web";
import { Check, Eye, Mail, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [invites, setInvites] = useState<PendingInvite[]>([]);
  const [previewEmail, setPreviewEmail] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const generateToken = (): string =>
    Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

  const handleInvite = (): void => {
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter an email address");
      return;
    }
    if (!EMAIL_RE.test(trimmed)) {
      setError("Please enter a valid email address");
      return;
    }
    if (invites.some((invite) => invite.email === trimmed)) {
      setError("This email has already been invited");
      return;
    }

    setError("");
    const token = generateToken();
    setInvites((previous) => [...previous, { email: trimmed, status: "sending", token }]);
    setEmail("");

    setTimeout(() => {
      setInvites((previous) =>
        previous.map((invite) =>
          invite.email === trimmed ? { ...invite, status: "sent" } : invite,
        ),
      );
    }, 1200);
  };

  const handleClose = (nextOpen: boolean): void => {
    onOpenChange(nextOpen);
    if (nextOpen) return;
    setEmail("");
    setError("");
    setInvites([]);
    setPreviewEmail(null);
  };

  const previewInvite = invites.find((invite) => invite.email === previewEmail);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent size={previewEmail ? "xl" : "md"} className="p-0">
        <DialogHeader className="px-5 pt-5 pb-1">
          <DialogTitle className="text-base font-semibold">
            {previewEmail ? "Email preview" : "Invite people"}
          </DialogTitle>
          <DialogDescription className="text-sm text-text-secondary">
            {previewEmail
              ? "Review the workspace invite before sending it to more teammates."
              : "Invite teammates by email. They’ll get a link to join this workspace."}
          </DialogDescription>
        </DialogHeader>

        {previewEmail && previewInvite ? (
          <DialogBody className="px-5 py-4 space-y-4">
            <Card variant="static" padding="sm" className="rounded-xl border-border bg-surface-1">
              <div className="space-y-1 text-xs text-text-secondary">
                <div>
                  <span className="font-medium text-text-primary">To:</span> {previewInvite.email}
                </div>
                <div>
                  <span className="font-medium text-text-primary">From:</span>{" "}
                  slark@notifications.slark.app
                </div>
                <div>
                  <span className="font-medium text-text-primary">Subject:</span> Alice Chen invited
                  you to Acme Engineering on Slark
                </div>
              </div>
            </Card>

            <div className="overflow-hidden rounded-xl border border-border">
              <InviteEmailPreview
                inviterName="Alice Chen"
                workspaceName="Acme Engineering"
                inviteLink={`${window.location.origin}/invite/${previewInvite.token}`}
              />
            </div>
          </DialogBody>
        ) : (
          <>
            <DialogBody className="px-5 py-4 space-y-4">
              <FormField label="Email address" error={error} invalid={!!error}>
                <div className="flex items-start gap-2">
                  <Input
                    ref={inputRef}
                    type="email"
                    value={email}
                    invalid={!!error}
                    leadingIcon={<Mail className="size-4" />}
                    placeholder="colleague@company.com"
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError("");
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") handleInvite();
                    }}
                  />
                  <Button onClick={handleInvite} disabled={!email.trim()}>
                    <Send className="size-4" />
                    Send
                  </Button>
                </div>
              </FormField>

              {error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}

              {invites.length > 0 ? (
                <div className="space-y-2">
                  {invites.map((invite) => (
                    <Card
                      key={invite.email}
                      variant="static"
                      padding="sm"
                      className="rounded-xl border border-border bg-surface-1"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-subtle text-brand-primary">
                          <Mail className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium text-text-primary">
                            {invite.email}
                          </div>
                          <div className="text-xs text-text-secondary">
                            {invite.status === "sending" ? "Sending…" : "Invitation sent"}
                          </div>
                        </div>
                        {invite.status === "sending" ? (
                          <div className="h-4 w-4 rounded-full border-2 border-text-muted border-t-transparent animate-spin shrink-0" />
                        ) : (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => setPreviewEmail(invite.email)}
                              title="Preview email"
                              className="text-text-secondary hover:text-text-primary"
                            >
                              <Eye className="size-4" />
                            </Button>
                            <Check className="size-4 shrink-0 text-success" strokeWidth={3} />
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : null}
            </DialogBody>

            <DialogFooter className="px-5 pb-5">
              <Button variant="outline" size="sm" onClick={() => handleClose(false)}>
                Done
              </Button>
            </DialogFooter>
          </>
        )}

        {previewEmail && previewInvite ? (
          <DialogFooter className="px-5 pb-5">
            <Button variant="outline" size="sm" onClick={() => setPreviewEmail(null)}>
              Back
            </Button>
            <Button size="sm" onClick={() => handleClose(false)}>
              Close
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
