import { Component, type ReactNode, type ErrorInfo } from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { Button } from "@nexu-design/ui-web";
import { useT, translate } from "@/i18n";
import { useLocaleStore } from "@/stores/locale";
import { useWorkspaceStore } from "@/stores/workspace";
import { useAgentsStore } from "@/stores/agents";
import { AppLayout } from "@/components/layout/AppLayout";
import { DevPanel } from "@/components/layout/DevPanel";
import { WelcomePage } from "@/components/onboarding/WelcomePage";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { ChatView } from "@/components/chat/ChatView";
import { IssuesView } from "@/components/issues/IssuesView";
import { AgentsView } from "@/components/agents/AgentsView";
import { AgentDetail } from "@/components/agents/AgentDetail";
import { UserDetail } from "@/components/agents/UserDetail";
import { RoutinesView } from "@/components/routines/RoutinesView";
import { RuntimesView } from "@/components/runtimes/RuntimesView";
import { SettingsView } from "@/components/settings/SettingsView";
import { InviteLandingPage } from "@/components/invite/InviteLandingPage";
import { mockUsers } from "@/mock/data";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error): { error: Error } {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: 32,
            fontFamily: "monospace",
            color: "#ff6b6b",
            background: "#1a1a1a",
            height: "100vh",
            overflow: "auto",
          }}
        >
          <h2 style={{ marginBottom: 16 }}>
            {translate(useLocaleStore.getState().locale, "app.reactCrash")}
          </h2>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 13 }}>
            {this.state.error.message}
            {"\n\n"}
            {this.state.error.stack}
          </pre>
          <Button
            type="button"
            variant="outline"
            onClick={() => this.setState({ error: null })}
            style={{
              marginTop: 16,
              background: "#333",
              color: "#fff",
              border: "1px solid #555",
              borderRadius: 6,
            }}
          >
            {translate(useLocaleStore.getState().locale, "app.retry")}
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function App(): React.ReactElement {
  const isOnboarded = useWorkspaceStore((s) => s.isOnboarded);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        {!isOnboarded ? (
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/onboarding/*" element={<OnboardingFlow />} />
            <Route path="/invite/:token" element={<InviteLandingPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : (
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/chat/ch-welcome" replace />} />
              <Route path="/chat" element={<Navigate to="/chat/ch-welcome" replace />} />
              <Route path="/chat/:channelId" element={<ChatView />} />
              <Route path="/issues" element={<IssuesView />} />
              <Route path="/agents" element={<AgentsView />} />
              <Route path="/agents/:memberId" element={<MemberDetailRoute />} />
              <Route path="/runtimes" element={<RuntimesView />} />
              <Route path="/routines" element={<RoutinesView />} />
              <Route path="/routines/:routineId" element={<RoutinesView />} />
              <Route path="/settings" element={<SettingsView />} />
              <Route path="/settings/appearance" element={<SettingsView />} />
              <Route path="/settings/profile" element={<SettingsView />} />
            </Route>
            <Route path="/invite/:token" element={<InviteLandingPage />} />
            <Route path="*" element={<Navigate to="/chat/ch-welcome" replace />} />
          </Routes>
        )}
        <DevPanel />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

function MemberDetailRoute(): React.ReactElement {
  const t = useT();
  const { memberId } = useParams();
  const agents = useAgentsStore((s) => s.agents);

  const user = mockUsers.find((u) => u.id === memberId);
  if (user) return <UserDetail user={user} />;

  const agent = agents.find((a) => a.id === memberId);
  if (agent) return <AgentDetail agent={agent} />;

  return (
    <div className="flex h-full items-center justify-center text-muted-foreground">
      {t("agents.agentNotFound")}
    </div>
  );
}
