import { Badge, Button } from "@nexu-design/ui-web";
import {
  ArrowRight,
  BarChart3,
  Blocks,
  Briefcase,
  Check,
  ChevronDown,
  Clock,
  Cloud,
  Database,
  FileText,
  FolderOpen,
  Globe as GlobeIcon,
  MessageSquare,
  PenTool,
  Rocket,
  Sparkles,
  Terminal,
  Users,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CursorEffect from "../../components/CursorEffect";
import SlackDemo, { DEMO_SCENARIOS } from "../../components/SlackDemo";
import { usePageTitle } from "../../hooks/usePageTitle";
import { TOOL_TAG_LABELS } from "./skillData";

/* ------------------------------------------------------------------ */
/*  IM platform icons                                                  */
/* ------------------------------------------------------------------ */

function SlackIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"
        fill="#E01E5A"
      />
      <path
        d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.527 2.527 0 0 1 2.521 2.521 2.527 2.527 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"
        fill="#36C5F0"
      />
      <path
        d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.27 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.163 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"
        fill="#2EB67D"
      />
      <path
        d="M15.163 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.163 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.27a2.527 2.527 0 0 1-2.52-2.523 2.527 2.527 0 0 1 2.52-2.52h6.315A2.528 2.528 0 0 1 24 15.163a2.528 2.528 0 0 1-2.522 2.523h-6.315z"
        fill="#ECB22E"
      />
    </svg>
  );
}

function GmailIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#EA4335"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
    </svg>
  );
}

function GCalIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#4285F4"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M18.316 5.684H24v12.632h-5.684V5.684zM5.684 24h12.632v-5.684H5.684V24zM18.316 5.684V0H1.895A1.894 1.894 0 0 0 0 1.895v16.421h5.684V5.684h12.632zm-7.207 6.25v-.065c.272-.144.5-.349.687-.617s.279-.595.279-.982c0-.379-.099-.72-.3-1.025a2.05 2.05 0 0 0-.832-.714 2.703 2.703 0 0 0-1.197-.257c-.6 0-1.094.156-1.481.467-.386.311-.65.671-.793 1.078l1.085.452c.086-.249.224-.461.413-.633.189-.172.445-.257.767-.257.33 0 .602.088.816.264a.86.86 0 0 1 .322.703c0 .33-.12.589-.36.778-.24.19-.535.284-.886.284h-.567v1.085h.633c.407 0 .748.109 1.02.327.272.218.407.499.407.843 0 .336-.129.614-.387.832s-.565.327-.924.327c-.351 0-.651-.103-.897-.311-.248-.208-.422-.502-.521-.881l-1.096.452c.178.616.505 1.082.977 1.401.472.319.984.478 1.538.477a2.84 2.84 0 0 0 1.293-.291c.382-.193.684-.458.902-.794.218-.336.327-.72.327-1.149 0-.429-.115-.797-.344-1.105a2.067 2.067 0 0 0-.881-.689zm2.093-1.931l.602.913L15 10.045v5.744h1.187V8.446h-.827l-2.158 1.557zM22.105 0h-3.289v5.184H24V1.895A1.894 1.894 0 0 0 22.105 0zm-3.289 23.5l4.684-4.684h-4.684V23.5zM0 22.105C0 23.152.848 24 1.895 24h3.289v-5.184H0v3.289z" />
    </svg>
  );
}

function GDriveIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#0F9D58"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12.01 1.485c-2.082 0-3.754.02-3.743.047.01.02 1.708 3.001 3.774 6.62l3.76 6.574h3.76c2.081 0 3.753-.02 3.742-.047-.005-.02-1.708-3.001-3.775-6.62l-3.76-6.574zm-4.76 1.73a789.828 789.861 0 0 0-3.63 6.319L0 15.868l1.89 3.298 1.885 3.297 3.62-6.335 3.618-6.33-1.88-3.287C8.1 4.704 7.255 3.22 7.25 3.214zm2.259 12.653-.203.348c-.114.198-.96 1.672-1.88 3.287a423.93 423.948 0 0 1-1.698 2.97c-.01.026 3.24.042 7.222.042h7.244l1.796-3.157c.992-1.734 1.85-3.23 1.906-3.323l.104-.167h-7.249z" />
    </svg>
  );
}

function GDocsIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#4285F4"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M14.727 6.727H14V0H4.91c-.905 0-1.637.732-1.637 1.636v20.728c0 .904.732 1.636 1.636 1.636h14.182c.904 0 1.636-.732 1.636-1.636V6.727h-6zm-.545 10.455H7.09v-1.364h7.09v1.364zm2.727-3.273H7.091v-1.364h9.818v1.364zm0-3.273H7.091V9.273h9.818v1.363zM14.727 6h6l-6-6v6z" />
    </svg>
  );
}

function GSheetsIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#0F9D58"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M11.318 12.545H7.91v-1.909h3.41v1.91zM14.728 0v6h6l-6-6zm1.363 10.636h-3.41v1.91h3.41v-1.91zm0 3.273h-3.41v1.91h3.41v-1.91zM20.727 6.5v15.864c0 .904-.732 1.636-1.636 1.636H4.909a1.636 1.636 0 0 1-1.636-1.636V1.636C3.273.732 4.005 0 4.909 0h9.318v6.5h6.5zm-3.273 2.773H6.545v7.909h10.91v-7.91zm-6.136 4.636H7.91v1.91h3.41v-1.91z" />
    </svg>
  );
}

function GMeetIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#00897B"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5.53 2.13 0 7.75h5.53zm.398 0v5.62h7.608v3.65l5.47-4.45c-.014-1.22.031-2.25-.025-3.46-.148-1.09-1.287-1.47-2.236-1.36zM23.1 4.32c-.802.295-1.358.995-2.047 1.49-2.506 2.05-4.982 4.12-7.468 6.19 3.025 2.59 6.04 5.18 9.065 7.76 1.218.671 1.428-.814 1.328-1.64v-13a.828.828 0 0 0-.877-.825zM.038 8.15v7.7h5.53v-7.7zm13.577 8.1H6.008v5.62c3.864-.006 7.737.011 11.58-.009 1.02-.07 1.618-1.12 1.468-2.07v-2.51l-5.47-4.68v3.65zm-13.577 0c.02 1.44-.041 2.88.033 4.31.162.948 1.158 1.43 2.047 1.31h3.464v-5.62z" />
    </svg>
  );
}

/** Slack invite URL for official nexu experience group */
const SLACK_EXPERIENCE_GROUP_URL =
  "https://join.slack.com/t/nexu-ixl1131/shared_invite/zt-3ridrx1sn-Cbu6IFNcdjKq4c1p27ZGUw";

/* ------------------------------------------------------------------ */
/*  Nav Skills Dropdown                                                */
/* ------------------------------------------------------------------ */

const SKILL_TAG_ICONS: Record<string, typeof Sparkles> = {
  "office-collab": Briefcase,
  "file-knowledge": FolderOpen,
  "creative-design": PenTool,
  "biz-analysis": BarChart3,
  "av-generation": Zap,
  "info-content": GlobeIcon,
  "dev-tools": Database,
};

function NavSkillsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const tags = Object.entries(TOOL_TAG_LABELS);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 transition-colors cursor-pointer ${
          open ? "text-text-primary" : "hover:text-text-primary"
        }`}
      >
        Skills
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-64 rounded-lg border border-border/60 bg-surface-0 shadow-[var(--shadow-dropdown)] shadow-black/10 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="p-1.5">
            <Link
              to="/openclaw/skills"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-accent/5 transition-colors group"
            >
              <div className="w-8 h-8 rounded-[12px] bg-white border border-border flex items-center justify-center shrink-0 group-hover:bg-accent/10 transition-colors">
                <Sparkles size={15} className="text-accent" />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-text-primary group-hover:text-accent transition-colors">
                  All Skills
                </div>
                <div className="text-[11px] text-text-muted">Browse all available skills</div>
              </div>
            </Link>
            <div className="mx-3 my-1 border-t border-border/40" />
            {tags.map(([id, label]) => {
              const Icon = SKILL_TAG_ICONS[id] ?? Sparkles;
              return (
                <Link
                  key={id}
                  to={`/openclaw/skills?tag=${id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-surface-2 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-[12px] bg-white border border-border flex items-center justify-center shrink-0 group-hover:bg-accent/10 transition-colors">
                    <Icon
                      size={14}
                      className="text-text-muted group-hover:text-accent transition-colors"
                    />
                  </div>
                  <span className="text-[12px] font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center py-4 w-full text-left cursor-pointer"
      >
        <span className="text-sm font-medium text-text-primary">{q}</span>
        <ChevronDown
          size={16}
          className={`text-text-tertiary shrink-0 ml-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="pb-4 text-sm leading-relaxed text-text-secondary">{a}</div>}
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
  badge,
}: {
  icon: typeof Terminal;
  title: string;
  desc: string;
  badge?: string;
}) {
  return (
    <div className="card p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex justify-center items-center w-10 h-10 rounded-[12px] bg-white border border-border">
          <Icon size={20} className="text-accent" />
        </div>
        {badge && (
          <Badge variant="brand" size="sm">
            {badge}
          </Badge>
        )}
      </div>
      <div className="text-[14px] font-semibold text-text-primary mb-2">{title}</div>
      <div className="text-[13px] text-text-muted leading-relaxed">{desc}</div>
    </div>
  );
}

/* SlackDemo, DEMO_SCENARIOS, ScenarioTabs imported from ../../components/SlackDemo */

/* ------------------------------------------------------------------ */
/*  Main Landing                                                       */
/* ------------------------------------------------------------------ */

export default function OpenClawLanding() {
  usePageTitle("Your Digital Coworker");
  const navigate = useNavigate();
  const [activeDemo, setActiveDemo] = useState("coding");
  const goToAuth = () => navigate("/openclaw/auth");

  return (
    <div className="min-h-full bg-surface-0 relative">
      <CursorEffect mode="trail" />

      {/* ── Nav ──────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b backdrop-blur-md border-border bg-surface-0/85">
        <div className="flex justify-between items-center px-6 mx-auto max-w-5xl h-14">
          <div className="flex items-center gap-2">
            <img
              src="/brand/nexu logo-black4.svg"
              alt="nexu"
              className="h-6 w-auto object-contain"
            />
          </div>
          <div className="flex items-center gap-6 text-[13px] text-text-tertiary">
            <div className="hidden sm:flex items-center gap-6">
              <NavSkillsDropdown />
              <a href="#scenarios" className="transition-colors hover:text-text-primary">
                Demos
              </a>
              <a href="#features" className="transition-colors hover:text-text-primary">
                Why nexu
              </a>
              <a href="#vs-openclaw" className="transition-colors hover:text-text-primary">
                VS OpenClaw
              </a>
              <a href="#how" className="transition-colors hover:text-text-primary">
                How it works
              </a>
              <a href="#faq" className="transition-colors hover:text-text-primary">
                FAQ
              </a>
            </div>
            <Button onClick={goToAuth} size="sm">
              Get started free <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--color-accent-rgb,99,102,241),0.06)_0%,transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="relative px-6 pt-16 pb-12 sm:pt-24 sm:pb-20 mx-auto max-w-4xl text-center">
          <Badge variant="outline" size="lg" className="mb-6 font-semibold">
            <Zap size={14} className="text-text-primary" />
            Free during beta
          </Badge>
          <h1 className="text-[28px] sm:text-[42px] font-bold text-text-primary mb-6 leading-[1.15] tracking-tight">
            The simplest OpenClaw🦞 for teams
            <br className="hidden sm:inline" />
            <span className="text-accent">Deploy in 1 min. Zero data loss.</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-text-tertiary">
            The simplest OpenClaw in IM—deploy in 1 minute, no YAML, no setup.
            <br className="hidden sm:inline" />
            100% office tools & skills built-in, 24/7 next to you in Slack, Discord & Telegram.
            Always on, always learning.
          </p>

          {/* Capability pills */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {[
              { icon: Rocket, label: "Deploy in 1 min" },
              { icon: Cloud, label: "100% office tools & skills built-in" },
              { icon: Users, label: "Zero data loss" },
              { icon: Clock, label: "Always on, 24/7" },
            ].map((cap) => (
              <Badge
                key={cap.label}
                variant="outline"
                size="lg"
                className="text-[13px] font-medium hover:border-border-hover transition-colors"
              >
                <cap.icon size={14} />
                {cap.label}
              </Badge>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center mx-auto mb-6 max-w-md">
            <Button onClick={goToAuth} size="lg">
              Get started free <ArrowRight size={14} />
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href={SLACK_EXPERIENCE_GROUP_URL} target="_blank" rel="noopener noreferrer">
                <SlackIcon size={16} />
                Join Slack Group
              </a>
            </Button>
          </div>
          <div className="flex items-center justify-center text-[13px] text-text-muted">
            <span>Try nexu in our official Slack community. Free to get started.</span>
          </div>
        </div>
      </section>

      {/* ── Slack + Google Workspace ───────────────────────────── */}
      <section className="px-6 py-12 sm:py-16 mx-auto max-w-3xl text-center">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary mb-3">
          Works where your team already works
        </h2>
        <p className="text-sm text-text-tertiary leading-relaxed mb-10">
          One AI in Slack, integrated with Google Workspace—Gmail, Calendar, Drive, Docs, Sheets,
          Meet and more.
        </p>
        <div className="flex flex-col items-center gap-0 mb-6">
          {/* Slack on top */}
          <div className="flex flex-col items-center gap-2 py-3 rounded-lg bg-surface-1 transition-colors">
            <SlackIcon size={28} />
            <span className="text-[12px] font-medium text-text-secondary">Slack</span>
          </div>
          {/* Connector line: Slack → products */}
          <div className="flex justify-center">
            <div className="h-8 w-0 border-l border-dashed border-border" />
          </div>
          {/* Connected products below */}
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { name: "Gmail", icon: GmailIcon },
              { name: "Calendar", icon: GCalIcon },
              { name: "Drive", icon: GDriveIcon },
              { name: "Docs", icon: GDocsIcon },
              { name: "Sheets", icon: GSheetsIcon },
              { name: "Meet", icon: GMeetIcon },
            ].map((p) => (
              <div
                key={p.name}
                className="flex flex-col items-center gap-2 w-16 py-3 rounded-lg border border-border bg-surface-1 hover:border-border-hover transition-colors"
              >
                <p.icon size={24} />
                <span className="text-[11px] font-medium text-text-secondary">{p.name}</span>
              </div>
            ))}
            <div className="flex flex-col items-center gap-2 w-16 py-3 rounded-lg border border-border bg-surface-1 hover:border-border-hover transition-colors">
              <img src="/notion-icon.png" alt="Notion" className="w-6 h-6 object-contain" />
              <span className="text-[11px] font-medium text-text-secondary">Notion</span>
            </div>
          </div>
        </div>
        <p className="text-[12px] text-text-muted">
          Add nexu to Slack — connects to your Google Workspace and Notion in one click.
        </p>
      </section>

      {/* ── Demo section (tabbed) ────────────────────────────── */}
      <section id="scenarios" className="px-6 py-12 sm:py-16 mx-auto max-w-5xl">
        <div className="flex gap-2 justify-center mb-8 overflow-x-auto no-scrollbar">
          {DEMO_SCENARIOS.map((s) => (
            <Button
              key={s.key}
              variant={activeDemo === s.key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveDemo(s.key)}
              className="shrink-0"
            >
              <s.icon size={14} />
              {s.label}
            </Button>
          ))}
        </div>

        <div className="mx-auto max-w-4xl">
          <SlackDemo scenarioKey={activeDemo} />
          <div className="text-center mt-4 text-[12px] text-text-muted">
            The simplest OpenClaw — in Slack, Discord & Telegram. Always on, always learning.
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section id="features" className="px-6 py-12 sm:py-24 mx-auto max-w-4xl">
        <div className="mb-14 text-center">
          <div className="text-[11px] font-semibold text-accent mb-3 tracking-widest uppercase">
            Why nexu
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary">
            The simplest OpenClaw. Built for your team.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-text-tertiary">
            The simplest OpenClaw — ready in under a minute, with persistent memory and every tool
            your team needs. Always on in Slack, Discord & Telegram.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FeatureCard
            icon={Rocket}
            title="Deploy in 1 min"
            desc="No YAML, no config. Add nexu to your team chat and start working together right away."
          />
          <FeatureCard
            icon={Cloud}
            title="100% office tools & skills built-in"
            desc="Build, analyze, automate — right from chat. No integrations to wire up, no plugins to install."
          />
          <FeatureCard
            icon={Users}
            title="Zero data loss"
            desc="nexu remembers your conversations, preferences, and context. The more you use it, the sharper it gets."
          />
          <FeatureCard
            icon={Clock}
            title="Always on, 24/7"
            desc="Fully hosted — no server to manage. Your AI is there whenever your team is."
          />
        </div>
      </section>

      <div className="px-6 mx-auto max-w-4xl">
        <div className="border-t border-border" />
      </div>

      {/* ── VS OpenClaw ──────────────────────────────────────── */}
      <section id="vs-openclaw" className="px-6 py-12 sm:py-24 mx-auto max-w-4xl">
        <div className="mb-14 text-center">
          <div className="text-[11px] font-semibold text-accent mb-3 tracking-widest uppercase">
            Compare
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary">
            How nexu stacks up
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-text-tertiary">
            Compared to self-hosting OpenClaw and other hosted options.
          </p>
        </div>
        <div className="overflow-x-auto rounded-lg border border-border bg-surface-1">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-4 font-semibold text-text-primary">Feature</th>
                <th className="px-5 py-4 font-semibold text-accent">nexu</th>
                <th className="px-5 py-4 font-semibold text-text-secondary">
                  OpenClaw (Self-Hosted)
                </th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr className="border-b border-border">
                <td className="px-5 py-3 font-medium text-text-primary">Setup / Deploy</td>
                <td className="px-5 py-3">Under 1 minute, no code needed</td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <X size={14} className="text-[var(--color-danger)] shrink-0" /> {">"}24 h (YAML
                    / env / keys)
                  </span>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-5 py-3 font-medium text-text-primary">Data & memory</td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <Check size={14} className="text-[var(--color-success)] shrink-0" /> Persistent
                    — zero data loss, learns your team
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <X size={14} className="text-[var(--color-danger)] shrink-0" /> Session
                    stateless, no persistent learning
                  </span>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-5 py-3 font-medium text-text-primary">Tools & skills</td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <Check size={14} className="text-[var(--color-success)] shrink-0" /> 1,000+
                    built in, out of the box
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <X size={14} className="text-[var(--color-danger)] shrink-0" /> You build or
                    plug in integrations
                  </span>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-5 py-3 font-medium text-text-primary">IM platforms</td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <Check size={14} className="text-[var(--color-success)] shrink-0" /> Slack,
                    Discord, Telegram
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <X size={14} className="text-[var(--color-danger)] shrink-0" /> You build
                    integrations
                  </span>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-5 py-3 font-medium text-text-primary">Hosting</td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <Check size={14} className="text-[var(--color-success)] shrink-0" /> Fully
                    hosted, 24/7
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <X size={14} className="text-[var(--color-danger)] shrink-0" /> Self-hosted,
                    uptime depends on you
                  </span>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-5 py-3 font-medium text-text-primary">Updates</td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <Check size={14} className="text-[var(--color-success)] shrink-0" /> Automatic
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <X size={14} className="text-[var(--color-danger)] shrink-0" /> Manual pull /
                    upgrade
                  </span>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-5 py-3 font-medium text-text-primary">Team context</td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <Check size={14} className="text-[var(--color-success)] shrink-0" /> Multi-user,
                    cross-channel awareness
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <X size={14} className="text-[var(--color-danger)] shrink-0" /> Mostly
                    single-session
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-center text-[13px] text-text-muted">
          The simplest OpenClaw. Ready in under a minute, with persistent memory and 1,000+ tools —
          always on in Slack, Discord & Telegram.
        </p>
      </section>

      <div className="px-6 mx-auto max-w-4xl">
        <div className="border-t border-border" />
      </div>

      {/* ── How it works ─────────────────────────────────────── */}
      <section id="how" className="px-6 py-12 sm:py-24 mx-auto max-w-4xl">
        <div className="mb-14 text-center">
          <div className="text-[11px] font-semibold text-accent mb-3 tracking-widest uppercase">
            How it works
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary">
            Get Your OpenClaw in 3 Quick Steps
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-text-tertiary">
            Add nexu to your team chat and start working together in minutes.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {[
            {
              step: "01",
              title: "Add to team chat",
              desc: "Connect Slack, Discord, or Telegram. Your AI joins the channel in under a minute.",
              icon: Blocks,
            },
            {
              step: "02",
              title: "Say what you need",
              desc: "Just describe the task in chat — no code, no config. nexu handles the rest.",
              icon: MessageSquare,
            },
            {
              step: "03",
              title: "24/7 next to you",
              desc: "Your AI runs with persistent memory and 1,000+ built-in tools. Always available, never in the way.",
              icon: Terminal,
            },
          ].map((s, i) => (
            <div key={s.step} className="relative text-center">
              {i < 2 && (
                <div className="hidden sm:block absolute -right-5 top-7 w-10 border-t border-dashed border-border" />
              )}
              <div className="flex justify-center items-center mx-auto mb-5 w-14 h-14 rounded-[12px] bg-white border border-border">
                <s.icon size={24} className="text-accent" />
              </div>
              <div className="mb-2 font-mono text-xs font-semibold text-accent">STEP {s.step}</div>
              <h3 className="text-[15px] font-semibold text-text-primary mb-2">{s.title}</h3>
              <p className="text-sm leading-relaxed text-text-tertiary">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="px-6 mx-auto max-w-4xl">
        <div className="border-t border-border" />
      </div>

      {/* ── Use Cases ────────────────────────────────────────── */}
      <section className="px-6 py-12 sm:py-24 mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <div className="text-[11px] font-semibold text-accent mb-3 tracking-widest uppercase">
            Use cases
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary">
            You chat in your team. nexu gets it done.
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-text-tertiary">
            Startup/remote teams · E-commerce · Creators & multi-group users. Slack, Discord,
            Telegram.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              icon: FileText,
              tag: "Startup / Remote",
              prompt: "Channel or multi-channel daily digest",
              result:
                "Turn hundreds of messages into one structured daily: decisions, progress, todos, risks. Everyone catches up in 30 seconds.",
              time: "Daily",
            },
            {
              icon: BarChart3,
              tag: "E-commerce",
              prompt: "Customer feedback daily",
              result:
                "Turn hundreds of support messages into a daily customer feedback report. See what's working and what's not in 30 seconds.",
              time: "Daily",
            },
            {
              icon: PenTool,
              tag: "Startup / Remote",
              prompt: "Quotes → brand cards",
              result:
                "Auto-detect great quotes and turn them into shareable brand cards. Team thinking becomes external content.",
              time: "Real-time",
            },
            {
              icon: MessageSquare,
              tag: "E-commerce",
              prompt: "24/7 support auto-reply",
              result:
                'Auto-answer FAQs in the group; escalate complex questions to humans. No more repeating "how to use" or "when it ships."',
              time: "24/7",
            },
            {
              icon: Users,
              tag: "Content creator",
              prompt: "Multi-group digest",
              result:
                "One digest across all your groups, ranked by importance. See every group's highlights in 5 minutes—no scrolling.",
              time: "On demand",
            },
            {
              icon: Workflow,
              tag: "Content creator",
              prompt: "Weekly highlights → Newsletter",
              result:
                "Filter a week of group chat into highlights and get a Newsletter draft. 2 hours of manual work → 5 minutes.",
              time: "Weekly",
            },
          ].map((c) => (
            <div
              key={c.prompt}
              className="flex gap-5 items-start p-5 rounded-lg border bg-surface-1 border-border"
            >
              <div className="flex justify-center items-center w-10 h-10 rounded-[12px] shrink-0 bg-white border border-border">
                <c.icon size={18} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex gap-2 items-center mb-1.5">
                  <Badge variant="brand" size="sm">
                    {c.tag}
                  </Badge>
                </div>
                <div className="text-[14px] font-semibold text-text-primary mb-1">{c.prompt}</div>
                <div className="text-[13px] text-text-muted mb-2">{c.result}</div>
                <Badge variant="brand">
                  <Clock size={10} /> {c.time}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="px-6 mx-auto max-w-4xl">
        <div className="border-t border-border" />
      </div>

      {/* ── Numbers ──────────────────────────────────────────── */}
      <section className="px-6 py-12 sm:py-24 mx-auto max-w-4xl">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { num: "24/7", label: "Always on", sub: "Your AI never sleeps" },
            { num: "1,000+", label: "Built-in tools", sub: "No integrations needed" },
            { num: "<1", label: "Minute to get started", sub: "No YAML, no setup" },
            { num: "0", label: "Servers to manage", sub: "Fully hosted, auto-updated" },
          ].map((n) => (
            <div key={n.label}>
              <div className="font-mono text-3xl font-bold tracking-tight text-accent">{n.num}</div>
              <div className="mt-1 text-sm font-medium text-text-primary">{n.label}</div>
              <div className="text-[11px] text-text-muted mt-0.5">{n.sub}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="px-6 mx-auto max-w-4xl">
        <div className="border-t border-border" />
      </div>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section id="faq" className="px-6 py-12 sm:py-24 mx-auto max-w-2xl">
        <div className="mb-14 text-center">
          <div className="text-[11px] font-semibold text-accent mb-3 tracking-widest uppercase">
            FAQ
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary">
            Frequently Asked Questions
          </h2>
        </div>
        <div>
          <FAQItem
            q="What is nexu?"
            a="nexu is the simplest OpenClaw for teams — deploy in under a minute, with persistent memory and 1,000+ built-in tools. Always on in Slack, Discord & Telegram. Zero data loss, always learning."
          />
          <FAQItem
            q="How is nexu different from self-hosting OpenClaw?"
            a="nexu is hosted and ready in under a minute — no YAML, no server. You get persistent memory (OpenClaw sessions are stateless), 1,000+ tools out of the box, automatic updates, and team-level context across channels. See the VS OpenClaw table above for a full comparison."
          />
          <FAQItem
            q="Do I need to know how to code?"
            a="No. Just add nexu to your team chat and describe what you need — no code, no setup. Your AI runs with 1,000+ built-in tools and skills."
          />
          <FAQItem
            q="Which team chat platforms are supported?"
            a="Slack, Discord, and Telegram. Add the bot to your workspace or group — your AI joins in under a minute and is 24/7 next to your team."
          />
          <FAQItem
            q="How does nexu understand my team?"
            a="nexu has persistent memory and learns from everyday work chat. It understands you and your team over time — no repeating yourself. The more you use it, the sharper it gets."
          />
          <FAQItem
            q="Is my data safe?"
            a="Every user's code and data runs in a fully isolated cloud sandbox. We never access or use your data. Enterprise plans include SOC 2 compliance and custom data residency."
          />
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section className="overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--color-accent-rgb,99,102,241),0.05)_0%,transparent_60%)]" />
        <div className="relative px-6 py-12 sm:py-24 mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-text-primary">
            The simplest OpenClaw. Always on, always learning.
          </h2>
          <p className="mb-8 text-base text-text-tertiary">
            Free to get started. Works in Slack, Discord & Telegram.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={goToAuth} size="lg">
              Get started free <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-8 mx-auto max-w-5xl">
          <div className="flex items-center gap-2">
            <img
              src="/brand/nexu logo-black4.svg"
              alt="nexu"
              className="h-5 w-auto object-contain"
            />
            <span className="text-xs text-text-muted">© 2026 Powerformer, Inc.</span>
          </div>
          <div className="flex flex-wrap gap-6 justify-center sm:justify-end text-xs text-text-muted">
            <a href="/openclaw/privacy" className="transition-colors hover:text-text-secondary">
              X / Twitter
            </a>
            <a href="/openclaw/terms" className="transition-colors hover:text-text-secondary">
              Docs
            </a>
            <a href="/openclaw/privacy" className="transition-colors hover:text-text-secondary">
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
