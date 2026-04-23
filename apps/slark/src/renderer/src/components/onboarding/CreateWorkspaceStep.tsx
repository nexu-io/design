import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Link2 } from "lucide-react";
import { Button, FormField, FormFieldControl, Input } from "@nexu-design/ui-web";

import { useWorkspaceStore } from "@/stores/workspace";

export function CreateWorkspaceStep(): React.ReactElement {
  const navigate = useNavigate();
  const setWorkspace = useWorkspaceStore((s) => s.setWorkspace);
  const completeOnboarding = useWorkspaceStore((s) => s.completeOnboarding);

  // Create-new state.
  const [name, setName] = useState("");

  // Join-existing state.
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
      setJoinError("Please paste an invite link or code");
      return;
    }
    // Accept full URL or bare token.
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
    <div className="flex flex-col items-center gap-8 pt-10">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-text-primary">Set up your workspace</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Create a new team space, or join your team's existing workspace
        </p>
      </div>

      {/* Primary path: create a new workspace. Tabs were removed —
          the previous two-tab pattern forced users to guess which
          affordance they needed before seeing any fields. Stacking
          Create → Join inline makes both options visible at once and
          the "or" divider makes the relationship explicit. */}
      <div className="w-full max-w-sm space-y-4">
        <FormField label="Workspace name" labelClassName="text-xs font-medium text-text-heading">
          <FormFieldControl>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && name.trim()) {
                  e.preventDefault();
                  handleContinue();
                }
              }}
              placeholder="e.g. My AI Agency"
              autoFocus
            />
          </FormFieldControl>
        </FormField>

        <Button
          onClick={handleContinue}
          disabled={!name.trim()}
          className="w-full"
          trailingIcon={<ArrowRight className="size-4" />}
        >
          Save and detect runtimes
        </Button>
      </div>

      {/* "or" divider — two hairlines with a centered muted label. The
          label sits on the page background (`bg-background`) so the
          rules read as a single line interrupted by the word. */}
      <div className="w-full max-w-sm flex items-center gap-3" aria-hidden="true">
        <div className="h-px flex-1 bg-border-subtle" />
        <span className="text-xs font-medium uppercase tracking-wider text-text-muted">or</span>
        <div className="h-px flex-1 bg-border-subtle" />
      </div>

      {/* Secondary path: join an existing workspace via invite link. */}
      <div className="w-full max-w-sm space-y-4">
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
            />
          </FormFieldControl>
        </FormField>

        <Button
          onClick={handleJoin}
          disabled={!inviteLink.trim() || joining}
          variant="outline"
          className="w-full"
          trailingIcon={joining ? undefined : <ArrowRight className="size-4" />}
        >
          {joining ? (
            <>
              <div className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              Joining…
            </>
          ) : (
            "Join workspace"
          )}
        </Button>
      </div>
    </div>
  );
}
