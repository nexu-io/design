import { useEffect, useRef, useState } from "react";
import { Hash } from "lucide-react";

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
} from "@nexu-design/ui-web";

import { mockAgents, mockUsers } from "@/mock/data";
import { useAgentsStore } from "@/stores/agents";
import { useChatStore } from "@/stores/chat";
import type { Channel, MemberRef } from "@/types";

interface CreateChannelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (channelId: string) => void;
}

/*
 * Single-step "Create channel" dialog.
 *
 * The previous flow split this into two steps (details → add members), but
 * channels in a small workspace almost always include everyone anyway, and
 * the member picker was redundant with the existing "Add members" dialog
 * reachable from the channel itself. Collapsing it removes a click, a
 * progress bar, and an entire screen of UI the user mostly clicked through.
 *
 * New members flow: on create, we seed membership with ALL users + ALL
 * agents in the workspace (same default as before). Users can prune
 * membership later from the channel members panel.
 *
 * Copy is hardcoded in English on purpose — the broader app is still
 * wired through i18n, but this product surface is English-only and the
 * tokenised subtitle ("Step 1 of 2 — channel details") was the noisiest
 * side of the old flow.
 */
export function CreateChannelDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateChannelDialogProps): React.ReactElement {
  const addChannel = useChatStore((s) => s.addChannel);
  const storeAgents = useAgentsStore((s) => s.agents);
  const agents = storeAgents.length > 0 ? storeAgents : mockAgents;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    setName("");
    setDescription("");

    requestAnimationFrame(() => nameInputRef.current?.focus());
  }, [open]);

  const handleCreate = (): void => {
    const trimmedName = name.trim().toLowerCase().replace(/\s+/g, "-");
    if (!trimmedName) return;

    // Default membership: everyone in the workspace + every agent. Pruning
    // happens later via the members panel; at creation the channel should
    // be immediately usable by the team.
    const members: MemberRef[] = [
      ...mockUsers.map((user): MemberRef => ({ kind: "user", id: user.id })),
      ...agents.map((agent): MemberRef => ({ kind: "agent", id: agent.id })),
    ];

    const channel: Channel = {
      id: `ch-${Date.now()}`,
      name: trimmedName,
      description: description.trim() || undefined,
      type: "channel",
      members,
      lastMessageAt: Date.now(),
      unreadCount: 0,
      createdAt: Date.now(),
    };

    addChannel(channel);
    onOpenChange(false);
    setTimeout(() => onCreated?.(channel.id), 0);
  };

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === "Enter" && !event.shiftKey && name.trim()) {
      event.preventDefault();
      handleCreate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Create channel</DialogTitle>
          <DialogDescription>
            Channels are where your team collaborates on a topic or project.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="space-y-4">
            <FormField label="Name">
              <FormFieldControl>
                <Input
                  ref={nameInputRef}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. design-review"
                  leadingIcon={<Hash className="size-4" />}
                />
              </FormFieldControl>
            </FormField>

            <FormField
              label={
                <span>
                  Description <span className="font-normal text-text-muted">(optional)</span>
                </span>
              }
            >
              <FormFieldControl>
                <Input
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="What's this channel about?"
                />
              </FormFieldControl>
            </FormField>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim()}>
            Create channel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
