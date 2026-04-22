import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  Copy,
  Link2,
  Mail,
  Plus,
  Rocket,
  Search,
  Send,
  UserPlus,
  X,
} from "lucide-react";
import {
  Badge,
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  FormFieldControl,
  Input,
  InteractiveRow,
  InteractiveRowContent,
  InteractiveRowLeading,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  cn,
} from "@nexu-design/ui-web";
import { useT } from "@/i18n";
import { useWorkspaceStore } from "@/stores/workspace";
import { useAgentsStore } from "@/stores/agents";
import { useRuntimesStore } from "@/stores/runtimes";
import { mockAgentTemplates, mockRuntimes } from "@/mock/data";
import type { AgentTemplate } from "@/types";

type AgentPhase = "templates" | "settings";

export function CreateAgentStep(): React.ReactElement {
  const t = useT();
  const navigate = useNavigate();
  const completeOnboarding = useWorkspaceStore((s) => s.completeOnboarding);
  const setPendingWelcomeAgent = useWorkspaceStore((s) => s.setPendingWelcomeAgent);
  const addAgent = useAgentsStore((s) => s.addAgent);
  const runtimes = useRuntimesStore((s) => s.runtimes);
  const setGlobalRuntimes = useRuntimesStore((s) => s.setRuntimes);

  // Invite state
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const inviteToken = useMemo(
    () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36),
    [],
  );
  const inviteLinkUrl = `${window.location.origin}/invite/${inviteToken}`;

  // Agent state
  const [agentPhase, setAgentPhase] = useState<AgentPhase>("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | null>(null);
  const [agentName, setAgentName] = useState("");
  const [description, setDescription] = useState("");
  const [runtimeId, setRuntimeId] = useState<string | null>(null);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const showEmailError = (msg: string): void => {
    setEmailError(msg);
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    errorTimerRef.current = setTimeout(() => setEmailError(""), 3000);
  };

  const addEmail = (): void => {
    const email = emailInput.trim();
    if (!email) return;
    if (!isValidEmail(email)) {
      showEmailError(t("workspace.invalidEmail"));
      return;
    }
    if (invitedEmails.includes(email)) {
      showEmailError(t("onboarding.emailAlreadyAdded"));
      return;
    }
    setInvitedEmails((prev) => [...prev, email]);
    setEmailInput("");
    setEmailError("");
  };

  const removeEmail = (email: string): void => {
    setInvitedEmails((prev) => prev.filter((e) => e !== email));
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

  const handleSelectTemplate = (tpl: AgentTemplate): void => {
    setSelectedTemplate(tpl);
    setAgentName(tpl.name);
    setDescription(tpl.description);
    const firstConnected = runtimes.find((r) => r.status === "connected");
    if (firstConnected) setRuntimeId(firstConnected.id);
    setAgentPhase("settings");
  };

  const handleBlankAgent = (): void => {
    setSelectedTemplate(null);
    setAgentName("");
    setDescription("");
    const firstConnected = runtimes.find((r) => r.status === "connected");
    if (firstConnected) setRuntimeId(firstConnected.id);
    setAgentPhase("settings");
  };

  const handleBackToTemplates = (): void => {
    const nameChanged = selectedTemplate ? agentName !== selectedTemplate.name : agentName !== "";
    const descChanged = selectedTemplate
      ? description !== selectedTemplate.description
      : description !== "";
    if (nameChanged || descChanged) {
      setShowDiscardDialog(true);
      return;
    }
    setAgentPhase("templates");
  };

  const handleDetectRuntimes = (): void => {
    const connected = mockRuntimes.filter((r) => r.status === "connected");
    setGlobalRuntimes(connected);
    if (connected.length > 0) setRuntimeId(connected[0].id);
  };

  const finishAndGo = (): void => {
    completeOnboarding();
    navigate("/chat/ch-welcome");
  };

  const handleCreateAgent = (): void => {
    if (!agentName.trim()) return;
    const agentId = `a-${Date.now()}`;
    addAgent({
      id: agentId,
      name: agentName.trim(),
      avatar:
        selectedTemplate?.avatar ??
        `https://api.dicebear.com/9.x/bottts/svg?seed=${agentId}&backgroundColor=6366f1`,
      description: description.trim(),
      systemPrompt:
        selectedTemplate?.defaultPrompt ?? `You are ${agentName.trim()}, a helpful AI assistant.`,
      status: "online",
      skills: [],
      runtimeId,
      templateId: selectedTemplate?.id ?? null,
      createdBy: "u-1",
      createdAt: Date.now(),
    });
    setPendingWelcomeAgent(agentId);
    finishAndGo();
  };

  const connectedRuntimes = runtimes.filter((r) => r.status === "connected");

  return (
    <div className="flex flex-col items-center gap-5 pt-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent">
        <UserPlus className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-semibold">{t("onboarding.teammateTitle")}</h2>
        <p className="text-muted-foreground mt-1.5 text-sm">{t("onboarding.teammateDesc")}</p>
      </div>

      {agentPhase === "templates" ? (
        <>
          <div className="w-[360px] space-y-5">
            {/* Invite colleagues section */}
            <section className="space-y-2.5">
              <div className="flex items-center gap-2">
                <UserPlus className="h-3.5 w-3.5 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">
                  {t("onboarding.tabInvite")}
                </h3>
              </div>

              <FormField invalid={Boolean(emailError)} error={emailError}>
                <div className="flex items-center gap-2">
                  <FormFieldControl className="flex-1">
                    <Input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      onKeyDown={handleEmailKeyDown}
                      placeholder={t("workspace.invitePlaceholder")}
                      leadingIcon={<Mail className="h-4 w-4 text-muted-foreground" />}
                      invalid={Boolean(emailError)}
                    />
                  </FormFieldControl>
                  <Button
                    onClick={addEmail}
                    disabled={!emailInput.trim()}
                    size="sm"
                    className="h-10 shrink-0"
                    leadingIcon={<Send className="h-3.5 w-3.5" />}
                  >
                    {t("workspace.invite")}
                  </Button>
                </div>

                <div className="mt-3 flex items-center gap-2 rounded-lg border border-dashed border-border bg-secondary/40 px-3 py-2.5">
                  <Link2 className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground mb-0.5">
                      {t("onboarding.shareInviteLink")}
                    </div>
                    <div className="text-xs font-mono text-foreground truncate">
                      {inviteLinkUrl}
                    </div>
                  </div>
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    size="xs"
                    className="h-7 shrink-0"
                    leadingIcon={
                      linkCopied ? (
                        <Check className="h-3 w-3 text-nexu-online" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )
                    }
                  >
                    {linkCopied ? t("common.copied") : t("common.copy")}
                  </Button>
                </div>

                {invitedEmails.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {invitedEmails.map((email) => (
                      <div
                        key={email}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border"
                      >
                        <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{email}</div>
                          <Badge variant="success" size="xs" className="mt-1">
                            {t("onboarding.invitationSent")}
                          </Badge>
                        </div>
                        <Button
                          onClick={() => removeEmail(email)}
                          variant="ghost"
                          size="icon-sm"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </FormField>
            </section>

            {/* Create an agent section */}
            <section className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">
                  {t("onboarding.tabAgent")}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {mockAgentTemplates.map((tpl) => (
                  <InteractiveRow
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl)}
                    tone="subtle"
                    className="items-start rounded-xl border border-border px-2.5 py-2.5"
                  >
                    <InteractiveRowLeading>
                      <img src={tpl.avatar} alt="" className="h-9 w-9 rounded-lg shrink-0" />
                    </InteractiveRowLeading>
                    <InteractiveRowContent>
                      <div className="font-medium text-[13px] leading-tight">{tpl.name}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-snug">
                        {tpl.description}
                      </div>
                    </InteractiveRowContent>
                  </InteractiveRow>
                ))}
              </div>

              <Button
                onClick={handleBlankAgent}
                variant="outline"
                size="sm"
                className="h-9 w-full border-dashed text-muted-foreground"
                leadingIcon={<Plus className="h-3.5 w-3.5" />}
              >
                <span className="text-[13px] font-medium">Start from scratch</span>
              </Button>
            </section>
          </div>

          <div className="flex items-center gap-3 mt-1">
            <Button onClick={finishAndGo} variant="ghost">
              Skip for now
            </Button>
            <Button
              onClick={finishAndGo}
              trailingIcon={<ArrowRight className="h-4 w-4" />}
            >
              {t("onboarding.finishSetup")}
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="w-full max-w-md space-y-5">
            {selectedTemplate && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/50 border border-border">
                <img src={selectedTemplate.avatar} alt="" className="h-10 w-10 rounded-lg shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-muted-foreground">Based on template</div>
                  <div className="text-sm font-medium">{selectedTemplate.name}</div>
                </div>
              </div>
            )}

            <FormField label="Agent Name">
              <FormFieldControl>
                <Input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="e.g. CodeBot"
                  autoFocus
                />
              </FormFieldControl>
            </FormField>

            <FormField label="Description">
              <FormFieldControl>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this agent do?"
                  rows={3}
                />
              </FormFieldControl>
            </FormField>

            <FormField label="Runtime">
              <FormFieldControl>
                <Select
                  value={runtimeId ?? undefined}
                  onValueChange={(value) => {
                    setRuntimeId(value);
                  }}
                  disabled={connectedRuntimes.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        connectedRuntimes.length > 0 ? "Select a runtime" : "No runtime connected"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {connectedRuntimes.map((rt) => (
                      <SelectItem key={rt.id} value={rt.id}>
                        <span className="flex w-full items-center gap-2">
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full shrink-0",
                              rt.status === "connected" ? "bg-nexu-online" : "bg-nexu-offline",
                            )}
                          />
                          <span className="truncate">{rt.name}</span>
                          {rt.version ? (
                            <span className="text-xs text-muted-foreground">v{rt.version}</span>
                          ) : null}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormFieldControl>
              {connectedRuntimes.length === 0 && (
                <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  No runtimes detected.
                  <Button
                    onClick={handleDetectRuntimes}
                    type="button"
                    variant="link"
                    size="inline"
                    className="h-auto text-foreground"
                  >
                    <Search className="h-3 w-3" />
                    Scan now
                  </Button>
                </p>
              )}
            </FormField>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <Button
              onClick={handleBackToTemplates}
              variant="ghost"
              leadingIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Back to templates
            </Button>
            <Button
              onClick={handleCreateAgent}
              disabled={!agentName.trim()}
              leadingIcon={<Rocket className="h-4 w-4" />}
            >
              Create Agent
            </Button>
          </div>
        </>
      )}

      <Dialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Discard changes?</DialogTitle>
            <DialogDescription>
              Your edits to this agent draft will be lost if you go back to templates.
            </DialogDescription>
          </DialogHeader>
          <DialogBody />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDiscardDialog(false)}>
              Keep editing
            </Button>
            <Button
              onClick={() => {
                setShowDiscardDialog(false);
                setAgentPhase("templates");
              }}
            >
              Discard and go back
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
