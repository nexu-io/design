import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Compass, Search, Settings2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { usePageTitle } from '../../hooks/usePageTitle';
import { SKILL_CATEGORIES, TOOL_TAG_LABELS, type ToolTag } from './skillData';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type TagFilter = 'all' | ToolTag;
type TopTab = 'explore' | 'yours';

const VALID_TAGS = new Set<string>(Object.keys(TOOL_TAG_LABELS));

const ENTER_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

export default function OpenClawSkillsPage() {
  usePageTitle('Skills');
  const [searchParams] = useSearchParams();
  const initialTag = searchParams.get('tag');
  const [query, setQuery] = useState('');
  const [topTab, setTopTab] = useState<TopTab>('yours');
  const [tagFilter, setTagFilter] = useState<TagFilter>(
    initialTag && VALID_TAGS.has(initialTag) ? initialTag as ToolTag : 'all'
  );

  const allSkills = useMemo(
    () => SKILL_CATEGORIES.flatMap((category) => category.skills.map((skill) => ({ skill, category }))),
    [],
  );

  const yourSkills = useMemo(() => allSkills.filter(s => s.skill.source === 'custom'), [allSkills]);
  const exploreSkills = useMemo(() => allSkills.filter(s => s.skill.source === 'official'), [allSkills]);

  const filtered = useMemo(() => {
    const base = topTab === 'yours' ? yourSkills : exploreSkills;
    let list = base;
    if (topTab === 'explore' && tagFilter !== 'all') {
      list = list.filter((item) => item.skill.tag === tagFilter);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((item) => item.skill.name.toLowerCase().includes(q) || item.skill.desc.toLowerCase().includes(q));
    }
    return list;
  }, [topTab, yourSkills, exploreSkills, tagFilter, query]);

  const tagTabs: { id: TagFilter; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: exploreSkills.length },
    ...Object.entries(TOOL_TAG_LABELS).map(([id, label]) => ({
      id: id as TagFilter,
      label,
      count: exploreSkills.filter(s => s.skill.tag === id).length,
    })),
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'var(--color-surface-0)',
        fontFamily: "'Manrope', 'PingFang SC', -apple-system, sans-serif",
        animation: `nexuPageEnter 0.3s ${ENTER_EASE} both`,
      }}
    >
      <style>{`
        @keyframes nexuPageEnter {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header — 56px, border-bottom */}
      <div
        className="sticky top-0 z-10 backdrop-blur-md"
        style={{
          height: 56,
          borderBottom: '1px solid var(--color-border)',
          background: 'rgba(250,250,250,0.9)',
        }}
      >
        <div className="h-full max-w-5xl mx-auto px-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="shrink-0 size-8">
            <Link to="/openclaw" title="Back">
              <ArrowLeft size={16} />
            </Link>
          </Button>
          <span
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              lineHeight: 1.3,
            }}
          >
            Skills
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Top-level tabs: Explore / Yours */}
        <div className="flex items-center gap-4 mb-5">
          {([
            { id: 'yours' as TopTab, label: 'Yours', icon: Settings2 },
            { id: 'explore' as TopTab, label: 'Explore', icon: Compass },
          ]).map((tab) => {
            const active = topTab === tab.id;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setTopTab(tab.id); setTagFilter('all'); }}
                className="flex items-center gap-1.5 transition-colors"
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  color: active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  background: active ? 'var(--color-surface-2)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <TabIcon size={14} />
                {tab.label}
                {tab.id === 'yours' && yourSkills.length > 0 && (
                  <span
                    className="tabular-nums"
                    style={{
                      fontSize: 11,
                      color: active ? 'var(--color-text-secondary)' : 'var(--color-text-tertiary)',
                    }}
                  >
                    {yourSkills.length}
                  </span>
                )}
              </button>
            );
          })}

          {/* Search — right aligned */}
          <div className="ml-auto relative" style={{ width: 220 }}>
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--color-text-placeholder)' }}
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search skills..."
              className="pl-9 h-9 text-[12px]"
            />
          </div>
        </div>

        {/* Category text tabs (Explore only) */}
        {topTab === 'explore' && (
          <div
            className="flex items-center gap-4 mb-5 overflow-x-auto pb-0.5"
            style={{ borderBottom: '1px solid var(--color-border)' }}
          >
            {tagTabs.map((tab) => {
              const isActive = tagFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setTagFilter(tab.id)}
                  className="relative shrink-0 transition-colors pb-2"
                  style={{
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {tab.label}
                  {isActive && (
                    <div
                      className="absolute bottom-0 left-0 right-0"
                      style={{
                        height: 2,
                        borderRadius: 1,
                        background: 'var(--color-brand-primary)',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Skills grid — 3-column, gap 12px */}
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          }}
        >
          {filtered.map(({ skill, category }) => {
            const Icon = skill.icon;
            const isCustom = skill.source === 'custom';

            const LogoOrIcon = () => (
              skill.logo
                ? (
                    <img
                      src={skill.logo}
                      alt=""
                      className="w-[18px] h-[18px] object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fb = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fb) fb.style.display = 'flex';
                      }}
                    />
                  )
                : null
            );

            const cardStyle: React.CSSProperties = {
              background: 'var(--color-surface-1)',
              border: '1px solid var(--color-border-card)',
              borderRadius: 8,
              padding: 16,
              transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
              cursor: isCustom ? 'default' : 'pointer',
            };

            const handleEnter = (e: React.MouseEvent<HTMLElement>) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-card)';
            };
            const handleLeave = (e: React.MouseEvent<HTMLElement>) => {
              e.currentTarget.style.boxShadow = 'none';
            };

            const content = (
              <>
                <div className="flex items-center gap-3 mb-2.5">
                  <div
                    className="flex items-center justify-center shrink-0 relative border border-border bg-white"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                    }}
                  >
                    {skill.logo && <LogoOrIcon />}
                    <div className={skill.logo ? 'hidden' : 'flex'} style={{ alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={18} style={{ color: 'var(--color-text-secondary)' }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
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
                    color: 'var(--color-text-secondary)',
                    margin: 0,
                    marginBottom: 12,
                  }}
                >
                  {skill.desc}
                </p>
                <div className="flex items-center justify-between">
                  <span className="tag">
                    {category.label}
                  </span>
                  {!isCustom && (
                    <span
                      className="inline-flex items-center gap-1"
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      View details <ArrowRight size={12} />
                    </span>
                  )}
                </div>
              </>
            );

            return isCustom ? (
              <div
                key={skill.id}
                style={cardStyle}
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
              >
                {content}
              </div>
            ) : (
              <Link
                key={skill.id}
                to={`/openclaw/skill/${skill.id}`}
                style={{ ...cardStyle, textDecoration: 'none' }}
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
              >
                {content}
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div
            className="text-center py-16"
            style={{
              fontSize: 13,
              color: 'var(--color-text-tertiary)',
            }}
          >
            No matching skills found
          </div>
        )}
      </div>
    </div>
  );
}
