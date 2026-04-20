import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rocket, Plus, X } from "lucide-react";

import { Button, Input } from "@nexu-design/ui-web";

import { useWorkspaceStore } from "@/stores/workspace";

export function InviteTeamStep(): React.ReactElement {
  const navigate = useNavigate();
  const completeOnboarding = useWorkspaceStore((s) => s.completeOnboarding);
  const [emails, setEmails] = useState([""]);

  const addEmail = (): void => {
    setEmails((prev) => [...prev, ""]);
  };

  const removeEmail = (index: number): void => {
    setEmails((prev) => prev.filter((_, i) => i !== index));
  };

  const updateEmail = (index: number, value: string): void => {
    setEmails((prev) => prev.map((e, i) => (i === index ? value : e)));
  };

  const handleGetStarted = (): void => {
    completeOnboarding();
    navigate("/chat");
  };

  return (
    <div className="flex flex-col items-center gap-6 pt-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Invite your team</h2>
        <p className="text-muted-foreground mt-2">Collaboration is better together</p>
      </div>
      <div className="flex flex-col gap-2 w-80">
        {emails.map((email, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              type="email"
              value={email}
              onChange={(e) => updateEmail(i, e.target.value)}
              placeholder="colleague@company.com"
              className="flex-1"
            />
            {emails.length > 1 && (
              <Button
                onClick={() => removeEmail(i)}
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          onClick={addEmail}
          variant="ghost"
          size="inline"
          className="mt-1 justify-start text-sm text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5" />
          Add another
        </Button>
      </div>
      <div className="flex items-center gap-3 mt-4">
        <Button onClick={handleGetStarted} variant="ghost">
          Skip
        </Button>
        <Button onClick={handleGetStarted} leadingIcon={<Rocket className="h-4 w-4" />}>
          Get Started
        </Button>
      </div>
    </div>
  );
}
