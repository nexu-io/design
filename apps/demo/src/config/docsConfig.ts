import type { LucideIcon } from 'lucide-react';
import {
  Rocket,
  LayoutGrid,
  HelpCircle,
  Users,
  BookOpen,
  Zap,
  Wrench,
  Sparkles,
  Cpu,
  Brain,
  MessageSquare,
  Star,
} from 'lucide-react';

export interface DocPage {
  id: string;
  title: string;
  desc: string;
  path: string;
  icon?: LucideIcon;
}

export interface SidebarItem {
  id: string;
  label: string;
  path: string;
  icon?: LucideIcon;
}

export interface SidebarGroup {
  label: string;
  items: SidebarItem[];
}

export const DOC_PAGES: DocPage[] = [
  { id: 'what-is-nexu', title: 'What is nexu', desc: 'nexu overview — always-on memory, chat-native, next to you.', path: '/docs/get-started', icon: Zap },
  { id: 'setup-guide', title: 'Setup Guide', desc: 'Add nexu to Slack or Feishu in minutes.', path: '/docs/get-started/setup-guide', icon: Wrench },
  { id: 'quick-start', title: 'Quick start', desc: 'Go from zero to first real outcome in 20 minutes.', path: '/docs/get-started/quick-start', icon: Rocket },
  { id: 'skills', title: 'Skills', desc: 'Reusable capabilities nexu can invoke for your team.', path: '/docs/get-started/skills', icon: Sparkles },
  { id: 'channels', title: 'Channels', desc: 'Configure Slack, Feishu, and upcoming IM platforms.', path: '/docs/get-started/channels', icon: MessageSquare },
  { id: 'llm-providers', title: 'LLM Providers', desc: 'Connect your own model or use the default Claude endpoint.', path: '/docs/get-started/llm-providers', icon: Cpu },
  { id: 'your-clone', title: 'Your Clone', desc: 'Customize your AI teammate — persona, memory, and knowledge.', path: '/docs/get-started/your-clone', icon: Brain },
  { id: 'key-workflows', title: 'Key workflows', desc: 'Core patterns — drafting, review loop, shipping.', path: '/docs/get-started/key-workflows', icon: LayoutGrid },
  { id: 'faq', title: 'FAQ', desc: 'Common questions about nexu, data, and setup.', path: '/docs/get-started/faq', icon: HelpCircle },
  { id: 'community', title: 'Community & resources', desc: 'GitHub, community, API docs, and support.', path: '/docs/get-started/community', icon: Users },
  { id: 'changelog', title: 'Changelog', desc: 'All shipped changes sorted by date.', path: '/docs/get-started/changelog', icon: BookOpen },
  { id: 'star', title: 'Star us on GitHub', desc: 'Support nexu — one click, real impact.', path: '/docs/get-started/star', icon: Star },
];

export const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    label: 'Get Started',
    items: [
      { id: 'what-is-nexu', label: 'What is nexu', path: '/docs/get-started', icon: Zap },
      { id: 'setup-guide', label: 'Setup Guide', path: '/docs/get-started/setup-guide', icon: Wrench },
      { id: 'quick-start', label: '20-Minute Quick Start', path: '/docs/get-started/quick-start', icon: Rocket },
    ],
  },
  {
    label: 'Guide',
    items: [
      { id: 'skills', label: 'Skills', path: '/docs/get-started/skills', icon: Sparkles },
      { id: 'channels', label: 'Channels', path: '/docs/get-started/channels', icon: MessageSquare },
      { id: 'llm-providers', label: 'LLM Providers', path: '/docs/get-started/llm-providers', icon: Cpu },
      { id: 'your-clone', label: 'Your Clone', path: '/docs/get-started/your-clone', icon: Brain },
      { id: 'key-workflows', label: 'Key Workflows', path: '/docs/get-started/key-workflows', icon: LayoutGrid },
    ],
  },
  {
    label: 'Help',
    items: [
      { id: 'faq', label: 'FAQ', path: '/docs/get-started/faq', icon: HelpCircle },
      { id: 'community', label: 'Community', path: '/docs/get-started/community', icon: Users },
      { id: 'changelog', label: 'Changelog', path: '/docs/get-started/changelog', icon: BookOpen },
      { id: 'star', label: '⭐ Star us on GitHub', path: '/docs/get-started/star', icon: Star },
    ],
  },
];

export function getPageNav(currentPath: string) {
  const idx = DOC_PAGES.findIndex(p => p.path === currentPath);
  return {
    prev: idx > 0 ? DOC_PAGES[idx - 1] : null,
    next: idx < DOC_PAGES.length - 1 ? DOC_PAGES[idx + 1] : null,
  };
}

export function getBreadcrumbs(currentPath: string) {
  const page = DOC_PAGES.find(p => p.path === currentPath);
  const crumbs = [{ label: 'Docs', path: '/docs/get-started' }];
  if (page && page.path !== '/docs/get-started') {
    const group = SIDEBAR_GROUPS.find(g => g.items.some(i => i.path === currentPath));
    if (group) crumbs.push({ label: group.label, path: group.items[0].path });
    crumbs.push({ label: page.title, path: page.path });
  }
  return crumbs;
}
