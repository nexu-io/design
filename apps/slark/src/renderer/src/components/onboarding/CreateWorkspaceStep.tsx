import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Building2, Check, Mail, Send } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FormField,
  Input,
} from "@nexu-design/ui-web";
import { useWorkspaceStore } from "@/stores/workspace";

export function CreateWorkspaceStep(): React.ReactElement {
  const navigate = useNavigate();
  const setWorkspace = useWorkspaceStore((state) => state.setWorkspace);
  const [name, setName] = useState("");
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");
  const errorTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const showError = (message: string): void => {
    setEmailError(message);
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

    setInvitedEmails((previous) => [...previous, email]);
    setEmailInput("");
    setEmailError("");
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

  return (
    <Card
      variant="static"
      padding="lg"
      className="rounded-2xl border-border bg-surface-1 shadow-card"
    >
      <CardHeader className="items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-subtle text-brand-primary">
          <Building2 className="size-7" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-2xl text-text-primary">Create your workspace</CardTitle>
          <CardDescription className="text-sm text-text-secondary">
            Set up your team space, then send the first round of invites.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <FormField
          label="Workspace name"
          description="You can rename it later from Workspace settings."
        >
          <Input
            autoComplete="organization"
            value={name}
            placeholder="e.g. Acme Engineering"
            onChange={(event) => setName(event.target.value)}
          />
        </FormField>

        <div className="space-y-3 rounded-xl border border-border bg-surface-0 p-4">
          <FormField
            label="Invite teammates"
            description="Optional for now — invitations are sent as soon as you add them."
            error={emailError}
            invalid={!!emailError}
          >
            <div className="flex items-start gap-2">
              <Input
                type="email"
                value={emailInput}
                invalid={!!emailError}
                leadingIcon={<Mail className="size-4" />}
                placeholder="colleague@company.com"
                onChange={(event) => setEmailInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addEmail();
                  }
                }}
              />
              <Button variant="outline" onClick={addEmail} disabled={!emailInput.trim()}>
                <Send className="size-4" />
                Invite
              </Button>
            </div>
          </FormField>
          {invitedEmails.length > 0 ? (
            <div className="space-y-2">
              {invitedEmails.map((email) => (
                <div
                  key={email}
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface-1 px-4 py-3"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-subtle text-brand-primary">
                    <Mail className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-text-primary">{email}</div>
                    <div className="text-xs text-text-secondary">Invitation queued</div>
                  </div>
                  <Check className="size-4 text-success" strokeWidth={3} />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={handleContinue} disabled={!name.trim()}>
            Continue
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
