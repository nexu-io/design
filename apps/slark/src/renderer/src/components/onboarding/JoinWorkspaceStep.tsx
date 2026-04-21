import { Button, FormField, FormFieldControl, Input } from "@nexu-design/ui-web";
import { ArrowLeft, ArrowRight, Link2, LogIn } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useWorkspaceStore } from "@/stores/workspace";

export function JoinWorkspaceStep(): React.ReactElement {
  const navigate = useNavigate();
  const setWorkspace = useWorkspaceStore((s) => s.setWorkspace);
  const completeOnboarding = useWorkspaceStore((s) => s.completeOnboarding);

  const [inviteLink, setInviteLink] = useState("");
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);

  const handleJoin = (): void => {
    const link = inviteLink.trim();
    if (!link) {
      setError("Paste an invite link or code to continue.");
      return;
    }
    const tokenMatch = link.match(/invite\/([^/?#]+)/);
    const token = tokenMatch ? tokenMatch[1] : link;
    if (token.length < 4) {
      setError("That invite link doesn't look right.");
      return;
    }

    setError("");
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
    }, 900);
  };

  return (
    <div className="flex flex-col items-center gap-6 py-10">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-surface-2">
        <LogIn className="size-7 text-text-secondary" />
      </div>

      <div className="text-center">
        <h2 className="text-[22px] font-semibold text-text-heading">Join a workspace</h2>
        <p className="mt-1.5 text-[13px] text-text-secondary">
          Paste an invite link to hop into an existing team.
        </p>
      </div>

      <div className="w-full max-w-sm">
        <FormField
          label="Invite link"
          invalid={Boolean(error)}
          error={error || undefined}
          description={
            !error ? "Looks like slark://invite/… or a URL your teammate shared." : undefined
          }
        >
          <FormFieldControl>
            <Input
              type="text"
              value={inviteLink}
              onChange={(e) => {
                setInviteLink(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleJoin();
                }
              }}
              placeholder="https://slark.app/invite/…"
              leadingIcon={<Link2 size={14} />}
              invalid={Boolean(error)}
              autoFocus
            />
          </FormFieldControl>
        </FormField>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          onClick={() => navigate("/onboarding/workspace")}
          leadingIcon={<ArrowLeft size={16} />}
        >
          Back
        </Button>
        <Button
          size="lg"
          onClick={handleJoin}
          disabled={!inviteLink.trim() || joining}
          loading={joining}
          trailingIcon={!joining ? <ArrowRight size={18} /> : undefined}
        >
          {joining ? "Joining…" : "Join workspace"}
        </Button>
      </div>
    </div>
  );
}
