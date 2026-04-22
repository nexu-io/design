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
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Lock,
  MailPlus,
  Sparkles,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

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

  const browserUrl = `https://nexu.app/invite/${token ?? ""}`;

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 80% at 50% -10%, color-mix(in srgb, var(--color-brand-primary) 14%, transparent), transparent 55%), linear-gradient(180deg, #f7f8fb 0%, #eef0f5 100%)",
      }}
    >
      <BrowserChrome url={browserUrl} />

      <main className="mx-auto flex min-h-[calc(100vh-44px)] w-full max-w-[1040px] flex-col items-center justify-center px-6 py-10">
        <div className="mb-6 flex items-center gap-2 text-[13px] text-text-tertiary">
          <Sparkles className="size-3.5" />
          <span>nexu.app</span>
        </div>

        <Card
          variant="static"
          padding="lg"
          className="w-full max-w-[440px] rounded-2xl border-border bg-surface-1 shadow-card"
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

        <p className="mt-6 max-w-[420px] text-center text-[11px] text-text-tertiary">
          {t("invite.termsAgreement")}{" "}
          <a className="underline underline-offset-2" href="#">
            {t("invite.terms")}
          </a>{" "}
          {t("invite.and")}{" "}
          <a className="underline underline-offset-2" href="#">
            {t("invite.privacy")}
          </a>
          .
        </p>
      </main>
    </div>
  );
}

function BrowserChrome({ url }: { url: string }): React.ReactElement {
  return (
    <div className="flex h-11 w-full items-center gap-3 border-b border-border bg-surface-2 px-4">
      <div className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
      </div>
      <div className="flex h-7 flex-1 items-center gap-2 rounded-md bg-surface-1 px-3 text-[12px] text-text-secondary shadow-[inset_0_0_0_1px_var(--color-border)]">
        <Lock className="size-3 text-text-tertiary" />
        <span className="truncate font-mono">{url}</span>
      </div>
    </div>
  );
}
