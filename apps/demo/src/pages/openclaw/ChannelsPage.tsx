import { Alert, AlertDescription, AlertTitle, Button, Input, Label } from "@nexu/ui-web";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  ExternalLink,
  Key,
  Lock,
  RotateCcw,
  Shield,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { usePageTitle } from "../../hooks/usePageTitle";
import { getPlatformConfig } from "./data";

const NEXU_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

function ConfiguredView({ onShowGuide }: { onShowGuide: () => void }) {
  const config = getPlatformConfig("slack");

  return (
    <div className="max-w-xl space-y-6">
      <div className="card flex gap-4 items-center p-5">
        <div className="flex justify-center items-center w-11 h-11 rounded-lg shrink-0 bg-success-subtle">
          <CheckCircle2 size={22} className="text-success" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-semibold text-text-primary">Slack Bot connected</div>
          <div className="text-[12px] text-text-tertiary mt-0.5">
            {config.configuredAt && `Configured ${config.configuredAt}`}
            {" · "}Connection OK
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onShowGuide}>
          <BookOpen size={14} /> Setup guide
        </Button>
      </div>

      <Alert variant="destructive" className="p-5">
        <Shield size={14} aria-hidden="true" />
        <AlertTitle className="text-[13px]">Reset configuration</AlertTitle>
        <AlertDescription className="text-[12px] text-text-tertiary">
          <p>
            Resetting will clear all Slack Bot configuration. You will need to complete setup again.
          </p>
          <div className="mt-4">
            <Button variant="destructive" size="sm" onClick={onShowGuide} className="gap-2">
              <RotateCcw size={12} /> Reset and reconfigure
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}

const SLACK_ICON_PATH =
  "M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.124 2.521a2.528 2.528 0 0 1 2.52-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.52V8.834zm-1.271 0a2.528 2.528 0 0 1-2.521 2.521 2.528 2.528 0 0 1-2.521-2.521V2.522A2.528 2.528 0 0 1 15.166 0a2.528 2.528 0 0 1 2.521 2.522v6.312zm-2.521 10.124a2.528 2.528 0 0 1 2.521 2.52A2.528 2.528 0 0 1 15.166 24a2.528 2.528 0 0 1-2.521-2.522v-2.52h2.521zm0-1.271a2.528 2.528 0 0 1-2.521-2.521 2.528 2.528 0 0 1 2.521-2.521h6.312A2.528 2.528 0 0 1 24 15.166a2.528 2.528 0 0 1-2.522 2.521h-6.312z";

const REQUIRED_SLACK_SCOPES = [
  { scope: "chat:write", desc: "Send messages" },
  { scope: "app_mentions:read", desc: "Receive @mentions" },
  { scope: "files:read", desc: "Read uploaded files" },
  { scope: "channels:history", desc: "Read channel messages" },
  { scope: "im:history", desc: "Read DM messages" },
];

const FONT = "var(--font-sans)";
const MONO = "var(--font-mono)";

