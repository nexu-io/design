import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePageTitle } from '../../hooks/usePageTitle';
import {
  ArrowLeft,
  ArrowRight,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  Check,
  ExternalLink,
  Search,
  Home,
  FileText,
  ArrowUpRight,
  X,
  Eye,
  EyeOff,
  Plus,
  ChevronDown,
  Cpu,
  BookOpen,
  Mail,
  ScrollText,
  CircleHelp,
  Cable,
  FolderOpen,
  Loader2,
  Compass,
  Settings2,
  AlertCircle,
  Globe,
} from 'lucide-react';
import {
  MOCK_CHANNELS,
  MOCK_DEPLOYMENTS,
  getProviderDetails,
  type ModelProvider,
} from './data';
import { SKILL_CATEGORIES, type SkillDef } from './skillData';
import ChannelDetailPage from './ChannelDetailPage';
import ImportSkillModal from './ImportSkillModal';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { Switch } from '../../components/ui/switch';
import { useGitHubStars } from '../../hooks/useGitHubStars';
import { useLocale } from '../../hooks/useLocale';
import { Star } from 'lucide-react';
import { openUrl } from '@tauri-apps/plugin-opener';

const openExternal = async (url: string) => {
  try {
    await openUrl(url);
  } catch {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};

const GITHUB_URL = 'https://github.com/refly-ai/nexu';

type SkillFilter = 'all' | string;

function ProviderLogo({ provider, size = 16 }: { provider: string; size?: number }) {
  const s = { width: size, height: size };
  switch (provider) {
    case 'nexu':
      return <img src="/logo.svg" alt="nexu" style={s} className="object-contain" />;
    case 'anthropic':
      return (
        <svg style={s} viewBox="0 0 24 24" fill="currentColor"><path d="M13.827 3.52h3.603L24 20.48h-3.603l-6.57-16.96zm-7.258 0h3.767L16.906 20.48h-3.674l-1.476-3.914H5.036l-1.466 3.914H0L6.569 3.52zm.658 10.418h4.543L9.548 7.04l-2.32 6.898z"/></svg>
      );
    case 'openai':
      return (
        <svg style={s} viewBox="0 0 24 24" fill="currentColor"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.998 5.998 0 0 0-3.998 2.9 6.042 6.042 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/></svg>
      );
    case 'google':
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
      );
    case 'xai':
      return (
        <svg style={s} viewBox="0 0 24 24" fill="currentColor"><path d="M3 2l8.6 12.24L3 22h1.95l7.56-6.8L18.06 22H21L12.12 9.36 19.8 2h-1.95l-6.66 6.42L5.94 2H3zm2.76 1.4h2.46l9.96 15.2h-2.46L5.76 3.4z"/></svg>
      );
    case 'kimi':
      return (
        <svg style={s} viewBox="0 0 24 24" fill="currentColor"><path d="M21.846 0a1.923 1.923 0 110 3.846H20.15a.226.226 0 01-.227-.226V1.923C19.923.861 20.784 0 21.846 0z"/><path d="M11.065 11.199l7.257-7.2c.137-.136.06-.41-.116-.41H14.3a.164.164 0 00-.117.051l-7.82 7.756c-.122.12-.302.013-.302-.179V3.82c0-.127-.083-.23-.185-.23H3.186c-.103 0-.186.103-.186.23V19.77c0 .128.083.23.186.23h2.69c.103 0 .186-.102.186-.23v-3.25c0-.069.025-.135.069-.178l2.424-2.406a.158.158 0 01.205-.023l6.484 4.772a7.677 7.677 0 003.453 1.283c.108.012.2-.095.2-.23v-3.06c0-.117-.07-.212-.164-.227a5.028 5.028 0 01-2.027-.807l-5.613-4.064c-.117-.078-.132-.279-.028-.381z"/></svg>
      );
    case 'glm':
      return (
        <svg style={s} viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd"><path d="M11.991 23.503a.24.24 0 00-.244.248.24.24 0 00.244.249.24.24 0 00.245-.249.24.24 0 00-.22-.247l-.025-.001zM9.671 5.365a1.697 1.697 0 011.099 2.132l-.071.172-.016.04-.018.054c-.07.16-.104.32-.104.498-.035.71.47 1.279 1.186 1.314h.366c1.309.053 2.338 1.173 2.286 2.523-.052 1.332-1.152 2.38-2.478 2.327h-.174c-.715.018-1.274.64-1.239 1.368 0 .124.018.23.053.337.209.373.54.658.96.8.75.23 1.517-.125 1.9-.782l.018-.035c.402-.64 1.17-.96 1.92-.711.854.284 1.378 1.226 1.099 2.167a1.661 1.661 0 01-2.077 1.102 1.711 1.711 0 01-.907-.711l-.017-.035c-.2-.323-.463-.58-.851-.711l-.056-.018a1.646 1.646 0 00-1.954.746 1.66 1.66 0 01-1.065.764 1.677 1.677 0 01-1.989-1.279c-.209-.906.332-1.83 1.257-2.043a1.51 1.51 0 01.296-.035h.018c.68-.071 1.151-.622 1.116-1.333a1.307 1.307 0 00-.227-.693 2.515 2.515 0 01-.366-1.403 2.39 2.39 0 01.366-1.208c.14-.195.21-.444.227-.693.018-.71-.506-1.261-1.186-1.332l-.07-.018a1.43 1.43 0 01-.299-.07l-.05-.019a1.7 1.7 0 01-1.047-2.114 1.68 1.68 0 012.094-1.101zm-5.575 10.11c.26-.264.639-.367.994-.27.355.096.633.379.728.74.095.362-.007.748-.267 1.013-.402.41-1.053.41-1.455 0a1.062 1.062 0 010-1.482zm14.845-.294c.359-.09.738.024.992.297.254.274.344.665.237 1.025-.107.36-.396.634-.756.718-.551.128-1.1-.22-1.23-.781a1.05 1.05 0 01.757-1.26zm-.064-4.39c.314.32.49.753.49 1.206 0 .452-.176.886-.49 1.206-.315.32-.74.5-1.185.5-.444 0-.87-.18-1.184-.5a1.727 1.727 0 010-2.412 1.654 1.654 0 012.369 0zm-11.243.163c.364.484.447 1.128.218 1.691a1.665 1.665 0 01-2.188.923c-.855-.36-1.26-1.358-.907-2.228a1.68 1.68 0 011.33-1.038c.593-.08 1.183.169 1.547.652zm11.545-4.221c.368 0 .708.2.892.524.184.324.184.724 0 1.048a1.026 1.026 0 01-.892.524c-.568 0-1.03-.47-1.03-1.048 0-.579.462-1.048 1.03-1.048zm-14.358 0c.368 0 .707.2.891.524.184.324.184.724 0 1.048a1.026 1.026 0 01-.891.524c-.569 0-1.03-.47-1.03-1.048 0-.579.461-1.048 1.03-1.048zm10.031-1.475c.925 0 1.675.764 1.675 1.706s-.75 1.705-1.675 1.705-1.674-.763-1.674-1.705c0-.942.75-1.706 1.674-1.706zM12.226 4.574c.362-.082.653-.356.761-.718a1.062 1.062 0 00-.238-1.028 1.017 1.017 0 00-.996-.294c-.547.14-.881.7-.752 1.257.13.558.675.907 1.225.783zm0 16.876c.359-.087.644-.36.75-.72a1.062 1.062 0 00-.237-1.019 1.018 1.018 0 00-.985-.301 1.037 1.037 0 00-.762.717c-.108.361-.017.754.239 1.028.245.263.606.377.953.305l.043-.01zM17.19 3.5a.631.631 0 00.628-.64c0-.355-.279-.64-.628-.64a.631.631 0 00-.628.64c0 .355.28.64.628.64zm-10.38 0a.631.631 0 00.628-.64c0-.355-.28-.64-.628-.64a.631.631 0 00-.628.64c0 .355.279.64.628.64zm-5.182 7.852a.631.631 0 00-.628.64c0 .354.28.639.628.639a.63.63 0 00.627-.606l.001-.034a.62.62 0 00-.628-.64zm5.182 9.13a.631.631 0 00-.628.64c0 .355.279.64.628.64a.631.631 0 00.628-.64c0-.355-.28-.64-.628-.64zm10.38.018a.631.631 0 00-.628.64c0 .355.28.64.628.64a.631.631 0 00.628-.64c0-.355-.279-.64-.628-.64zm5.182-9.148a.631.631 0 00-.628.64c0 .354.279.639.628.639a.631.631 0 00.628-.64c0-.355-.28-.64-.628-.64zm-.384-4.992a.24.24 0 00.244-.249.24.24 0 00-.244-.249.24.24 0 00-.244.249c0 .142.122.249.244.249zM11.991.497a.24.24 0 00.245-.248A.24.24 0 0011.99 0a.24.24 0 00-.244.249c0 .133.108.236.223.247l.021.001zM2.011 6.36a.24.24 0 00.245-.249.24.24 0 00-.244-.249.24.24 0 00-.244.249.24.24 0 00.244.249zm0 11.263a.24.24 0 00-.243.248.24.24 0 00.244.249.24.24 0 00.244-.249.252.252 0 00-.244-.248zm19.995-.018a.24.24 0 00-.245.248.24.24 0 00.245.25.24.24 0 00.244-.25.252.252 0 00-.244-.248z"/></svg>
      );
    case 'minimax':
      return (
        <svg style={s} viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd"><path d="M16.278 2c1.156 0 2.093.927 2.093 2.07v12.501a.74.74 0 00.744.709.74.74 0 00.743-.709V9.099a2.06 2.06 0 012.071-2.049A2.06 2.06 0 0124 9.1v6.561a.649.649 0 01-.652.645.649.649 0 01-.653-.645V9.1a.762.762 0 00-.766-.758.762.762 0 00-.766.758v7.472a2.037 2.037 0 01-2.048 2.026 2.037 2.037 0 01-2.048-2.026v-12.5a.785.785 0 00-.788-.753.785.785 0 00-.789.752l-.001 15.904A2.037 2.037 0 0113.441 22a2.037 2.037 0 01-2.048-2.026V18.04c0-.356.292-.645.652-.645.36 0 .652.289.652.645v1.934c0 .263.142.506.372.638.23.131.514.131.744 0a.734.734 0 00.372-.638V4.07c0-1.143.937-2.07 2.093-2.07zm-5.674 0c1.156 0 2.093.927 2.093 2.07v11.523a.648.648 0 01-.652.645.648.648 0 01-.652-.645V4.07a.785.785 0 00-.789-.78.785.785 0 00-.789.78v14.013a2.06 2.06 0 01-2.07 2.048 2.06 2.06 0 01-2.071-2.048V9.1a.762.762 0 00-.766-.758.762.762 0 00-.766.758v3.8a2.06 2.06 0 01-2.071 2.049A2.06 2.06 0 010 12.9v-1.378c0-.357.292-.646.652-.646.36 0 .653.29.653.646V12.9c0 .418.343.757.766.757s.766-.339.766-.757V9.099a2.06 2.06 0 012.07-2.048 2.06 2.06 0 012.071 2.048v8.984c0 .419.343.758.767.758.423 0 .766-.339.766-.758V4.07c0-1.143.937-2.07 2.093-2.07z"/></svg>
      );
    case 'openrouter':
      return (
        <svg style={s} viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd"><path d="M16.804 1.957l7.22 4.105v.087L16.73 10.21l.017-2.117-.821-.03c-1.059-.028-1.611.002-2.268.11-1.064.175-2.038.577-3.147 1.352L8.345 11.03c-.284.195-.495.336-.68.455l-.515.322-.397.234.385.23.53.338c.476.314 1.17.796 2.701 1.866 1.11.775 2.083 1.177 3.147 1.352l.3.045c.694.091 1.375.094 2.825.033l.022-2.159 7.22 4.105v.087L16.589 22l.014-1.862-.635.022c-1.386.042-2.137.002-3.138-.162-1.694-.28-3.26-.926-4.881-2.059l-2.158-1.5a21.997 21.997 0 00-.755-.498l-.467-.28a55.927 55.927 0 00-.76-.43C2.908 14.73.563 14.116 0 14.116V9.888l.14.004c.564-.007 2.91-.622 3.809-1.124l1.016-.58.438-.274c.428-.28 1.072-.726 2.686-1.853 1.621-1.133 3.186-1.78 4.881-2.059 1.152-.19 1.974-.213 3.814-.138l.02-1.907z"/></svg>
      );
    case 'siliconflow':
      return (
        <svg style={s} viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd"><path clipRule="evenodd" d="M22.956 6.521H12.522c-.577 0-1.044.468-1.044 1.044v3.13c0 .577-.466 1.044-1.043 1.044H1.044c-.577 0-1.044.467-1.044 1.044v4.174C0 17.533.467 18 1.044 18h10.434c.577 0 1.044-.467 1.044-1.043v-3.13c0-.578.466-1.044 1.043-1.044h9.391c.577 0 1.044-.467 1.044-1.044V7.565c0-.576-.467-1.044-1.044-1.044z"/></svg>
      );
    case 'ppio':
      return (
        <svg style={s} viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd"><path clipRule="evenodd" d="M12.002 0C5.377 0 0 5.37 0 11.994c0 3.266 1.309 6.232 3.43 8.395v-8.383c0-2.288.893-4.447 2.51-6.063a8.513 8.513 0 016.066-2.509h.07l-.074.008c4.735 0 8.575 3.84 8.575 8.571 0 .413-.03.818-.087 1.219l-4.844-4.86A5.12 5.12 0 0012.01 6.87a5.126 5.126 0 00-3.637 1.503 5.107 5.107 0 00-1.507 3.641c0 1.376.536 2.666 1.507 3.64a5.12 5.12 0 003.637 1.504 5.126 5.126 0 003.637-1.503 5.114 5.114 0 001.496-3.348l2.842 2.853c-1.256 3.18-4.353 5.433-7.978 5.433-1.879 0-3.671-.6-5.145-1.714v3.967c1.56.742 3.3 1.155 5.137 1.155C18.623 24 24 18.63 24 12.006 24.008 5.373 18.635.004 12.006.004L12.002 0z"/></svg>
      );
    case 'xiaoxiang':
      return (
        <svg style={s} viewBox="0 0 24 24" fill="currentColor"><rect width="24" height="24" rx="4" fill="#10B981"/><text x="12" y="16" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold" fontFamily="system-ui">XM</text></svg>
      );
    default:
      return (
        <span className="flex items-center justify-center rounded text-[9px] font-bold bg-surface-3 text-text-muted" style={s}>
          {(provider[0] ?? '?').toUpperCase()}
        </span>
      );
  }
}

