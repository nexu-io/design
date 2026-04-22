import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Hash, Trash2, Upload, UserMinus, UserPlus, X } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  EmptyState,
  FormField,
  FormFieldControl,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  cn,
} from "@nexu-design/ui-web";

import { useAgentsStore } from "@/stores/agents";
import { useChatStore } from "@/stores/chat";
import { mockUsers } from "@/mock/data";
import type { Channel, MemberRef } from "@/types";
import { AddMembersDialog } from "./AddMembersDialog";
import { ChannelAvatar } from "./ChannelAvatar";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2 MB

interface ChannelSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channel: Channel;
  currentUserId: string;
}

const CURRENT_USER_ID_FALLBACK = "u-1";

export function ChannelSettingsDialog({
  open,
  onOpenChange,
  channel,
  currentUserId,
}: ChannelSettingsDialogProps): React.ReactElement {
  const updateChannel = useChatStore((s) => s.updateChannel);
  const removeChannel = useChatStore((s) => s.removeChannel);
  const agents = useAgentsStore((s) => s.agents);

  const [name, setName] = useState(channel.name);
  const [description, setDescription] = useState(channel.description ?? "");
  const [avatar, setAvatar] = useState(channel.avatar ?? "");
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [tab, setTab] = useState<"general" | "members">("general");
  const [addOpen, setAddOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset local draft when opening or switching channel.
  useEffect(() => {
    if (!open) return;
    setName(channel.name);
    setDescription(channel.description ?? "");
    setAvatar(channel.avatar ?? "");
    setAvatarError(null);
    setTab("general");
    setConfirmDelete(false);
    requestAnimationFrame(() => nameInputRef.current?.focus());
  }, [open, channel.id, channel.name, channel.description, channel.avatar]);

  const handlePickFile = (): void => {
    setAvatarError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow re-selecting the same file later
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setAvatarError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setAvatarError("Image must be under 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatar(reader.result);
        setAvatarError(null);
      }
    };
    reader.onerror = () => setAvatarError("Could not read that image. Try another one.");
    reader.readAsDataURL(file);
  };

  const handleResetAvatar = (): void => {
    setAvatar("");
    setAvatarError(null);
  };

  const dirty =
    name.trim() !== channel.name ||
    (description.trim() || undefined) !== (channel.description ?? undefined) ||
    (avatar.trim() || undefined) !== (channel.avatar ?? undefined);

  const normalizedName = useMemo(
    () => name.trim().toLowerCase().replace(/\s+/g, "-"),
    [name],
  );

  const canSave = dirty && normalizedName.length > 0;

  const handleSave = (): void => {
    if (!canSave) return;
    updateChannel(channel.id, {
      name: normalizedName,
      description: description.trim() || undefined,
      avatar: avatar.trim() || undefined,
    });
    onOpenChange(false);
  };

  const handleRemoveMember = (ref: MemberRef): void => {
    const effectiveSelfId = currentUserId || CURRENT_USER_ID_FALLBACK;
    if (ref.kind === "user" && ref.id === effectiveSelfId) return; // don't remove self
    const next = channel.members.filter((m) => !(m.kind === ref.kind && m.id === ref.id));
    updateChannel(channel.id, { members: next });
  };

  const handleDelete = (): void => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    removeChannel(channel.id);
    onOpenChange(false);
  };

  const users = channel.members
    .filter((m): m is { kind: "user"; id: string } => m.kind === "user")
    .map((m) => mockUsers.find((u) => u.id === m.id))
    .filter((u): u is NonNullable<typeof u> => Boolean(u));

  const channelAgents = channel.members
    .filter((m): m is { kind: "agent"; id: string } => m.kind === "agent")
    .map((m) => agents.find((a) => a.id === m.id))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>Channel settings</DialogTitle>
            <DialogDescription>
              Update the channel details, avatar, and membership.
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="space-y-4">
            <Tabs value={tab} onValueChange={(v) => setTab(v as "general" | "members")}>
              <TabsList className="w-full justify-start">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="members">
                  Members
                  <span className="ml-1.5 text-[11px] text-text-muted">
                    {channel.members.length}
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="mt-4 space-y-4">
                <div className="flex items-start gap-4">
                  <button
                    type="button"
                    onClick={handlePickFile}
                    className="group relative shrink-0 overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Upload channel avatar"
                  >
                    <ChannelAvatar
                      channel={{
                        id: channel.id,
                        name: normalizedName || channel.name,
                        avatar: avatar.trim() || undefined,
                      }}
                      size={64}
                      className="rounded-xl"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-white opacity-0 transition-opacity group-hover:opacity-100">
                      <Upload className="size-4" />
                    </span>
                  </button>
                  <div className="flex-1 space-y-1.5">
                    <div className="text-[13px] font-medium text-text-heading">Channel avatar</div>
                    <p className="text-[11px] text-text-muted">
                      PNG, JPG, or GIF. Up to 2&nbsp;MB. Every channel gets a unique gradient by
                      default.
                    </p>
                    <div className="flex items-center gap-1.5 pt-1">
                      <Button variant="outline" size="sm" onClick={handlePickFile}>
                        <Upload className="size-3.5" />
                        {avatar ? "Replace" : "Upload"}
                      </Button>
                      {avatar ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleResetAvatar}
                          className="text-text-muted hover:text-text-primary"
                        >
                          <X className="size-3.5" />
                          Reset
                        </Button>
                      ) : null}
                    </div>
                    {avatarError ? (
                      <p className="text-[11px] text-danger">{avatarError}</p>
                    ) : null}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <FormField label="Name">
                  <FormFieldControl>
                    <Input
                      ref={nameInputRef}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      leadingIcon={<Hash className="size-4" />}
                    />
                  </FormFieldControl>
                </FormField>

                <FormField
                  label={
                    <span>
                      Description{" "}
                      <span className="font-normal text-text-muted">Optional</span>
                    </span>
                  }
                >
                  <FormFieldControl>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What is this channel about?"
                      rows={3}
                    />
                  </FormFieldControl>
                </FormField>

                <div className="pt-2 border-t border-border-subtle">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[13px] font-medium">Delete channel</div>
                      <div className="text-[11px] text-text-muted">
                        Permanently remove this channel and its messages for everyone.
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDelete}
                      className={cn(
                        "shrink-0 text-danger hover:bg-danger/10 hover:text-danger",
                        confirmDelete && "bg-danger text-white hover:bg-danger hover:text-white",
                      )}
                    >
                      <Trash2 className="size-3.5" />
                      {confirmDelete ? "Click again to confirm" : "Delete"}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="members" className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-[12px] text-text-muted">
                    {channel.members.length} total — {users.length} people, {channelAgents.length}{" "}
                    agents
                  </div>
                  <Button size="sm" onClick={() => setAddOpen(true)}>
                    <UserPlus className="size-3.5" />
                    Add members
                  </Button>
                </div>

                <div className="max-h-[340px] space-y-3 overflow-y-auto pr-1">
                  {users.length === 0 && channelAgents.length === 0 ? (
                    <EmptyState title="No members yet" className="border-border-subtle" />
                  ) : null}

                  {users.length > 0 ? (
                    <MemberSection label="People" count={users.length}>
                      {users.map((u) => {
                        const effectiveSelfId = currentUserId || CURRENT_USER_ID_FALLBACK;
                        const isSelf = u.id === effectiveSelfId;
                        return (
                          <MemberRow
                            key={`u-${u.id}`}
                            avatar={
                              <Avatar className="size-8">
                                <AvatarImage src={u.avatar} alt={u.name} />
                                <AvatarFallback>{u.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                            }
                            name={u.name}
                            sub={u.email}
                            trailing={
                              isSelf ? (
                                <Badge variant="secondary" size="xs">
                                  You
                                </Badge>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveMember({ kind: "user", id: u.id })}
                                  className="text-text-muted hover:text-danger hover:bg-danger/10"
                                >
                                  <UserMinus className="size-3.5" />
                                  Remove
                                </Button>
                              )
                            }
                          />
                        );
                      })}
                    </MemberSection>
                  ) : null}

                  {channelAgents.length > 0 ? (
                    <MemberSection label="Agents" count={channelAgents.length}>
                      {channelAgents.map((a) => (
                        <MemberRow
                          key={`a-${a.id}`}
                          avatar={
                            a.avatar ? (
                              <img
                                src={a.avatar}
                                alt={a.name}
                                className="size-8 rounded-lg"
                              />
                            ) : (
                              <div className="flex size-8 items-center justify-center rounded-lg bg-surface-2">
                                <Bot className="size-4 text-text-muted" />
                              </div>
                            )
                          }
                          name={a.name}
                          sub={a.description}
                          trailing={
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMember({ kind: "agent", id: a.id })}
                              className="text-text-muted hover:text-danger hover:bg-danger/10"
                            >
                              <UserMinus className="size-3.5" />
                              Remove
                            </Button>
                          }
                        />
                      ))}
                    </MemberSection>
                  ) : null}
                </div>
              </TabsContent>
            </Tabs>
          </DialogBody>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!canSave}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddMembersDialog open={addOpen} onOpenChange={setAddOpen} channel={channel} />
    </>
  );
}

function MemberSection({
  label,
  count,
  children,
}: {
  label: string;
  count: number;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <section className="space-y-1">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
          {label}
        </h3>
        <span className="text-[11px] text-text-muted">{count}</span>
      </div>
      <div className="space-y-0.5">{children}</div>
    </section>
  );
}

function MemberRow({
  avatar,
  name,
  sub,
  trailing,
}: {
  avatar: React.ReactNode;
  name: string;
  sub?: string;
  trailing: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-accent/40">
      <div className="shrink-0">{avatar}</div>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-medium text-text-heading truncate">{name}</div>
        {sub ? <div className="text-[11px] text-text-muted truncate">{sub}</div> : null}
      </div>
      <div className="shrink-0">{trailing}</div>
    </div>
  );
}
