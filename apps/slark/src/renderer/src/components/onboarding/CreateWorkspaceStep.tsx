import { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Mail, Send, Check, Link2, Copy, Plus } from "lucide-react";
import {
  Badge,
  Button,
  FormField,
  FormFieldControl,
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@nexu-design/ui-web";
import { useWorkspaceStore } from "@/stores/workspace";

type Mode = "create" | "join";

export function CreateWorkspaceStep(): React.ReactElement {
  const navigate = useNavigate();
  const setWorkspace = useWorkspaceStore((s) => s.setWorkspace);
  const completeOnboarding = useWorkspaceStore((s) => s.completeOnboarding);

  const [mode, setMode] = useState<Mode>("create");

  // Create mode state
  const [name, setName] = useState("");
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Join mode state
  const [inviteLink, setInviteLink] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joining, setJoining] = useState(false);

  const inviteToken = useMemo(
    () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36),
    [],
  );
  const inviteLinkUrl = `${window.location.origin}/invite/${inviteToken}`;

  const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const showError = (msg: string): void => {
    setEmailError(msg);
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    errorTimerRef.current = setTimeout(() => setEmailError(""), 3000);
  };

  const addEmail = (): void => {
    const email = emailInput.trim();
    if (!email) return;
    if (!isValidEmail(email)) {
      showError("Please enter a valid email address");
      return;
    }
    if (invitedEmails.includes(email)) {
      showError("This email has already been added");
      return;
    }
    setInvitedEmails((prev) => [...prev, email]);
    setEmailInput("");
    setEmailError("");
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEmail();
    }
  };

  const handleCopyLink = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(inviteLinkUrl);
    } catch {
      // fallback — ignore
    }
    setLinkCopied(true);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setLinkCopied(false), 2000);
  };

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
      setJoinError("Please paste an invite link or code");
      return;
    }
    // Accept full URL or bare token
    const tokenMatch = link.match(/invite\/([^/?#]+)/);
    const token = tokenMatch ? tokenMatch[1] : link;
    if (token.length < 4) {
      setJoinError("That invite link does not look valid");
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
      <div className="text-center">
        <h2 className="text-xl font-semibold text-text-primary">Set up your workspace</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Create a new team space, or join your team's existing workspace
        </p>
      </div>

      <Tabs value={mode} onValueChange={(value) => setMode(value as Mode)}>
        <TabsList>
          <TabsTrigger value="create">Create new</TabsTrigger>
          <TabsTrigger value="join">Join existing</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="w-full max-w-sm min-h-[180px]">
        {mode === "create" ? (
          <div className="space-y-8">
            <FormField
              label="Workspace name"
              labelClassName="text-xs font-medium text-text-heading"
            >
              <FormFieldControl>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. My AI Agency"
                  autoFocus
                />
              </FormFieldControl>
            </FormField>

            <div className="rounded-lg border border-dashed border-border">
              <button
                type="button"
                onClick={() => setInviteOpen((v) => !v)}
                aria-expanded={inviteOpen}
                className="flex w-full items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-2/40"
              >
                <Plus className="size-3.5" />
                Invite teammates <span className="text-text-muted font-normal">(optional)</span>
                {invitedEmails.length > 0 && (
                  <span className="ml-1 text-text-muted font-normal">· {invitedEmails.length}</span>
                )}
              </button>

              {inviteOpen && (
                <div className="space-y-3 px-3 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <Input
                          ref={emailRef}
                          type="email"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          onKeyDown={handleEmailKeyDown}
                          placeholder="colleague@company.com"
                          leadingIcon={<Mail className="size-4 text-text-muted" />}
                          invalid={Boolean(emailError)}
                        />
                      </div>
                      <Button
                        onClick={addEmail}
                        disabled={!emailInput.trim()}
                        size="sm"
                        leadingIcon={<Send className="size-3.5" />}
                      >
                        Invite
                      </Button>
                    </div>
                    {emailError && <p className="mt-1.5 text-xs text-destructive">{emailError}</p>}
                  </div>

                  <Button
                    onClick={handleCopyLink}
                    variant="secondary"
                    size="sm"
                    className="w-full justify-center"
                    leadingIcon={
                      linkCopied ? (
                        <Check className="size-3.5 text-success" />
                      ) : (
                        <Copy className="size-3.5" />
                      )
                    }
                  >
                    {linkCopied ? "Invite link copied" : "Share invite link"}
                  </Button>

                  {invitedEmails.length > 0 && (
                    <div className="space-y-1">
                      {invitedEmails.map((email) => (
                        <div
                          key={email}
                          className="flex items-center gap-3 rounded-md bg-surface-1/60 px-2.5 py-2"
                        >
                          <Mail className="size-4 text-text-muted shrink-0" />
                          <div className="flex-1 min-w-0 text-sm text-text-primary truncate">
                            {email}
                          </div>
                          <Badge variant="success" size="xs">
                            Sent
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <FormField
              label="Invite link"
              labelClassName="text-xs font-medium text-text-heading"
              invalid={Boolean(joinError)}
              error={joinError}
              description="Ask a teammate for the invite link to their workspace."
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
                  placeholder="https://nexu.app/invite/…"
                  leadingIcon={<Link2 className="size-4 text-text-muted" />}
                  invalid={Boolean(joinError)}
                  autoFocus
                />
              </FormFieldControl>
            </FormField>
          </div>
        )}
      </div>

      {mode === "create" ? (
        <Button
          onClick={handleContinue}
          disabled={!name.trim()}
          className="min-w-[240px]"
          trailingIcon={<ArrowRight className="size-4" />}
        >
          Save and detect runtimes
        </Button>
      ) : (
        <Button
          onClick={handleJoin}
          disabled={!inviteLink.trim() || joining}
          className="min-w-[240px]"
          trailingIcon={joining ? undefined : <ArrowRight className="size-4" />}
        >
          {joining ? (
            <>
              <div className="size-4 rounded-full border-2 border-background border-t-transparent animate-spin" />
              Joining…
            </>
          ) : (
            "Join workspace"
          )}
        </Button>
      )}
    </div>
  );
}