function getModelIconProvider(modelName: string): string {
  const n = modelName.toLowerCase();
  if (n.includes('claude') || n.includes('sonnet') || n.includes('haiku') || n.includes('opus')) return 'anthropic';
  if (n.includes('gpt') || n.includes('o1') || n.includes('o3') || n.includes('o4')) return 'openai';
  if (n.includes('gemini') || n.includes('gemma')) return 'google';
  if (n.includes('grok')) return 'xai';
  if (n.includes('moonshot') || n.includes('kimi')) return 'kimi';
  if (n.includes('glm') || n.includes('chatglm')) return 'glm';
  if (n.includes('abab') || n.includes('minimax')) return 'minimax';
  if (n.includes('deepseek')) return 'deepseek';
  if (n.includes('qwen')) return 'qwen';
  return '';
}


function SkillsPanel() {
  const { t } = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [topTab, setTopTab] = useState<'explore' | 'yours'>('yours');
  const [filter, setFilter] = useState<SkillFilter>('all');
  const [disabledSkills, setDisabledSkills] = useState<Set<string>>(new Set());
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [installingSkills, setInstallingSkills] = useState<Set<string>>(new Set());
  const pillScrollRef = useRef<HTMLDivElement>(null);
  const [showPillFade, setShowPillFade] = useState(false);

  const [showPillFadeLeft, setShowPillFadeLeft] = useState(false);
  const checkPillOverflow = useCallback(() => {
    const el = pillScrollRef.current;
    if (!el) { setShowPillFade(false); setShowPillFadeLeft(false); return; }
    const hasOverflow = el.scrollWidth > el.clientWidth;
    setShowPillFade(hasOverflow && el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
    setShowPillFadeLeft(hasOverflow && el.scrollLeft > 2);
  }, []);

  useEffect(() => {
    checkPillOverflow();
    window.addEventListener('resize', checkPillOverflow);
    return () => window.removeEventListener('resize', checkPillOverflow);
  }, [checkPillOverflow, topTab]);

  const isEnabled = (skill: SkillDef) => !disabledSkills.has(skill.id);

  const handleToggleSkill = (skill: SkillDef) => {
    setDisabledSkills(prev => {
      const next = new Set(prev);
      if (next.has(skill.id)) next.delete(skill.id);
      else next.add(skill.id);
      return next;
    });
  };

  const handleInstallSkill = (skill: SkillDef) => {
    setInstallingSkills(prev => new Set(prev).add(skill.id));
    setTimeout(() => {
      setInstallingSkills(prev => { const next = new Set(prev); next.delete(skill.id); return next; });
    }, 1800);
  };

  const allSkills = SKILL_CATEGORIES.flatMap(c => c.skills);
  const installedSkills = allSkills.filter(s => s.source === 'custom');
  const exploreSkills = allSkills.filter(s => s.source === 'official');

  const [yoursSubTab, setYoursSubTab] = useState<'all' | 'personal' | 'installed'>('all');

  const baseSkills = (() => {
    if (topTab === 'explore') return exploreSkills;
    if (yoursSubTab === 'personal') return installedSkills.filter(s => ['custom-skill-builder', 'claude-code', 'coding-agent', 'github-issues'].includes(s.id));
    if (yoursSubTab === 'installed') return installedSkills.filter(s => !['custom-skill-builder', 'claude-code', 'coding-agent', 'github-issues'].includes(s.id));
    return installedSkills;
  })();

  const filteredSkills = (() => {
    let list = baseSkills;
    if (filter !== 'all') {
      const cat = SKILL_CATEGORIES.find(c => c.id === filter);
      if (cat) list = list.filter(s => cat.skills.some(cs => cs.id === s.id));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q));
    }
    return list;
  })();

  const personalCount = installedSkills.filter(s => ['custom-skill-builder', 'claude-code', 'coding-agent', 'github-issues'].includes(s.id)).length;
  const installedCount = installedSkills.length - personalCount;

  const categoryTabs: { id: SkillFilter; label: string; count: number }[] = topTab === 'explore'
    ? [
        { id: 'all' as SkillFilter, label: t('ws.common.all'), count: exploreSkills.length },
        ...SKILL_CATEGORIES
          .map(c => ({
            id: c.id,
            label: c.label,
            count: exploreSkills.filter(s => c.skills.some(cs => cs.id === s.id)).length,
          }))
          .filter(c => c.count > 0),
      ]
    : [
        { id: 'all' as SkillFilter, label: t('ws.common.all'), count: baseSkills.length },
        ...SKILL_CATEGORIES
          .map(c => ({
            id: c.id,
            label: c.label,
            count: baseSkills.filter(s => c.skills.some(cs => cs.id === s.id)).length,
          }))
          .filter(c => c.count > 0),
      ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-2 pb-6 sm:pb-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="heading-page">{t('ws.skills.title')}</h1>
            <p className="heading-page-desc">{t('ws.skills.subtitle')}</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="link-github-star group"
            >
              <Star size={13} className="text-amber-500 group-hover:fill-amber-500 transition-colors shrink-0" />
              {t('ws.common.starOnGitHub')}
              <ArrowUpRight size={11} className="shrink-0 translate-y-px" />
            </a>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('ws.common.search')}
                className="w-48 pl-9 pr-3 py-1.5 rounded-lg border border-border bg-surface-1 text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[var(--color-brand-primary)]/30 focus:ring-1 focus:ring-[var(--color-brand-primary)]/20 transition-colors"
              />
            </div>
            <button
              onClick={() => setImportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-text-primary text-white text-[12px] font-medium hover:opacity-85 transition-opacity"
            >
              <Plus size={12} />
              {t('ws.skills.import')}
            </button>
          </div>
        </div>

        {/* Top-level tabs: Explore / Yours — segment control */}
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-surface-2 mb-4">
          {([
            { id: 'yours' as const, label: t('ws.skills.yours'), icon: Settings2 },
            { id: 'explore' as const, label: t('ws.skills.explore'), icon: Compass },
          ]).map((tab) => {
            const active = topTab === tab.id;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setTopTab(tab.id); setFilter('all'); setYoursSubTab('all'); }}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${
                  active
                    ? 'bg-white text-text-primary shadow-[var(--shadow-rest)]'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <TabIcon size={14} />
                {tab.label}
                {tab.id === 'yours' && installedSkills.length > 0 && (
                  <span className={`tabular-nums text-[12px] ${active ? 'text-text-secondary' : 'text-text-tertiary'}`}>
                    {installedSkills.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Yours sub-tabs: All / Personal / Installed */}
        {topTab === 'yours' && (
          <div className="flex items-center gap-2 mb-3">
            {([
              { id: 'all' as const, label: t('ws.common.all'), count: installedSkills.length },
              { id: 'personal' as const, label: t('ws.skills.personal'), count: personalCount },
              { id: 'installed' as const, label: t('ws.skills.installed'), count: installedCount },
            ]).map((tab) => {
              const active = yoursSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setYoursSubTab(tab.id); setFilter('all'); }}
                  className={`shrink-0 inline-flex items-center justify-center rounded-full h-7 px-3 text-[11px] leading-none font-medium transition-all ${
                    active
                      ? 'bg-[var(--color-accent)] text-white'
                      : 'border border-border bg-surface-1 text-text-secondary hover:text-text-primary hover:border-border-hover'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-1 tabular-nums ${active ? 'opacity-80' : 'opacity-50'}`}>{tab.count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Category pill filters (Explore only) */}
        {topTab === 'explore' && (
          <div className="relative mb-5">
          <div
            ref={pillScrollRef}
            onScroll={checkPillOverflow}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5"
          >
            {categoryTabs.map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  ref={tab.id === categoryTabs[categoryTabs.length - 1].id ? () => { setTimeout(checkPillOverflow, 0); } : undefined}
                  className={`shrink-0 inline-flex items-center justify-center rounded-full h-7 px-3 text-[11px] leading-none font-medium transition-all ${
                    active
                      ? 'bg-[var(--color-accent)] text-white'
                      : 'border border-border bg-surface-1 text-text-secondary hover:text-text-primary hover:border-border-hover'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-1 tabular-nums ${active ? 'opacity-80' : 'opacity-50'}`}>{tab.count}</span>
                </button>
              );
            })}
          </div>
          {showPillFadeLeft && (
            <div className="pointer-events-none absolute top-0 left-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-[1]" />
          )}
          {showPillFade && (
            <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-[1]" />
          )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredSkills.map((skill) => {
            const enabled = isEnabled(skill);
            const catInfo = SKILL_CATEGORIES.find(c => c.skills.some(s => s.id === skill.id));

            return (
              <div
                key={skill.id}
                className={`card flex flex-col p-4 ${skill.source === 'custom' && !enabled ? 'opacity-55' : ''}`}
              >
                {/* Header: Icon + Name + Tag */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-[10px] bg-white border border-border flex items-center justify-center shrink-0">
                    {skill.logo ? (
                      <img src={skill.logo} alt="" className="w-[18px] h-[18px] object-contain" />
                    ) : (
                      <skill.icon size={18} className="text-text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-text-heading truncate">{skill.name}</div>
                    {catInfo && (
                      <span className="text-[11px] text-text-muted">{catInfo.label}</span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-[12px] text-text-tertiary leading-[1.5] line-clamp-2 mb-3">{skill.desc}</p>

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between">
                  {skill.source === 'custom' ? (
                    <>
                      <Switch size="xs" checked={enabled} onCheckedChange={() => handleToggleSkill(skill)} />
                      <button
                        onClick={(e) => { e.stopPropagation(); }}
                        className="text-[12px] font-medium text-text-muted hover:text-[var(--color-danger)] transition-colors"
                      >
                        {t('ws.skills.uninstall')}
                      </button>
                    </>
                  ) : (
                    <>
                      <span />
                      {installingSkills.has(skill.id) ? (
                        <span className="inline-flex items-center gap-1.5 rounded-[8px] px-[14px] py-[5px] text-[12px] font-medium border border-border text-text-muted cursor-default">
                          <Loader2 size={12} className="animate-spin" />
                          {t('ws.skills.installing')}
                        </span>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleInstallSkill(skill); }}
                          className="rounded-[8px] px-[14px] py-[5px] text-[12px] font-medium border border-border text-text-primary hover:bg-surface-2 hover:border-border-hover transition-colors"
                        >
                          {t('ws.skills.install')}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-12">
            <Search size={24} className="mx-auto text-text-muted mb-3" />
            <div className="text-[13px] text-text-muted">
              {topTab === 'yours' && !searchQuery.trim()
                ? t('ws.skills.emptyYours')
                : t('ws.skills.emptySearch')}
            </div>
          </div>
        )}
      </div>

      <ImportSkillModal open={importModalOpen} onClose={() => setImportModalOpen(false)} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Home Dashboard                                                     */
/* ------------------------------------------------------------------ */



const WELCOME_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours
const WELCOME_STORAGE_KEY = 'nexu_welcome_last_shown';

function shouldShowTypingEffect(): boolean {
  const fromSetup = !!sessionStorage.getItem('nexu_from_setup');
  if (fromSetup) return true;
  const lastShown = localStorage.getItem(WELCOME_STORAGE_KEY);
  if (!lastShown) return true;
  const elapsed = Date.now() - parseInt(lastShown, 10);
  return elapsed >= WELCOME_INTERVAL_MS;
}


/* ── Channel icons for onboarding ── */
function FeishuIconSetup({ size = 20, light }: { size?: number; light?: boolean }) {
  return (
    <img
      src="/feishu-logo.png"
      width={size}
      height={size}
      alt="Feishu"
      style={{ objectFit: 'contain', ...(light ? { filter: 'brightness(0) invert(1)' } : {}) }}
    />
  );
}
function SlackIconSetup({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#E01E5A" />
      <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.527 2.527 0 0 1 2.521 2.521 2.527 2.527 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#36C5F0" />
      <path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.27 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.163 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" fill="#2EB67D" />
      <path d="M15.163 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.163 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.27a2.527 2.527 0 0 1-2.52-2.523 2.527 2.527 0 0 1 2.52-2.52h6.315A2.528 2.528 0 0 1 24 15.163a2.528 2.528 0 0 1-2.522 2.523h-6.315z" fill="#ECB22E" />
    </svg>
  );
}
function DiscordIconSetup({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#5865F2">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

const ONBOARDING_CHANNELS = [
  { id: 'feishu', name: 'Feishu', shortName: 'Feishu', icon: FeishuIconSetup, color: '#FFFFFF', recommended: true, docUrl: 'https://docs.nexu.ai/channels/feishu', chatUrl: 'https://www.feishu.cn/' },
  { id: 'slack', name: 'Slack', shortName: 'Slack', icon: SlackIconSetup, color: '#FFFFFF', docUrl: 'https://docs.nexu.ai/channels/slack', chatUrl: 'https://slack.com/' },
  { id: 'discord', name: 'Discord', shortName: 'Discord', icon: DiscordIconSetup, color: '#FFFFFF', docUrl: 'https://docs.nexu.ai/channels/discord', chatUrl: 'https://discord.com/' },
];

const CHANNELS_CONNECTED_KEY = 'nexu_channels_connected';
const CHANNEL_ACTIVE_KEY = 'nexu_channel_active';

const CHANNEL_CONFIG_FIELDS: Record<string, { id: string; label: string; placeholder: string; helpText: string }[]> = {
  feishu: [
    { id: 'appId', label: 'App ID', placeholder: 'cli_xxxxxxxxxxxxxxxx', helpText: 'Found in Feishu Open Platform > App Credentials' },
    { id: 'appSecret', label: 'App Secret', placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', helpText: 'Found in Feishu Open Platform > App Credentials' },
  ],
  slack: [
    { id: 'botToken', label: 'Bot User OAuth Token', placeholder: 'xoxb-...', helpText: 'Found in Slack App > OAuth & Permissions' },
    { id: 'signingSecret', label: 'Signing Secret', placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', helpText: 'Found in Slack App > Basic Information' },
  ],
  discord: [
    { id: 'appId', label: 'App ID', placeholder: '000000000000000000', helpText: 'Found in Discord Developer Portal > General Information' },
    { id: 'botToken', label: 'Bot Token', placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', helpText: 'Found in Discord Developer Portal > Bot' },
  ],
};


function HomeDashboard({ onNavigate, showTyping: _showTyping, onTypingComplete: _onTypingComplete, stars }: {
  onNavigate: (view: View) => void;
  showTyping?: boolean;
  onTypingComplete?: () => void;
  stars?: number | null;
}) {
  const { t } = useLocale();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoHover, setVideoHover] = useState(false);
  const [connectedIds, setConnectedIds] = useState<Set<string>>(() => {
    try { const v = localStorage.getItem(CHANNELS_CONNECTED_KEY); return v ? new Set(JSON.parse(v)) : new Set(); } catch { return new Set(); }
  });
  const [activeChannelId, setActiveChannelId] = useState(() => localStorage.getItem(CHANNEL_ACTIVE_KEY) || '');
  const [configChannel, setConfigChannel] = useState<string | null>(null);
  const [configValues, setConfigValues] = useState<Record<string, string>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [selectedModelId, setSelectedModelId] = useState('nexu-claude-opus-4-6');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [modelSearch, setModelSearch] = useState('');
  const [expandedProviders, setExpandedProviders] = useState<Set<string>>(new Set());
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const hasChannel = connectedIds.size > 0;
  const connectedChannels = ONBOARDING_CHANNELS.filter(c => connectedIds.has(c.id));
  const providerDetails = getProviderDetails();
  const enabledProviders = providerDetails.filter(p => p.enabled);
  const allEnabledModels = enabledProviders.flatMap(p => p.models.filter(m => m.enabled).map(m => ({ ...m, providerId: p.id, providerName: p.name })));
  const selectedModel = allEnabledModels.find(m => m.id === selectedModelId) ?? allEnabledModels[0];

  useEffect(() => {
    if (!showModelDropdown) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(e.target as Node)) {
        setShowModelDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showModelDropdown]);

  useEffect(() => {
    if (showModelDropdown) {
      setModelSearch('');
      const selectedProvider = enabledProviders.find(p => p.models.some(m => m.id === selectedModelId));
      setExpandedProviders(new Set(selectedProvider ? [selectedProvider.id] : enabledProviders.length > 0 ? [enabledProviders[0].id] : []));
    }
  }, [showModelDropdown]);

  const persistChannels = (ids: Set<string>, active: string) => {
    localStorage.setItem(CHANNELS_CONNECTED_KEY, JSON.stringify([...ids]));
    localStorage.setItem(CHANNEL_ACTIVE_KEY, active);
  };

  const handleDisconnectChannel = (channelId: string) => {
    const next = new Set(connectedIds);
    next.delete(channelId);
    const nextActive = activeChannelId === channelId ? ([...next][0] || '') : activeChannelId;
    setConnectedIds(next);
    setActiveChannelId(nextActive);
    persistChannels(next, nextActive);
  };

  const handleConnectChannel = (channelId: string) => {
    const next = new Set(connectedIds);
    next.add(channelId);
    setConnectedIds(next);
    setActiveChannelId(channelId);
    persistChannels(next, channelId);
    setConfigChannel(null);
    setConfigValues({});
    setShowSecrets({});
  };

  const handleOpenConfig = (channelId: string) => {
    setConfigChannel(channelId);
    setConfigValues({});
    setShowSecrets({});
  };

  const handleCloseConfig = () => {
    setConfigChannel(null);
    setConfigValues({});
    setShowSecrets({});
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.loop = false;
    v.play().catch(() => {});
    const onEnded = () => { v.pause(); };
    v.addEventListener('ended', onEnded);
    return () => v.removeEventListener('ended', onEnded);
  }, [hasChannel]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (videoHover) {
      v.currentTime = 0;
      v.loop = true;
      v.play().catch(() => {});
    } else {
      v.loop = false;
    }
  }, [videoHover]);

  /* ── Scene A: First-run — Top (Hero) + Middle (Channels) only ── */
  if (!hasChannel) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">

          {/* ═══ TOP: Hero — Bot idle, waiting to be activated ═══ */}
          <div className="flex flex-col items-center text-center">
            <div
              className="relative w-32 h-32 mb-1 cursor-default"
              onMouseEnter={() => setVideoHover(true)}
              onMouseLeave={() => setVideoHover(false)}
            >
              <video
                ref={videoRef}
                src="/nexu-alpha.mp4"
                poster="/nexu-alpha-poster.jpg"
                preload="auto"
                autoPlay
                muted
                playsInline
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-[32px] font-normal tracking-tight text-text-primary mb-1.5" style={{ fontFamily: 'var(--font-script)' }}>nexu alpha</h2>
            <div className="flex items-center gap-3 text-[11px] text-text-muted">
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--color-warning)]/10 text-[var(--color-warning)] leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-warning)] animate-pulse shrink-0" />
                {t('ws.home.idle')}
              </span>
              <span>{t('ws.home.waitingForActivation')}</span>
            </div>

            {/* Speech bubble — minimal pill */}
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-1 border border-border/60 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)] animate-pulse shrink-0" />
              <span className="text-[12px] text-text-secondary">{t('ws.home.connectToActivate')}</span>
            </div>
          </div>

          {/* ═══ MIDDLE: Channels — default open, Feishu highlighted ═══ */}
          <div className="card overflow-visible">
            <div className="px-5 pt-4 pb-3">
              <span className="text-[12px] font-medium text-text-primary">{t('ws.home.chooseChannel')}</span>
            </div>
            <div className="px-5 pb-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {ONBOARDING_CHANNELS.map(ch => {
                  const Icon = ch.icon;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => handleOpenConfig(ch.id)}
                      className={`group relative rounded-xl border px-3 py-3 text-left transition-all cursor-pointer active:scale-[0.98] border-border bg-surface-0 hover:border-border-hover hover:bg-surface-1 ${
                        ch.recommended ? 'animate-breathe' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-border bg-white shrink-0">
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[13px] font-medium text-text-primary">{ch.name}</div>
                          <div className="mt-0.5 text-[11px] text-text-muted">{t('ws.home.addNexuBot')}</div>
                        </div>
                        <ArrowRight size={13} className="text-text-muted group-hover:text-text-secondary transition-colors shrink-0 mt-0.5" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* Channel config modal */}
        {configChannel && (() => {
          const ch = ONBOARDING_CHANNELS.find(c => c.id === configChannel)!;
          const fields = CHANNEL_CONFIG_FIELDS[configChannel] || [];
          const Icon = ch.icon;
          const allFilled = fields.every(f => (configValues[f.id] || '').trim().length > 0);
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseConfig} />
              <div className="relative w-full max-w-md mx-4 rounded-2xl border border-border bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-border bg-white">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-semibold text-text-primary">{t('ws.common.connect')} {ch.name}</h3>
                      <p className="text-[11px] text-text-muted">{t('ws.home.configureCredentials')}</p>
                    </div>
                  </div>
                  <button onClick={handleCloseConfig} className="p-1.5 rounded-lg hover:bg-surface-2 text-text-muted hover:text-text-secondary transition-colors">
                    <X size={16} />
                  </button>
                </div>
                {/* Fields */}
                <div className="px-6 py-5 space-y-4">
                  {fields.map(field => (
                    <div key={field.id}>
                      <label className="block text-[12px] font-medium text-text-primary mb-1.5">{field.label}</label>
                      <div className="relative">
                        <input
                          type={showSecrets[field.id] ? 'text' : 'password'}
                          value={configValues[field.id] || ''}
                          onChange={e => setConfigValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                          placeholder={field.placeholder}
                          className="w-full px-3 py-2 pr-9 rounded-lg border border-border bg-surface-0 text-[13px] text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 focus:border-[var(--color-brand-primary)]/30 transition-colors font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSecrets(prev => ({ ...prev, [field.id]: !prev[field.id] }))}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                        >
                          {showSecrets[field.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                      <p className="text-[11px] text-text-muted mt-1">{field.helpText}</p>
                    </div>
                  ))}
                  {/* Doc link */}
                  <a
                    href={ch.docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link mt-1"
                  >
                    <FileText size={13} />
                    {t('ws.home.viewSetupGuide').replace('{name}', ch.name)}
                  </a>
                </div>
                {/* Footer */}
                <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
                  <button
                    onClick={handleCloseConfig}
                    className="px-4 py-2 rounded-lg text-[13px] font-medium text-text-secondary hover:bg-surface-2 transition-colors"
                  >
                    {t('ws.common.cancel')}
                  </button>
                  <button
                    onClick={() => handleConnectChannel(configChannel)}
                    disabled={!allFilled}
                    className="px-4 py-2 rounded-lg text-[13px] font-medium bg-accent text-accent-fg hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {t('ws.common.connect')}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    );
  }

  /* ── Scene C: Operational — compact hero, efficiency-first ── */
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">

        {/* ═══ TOP: Compact Hero — Bot + CTA ═══ */}
        <div className="flex items-center gap-4">
          <div
            className="relative w-28 h-28 shrink-0 cursor-default"
            onMouseEnter={() => setVideoHover(true)}
            onMouseLeave={() => setVideoHover(false)}
          >
            <video
              ref={videoRef}
              src="/nexu-alpha.mp4"
              poster="/nexu-alpha-poster.jpg"
              preload="auto"
              autoPlay
              muted
              playsInline
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 w-full">
              <h2 className="text-[32px] font-normal tracking-tight text-text-primary leading-none m-0" style={{ fontFamily: 'var(--font-script)' }}>nexu alpha</h2>
              <span className="flex items-center gap-1 px-1.5 py-1 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)] text-[10px] font-medium leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] shrink-0" />
                {t('ws.home.running')}
              </span>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="link-github-star group ml-auto shrink-0"
              >
                <Star size={12} className="text-amber-500 group-hover:fill-amber-500 transition-colors shrink-0" />
                {t('ws.common.starOnGitHub')}
                {stars && stars > 0 && (
                  <span className="tabular-nums text-text-muted text-[10px]">({stars.toLocaleString()})</span>
                )}
                <ArrowUpRight size={11} className="shrink-0 translate-y-px" />
              </a>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="relative" ref={modelDropdownRef}>
                <button
                  onClick={() => setShowModelDropdown(!showModelDropdown)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-surface-0 hover:border-border-hover hover:bg-surface-1 transition-all text-[12px] text-text-primary"
                >
                  {selectedModel ? (
                    <span className="w-4 h-4 shrink-0 flex items-center justify-center"><ProviderLogo provider={getModelIconProvider(selectedModel.name) || selectedModel.providerId} size={14} /></span>
                  ) : (
                    <Cpu size={13} className="text-text-muted" />
                  )}
                  <span className="font-medium">{selectedModel?.name ?? t('ws.home.notSelected')}</span>
                  <ChevronDown size={10} className={`text-text-muted transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showModelDropdown && (() => {
                  const query = modelSearch.toLowerCase().trim();
                  const filteredProviders = enabledProviders.map(p => ({
                    ...p,
                    models: p.models.filter(m => m.enabled && (!query || m.name.toLowerCase().includes(query) || p.name.toLowerCase().includes(query)))
                  })).filter(p => p.models.length > 0);

                  return (
                    <div className="absolute z-50 mt-2 left-0 w-[280px] rounded-xl border border-border bg-surface-1 shadow-xl">
                      <div className="px-3 pt-3 pb-2">
                        <div className="flex items-center gap-2.5 rounded-lg bg-surface-0 border border-border px-3 py-1.5">
                          <Search size={12} className="text-text-muted shrink-0" />
                          <input
                            type="text"
                            value={modelSearch}
                            onChange={e => {
                              setModelSearch(e.target.value);
                              if (e.target.value.trim()) {
                                setExpandedProviders(new Set(enabledProviders.map(p => p.id)));
                              }
                            }}
                            placeholder={t('ws.home.searchModels')}
                            className="flex-1 bg-transparent text-[12px] text-text-primary placeholder:text-text-muted/50 outline-none"
                            autoFocus
                          />
                        </div>
                      </div>
                      <div className="relative">
                        <div className="max-h-[280px] overflow-y-auto py-1" style={{ overscrollBehavior: 'contain' }}>
                          {filteredProviders.length === 0 ? (
                            <div className="px-4 py-6 text-center text-[12px] text-text-muted">{t('ws.home.noMatchingModels')}</div>
                          ) : (
                            filteredProviders.map(provider => {
                              const isExpanded = expandedProviders.has(provider.id) || !!query;
                              return (
                                <div key={provider.id}>
                                  <button
                                    onClick={() => {
                                      if (query) return;
                                      setExpandedProviders(prev => {
                                        const next = new Set(prev);
                                        if (next.has(provider.id)) next.delete(provider.id);
                                        else next.add(provider.id);
                                        return next;
                                      });
                                    }}
                                    className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-surface-2/50 transition-colors"
                                  >
                                    <ChevronDown size={10} className={`text-text-muted/50 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
                                    <span className="w-4 h-4 shrink-0 flex items-center justify-center"><ProviderLogo provider={provider.id} size={13} /></span>
                                    <span className="text-[11px] font-medium text-text-secondary">{provider.name}</span>
                                    <span className="text-[10px] text-text-muted/40 ml-auto tabular-nums">{provider.models.length}</span>
                                  </button>
                                  {isExpanded && provider.models.map(model => (
                                    <button
                                      key={model.id}
                                      onClick={() => { setSelectedModelId(model.id); setShowModelDropdown(false); }}
                                      className={`w-full flex items-center gap-2 pl-8 pr-3 py-1.5 text-left transition-colors hover:bg-surface-2 ${model.id === selectedModelId ? 'bg-accent/5' : ''}`}
                                    >
                                      {model.id === selectedModelId ? <Check size={11} className="text-accent shrink-0" /> : <span className="w-[11px] shrink-0" />}
                                      <span className="text-[12px] font-medium text-text-primary truncate flex-1">{model.name}</span>
                                      <span className="text-[10px] text-text-muted/50 tabular-nums shrink-0">{model.contextWindow}</span>
                                    </button>
                                  ))}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                      <div className="border-t border-border px-2 py-1.5">
                        <button
                          onClick={() => { setShowModelDropdown(false); onNavigate({ type: 'settings' }); }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors hover:bg-surface-2"
                        >
                          <Settings size={11} className="text-text-primary" />
                          <span className="text-[11px] font-medium text-text-primary">{t('ws.home.configureProviders')}</span>
                          <ArrowRight size={10} className="text-text-secondary ml-auto" />
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-text-muted ml-3">
                <span>{t('ws.home.messagesToday')}</span>
                <span className="text-border">·</span>
                <span>{t('ws.home.activeAgo')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ MIDDLE: Channels Panel ═══ */}
        <div className="card card-static">
          <div className="px-5 pt-4 pb-3">
            <h2 className="text-[14px] font-semibold text-text-primary">{t('ws.home.channels')}</h2>
          </div>
          <div className="px-5 pb-5">
            {(true) && (
              <div className="space-y-3">
                {/* Connected channels — click to switch active */}
                {connectedChannels.length > 0 && (
                  <div className="space-y-1.5">
                    {connectedChannels.map(ch => {
                      const Icon = ch.icon;
                      return (
                        <div
                          key={ch.id}
                          onClick={() => openExternal(ch.chatUrl)}
                          className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 cursor-pointer transition-all hover:bg-surface-1"
                        >
                          <div className="w-8 h-8 rounded-[10px] flex items-center justify-center border border-border bg-white shrink-0">
                            <Icon size={16} />
                          </div>
                          <div className="flex-1 min-w-0 flex items-center gap-2">
                            <span className="text-[13px] font-semibold text-text-primary">{ch.name}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] shrink-0" />
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDisconnectChannel(ch.id); }}
                            className="rounded-[8px] px-[14px] py-[5px] text-[12px] font-medium bg-surface-2 text-text-secondary hover:text-[var(--color-danger)] hover:bg-surface-3 transition-colors shrink-0"
                          >
                            {t('ws.home.connected')}
                          </button>
                          <span className="inline-flex items-center gap-1 text-[12px] font-medium text-text-secondary hover:text-text-primary transition-colors ml-3 shrink-0 leading-none">
                            {t('ws.home.chat')}
                            <ArrowUpRight size={12} className="-mt-px" />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Not-yet-connected channels */}
                {ONBOARDING_CHANNELS.filter(ch => !connectedIds.has(ch.id)).length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ONBOARDING_CHANNELS.filter(ch => !connectedIds.has(ch.id)).map(ch => {
                      const Icon = ch.icon;
                      return (
                        <button
                          key={ch.id}
                          onClick={() => handleOpenConfig(ch.id)}
                          className="group flex items-center gap-2.5 rounded-lg border border-dashed border-border bg-surface-0 px-3 py-2 text-left hover:border-solid hover:border-border-hover hover:bg-surface-1 transition-all"
                        >
                          <div className="w-6 h-6 rounded-md flex items-center justify-center bg-surface-1 shrink-0">
                            <Icon size={13} />
                          </div>
                          <span className="text-[12px] font-medium text-text-muted group-hover:text-text-secondary flex-1 truncate">{ch.name}</span>
                          <Cable size={12} className="text-text-muted group-hover:text-text-primary transition-colors shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ═══ BOTTOM: GitHub Star Banner — echoes link-github-star, disappears after star ═══ */}
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-2xl border border-border bg-white p-5 shadow-[var(--shadow-rest)] transition-all hover:scale-[1.01] hover:border-border-hover hover:shadow-[var(--shadow-refine)] cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-[12px] bg-amber-50 border border-amber-200/60 flex items-center justify-center shrink-0">
              <Star size={20} className="text-amber-500 group-hover:fill-amber-500 transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-semibold text-text-primary">{t('ws.home.starNexu')}</div>
              <div className="text-[12px] text-text-secondary mt-0.5">
                {t('ws.home.starCta')}
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {stars && stars > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50/80 border border-amber-200/50 text-[12px] font-medium text-[#92400e]">
                  <Star size={12} className="text-amber-500 fill-amber-500" />
                  <span className="tabular-nums">{stars.toLocaleString()}</span>
                </div>
              )}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(251,191,36,0.12)] border border-amber-200/60 text-[12px] font-medium text-[#b45309] group-hover:bg-[rgba(251,191,36,0.2)] group-hover:border-amber-300/60 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                <span>{t('ws.home.github')}</span>
                <ArrowUpRight size={11} className="shrink-0 translate-y-px" />
              </div>
            </div>
          </div>
        </a>

      </div>

      {/* Channel config modal — shared across scenes */}
      {configChannel && (() => {
        const ch = ONBOARDING_CHANNELS.find(c => c.id === configChannel)!;
        const fields = CHANNEL_CONFIG_FIELDS[configChannel] || [];
        const Icon = ch.icon;
        const allFilled = fields.every(f => (configValues[f.id] || '').trim().length > 0);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseConfig} />
            <div className="relative w-full max-w-md mx-4 rounded-2xl border border-border bg-white shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-border bg-white">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-semibold text-text-primary">{t('ws.common.connect')} {ch.name}</h3>
                    <p className="text-[11px] text-text-muted">{t('ws.home.configureCredentials')}</p>
                  </div>
                </div>
                <button onClick={handleCloseConfig} className="p-1.5 rounded-lg hover:bg-surface-2 text-text-muted hover:text-text-secondary transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="px-6 py-5 space-y-4">
                {fields.map(field => (
                  <div key={field.id}>
                    <label className="block text-[12px] font-medium text-text-primary mb-1.5">{field.label}</label>
                    <div className="relative">
                      <input
                        type={showSecrets[field.id] ? 'text' : 'password'}
                        value={configValues[field.id] || ''}
                        onChange={e => setConfigValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 pr-9 rounded-lg border border-border bg-surface-0 text-[13px] text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 focus:border-[var(--color-brand-primary)]/30 transition-colors font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecrets(prev => ({ ...prev, [field.id]: !prev[field.id] }))}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                      >
                        {showSecrets[field.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    <p className="text-[11px] text-text-muted mt-1">{field.helpText}</p>
                  </div>
                ))}
                <a href={ch.docUrl} target="_blank" rel="noopener noreferrer" className="text-link mt-1">
                  <FileText size={13} />
                  {t('ws.home.viewSetupGuide').replace('{name}', ch.name)}
                </a>
              </div>
              <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
                <button onClick={handleCloseConfig} className="px-4 py-2 rounded-lg text-[13px] font-medium text-text-secondary hover:bg-surface-2 transition-colors">
                  {t('ws.common.cancel')}
                </button>
                <button
                  onClick={() => handleConnectChannel(configChannel)}
                  disabled={!allFilled}
                  className="px-4 py-2 rounded-lg text-[13px] font-medium bg-accent text-accent-fg hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {t('ws.common.connect')}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}



/* ------------------------------------------------------------------ */
/*  Conversations View                                                 */
/* ------------------------------------------------------------------ */

function ConversationsView({ initialChannelId }: { initialChannelId?: string }) {
  const { t } = useLocale();
  const channels = MOCK_CHANNELS;
  const channelId = initialChannelId ?? (channels[0]?.id ?? '');

  if (!channelId) {
    return (
      <div className="flex items-center justify-center h-full w-full text-[13px] text-text-muted">
        {t('ws.conversations.selectFromSidebar')}
      </div>
    );
  }

  return <ChannelDetailPage channelId={channelId} />;
}

/* ------------------------------------------------------------------ */
/*  Deployments View                                                   */
/* ------------------------------------------------------------------ */

function DeploymentsView() {
  const { t } = useLocale();
  const deployments = MOCK_DEPLOYMENTS;
  const channelMap = Object.fromEntries(MOCK_CHANNELS.map(c => [c.id, c.name]));

  const statusDot: Record<string, string> = {
    live: 'status-dot-live',
    building: 'status-dot-building',
    failed: 'status-dot-failed',
  };
  const statusLabel: Record<string, { textKey: string; color: string }> = {
    live: { textKey: 'ws.deployments.statusLive', color: 'text-[var(--color-success)]' },
    building: { textKey: 'ws.deployments.statusBuilding', color: 'text-[var(--color-warning)]' },
    failed: { textKey: 'ws.deployments.statusFailed', color: 'text-[var(--color-danger)]' },
  };

  const colStyle = { gridTemplateColumns: '1fr 88px 112px 140px 40px' };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="heading-page">{t('ws.deployments.title')}</h1>
          <p className="heading-page-desc">{t('ws.deployments.subtitle')}</p>
        </div>

        <div className="data-table">
          <div className="data-table-header" style={colStyle}>
            <span>{t('ws.deployments.colName')}</span>
            <span>{t('ws.deployments.colStatus')}</span>
            <span>{t('ws.deployments.colChannel')}</span>
            <span>{t('ws.deployments.colDeployed')}</span>
            <span />
          </div>
          {deployments.map(d => {
            const channelName = d.channelId ? channelMap[d.channelId] : null;
            const sl = statusLabel[d.status] ?? statusLabel.live!;
            return (
              <div key={d.id} className="data-table-row" style={colStyle}>
                <span className="text-[13px] font-medium text-text-primary truncate" title={d.title}>{d.title}</span>
                <span className="flex items-center gap-1.5">
                  <span className={`status-dot ${statusDot[d.status] ?? ''}`} />
                  <span className={`text-[12px] font-medium ${sl.color}`}>{t(sl.textKey)}</span>
                </span>
                <span>
                  {channelName && (
                    <span className="text-[11px] leading-none px-2 py-0.5 rounded-full bg-surface-2 text-text-muted">{channelName}</span>
                  )}
                </span>
                <span className="text-[12px] tabular-nums text-text-muted">{d.createdAt}</span>
                <span>
                  {d.url && (
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group/link w-6 h-6 rounded-md flex items-center justify-center text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-colors relative"
                      title={d.url.replace(/^https?:\/\//, '')}
                    >
                      <ArrowUpRight size={12} />
                    </a>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Settings View                                                      */
/* ------------------------------------------------------------------ */

type SettingsTab = 'providers';

function isSettingsTab(value: string | null): value is SettingsTab {
  return value === 'providers';
}

function isModelProvider(value: string | null): value is ModelProvider {
  return value === 'nexu' || value === 'anthropic' || value === 'openai' || value === 'google' || value === 'xai' || value === 'kimi' || value === 'glm' || value === 'minimax' || value === 'openrouter' || value === 'siliconflow' || value === 'ppio' || value === 'xiaoxiang';
}

function SettingsView({
  initialTab = 'providers',
  initialProviderId = 'anthropic',
}: {
  initialTab?: SettingsTab;
  initialProviderId?: ModelProvider;
}) {
  const { t } = useLocale();
  const settingsTab: SettingsTab = initialTab;
  const providers = getProviderDetails();
  const [configuredProviders, setConfiguredProviders] = useState<Set<string>>(() => new Set(['nexu']));
  const availableModels = providers
    .filter(p => p.id === 'nexu' || configuredProviders.has(p.id))
    .flatMap(p => p.models.map(m => ({ ...m, providerName: p.name, providerId: p.id })));
  const [activeProviderId, setActiveProviderId] = useState<ModelProvider>(initialProviderId);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(() => {
    const nexu = providers.find(p => p.id === 'nexu');
    return nexu?.models[0]?.id ?? null;
  });
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, { apiKey: string; proxyUrl: string }>>({});
  const [savedValues, setSavedValues] = useState<Record<string, { apiKey: string; proxyUrl: string }>>({});
  const [saveStates, setSaveStates] = useState<Record<string, 'idle' | 'saving' | 'saved'>>({});
  const [saveErrors, setSaveErrors] = useState<Record<string, string>>({});
  const [showSavedBannerFor, setShowSavedBannerFor] = useState<string | null>(null);
  const [checkStates, setCheckStates] = useState<Record<string, 'idle' | 'checking' | 'success' | 'error'>>({});
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  const activeProvider = providers.find(p => p.id === activeProviderId) ?? providers[0];
  const selectedModel = selectedModelId ? availableModels.find(m => m.id === selectedModelId) ?? null : null;

  useEffect(() => {
    if (!showModelDropdown) return;
    const handler = (e: MouseEvent) => {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(e.target as Node)) {
        setShowModelDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showModelDropdown]);

  const getFormValues = (providerId: string) => {
    const p = providers.find(x => x.id === providerId);
    return formValues[providerId] ?? { apiKey: '', proxyUrl: p?.proxyUrl ?? '' };
  };

  const isDirty = (providerId: string) => {
    const saved = savedValues[providerId];
    if (!saved) return true;
    const curr = getFormValues(providerId);
    return curr.apiKey !== saved.apiKey || curr.proxyUrl !== saved.proxyUrl;
  };

  const setFormField = (providerId: string, field: 'apiKey' | 'proxyUrl', value: string) => {
    setFormValues(prev => {
      const curr = prev[providerId] ?? { apiKey: '', proxyUrl: providers.find(p => p.id === providerId)?.proxyUrl ?? '' };
      return { ...prev, [providerId]: { ...curr, [field]: value } };
    });
    if (savedValues[providerId]) setSaveStates(prev => ({ ...prev, [providerId]: 'idle' }));
  };

  // Save = verify + save in one step
  const handleSave = (providerId: string) => {
    setSaveErrors(prev => ({ ...prev, [providerId]: '' }));
    setSaveStates(prev => ({ ...prev, [providerId]: 'saving' }));
    const curr = getFormValues(providerId);
    setTimeout(() => {
      const verifyOk = Math.random() > 0.2; // 80% success for prototype
      if (verifyOk) {
        setSaveStates(prev => ({ ...prev, [providerId]: 'saved' }));
        setSavedValues(prev => ({ ...prev, [providerId]: { ...curr } }));
        setConfiguredProviders(prev => new Set([...prev, providerId]));
        const p = providers.find(x => x.id === providerId);
        if (p?.models[0]) setSelectedModelId(p.models[0].id);
        setShowSavedBannerFor(providerId);
        setTimeout(() => setShowSavedBannerFor(null), 2500);
      } else {
        setSaveErrors(prev => ({ ...prev, [providerId]: 'ws.settings.connectionFailedShort' }));
        setSaveStates(prev => ({ ...prev, [providerId]: 'idle' }));
      }
    }, 1200);
  };

  const handleCheck = (providerId: string) => {
    setCheckStates(prev => ({ ...prev, [providerId]: 'checking' }));
    setTimeout(() => {
      setCheckStates(prev => ({ ...prev, [providerId]: Math.random() > 0.3 ? 'success' : 'error' }));
      setTimeout(() => setCheckStates(prev => ({ ...prev, [providerId]: 'idle' })), 3000);
    }, 1500);
  };

  const saveState = saveStates[activeProvider.id] ?? 'idle';
  const saveError = saveErrors[activeProvider.id] ?? '';
  const checkState = checkStates[activeProvider.id] ?? 'idle';
  const providerDirty = activeProvider.id !== 'nexu' && isDirty(activeProvider.id);
  const showSaved = saveState === 'saved' && !providerDirty;

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-2 pb-6 sm:pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="heading-page">{t('ws.settings.title')}</h2>
            <p className="heading-page-desc">{t('ws.settings.subtitle')}</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="link-github-star group"
            >
              <Star size={13} className="text-amber-500 group-hover:fill-amber-500 transition-colors shrink-0" />
              {t('ws.common.starOnGitHub')}
              <ArrowUpRight size={11} className="shrink-0 translate-y-px" />
            </a>
            <button
              onClick={() => openExternal('file:///Users/chaoxiaoche/Desktop/agent-digital-cowork/clone/')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-[12px] font-medium text-text-primary hover:border-border-hover hover:bg-surface-1 transition-colors"
            >
              <FolderOpen size={13} />
              {t('ws.settings.workspace')}
              <ArrowUpRight size={12} className="text-text-muted" />
            </button>
          </div>
        </div>

        {/* Nexu Bot model selector */}
        <div className="relative mb-8" ref={modelDropdownRef}>
          <div className="rounded-xl border border-border bg-surface-1 px-4 py-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center shrink-0">
                  <img src="/brand/nexu logo-black1.svg" alt="nexu" className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-text-primary">{t('ws.settings.nexuBotModel')}</div>
                  <div className="text-[11px] text-text-tertiary">{t('ws.settings.nexuBotModelDesc')}</div>
                </div>
              </div>
              <button
                onClick={() => setShowModelDropdown(v => !v)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface-0 hover:bg-surface-2 hover:border-border-hover transition-all text-[12px] font-medium text-text-primary"
              >
                {selectedModel ? (
                  <>
                    <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                      <ProviderLogo provider={selectedModel.providerId} size={14} />
                    </span>
                    {selectedModel.name}
                  </>
                ) : (
                  <span className="text-text-muted">{t('ws.settings.select')}</span>
                )}
                <ChevronDown size={13} className="text-text-muted" />
              </button>
            </div>
          </div>

          {showModelDropdown && (
            <div className="absolute top-full left-0 right-0 z-20 mt-1 rounded-xl border border-border bg-surface-0 shadow-lg overflow-hidden max-h-[320px] overflow-y-auto">
              {providers.filter(p => p.id === 'nexu' || configuredProviders.has(p.id)).map(p => (
                <div key={p.id}>
                  <div className="px-3 pt-2.5 pb-1 text-[10px] font-semibold text-text-tertiary uppercase tracking-wider sticky top-0 bg-surface-0">{p.name}</div>
                  {p.models.map(m => {
                    const isSelected = m.id === selectedModelId;
                    return (
                      <button
                        key={m.id}
                        onClick={() => { setSelectedModelId(m.id); setShowModelDropdown(false); }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${isSelected ? 'bg-accent/5' : 'hover:bg-surface-2'}`}
                      >
                        <span className="w-5 h-5 shrink-0 flex items-center justify-center">
                          <ProviderLogo provider={p.id} size={14} />
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className={`text-[12px] truncate ${isSelected ? 'font-semibold text-accent' : 'font-medium text-text-primary'}`}>{m.name}</div>
                          <div className="text-[10px] text-text-tertiary">{p.name}</div>
                        </div>
                        {isSelected && <Check size={14} className="text-accent shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {settingsTab === 'providers' && (
          <div className="flex gap-0 rounded-xl border border-border bg-surface-1 overflow-hidden" style={{ minHeight: 520 }}>
            {/* Left: Provider list — flat, no enabled/disabled split */}
            <div className="w-56 shrink-0 bg-surface-0 overflow-y-auto">
              <div className="p-2 space-y-0.5">
                {providers.map(p => {
                  const active = p.id === activeProviderId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setActiveProviderId(p.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                        active ? 'bg-surface-3' : 'hover:bg-surface-2'
                      }`}
                    >
                      <span className="w-5 h-5 shrink-0 flex items-center justify-center"><ProviderLogo provider={p.id} size={16} /></span>
                      <span className={`flex-1 text-[12px] font-medium truncate ${active ? 'text-accent' : 'text-text-primary'}`}>
                        {p.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Provider detail */}
            <div className="flex-1 overflow-y-auto p-5">
              {/* Header — no enable/disable switch */}
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface-2 shrink-0">
                    <ProviderLogo provider={activeProvider.id} size={20} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[14px] font-semibold text-text-primary">{activeProvider.name}</div>
                    <div className="text-[11px] text-text-tertiary">{activeProvider.description}</div>
                  </div>
                </div>
                {activeProvider.apiDocsUrl && (
                  <a
                    href={activeProvider.apiDocsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-[11px] text-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)] no-underline hover:no-underline inline-flex items-center gap-1 leading-none"
                  >
                    {t('ws.settings.getApiKey')}
                    <ExternalLink size={10} className="shrink-0" />
                  </a>
                )}
              </div>

              {/* Nexu login card */}
              {activeProvider.id === 'nexu' && (
                <div className="rounded-xl border border-[var(--color-brand-primary)]/25 bg-[var(--color-brand-subtle)] px-4 py-4 mb-6">
                  <div className="text-[13px] font-semibold text-[var(--color-brand-primary)]">{t('ws.settings.signInTitle')}</div>
                  <div className="text-[12px] leading-[1.7] text-text-secondary mt-1.5">
                    {t('ws.settings.signInDesc')}
                  </div>
                  <button
                    onClick={() => openExternal(`${window.location.origin}/openclaw/auth?desktop=1`)}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-3.5 py-2 text-[12px] font-medium text-accent-fg transition-colors hover:bg-accent/90 cursor-pointer"
                  >
                    {t('ws.settings.signInBtn')}
                    <ArrowUpRight size={12} />
                  </button>
                </div>
              )}

              {/* API Key + Proxy URL + Save (hidden for nexu) */}
              {activeProvider.id !== 'nexu' && (
                <div className="space-y-4 mb-6">
                  <div className="text-[10px] uppercase tracking-wider text-text-muted mb-3">
                    {t('ws.settings.apiKeySteps')}
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-text-primary mb-3">{t('ws.settings.apiKey')}</label>
                    <input
                      type="password"
                      placeholder={activeProvider.apiKeyPlaceholder}
                      value={getFormValues(activeProvider.id).apiKey}
                      onChange={e => setFormField(activeProvider.id, 'apiKey', e.target.value)}
                      className="w-full rounded-lg border border-border bg-surface-0 px-3 py-2 text-[12px] text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 focus:border-[var(--color-brand-primary)]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-text-primary mb-3">{t('ws.settings.apiProxyUrl')}</label>
                    <input
                      type="text"
                      value={getFormValues(activeProvider.id).proxyUrl}
                      onChange={e => setFormField(activeProvider.id, 'proxyUrl', e.target.value)}
                      className="w-full rounded-lg border border-border bg-surface-0 px-3 py-2 text-[12px] text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 focus:border-[var(--color-brand-primary)]/30"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-3 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleCheck(activeProvider.id)}
                      disabled={checkState === 'checking' || saveState === 'saving'}
                      className="text-[11px] text-text-muted hover:text-text-secondary disabled:opacity-50"
                    >
                      {checkState === 'checking' && t('ws.settings.testing')}
                      {checkState === 'success' && t('ws.settings.connectedStatus')}
                      {checkState === 'error' && t('ws.settings.retryTest')}
                      {checkState === 'idle' && t('ws.settings.testConnection')}
                    </button>
                    <button
                      onClick={() => handleSave(activeProvider.id)}
                      disabled={saveState === 'saving' || showSaved}
                      className={`w-[120px] shrink-0 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2 text-[12px] font-medium transition-all ${
                        showSaved
                          ? 'bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20'
                          : 'bg-accent text-accent-fg hover:bg-accent-hover'
                      } disabled:opacity-50`}
                    >
                      {saveState === 'saving' && <Loader2 size={13} className="animate-spin shrink-0" />}
                      {showSaved && <Check size={13} className="shrink-0" />}
                      {!showSaved && saveState !== 'saving' && t('ws.common.save')}
                      {saveState === 'saving' && t('ws.common.saving')}
                      {showSaved && t('ws.common.saved')}
                    </button>
                  </div>
                </div>
              )}

              {/* Model list — flat, no switches */}
              <div>
                {showSaved && showSavedBannerFor === activeProvider.id && (
                  <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-[var(--color-success)]/8 text-[11px] text-[var(--color-success)]">
                    <Check size={12} className="shrink-0" />
                    {t('ws.settings.savedSelectModel')}
                  </div>
                )}
                {saveError && (
                  <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-[var(--color-error)]/8 text-[11px] text-[var(--color-error)]">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{t('ws.settings.connectionFailed')}</span>
                  </div>
                )}
                <div className="text-[13px] font-semibold text-text-primary mb-3">
                  {t('ws.settings.model')} <span className="text-text-tertiary font-normal">{activeProvider.models.length}</span>
                </div>
                <div className="space-y-1.5">
                  {activeProvider.models.map(model => {
                    const isActive = model.id === selectedModelId;
                    return (
                      <button
                        key={model.id}
                        onClick={() => setSelectedModelId(model.id)}
                        className={`w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-all border-none ${
                          isActive
                            ? 'ring-1 ring-[var(--color-brand-primary)]/50 bg-[var(--color-brand-subtle)]'
                            : 'bg-surface-2 hover:bg-surface-3'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-6 h-6 rounded-md flex items-center justify-center shrink-0">
                            <ProviderLogo provider={activeProvider.id} size={16} />
                          </span>
                          <div className="min-w-0">
                            <div className={`text-[13px] truncate ${isActive ? 'font-semibold text-text-primary' : 'font-medium text-text-secondary'}`}>{model.name}</div>
                            <div className="text-[10px] text-text-tertiary">
                              {activeProvider.name}
                            </div>
                          </div>
                        </div>
                        {isActive && <Check size={14} className="text-[var(--color-brand-primary)] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Workspace Shell                                               */
/* ------------------------------------------------------------------ */
type View =
  | { type: 'home' }
  | { type: 'conversations'; channelId?: string }
  | { type: 'deployments' }
  | { type: 'skills' }
  | { type: 'settings'; tab?: SettingsTab; providerId?: ModelProvider };

function getInitialWorkspaceView(search: string): View {
  const params = new URLSearchParams(search);
  if (params.get('view') === 'settings') {
    const tab = params.get('tab');
    const provider = params.get('provider');
    return {
      type: 'settings',
      tab: isSettingsTab(tab) ? tab : 'providers',
      providerId: isModelProvider(provider) ? provider : 'anthropic',
    };
  }

  return { type: 'home' };
}

const NAV_ITEMS: { id: View['type']; labelKey: string; icon: typeof Home }[] = [
  { id: 'home', labelKey: 'ws.nav.home', icon: Home },
  { id: 'skills', labelKey: 'ws.nav.skills', icon: Sparkles },
  { id: 'settings', labelKey: 'ws.nav.settings', icon: Settings },
];

export default function OpenClawWorkspace() {
  usePageTitle('Workspace');
  const navigate = useNavigate();
  const location = useLocation();
  const { stars } = useGitHubStars();
  const { locale, setLocale, t } = useLocale();
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('nexu_sidebar_collapsed');
    return saved !== null ? saved === 'true' : true;
  });
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [hasUpdate, setHasUpdate] = useState(true);
  const [updateDismissed, setUpdateDismissed] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [updateError, setUpdateError] = useState(false);
  const [updateReady, setUpdateReady] = useState(false);
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [showUpToDate, setShowUpToDate] = useState(false);
  const downloadTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const MOCK_VERSION = '0.2.0';
  const helpRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>(() => getInitialWorkspaceView(location.search));
  const [showTyping, setShowTyping] = useState(shouldShowTypingEffect);

  const SIDEBAR_MIN = 160;
  const SIDEBAR_MAX = 320;
  const SIDEBAR_DEFAULT = 192;
  const MAIN_MIN = 480;
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('nexu_sidebar_width');
    return saved ? Math.max(SIDEBAR_MIN, Math.min(SIDEBAR_MAX, Number(saved))) : SIDEBAR_DEFAULT;
  });
  const isResizing = useRef(false);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    const startX = e.clientX;
    const startW = sidebarWidth;

    const onMove = (ev: MouseEvent) => {
      if (!isResizing.current) return;
      const containerWidth = window.innerWidth;
      const newW = Math.max(SIDEBAR_MIN, Math.min(SIDEBAR_MAX, startW + (ev.clientX - startX)));
      if (containerWidth - newW >= MAIN_MIN) {
        setSidebarWidth(newW);
      }
    };

    const onUp = () => {
      isResizing.current = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      setSidebarWidth(w => {
        localStorage.setItem('nexu_sidebar_width', String(w));
        return w;
      });
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [sidebarWidth]);

  useEffect(() => {
    if (view.type === 'home') {
      setShowTyping(prev => prev || shouldShowTypingEffect());
    }
  }, [view.type]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible' && view.type === 'home') {
        setShowTyping(prev => prev || shouldShowTypingEffect());
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [view.type]);

  const handleTypingComplete = () => {
    sessionStorage.removeItem('nexu_from_setup');
    localStorage.setItem(WELCOME_STORAGE_KEY, Date.now().toString());
    setShowTyping(false);
  };

  useEffect(() => {
    if (!showHelpMenu) return;
    const handler = (e: MouseEvent) => {
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) {
        setShowHelpMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showHelpMenu]);

  useEffect(() => {
    if (!showLangMenu) return;
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showLangMenu]);

  useEffect(() => {
    return () => { if (downloadTimer.current) clearInterval(downloadTimer.current); };
  }, []);

  const allSkillsCount = SKILL_CATEGORIES.flatMap(c => c.skills).length;

  return (
    <div className="relative flex flex-row h-full">
      {/* Sidebar toggle — fixed position, same spot for expand/collapse */}
      <button
        onClick={() => {
          const next = !collapsed;
          setCollapsed(next);
          localStorage.setItem('nexu_sidebar_collapsed', String(next));
        }}
        className="absolute top-2 left-[88px] z-50 p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-black/5 transition-colors"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        title={collapsed ? t('ws.sidebar.expand') : t('ws.sidebar.collapse')}
      >
        {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
      </button>

      {/* Sidebar — frosted glass + fully hidden when collapsed */}
      <div
        className={`flex flex-col shrink-0 overflow-hidden ${collapsed ? 'w-0' : ''}`}
        style={{
          ...(!collapsed ? { width: sidebarWidth } : {}),
          transition: isResizing.current ? 'none' : 'width 200ms',
          WebkitAppRegion: 'drag',
          background: 'transparent',
        } as React.CSSProperties}
      >
        {/* Traffic light clearance */}
        <div className="h-14 shrink-0" />

        {/* Brand */}
        <div className="px-3 pb-2 flex items-center justify-between" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
          <img
            src="/brand/logo-black-1.svg"
            alt="nexu"
            className="h-6 object-contain"
          />
          {hasUpdate && updateDismissed && (
            <button
              onClick={() => setUpdateDismissed(false)}
              className="rounded-full px-2 py-1 text-[10px] leading-none font-semibold bg-[var(--color-brand-primary)] text-white hover:opacity-85 transition-opacity"
            >
              {t('ws.sidebar.update')}
            </button>
          )}
        </div>

        {/* Nav items */}
        <div className="flex-1 overflow-y-auto" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
          <div className="px-2 pt-3 space-y-0.5">
            {NAV_ITEMS.map(item => {
              const active = view.type === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView({ type: item.id } as View)}
                  className={`flex items-center gap-2.5 w-full rounded-[var(--radius-6)] text-[13px] transition-colors cursor-pointer px-3 py-2 ${
                    active ? 'nav-item-active' : 'nav-item'
                  }`}
                >
                  <item.icon size={16} />
                  {t(item.labelKey)}
                  {item.id === 'skills' && (
                    <span className="ml-auto text-[10px] text-text-tertiary font-normal">{allSkillsCount}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Conversations section */}
          <div className="px-2 pt-6">
            <div className="sidebar-section-label">{t('ws.nav.conversations')}</div>
            <div className="space-y-0.5">
              {MOCK_CHANNELS.map(ch => {
                const active = view.type === 'conversations' && (view as { type: 'conversations'; channelId?: string }).channelId === ch.id;
                const ChannelIcon = ({ slack: SlackIconSetup, feishu: FeishuIconSetup, discord: DiscordIconSetup } as Record<string, typeof SlackIconSetup>)[ch.platform] || SlackIconSetup;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setView({ type: 'conversations', channelId: ch.id })}
                    className={`flex items-center gap-2.5 w-full rounded-[var(--radius-6)] text-[13px] transition-colors cursor-pointer px-3 py-1.5 ${
                      active ? 'nav-item-active' : 'nav-item'
                    }`}
                  >
                    <span className="shrink-0 w-4 h-4 flex items-center justify-center"><ChannelIcon size={14} /></span>
                    <span className={`truncate text-[12px] ${active ? '' : 'text-text-primary'}`}>{ch.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Update banner — available / downloading / ready / error */}
        {hasUpdate && !updateDismissed && (
          <div
            className="mx-3 mb-2 px-3 py-2.5 rounded-[10px] border border-border bg-surface-0/80 backdrop-blur-sm animate-float shrink-0"
            style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${updateError ? 'bg-red-500' : 'bg-[var(--color-success)]'}`} />
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${updateError ? 'bg-red-500' : 'bg-[var(--color-success)]'}`} />
                </span>
                <span className="text-[12px] font-medium text-text-primary whitespace-nowrap">
                  {updating && t('ws.update.downloading')}
                  {updateReady && t('ws.update.ready').replace('{{version}}', MOCK_VERSION)}
                  {updateError && t('ws.update.failed')}
                  {!updating && !updateReady && !updateError && t('ws.update.available').replace('{{version}}', MOCK_VERSION)}
                </span>
              </div>
              {!updating && (
                <button
                  onClick={() => setUpdateDismissed(true)}
                  className="text-text-muted hover:text-text-primary transition-colors -mr-1"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Downloading — progress bar + percent right-aligned below */}
            {updating && (
              <div className="pl-4 pr-1">
                <div className="h-[6px] w-full rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${downloadProgress}%`, background: '#1c1f23' }}
                  />
                </div>
                <div className="flex justify-end mt-1.5">
                  <span className="text-[10px] tabular-nums text-text-muted">{downloadProgress}%</span>
                </div>
              </div>
            )}

            {/* Available — Download + Changelog */}
            {!updating && !updateReady && !updateError && (
              <div className="flex items-center gap-2 pl-4">
                <button
                  onClick={() => {
                    setUpdating(true);
                    setDownloadProgress(0);
                    let progress = 0;
                    downloadTimer.current = setInterval(() => {
                      const remaining = 100 - progress;
                      const step = Math.max(1, Math.floor(Math.random() * remaining * 0.15));
                      progress = Math.min(100, progress + step);
                      setDownloadProgress(progress);
                      if (progress >= 100) {
                        if (downloadTimer.current) clearInterval(downloadTimer.current);
                        setTimeout(() => { setUpdating(false); setUpdateReady(true); }, 600);
                      }
                    }, 200);
                  }}
                  className="inline-flex items-center justify-center rounded-[6px] h-7 px-2.5 text-[11px] leading-none font-medium bg-[var(--color-accent)] text-white hover:opacity-85 transition-opacity"
                >
                  {t('ws.update.download')}
                </button>
                <button
                  onClick={() => void openExternal('https://github.com/nexu-io/nexu/releases')}
                  className="inline-flex items-center justify-center rounded-[6px] h-7 px-2 text-[11px] leading-none font-medium text-text-muted hover:text-text-primary transition-colors"
                >
                  {t('ws.update.changelog')}
                </button>
              </div>
            )}

            {/* Ready — Restart + Changelog */}
            {updateReady && (
              <div className="flex items-center gap-2 pl-4">
                <button
                  onClick={() => { setUpdateReady(false); setHasUpdate(false); }}
                  className="inline-flex items-center justify-center rounded-[6px] h-7 px-2.5 text-[11px] leading-none font-medium bg-[var(--color-accent)] text-white hover:opacity-85 transition-opacity"
                >
                  {t('ws.update.restart')}
                </button>
                <button
                  onClick={() => void openExternal('https://github.com/nexu-io/nexu/releases')}
                  className="inline-flex items-center justify-center rounded-[6px] h-7 px-2 text-[11px] leading-none font-medium text-text-muted hover:text-text-primary transition-colors"
                >
                  {t('ws.update.changelog')}
                </button>
              </div>
            )}

            {/* Error — Retry + Changelog */}
            {updateError && (
              <div className="flex items-center gap-2 pl-4">
                <button
                  onClick={() => { setUpdateError(false); setHasUpdate(true); }}
                  className="inline-flex items-center justify-center rounded-[6px] h-7 px-2.5 text-[11px] leading-none font-medium bg-[var(--color-accent)] text-white hover:opacity-85 transition-opacity"
                >
                  {t('ws.update.retry')}
                </button>
                <button
                  onClick={() => void openExternal('https://github.com/nexu-io/nexu/releases')}
                  className="inline-flex items-center justify-center rounded-[6px] h-7 px-2 text-[11px] leading-none font-medium text-text-muted hover:text-text-primary transition-colors"
                >
                  {t('ws.update.changelog')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Icon row — above account bar */}
        <div className="px-3 pb-1.5 flex items-center gap-1" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
          <div className="relative" ref={helpRef}>
            {showHelpMenu && (
              <div className="absolute z-20 bottom-full left-0 mb-2 w-44">
                <div className="rounded-xl border bg-surface-1 border-border shadow-xl shadow-black/10 overflow-hidden">
                  <div className="p-1.5">
                    <a
                      href="https://docs.nexu.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[12px] font-medium text-text-secondary hover:text-text-primary hover:bg-black/5 transition-all"
                    >
                      <BookOpen size={14} />
                      {t('ws.help.documentation')}
                    </a>
                    <a
                      href="mailto:hi@nexu.ai"
                      className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[12px] font-medium text-text-secondary hover:text-text-primary hover:bg-black/5 transition-all"
                    >
                      <Mail size={14} />
                      {t('ws.help.contactUs')}
                    </a>
                  </div>
                  <div className="border-t border-border p-1.5">
                    <button
                      onClick={() => {
                        setShowHelpMenu(false);
                        setCheckingUpdate(true);
                        setTimeout(() => {
                          setCheckingUpdate(false);
                          if (hasUpdate && !updateDismissed) {
                            /* new version → sidebar card already visible */
                          } else {
                            setShowUpToDate(true);
                          }
                        }, 1500);
                      }}
                      className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[12px] font-medium text-text-secondary hover:text-text-primary hover:bg-black/5 transition-all"
                    >
                      <Loader2 size={14} />
                      Check for Updates…
                    </button>
                    <a
                      href="https://nexu.ai/changelog"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[12px] font-medium text-text-secondary hover:text-text-primary hover:bg-black/5 transition-all"
                    >
                      <ScrollText size={14} />
                      {t('ws.help.changelog')}
                    </a>
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={() => setShowHelpMenu(!showHelpMenu)}
              className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors cursor-pointer ${showHelpMenu ? 'text-text-primary bg-black/5' : 'text-text-secondary hover:text-text-primary hover:bg-black/5'}`}
              title={t('ws.help.title')}
            >
              <CircleHelp size={16} />
            </button>
          </div>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 flex items-center justify-center rounded-md text-text-secondary hover:text-text-primary hover:bg-black/5 transition-colors"
            title={t('ws.help.github')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          </a>
          {stars && stars > 0 && (
            <span className="text-[10px] tabular-nums text-text-tertiary ml-0.5">{stars.toLocaleString()}</span>
          )}
          <div className="relative ml-auto" ref={langRef}>
            {showLangMenu && (
              <div className="absolute z-20 bottom-full right-0 mb-2 w-36">
                <div className="rounded-xl border bg-surface-1 border-border shadow-xl shadow-black/10 overflow-hidden p-1.5">
                  {([
                    { value: 'en' as const, label: 'English' },
                    { value: 'zh' as const, label: '简体中文' },
                  ]).map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setLocale(opt.value); setShowLangMenu(false); }}
                      className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[12px] font-medium transition-all ${
                        locale === opt.value
                          ? 'text-text-primary bg-black/5'
                          : 'text-text-secondary hover:text-text-primary hover:bg-black/5'
                      }`}
                    >
                      {opt.label}
                      {locale === opt.value && <Check size={12} className="ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className={`h-7 flex items-center gap-1.5 px-1.5 rounded-md transition-colors cursor-pointer ${showLangMenu ? 'text-text-primary bg-black/5' : 'text-text-secondary hover:text-text-primary hover:bg-black/5'}`}
              title={t('ws.help.language')}
            >
              <Globe size={14} />
              <span className="text-[11px] font-medium leading-none">{locale === 'en' ? 'EN' : '中文'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile header — hidden in desktop client */}
      <div className="hidden">
        <button onClick={() => navigate('/openclaw')} className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary">
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="flex justify-center items-center w-6 h-6 rounded-md bg-accent shrink-0">
            <span className="text-[9px] font-bold text-accent-fg">N</span>
          </div>
          <span className="text-sm font-semibold text-text-primary truncate">nexu</span>
        </div>
        <LanguageSwitcher variant="muted" />
        <button onClick={() => setView({ type: 'settings' })} className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary">
          <Settings size={16} />
        </button>
      </div>

      {/* Resize handle */}
      {!collapsed && (
        <div
          onMouseDown={handleResizeStart}
          className="w-[3px] shrink-0 cursor-col-resize group relative z-10"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          <div className="absolute inset-y-0 -left-[2px] -right-[2px]" />
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-hidden min-h-0 bg-surface-1 rounded-l-[12px] pt-8">
          {view.type === 'home' && (
            <HomeDashboard onNavigate={setView} showTyping={showTyping} onTypingComplete={handleTypingComplete} stars={stars} />
          )}
          {view.type === 'conversations' && (
            <ConversationsView initialChannelId={view.channelId} />
          )}
          {view.type === 'deployments' && (
            <DeploymentsView />
          )}
          {view.type === 'skills' && (
            <SkillsPanel />
          )}
          {view.type === 'settings' && (
            <SettingsView initialTab={view.tab} initialProviderId={view.providerId} />
          )}
      </main>

      {/* Update check dialog — checking / up-to-date */}
      {(checkingUpdate || showUpToDate) && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: 'transparent', pointerEvents: 'none', animation: 'fadeIn 150ms ease-out' }}
          onClick={showUpToDate ? () => setShowUpToDate(false) : undefined}
        >
          <div
            className="flex flex-col items-center w-[260px] px-6 py-6 rounded-[14px] bg-white text-center"
            style={{
              pointerEvents: 'auto',
              boxShadow: '0 24px 48px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)',
              animation: 'scaleIn 200ms cubic-bezier(0.16,1,0.3,1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center w-11 h-11 mb-3.5 rounded-[10px] bg-[#f5f5f5]">
              <img src="/brand/logo-black-1.svg" alt="nexu" className="w-[26px] h-[26px] object-contain" />
            </div>

            <h2 className="text-[14px] font-semibold text-[#1c1f23] mb-1">
              {checkingUpdate ? t('ws.update.checking') : t('ws.update.upToDate')}
            </h2>

            {showUpToDate && (
              <p className="text-[12px] text-[#6b7280] leading-[1.4] mb-4">
                {t('ws.update.upToDateSub').replace('{{version}}', MOCK_VERSION)}
              </p>
            )}

            {checkingUpdate && (
              <div className="w-full mt-1 mb-2">
                <div className="h-1 w-full rounded-full bg-[rgba(0,0,0,0.06)] overflow-hidden">
                  <div
                    className="h-full w-[35%] rounded-full"
                    style={{ background: '#1c1f23', animation: 'indeterminateSlide 1.4s ease-in-out infinite' }}
                  />
                </div>
              </div>
            )}

            {showUpToDate && (
              <button
                onClick={() => setShowUpToDate(false)}
                className="w-full py-[7px] rounded-lg bg-[#3478f6] text-white text-[13px] font-medium hover:bg-[#2563eb] transition-colors border-none cursor-pointer mt-1"
                type="button"
              >
                OK
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
