import { Compass, Download, FileText, Search, Settings2 } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Badge,
  Button,
  Input,
  PageHeader,
  Tabs,
  TabsList,
  TabsTrigger,
  ToggleGroup,
  ToggleGroupItem,
} from "@nexu-design/ui-web";

import { useLocale } from "../../hooks/useLocale";
import { GitHubStarButton } from "./GitHubStarButton";
import { ImportSkillModal } from "./ImportSkillModal";
import { SKILL_CATEGORIES, type SkillDef, TOOL_TAG_LABELS, type ToolTag } from "./skillData";

type SkillTagFilter = "all" | ToolTag;
type SkillTopTab = "explore" | "yours";
type YoursFilter = "all" | "builtin" | "custom";

function buildImportedSkillName(fileName: string, existingNames: string[]) {
  const baseName = fileName.replace(/\.zip$/i, "").trim() || "Imported Skill";
  const normalizedBase = baseName
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

  if (!existingNames.includes(normalizedBase)) {
    return normalizedBase;
  }

  let suffix = 2;
  let nextName = `${normalizedBase} ${suffix}`;

  while (existingNames.includes(nextName)) {
    suffix += 1;
    nextName = `${normalizedBase} ${suffix}`;
  }

  return nextName;
}

function createImportedSkill(fileName: string, existingSkills: SkillDef[]): SkillDef {
  return {
    id: `workspace-imported-${fileName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${existingSkills.length + 1}`,
    name: buildImportedSkillName(
      fileName,
      existingSkills.map((skill) => skill.name),
    ),
    desc: "Imported from a local ZIP package.",
    icon: FileText,
    prompt: "Run the imported skill package.",
    tag: "dev-tools",
    source: "custom",
    longDesc: "Imported demo skill package. Local ZIP import is mocked for the design demo.",
  };
}

