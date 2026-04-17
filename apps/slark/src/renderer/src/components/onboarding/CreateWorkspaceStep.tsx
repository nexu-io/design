import { useWorkspaceStore } from "@/stores/workspace";
import { Button, FormField, Input } from "@nexu-design/ui-web";
import { ArrowRight, Check, Mail, Send } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="w-full">
      <div className="text-center">
        <h1 className="text-[20px] font-semibold leading-tight text-text-heading">
          Create your workspace
        </h1>
        <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
          Set up your team space, then send the first round of invites.
        </p>
      </div>

      <div className="mt-6 space-y-5">
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

        <div className="space-y-3">
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
              <Button
                variant="outline"
                size="md"
                onClick={addEmail}
                disabled={!emailInput.trim()}
                aria-label="Send invite"
              >
                <Send className="size-4" />
              </Button>
            </div>
          </FormField>
          {invitedEmails.length > 0 ? (
            <ul className="space-y-1.5">
              {invitedEmails.map((email) => (
                <li
                  key={email}
                  className="flex items-center gap-2 rounded-lg bg-surface-1 px-3 py-2"
                >
                  <Mail className="size-3.5 shrink-0 text-text-tertiary" />
                  <span className="min-w-0 flex-1 truncate text-[13px] text-text-primary">
                    {email}
                  </span>
                  <Check className="ml-auto size-3.5 shrink-0 text-success" strokeWidth={3} />
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            onClick={handleContinue}
            disabled={!name.trim()}
            trailingIcon={<ArrowRight size={16} />}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
