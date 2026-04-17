import { mockUsers } from "@/mock/data";
import { useWorkspaceStore } from "@/stores/workspace";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  InteractiveRow,
  InteractiveRowContent,
  InteractiveRowLeading,
  InteractiveRowTrailing,
  Separator,
} from "@nexu-design/ui-web";
import { ChevronDown, ChevronUp, LogIn, LogOut, RotateCcw, Settings2, UserCog } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
      <Button
        onClick={() => setOpen(true)}
        size="sm"
        className="fixed bottom-4 right-4 z-[999] shadow-lg"
      >
        <Settings2 className="h-3.5 w-3.5" />
        Dev
        <ChevronUp className="h-3.5 w-3.5" />
      </Button>
    );
  }

  return (
    <Card
      variant="outlined"
      padding="none"
      className="fixed bottom-4 right-4 z-[999] w-72 overflow-hidden shadow-2xl"
    >
      <CardHeader className="flex-row items-center justify-between bg-surface-2 px-3 py-2">
        <CardTitle className="flex items-center gap-1.5 text-xs">
          <Settings2 className="h-3.5 w-3.5" />
          Dev Controls
        </CardTitle>
        <Button onClick={() => setOpen(false)} variant="ghost" size="icon-sm">
          <ChevronDown className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-3 p-3">
        <section>
          <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
            App State
          </div>
          <div className="space-y-1">
            {states.map(({ id, label, icon: Icon }) => (
              <InteractiveRow
                key={id}
                tone="subtle"
                selected={currentState === id}
                className="items-center rounded-md border-transparent px-2.5 py-1.5 text-xs"
                onClick={() => jumpTo(id)}
              >
                <InteractiveRowLeading>
                  <Icon className="h-3.5 w-3.5" />
                </InteractiveRowLeading>
                <InteractiveRowContent className="text-left">{label}</InteractiveRowContent>
                <InteractiveRowTrailing>
                  {currentState === id ? (
                    <div className="h-1.5 w-1.5 rounded-full bg-slark-primary" />
                  ) : null}
                </InteractiveRowTrailing>
              </InteractiveRow>
            ))}
          </div>
        </section>

        <Separator />

        <section>
          <div className="mb-1.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
            <UserCog className="h-3 w-3" />
            Current User
          </div>
          <div className="space-y-1">
            {mockUsers.map((user) => (
              <InteractiveRow
                key={user.id}
                tone="subtle"
                selected={currentUserId === user.id}
                className="items-center rounded-md border-transparent px-2.5 py-1.5 text-xs"
                onClick={() => setCurrentUser(user.id)}
              >
                <InteractiveRowLeading>
                  <img
                    src={user.avatar}
                    alt={`${user.name} avatar`}
                    className="h-4 w-4 rounded-full"
                  />
                </InteractiveRowLeading>
                <InteractiveRowContent className="truncate text-left">
                  {user.name}
                </InteractiveRowContent>
                <InteractiveRowTrailing>
                  <Badge
                    size="xs"
                    variant={user.role === "owner" ? "accent" : "secondary"}
                    className="capitalize"
                  >
                    {user.role}
                  </Badge>
                </InteractiveRowTrailing>
              </InteractiveRow>
            ))}
          </div>
        </section>

        <Separator />

        <Button
          onClick={() => {
            reset();
            navigate("/");
          }}
          variant="outline"
          size="sm"
          className="w-full justify-start hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset All State
        </Button>
      </CardContent>
    </Card>
  );
}
