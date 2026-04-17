import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Settings2, ChevronDown, ChevronUp, RotateCcw, LogIn, LogOut, UserCog } from "lucide-react";
import { cn } from "@nexu-design/ui-web";
import { useWorkspaceStore } from "@/stores/workspace";
import { mockUsers } from "@/mock/data";

type AppState = "welcome" | "onboarding" | "app";

export function DevPanel(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isOnboarded, currentUserId, setCurrentUser, completeOnboarding, switchWorkspace, reset } =
    useWorkspaceStore();

  const currentState: AppState = !isOnboarded
    ? location.pathname.startsWith("/onboarding")
      ? "onboarding"
      : "welcome"
    : "app";

  const jumpTo = (state: AppState): void => {
    switch (state) {
      case "welcome":
        reset();
        navigate("/");
        break;
      case "onboarding":
        reset();
        navigate("/onboarding/workspace");
        break;
      case "app":
        switchWorkspace("ws-1");
        completeOnboarding();
        navigate("/chat");
        break;
    }
  };

  const states: { id: AppState; label: string; icon: React.ElementType }[] = [
    { id: "welcome", label: "Welcome (Logged out)", icon: LogOut },
    { id: "onboarding", label: "Onboarding", icon: LogIn },
    { id: "app", label: "Main App (Logged in)", icon: Settings2 },
  ];

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-[999] flex h-9 items-center gap-1.5 rounded-lg bg-slark-primary/90 px-3 text-xs font-medium text-white shadow-lg hover:bg-slark-primary transition-colors"
      >
        <Settings2 className="h-3.5 w-3.5" />
        Dev
        <ChevronUp className="h-3 w-3" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[999] w-72 rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-accent/50">
        <span className="text-xs font-semibold flex items-center gap-1.5">
          <Settings2 className="h-3.5 w-3.5" />
          Dev Controls
        </span>
        <button
          onClick={() => setOpen(false)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <div className="p-3 space-y-3">
        <div>
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            App State
          </div>
          <div className="space-y-1">
            {states.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => jumpTo(id)}
                className={cn(
                  "flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md text-xs transition-colors",
                  currentState === id
                    ? "bg-slark-primary/15 text-slark-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
                {currentState === id && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-slark-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-border" />

        <div>
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <UserCog className="h-3 w-3" />
            Current User
          </div>
          <div className="space-y-1">
            {mockUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => setCurrentUser(user.id)}
                className={cn(
                  "flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md text-xs transition-colors",
                  currentUserId === user.id
                    ? "bg-accent text-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                )}
              >
                <img src={user.avatar} alt="" className="h-4 w-4 rounded-full" />
                <span className="flex-1 text-left truncate">{user.name}</span>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded",
                    user.role === "owner"
                      ? "bg-slark-primary/10 text-slark-primary"
                      : "bg-secondary text-muted-foreground",
                  )}
                >
                  {user.role}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-border" />

        <button
          onClick={() => {
            reset();
            navigate("/");
          }}
          className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md text-xs text-destructive-foreground hover:bg-destructive/10 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset All State
        </button>
      </div>
    </div>
  );
}
