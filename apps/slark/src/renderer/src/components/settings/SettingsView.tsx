import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  Input,
  PageHeader,
  cn,
} from "@nexu-design/ui-web";
import {
  Check,
  ExternalLink,
  Github,
  Mail,
  Monitor,
  Moon,
  Plus,
  Send,
  Shield,
  Sun,
  Trash2,
  X,
} from "lucide-react";
import { type ReactElement, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { TitleBarSpacer } from "@/components/layout/WindowChrome";
import { mockUsers } from "@/mock/data";
import { useThemeStore } from "@/stores/theme";
import { useWorkspaceStore } from "@/stores/workspace";

interface PendingInvite {
  email: string;
  status: "pending" | "sending" | "sent";
}

const settingsMeta = {
  workspace: {
    title: "Workspace",
    description: "Manage workspace details, invitations, and member access.",
  },
  repositories: {
    title: "Repositories",
    description: "Connect source repositories so agents know where to work.",
  },
  appearance: {
    title: "Appearance",
    description: "Choose how Slark looks across light, dark, and system themes.",
  },
  profile: {
    title: "Profile",
    description: "Review your personal details and avatar settings.",
  },
} as const;

export function SettingsView(): ReactElement {
  const location = useLocation();
  const { theme, setTheme } = useThemeStore();
  const workspace = useWorkspaceStore((s) => s.workspace);
  const currentUserId = useWorkspaceStore((s) => s.currentUserId);
  const currentUser = mockUsers.find((u) => u.id === currentUserId) ?? mockUsers[0];
  const [inviteEmail, setInviteEmail] = useState("");
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [emailError, setEmailError] = useState("");
  const errorTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const repositories = useWorkspaceStore((s) => s.repositories);
  const addRepository = useWorkspaceStore((s) => s.addRepository);
  const removeRepository = useWorkspaceStore((s) => s.removeRepository);
  const updateRepository = useWorkspaceStore((s) => s.updateRepository);
  const [repoInput, setRepoInput] = useState("");
  const [repoDescInput, setRepoDescInput] = useState("");
  const [repoError, setRepoError] = useState("");

  const activeTab = location.pathname.startsWith("/settings/repositories")
    ? "repositories"
    : location.pathname.startsWith("/settings/appearance")
      ? "appearance"
      : location.pathname.startsWith("/settings/profile")
        ? "profile"
        : "workspace";

  const activeMeta = settingsMeta[activeTab];

  useEffect(() => {
    return () => {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
    };
  }, []);

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
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 pt-2 pb-6 sm:pb-8">
        <TitleBarSpacer />

        <PageHeader
          density="shell"
          title={activeMeta.title}
          description={activeMeta.description}
          actions={
            <SettingsHeaderBadge
              activeTab={activeTab}
              memberCount={mockUsers.length}
              repositoryCount={repositories.length}
              currentUserRole={currentUser.role}
              theme={theme}
            />
          }
        />

        {activeTab === "workspace" && (
          <WorkspaceTab
            workspaceName={workspace?.name ?? ""}
            inviteEmail={inviteEmail}
            emailError={emailError}
            pendingInvites={pendingInvites}
            currentUser={currentUser}
            onInviteEmailChange={(value) => {
              setInviteEmail(value);
              if (emailError) setEmailError("");
            }}
            onInvite={handleInvite}
            onDeleteWorkspace={() => setDeleteConfirmOpen(true)}
          />
        )}

        {activeTab === "appearance" && (
          <AppearanceTab currentTheme={theme} onThemeChange={setTheme} />
        )}

        {activeTab === "repositories" && (
          <RepositoriesTab
            repositories={repositories}
            repoInput={repoInput}
            repoDescInput={repoDescInput}
            repoError={repoError}
            onInputChange={setRepoInput}
            onDescChange={setRepoDescInput}
            onErrorChange={setRepoError}
            onAdd={addRepository}
            onRemove={removeRepository}
            onUpdate={updateRepository}
          />
        )}

        {activeTab === "profile" && <ProfileTab currentUser={currentUser} />}
      </div>

      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        workspaceName={workspace?.name ?? "this workspace"}
        onOpenChange={setDeleteConfirmOpen}
      />
    </div>
  );
}

