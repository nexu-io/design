import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
} from "@nexu-design/ui-web";
import { AlertCircle, ArrowUpRight, CheckCircle2, Loader2, Users } from "lucide-react";
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
              {/* Workspace destination chip — small annotation, serif
                  typography for the name so it reads as a proper brand
                  name rather than body copy. */}
              <div className="mx-auto mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-2.5 py-1">
                <img
                  src={workspaceAvatar}
                  alt=""
                  className="h-5 w-5 rounded-md bg-secondary ring-1 ring-inset ring-black/5"
                />
                <span
                  className="text-[13px] font-semibold leading-none tracking-tight text-text-heading"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {workspaceName}
                </span>
              </div>
              <CardTitle className="text-[22px] font-semibold leading-tight tracking-tight text-text-heading">
                {inviterName} invited you to join
              </CardTitle>
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
            <CardTitle className="text-[22px] font-semibold leading-tight tracking-tight text-text-heading">
              Welcome to {workspaceName}
            </CardTitle>
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
            <Button className="w-full justify-center" size="lg" onClick={handleJoin}>
              Accept invitation
            </Button>
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
              trailingIcon={<ArrowUpRight className="size-4" />}
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
