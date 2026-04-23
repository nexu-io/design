import { cn } from "@nexu-design/ui-web";
import { Hash, Mail, MessageSquare, Shield } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { WindowChrome } from "@/components/layout/WindowChrome";
import { presenceDotClass, presenceLabel } from "@/lib/user-presence";
import { useChatStore } from "@/stores/chat";
import type { Channel, User } from "@/types";

interface UserDetailProps {
  user: User;
}

export function UserDetail({ user }: UserDetailProps): React.ReactElement {
  const navigate = useNavigate();
  const channels = useChatStore((s) => s.channels);
  const addChannel = useChatStore((s) => s.addChannel);

  const userChannels = useMemo(
    () =>
      channels.filter(
        (c) => c.type === "channel" && c.members.some((m) => m.kind === "user" && m.id === user.id),
      ),
    [channels, user.id],
  );

  const dmChannel = useMemo(
    () =>
      channels.find(
        (c) =>
          c.type === "dm" &&
          c.members.some((m) => m.kind === "user" && m.id === user.id) &&
          c.members.some((m) => m.kind === "user" && m.id === "u-1"),
      ),
    [channels, user.id],
  );

  const handleMessage = (): void => {
    if (user.id === "u-1") return;
    if (dmChannel) {
      navigate(`/chat/${dmChannel.id}`);
      return;
    }
    const newDm: Channel = {
      id: `dm-${user.id}`,
      name: user.name,
      type: "dm",
      members: [
        { kind: "user", id: "u-1" },
        { kind: "user", id: user.id },
      ],
      lastMessageAt: Date.now(),
      unreadCount: 0,
      createdAt: Date.now(),
    };
    addChannel(newDm);
    navigate(`/chat/${newDm.id}`);
  };

  /* Presence uses the shared helpers from `lib/user-presence` — every
     surface (sidebar row, profile header, mention cards…) reads the
     same dot color + label for a given status so the standard stays
     consistent across the app. */
  const statusLabel = presenceLabel(user.status);
  const statusDot = presenceDotClass(user.status);

  return (
    /* Canonical workspace content-panel layout (AGENTS.md):
       outer scroll region + inner 800px-capped centered wrapper with
       shared horizontal padding. Matches SettingsView so profile and
       settings panels line up to the same gutters instead of one
       stretching edge-to-edge and the other being centered. */
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-[800px] px-4 pt-2 pb-6 sm:px-6 sm:pb-8">
        <WindowChrome className="h-10" />

        {/* Profile header plays the PageHeader role for this panel.
            `pb-6` mirrors the density="shell" spec so the gap down to
            the first section card matches other workspace panels. */}
        <div className="pb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {/* Avatar is now a clean portrait — the presence dot used
                to sit in the bottom-right but moved below the name
                (see below) so the status can be read alongside a
                text label without cluttering the photo. */}
            <img
              src={user.avatar}
              alt=""
              className="h-14 w-14 shrink-0 rounded-full ring-1 ring-inset ring-black/5 dark:ring-white/10"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold truncate">{user.name}</h1>
                {user.role === "owner" && (
                  /* Owner = link-blue emphasis (brand primary on brand-subtle
                     wash) so the role reads as an accent, not disabled text. */
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-primary bg-brand-subtle px-1.5 py-0.5 rounded">
                    Owner
                  </span>
                )}
              </div>
              {/* Presence line: dot + label, directly under the name. The
                  dot keeps a `role="status"` + `aria-label` so assistive
                  tech still reads the state even when paired with text. */}
              <div className="mt-1 flex items-center gap-1.5">
                <span
                  role="status"
                  aria-label={statusLabel}
                  className={cn("h-2 w-2 rounded-full", statusDot)}
                />
                <span className="text-xs text-text-tertiary">{statusLabel}</span>
              </div>
            </div>
          </div>
          {user.id !== "u-1" && (
            <button
              type="button"
              onClick={handleMessage}
              className="flex items-center gap-1.5 h-8 px-3 rounded-md text-sm border border-border hover:bg-surface-2 transition-colors shrink-0"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Direct message
            </button>
          )}
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Profile
            </h2>
            {/* Profile rows: tight label column (`w-14` ≈ 56px) fits
                "Email"/"Role" with just enough breathing room; the
                previous `w-24` left ~50px of empty space between label
                and value and made the pair feel disconnected. Every row
                now also has a leading glyph — Role picked up `Shield`
                to mirror the `Mail` pattern on Email, instead of the
                empty spacer that silently held the column. */}
            <div className="rounded-lg border border-border p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground w-14 shrink-0">Email</span>
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground w-14 shrink-0">Role</span>
                <span className="capitalize">{user.role}</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Channels
            </h2>
            {userChannels.length === 0 ? (
              <div className="rounded-lg border border-border p-6 text-center text-sm text-muted-foreground">
                —
              </div>
            ) : (
              <div className="rounded-lg border border-border divide-y divide-border">
                {userChannels.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => navigate(`/chat/${c.id}`)}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-surface-2 transition-colors"
                  >
                    <Hash className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
