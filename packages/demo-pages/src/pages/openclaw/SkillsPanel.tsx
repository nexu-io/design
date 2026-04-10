import { ArrowRight, Compass, Search, Settings2 } from "lucide-react";
import { useState } from "react";

import { Badge, Input, PageHeader, ToggleGroup, ToggleGroupItem } from "@nexu-design/ui-web";

import { useLocale } from "../../hooks/useLocale";
import { SKILL_CATEGORIES, TOOL_TAG_LABELS, type ToolTag } from "./skillData";

type SkillTagFilter = "all" | ToolTag;
type SkillTopTab = "explore" | "yours";

export function SkillsPanel() {
  const [query, setQuery] = useState("");
  const [topTab, setTopTab] = useState<SkillTopTab>("yours");
  const [tagFilter, setTagFilter] = useState<SkillTagFilter>("all");

  const allSkills = SKILL_CATEGORIES.flatMap((cat) =>
    cat.skills.map((skill) => ({ skill, category: cat })),
  );
  const yourSkills = allSkills.filter((s) => s.skill.source === "custom");
  const exploreSkills = allSkills.filter((s) => s.skill.source === "official");

  const base = topTab === "yours" ? yourSkills : exploreSkills;
  let filtered = base;
  if (topTab === "explore" && tagFilter !== "all") {
    filtered = filtered.filter((item) => item.skill.tag === tagFilter);
  }
  if (query.trim()) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.skill.name.toLowerCase().includes(q) || item.skill.desc.toLowerCase().includes(q),
    );
  }

  const tagTabs: { id: SkillTagFilter; label: string; count: number }[] = [
    { id: "all", label: "All", count: exploreSkills.length },
    ...Object.entries(TOOL_TAG_LABELS).map(([id, label]) => ({
      id: id as SkillTagFilter,
      label,
      count: exploreSkills.filter((s) => s.skill.tag === id).length,
    })),
  ];

  const { t } = useLocale();

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 pt-2 pb-6 sm:pb-8">
        <PageHeader
          density="shell"
          title={t("ws.skills.title")}
          description={t("ws.skills.subtitle")}
        />

        <div className="flex items-center gap-4 mb-5">
          <ToggleGroup
            type="single"
            value={topTab}
            onValueChange={(value: string) => {
              if (!value) return;
              setTopTab(value as SkillTopTab);
              setTagFilter("all");
            }}
            variant="default"
            aria-label="Skills source"
          >
            {[
              { id: "yours" as SkillTopTab, label: "Yours", icon: Settings2 },
              { id: "explore" as SkillTopTab, label: "Explore", icon: Compass },
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <ToggleGroupItem key={tab.id} value={tab.id} className="gap-1.5 text-[13px]">
                  <TabIcon size={14} />
                  {tab.label}
                  {tab.id === "yours" && yourSkills.length > 0 && (
                    <span className="tabular-nums text-[11px] text-text-tertiary data-[state=on]:text-text-secondary">
                      {yourSkills.length}
                    </span>
                  )}
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>

          <div className="ml-auto relative" style={{ width: 220 }}>
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--color-text-placeholder)" }}
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search skills..."
              className="pl-9 h-9 text-[12px]"
            />
          </div>
        </div>

        {topTab === "explore" && (
          <div className="mb-5 overflow-x-auto pb-0.5">
            <ToggleGroup
              type="single"
              value={tagFilter}
              onValueChange={(value: string) => {
                if (value) setTagFilter(value as SkillTagFilter);
              }}
              variant="underline"
              aria-label="Skill categories"
              className="min-w-max"
            >
              {tagTabs.map((tab) => (
                <ToggleGroupItem
                  key={tab.id}
                  value={tab.id}
                  variant="underline"
                  className="shrink-0 text-[13px]"
                >
                  {tab.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        )}

        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
        >
          {filtered.map(({ skill, category }) => {
            const Icon = skill.icon;
            const isCustom = skill.source === "custom";

            return (
              <div
                key={skill.id}
                className="p-4 rounded-lg transition-shadow hover:shadow-[var(--shadow-card)]"
                style={{
                  background: "var(--color-surface-1)",
                  border: "1px solid var(--color-border-card)",
                  cursor: isCustom ? "default" : "pointer",
                }}
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <div
                    className="flex items-center justify-center shrink-0 border border-border bg-white"
                    style={{ width: 40, height: 40, borderRadius: 8 }}
                  >
                    {skill.logo ? (
                      <img src={skill.logo} alt="" className="w-[18px] h-[18px] object-contain" />
                    ) : (
                      <Icon size={18} style={{ color: "var(--color-text-secondary)" }} />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--color-text-primary)",
                        lineHeight: 1.3,
                      }}
                    >
                      {skill.name}
                    </span>
                    {isCustom && (
                      <Badge variant="default" className="text-[10px] px-[5px] py-[1px]">
                        Custom
                      </Badge>
                    )}
                  </div>
                </div>
                <p
                  className="line-clamp-2 mb-3"
                  style={{
                    fontSize: 13,
                    fontWeight: 400,
                    lineHeight: 1.5,
                    color: "var(--color-text-secondary)",
                    margin: 0,
                    marginBottom: 12,
                  }}
                >
                  {skill.desc}
                </p>
                <div className="flex items-center justify-between">
                  <span className="tag">{category.label}</span>
                  {!isCustom && (
                    <span
                      className="inline-flex items-center gap-1"
                      style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-primary)" }}
                    >
                      View details <ArrowRight size={12} />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div
            className="text-center py-16"
            style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}
          >
            No matching skills found
          </div>
        )}
      </div>
    </div>
  );
}
