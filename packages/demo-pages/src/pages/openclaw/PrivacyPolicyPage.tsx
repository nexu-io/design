import { Button, TextLink } from "@nexu-design/ui-web";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function PrivacyPolicyPage() {
  usePageTitle("Privacy Policy");
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-surface-0">
      <nav className="sticky top-0 z-50 border-b backdrop-blur-md border-border bg-surface-0/85">
        <div className="flex justify-between items-center px-6 mx-auto max-w-3xl h-14">
          <Button
            onClick={() => navigate("/openclaw")}
            className="flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-text-primary transition-colors"
          >
            <ArrowLeft size={14} />
            Back to nexu
          </Button>
          <div className="flex items-center gap-2.5">
            <img
              src="/brand/nexu logo-black4.svg"
              alt="nexu"
              className="h-6 w-auto object-contain"
            />
          </div>
        </div>
      </nav>

      <article className="px-6 py-16 mx-auto max-w-3xl prose-legal">
        <h1 className="text-[28px] font-bold text-text-primary mb-2 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-text-muted mb-10">
          Effective Date: February 27, 2026 · Last Updated: February 27, 2026
        </p>

        <p className="mb-6">
          nexu ("we", "our", "us") is committed to protecting your privacy and security. This
          Privacy Policy explains how we collect, use, store, share, and protect your information
          when you use our AI digital clone and office collaboration platform ("Service"). This
          policy complies with <strong>GDPR</strong>, <strong>CCPA/CPRA</strong>, and applicable
          data protection regulations in the jurisdictions where we operate.
        </p>

        <Section title="1. Legal Basis (For EU/UK Users)">
          <p className="mb-3">We process personal data based on:</p>
          <ul>
            <li>
              <strong>Performance of a contract</strong> — to provide and maintain the Service
            </li>
            <li>
              <strong>Compliance with legal obligations</strong> — to meet regulatory requirements
            </li>
            <li>
              <strong>Legitimate interests</strong> — service security, abuse prevention, and
              product improvement
            </li>
            <li>
              <strong>Your consent</strong> — for optional integrations and data processing
              activities
            </li>
          </ul>
        </Section>

        <Section title="2. Information We Collect">
          <h4 className="text-[14px] font-semibold text-text-primary mt-6 mb-3">
            (1) Account Information
          </h4>
          <ul>
            <li>
              <strong>Registration Data</strong>: Name, email address, profile information
              (passwords are encrypted and never stored in plaintext)
            </li>
            <li>
              <strong>Authentication Data</strong>: OAuth tokens from third-party login providers
              (e.g., Google, GitHub)
            </li>
            <li>
              <strong>Organization Data</strong>: Workspace name, team membership, role assignments
            </li>
          </ul>

          <h4 className="text-[14px] font-semibold text-text-primary mt-6 mb-3">
            (2) Clone & Memory Data
          </h4>
          <p className="mb-3">
            nexu creates and maintains a personalized digital clone ("Clone") on your behalf. This
            involves:
          </p>
          <Table
            headers={["Data Type", "Description", "Purpose"]}
            rows={[
              [
                "Identity & Persona",
                "Your preferences, work style, communication patterns",
                "Personalize your Clone's behavior",
              ],
              [
                "Memory",
                "Conversations, decisions, facts, and context you share",
                "Enable your Clone to remember and assist",
              ],
              [
                "Knowledge",
                "Documents, notes, and references you provide",
                "Power your Clone's knowledge base",
              ],
              [
                "Skills",
                "Workflow configurations and automation rules",
                "Enable your Clone to perform tasks",
              ],
              [
                "Contacts",
                "Names and roles of people you interact with",
                "Provide context-aware assistance",
              ],
            ]}
          />
          <p className="mt-3 text-sm font-medium text-accent">
            Your Clone data belongs to you. We store it to provide the Service and do not use it for
            purposes beyond your direct benefit.
          </p>

          <h4 className="text-[14px] font-semibold text-text-primary mt-6 mb-3">
            (3) Instant Messaging (IM) Integration Data
          </h4>
          <p className="mb-3">
            When you connect nexu to messaging platforms (Feishu/Lark, DingTalk, Slack, etc.):
          </p>
          <Table
            headers={["Data Accessed", "Purpose", "Stored"]}
            rows={[
              [
                "Messages sent to your Clone",
                "Process and respond to requests",
                "Yes, as part of Clone memory",
              ],
              [
                "User identity from IM platform",
                "Authenticate and route messages",
                "Minimal metadata only",
              ],
              [
                "Channel/group context",
                "Provide relevant responses",
                "Temporary, cleared after session",
              ],
            ]}
          />
          <p className="mt-3">
            We <strong>only</strong> access messages explicitly directed to your Clone (via @mention
            or direct message). We do <strong>not</strong> monitor or access your private
            conversations, channels you haven't connected, or messages not directed to nexu.
          </p>

          <h4 className="text-[14px] font-semibold text-text-primary mt-6 mb-3">
            (4) AI Interaction Data
          </h4>
          <ul>
            <li>
              <strong>Prompts & Responses</strong>: Your conversations with your Clone
            </li>
            <li>
              <strong>Skill Executions</strong>: Task inputs, outputs, and execution logs
            </li>
            <li>
              <strong>Feedback</strong>: Ratings, corrections, and preference signals you provide
            </li>
          </ul>

          <h4 className="text-[14px] font-semibold text-text-primary mt-6 mb-3">
            (5) Automatically Collected Information
          </h4>
          <ul>
            <li>
              <strong>Usage Data</strong>: Feature usage frequency, session duration, interaction
              patterns
            </li>
            <li>
              <strong>Technical Data</strong>: Device type, OS, browser, IP address, performance
              metrics
            </li>
            <li>
              <strong>Error & Diagnostic Data</strong>: Crash reports, error logs (for reliability,
              not content inspection)
            </li>
          </ul>

          <h4 className="text-[14px] font-semibold text-text-primary mt-6 mb-3">
            (6) Payment Information
          </h4>
          <p>
            Payments are processed by secure third-party processors (e.g., Stripe). We do{" "}
            <strong>not</strong> store complete credit card details. Only transaction references and
            billing history are retained.
          </p>
        </Section>

        <Section title="3. How We Use Your Information">
          <ul>
            <li>
              <strong>Operate the Service</strong>: Maintain your Clone, process interactions,
              execute skills
            </li>
            <li>
              <strong>Personalize Experience</strong>: Improve your Clone's understanding of your
              preferences and context
            </li>
            <li>
              <strong>Memory & Knowledge</strong>: Build and maintain your Clone's persistent memory
              system
            </li>
            <li>
              <strong>Authentication & Security</strong>: Verify identity, prevent abuse, protect
              accounts
            </li>
            <li>
              <strong>Billing & Payments</strong>: Process subscriptions and transactions
            </li>
            <li>
              <strong>Service Improvement</strong>: Analyze aggregated, anonymized usage patterns to
              improve the platform
            </li>
            <li>
              <strong>Communication</strong>: Send service updates, security alerts, and (with
              consent) product announcements
            </li>
            <li>
              <strong>Legal Compliance</strong>: Meet regulatory and legal obligations
            </li>
          </ul>
          <h4 className="text-[14px] font-semibold text-text-primary mt-6 mb-3">
            What We Do NOT Do
          </h4>
          <ul>
            <li>
              We do <strong>not</strong> sell your personal data or Clone data to third parties
            </li>
            <li>
              We do <strong>not</strong> use your Clone data to train general-purpose AI models
            </li>
            <li>
              We do <strong>not</strong> share your Clone's memory or knowledge with other users
              without your explicit consent
            </li>
            <li>
              We do <strong>not</strong> use your data for advertising or profiling for third-party
              marketing
            </li>
          </ul>
        </Section>

        <Section title="4. AI Models & Third-Party Services">
          <h4 className="text-[14px] font-semibold text-text-primary mt-4 mb-3">LLM Processing</h4>
          <p className="mb-3">
            nexu uses large language models (LLMs) to power your Clone's intelligence. When
            processing your requests:
          </p>
          <ul>
            <li>
              Your prompts and relevant context are sent to LLM providers to generate responses
            </li>
            <li>
              We use commercially licensed API endpoints — your data is <strong>not</strong> used to
              train these models
            </li>
            <li>
              We select LLM providers that commit to not training on customer data (e.g., Anthropic
              Claude via API)
            </li>
            <li>
              Temporary processing data is not retained by LLM providers beyond their standard API
              processing window
            </li>
          </ul>
          <h4 className="text-[14px] font-semibold text-text-primary mt-6 mb-3">
            Third-Party Integrations
          </h4>
          <ul>
            <li>Only data necessary for the integration's function is accessed</li>
            <li>Access is governed by the permissions you explicitly grant</li>
            <li>You can revoke access at any time through your nexu settings</li>
            <li>
              Each integration is subject to both this Privacy Policy and the third-party's own
              privacy policy
            </li>
          </ul>
        </Section>

        <Section title="5. Data Sharing">
          <p className="mb-3">We may share your information only in these circumstances:</p>
          <Table
            headers={["Recipient", "What", "Why"]}
            rows={[
              [
                "Service Providers",
                "Technical infrastructure data",
                "Hosting, CDN, monitoring (no Clone content access)",
              ],
              [
                "LLM Providers",
                "Prompts and context for processing",
                "To generate Clone responses (API-only, no training)",
              ],
              ["IM Platforms", "Response messages", "To deliver your Clone's replies"],
              ["Payment Processors", "Billing information", "To process payments securely"],
              ["Legal Authorities", "As required by law", "To comply with valid legal requests"],
              ["With Your Consent", "As you direct", "When you explicitly authorize sharing"],
            ]}
          />
          <p className="mt-3">
            We do <strong>not</strong> sell, rent, or trade your personal data or Clone data.
          </p>
        </Section>

        <Section title="6. Data Storage & Protection">
          <h4 className="text-[14px] font-semibold text-text-primary mt-4 mb-3">Storage</h4>
          <ul>
            <li>
              Data is stored on secure cloud infrastructure in regions compliant with applicable
              data protection laws
            </li>
            <li>Clone data is logically isolated per user — no cross-user data access</li>
          </ul>
          <h4 className="text-[14px] font-semibold text-text-primary mt-6 mb-3">
            Security Measures
          </h4>
          <ul>
            <li>
              <strong>Encryption in Transit</strong>: TLS 1.2+ / HTTPS for all data transmission
            </li>
            <li>
              <strong>Encryption at Rest</strong>: AES-256 encryption for stored data
            </li>
            <li>
              <strong>Access Control</strong>: Least-privilege access, multi-factor authentication
              for internal systems
            </li>
            <li>
              <strong>Audit Logging</strong>: All data access is logged and monitored
            </li>
            <li>
              <strong>Incident Response</strong>: Security incidents are investigated and reported
              within legal timelines
            </li>
          </ul>
          <p className="mt-4">
            For specific data residency requirements, contact us at{" "}
            <TextLink href="mailto:privacy@refly.ai">privacy@refly.ai</TextLink>.
          </p>
        </Section>

        <Section title="7. Data Retention & Deletion">
          <Table
            headers={["Data Type", "Retention", "Deletion"]}
            rows={[
              [
                "Account Data",
                "While account is active",
                "Deleted within 30 days of account closure",
              ],
              [
                "Clone Memory & Knowledge",
                "User-managed",
                "Deleted within 30 days of deletion or account closure",
              ],
              [
                "Conversation History",
                "User-managed",
                "Deleted on user request or account closure",
              ],
              ["Skill Configurations", "While account is active", "Deleted with account"],
              ["Usage & Analytics Data", "Up to 24 months (anonymized)", "Automatically purged"],
              ["Billing Records", "7 years (legal requirement)", "Automatic expiry"],
              ["Error & Diagnostic Logs", "Up to 90 days", "Automatically purged"],
            ]}
          />
          <p className="mt-4">
            You can delete specific memories, knowledge, or conversations from your Clone at any
            time. Request full account and data deletion via settings or by contacting{" "}
            <TextLink href="mailto:privacy@refly.ai">privacy@refly.ai</TextLink>.
          </p>
        </Section>

        <Section title="8. Your Rights">
          <p className="mb-3">Depending on your jurisdiction, you have the right to:</p>
          <ul>
            <li>
              <strong>Access</strong>: Request a copy of the personal data we hold about you
            </li>
            <li>
              <strong>Rectification</strong>: Correct inaccurate or incomplete data
            </li>
            <li>
              <strong>Deletion</strong>: Request deletion of your data ("right to be forgotten")
            </li>
            <li>
              <strong>Restriction</strong>: Restrict processing of your data in certain
              circumstances
            </li>
            <li>
              <strong>Portability</strong>: Receive your data in a structured, machine-readable
              format
            </li>
            <li>
              <strong>Objection</strong>: Object to processing based on legitimate interests
            </li>
            <li>
              <strong>Withdraw Consent</strong>: Withdraw consent at any time for consent-based
              processing
            </li>
            <li>
              <strong>Non-Discrimination</strong>: Exercise your rights without discriminatory
              treatment (CCPA)
            </li>
          </ul>
          <p className="mt-4">
            Contact <TextLink href="mailto:privacy@refly.ai">privacy@refly.ai</TextLink> or use
            in-product settings to exercise your rights. We respond within 30 days.
          </p>
        </Section>

        <Section title="9. International Data Transfers">
          <ul>
            <li>
              We use <strong>Standard Contractual Clauses (SCCs)</strong> approved by the European
              Commission
            </li>
            <li>All transfers are protected by encryption and access controls</li>
            <li>We ensure receiving parties maintain equivalent data protection standards</li>
          </ul>
        </Section>

        <Section title="10. Cookies & Local Storage">
          <Table
            headers={["Type", "Purpose", "Duration"]}
            rows={[
              ["Essential Cookies", "Authentication, session management", "Session"],
              ["Preference Cookies", "Language, theme, UI settings", "Persistent"],
              ["Analytics Cookies", "Usage patterns (anonymized)", "Up to 12 months"],
            ]}
          />
          <p className="mt-3">
            You may disable non-essential cookies via your browser settings. Disabling essential
            cookies may affect Service functionality.
          </p>
        </Section>

        <Section title="11. AI Transparency">
          <ul>
            <li>
              AI-generated content from your Clone is clearly attributable to the Clone (not
              presented as human-generated)
            </li>
            <li>
              Your Clone's behavior is shaped by your data and preferences — you maintain control
            </li>
            <li>We provide visibility into what your Clone knows and how it responds</li>
            <li>You can review, edit, or delete any information your Clone has learned</li>
          </ul>
        </Section>

        <Section title="12. Children's Privacy">
          <p>
            The Service is not directed to children under 16 (or the applicable age of consent in
            your jurisdiction). We do not knowingly collect personal data from children. If we
            discover such data has been collected, it will be deleted promptly.
          </p>
        </Section>

        <Section title="13. California Privacy Rights (CCPA/CPRA)">
          <ul>
            <li>
              <strong>Right to Know</strong>: Categories and specific pieces of personal information
              collected
            </li>
            <li>
              <strong>Right to Delete</strong>: Request deletion of personal information
            </li>
            <li>
              <strong>Right to Opt-Out</strong>: We do not sell personal information; no opt-out is
              necessary
            </li>
            <li>
              <strong>Right to Non-Discrimination</strong>: Equal service regardless of privacy
              choices
            </li>
            <li>
              <strong>Sensitive Personal Information</strong>: We do not use sensitive personal
              information for purposes beyond providing the Service
            </li>
          </ul>
        </Section>

        <Section title="14. Policy Updates">
          <p>
            We may update this Privacy Policy to reflect changes in our practices, technology, legal
            requirements, or other factors. When we make material changes, we will notify you via
            email or in-product notification.
          </p>
        </Section>

        <Section title="15. Contact Us">
          <ul className="list-none pl-0">
            <li>
              <strong>General Privacy</strong>:{" "}
              <TextLink href="mailto:privacy@refly.ai">privacy@refly.ai</TextLink>
            </li>
            <li>
              <strong>Data Protection Officer</strong>:{" "}
              <TextLink href="mailto:dpo@refly.ai">dpo@refly.ai</TextLink>
            </li>
            <li>
              <strong>EU Representative</strong>:{" "}
              <TextLink href="mailto:eu-privacy@refly.ai">eu-privacy@refly.ai</TextLink>
            </li>
          </ul>
          <p className="mt-3">
            We respond to privacy requests within <strong>30 days</strong> and urgent security
            matters within <strong>72 hours</strong>.
          </p>
        </Section>
      </article>

      <footer className="border-t border-border">
        <div className="flex justify-between items-center px-6 py-8 mx-auto max-w-3xl">
          <span className="text-xs text-text-muted">© 2026 Powerformer, Inc.</span>
          <div className="flex gap-6 text-xs text-text-muted">
            <a href="/openclaw/privacy" className="text-text-secondary">
              Privacy Policy
            </a>
            <a href="/openclaw/terms" className="transition-colors hover:text-text-secondary">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-[22px] font-bold text-text-primary mb-4 mt-10 pt-6 border-t border-border">
        {title}
      </h2>
      <div className="text-[14px] text-text-secondary leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:my-3 [&_p]:my-2">
        {children}
      </div>
    </section>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-[13px] border-collapse">
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="text-left py-2 px-3 bg-surface-1 border border-border text-text-primary font-semibold"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join("|")}>
              {row.map((cell) => (
                <td key={cell} className="py-2 px-3 border border-border text-text-secondary">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
