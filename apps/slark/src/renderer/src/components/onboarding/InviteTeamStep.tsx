import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rocket, Plus, X } from "lucide-react";
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
            <input
              type="email"
              value={email}
              onChange={(e) => updateEmail(i, e.target.value)}
              placeholder="colleague@company.com"
              className="flex-1 h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {emails.length > 1 && (
              <button
                onClick={() => removeEmail(i)}
                className="h-10 w-10 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addEmail}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-1"
        >
          <Plus className="h-3.5 w-3.5" />
          Add another
        </button>
      </div>
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={handleGetStarted}
          className="h-10 px-5 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip
        </button>
        <button
          onClick={handleGetStarted}
          className="flex items-center gap-2 h-10 px-5 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
        >
          <Rocket className="h-4 w-4" />
          Get Started
        </button>
      </div>
    </div>
  );
}
