import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Building2, Link2, LogIn } from "lucide-react";
import {
  Button,
  FormField,
  FormFieldControl,
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@nexu-design/ui-web";
import { useT } from "@/i18n";
import { useWorkspaceStore } from "@/stores/workspace";

type Mode = "create" | "join";

export function CreateWorkspaceStep(): React.ReactElement {
  const t = useT();
  const navigate = useNavigate();
  const setWorkspace = useWorkspaceStore((s) => s.setWorkspace);
  const completeOnboarding = useWorkspaceStore((s) => s.completeOnboarding);

  const [mode, setMode] = useState<Mode>("create");

  // Create mode state
  const [name, setName] = useState("");

  // Join mode state
  const [inviteLink, setInviteLink] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joining, setJoining] = useState(false);

  const handleContinue = (): void => {
    if (!name.trim()) return;
    setWorkspace({
      id: `ws-${Date.now()}`,
      name: name.trim(),
      createdAt: Date.now(),
    });
    navigate("/onboarding/runtime");
  };

  const handleJoin = (): void => {
    const link = inviteLink.trim();
    if (!link) {
      setJoinError(t("onboarding.pasteInviteOrCode"));
      return;
    }
    // Accept full URL or bare token
    const tokenMatch = link.match(/invite\/([^/?#]+)/);
    const token = tokenMatch ? tokenMatch[1] : link;
    if (token.length < 4) {
      setJoinError(t("onboarding.invalidInviteLink"));
      return;
    }
    setJoinError("");
    setJoining(true);
    setTimeout(() => {
      setWorkspace({
        id: "ws-1",
        name: "Acme Engineering",
        avatar: "https://api.dicebear.com/9.x/identicon/svg?seed=acme&backgroundColor=6d28d9",
        createdAt: Date.now(),
      });
      completeOnboarding();
      setJoining(false);
      navigate("/");
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center gap-6 pt-10">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
        <Building2 className="h-7 w-7 text-muted-foreground" />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-semibold">
          {mode === "create" ? t("onboarding.createWorkspace") : t("onboarding.joinWorkspace")}
        </h2>
        <p className="text-muted-foreground mt-2">
          {mode === "create"
            ? t("onboarding.createWorkspaceDesc")
            : t("onboarding.joinWorkspaceDesc")}
        </p>
      </div>

      <Tabs value={mode} onValueChange={(value) => setMode(value as Mode)}>
        <TabsList>
          <TabsTrigger value="create">
            <Building2 className="h-3.5 w-3.5" />
            {t("onboarding.createNew")}
          </TabsTrigger>
          <TabsTrigger value="join">
            <LogIn className="h-3.5 w-3.5" />
            {t("onboarding.joinExisting")}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {mode === "create" ? (
        <>
          <div className="w-full max-w-sm space-y-5">
            <FormField label={t("onboarding.workspaceName")}>
              <FormFieldControl>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("onboarding.workspaceNamePlaceholder")}
                  autoFocus
                />
              </FormFieldControl>
            </FormField>
          </div>

          <Button
            onClick={handleContinue}
            disabled={!name.trim()}
            className="mt-2 h-11"
            trailingIcon={<ArrowRight className="h-4 w-4" />}
          >
            {t("common.continue")}
          </Button>
        </>
      ) : (
        <>
          <div className="w-full max-w-sm space-y-5">
            <FormField
              label={t("onboarding.inviteLink")}
              invalid={Boolean(joinError)}
              error={joinError}
              description={t("onboarding.inviteHint")}
            >
              <FormFieldControl>
                <Input
                  type="text"
                  value={inviteLink}
                  onChange={(e) => {
                    setInviteLink(e.target.value);
                    setJoinError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleJoin();
                    }
                  }}
                  placeholder={t("onboarding.invitePlaceholderUrl")}
                  leadingIcon={<Link2 className="h-4 w-4 text-muted-foreground" />}
                  invalid={Boolean(joinError)}
                  autoFocus
                />
              </FormFieldControl>
            </FormField>
          </div>

          <Button
            onClick={handleJoin}
            disabled={!inviteLink.trim() || joining}
            className="mt-2 h-11"
          >
            {joining ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-background border-t-transparent animate-spin" />
                {t("onboarding.joining")}
              </>
            ) : (
              <>
                {t("onboarding.joinWorkspaceCta")}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </>
      )}
    </div>
  );
}
