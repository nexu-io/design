import { useWorkspaceStore } from "@/stores/workspace";
import { Plus, Rocket, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function InviteTeamStep(): React.ReactElement {
  const navigate = useNavigate();
  const completeOnboarding = useWorkspaceStore((s) => s.completeOnboarding);
  const [emails, setEmails] = useState([{ id: crypto.randomUUID(), value: "" }]);

  const addEmail = (): void => {
    setEmails((prev) => [...prev, { id: crypto.randomUUID(), value: "" }]);
  };

  const removeEmail = (id: string): void => {
    setEmails((prev) => prev.filter((email) => email.id !== id));
  };

  const updateEmail = (id: string, value: string): void => {
    setEmails((prev) => prev.map((email) => (email.id === id ? { ...email, value } : email)));
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
        {emails.map((email) => (
          <div key={email.id} className="flex items-center gap-2">
            <input
              type="email"
              value={email.value}
              onChange={(e) => updateEmail(email.id, e.target.value)}
              placeholder="colleague@company.com"
              className="flex-1 h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {emails.length > 1 && (
              <button
                type="button"
                onClick={() => removeEmail(email.id)}
                className="h-10 w-10 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addEmail}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-1"
        >
          <Plus className="h-3.5 w-3.5" />
          Add another
        </button>
      </div>
      <div className="flex items-center gap-3 mt-4">
        <button
          type="button"
          onClick={handleGetStarted}
          className="h-10 px-5 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip
        </button>
        <button
          type="button"
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
