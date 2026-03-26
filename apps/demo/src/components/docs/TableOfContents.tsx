import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const collect = () => {
      const container = document.querySelector('[data-docs-content]');
      if (!container) return;

      const nodes = container.querySelectorAll('h2, h3');
      const items: TocItem[] = [];
      nodes.forEach(node => {
        let id = node.id;
        if (!id) {
          id = node.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '';
          node.id = id;
        }
        if (id) {
          items.push({ id, text: node.textContent || '', level: node.tagName === 'H2' ? 2 : 3 });
        }
      });
      setHeadings(items);
    };

    collect();
    const timer = setTimeout(collect, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    );

    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <div className="space-y-1">
      <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">On this page</div>
      {headings.map(h => (
        <a
          key={h.id}
          href={`#${h.id}`}
          onClick={e => {
            e.preventDefault();
            document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className={`block text-[12px] leading-snug py-1 transition-colors ${
            h.level === 3 ? 'pl-3' : 'pl-0'
          } ${
            activeId === h.id
              ? 'text-accent font-medium'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          {h.text}
        </a>
      ))}
    </div>
  );
}