function SettingsHeaderBadge({
  activeTab,
  memberCount,
  repositoryCount,
  currentUserRole,
  theme,
}: {
  activeTab: keyof typeof settingsMeta;
  memberCount: number;
  repositoryCount: number;
  currentUserRole: string;
  theme: "light" | "dark" | "system";
}): ReactElement {
  if (activeTab === "workspace") {
    return (
      <Badge variant="outline" size="sm">
        {memberCount} members
      </Badge>
    );
  }

  if (activeTab === "repositories") {
    return (
      <Badge variant="outline" size="sm">
        {repositoryCount} connected
      </Badge>
    );
  }

  if (activeTab === "appearance") {
    return (
      <Badge variant="outline" size="sm" className="capitalize">
        {theme} theme
      </Badge>
    );
  }

  return (
    <Badge
      variant={currentUserRole === "owner" ? "accent" : "secondary"}
      size="sm"
      className="capitalize"
    >
      {currentUserRole}
    </Badge>
  );
}

function WorkspaceTab({
  workspaceName,
  inviteEmail,
  emailError,
  pendingInvites,
  currentUser,
  onInviteEmailChange,
  onInvite,
  onDeleteWorkspace,
}: {
  workspaceName: string;
  inviteEmail: string;
  emailError: string;
  pendingInvites: PendingInvite[];
  currentUser: (typeof mockUsers)[number];
  onInviteEmailChange: (value: string) => void;
  onInvite: () => void;
  onDeleteWorkspace: () => void;
}): ReactElement {
  return (
    <div className="space-y-6">
      <Card variant="outline" padding="lg">
        <CardHeader>
          <CardTitle className="text-base">Workspace details</CardTitle>
          <CardDescription>
            Update the name used across channels, invites, and workspace navigation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField label="Workspace name" description="Visible to everyone in this workspace.">
            <Input defaultValue={workspaceName} placeholder="My workspace" />
          </FormField>
        </CardContent>
      </Card>

      <Card variant="outline" padding="lg">
        <CardHeader>
          <CardTitle className="text-base">Invite members</CardTitle>
          <CardDescription>
            Send invites to teammates so they can join channels and collaborate with agents.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            label="Email address"
            description={
              emailError
                ? undefined
                : inviteEmail.trim()
                  ? "Press Enter to invite"
                  : "Enter a teammate email to send an invite."
            }
            invalid={!!emailError}
            error={emailError || undefined}
          >
            <Input
              type="email"
              value={inviteEmail}
              invalid={!!emailError}
              leadingIcon={<Mail size={16} />}
              onChange={(event) => onInviteEmailChange(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && onInvite()}
              placeholder="colleague@company.com"
            />
          </FormField>
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={onInvite}
              disabled={!inviteEmail.trim()}
              leadingIcon={<Send size={14} />}
            >
              Invite
            </Button>
          </div>

          {pendingInvites.length > 0 ? (
            <div className="space-y-2">
              {pendingInvites.map((invite) => (
                <PendingInviteRow key={invite.email} invite={invite} />
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card variant="outline" padding="lg">
        <CardHeader>
          <CardTitle className="text-base">Members</CardTitle>
          <CardDescription>
            Review who has access to the workspace and which role each person holds.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {mockUsers.map((user) => (
            <MemberRow key={user.id} user={user} isCurrentUser={user.id === currentUser.id} />
          ))}
          <p className="text-xs text-muted-foreground">
            Invited members join as <span className="font-medium text-foreground">Member</span>.
            Only the <span className="font-medium text-foreground">Owner</span> can delete the
            workspace.
          </p>
        </CardContent>
      </Card>

      {currentUser.role === "owner" ? (
        <Card variant="static" padding="lg" className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-base text-destructive">Danger zone</CardTitle>
            <CardDescription>
              Permanently delete this workspace and all associated channels, messages, and agent
              configuration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={onDeleteWorkspace}
                leadingIcon={<Trash2 size={14} />}
                className="text-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5"
              >
                Delete workspace
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function PendingInviteRow({ invite }: { invite: PendingInvite }): ReactElement {
  const badgeVariant =
    invite.status === "sent" ? "success" : invite.status === "sending" ? "outline" : "secondary";

  return (
    <div className="flex items-center gap-3 rounded-lg border border-dashed border-border p-3">
      <div className="flex size-9 items-center justify-center rounded-full bg-surface-2 text-muted-foreground">
        <Mail size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-foreground">{invite.email}</p>
        <p className="text-xs text-muted-foreground">
          {invite.status === "sending" && "Sending invite..."}
          {invite.status === "sent" && "Invitation sent"}
          {invite.status === "pending" && "Pending"}
        </p>
      </div>
      {invite.status === "sending" ? (
        <div className="size-4 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin" />
      ) : null}
      {invite.status === "sent" ? (
        <Check size={16} className="text-[var(--color-success)]" />
      ) : null}
      <Badge variant={badgeVariant} size="xs" className="capitalize">
        {invite.status}
      </Badge>
    </div>
  );
}

function MemberRow({
  user,
  isCurrentUser,
}: {
  user: (typeof mockUsers)[number];
  isCurrentUser: boolean;
}): ReactElement {
  const isOwner = user.role === "owner";

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
      <img src={user.avatar} alt="" className="size-10 rounded-full" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-[13px] font-medium text-foreground">{user.name}</span>
          {isCurrentUser ? (
            <Badge variant="outline" size="xs">
              YOU
            </Badge>
          ) : null}
        </div>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
      </div>
      <Badge
        variant={isOwner ? "accent" : "secondary"}
        size="sm"
        radius="md"
        className="capitalize"
      >
        {isOwner ? <Shield size={12} /> : null}
        {user.role}
      </Badge>
    </div>
  );
}

function AppearanceTab({
  currentTheme,
  onThemeChange,
}: {
  currentTheme: "light" | "dark" | "system";
  onThemeChange: (theme: "light" | "dark" | "system") => void;
}): ReactElement {
  const options = [
    {
      id: "light" as const,
      label: "Light",
      description: "Bright surfaces for daytime work.",
      icon: Sun,
      previewClassName: "bg-zinc-100 text-zinc-900",
    },
    {
      id: "dark" as const,
      label: "Dark",
      description: "Reduced glare for low-light sessions.",
      icon: Moon,
      previewClassName: "bg-zinc-950 text-zinc-100",
    },
    {
      id: "system" as const,
      label: "System",
      description: "Follow your device theme automatically.",
      icon: Monitor,
      previewClassName: "bg-linear-to-br from-zinc-100 from-50% to-zinc-950 to-50% text-zinc-500",
    },
  ];

  return (
    <Card variant="outline" padding="lg">
      <CardHeader>
        <CardTitle className="text-base">Theme</CardTitle>
        <CardDescription>Pick a theme for the app shell and settings surfaces.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-3">
          {options.map(({ id, label, description, icon: Icon, previewClassName }) => {
            const isActive = currentTheme === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => onThemeChange(id)}
                className={cn(
                  "rounded-xl border border-border bg-surface-0 p-4 text-left transition-colors hover:border-border-hover hover:bg-surface-1",
                  isActive && "border-foreground shadow-sm",
                )}
              >
                <div
                  className={cn(
                    "mb-3 flex h-24 items-center justify-center rounded-lg border border-white/10",
                    previewClassName,
                  )}
                >
                  <Icon size={18} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-foreground">{label}</span>
                  {isActive ? (
                    <Badge variant="outline" size="xs">
                      Active
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{description}</p>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileTab({ currentUser }: { currentUser: (typeof mockUsers)[number] }): ReactElement {
  return (
    <Card variant="outline" padding="lg">
      <CardHeader>
        <CardTitle className="text-base">Personal details</CardTitle>
        <CardDescription>
          Keep your profile information up to date for teammates and shared workspaces.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border p-4">
          <div className="flex items-center gap-4">
            <img src={currentUser.avatar} alt="" className="size-16 rounded-full" />
            <div className="space-y-1">
              <p className="text-[13px] font-medium text-foreground">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground">
                Update your avatar for channels and DMs.
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Change avatar
          </Button>
        </div>

        <FormField label="Name" description="Shown in chats, mentions, and member lists.">
          <Input defaultValue={currentUser.name} />
        </FormField>

        <FormField label="Email" description="Managed by your account identity provider.">
          <Input type="email" defaultValue={currentUser.email} disabled />
        </FormField>
      </CardContent>
    </Card>
  );
}

function parseGithubUrl(input: string): { owner: string; repo: string } | null {
  const trimmed = input.trim();
  const patterns = [/^https?:\/\/github\.com\/([^/]+)\/([^/.\s]+)/, /^([^/\s]+)\/([^/\s]+)$/];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);

    if (match) {
      return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
    }
  }

  return null;
}

function RepositoriesTab({
  repositories,
  repoInput,
  repoDescInput,
  repoError,
  onInputChange,
  onDescChange,
  onErrorChange,
  onAdd,
  onRemove,
  onUpdate,
}: {
  repositories: import("@/types").Repository[];
  repoInput: string;
  repoDescInput: string;
  repoError: string;
  onInputChange: (value: string) => void;
  onDescChange: (value: string) => void;
  onErrorChange: (value: string) => void;
  onAdd: (repo: import("@/types").Repository) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: { description?: string }) => void;
}): ReactElement {
  const handleAdd = (): void => {
    const parsed = parseGithubUrl(repoInput);

    if (!parsed) {
      onErrorChange("Enter a valid GitHub URL or owner/repo");
      return;
    }

    const url = `https://github.com/${parsed.owner}/${parsed.repo}`;

    if (repositories.some((repo) => repo.url === url)) {
      onErrorChange("This repository has already been added");
      return;
    }

    onAdd({
      id: `repo-${Date.now()}`,
      url,
      name: `${parsed.owner}/${parsed.repo}`,
      description: repoDescInput.trim(),
      addedAt: Date.now(),
    });
    onInputChange("");
    onDescChange("");
    onErrorChange("");
  };

  return (
    <div className="space-y-6">
      <Card variant="outline" padding="lg">
        <CardHeader>
          <CardTitle className="text-base">Connected repositories</CardTitle>
          <CardDescription>
            Agents use repository descriptions to decide where code changes belong.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            label="Repository URL"
            description={
              repoError
                ? undefined
                : repoInput.trim()
                  ? "Press Enter to add the repository."
                  : "Paste a GitHub URL or owner/repo slug."
            }
            invalid={!!repoError}
            error={repoError || undefined}
          >
            <Input
              value={repoInput}
              invalid={!!repoError}
              leadingIcon={<Github size={16} />}
              onChange={(event) => {
                onInputChange(event.target.value);
                if (repoError) onErrorChange("");
              }}
              onKeyDown={(event) => event.key === "Enter" && handleAdd()}
              placeholder="https://github.com/owner/repo"
            />
          </FormField>

          <FormField
            label="Description"
            description="Optional context to help agents choose the right repository."
          >
            <Input
              value={repoDescInput}
              onChange={(event) => onDescChange(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && handleAdd()}
              placeholder="Frontend monorepo, Next.js + TypeScript"
            />
          </FormField>

          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={!repoInput.trim()}
              leadingIcon={<Plus size={14} />}
            >
              Add repository
            </Button>
          </div>

          {repositories.length > 0 ? (
            <div className="space-y-2">
              {repositories.map((repo) => (
                <div key={repo.id} className="rounded-xl border border-border p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-surface-2 p-2 text-muted-foreground">
                      <Github size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-[13px] font-medium text-foreground">
                          {repo.name}
                        </p>
                        <Badge variant="outline" size="xs">
                          Connected
                        </Badge>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{repo.url}</p>
                    </div>
                    <Button variant="ghost" size="icon-sm" asChild>
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${repo.name}`}
                      >
                        <ExternalLink size={14} />
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onRemove(repo.id)}
                      className="hover:text-destructive"
                      aria-label={`Remove ${repo.name}`}
                    >
                      <X size={14} />
                    </Button>
                  </div>

                  <div className="mt-3">
                    <Input
                      size="sm"
                      defaultValue={repo.description}
                      onBlur={(event) => {
                        const value = event.target.value.trim();

                        if (value !== repo.description) {
                          onUpdate(repo.id, { description: value });
                        }
                      }}
                      placeholder="Add a description for agents..."
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {repositories.length === 0 && !repoInput ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-8 text-center">
              <Github size={32} className="mb-3 text-muted-foreground/50" />
              <p className="text-[13px] font-medium text-foreground">No repositories added yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Add a GitHub repository to get started.
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function DeleteConfirmDialog({
  open,
  workspaceName,
  onOpenChange,
}: {
  open: boolean;
  workspaceName: string;
  onOpenChange: (open: boolean) => void;
}): ReactElement {
  const [confirmText, setConfirmText] = useState("");
  const isMatch = confirmText === workspaceName;
  const showValidation = confirmText.length > 0 && !isMatch;

  useEffect(() => {
    if (!open) {
      setConfirmText("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle className="text-destructive">Delete workspace</DialogTitle>
          <DialogDescription>
            This permanently deletes{" "}
            <span className="font-medium text-foreground">{workspaceName}</span> and all of its
            channels, messages, and agent configuration.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <FormField
            label={`Type ${workspaceName} to confirm`}
            description="This action cannot be undone."
            invalid={showValidation}
            error={showValidation ? "Workspace name must match exactly." : undefined}
          >
            <Input
              value={confirmText}
              invalid={showValidation}
              onChange={(event) => setConfirmText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  onOpenChange(false);
                }
              }}
              placeholder={workspaceName}
              autoFocus
            />
          </FormField>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => onOpenChange(false)}
            disabled={!isMatch}
            leadingIcon={<Trash2 size={14} />}
          >
            Delete forever
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
