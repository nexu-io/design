import { mockUsers } from "@/mock/data";
import { useAgentsStore } from "@/stores/agents";
import { useChatStore } from "@/stores/chat";
import type { Channel, MemberRef } from "@/types";
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
  Input,
} from "@nexu-design/ui-web";
import { Hash } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CreateChannelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (channelId: string) => void;
}

export function CreateChannelDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateChannelDialogProps): React.ReactElement | null {
  const addChannel = useChatStore((s) => s.addChannel);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const handleCreate = (): void => {
    const trimmed = name.trim().toLowerCase().replace(/\s+/g, "-");
    if (!trimmed) return;

    const channel: Channel = {
      id: `ch-${Date.now()}`,
      name: trimmed,
      description: description.trim() || undefined,
      type: "channel",
      members: [
        ...mockUsers.map((u): MemberRef => ({ kind: "user", id: u.id })),
        ...useAgentsStore.getState().agents.map((a): MemberRef => ({ kind: "agent", id: a.id })),
      ],
      lastMessageAt: Date.now(),
      unreadCount: 0,
      createdAt: Date.now(),
    };

    const id = channel.id;
    addChannel(channel);
    setName("");
    setDescription("");
    onOpenChange(false);
    setTimeout(() => onCreated?.(id), 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter" && !e.shiftKey && name.trim()) {
      e.preventDefault();
      handleCreate();
    }
    if (e.key === "Escape") {
      onOpenChange(false);
    }
  };

  const handleClose = (nextOpen: boolean): void => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      setName("");
      setDescription("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent size="md" className="p-0">
        <DialogHeader className="px-5 pt-5 pb-1">
          <DialogTitle className="text-base font-semibold">Create channel</DialogTitle>
          <DialogDescription className="text-sm text-text-secondary">
            Start a new shared conversation for your workspace.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-4">
          <FormField label="Name">
            <Input
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. design-review"
              leadingIcon={<Hash className="size-3.5" />}
            />
          </FormField>

          <FormField
            label="Description"
            description="Optional context for teammates browsing channels."
          >
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What's this channel about?"
            />
          </FormField>
        </DialogBody>

        <DialogFooter className="px-5 pb-5">
          <Button variant="outline" size="sm" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleCreate} disabled={!name.trim()}>
            Create channel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
