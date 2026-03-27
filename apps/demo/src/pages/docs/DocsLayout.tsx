import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
} from "@nexu-design/ui-web";
import { ArrowLeft, ChevronLeft, ChevronRight, Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TableOfContents from "../../components/docs/TableOfContents";
import {
  SIDEBAR_GROUPS,
  type SidebarGroup,
  type SidebarItem,
  getBreadcrumbs,
  getPageNav,
} from "../../config/docsConfig";

function SidebarLink({
  item,
  currentPath,
  onNavigate,
}: { item: SidebarItem; currentPath: string; onNavigate?: () => void }) {
  const isActive = currentPath === item.path;
  const Icon = item.icon;

  return (
    <Link
      to={item.path}
      onClick={onNavigate}
      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-colors text-left text-[13px] ${
        isActive
          ? "text-accent font-medium bg-accent/5"
          : "text-[#636366] hover:text-[#1f2328] hover:bg-[#ececef]"
      }`}
    >
      {Icon && <Icon size={14} className="shrink-0" />}
      {item.label}
    </Link>
  );
}

function SidebarSection({
  group,
  currentPath,
  onNavigate,
}: { group: SidebarGroup; currentPath: string; onNavigate?: () => void }) {
  return (
    <div className="space-y-0.5">
      <div className="px-2.5 pt-3 pb-1 text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wider">
        {group.label}
      </div>
      {group.items.map((item) => (
        <SidebarLink key={item.id} item={item} currentPath={currentPath} onNavigate={onNavigate} />
      ))}
    </div>
  );
}

function SidebarContent({
  currentPath,
  onNavigate,
}: { currentPath: string; onNavigate?: () => void }) {
  return (
    <>
      <div className="flex items-center gap-2 px-5 pt-5 pb-3">
        <img src="/brand/nexu logo-black1.svg" alt="nexu" className="w-6 h-6" />
        <span className="text-[15px] font-semibold text-[#1f2328]">nexu Docs</span>
      </div>

      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#dfdfe3] bg-white cursor-pointer">
          <Search size={14} className="text-[#a1a1aa] shrink-0" />
          <span className="text-[13px] text-[#a1a1aa]">Search...</span>
          <span className="text-[11px] text-[#a1a1aa] font-mono shrink-0 ml-auto">⌘K</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 pb-4">
        {SIDEBAR_GROUPS.map((group) => (
          <SidebarSection
            key={group.label}
            group={group}
            currentPath={currentPath}
            onNavigate={onNavigate}
          />
        ))}

        <div className="!mt-4 !mb-2 border-t border-[#e5e5e8]" />

        <a
          href="/openclaw"
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md hover:text-[#1f2328] hover:bg-[#ececef] transition-colors text-[13px] text-[#636366]"
        >
          <span>Landing</span>
          <ArrowLeft size={14} className="text-[#a1a1aa] rotate-[135deg]" />
        </a>
      </nav>
    </>
  );
}

function Breadcrumbs({ currentPath }: { currentPath: string }) {
  const crumbs = getBreadcrumbs(currentPath);
  if (crumbs.length <= 1) return null;

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList className="text-[12px] text-text-muted">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <BreadcrumbItem key={crumb.path + i}>
              {i > 0 && <BreadcrumbSeparator className="text-text-placeholder" />}
              {isLast ? (
                <BreadcrumbPage className="text-text-secondary">{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild className="hover:text-text-primary">
                  <Link to={crumb.path}>{crumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function PageNav({ currentPath }: { currentPath: string }) {
  const { prev, next } = getPageNav(currentPath);

  if (!prev && !next) return null;

  return (
    <nav className="mt-12 pt-8 border-t border-border">
      <div className="grid grid-cols-2 gap-3 max-w-2xl">
        {prev ? (
          <Link
            to={prev.path}
            className="flex flex-col items-start p-4 rounded-xl border border-border hover:border-border-hover hover:shadow-sm transition-all text-left group"
          >
            <span className="text-[13px] font-semibold text-text-primary group-hover:text-accent transition-colors flex items-center gap-1">
              <ChevronLeft size={14} className="text-text-muted" />
              {prev.title}
            </span>
            <span className="mt-1 text-[12px] text-text-tertiary leading-relaxed">{prev.desc}</span>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            to={next.path}
            className="flex flex-col items-end p-4 rounded-xl border border-border hover:border-border-hover hover:shadow-sm transition-all text-right group"
          >
            <span className="text-[13px] font-semibold text-text-primary group-hover:text-accent transition-colors flex items-center gap-1">
              {next.title}
              <ChevronRight size={14} className="text-text-muted" />
            </span>
            <span className="mt-1 text-[12px] text-text-tertiary leading-relaxed">{next.desc}</span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </nav>
  );
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [feedback, setFeedback] = useState<"none" | "yes" | "no" | "submitted">("none");
  const [feedbackText, setFeedbackText] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
    setFeedback("none");
    setFeedbackText("");
  }, [currentPath]);

  return (
    <div className="min-h-full bg-surface-0 text-[14px] leading-relaxed">
      {/* Top nav */}
      <nav className="sticky top-0 z-50 border-b backdrop-blur-md border-border bg-surface-0/90">
        <div className="flex justify-between items-center px-4 sm:px-8 mx-auto max-w-5xl h-14">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-1.5 -ml-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-2 transition-colors"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <Button
              type="button"
              variant="ghost"
              size="inline"
              onClick={() => navigate("/openclaw")}
              className="text-[13px] text-text-tertiary"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Back to nexu</span>
            </Button>
          </div>
          <div className="flex items-center gap-2.5">
            <img src="/brand/nexu logo-black1.svg" alt="nexu" className="w-7 h-7" />
            <span className="text-sm font-semibold tracking-tight text-text-primary">nexu</span>
            <span className="text-[11px] text-text-muted bg-surface-2 px-1.5 py-0.5 rounded font-mono">
              v0.1
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-[#f5f5f7] border-r border-[#e5e5e8] flex flex-col lg:hidden overflow-y-auto">
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <span className="text-[15px] font-semibold text-[#1f2328]">Navigation</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded text-text-muted hover:text-text-primary"
              >
                <X size={16} />
              </button>
            </div>
            <SidebarContent currentPath={currentPath} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </>
      )}

      <main className="relative px-0 sm:px-8 pb-12 mx-auto max-w-[1240px]">
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1.65fr)_220px] gap-5 pt-1">
          {/* Desktop sidebar */}
          <aside className="hidden lg:flex flex-col lg:sticky lg:top-14 lg:self-start lg:min-h-[calc(100vh-56px)] bg-[#f5f5f7] border-r border-[#e5e5e8]">
            <SidebarContent currentPath={currentPath} />
          </aside>

          {/* Main content */}
          <div className="min-h-[320px] px-4 sm:px-2 text-text-primary py-8">
            <Breadcrumbs currentPath={currentPath} />
            <div data-docs-content>{children}</div>
            <PageNav currentPath={currentPath} />
          </div>

          {/* Right rail: TOC + feedback */}
          <aside className="hidden lg:block">
            <div className="lg:sticky lg:top-20 lg:self-start space-y-5 pt-8">
              {/* Table of contents */}
              <TableOfContents />

              {/* Feedback */}
              <div className="rounded-2xl border border-border bg-surface-1 px-4 py-4 flex flex-col gap-2">
                <div className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                  Feedback
                </div>
                {feedback === "submitted" ? (
                  <div className="text-[13px] text-text-secondary mt-1">
                    Thanks for your feedback!
                  </div>
                ) : (
                  <>
                    <div className="text-sm font-semibold text-text-primary">
                      Was this page helpful?
                    </div>
                    <div className="mt-1 flex gap-2">
                      <Button
                        type="button"
                        variant={feedback === "yes" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFeedback("yes")}
                        className="flex-1 text-[13px]"
                      >
                        Yes
                      </Button>
                      <Button
                        type="button"
                        variant={feedback === "no" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFeedback("no")}
                        className="flex-1 text-[13px]"
                      >
                        No
                      </Button>
                    </div>
                    {feedback === "no" && (
                      <div className="mt-2 space-y-2">
                        <textarea
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          placeholder="How can we improve this page?"
                          rows={3}
                          className="w-full rounded-lg border border-border bg-surface-0 px-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)]/20 focus:border-[var(--color-brand-primary)]/30 resize-none"
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            setFeedback("submitted");
                            setFeedbackText("");
                          }}
                          className="w-full text-[13px]"
                        >
                          Submit
                        </Button>
                      </div>
                    )}
                    {feedback === "yes" && (
                      <div className="mt-1 text-[11px] text-text-tertiary">
                        Thanks! Glad it helped.
                      </div>
                    )}
                    {feedback === "none" && (
                      <div className="mt-1 text-[11px] text-text-tertiary">
                        Your answer helps us improve these docs.
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
