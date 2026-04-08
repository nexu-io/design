import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  DiscordIcon,
  Separator,
  SlackIcon,
  Switch,
  TelegramIcon,
} from "@nexu-design/ui-web";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  Lock,
  RefreshCw,
  Shield,
  Sparkles,
} from "lucide-react";
import { useId, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";
import {
  DEFAULT_AUTHORIZED_TOOLS,
  type OAuthTool,
  SKILL_CATEGORIES,
  type SkillDef,
  findSkillById,
} from "./skillData";

/* ------------------------------------------------------------------ */
/*  FAQ accordion item                                                  */
/* ------------------------------------------------------------------ */

function FAQItem({ q, a }: { q: string; a: string }) {
  const value = useId();

  return (
    <Accordion type="single" collapsible defaultValue={value}>
      <AccordionItem value={value} style={{ borderBottom: "1px solid var(--color-border)" }}>
        <AccordionTrigger
          className="py-4"
          icon={
            <ChevronDown
              size={16}
              className="shrink-0 text-[var(--color-text-tertiary)] transition-transform data-[state=open]:rotate-180"
            />
          }
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "var(--color-text-primary)",
              fontFamily: "Manrope, PingFang SC, sans-serif",
            }}
            className="pr-4"
          >
            {q}
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <div
            style={{
              paddingBottom: 16,
              fontSize: 14,
              color: "var(--color-text-secondary)",
              lineHeight: 1.6,
              fontFamily: "Manrope, PingFang SC, sans-serif",
            }}
          >
            {a}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

/* ------------------------------------------------------------------ */
/*  Related skill card                                                  */
/* ------------------------------------------------------------------ */

function RelatedSkillCard({ skill }: { skill: SkillDef }) {
  const Icon = skill.icon;
  return (
    <Link
      to={`/openclaw/skill/${skill.id}`}
      className="group flex flex-col"
      style={{
        padding: 16,
        borderRadius: 8,
        border: "1px solid var(--color-border)",
        backgroundColor: "var(--color-surface-1)",
        transition: "box-shadow 0.15s ease, border-color 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-card)";
        e.currentTarget.style.borderColor = "rgba(61,185,206,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "var(--color-border)";
      }}
    >
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-border bg-white">
          {skill.logo ? (
            <img
              src={skill.logo}
              alt=""
              className="w-5 h-5 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const fb = e.currentTarget.nextElementSibling as HTMLElement;
                if (fb) fb.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className={skill.logo ? "hidden" : "flex"}
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Icon size={16} style={{ color: "var(--color-text-secondary)" }} />
          </div>
        </div>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--color-text-primary)",
            fontFamily: "Manrope, PingFang SC, sans-serif",
          }}
        >
          {skill.name}
        </span>
      </div>
      <p
        style={{
          fontSize: 12,
          color: "var(--color-text-tertiary)",
          lineHeight: 1.5,
          fontFamily: "Manrope, PingFang SC, sans-serif",
        }}
        className="line-clamp-2"
      >
        {skill.desc}
      </p>
      {skill.tools && skill.tools.length > 0 && (
        <div className="flex gap-1.5 mt-3">
          {skill.tools.map((t) => (
            <span key={t.id} className="tag" style={{ fontSize: 10, padding: "2px 6px" }}>
              {t.provider}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                           */
/* ------------------------------------------------------------------ */

export default function SkillDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const result = findSkillById(id ?? "");
  usePageTitle(result ? result.skill.name : "Skill");

  const [authorizedTools, setAuthorizedTools] = useState<Set<string>>(
    new Set(DEFAULT_AUTHORIZED_TOOLS),
  );
  const [authorizingToolId, setAuthorizingToolId] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<number | null>(null);
  const [skillEnabled, setSkillEnabled] = useState(true);

  if (!result) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: "var(--color-surface-0)",
          fontFamily: "Manrope, PingFang SC, sans-serif",
        }}
      >
        <div
          className="text-center"
          style={{ animation: "nexuPageEnter 0.3s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          <div className="text-6xl mb-4">🔍</div>
          <h1
            style={{ fontSize: 20, fontWeight: 600, color: "var(--color-text-primary)" }}
            className="mb-2"
          >
            Skill not found
          </h1>
          <p style={{ fontSize: 14, color: "var(--color-text-tertiary)" }} className="mb-6">
            This skill does not exist or has been removed.
          </p>
          <Button onClick={() => navigate("/openclaw")} className="rounded-full">
            <ArrowLeft size={14} />
            Back to Skills
          </Button>
        </div>
      </div>
    );
  }

  const { skill, category } = result;
  const Icon = skill.icon;
  const hasTools = !!skill.tools?.length;

  const handleAuthTool = (tool: OAuthTool) => {
    setAuthorizingToolId(tool.id);
    setTimeout(() => {
      setAuthorizedTools((prev) => new Set([...prev, tool.id]));
      setAuthorizingToolId(null);
    }, 2000);
  };

  const handleCopyPrompt = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(idx);
    setTimeout(() => setCopiedPrompt(null), 3000);
  };

  const relatedSkills =
    SKILL_CATEGORIES.find((c) => c.id === category.id)
      ?.skills.filter((s) => s.id !== skill.id)
      .slice(0, 3) ?? [];

  const otherCategorySkills = SKILL_CATEGORIES.filter((c) => c.id !== category.id)
    .flatMap((c) => c.skills)
    .slice(0, 3);

  const allRelated = [...relatedSkills, ...otherCategorySkills].slice(0, 6);

  const goToAuth = () => navigate("/openclaw/auth");

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--color-surface-0)",
        fontFamily: "Manrope, PingFang SC, sans-serif",
        animation: "nexuPageEnter 0.3s cubic-bezier(0.16,1,0.3,1) both",
      }}
    >
      <style>{`
        @keyframes nexuPageEnter {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Header ──────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 flex items-center"
        style={{
          height: 56,
          borderBottom: "1px solid var(--color-border)",
          backgroundColor: "var(--color-surface-0)",
          padding: "0 24px",
        }}
      >
        <div className="flex items-center gap-3 max-w-[800px] w-full mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/openclaw/skills")}
            className="shrink-0 size-8"
          >
            <ArrowLeft size={18} />
          </Button>
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>
            {skill.name}
          </span>
        </div>
      </header>

      {/* ── Content ─────────────────────────────────────────── */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
        {/* ── Skill Info Card ─────────────────────────────────── */}
        <div
          style={{
            backgroundColor: "var(--color-surface-1)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            padding: 24,
            marginBottom: 32,
          }}
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div
                className="flex items-center justify-center shrink-0 overflow-hidden border border-border bg-white"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 12,
                }}
              >
                {skill.logo ? (
                  <img
                    src={skill.logo}
                    alt=""
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const fb = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fb) fb.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={skill.logo ? "hidden" : "flex"}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Icon size={28} style={{ color: "var(--color-text-secondary)" }} />
                </div>
              </div>
              <div>
                <h1
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    margin: 0,
                  }}
                >
                  {skill.name}
                </h1>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 400,
                    color: "var(--color-text-secondary)",
                    margin: "4px 0 0 0",
                    lineHeight: 1.5,
                  }}
                >
                  {skill.longDesc || skill.desc}
                </p>
              </div>
            </div>
            <Switch
              checked={skillEnabled}
              onCheckedChange={() => setSkillEnabled(!skillEnabled)}
              className="shrink-0 w-[44px] h-[24px] [&_[data-slot=switch-thumb]]:size-[20px] [&_[data-slot=switch-thumb]]:data-[state=checked]:translate-x-[20px]"
            />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="tag" style={{ padding: "4px 12px" }}>
              {category.label}
            </span>
            {hasTools && (
              <span className="tag" style={{ padding: "4px 12px" }}>
                OAuth
              </span>
            )}
            {hasTools &&
              skill.tools?.map((t) => (
                <span key={t.id} className="tag" style={{ padding: "4px 12px" }}>
                  {t.provider}
                </span>
              ))}
          </div>

          {/* Quick info row */}
          <div
            className="flex items-center gap-4 mt-4 pt-4"
            style={{ borderTop: "1px solid var(--color-border-subtle)" }}
          >
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Works in</span>
              <div className="flex items-center gap-1.5">
                <SlackIcon size={14} />
                <DiscordIcon size={14} />
                <TelegramIcon size={14} />
              </div>
            </div>
            <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>·</span>
            <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
              Managed by{" "}
              <span style={{ color: "var(--color-brand-primary)", fontWeight: 500 }}>nexu</span>
            </span>
          </div>
        </div>

        {/* ── OAuth Tools Section ───────────────────────────── */}
        {hasTools && (
          <div style={{ marginBottom: 32 }}>
            <h2
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--color-text-primary)",
                marginBottom: 12,
              }}
            >
              Connected Tools
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "var(--color-text-secondary)",
                marginBottom: 16,
                lineHeight: 1.5,
              }}
            >
              We manage OAuth, token refresh, and scopes — you just chat.
            </p>
            <div className="space-y-3">
              {skill.tools?.map((tool) => {
                const isAuthed = authorizedTools.has(tool.id);
                const isAuthing = authorizingToolId === tool.id;
                return (
                  <div
                    key={tool.id}
                    className="flex items-center justify-between"
                    style={{
                      padding: 16,
                      borderRadius: 8,
                      border: "1px solid var(--color-border)",
                      backgroundColor: "var(--color-surface-1)",
                      transition: "border-color 0.15s ease",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex items-center justify-center"
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 12,
                          backgroundColor: "var(--color-surface-2)",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "var(--color-text-tertiary)",
                          }}
                        >
                          {tool.name[0]}
                        </span>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "var(--color-text-primary)",
                          }}
                        >
                          {tool.name}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
                          {tool.provider} · OAuth 2.0
                        </div>
                      </div>
                    </div>
                    {isAuthed ? (
                      <Badge variant="success" size="lg">
                        <Check size={12} /> Connected
                      </Badge>
                    ) : (
                      <Button
                        onClick={() => handleAuthTool(tool)}
                        disabled={isAuthing}
                        className="rounded-full h-9"
                      >
                        {isAuthing ? (
                          <>
                            <div
                              className="animate-spin"
                              style={{
                                width: 12,
                                height: 12,
                                border: "1.5px solid rgba(255,255,255,0.3)",
                                borderTopColor: "var(--color-accent-fg)",
                                borderRadius: "50%",
                              }}
                            />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <ExternalLink size={12} />
                            Connect
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Example Prompts ─────────────────────────────────── */}
        {skill.examples && skill.examples.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--color-text-primary)",
                marginBottom: 12,
              }}
            >
              Try saying
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "var(--color-text-secondary)",
                marginBottom: 16,
                lineHeight: 1.5,
              }}
            >
              Copy the prompts below and send to nexu to try this skill.
            </p>
            <div className="space-y-2">
              {skill.examples.map((ex, i) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => handleCopyPrompt(ex, ex.length)}
                  className="w-full text-left flex items-center gap-3 group cursor-pointer"
                  style={{
                    padding: 14,
                    borderRadius: 8,
                    border: "1px solid var(--color-border)",
                    backgroundColor: "var(--color-surface-1)",
                    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
                    fontFamily: "Manrope, PingFang SC, sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(61,185,206,0.3)";
                    e.currentTarget.style.boxShadow = "var(--shadow-rest)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-border)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      backgroundColor: "var(--color-brand-subtle)",
                    }}
                  >
                    <span
                      style={{ fontSize: 12, fontWeight: 700, color: "var(--color-brand-primary)" }}
                    >
                      {i + 1}
                    </span>
                  </div>
                  <span
                    className="flex-1"
                    style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.5 }}
                  >
                    {ex}
                  </span>
                  <div
                    className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100"
                    style={{ transition: "opacity 0.15s ease" }}
                  >
                    {copiedPrompt === ex.length ? (
                      <span
                        style={{ fontSize: 11, fontWeight: 500, color: "var(--color-success)" }}
                        className="flex items-center gap-1"
                      >
                        <Check size={12} /> Copied
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 500,
                          color: "var(--color-text-tertiary)",
                        }}
                        className="flex items-center gap-1"
                      >
                        <Copy size={12} /> Copy
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Capabilities Grid ───────────────────────────────── */}
        {skill.examples && skill.examples.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--color-text-primary)",
                marginBottom: 16,
              }}
            >
              What you can do with {skill.name}
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {skill.examples.map((example, i) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => handleCopyPrompt(example, example.length)}
                  className="text-left group cursor-pointer"
                  style={{
                    padding: 16,
                    borderRadius: 8,
                    border: "1px solid var(--color-border)",
                    backgroundColor: "var(--color-surface-1)",
                    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
                    fontFamily: "Manrope, PingFang SC, sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(61,185,206,0.3)";
                    e.currentTarget.style.boxShadow = "var(--shadow-card)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-border)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        backgroundColor: "var(--color-brand-subtle)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "var(--color-brand-primary)",
                        }}
                      >
                        {i + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        style={{
                          fontSize: 14,
                          color: "var(--color-text-secondary)",
                          lineHeight: 1.5,
                        }}
                      >
                        {example}
                      </p>
                      <div
                        className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100"
                        style={{ transition: "opacity 0.15s ease" }}
                      >
                        {copiedPrompt === example.length ? (
                          <span
                            style={{ fontSize: 11, color: "var(--color-success)", fontWeight: 500 }}
                            className="flex items-center gap-1"
                          >
                            <Check size={10} /> Copied
                          </span>
                        ) : (
                          <span
                            style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}
                            className="flex items-center gap-1"
                          >
                            <Copy size={10} /> Click to copy
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-8" />

        {/* ── IM Integrations ──────────────────────────────────── */}
        <div style={{ marginBottom: 32 }}>
          <h2
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--color-text-primary)",
              marginBottom: 4,
            }}
          >
            Use {skill.name} in any team chat
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "var(--color-text-secondary)",
              marginBottom: 16,
              lineHeight: 1.5,
            }}
          >
            nexu lives where your team already works. No new app to install.
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              {
                name: "Slack",
                icon: SlackIcon,
                desc: "Add nexu to your Slack workspace",
                bg: "rgba(74,21,75,0.04)",
              },
              {
                name: "Discord",
                icon: DiscordIcon,
                desc: "Invite nexu to your Discord server",
                bg: "rgba(88,101,242,0.04)",
              },
              {
                name: "Telegram",
                icon: TelegramIcon,
                desc: "Add nexu bot to your Telegram group",
                bg: "rgba(38,165,228,0.04)",
              },
            ].map((platform) => (
              <div
                key={platform.name}
                style={{
                  padding: 16,
                  borderRadius: 8,
                  border: "1px solid var(--color-border)",
                  backgroundColor: platform.bg,
                  transition: "border-color 0.15s ease",
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <platform.icon size={20} />
                  <span
                    style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}
                  >
                    {platform.name}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", lineHeight: 1.5 }}>
                  {platform.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        {/* ── Why nexu ────────────────────────────────────────── */}
        <div style={{ marginBottom: 32 }}>
          <h2
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--color-text-primary)",
              marginBottom: 16,
            }}
          >
            Why use {skill.name} with nexu?
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                icon: Sparkles,
                title: "AI-Native Integration",
                desc: `${skill.name} is deeply integrated with nexu's AI engine — structured schemas, smart error handling, and LLM-optimized responses.`,
              },
              {
                icon: Lock,
                title: "Managed Auth",
                desc: "Built-in OAuth handling with automatic token refresh and rotation. Per-user credentials, never hard-coded keys.",
              },
              {
                icon: RefreshCw,
                title: "Agent-Optimized",
                desc: "Tools are tuned using real error and success rates to improve reliability over time. Comprehensive execution logs.",
              },
              {
                icon: Shield,
                title: "Enterprise-Grade Security",
                desc: "Fine-grained RBAC, scoped least-privilege access, full audit trail. SOC 2 compliance for enterprise plans.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: "var(--color-brand-subtle)",
                  }}
                >
                  <item.icon size={18} style={{ color: "var(--color-brand-primary)" }} />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--color-text-primary)",
                      marginBottom: 4,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        {/* ── Related Skills ───────────────────────────────────── */}
        <div style={{ marginBottom: 32 }}>
          <div className="flex items-center justify-between mb-4">
            <h2
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--color-text-primary)",
                margin: 0,
              }}
            >
              Explore other skills
            </h2>
            <Link to="/openclaw/skills" className="text-link">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {allRelated.map((s) => (
              <RelatedSkillCard key={s.id} skill={s} />
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <div style={{ marginBottom: 32 }}>
          <h2
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--color-text-primary)",
              marginBottom: 16,
            }}
          >
            Frequently Asked Questions
          </h2>
          <div>
            {hasTools ? (
              <>
                <FAQItem
                  q={`Do I need my own developer credentials to use ${skill.name}?`}
                  a={`No, you can get started immediately using nexu's built-in ${skill.name} integration. For enterprise, we support custom OAuth credentials.`}
                />
                <FAQItem
                  q="How is my data handled?"
                  a="Every user's data runs in a fully isolated environment. We never access or use your data beyond executing the requested action. Enterprise plans include SOC 2 compliance and custom data residency."
                />
              </>
            ) : (
              <FAQItem
                q={`Does ${skill.name} require any setup?`}
                a={`No setup needed. ${skill.name} is a built-in nexu capability — just start chatting and it works out of the box.`}
              />
            )}
            <FAQItem
              q="Can I use multiple skills together?"
              a="Yes! nexu's skill router enables you to use multiple skills in a single conversation. For example, search the web, summarize the results, and send them via email — all in one flow."
            />
            <FAQItem
              q="Which IM platforms are supported?"
              a="Slack, Discord, and Telegram. Add the nexu bot to your workspace or group — it's ready in under a minute."
            />
            <FAQItem
              q="Is nexu free?"
              a="nexu offers a free tier with 4 base skills + 3 additional skills. Pro ($29/mo) unlocks unlimited skills. Team plans include shared skill configurations."
            />
          </div>
        </div>

        <Separator className="my-8" />

        {/* ── CTA ─────────────────────────────────────────────── */}
        <div className="text-center" style={{ padding: "16px 0 40px 0" }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "var(--color-text-primary)",
              marginBottom: 8,
            }}
          >
            Start using {skill.name} in your team chat
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "var(--color-text-tertiary)",
              marginBottom: 20,
              maxWidth: 480,
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.5,
            }}
          >
            Deploy in 3 sentences — no code, no setup. Your AI coworker with memory, a cloud
            computer & 1000+ tools, 24/7 next to your team.
          </p>
          <Button onClick={goToAuth} size="lg" className="rounded-full px-7">
            Get started free <ArrowRight size={14} />
          </Button>
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid var(--color-border)" }}>
        <div
          className="flex justify-between items-center"
          style={{ maxWidth: 800, margin: "0 auto", padding: "20px 24px" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center"
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                backgroundColor: "var(--color-brand-primary)",
              }}
            >
              <span style={{ fontSize: 9, fontWeight: 700, color: "var(--color-accent-fg)" }}>
                N
              </span>
            </div>
            <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
              © 2026 Powerformer, Inc.
            </span>
          </div>
          <div className="flex gap-5" style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
            <a
              href="/openclaw"
              style={{
                color: "var(--color-text-tertiary)",
                textDecoration: "none",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-text-secondary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-text-tertiary)";
              }}
            >
              X / Twitter
            </a>
            <a
              href="/openclaw/docs"
              style={{
                color: "var(--color-text-tertiary)",
                textDecoration: "none",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-text-secondary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-text-tertiary)";
              }}
            >
              Docs
            </a>
            <Link
              to="/openclaw/privacy"
              style={{
                color: "var(--color-text-tertiary)",
                textDecoration: "none",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-text-secondary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-text-tertiary)";
              }}
            >
              Privacy Policy
            </Link>
            <Link
              to="/openclaw/terms"
              style={{
                color: "var(--color-text-tertiary)",
                textDecoration: "none",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-text-secondary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-text-tertiary)";
              }}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