function SlackOAuthView() {
  const [phase, setPhase] = useState<"oauth" | "authorizing" | "manual" | "done">("oauth");
  const [manualStep, setManualStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToSlack = () => {
    setPhase("authorizing");
    setTimeout(() => setPhase("done"), 2000);
  };

  if (phase === "oauth") {
    return (
      <div className="max-w-md mx-auto space-y-3">
        <div className="card p-6 text-center">
          <div
            className="flex justify-center items-center w-12 h-12 rounded-lg mx-auto mb-4"
            style={{ background: "rgba(74,21,75,0.10)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#611f69" aria-hidden="true">
              <path d={SLACK_ICON_PATH} />
            </svg>
          </div>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--color-text-primary)",
              fontFamily: FONT,
              marginBottom: 4,
            }}
          >
            Add nexu to Slack
          </h3>
          <p
            style={{
              fontSize: 12,
              color: "var(--color-text-muted)",
              marginBottom: 20,
              lineHeight: 1.6,
              maxWidth: 300,
              marginLeft: "auto",
              marginRight: "auto",
              fontFamily: FONT,
            }}
          >
            One-click auth. nexu Bot joins your Slack workspace — everyone on your team can use it.
          </p>
          <Button
            onClick={handleAddToSlack}
            className="flex gap-2 items-center justify-center mx-auto"
            style={{
              padding: "0 24px",
              height: 36,
              fontSize: 13,
              fontWeight: 500,
              fontFamily: FONT,
              color: "#ffffff",
              borderRadius: 100,
              background: "#611f69",
              border: "none",
              cursor: "pointer",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#4a154b";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#611f69";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <path d={SLACK_ICON_PATH} />
            </svg>
            Add to Slack
          </Button>
          <div
            className="flex gap-2 items-center justify-center mt-4"
            style={{ fontSize: 11, color: "var(--color-text-muted)", fontFamily: FONT }}
          >
            <Shield size={10} />
            <span>After auth, teammates join with zero config. Each has their own memory.</span>
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={() => setPhase("manual")}
          className="w-full gap-1.5 text-[12px] text-text-muted hover:text-text-secondary"
        >
          <Key size={11} />
          <span>
            Using your own Slack App?{" "}
            <span className="underline underline-offset-2">Enter token manually</span>
          </span>
        </Button>
      </div>
    );
  }

  if (phase === "authorizing") {
    return (
      <div className="max-w-md mx-auto">
        <div className="card p-8 text-center">
          <div
            className="flex justify-center items-center w-12 h-12 rounded-lg mx-auto mb-5"
            style={{ background: "rgba(74,21,75,0.10)" }}
          >
            <div
              className="w-5 h-5 rounded-full animate-spin"
              style={{ border: "2px solid rgba(97,31,105,0.30)", borderTopColor: "#611f69" }}
            />
          </div>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--color-text-primary)",
              fontFamily: FONT,
              marginBottom: 4,
            }}
          >
            Authorizing...
          </h3>
          <p
            style={{
              fontSize: 12,
              color: "var(--color-text-muted)",
              lineHeight: 1.6,
              fontFamily: FONT,
            }}
          >
            Connecting your Slack workspace
          </p>
        </div>
      </div>
    );
  }

  if (phase === "manual") {
    const manualSteps = [
      { title: "Create Slack App", desc: "In Slack API dashboard" },
      { title: "Enter credentials", desc: "Token & Signing Secret" },
      { title: "Set callback URL", desc: "Redirect URL" },
      { title: "Confirm permissions", desc: "Bot Token Scopes" },
    ];

    return (
      <div className="max-w-2xl">
        <Alert variant="info" className="mb-5" style={{ fontFamily: FONT }}>
          <AlertCircle size={16} aria-hidden="true" />
          <AlertTitle style={{ fontSize: 13 }}>Manual setup</AlertTitle>
          <AlertDescription style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
            <p>
              Use your own Slack App to customize Bot name and avatar. For teams who want a branded
              Bot.
              <Button
                variant="link"
                onClick={() => setPhase("oauth")}
                className="ml-1 p-0 h-auto text-[12px]"
              >
                Switch back to one-click auth →
              </Button>
            </p>
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-4 gap-2 mb-6">
          {manualSteps.map((s, i) => (
            <button
              key={i}
              onClick={() => setManualStep(i)}
              className="text-left cursor-pointer"
              style={{ background: "none", border: "none", padding: 0 }}
            >
              <div
                className="h-1 rounded-full"
                style={{
                  background: i <= manualStep ? "#611f69" : "var(--color-border)",
                  transition: "background 0.15s ease",
                }}
              />
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  marginTop: 8,
                  fontFamily: FONT,
                  color:
                    i === manualStep
                      ? "#611f69"
                      : i < manualStep
                        ? "var(--color-text-secondary)"
                        : "rgba(144,149,153,0.5)",
                  transition: "color 0.15s ease",
                }}
              >
                Step {i + 1}
              </div>
              <div
                className="hidden sm:block"
                style={{
                  fontSize: 10,
                  marginTop: 2,
                  lineHeight: 1.3,
                  fontFamily: FONT,
                  color: i === manualStep ? "var(--color-text-secondary)" : "rgba(144,149,153,0.4)",
                  transition: "color 0.15s ease",
                }}
              >
                {s.title}
              </div>
            </button>
          ))}
        </div>

        {manualStep === 0 && (
          <div className="card p-5">
            <div className="flex gap-3 items-start mb-4">
              <div
                className="flex justify-center items-center w-8 h-8 rounded-lg shrink-0"
                style={{
                  background: "rgba(97,31,105,0.10)",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#611f69",
                  fontFamily: FONT,
                }}
              >
                1
              </div>
              <div>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    fontFamily: FONT,
                  }}
                >
                  Create Slack App
                </h3>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--color-text-muted)",
                    marginTop: 4,
                    lineHeight: 1.6,
                    fontFamily: FONT,
                  }}
                >
                  Create a new app in Slack API dashboard. You can customize Bot name and avatar.
                </p>
              </div>
            </div>
            <div className="ml-11 space-y-3">
              <div className="space-y-2">
                {[
                  "Open Slack API dashboard",
                  'Click "Create New App" → "From scratch"',
                  "Enter App name (e.g. your brand)",
                  "Select Workspace to install",
                ].map((item, i) => (
                  <div key={i} className="flex gap-2.5 items-start">
                    <div
                      className="flex justify-center items-center w-5 h-5 rounded-full shrink-0 mt-0.5"
                      style={{
                        background: "var(--color-surface-2)",
                        fontSize: 9,
                        fontWeight: 700,
                        color: "var(--color-text-muted)",
                        fontFamily: FONT,
                      }}
                    >
                      {i + 1}
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--color-text-secondary)",
                        lineHeight: 1.6,
                        fontFamily: FONT,
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" asChild className="rounded-full">
                <a href="https://api.slack.com/apps" target="_blank" rel="noreferrer">
                  <ExternalLink size={12} />
                  Open Slack API Dashboard
                </a>
              </Button>
            </div>
          </div>
        )}

        {manualStep === 1 && (
          <div className="card p-5">
            <div className="flex gap-3 items-start mb-4">
              <div
                className="flex justify-center items-center w-8 h-8 rounded-lg shrink-0"
                style={{
                  background: "rgba(97,31,105,0.10)",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#611f69",
                  fontFamily: FONT,
                }}
              >
                2
              </div>
              <div>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    fontFamily: FONT,
                  }}
                >
                  Enter credentials
                </h3>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--color-text-muted)",
                    marginTop: 4,
                    lineHeight: 1.6,
                    fontFamily: FONT,
                  }}
                >
                  Find the following in App → Basic Information → App Credentials
                </p>
              </div>
            </div>
            <div className="ml-11 space-y-3">
              <div>
                <Label className="text-[11px] text-text-muted font-medium">
                  Bot User OAuth Token
                </Label>
                <Input type="text" placeholder="xoxb-xxxxxxxxxxxxx" className="font-mono" />
                <p className="text-[10px] text-text-tertiary mt-1">
                  OAuth & Permissions → Bot User OAuth Token
                </p>
              </div>
              <div>
                <Label className="text-[11px] text-text-muted font-medium">Signing Secret</Label>
                <div className="relative">
                  <Input type="password" placeholder="a1bc2d3e4f5..." className="font-mono pr-9" />
                  <Lock
                    size={13}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-placeholder"
                  />
                </div>
                <p className="text-[10px] text-text-tertiary mt-1">
                  Basic Information → App Credentials → Signing Secret
                </p>
              </div>
            </div>
          </div>
        )}

        {manualStep === 2 && (
          <div className="card p-5">
            <div className="flex gap-3 items-start mb-4">
              <div
                className="flex justify-center items-center w-8 h-8 rounded-lg shrink-0"
                style={{
                  background: "rgba(97,31,105,0.10)",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#611f69",
                  fontFamily: FONT,
                }}
              >
                3
              </div>
              <div>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    fontFamily: FONT,
                  }}
                >
                  Set callback URL
                </h3>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--color-text-muted)",
                    marginTop: 4,
                    lineHeight: 1.6,
                    fontFamily: FONT,
                  }}
                >
                  Set Request URL in App → Event Subscriptions
                </p>
              </div>
            </div>
            <div className="ml-11 space-y-3">
              <div
                className="flex gap-2 items-center p-3 rounded-lg"
                style={{
                  border: "1px solid var(--color-border)",
                  background: "var(--color-surface-0)",
                }}
              >
                <code
                  className="flex-1 break-all"
                  style={{ fontSize: 12, color: "var(--color-text-secondary)", fontFamily: MONO }}
                >
                  https://api.nexu.dev/webhook/slack/events
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy("https://api.nexu.dev/webhook/slack/events")}
                  className="shrink-0 size-7"
                >
                  {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
                </Button>
              </div>
              <div className="space-y-2">
                {[
                  "Go to App → Event Subscriptions",
                  "Enable Events",
                  "Paste the URL above into Request URL",
                  "Add message.im and app_mention to Subscribe to bot events",
                ].map((item, i) => (
                  <div key={i} className="flex gap-2.5 items-start">
                    <div
                      className="flex justify-center items-center w-5 h-5 rounded-full shrink-0 mt-0.5"
                      style={{
                        background: "var(--color-surface-2)",
                        fontSize: 9,
                        fontWeight: 700,
                        color: "var(--color-text-muted)",
                        fontFamily: FONT,
                      }}
                    >
                      {i + 1}
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--color-text-secondary)",
                        lineHeight: 1.6,
                        fontFamily: FONT,
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {manualStep === 3 && (
          <div className="card p-5">
            <div className="flex gap-3 items-start mb-4">
              <div
                className="flex justify-center items-center w-8 h-8 rounded-lg shrink-0"
                style={{
                  background: "rgba(97,31,105,0.10)",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#611f69",
                  fontFamily: FONT,
                }}
              >
                4
              </div>
              <div>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    fontFamily: FONT,
                  }}
                >
                  Confirm Bot permissions
                </h3>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--color-text-muted)",
                    marginTop: 4,
                    lineHeight: 1.6,
                    fontFamily: FONT,
                  }}
                >
                  Ensure OAuth & Permissions → Bot Token Scopes includes these
                </p>
              </div>
            </div>
            <div className="ml-11 space-y-4">
              <div
                className="rounded-lg overflow-hidden"
                style={{ border: "1px solid rgba(0,0,0,0.10)" }}
              >
                <div className="px-3.5 py-2.5 bg-surface-2 border-b border-border">
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--color-text-secondary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      fontFamily: FONT,
                    }}
                  >
                    Required Scopes
                  </span>
                </div>
                {REQUIRED_SLACK_SCOPES.map((s, i) => (
                  <div
                    key={s.scope}
                    className="flex items-center gap-3 px-3.5 py-2.5"
                    style={{
                      borderBottom:
                        i < REQUIRED_SLACK_SCOPES.length - 1
                          ? "1px solid rgba(0,0,0,0.10)"
                          : "none",
                    }}
                  >
                    <CheckCircle2 size={12} className="text-success shrink-0" />
                    <code
                      className="px-1.5 py-0.5 rounded"
                      style={{
                        fontSize: 11,
                        fontFamily: MONO,
                        color: "#611f69",
                        background: "rgba(97,31,105,0.08)",
                        fontWeight: 500,
                      }}
                    >
                      {s.scope}
                    </code>
                    <span
                      style={{ fontSize: 11, color: "var(--color-text-muted)", fontFamily: FONT }}
                    >
                      {s.desc}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                className="flex gap-1.5 items-center"
                style={{
                  padding: "0 20px",
                  height: 36,
                  fontSize: 13,
                  fontWeight: 500,
                  fontFamily: FONT,
                  color: "#ffffff",
                  borderRadius: 100,
                  background: "#611f69",
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#4a154b";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#611f69";
                }}
              >
                <Check size={14} />
                Verify & connect
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (manualStep === 0 ? setPhase("oauth") : setManualStep(manualStep - 1))}
          >
            <ArrowLeft size={13} />
            {manualStep === 0 ? "Back to one-click auth" : "Previous"}
          </Button>
          {manualStep < manualSteps.length - 1 && (
            <Button
              onClick={() => setManualStep(manualStep + 1)}
              className="flex gap-1.5 items-center"
              style={{
                padding: "0 16px",
                height: 36,
                fontSize: 12,
                fontWeight: 500,
                fontFamily: FONT,
                color: "#ffffff",
                borderRadius: 100,
                background: "#611f69",
                border: "none",
                cursor: "pointer",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#4a154b";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#611f69";
              }}
            >
              Next
              <ChevronRight size={13} />
            </Button>
          )}
        </div>

        <Alert className="mt-5" style={{ fontFamily: FONT }}>
          <BookOpen size={14} aria-hidden="true" style={{ color: "#611f69" }} />
          <AlertDescription style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
            <p>
              Need help? See{" "}
              <a
                href="https://api.slack.com/authentication/basics"
                target="_blank"
                rel="noreferrer"
                className="font-medium"
                style={{ color: "#611f69", textDecoration: "none" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = "none";
                }}
              >
                Slack API docs
              </a>
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="card p-8 text-center">
        <div
          className="flex justify-center items-center w-14 h-14 rounded-lg mx-auto mb-5"
          style={{ background: "rgba(52,110,88,0.10)" }}
        >
          <CheckCircle2 size={28} className="text-success" />
        </div>
        <h3
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: "var(--color-text-primary)",
            fontFamily: FONT,
            marginBottom: 4,
          }}
        >
          Slack connected!
        </h3>
        <p
          style={{
            fontSize: 13,
            color: "var(--color-text-muted)",
            marginBottom: 24,
            lineHeight: 1.6,
            maxWidth: 320,
            marginLeft: "auto",
            marginRight: "auto",
            fontFamily: FONT,
          }}
        >
          nexu Bot has joined your workspace. Teammates can join with zero config.
        </p>

        <div className="space-y-2.5 text-left max-w-[300px] mx-auto mb-6">
          <div
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: "var(--color-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontFamily: FONT,
            }}
          >
            Next steps
          </div>
          {[
            { step: "1", text: "Find nexu Bot in Slack" },
            { step: "2", text: "DM any message" },
            { step: "3", text: "Bot remembers your preferences" },
          ].map((s) => (
            <div key={s.step} className="flex gap-2.5 items-center">
              <div
                className="flex justify-center items-center w-5 h-5 rounded-full shrink-0"
                style={{
                  background: "rgba(61,185,206,0.10)",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "var(--color-brand-primary)",
                  fontFamily: FONT,
                }}
              >
                {s.step}
              </div>
              <span
                style={{ fontSize: 12, color: "var(--color-text-secondary)", fontFamily: FONT }}
              >
                {s.text}
              </span>
            </div>
          ))}
        </div>

        <Alert variant="success" className="p-3 text-left">
          <Zap size={12} aria-hidden="true" style={{ color: "var(--color-brand-primary)" }} />
          <AlertDescription
            style={{ fontSize: 11, color: "var(--color-text-muted)", fontFamily: FONT }}
          >
            <p>
              <span className="font-medium" style={{ color: "var(--color-text-secondary)" }}>
                Share with teammates:
              </span>{" "}
              When they sign up for nexu, Slack connects automatically — no re-auth needed.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

export default function ChannelsPage() {
  usePageTitle("Settings");
  const [forceGuide, setForceGuide] = useState(false);
  const [entered, setEntered] = useState(false);

  const currentConfig = getPlatformConfig("slack");
  const showGuide = !currentConfig.configured || forceGuide;

  return (
    <div
      className="min-h-screen bg-surface-0 animate-page-enter"
      style={{
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(8px)",
        transition: `opacity 0.3s ${NEXU_EASE}, transform 0.3s ${NEXU_EASE}`,
      }}
      ref={(el) => {
        if (el && !entered) requestAnimationFrame(() => setEntered(true));
      }}
    >
      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="flex items-center gap-3">
          {currentConfig.configured && forceGuide && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setForceGuide(false)}
              className="size-8"
            >
              <ArrowLeft size={16} />
            </Button>
          )}
          <h1 className="heading-page">Slack configuration</h1>
        </div>

        <p className="heading-page-desc mb-6">Manage nexu connection to your Slack workspace</p>

        {showGuide ? (
          <SlackOAuthView />
        ) : (
          <ConfiguredView onShowGuide={() => setForceGuide(true)} />
        )}
      </div>
    </div>
  );
}
