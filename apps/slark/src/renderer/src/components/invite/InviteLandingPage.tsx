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
import { AlertCircle, CheckCircle2, ExternalLink, Loader2, MailPlus, Users } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { SlarkAuthFrame } from "@/components/onboarding/slark-auth-frame";
import { useT } from "@/i18n";
import { useWorkspaceStore } from "@/stores/workspace";

type JoinState = "idle" | "joining" | "joined" | "error";

export function InviteLandingPage(): React.ReactElement {
  const t = useT();
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
                {inviterName} {t("invite.invitedYouToJoin")}
              </CardTitle>
              <CardDescription className="text-sm text-text-secondary">
                {t("invite.accept")} <strong>{workspaceName}</strong>.
              </CardDescription>
            </>
          ) : null}

          {state === "joining" ? (
            <>
              <CardTitle className="text-2xl text-text-primary">
                {t("invite.joining", { name: workspaceName })}
              </CardTitle>
              <CardDescription className="text-sm text-text-secondary">
                {t("invite.settingUp")}
              </CardDescription>
            </>
          ) : null}

          {state === "joined" ? (
            <>
              <CardTitle className="text-2xl text-text-primary">{t("invite.youreIn")}</CardTitle>
              <CardDescription className="text-sm text-text-secondary">
                {t("invite.welcomeTo")} <strong>{workspaceName}</strong>
              </CardDescription>
            </>
          ) : null}

          {state === "error" ? (
            <>
              <CardTitle className="text-2xl text-text-primary">
                {t("invite.invalidTitle")}
              </CardTitle>
              <CardDescription className="text-sm text-text-secondary">
                {t("invite.invalidDesc")}
              </CardDescription>
            </>
          ) : null}
        </CardHeader>

        <CardContent className="space-y-4">
          {state === "idle" ? (
            <>
              <Alert>
                <MailPlus className="size-4" />
                <AlertTitle>{t("invite.inviteCode")}</AlertTitle>
                <AlertDescription className="font-mono text-xs text-text-tertiary">
                  {token}
                </AlertDescription>
              </Alert>
              <Button className="w-full justify-center" onClick={handleJoin}>
                {t("invite.accept")}
              </Button>
            </>
          ) : null}

          {state === "joining" ? (
            <Alert>
              <Loader2 className="size-4 animate-spin" />
              <AlertDescription>{t("invite.settingUp")}</AlertDescription>
            </Alert>
          ) : null}

          {state === "joined" ? (
            <Button className="w-full justify-center" onClick={handleTryDeepLink}>
              <ExternalLink className="size-4" />
              {t("invite.openInApp")}
            </Button>
          ) : null}

          {state === "error" ? (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>{t("invite.invalidDesc")}</AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>
    </SlarkAuthFrame>
  );
}
