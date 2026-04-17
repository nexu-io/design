import { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  Mail,
  Send,
  Check,
  Shield,
  Trash2,
  Moon,
  Sun,
  Monitor,
  Plus,
  Github,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@nexu-design/ui-web";
import { useWorkspaceStore } from "@/stores/workspace";
import { useThemeStore } from "@/stores/theme";
import { mockUsers } from "@/mock/data";

interface PendingInvite {
  email: string;
  status: "pending" | "sending" | "sent";
}

export function SettingsView(): React.ReactElement {
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
      <div className="max-w-2xl mx-auto p-6">
        <div className="drag-region h-10" />

        {activeTab === "workspace" && (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Workspace Name</label>
              <input
                type="text"
                defaultValue={workspace?.name ?? ""}
                className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-3 block">Invite Members</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => {
                      setInviteEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                    placeholder="colleague@company.com"
                    className={cn(
                      "w-full h-10 rounded-lg border bg-background pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-shadow",
                      emailError
                        ? "border-destructive focus:ring-destructive/30"
                        : "border-input focus:ring-ring",
                    )}
                  />
                </div>
                <button
                  onClick={handleInvite}
                  disabled={!inviteEmail.trim()}
                  className="flex items-center gap-2 h-10 px-4 rounded-lg bg-foreground text-background text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-foreground/90 transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                  Invite
                </button>
              </div>
              {emailError ? (
                <p className="text-[11px] text-destructive-foreground mt-1.5">{emailError}</p>
              ) : inviteEmail.trim() ? (
                <p className="text-[11px] text-muted-foreground mt-1.5">Press Enter to invite</p>
              ) : null}
              {pendingInvites.length > 0 && (
                <div className="mt-3 space-y-2">
                  {pendingInvites.map((invite) => (
                    <div
                      key={invite.email}
                      className="flex items-center gap-3 rounded-lg border border-dashed border-border p-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm">{invite.email}</div>
                        <div className="text-xs text-muted-foreground">
                          {invite.status === "sending" && "Sending invite..."}
                          {invite.status === "sent" && "Invitation sent"}
                        </div>
                      </div>
                      {invite.status === "sending" && (
                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin" />
                      )}
                      {invite.status === "sent" && <Check className="h-4 w-4 text-slark-online" />}
                      {invite.status === "pending" && (
                        <span className="text-xs text-muted-foreground">Pending</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Members ({mockUsers.length})</label>
              <div className="space-y-2">
                {mockUsers.map((user) => {
                  const isOwner = user.role === "owner";
                  return (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 rounded-lg border border-border p-3"
                    >
                      <img src={user.avatar} alt="" className="h-8 w-8 rounded-full" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{user.name}</span>
                          {user.id === currentUser.id && (
                            <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                              you
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                      <span
                        className={cn(
                          "flex items-center gap-1 text-xs px-2 py-1 rounded-md font-medium",
                          isOwner
                            ? "bg-slark-primary/10 text-slark-primary"
                            : "bg-secondary text-muted-foreground",
                        )}
                      >
                        {isOwner && <Shield className="h-3 w-3" />}
                        {user.role}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Invited members join as <span className="font-medium text-foreground">Member</span>{" "}
                — they can chat, use agents, and manage their own settings. Only the{" "}
                <span className="font-medium text-foreground">Owner</span> can delete the workspace.
              </p>
            </div>

            {currentUser.role === "owner" && (
              <div className="rounded-xl border border-destructive/30 p-4 mt-2">
                <h3 className="text-sm font-semibold text-destructive-foreground mb-1">
                  Danger Zone
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Permanently delete this workspace and all its data. This cannot be undone.
                </p>
                <button
                  onClick={() => setDeleteConfirmOpen(true)}
                  className="flex items-center gap-2 h-9 px-4 rounded-lg border border-destructive/50 text-destructive-foreground text-sm font-medium hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete Workspace
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "appearance" && (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-3 block">Theme</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "light" as const, label: "Light", icon: Sun },
                  { id: "dark" as const, label: "Dark", icon: Moon },
                  { id: "system" as const, label: "System", icon: Monitor },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setTheme(id)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 h-24 rounded-xl text-sm font-medium transition-colors",
                      id === "dark" && "bg-zinc-950 text-zinc-100",
                      id === "light" && "bg-zinc-100 text-zinc-900",
                      id === "system" &&
                        "bg-linear-to-br from-zinc-100 from-50% to-zinc-950 to-50% text-zinc-500",
                      theme === id ? "border-2 border-foreground" : "border border-border",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
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

        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img src={currentUser.avatar} alt="" className="h-16 w-16 rounded-full" />
              <button className="h-8 px-3 rounded-md text-sm border border-border hover:bg-accent transition-colors">
                Change Avatar
              </button>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Name</label>
              <input
                type="text"
                defaultValue={currentUser.name}
                className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <input
                type="email"
                defaultValue={currentUser.email}
                disabled
                className="w-full h-10 rounded-lg border border-input bg-secondary px-3 text-sm text-muted-foreground"
              />
            </div>
          </div>
        )}
      </div>

      {deleteConfirmOpen && (
        <DeleteConfirmDialog
          workspaceName={workspace?.name ?? "this workspace"}
          onCancel={() => setDeleteConfirmOpen(false)}
          onConfirm={() => {
            setDeleteConfirmOpen(false);
          }}
        />
      )}
    </div>
  );
}

function parseGithubUrl(input: string): { owner: string; repo: string } | null {
  const trimmed = input.trim();
  const patterns = [/^https?:\/\/github\.com\/([^/]+)\/([^/.\s]+)/, /^([^/\s]+)\/([^/\s]+)$/];
  for (const p of patterns) {
    const m = trimmed.match(p);
    if (m) return { owner: m[1], repo: m[2].replace(/\.git$/, "") };
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
  onInputChange: (v: string) => void;
  onDescChange: (v: string) => void;
  onErrorChange: (v: string) => void;
  onAdd: (repo: import("@/types").Repository) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: { description?: string }) => void;
}): React.ReactElement {
  const handleAdd = (): void => {
    const parsed = parseGithubUrl(repoInput);
    if (!parsed) {
      onErrorChange("Enter a valid GitHub URL or owner/repo");
      return;
    }
    const url = `https://github.com/${parsed.owner}/${parsed.repo}`;
    if (repositories.some((r) => r.url === url)) {
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
      <div>
        <label className="text-sm font-medium mb-1 block">Repositories</label>
        <p className="text-xs text-muted-foreground mb-4">
          Git repositories associated with this workspace. Agents use the description to determine
          which repo to work with.
        </p>

        <div className="rounded-xl border border-border p-4 space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={repoInput}
                onChange={(e) => {
                  onInputChange(e.target.value);
                  if (repoError) onErrorChange("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="https://github.com/owner/repo"
                className={cn(
                  "w-full h-9 rounded-lg border bg-background pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-shadow",
                  repoError
                    ? "border-destructive focus:ring-destructive/30"
                    : "border-input focus:ring-ring",
                )}
              />
            </div>
            <input
              type="text"
              value={repoDescInput}
              onChange={(e) => onDescChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Description — e.g. Frontend monorepo, Next.js + TypeScript"
              className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
            <button
              onClick={handleAdd}
              disabled={!repoInput.trim()}
              className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-foreground text-background text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-foreground/90 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add repository
            </button>
          </div>
          {repoError ? (
            <p className="text-[11px] text-destructive-foreground -mt-2">{repoError}</p>
          ) : repoInput.trim() ? (
            <p className="text-[11px] text-muted-foreground -mt-2">Press Enter to add</p>
          ) : null}

          {repositories.length > 0 && (
            <div className="space-y-2">
              {repositories.map((repo) => (
                <div key={repo.id} className="rounded-lg border border-border p-3 group">
                  <div className="flex items-center gap-3">
                    <Github className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{repo.name}</div>
                    </div>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <button
                      onClick={() => onRemove(repo.id)}
                      className="text-muted-foreground hover:text-destructive-foreground transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    defaultValue={repo.description}
                    onBlur={(e) => {
                      const v = e.target.value.trim();
                      if (v !== repo.description) onUpdate(repo.id, { description: v });
                    }}
                    placeholder="Add a description for agents..."
                    className="mt-2 ml-7 w-[calc(100%-1.75rem)] h-7 rounded-md border-transparent bg-transparent px-2 text-xs text-muted-foreground placeholder:text-muted-foreground/50 hover:border-input hover:bg-background focus:border-input focus:bg-background focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
                  />
                </div>
              ))}
            </div>
          )}

          {repositories.length === 0 && !repoInput && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Github className="h-8 w-8 text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">No repositories added yet</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Add a GitHub repository to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmDialog({
  workspaceName,
  onCancel,
  onConfirm,
}: {
  workspaceName: string;
  onCancel: () => void;
  onConfirm: () => void;
}): React.ReactElement {
  const [confirmText, setConfirmText] = useState("");
  const isMatch = confirmText === workspaceName;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="w-[420px] rounded-xl border border-border bg-background shadow-xl">
        <div className="px-5 pt-5 pb-1">
          <h2 className="text-base font-semibold text-destructive-foreground">Delete Workspace</h2>
        </div>

        <div className="px-5 py-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            This will permanently delete{" "}
            <span className="font-medium text-foreground">{workspaceName}</span> and all its data
            including channels, messages, and agent configurations.
          </p>
          <p className="text-sm text-muted-foreground">
            Type{" "}
            <span className="font-mono text-foreground bg-secondary px-1.5 py-0.5 rounded text-xs">
              {workspaceName}
            </span>{" "}
            to confirm.
          </p>
          <input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && onCancel()}
            placeholder={workspaceName}
            autoFocus
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="flex justify-end gap-2 px-5 pb-5">
          <button
            onClick={onCancel}
            className="h-8 px-3 rounded-md text-sm border border-border hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!isMatch}
            className="h-8 px-4 rounded-md text-sm font-medium bg-destructive text-white hover:bg-destructive/90 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Trash2 className="h-3.5 w-3.5" />
              Delete forever
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
