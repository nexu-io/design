import { useState } from "react";
import { useParams } from "react-router-dom";
import { AlertCircle, CheckCircle2, ExternalLink, Loader2, MailPlus, Users } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@nexu-design/ui-web";
import { SlarkAuthFrame } from "@/components/onboarding/slark-auth-frame";
import { useWorkspaceStore } from "@/stores/workspace";

type JoinState = "idle" | "joining" | "joined" | "error";

export function InviteLandingPage(): React.ReactElement {
  const { token } = useParams();
  const completeOnboarding = useWorkspaceStore((state) => state.completeOnboarding);
  const setWorkspace = useWorkspaceStore((state) => state.setWorkspace);
  const [state, setState] = useState<JoinState>("idle");

  const workspaceName = "Acme Engineering";
  const inviterName = "Alice Chen";

  const handleJoin = (): void => {
    setState("joining");
    setTimeout(() => {
      setWorkspace({
        id: "ws-1",
        name: workspaceName,
        avatar: "https://api.dicebear.com/9.x/identicon/svg?seed=acme&backgroundColor=6d28d9",
        createdAt: Date.now(),
      });
      completeOnboarding();
      setState("joined");
    }, 1500);
  };

  const handleTryDeepLink = (): void => {
    window.location.href = `slark://join/${token}`;
  };

  return (
    <SlarkAuthFrame>
      <Card
        variant="static"
        padding="lg"
        className="w-full rounded-2xl border-border bg-surface-1 shadow-card"
      >
        <CardHeader className="items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-subtle text-brand-primary">
            {state === "joined" ? (
              <CheckCircle2 className="size-7" />
            ) : state === "error" ? (
              <AlertCircle className="size-7" />
            ) : state === "joining" ? (
              <Loader2 className="size-7 animate-spin" />
            ) : (
              <Users className="size-7" />
            )}
          </div>

          {state === "idle" ? (
            <>
              <CardTitle className="text-2xl text-text-primary">
                {inviterName} invited you to join
              </CardTitle>
              <CardDescription className="text-sm text-text-secondary">
                Accept the invitation to collaborate in <strong>{workspaceName}</strong> with your
                team and agents.
              </CardDescription>
            </>
          ) : null}

          {state === "joining" ? (
            <>
              <CardTitle className="text-2xl text-text-primary">Joining workspace</CardTitle>
              <CardDescription className="text-sm text-text-secondary">
                We’re preparing your access now.
              </CardDescription>
            </>
          ) : null}

          {state === "joined" ? (
            <>
              <CardTitle className="text-2xl text-text-primary">You’re in</CardTitle>
              <CardDescription className="text-sm text-text-secondary">
                You’ve successfully joined <strong>{workspaceName}</strong>.
              </CardDescription>
            </>
          ) : null}

          {state === "error" ? (
            <>
              <CardTitle className="text-2xl text-text-primary">Invalid invite</CardTitle>
              <CardDescription className="text-sm text-text-secondary">
                This invitation link is invalid or expired.
              </CardDescription>
            </>
          ) : null}
        </CardHeader>

        <CardContent className="space-y-4">
          {state === "idle" ? (
            <>
              <Alert>
                <MailPlus className="size-4" />
                <AlertTitle>Invite code</AlertTitle>
                <AlertDescription className="font-mono text-xs text-text-tertiary">
                  {token}
                </AlertDescription>
              </Alert>
              <Button className="w-full justify-center" onClick={handleJoin}>
                Join {workspaceName}
              </Button>
            </>
          ) : null}

          {state === "joining" ? (
            <Alert>
              <Loader2 className="size-4 animate-spin" />
              <AlertDescription>
                Finalizing access and syncing your workspace context…
              </AlertDescription>
            </Alert>
          ) : null}

          {state === "joined" ? (
            <Button className="w-full justify-center" onClick={handleTryDeepLink}>
              <ExternalLink className="size-4" />
              Open in Slark app
            </Button>
          ) : null}

          {state === "error" ? (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>
                Ask your teammate for a new invite link and try again.
              </AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>
    </SlarkAuthFrame>
  );
}
