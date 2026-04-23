import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Check,
  Copy,
  Link as LinkIcon,
  Mail,
  Monitor,
  Moon,
  RefreshCw,
  Send,
  Sun,
  Trash2,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ConfirmDialog,
  FormField,
  FormFieldControl,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
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
  const currentUser = mockUsers.filter((user) => user.id === currentUserId)[0] ?? mockUsers[0];

  const [inviteEmail, setInviteEmail] = useState("");
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [emailError, setEmailError] = useState("");
  const errorTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const [inviteToken, setInviteToken] = useState(() => Math.random().toString(36).slice(2, 12));
  const [linkCopied, setLinkCopied] = useState(false);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const inviteLink = `https://nexu.app/join/${inviteToken}`;

  const handleCopyLink = (): void => {
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => {
        setLinkCopied(true);
        if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
        copiedTimerRef.current = setTimeout(() => setLinkCopied(false), 1800);
      })
      .catch(() => undefined);
  };

  const handleRegenerateLink = (): void => {
    setInviteToken(Math.random().toString(36).slice(2, 12));
    setLinkCopied(false);
  };

  useEffect(() => {
    return () => {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
      if (copiedTimerRef.current) {
        clearTimeout(copiedTimerRef.current);
      }
    };
  }, []);

  const activeTab =
    location.pathname.slice(0, 20) === "/settings/appearance"
      ? "appearance"
      : location.pathname.slice(0, 17) === "/settings/profile"
        ? "profile"
        : "workspace";

  const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const showError = (msg: string): void => {
    setEmailError(msg);
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }
    errorTimerRef.current = setTimeout(() => setEmailError(""), 3000);
  };

  const handleInvite = (): void => {
    const email = inviteEmail.trim();
    if (!email) return;
    if (!isValidEmail(email)) {
      showError("Please enter a valid email address");
      return;
    }
    if (pendingInvites.some((invite) => invite.email === email)) {
      showError("This email has already been invited");
      return;
    }

    setEmailError("");
    setPendingInvites((prev) => [...prev, { email, status: "sending" }]);
    setInviteEmail("");

    setTimeout(() => {
      setPendingInvites((prev) =>
        prev.map((invite) => (invite.email === email ? { ...invite, status: "sent" } : invite)),
      );
    }, 1200);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-[800px] px-4 pt-2 pb-6 sm:px-6 sm:pb-8">
        {/* The duplicate "Workspace settings" / "Appearance" / "Profile"
            PageHeader was dropped — the left sidebar already labels the
            active page (Workspace / Appearance / Profile) and each card
            below is self-describing. Keeping `WindowChrome` for the
            traffic-light drag region, plus an `mt-4` spacer so the first
            card breathes below the chrome instead of sticking to it. */}
        <WindowChrome className="h-10" />

        <div className="mt-4 space-y-4">
          {activeTab === "workspace" ? (
            <WorkspaceTab
              workspaceName={workspace?.name ?? ""}
              canDelete={currentUser.role === "owner"}
              inviteEmail={inviteEmail}
              setInviteEmail={setInviteEmail}
              emailError={emailError}
              setEmailError={setEmailError}
              pendingInvites={pendingInvites}
              handleInvite={handleInvite}
              inviteLink={inviteLink}
              linkCopied={linkCopied}
              handleCopyLink={handleCopyLink}
              handleRegenerateLink={handleRegenerateLink}
            />
          ) : null}

          {activeTab === "appearance" ? (
            <AppearanceTab
              theme={theme}
              setTheme={setTheme}
              locale={locale}
              setLocale={setLocale}
            />
          ) : null}

          {activeTab === "profile" ? (
            <ProfileTab
              name={currentUser.name}
              email={currentUser.email}
              avatar={currentUser.avatar}
              initials={currentUser.name.slice(0, 2).toUpperCase()}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

interface WorkspaceTabProps {
  workspaceName: string;
  canDelete: boolean;
  inviteEmail: string;
  setInviteEmail: (value: string) => void;
  emailError: string;
  setEmailError: (value: string) => void;
  pendingInvites: PendingInvite[];
  handleInvite: () => void;
  inviteLink: string;
  linkCopied: boolean;
  handleCopyLink: () => void;
  handleRegenerateLink: () => void;
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
  inviteLink,
  linkCopied,
  handleCopyLink,
  handleRegenerateLink,
}: WorkspaceTabProps): React.ReactElement {
  return (
    <section className="space-y-4">
      <Card variant="static" padding="md" className="border-border">
        {/* The card-level "Workspace details" header + description was
            dropped — the PageHeader already reads "Workspace settings"
            and the form fields below are self-describing. Repeating a
            second heading inside the very next card just pushed the
            actual inputs down with no added information.
            `mt-0` overrides CardContent's default `mt-4`, which only
            makes sense when it follows a CardHeader. */}
        <CardContent className="mt-0 space-y-5">
          <FormField label="Workspace name">
            <FormFieldControl>
              <Input defaultValue={workspaceName} placeholder="Workspace name" />
            </FormFieldControl>
          </FormField>

          <FormField
            label="Invite members"
            invalid={!!emailError}
            error={emailError || undefined}
            description={!emailError && inviteEmail.trim() ? "Press Enter to invite" : undefined}
          >
            <FormFieldControl>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value);
                    if (emailError) {
                      setEmailError("");
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleInvite();
                    }
                  }}
                  placeholder="colleague@company.com"
                  leadingIcon={<Mail className="size-4" />}
                  invalid={!!emailError}
                  className="flex-1"
                />
                <Button
                  variant="default"
                  onClick={handleInvite}
                  disabled={!inviteEmail.trim()}
                  leadingIcon={<Send className="size-3.5" />}
                >
                  Invite
                </Button>
              </div>
            </FormFieldControl>
          </FormField>

          <FormField
            label="Invite link"
            description="Anyone with this link can join the workspace."
          >
            <FormFieldControl>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  readOnly
                  value={inviteLink}
                  leadingIcon={<LinkIcon className="size-4" />}
                  className="flex-1 font-mono text-[12px]"
                  onFocus={(e) => e.currentTarget.select()}
                />
                <div className="flex items-center gap-2">
                  <Button
                    variant="default"
                    onClick={handleCopyLink}
                    leadingIcon={
                      linkCopied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />
                    }
                  >
                    {linkCopied ? "Copied" : "Copy link"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleRegenerateLink}
                    title="Generate a new link (old one stops working)"
                    leadingIcon={<RefreshCw className="size-3.5" />}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </FormFieldControl>
          </FormField>

          {pendingInvites.length > 0 ? (
            <div className="space-y-2">
              {pendingInvites.map((invite) => (
                <div
                  key={invite.email}
                  className="flex items-center gap-3 rounded-xl border border-dashed border-border p-3"
                >
                  <div className="flex size-8 items-center justify-center rounded-full bg-surface-2">
                    <Mail className="size-3.5 text-text-muted" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] text-text-primary">{invite.email}</div>
                    <div className="text-[11px] text-text-muted">
                      {invite.status === "sending" ? "Sending invite..." : null}
                      {invite.status === "sent" ? "Invitation sent" : null}
                      {invite.status === "pending" ? "Pending" : null}
                    </div>
                  </div>
                  {invite.status === "sending" ? (
                    <Spinner className="size-4 text-text-muted" />
                  ) : null}
                  {invite.status === "sent" ? (
                    <Check className="size-4 text-[var(--color-success)]" strokeWidth={3} />
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>

      {canDelete ? (
        <Card variant="static" padding="md" className="border-destructive/20">
          <CardHeader>
            <CardTitle className="text-[16px] text-destructive">Danger zone</CardTitle>
            <CardDescription>
              Permanently delete this workspace and all of its channels, messages, and agent data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ConfirmDialog
              title="Delete workspace"
              description={`This will permanently delete ${workspaceName || "this workspace"}. This action cannot be undone.`}
              confirmLabel="Delete workspace"
              cancelLabel="Cancel"
              confirmVariant="destructive"
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="text-text-primary hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
                  leadingIcon={<Trash2 className="size-3.5" />}
                >
                  Delete workspace
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
}

interface AppearanceTabProps {
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

function AppearanceTab({
  theme,
  setTheme,
  locale,
  setLocale,
}: AppearanceTabProps): React.ReactElement {
  return (
    <section className="space-y-4">
      <Card variant="static" padding="md" className="border-border">
        <CardHeader>
          <CardTitle className="text-[16px] text-text-heading">Theme</CardTitle>
          <CardDescription>Choose the color mode that best fits your workspace.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-3">
          {[
            { id: "light" as const, label: "Light", Icon: Sun },
            { id: "dark" as const, label: "Dark", Icon: Moon },
            { id: "system" as const, label: "System", Icon: Monitor },
          ].map(({ id, label, Icon }) => (
            <Button
              key={id}
              type="button"
              variant={theme === id ? "default" : "outline"}
              size="sm"
              leadingIcon={<Icon className="size-3.5" />}
              onClick={() => setTheme(id)}
            >
              {label}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card variant="static" padding="md" className="border-border">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-[16px] font-semibold tracking-tight text-text-heading">Language</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose the display language for the app.
            </p>
          </div>
          {/* Shrink-0 slot with a fixed-width trigger so the Select doesn't
              stretch under `w-full` defaults and squeeze the description. */}
          <div className="shrink-0">
            <Select value={locale} onValueChange={(value) => setLocale(value as Locale)}>
              <SelectTrigger className="w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOCALES.map((localeOption) => (
                  <SelectItem key={localeOption.code} value={localeOption.code}>
                    <span className="flex items-center justify-between gap-3">
                      <span>{localeOption.nativeLabel}</span>
                      <span className="text-[11px] text-text-muted">{localeOption.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
    </section>
  );
}

interface ProfileTabProps {
  name: string;
  email: string;
  avatar: string;
  initials: string;
}

function ProfileTab({ name, email, avatar, initials }: ProfileTabProps): React.ReactElement {
  return (
    <Card variant="static" padding="md" className="border-border">
      {/* Header dropped — the PageHeader already reads "Profile" and the
          fields below are self-describing. `mt-0` cancels CardContent's
          default `mt-4`, which only matters when a CardHeader precedes it. */}
      <CardContent className="mt-0 space-y-5">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <Button variant="outline" size="sm" className="text-text-primary">
            Change avatar
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
      </CardContent>
    </Card>
  );
}
