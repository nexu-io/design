import { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Mail, Send, Check, Trash2, Moon, Sun, Monitor, Languages } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  FormFieldControl,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
  cn,
} from "@nexu-design/ui-web";

import { WindowChrome } from "@/components/layout/WindowChrome";
import { mockUsers } from "@/mock/data";
import { LOCALES, useLocaleStore, type Locale } from "@/stores/locale";
import { useThemeStore } from "@/stores/theme";
import { useWorkspaceStore } from "@/stores/workspace";

interface PendingInvite {
  email: string;
  status: "pending" | "sending" | "sent";
}

export function SettingsView(): React.ReactElement {
  const location = useLocation();
  const { theme, setTheme } = useThemeStore();
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const workspace = useWorkspaceStore((s) => s.workspace);
  const currentUserId = useWorkspaceStore((s) => s.currentUserId);
  const currentUser = mockUsers.find((u) => u.id === currentUserId) ?? mockUsers[0];

  const [inviteEmail, setInviteEmail] = useState("");
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [emailError, setEmailError] = useState("");
  const errorTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const activeTab = location.pathname.startsWith("/settings/appearance")
    ? "appearance"
    : location.pathname.startsWith("/settings/profile")
      ? "profile"
      : "workspace";

  const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const showError = (msg: string): void => {
    setEmailError(msg);
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    errorTimerRef.current = setTimeout(() => setEmailError(""), 3000);
  };

  const handleInvite = (): void => {
    const email = inviteEmail.trim();
    if (!email) return;
    if (!isValidEmail(email)) {
      showError("Please enter a valid email address");
      return;
    }
    if (pendingInvites.some((i) => i.email === email)) {
      showError("This email has already been invited");
      return;
    }

    setEmailError("");
    setPendingInvites((prev) => [...prev, { email, status: "sending" }]);
    setInviteEmail("");

    setTimeout(() => {
      setPendingInvites((prev) =>
        prev.map((i) => (i.email === email ? { ...i, status: "sent" } : i)),
      );
    }, 1200);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-[800px] px-4 pt-2 pb-6 sm:px-6 sm:pb-8">
        <WindowChrome className="h-10" />

        {activeTab === "workspace" && (
          <WorkspaceTab
            workspaceName={workspace?.name ?? ""}
            canDelete={currentUser.role === "owner"}
            inviteEmail={inviteEmail}
            setInviteEmail={setInviteEmail}
            emailError={emailError}
            setEmailError={setEmailError}
            pendingInvites={pendingInvites}
            handleInvite={handleInvite}
            onDeleteClick={() => setDeleteConfirmOpen(true)}
          />
        )}

        {activeTab === "appearance" && (
          <AppearanceTab theme={theme} setTheme={setTheme} locale={locale} setLocale={setLocale} />
        )}

        {activeTab === "profile" && (
          <ProfileTab
            name={currentUser.name}
            email={currentUser.email}
            avatar={currentUser.avatar}
            initials={currentUser.name.slice(0, 2).toUpperCase()}
          />
        )}
      </div>

      <DeleteWorkspaceDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        workspaceName={workspace?.name ?? "this workspace"}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * Workspace tab
 * ---------------------------------------------------------------- */

interface WorkspaceTabProps {
  workspaceName: string;
  canDelete: boolean;
  inviteEmail: string;
  setInviteEmail: (v: string) => void;
  emailError: string;
  setEmailError: (v: string) => void;
  pendingInvites: PendingInvite[];
  handleInvite: () => void;
  onDeleteClick: () => void;
}

function WorkspaceTab({
  workspaceName,
  canDelete,
  inviteEmail,
  setInviteEmail,
  emailError,
  setEmailError,
  pendingInvites,
  handleInvite,
  onDeleteClick,
}: WorkspaceTabProps): React.ReactElement {
  return (
    <section className="space-y-6">
      <FormField label="Workspace Name">
        <FormFieldControl>
          <Input defaultValue={workspaceName} placeholder="Workspace Name" />
        </FormFieldControl>
      </FormField>

      <FormField
        label="Invite Members"
        invalid={!!emailError}
        error={emailError || undefined}
        description={!emailError && inviteEmail.trim() ? "Press Enter to invite" : undefined}
      >
        <FormFieldControl>
          <div className="flex items-center gap-2">
            <Input
              type="email"
              value={inviteEmail}
              onChange={(e) => {
                setInviteEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleInvite()}
              placeholder="colleague@company.com"
              leadingIcon={<Mail className="size-4" />}
              invalid={!!emailError}
              inputClassName="flex-1"
            />
            <Button
              variant="primary"
              onClick={handleInvite}
              disabled={!inviteEmail.trim()}
              leadingIcon={<Send className="size-3.5" />}
            >
              Invite
            </Button>
          </div>
        </FormFieldControl>
      </FormField>

      {pendingInvites.length > 0 && (
        <ul className="space-y-2">
          {pendingInvites.map((invite) => (
            <li
              key={invite.email}
              className="flex items-center gap-3 rounded-lg border border-dashed border-border p-3"
            >
              <div className="flex size-8 items-center justify-center rounded-full bg-surface-2">
                <Mail className="size-3.5 text-text-muted" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px]">{invite.email}</div>
                <div className="text-[11px] text-text-muted">
                  {invite.status === "sending" && "Sending invite..."}
                  {invite.status === "sent" && "Invitation sent"}
                  {invite.status === "pending" && "Pending"}
                </div>
              </div>
              {invite.status === "sending" && <Spinner className="size-4 text-text-muted" />}
              {invite.status === "sent" && (
                <Check className="size-4 text-[var(--color-success)]" strokeWidth={3} />
              )}
            </li>
          ))}
        </ul>
      )}

      {canDelete && (
        <div className="mt-2 rounded-xl border border-destructive/30 p-4">
          <h3 className="text-[13px] font-semibold text-destructive">Danger Zone</h3>
          <p className="mt-1 text-[12px] text-text-muted">
            Permanently delete this workspace and all its data. This cannot be undone.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
            leadingIcon={<Trash2 className="size-3.5" />}
            onClick={onDeleteClick}
          >
            Delete Workspace
          </Button>
        </div>
      )}
    </section>
  );
}

/* ---------------------------------------------------------------- *
 * Appearance tab — uses the AGENTS.md settings-row pattern.
 * ---------------------------------------------------------------- */

interface AppearanceTabProps {
  theme: "light" | "dark" | "system";
  setTheme: (t: "light" | "dark" | "system") => void;
  locale: Locale;
  setLocale: (l: Locale) => void;
}

function AppearanceTab({ theme, setTheme, locale, setLocale }: AppearanceTabProps) {
  return (
    <div className="divide-y divide-border rounded-lg border border-border">
      <SettingsRow
        title="Theme"
        control={
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "light" as const, label: "Light", Icon: Sun },
              { id: "dark" as const, label: "Dark", Icon: Moon },
              { id: "system" as const, label: "System", Icon: Monitor },
            ].map(({ id, label, Icon }) => (
              <Button
                key={id}
                type="button"
                variant={theme === id ? "primary" : "outline"}
                size="sm"
                leadingIcon={<Icon className="size-3.5" />}
                onClick={() => setTheme(id)}
              >
                {label}
              </Button>
            ))}
          </div>
        }
      />

      <SettingsRow
        title="Language"
        description="Choose the display language for the app."
        control={
          <Select value={locale} onValueChange={(v) => setLocale(v as Locale)}>
            <SelectTrigger className="min-w-[180px]">
              <span className="inline-flex items-center gap-2">
                <Languages className="size-4 text-text-muted" />
                <SelectValue />
              </span>
            </SelectTrigger>
            <SelectContent>
              {LOCALES.map((l) => (
                <SelectItem key={l.code} value={l.code}>
                  <span className="flex items-center justify-between gap-3">
                    <span>{l.nativeLabel}</span>
                    <span className="text-[11px] text-text-muted">{l.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * Profile tab
 * ---------------------------------------------------------------- */

interface ProfileTabProps {
  name: string;
  email: string;
  avatar: string;
  initials: string;
}

function ProfileTab({ name, email, avatar, initials }: ProfileTabProps): React.ReactElement {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="size-16">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <Button variant="outline" size="sm">
          Change Avatar
        </Button>
      </div>

      <FormField label="Name">
        <FormFieldControl>
          <Input defaultValue={name} />
        </FormFieldControl>
      </FormField>

      <FormField label="Email">
        <FormFieldControl>
          <Input type="email" defaultValue={email} disabled />
        </FormFieldControl>
      </FormField>
    </section>
  );
}

/* ---------------------------------------------------------------- *
 * Shared
 * ---------------------------------------------------------------- */

function SettingsRow({
  title,
  description,
  control,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  control: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3.5">
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-medium text-text-heading">{title}</div>
        {description ? (
          <div className="mt-0.5 text-[12px] text-text-muted">{description}</div>
        ) : null}
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}

function DeleteWorkspaceDialog({
  open,
  onOpenChange,
  workspaceName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceName: string;
}): React.ReactElement {
  const [confirmText, setConfirmText] = useState("");
  const isMatch = confirmText === workspaceName;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setConfirmText("");
        onOpenChange(next);
      }}
    >
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle className="text-destructive">Delete Workspace</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-2">
              <p>
                This will permanently delete{" "}
                <span className="font-medium text-text-heading">{workspaceName}</span> and all its
                data including channels, messages, and agent configurations.
              </p>
              <p>
                Type{" "}
                <span
                  className={cn(
                    "rounded-sm bg-surface-2 px-1 py-0.5",
                    "font-mono text-[12px] text-text-heading",
                  )}
                >
                  {workspaceName}
                </span>{" "}
                to confirm.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={workspaceName}
            autoFocus
          />
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            disabled={!isMatch}
            leadingIcon={<Trash2 className="size-3.5" />}
            onClick={() => onOpenChange(false)}
          >
            Delete forever
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
