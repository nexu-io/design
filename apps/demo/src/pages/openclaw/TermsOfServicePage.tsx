import { Button } from "@nexu-design/ui-web";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function TermsOfServicePage() {
  usePageTitle("Terms of Service");
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
            <div className="flex justify-center items-center w-7 h-7 rounded-lg bg-accent">
              <span className="text-xs font-bold text-accent-fg">N</span>
            </div>
            <span className="text-sm font-semibold tracking-tight text-text-primary">nexu</span>
          </div>
        </div>
      </nav>

      <article className="px-6 py-16 mx-auto max-w-3xl">
        <h1 className="text-[28px] font-bold text-text-primary mb-2 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-sm text-text-muted mb-10">Effective Date: February 27, 2026</p>

        <p className="text-[14px] text-text-secondary leading-relaxed mb-6">
          Please read these Terms of Service ("Terms") carefully before using the nexu Digital Clone
          Platform (the "Service") operated by nexu ("us", "we", "our", or "Company").
        </p>

        <Section title="1. Acceptance of Terms">
          <p>
            By accessing or using our Service, you agree to be bound by these Terms. If you disagree
            with any part of the Terms, you may not access the Service.
          </p>
        </Section>

        <Section title="2. Changes to Terms">
          <p>
            We reserve the right to modify these Terms at any time. We will notify you of any
            changes by posting the new Terms on this page and updating the "Effective Date" above.
            Your continued use of the Service after such modifications constitutes your acceptance
            of the new Terms.
          </p>
        </Section>

        <Section title="3. Service Description">
          <p className="mb-3">
            nexu is an AI-powered digital clone platform that creates personalized AI agents
            ("Clones") capable of operating autonomously on behalf of users. The Service includes:
          </p>
          <ul>
            <li>
              <strong>Digital Clone Creation</strong>: AI agents that learn your preferences,
              knowledge, and work patterns
            </li>
            <li>
              <strong>Autonomous Task Execution</strong>: Clones can perform tasks, manage
              schedules, and interact with third-party tools on your behalf
            </li>
            <li>
              <strong>Memory & Knowledge System</strong>: Persistent memory that accumulates and
              organizes your knowledge over time
            </li>
            <li>
              <strong>Multi-Channel Access</strong>: Access your Clone via instant messaging
              platforms (Feishu, Slack, DingTalk, etc.), web interface, and API
            </li>
            <li>
              <strong>Skills & Automation</strong>: Customizable skill sets and automated workflows
            </li>
          </ul>
        </Section>

        <Section title="4. Access and Account Terms">
          <h4 className="text-[15px] font-semibold text-text-primary mt-4 mb-3">
            4.1 Account Registration
          </h4>
          <ul>
            <li>You must be at least 18 years old to use this Service</li>
            <li>
              You must provide accurate, current, and complete information during registration
            </li>
            <li>
              You are responsible for maintaining the confidentiality of your account credentials
            </li>
            <li>
              You are responsible for all activities that occur under your account, including
              actions taken by your Clone
            </li>
          </ul>
          <h4 className="text-[15px] font-semibold text-text-primary mt-6 mb-3">
            4.2 Clone Authorization
          </h4>
          <ul>
            <li>
              You are responsible for configuring the permissions and scope of your Clone's actions
            </li>
            <li>Actions performed by your Clone on your behalf are considered your actions</li>
            <li>
              You must review and manage your Clone's access to third-party services and data
              sources
            </li>
            <li>You may revoke your Clone's permissions at any time</li>
          </ul>
          <h4 className="text-[15px] font-semibold text-text-primary mt-6 mb-3">
            4.3 Account Restrictions
          </h4>
          <p className="mb-2">We reserve the right to:</p>
          <ul>
            <li>Suspend or terminate accounts that violate these Terms</li>
            <li>Refuse service to anyone for any reason</li>
            <li>Remove or restrict content generated by Clones</li>
            <li>Modify or cancel subscriptions</li>
          </ul>
        </Section>

        <Section title="5. AI-Generated Content and Clone Actions">
          <h4 className="text-[15px] font-semibold text-text-primary mt-4 mb-3">
            5.1 Content Generation
          </h4>
          <ul>
            <li>
              The Service uses AI models to generate content and perform actions based on your
              inputs and learned preferences
            </li>
            <li>
              We do not guarantee the accuracy, completeness, or appropriateness of AI-generated
              content or Clone actions
            </li>
            <li>You are responsible for reviewing outputs and actions performed by your Clone</li>
            <li>
              Clone outputs may occasionally contain errors, hallucinations, or unintended results
            </li>
          </ul>
          <h4 className="text-[15px] font-semibold text-text-primary mt-6 mb-3">
            5.2 Intellectual Property Rights
          </h4>
          <ul>
            <li>You retain all rights to the input content you provide to the Service</li>
            <li>You own the rights to content created by your Clone on your behalf</li>
            <li>
              We retain rights to our AI models, algorithms, platform infrastructure, and
              improvements derived from aggregated, anonymized service usage data
            </li>
            <li>
              Skill templates and system prompts provided by nexu remain our intellectual property
            </li>
          </ul>
          <h4 className="text-[15px] font-semibold text-text-primary mt-6 mb-3">
            5.3 Knowledge & Memory Data
          </h4>
          <ul>
            <li>Your Clone's memory and knowledge data belong to you</li>
            <li>You may export your Clone's knowledge at any time</li>
            <li>
              We will not use your personal Clone data to train models for other users without your
              explicit consent
            </li>
            <li>Aggregated, anonymized usage patterns may be used to improve the Service</li>
          </ul>
          <h4 className="text-[15px] font-semibold text-text-primary mt-6 mb-3">
            5.4 Usage Restrictions
          </h4>
          <p className="mb-2">You agree not to use the Service to:</p>
          <ul>
            <li>Generate content that infringes on others' intellectual property rights</li>
            <li>Create misleading, fraudulent, or deceptive content</li>
            <li>Impersonate real individuals without their consent</li>
            <li>Generate content that promotes hate speech, discrimination, or violence</li>
            <li>Conduct unauthorized surveillance or data collection</li>
            <li>Circumvent security measures of third-party services</li>
            <li>Create content that violates applicable laws or regulations</li>
            <li>Deploy Clones for spam, phishing, or social engineering attacks</li>
          </ul>
        </Section>

        <Section title="6. Payment Terms">
          <h4 className="text-[15px] font-semibold text-text-primary mt-4 mb-3">
            6.1 Subscription and Fees
          </h4>
          <ul>
            <li>Fees are charged according to our current pricing plans</li>
            <li>All fees are exclusive of applicable taxes unless stated otherwise</li>
            <li>Subscriptions auto-renew unless cancelled before the renewal date</li>
            <li>
              Usage-based charges (API calls, compute, storage) are billed according to your plan
            </li>
          </ul>
          <h4 className="text-[15px] font-semibold text-text-primary mt-6 mb-3">
            6.2 Payment Processing
          </h4>
          <ul>
            <li>Payments are processed through secure third-party payment providers</li>
            <li>You agree to provide accurate and current billing information</li>
            <li>We may suspend service for failed or overdue payments</li>
          </ul>
          <h4 className="text-[15px] font-semibold text-text-primary mt-6 mb-3">
            6.3 Refund Policy
          </h4>
          <ul>
            <li>No refunds for partial subscription periods</li>
            <li>Refund requests for annual plans may be considered within 14 days of purchase</li>
            <li>Usage-based charges are non-refundable</li>
          </ul>
        </Section>

        <Section title="7. User Obligations">
          <p className="mb-2">You agree to:</p>
          <ul>
            <li>Comply with all applicable laws and regulations in your jurisdiction</li>
            <li>Not interfere with or disrupt the Service or its infrastructure</li>
            <li>
              Not attempt to gain unauthorized access to the Service, other accounts, or connected
              systems
            </li>
            <li>Not use the Service for illegal purposes or to facilitate illegal activities</li>
            <li>Not transmit malware, harmful code, or malicious content</li>
            <li>
              Not reverse-engineer, decompile, or attempt to extract the source code of the Service
            </li>
            <li>Not resell or redistribute the Service without authorization</li>
            <li>Properly configure and monitor your Clone's behavior and permissions</li>
          </ul>
        </Section>

        <Section title="8. Third-Party Integrations">
          <h4 className="text-[15px] font-semibold text-text-primary mt-4 mb-3">
            8.1 Connected Services
          </h4>
          <ul>
            <li>
              The Service may integrate with third-party platforms (Feishu, Slack, DingTalk, Linear,
              Notion, etc.)
            </li>
            <li>
              Your use of third-party services is subject to their respective terms of service
            </li>
            <li>
              We are not responsible for the availability, accuracy, or policies of third-party
              services
            </li>
            <li>
              You are responsible for authorizing and managing your Clone's access to third-party
              services
            </li>
          </ul>
          <h4 className="text-[15px] font-semibold text-text-primary mt-6 mb-3">8.2 API Usage</h4>
          <ul>
            <li>API access is subject to rate limits and usage quotas defined by your plan</li>
            <li>You must not use the API in ways that could harm the Service or other users</li>
            <li>API keys are confidential and must not be shared publicly</li>
          </ul>
        </Section>

        <Section title="9. Content Guidelines">
          <h4 className="text-[15px] font-semibold text-text-primary mt-4 mb-3">
            9.1 Prohibited Content
          </h4>
          <p className="mb-2">
            You may not use the Service to generate or distribute content that:
          </p>
          <ul>
            <li>Is illegal or promotes illegal activities</li>
            <li>Infringes on intellectual property rights</li>
            <li>Contains malware or harmful code</li>
            <li>Is discriminatory, hateful, or promotes violence</li>
            <li>Is pornographic or sexually explicit</li>
            <li>Is deceptive, fraudulent, or misleading</li>
            <li>Facilitates harassment, stalking, or bullying</li>
            <li>Violates the privacy of others</li>
          </ul>
          <h4 className="text-[15px] font-semibold text-text-primary mt-6 mb-3">
            9.2 Content Monitoring
          </h4>
          <ul>
            <li>
              We reserve the right to monitor content generated by Clones for safety and compliance
            </li>
            <li>We may restrict or remove content that violates these Terms</li>
            <li>We may report violations to appropriate authorities</li>
            <li>Automated safety filters may be applied to Clone outputs</li>
          </ul>
        </Section>

        <Section title="10. Privacy and Data Protection">
          <p className="mb-3">
            We process personal data as described in our{" "}
            <a href="/openclaw/privacy" className="text-accent hover:underline">
              Privacy Policy
            </a>
            . Key points:
          </p>
          <ul>
            <li>We comply with GDPR, CCPA, PIPL (China), and other applicable privacy laws</li>
            <li>We implement appropriate technical and organizational security measures</li>
            <li>Your Clone's knowledge base is encrypted at rest and in transit</li>
            <li>You are responsible for maintaining the security of your account and API keys</li>
            <li>Upon account deletion, your data will be permanently removed within 30 days</li>
            <li>You may request data export at any time</li>
          </ul>
        </Section>

        <Section title="11. Service Availability and Support">
          <ul>
            <li>We strive for high availability but do not guarantee uninterrupted service</li>
            <li>We may perform scheduled maintenance with reasonable advance notice</li>
            <li>Emergency maintenance may occur without prior notice</li>
            <li>Technical support is provided according to your subscription level</li>
          </ul>
          <p className="mt-3">
            We reserve the right to modify, update, or discontinue features with reasonable notice,
            update AI models, and change pricing with 30 days' advance notice.
          </p>
        </Section>

        <Section title="12. Limitation of Liability">
          <div className="bg-surface-1 border border-border rounded-lg p-4 my-4 text-[13px] text-text-secondary uppercase leading-relaxed">
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
            WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </div>
          <ul>
            <li>
              We are not liable for indirect, incidental, special, consequential, or punitive
              damages
            </li>
            <li>
              We are not liable for any loss or damage arising from Clone actions taken on your
              behalf
            </li>
            <li>
              Our total aggregate liability shall not exceed the amount paid by you for the Service
              in the 12 months preceding the claim
            </li>
            <li>Force majeure events exclude liability</li>
          </ul>
        </Section>

        <Section title="13. Indemnification">
          <p className="mb-3">
            You agree to indemnify and hold harmless nexu and its officers, directors, employees,
            agents, and affiliates from any claims arising from:
          </p>
          <ul>
            <li>Your use of the Service</li>
            <li>Your violation of these Terms</li>
            <li>Content generated by your Clone</li>
            <li>Actions performed by your Clone on your behalf</li>
            <li>Your violation of any third party's rights</li>
            <li>Your violation of applicable laws or regulations</li>
          </ul>
        </Section>

        <Section title="14. Termination">
          <h4 className="text-[15px] font-semibold text-text-primary mt-4 mb-3">By You</h4>
          <p>
            You may terminate your account at any time through the Service settings. You remain
            liable for all charges incurred prior to termination. You may export your Clone's data
            before termination.
          </p>
          <h4 className="text-[15px] font-semibold text-text-primary mt-6 mb-3">By Us</h4>
          <p className="mb-2">We may terminate or suspend your account immediately for:</p>
          <ul>
            <li>Material violation of these Terms</li>
            <li>Illegal activities or facilitation thereof</li>
            <li>Non-payment after reasonable notice</li>
            <li>Extended inactivity (12+ months)</li>
            <li>Actions that harm other users or the Service</li>
          </ul>
          <p className="mt-3">
            Upon termination, we will retain your data for 30 days for export purposes. After the
            retention period, all data will be permanently deleted.
          </p>
        </Section>

        <Section title="15. Governing Law and Dispute Resolution">
          <p className="mb-3">
            These Terms are governed by the laws of the People's Republic of China. Disputes shall
            first be resolved through good-faith negotiation. If negotiation fails, disputes will be
            submitted to the China International Economic and Trade Arbitration Commission (CIETAC)
            for arbitration in Beijing.
          </p>
        </Section>

        <Section title="16. International Use">
          <ul>
            <li>
              The Service is available globally, subject to applicable export controls and sanctions
            </li>
            <li>You are responsible for compliance with local laws in your jurisdiction</li>
            <li>
              Certain features may not be available in all regions due to regulatory requirements
            </li>
          </ul>
        </Section>

        <Section title="17. Open Source Components">
          <p>
            The Service may include open source software components, subject to their respective
            licenses. A list of open source components and their licenses is available upon request.
          </p>
        </Section>

        <Section title="18. Severability & Entire Agreement">
          <p>
            If any provision of these Terms is found to be unenforceable, that provision will be
            limited or eliminated to the minimum extent necessary. These Terms, together with our
            Privacy Policy, constitute the entire agreement between you and nexu regarding the
            Service.
          </p>
        </Section>

        <Section title="19. Contact Information">
          <ul className="list-none pl-0">
            <li>
              <strong>Email</strong>:{" "}
              <a href="mailto:legal@refly.ai" className="text-accent hover:underline">
                legal@refly.ai
              </a>
            </li>
            <li>
              <strong>Support</strong>:{" "}
              <a href="mailto:support@refly.ai" className="text-accent hover:underline">
                support@refly.ai
              </a>
            </li>
            <li>
              <strong>Website</strong>:{" "}
              <a href="https://nexu.ai" className="text-accent hover:underline">
                nexu.ai
              </a>
            </li>
            <li>
              <strong>Business Hours</strong>: Monday to Friday, 9:00 AM – 6:00 PM (UTC+8)
            </li>
          </ul>
        </Section>

        <p className="text-sm text-text-muted mt-10 italic">Last updated: February 27, 2026</p>
      </article>

      <footer className="border-t border-border">
        <div className="flex justify-between items-center px-6 py-8 mx-auto max-w-3xl">
          <span className="text-xs text-text-muted">© 2026 Powerformer, Inc.</span>
          <div className="flex gap-6 text-xs text-text-muted">
            <a href="/openclaw/privacy" className="transition-colors hover:text-text-secondary">
              Privacy Policy
            </a>
            <a href="/openclaw/terms" className="text-text-secondary">
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
      <h2 className="text-[18px] font-bold text-text-primary mb-4 mt-10 pt-6 border-t border-border">
        {title}
      </h2>
      <div className="text-[14px] text-text-secondary leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:my-3 [&_p]:my-2">
        {children}
      </div>
    </section>
  );
}
