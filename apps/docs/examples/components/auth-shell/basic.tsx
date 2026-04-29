import { AuthShell, BrandRail, Button, Input, Label } from "@nexu-design/ui-web";

export function AuthShellBasicExample() {
  return (
    <div className="min-h-[720px] overflow-hidden rounded-xl border border-border">
      <AuthShell
        rail={
          <BrandRail
            title={
              <h1 className="text-4xl font-semibold tracking-tight">OpenClaw, ready to use.</h1>
            }
            description="A desktop onboarding shell for auth, setup, and provider connection flows."
            footer={<p className="text-sm text-white/70">Trusted by modern operator teams.</p>}
          >
            <div className="space-y-3 text-base text-white/70">
              <div className="rounded-xl border border-white/10 bg-white/[0.025] px-5 py-4">
                Ship auth and welcome flows with a shared shell.
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.025] px-5 py-4">
                Keep brand context and trust cues visible.
              </div>
            </div>
          </BrandRail>
        }
      >
        <div className="mx-auto w-full max-w-[380px]">
          <div className="rounded-2xl border border-border bg-surface-1 p-8 shadow-card">
            <div className="mb-6 text-center">
              <h2 className="text-lg font-semibold text-text-primary">Create account</h2>
              <p className="mt-1 text-lg text-text-secondary">Choose how you want to continue.</p>
            </div>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="auth-shell-email">Email</Label>
                <Input id="auth-shell-email" type="email" placeholder="you@company.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auth-shell-password">Password</Label>
                <Input id="auth-shell-password" type="password" placeholder="••••••••" />
              </div>
              <Button className="w-full justify-center">Continue</Button>
            </div>
          </div>
        </div>
      </AuthShell>
    </div>
  );
}
