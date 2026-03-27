import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  ChevronDown,
  FileText,
  Sparkles,
  Bug,
  Palette,
  Server,
} from 'lucide-react';
import { Button } from '@nexu-design/ui-web';
import { usePageTitle } from '../../hooks/usePageTitle';

interface ChangelogEntry {
  hash: string;
  short: string;
  message: string;
  body: string;
  author: string;
  date: string;
  dateShort: string;
  filesChanged: string[];
  filesCount: number;
  insertions: number;
  deletions: number;
  categories: string[];
  summary: string;
}

const HIDDEN_CATEGORIES = new Set([
  'identity', 'decision', 'operations', 'preference',
  'rules', 'infra', 'other', 'team', 'facts',
]);

const CATEGORY_LABELS: Record<string, string> = {
  insight: 'Insight',
  knowledge: 'Knowledge',
  artifact: 'Product',
  automation: 'Automation',
  clone: 'Clone',
  portal: 'Portal',
  'design-system': 'Design',
  backend: 'Backend',
  frontend: 'Frontend',
  strategy: 'Strategy',
};

const CATEGORY_COLORS: Record<string, string> = {
  insight: 'bg-cyan-500/10 text-cyan-700 border-cyan-500/20',
  knowledge: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
  artifact: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
  automation: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
  clone: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
  portal: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
  'design-system': 'bg-pink-500/10 text-pink-700 border-pink-500/20',
  backend: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20',
  frontend: 'bg-teal-500/10 text-teal-700 border-teal-500/20',
  strategy: 'bg-violet-500/10 text-violet-700 border-violet-500/20',
};

const TYPE_CONFIG: Record<string, { icon: typeof Sparkles; label: string; color: string }> = {
  feat: { icon: Sparkles, label: 'New', color: 'text-success' },
  fix: { icon: Bug, label: 'Fix', color: 'text-danger' },
  docs: { icon: FileText, label: 'Docs', color: 'text-info' },
  refactor: { icon: Server, label: 'Improved', color: 'text-text-secondary' },
  style: { icon: Palette, label: 'Style', color: 'text-text-tertiary' },
};

function getCommitType(message: string) {
  const match = message.match(/^(feat|fix|docs|refactor|style|perf|test|chore|ci|build)[\s(:]/);
  if (match && TYPE_CONFIG[match[1]]) return TYPE_CONFIG[match[1]];
  if (/^Merge|^merge:/.test(message)) return null;
  if (/新功能|新增/.test(message)) return TYPE_CONFIG.feat;
  if (/修复/.test(message)) return TYPE_CONFIG.fix;
  if (/文档|更新/.test(message)) return TYPE_CONFIG.docs;
  if (/重构/.test(message)) return TYPE_CONFIG.refactor;
  return null;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

const ROWS_PER_PAGE = 30;

export default function DocsChangelogPage() {
  usePageTitle('Changelog');

  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleRows, setVisibleRows] = useState(ROWS_PER_PAGE);

  useEffect(() => {
    fetch('/changelog.json')
      .then((r) => (r.ok ? r.json() : []))
      .then((data: ChangelogEntry[]) => {
        const filtered = data.filter(
          (e) =>
            e.categories?.length > 0 &&
            !e.categories.every((c) => HIDDEN_CATEGORIES.has(c)) &&
            e.summary &&
            !/^merge:/i.test(e.message) &&
            !/^Merge branch|^合并分支/.test(e.summary)
        );
        setEntries(filtered);
      })
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  const visibleEntries = useMemo(
    () => entries.slice(0, visibleRows),
    [entries, visibleRows]
  );
  const hasMore = visibleRows < entries.length;

  return (
    <>
      <h1 className="text-[22px] font-semibold text-text-primary flex items-center gap-2">
        <BookOpen size={20} className="text-text-muted" />
        Changelog
      </h1>
      <p className="mt-2 text-[14px] text-text-tertiary leading-relaxed max-w-2xl">
        All shipped changes, sorted by date. We aim for safe, incremental updates; any breaking change is called out explicitly.
      </p>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 rounded-full border-2 border-border border-t-accent animate-spin" />
        </div>
      ) : visibleEntries.length === 0 ? (
        <p className="py-20 text-center text-text-muted text-sm">No updates found.</p>
      ) : (
        <div className="mt-8">
          <div className="rounded-2xl border border-border bg-surface-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[13px]">
                <thead className="bg-surface-1">
                  <tr className="text-left text-text-secondary">
                    <th className="px-4 py-3 font-semibold border-b border-border whitespace-nowrap">
                      Service Update
                    </th>
                    <th className="px-4 py-3 font-semibold border-b border-border">
                      Feature change
                    </th>
                    <th className="px-4 py-3 font-semibold border-b border-border whitespace-nowrap">
                      Area
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {visibleEntries.map((entry, idx) => {
                      const typeInfo = getCommitType(entry.message);
                      const visibleCategories = entry.categories.filter(
                        (c) => !HIDDEN_CATEGORIES.has(c)
                      );
                      const primaryArea = visibleCategories[0] ?? 'other';
                      const areaLabel = CATEGORY_LABELS[primaryArea] ?? primaryArea;
                      const areaClass =
                        CATEGORY_COLORS[primaryArea] ??
                        'bg-surface-2 text-text-muted border-border';
                      const Icon = typeInfo?.icon ?? FileText;
                      return (
                        <motion.tr
                          key={entry.hash}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ delay: Math.min(idx * 0.01, 0.15) }}
                          className="border-b border-border/70 last:border-b-0 hover:bg-surface-2/40 transition-colors"
                        >
                          <td className="px-4 py-3 align-top text-text-tertiary whitespace-nowrap">
                            {formatDate(entry.dateShort)}
                          </td>
                          <td className="px-4 py-3 align-top">
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center shrink-0">
                                <Icon
                                  size={18}
                                  className={typeInfo?.color ?? 'text-text-muted'}
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {typeInfo && (
                                    <span
                                      className={`text-[11px] font-semibold uppercase tracking-wider ${typeInfo.color}`}
                                    >
                                      {typeInfo.label}
                                    </span>
                                  )}
                                  <span className="text-[11px] text-text-muted font-mono">
                                    {entry.short}
                                  </span>
                                </div>
                                <div className="mt-1 text-[13px] text-text-primary leading-relaxed">
                                  {entry.summary}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 align-top whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium border ${areaClass}`}
                            >
                              {areaLabel}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>

          {hasMore && (
            <div className="flex justify-center pt-6">
              <Button
                type="button"
                onClick={() => setVisibleRows((v) => v + ROWS_PER_PAGE)}
                className="gap-2 px-6 py-3 text-sm font-semibold shadow-sm transition-all hover:shadow-md hover:shadow-accent/15"
              >
                <ChevronDown size={16} />
                Load more
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
