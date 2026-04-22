import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  cn,
} from "@nexu-design/ui-web";
import { AlertCircle, CheckCircle2, ExternalLink, Loader2, MailPlus, Users } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { SlarkAuthFrame } from "@/components/onboarding/slark-auth-frame";
import { useWorkspaceStore } from "@/stores/workspace";

type JoinState = "idle" | "joining" | "joined" | "error";

export function InviteLandingPage(): React.ReactElement {
  const { token } = useParams();
  const completeOnboarding = useWorkspaceStore((state) => state.completeOnboarding);
  const setWorkspace = useWorkspaceStore((state) => state.setWorkspace);
  const [state, setState] = useState<JoinState>(token ? "idle" : "error");

  const workspaceName = "Acme Engineering";
  const workspaceAvatar =
    "https://api.dicebear.com/9.x/identicon/svg?seed=acme&backgroundColor=6d28d9";
  const inviterName = "Alice Chen";

  const handleJoin = (): void => {
    if (!token) {
      setState("error");
      return;
    }

    setState("joining");
    setTimeout(() => {
      setWorkspace({
        id: "ws-1",
        name: workspaceName,
        avatar: workspaceAvatar,
        createdAt: Date.now(),
      });
      completeOnboarding();
      setState("joined");
    }, 1500);
  };

  const handleTryDeepLink = (): void => {
    window.location.href = `nexu://join/${token}`;
  };

  const chipTone = state === "error" ? "error" : "brand";
  const chipClassName = cn(
    "mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl ring-1 ring-inset",
    chipTone === "error"
      ? "bg-[var(--color-error-subtle)] text-[var(--color-error)] ring-[color-mix(in_srgb,var(--color-error)_18%,transparent)]"
      : "bg-[var(--color-brand-subtle)] text-[var(--color-brand-primary)] ring-[color-mix(in_srgb,var(--color-brand-primary)_18%,transparent)]",
  );

  return (
    <SlarkAuthFrame>
      <Card
        variant="static"
        padding="lg"
        className="w-full rounded-2xl border-border bg-surface-1 shadow-card"
      >
        <CardHeader className="items-center text-center">
          <div className={chipClassName}>
            {state === "joined" ? (
              <CheckCircle2 className="size-7" strokeWidth={2.25} />
            ) : state === "error" ? (
              <AlertCircle className="size-7" strokeWidth={2.25} />
            ) : state === "joining" ? (
              <Loader2 className="size-7 animate-spin" strokeWidth={2.25} />
            ) : (
              <Users className="size-7" strokeWidth={2.25} />
            )}
          </div>

          {state === "idle" ? (
            <>
              <CardTitle className="text-[22px] font-semibold leading-tight tracking-tight text-text-heading">
                {inviterName} invited you to join
              </CardTitle>
              <CardDescription className="text-[13px] leading-relaxed text-text-secondary">
                Accept the invitation to <strong>{workspaceName}</strong>.
              </CardDescription>
            </>
          ) : null}

          {state === "joining" ? (
            <>
              <CardTitle className="text-[22px] font-semibold leading-tight tracking-tight text-text-heading">
                Joining {workspaceName}…
              </CardTitle>
              <CardDescription className="text-[13px] leading-relaxed text-text-secondary">
                Setting up your access
              </CardDescription>
            </>
          ) : null}

          {state === "joined" ? (
            <>
              <CardTitle className="text-[22px] font-semibold leading-tight tracking-tight text-text-heading">
                You're in
              </CardTitle>
              <CardDescription className="text-[13px] leading-relaxed text-text-secondary">
                Welcome to <strong>{workspaceName}</strong>
              </CardDescription>
            </>
          ) : null}

          {state === "error" ? (
            <>
              <CardTitle className="text-[22px] font-semibold leading-tight tracking-tight text-text-heading">
                Invalid invitation
              </CardTitle>
              <CardDescription className="text-[13px] leading-relaxed text-text-secondary">
                This link is invalid or has expired. Ask your teammate for a new one.
              </CardDescription>
            </>
          ) : null}
        </CardHeader>

        <CardContent className="space-y-3">
          {state === "idle" ? (
            <>
              <div className="space-y-1.5">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                  Invite code
                </span>
                <Input
                  readOnly
                  size="lg"
                  value={token ?? ""}
                  leadingIcon={<MailPlus className="size-4 text-text-tertiary" />}
                  inputClassName="font-mono text-[13px] tracking-tight text-text-secondary"
                  onFocus={(event) => event.currentTarget.select()}
                />
              </div>
              <Button className="w-full justify-center" size="lg" onClick={handleJoin}>
                Accept invitation
              </Button>
            </>
          ) : null}

          {state === "joining" ? (
            <Alert>
              <Loader2 className="size-4 animate-spin" />
              <AlertDescription>Setting up your access</AlertDescription>
            </Alert>
          ) : null}

          {state === "joined" ? (
            <Button
              className="w-full justify-center"
              size="lg"
              onClick={handleTryDeepLink}
              leadingIcon={<ExternalLink className="size-4" />}
            >
              Open in Nexu App
            </Button>
          ) : null}

          {state === "error" ? (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>
                This link is invalid or has expired. Ask your teammate for a new one.
              </AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>
    </SlarkAuthFrame>
  );
}
