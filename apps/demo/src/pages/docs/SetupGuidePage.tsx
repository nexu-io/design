import { MessageSquare, Wrench } from "lucide-react";
import Callout from "../../components/docs/Callout";
import CodeBlock from "../../components/docs/CodeBlock";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function SetupGuidePage() {
  usePageTitle("Setup Guide");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[20px] font-semibold text-text-primary flex items-center gap-2">
          <Wrench size={18} className="text-text-muted" />
          Setup Guide
        </h1>
        <p className="mt-3 text-[14px] text-text-secondary leading-relaxed max-w-2xl">
          Add nexu to your team chat in under 5 minutes. Pick your platform below and follow the
          steps.
        </p>
      </div>

      <Callout variant="info">
        You need workspace admin permissions to install nexu. If you don't have admin access, ask
        your workspace owner to complete the setup.
      </Callout>

      {/* Slack */}
      <section className="max-w-2xl">
        <h2 className="text-[16px] font-semibold text-text-primary flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <MessageSquare size={14} className="text-purple-600" />
          </div>
          Slack
        </h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-[14px] font-medium text-text-primary">1. Install the nexu app</h3>
            <p className="text-[13px] text-text-tertiary leading-relaxed">
              Go to your Slack workspace settings, navigate to <strong>Apps</strong>, and search for
              "nexu".
            </p>
            <CodeBlock code="# Or install directly via the Slack App Directory URL:\nhttps://slack.com/apps/nexu-ai" />
          </div>

          <div className="space-y-2">
            <h3 className="text-[14px] font-medium text-text-primary">2. Authorize permissions</h3>
            <p className="text-[13px] text-text-tertiary leading-relaxed">
              Grant nexu access to channels, threads, and DMs. nexu only reads messages where it's
              explicitly mentioned.
            </p>
            <CodeBlock
              lang="json"
              filename="Required OAuth scopes"
              code={`{
  "scopes": [
    "channels:read",
    "channels:history",
    "chat:write",
    "users:read",
    "files:read"
  ]
}`}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-[14px] font-medium text-text-primary">3. Invite to a channel</h3>
            <p className="text-[13px] text-text-tertiary leading-relaxed">
              Invite{" "}
              <code className="px-1.5 py-0.5 rounded bg-surface-2 text-[12px] font-mono text-text-primary">
                @nexu
              </code>{" "}
              to any channel where your team works.
            </p>
            <CodeBlock code="/invite @nexu" />
          </div>

          <div className="space-y-2">
            <h3 className="text-[14px] font-medium text-text-primary">4. Verify the connection</h3>
            <p className="text-[13px] text-text-tertiary leading-relaxed">
              Mention nexu to confirm it's active:
            </p>
            <CodeBlock code="@nexu hello — are you there?" />
          </div>

          <Callout variant="tip">
            Start with one channel. Once the team is comfortable, expand to more channels gradually.
          </Callout>
        </div>
      </section>

      {/* Feishu */}
      <section className="max-w-2xl">
        <h2 className="text-[16px] font-semibold text-text-primary flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <MessageSquare size={14} className="text-blue-600" />
          </div>
          Feishu / Lark
        </h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-[14px] font-medium text-text-primary">
              1. Install from App Directory
            </h3>
            <p className="text-[13px] text-text-tertiary leading-relaxed">
              Open <strong>Feishu Admin → App Directory</strong>, search for "nexu" and click
              Install.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-[14px] font-medium text-text-primary">
              2. Configure bot permissions
            </h3>
            <p className="text-[13px] text-text-tertiary leading-relaxed">
              Grant the bot access to target groups. Required permissions:
            </p>
            <CodeBlock
              lang="yaml"
              filename="feishu-bot-config.yaml"
              code={`bot:
  name: nexu
  permissions:
    - im:message:read
    - im:message:send
    - im:chat:readonly
    - contact:user.id:readonly
  event_subscriptions:
    - im.message.receive_v1`}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-[14px] font-medium text-text-primary">
              3. Activate in a group chat
            </h3>
            <p className="text-[13px] text-text-tertiary leading-relaxed">
              Mention{" "}
              <code className="px-1.5 py-0.5 rounded bg-surface-2 text-[12px] font-mono text-text-primary">
                @nexu
              </code>{" "}
              in a group chat to activate.
            </p>
          </div>

          <Callout variant="warning">
            Feishu requires your organization admin to approve third-party bot installations. Allow
            1-2 business days for enterprise approval workflows.
          </Callout>
        </div>
      </section>

      {/* Environment variables */}
      <section className="max-w-2xl">
        <h2 className="text-[16px] font-semibold text-text-primary mb-4">Environment variables</h2>
        <p className="text-[13px] text-text-tertiary leading-relaxed mb-3">
          If you're self-hosting nexu, configure these environment variables:
        </p>
        <CodeBlock
          lang="bash"
          filename=".env"
          code={`# Required
NEXU_API_KEY=your-api-key
LLM_ENDPOINT=https://litellm.powerformer.net/v1
LLM_MODEL=anthropic/claude-sonnet-4

# Slack integration
SLACK_BOT_TOKEN=xoxb-your-token
SLACK_SIGNING_SECRET=your-secret

# Feishu integration (optional)
FEISHU_APP_ID=cli_xxxxx
FEISHU_APP_SECRET=your-secret`}
        />
        <Callout variant="warning">
          Never commit API keys or secrets to version control. Use a secrets manager in production.
        </Callout>
      </section>
    </div>
  );
}
