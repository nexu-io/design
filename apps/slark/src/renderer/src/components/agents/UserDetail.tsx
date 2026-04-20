import { cn } from "@nexu-design/ui-web";
import { Hash, Mail, MessageSquare } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { WindowChrome } from "@/components/layout/WindowChrome";
import { useT } from "@/i18n";
import { useChatStore } from "@/stores/chat";
import type { Channel, User } from "@/types";

interface UserDetailProps {
  user: User;
}

export function UserDetail({ user }: UserDetailProps): React.ReactElement {
  const t = useT();
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

  const statusLabel =
    user.status === "online"
      ? t("team.status.online")
      : user.status === "away"
        ? t("team.status.away")
        : user.status === "dnd"
          ? t("team.status.dnd")
          : t("team.status.offline");

  const statusDot =
    user.status === "online"
      ? "bg-nexu-online"
      : user.status === "away" || user.status === "dnd"
        ? "bg-nexu-busy"
        : "bg-nexu-offline";

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <WindowChrome className="h-10" />

      <div className="px-6 pb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative shrink-0">
            <img src={user.avatar} alt="" className="h-14 w-14 rounded-full" />
            <div
              className={cn(
                "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-background",
                statusDot,
              )}
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold truncate">{user.name}</h1>
              {user.role === "owner" && (
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
                  {t("team.role.owner")}
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground">{statusLabel}</div>
          </div>
        </div>
        {user.id !== "u-1" && (
          <button
            type="button"
            onClick={handleMessage}
            className="flex items-center gap-1.5 h-8 px-3 rounded-md text-sm border border-border hover:bg-accent transition-colors shrink-0"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            {t("team.directMessage")}
          </button>
        )}
      </div>

      <div className="px-6 space-y-6">
        <section>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {t("team.userProfile")}
          </h2>
          <div className="rounded-lg border border-border p-4 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground w-24 shrink-0">Email</span>
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="h-4 w-4 shrink-0" />
              <span className="text-muted-foreground w-24 shrink-0">
                {user.role === "owner" ? t("team.role.owner") : t("team.role.member")}
              </span>
              <span className="capitalize">{user.role}</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {t("team.userChannels")}
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
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-accent/50 transition-colors"
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
  );
}