export function SkillsPanel({
  githubUrl,
  stars,
  initialTab = "yours",
  initialTag,
}: {
  githubUrl: string;
  stars?: number;
  initialTab?: SkillTopTab;
  initialTag?: ToolTag;
}) {
  const [query, setQuery] = useState("");
  const [topTab, setTopTab] = useState<SkillTopTab>(initialTag ? "explore" : initialTab);
  const [tagFilter, setTagFilter] = useState<SkillTagFilter>(initialTag ?? "all");
  const [yoursFilter, setYoursFilter] = useState<YoursFilter>("all");
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importedSkills, setImportedSkills] = useState<SkillDef[]>([]);

  useEffect(() => {
    setTopTab(initialTag ? "explore" : initialTab);
    setTagFilter(initialTag ?? "all");
  }, [initialTab, initialTag]);

  const allSkills = [
    ...importedSkills.map((skill) => ({
      skill,
      category: { id: "imported", label: "Imported", icon: FileText, skills: importedSkills },
    })),
    ...SKILL_CATEGORIES.flatMap((cat) => cat.skills.map((skill) => ({ skill, category: cat }))),
  ];
  const yourSkills = allSkills;
  const exploreSkills = allSkills.filter((s) => s.skill.source === "official");
  const yourBuiltInSkills = allSkills.filter((s) => s.skill.source === "official");
  const yourCustomSkills = allSkills.filter((s) => s.skill.source === "custom");

  const base =
    topTab === "yours"
      ? yoursFilter === "builtin"
        ? yourBuiltInSkills
        : yoursFilter === "custom"
          ? yourCustomSkills
          : yourSkills
      : exploreSkills;
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
  const yoursTabs: { id: YoursFilter; label: string; count: number }[] = [
    { id: "all", label: "All", count: yourSkills.length },
    { id: "builtin", label: "Built-in", count: yourBuiltInSkills.length },
    { id: "custom", label: "Custom", count: yourCustomSkills.length },
  ];

  const { t } = useLocale();
  const infoText =
    topTab === "yours"
      ? `${filtered.length} skill${filtered.length === 1 ? "" : "s"} in your workspace.`
      : "Skills come from ClawHub — network or service may occasionally be unstable. If you encounter issues, please report on GitHub Issues.";

  const handleImportSkill = async (file: File) => {
    await new Promise((resolve) => window.setTimeout(resolve, 800));

    const nextSkill = createImportedSkill(
      file.name,
      allSkills.map(({ skill }) => skill),
    );

    setImportedSkills((current) => [nextSkill, ...current]);
    setTopTab("yours");
    setQuery("");
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 pt-2 pb-6 sm:pb-8">
        <PageHeader
          density="shell"
          title={t("ws.skills.title")}
          description={t("ws.skills.subtitle")}
          actions={<GitHubStarButton href={githubUrl} label="Star on GitHub" stars={stars} />}
        />

        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            leadingIcon={<Search size={14} />}
            size="sm"
            className="w-full bg-surface-0 sm:w-72"
          />
          <Button type="button" size="sm" onClick={() => setImportModalOpen(true)}>
            <Download size={14} />
            Import
          </Button>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <Tabs
            value={topTab}
            onValueChange={(value: string) => {
              if (!value) return;
              setTopTab(value as SkillTopTab);
              setTagFilter("all");
              setYoursFilter("all");
            }}
            className="w-auto"
          >
            <TabsList className="w-auto">
              {[
                { id: "yours" as SkillTopTab, label: "Yours", icon: Settings2 },
                { id: "explore" as SkillTopTab, label: "ClawHub", icon: Compass },
              ].map((tab) => {
                const TabIcon = tab.icon;

                return (
                  <TabsTrigger key={tab.id} value={tab.id} className="gap-1.5 text-[13px]">
                    <TabIcon size={13} />
                    {tab.label}
                    {tab.id === "yours" && yourSkills.length > 0 && (
                      <span className="ml-1 tabular-nums text-[10px] opacity-70">
                        {yourSkills.length}
                      </span>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>

        {topTab === "yours" && (
          <div className="mb-3 -mt-2 overflow-x-auto pb-0.5">
            <ToggleGroup
              type="single"
              value={yoursFilter}
              onValueChange={(value: string) => {
                if (value) setYoursFilter(value as YoursFilter);
              }}
              variant="outline"
              aria-label="Your skills filter"
              className="min-w-max"
            >
              {yoursTabs.map((tab) => (
                <ToggleGroupItem
                  key={tab.id}
                  value={tab.id}
                  variant="outline"
                  size="sm"
                  className="text-[12px]"
                >
                  <span>{tab.label}</span>
                  <span className="ml-1 tabular-nums text-[10px] opacity-70">{tab.count}</span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        )}

        {topTab === "explore" && (
          <div className="mb-3 -mt-2 overflow-x-auto pb-0.5">
            <ToggleGroup
              type="single"
              value={tagFilter}
              onValueChange={(value: string) => {
                if (value) setTagFilter(value as SkillTagFilter);
              }}
              variant="outline"
              aria-label="Skill filter"
              className="min-w-max"
            >
              {tagTabs.map((tab) => (
                <ToggleGroupItem
                  key={tab.id}
                  value={tab.id}
                  variant="outline"
                  size="sm"
                  className="text-[12px]"
                >
                  <span>{tab.label}</span>
                  <span className="ml-1 tabular-nums text-[10px] opacity-70">{tab.count}</span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        )}

        <div className="mb-4 text-xs text-text-tertiary">{infoText}</div>

        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
        >
          {filtered.map(({ skill }) => {
            const Icon = skill.icon;
            const isCustom = skill.source === "custom";
            const actionLabel = topTab === "yours" ? "Uninstall" : "Install";

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
                <div className="flex items-center justify-end">
                  <Button variant="outline" size="sm" type="button">
                    {actionLabel}
                  </Button>
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

        <ImportSkillModal
          open={importModalOpen}
          onClose={() => setImportModalOpen(false)}
          onImport={handleImportSkill}
        />
      </div>
    </div>
  );
}
