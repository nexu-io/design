import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../../hooks/usePageTitle';
import {
  Check,
  ChevronRight,
  Hash,
  Send,
  Sparkles,
  Users,
  Bot,
  ArrowLeft,
  ArrowRight,
  Mail,
  Bold,
  Italic,
  AtSign,
  Smile,
  Paperclip,
  ChevronDown,
  Star,
  Search,
  Bookmark,
  Loader2,
  Settings,
  Brain,
  Home,
  Activity,
  Rocket,
  ArrowUpRight,
  MessageSquare,
  Shield,
  ExternalLink,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

type DemoStep =
  | 'group-chat'
  | 'claim-page'
  | 'invite-code'
  | 'setup'
  | 'workspace'
  | 'slack-intro'
  | 'oauth-auth';


interface ChatMessage {
  id: string;
  role: 'system' | 'user' | 'bot' | 'other-user';
  name: string;
  content: string;
  time: string;
  avatar?: string;
  showCTA?: boolean;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'bot',
    name: 'nexu',
    content: '👋 Hi, I\'m nexu — your AI work assistant.\n\nAnyone in this channel can @mention me to get things done:\n• Summarize discussions, write reports, generate briefs\n• Draft docs, troubleshoot issues, schedule meetings\n\nI\'m online 24/7, remember context, and get smarter the more you use me.',
    time: '09:58',
    avatar: '🦞',
  },
  {
    id: 'other-1',
    role: 'other-user',
    name: 'Alex',
    content: '@nexu Can you summarize the Q2 roadmap conclusions from yesterday\'s product meeting?',
    time: '10:02',
    avatar: '👩',
  },
  {
    id: 'bot-reply-1',
    role: 'bot',
    name: 'nexu',
    content: 'Summary of yesterday\'s Q2 roadmap discussion:\n\n**Key decisions:**\n• Mobile app launch in April, top priority\n• Enterprise SSO pushed to May\n• Platform team +2 engineers\n\n**Open:** Enterprise pricing (Alex drafting), API rate limit stress test\n**Next review:** Thursday 14:00',
    time: '10:03',
    avatar: '🦞',
  },
  {
    id: 'other-2',
    role: 'other-user',
    name: 'Jordan',
    content: 'Looks good. @nexu Help me draft a one-pager for the VP',
    time: '10:06',
    avatar: '👨',
  },
  {
    id: 'bot-reply-2',
    role: 'bot',
    name: 'nexu',
    content: '📋 **Q2 Roadmap Status (VP Brief)**\n\n✅ Mobile app April launch, on track\n✅ Platform +2 hires, recruiting\n⏳ Enterprise SSO pushed to May\n🔍 Pricing draft in progress\n\nReview: Thursday 14:00',
    time: '10:07',
    avatar: '🦞',
  },
  {
    id: 'other-3',
    role: 'other-user',
    name: 'Alex',
    content: 'Thanks! I\'ll keep working on the pricing doc. @nexu Do you have a pricing reference template?',
    time: '10:12',
    avatar: '👩',
  },
  {
    id: 'bot-reply-3',
    role: 'bot',
    name: 'nexu',
    content: 'Yes. I put together a pricing framework based on your product positioning:\n\n1. **Per seat** — Good for small teams\n2. **Usage-based** — Good for mid/large orgs\n3. **Hybrid** — Base seats + overage\n\nShould I post it in the channel or DM you?',
    time: '10:13',
    avatar: '🦞',
  },
];

/* ------------------------------------------------------------------ */
/*  Slack-style icons                                                  */
/* ------------------------------------------------------------------ */

function SlackIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#E01E5A"/>
      <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#36C5F0"/>
      <path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" fill="#2EB67D"/>
      <path d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#ECB22E"/>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared Slack UI components                                         */
/* ------------------------------------------------------------------ */

const SLACK_BG = '#1a1d21';
const SLACK_SIDEBAR = '#19171D';
const SLACK_ACTIVE = 'rgba(255,255,255,0.12)';

const AVATAR_COLORS: Record<string, string> = {
  'nexu': '#3db9ce',
  'Alex': '#36C5F0',
  'Jordan': '#2EB67D',
  'You': '#ECB22E',
};

function SlackAvatar({ name, size = 36, isBot }: { name: string; size?: number; isBot?: boolean }) {
  const [imgFailed, setImgFailed] = useState(false);
  const color = AVATAR_COLORS[name] || '#7C3AED';
  if (isBot) {
    return (
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        {!imgFailed ? (
          <img
            src="/brand/ip-nexu.svg"
            alt="nexu Alpha"
            className="w-full h-full object-contain"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <span style={{ fontSize: size * 0.5 }}>🦞</span>
        )}
      </div>
    );
  }
  return (
    <div
      className="rounded-lg flex items-center justify-center text-white font-bold shrink-0"
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.38 }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function SlackSidebar({ mode, activeChannel }: { mode: 'channel' | 'dm'; activeChannel?: string }) {
  return (
    <div className="hidden lg:flex flex-col w-[220px] text-white shrink-0" style={{ backgroundColor: SLACK_SIDEBAR }}>
      {/* Workspace header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-[26px] h-[26px] rounded-md bg-white/10 flex items-center justify-center">
            <SlackIcon size={15} />
          </div>
          <div>
            <div className="text-[14px] font-bold leading-tight">nexu Community</div>
          </div>
        </div>
        <ChevronDown size={14} className="text-white/40" />
      </div>

      {/* Nav */}
      <div className="px-2 space-y-0.5">
        <div className="flex items-center gap-2 px-2 py-[5px] rounded-md text-[13px] text-white/70 hover:bg-white/[0.06] cursor-pointer">
          <Search size={15} className="text-white/50" /> Search
        </div>
        <div className="flex items-center gap-2 px-2 py-[5px] rounded-md text-[13px] text-white/70 hover:bg-white/[0.06] cursor-pointer">
          <Bookmark size={15} className="text-white/50" /> Later
        </div>
      </div>

      <div className="mt-3 px-2 flex-1 overflow-y-auto space-y-3">
        {/* Channels */}
        <div>
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-[12px] font-medium text-white/50">Channels</span>
            <ChevronDown size={12} className="text-white/30" />
          </div>
          {[
            { name: 'General', id: 'general' },
            { name: 'Product Roadmap', id: 'roadmap' },
            { name: 'Engineering', id: 'engineering' },
            { name: 'Random', id: 'random' },
          ].map((ch) => (
            <div
              key={ch.id}
              className="flex items-center gap-1.5 px-2 py-[5px] rounded-md text-[13px] cursor-pointer"
              style={{
                backgroundColor: (mode === 'channel' && activeChannel === ch.id) ? SLACK_ACTIVE : 'transparent',
                color: (mode === 'channel' && activeChannel === ch.id) ? '#fff' : 'rgba(255,255,255,0.65)',
              }}
            >
              <Hash size={14} style={{ opacity: (mode === 'channel' && activeChannel === ch.id) ? 0.7 : 0.4 }} />
              <span>{ch.name}</span>
            </div>
          ))}
        </div>

        {/* Channel members — nexu + members */}
        <div>
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-[12px] font-medium text-white/50">Channel members</span>
            <ChevronDown size={12} className="text-white/30" />
          </div>
          <div className="px-2 py-1 flex flex-col gap-1">
            <div className="flex items-center gap-2 px-2 py-2 rounded-md bg-white/[0.06]">
              <SlackAvatar name="nexu" size={32} isBot />
              <div>
                <div className="text-[13px] font-semibold text-white">nexu</div>
                <div className="text-[10px] text-white/50">AI assistant · Online</div>
              </div>
            </div>
            {[
              { name: 'Alex', online: true },
              { name: 'Jordan', online: false },
              { name: 'You', online: true },
            ].map((u) => (
              <div
                key={u.name}
                className="flex items-center gap-2 px-2 py-[5px] rounded-md text-[13px] cursor-pointer hover:bg-white/[0.06]"
              >
                <div className="relative">
                  <SlackAvatar name={u.name} size={24} isBot={false} />
                  <div
                    className="absolute -bottom-0.5 -right-0.5 w-[6px] h-[6px] rounded-full border-[1.5px]"
                    style={{
                      borderColor: SLACK_SIDEBAR,
                      backgroundColor: u.online ? '#2BAC76' : 'transparent',
                      ...(u.online ? {} : { border: `1.5px solid rgba(255,255,255,0.3)` }),
                    }}
                  />
                </div>
                <span className="text-white/80">{u.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DMs */}
        <div>
          <div className="flex items-center justify-between px-2 py-1 mt-2">
            <span className="text-[12px] font-medium text-white/50">DMs</span>
            <ChevronDown size={12} className="text-white/30" />
          </div>
          {[
            { name: 'nexu', isBot: true, online: true },
            { name: 'Alex', online: true },
            { name: 'Jordan', online: false },
          ].map((u) => (
            <div
              key={u.name}
              className="flex items-center gap-2 px-2 py-[5px] rounded-md text-[13px] cursor-pointer"
              style={{
                backgroundColor: (mode === 'dm' && u.name === 'nexu') ? SLACK_ACTIVE : 'transparent',
                color: (mode === 'dm' && u.name === 'nexu') ? '#fff' : 'rgba(255,255,255,0.65)',
              }}
            >
              <div className="relative">
                <SlackAvatar name={u.name} size={20} isBot={u.isBot} />
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-[8px] h-[8px] rounded-full border-[1.5px]"
                  style={{
                    borderColor: SLACK_SIDEBAR,
                    backgroundColor: u.online ? '#2BAC76' : 'transparent',
                    ...(u.online ? {} : { border: `1.5px solid rgba(255,255,255,0.3)` }),
                  }}
                />
              </div>
              <span>{u.name}</span>
              {u.isBot && (
                <span className="text-[9px] px-1 py-0.5 rounded bg-white/10 text-white/50 font-medium leading-none">APP</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 1: Group Chat (Slack-style)                                   */
/* ------------------------------------------------------------------ */

function GroupChatStep({ onClaim }: { onClaim: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      name: 'You',
      content: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: '🧑',
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'bot',
        name: 'nexu',
        content: generateBotReply(input.trim()),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: '🦞',
        showCTA: !hasInteracted,
      };
      setMessages((prev) => [...prev, botReply]);
      setHasInteracted(true);
    }, 1500);
  }, [input, hasInteracted]);

  return (
    <div className="flex h-full" style={{ backgroundColor: SLACK_BG }}>
      <SlackSidebar mode="channel" activeChannel="general" />

      {/* Main chat */}
      <div className="flex flex-col flex-1 min-w-0 bg-white">
        {/* Channel header */}
        <div className="flex items-center gap-2 px-3 sm:px-5 h-[49px] border-b border-[#e8e8e8] shrink-0">
          <div className="flex items-center gap-1.5">
            <Hash size={16} className="text-[#1d1c1d]/60" />
            <span className="font-[900] text-[15px] text-[#1d1c1d]">General</span>
          </div>
          <Star size={15} className="hidden sm:block text-[#1d1c1d]/30 ml-1 cursor-pointer hover:text-[#1d1c1d]/60" />
          <div className="hidden sm:block h-4 w-px bg-[#e8e8e8] mx-1" />
          <span className="hidden sm:block text-[13px] text-[#1d1c1d]/50 truncate">nexu Community — General channel</span>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1 text-[13px] text-[#1d1c1d]/50 cursor-pointer hover:text-[#1d1c1d]/70">
              <Users size={15} />
              <span>42</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-3">
          {messages.map((msg, idx) => {
            const prevMsg = idx > 0 ? messages[idx - 1] : null;
            const sameAuthor = prevMsg && prevMsg.name === msg.name;
            const isBot = msg.role === 'bot';

            return (
              <div
                key={msg.id}
                className={`group relative flex gap-2 px-3 sm:px-5 -mx-3 sm:-mx-5 py-0.5 hover:bg-[#f8f8f8] ${!sameAuthor ? 'mt-4 pt-1' : ''}`}
              >
                {/* Time on hover */}
                <div className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 w-[52px] text-right pr-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[11px] text-[#616061]">{msg.time}</span>
                </div>

                {/* Avatar or spacer */}
                <div className="w-9 shrink-0">
                  {!sameAuthor && (
                    <SlackAvatar name={msg.name} size={36} isBot={isBot} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  {!sameAuthor && (
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className={`text-[15px] font-[900] cursor-pointer hover:underline ${isBot ? 'text-[#1264a3]' : 'text-[#1d1c1d]'}`}>
                        {msg.name}
                      </span>
                      {isBot && (
                        <span className="text-[10px] px-1 py-0.5 rounded bg-[#ecdeec] text-[#4a154b] font-bold leading-none">APP</span>
                      )}
                      <span className="text-[12px] text-[#616061]">{msg.time}</span>
                    </div>
                  )}
                  <div className="text-[15px] text-[#1d1c1d] leading-[1.46] whitespace-pre-line [&_strong]:font-[700]">
                    {msg.content}
                  </div>
                  {msg.showCTA && (
                    <div className="mt-3 p-3 rounded-lg border border-[#1264a3]/20 bg-[#1264a3]/[0.04]">
                      <div className="flex flex-col sm:flex-row items-start gap-3">
                        <SlackIcon size={18} />
                        <div className="flex-1 min-w-0">
                            <>
                              <div className="text-[14px] font-[700] text-[#1d1c1d]">
                                Add nexu to your Slack workspace
                              </div>
                              <div className="text-[13px] text-[#616061] mt-0.5">
                                One click to connect. You and your team can use nexu directly in Slack.
                              </div>
                            </>
                        </div>
                        <Button
                          onClick={onClaim}
                          className="w-full sm:w-auto shrink-0 bg-[#007a5a] hover:bg-[#148567] text-white font-[700] rounded-md text-[13px] shadow-sm"
                        >
                          Add to Slack <ChevronRight size={14} />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {typing && (
            <div className="flex gap-2 px-5 -mx-5 py-1 mt-2">
              <div className="w-9 shrink-0">
                <SlackAvatar name="nexu" size={36} isBot />
              </div>
              <div>
                <span className="text-[15px] font-[900] text-[#1264a3]">nexu</span>
                <div className="mt-1 flex gap-1.5 items-center h-5">
                  <span className="w-[6px] h-[6px] rounded-full bg-[#868686] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-[6px] h-[6px] rounded-full bg-[#868686] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-[6px] h-[6px] rounded-full bg-[#868686] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input — Slack-style composer */}
        <div className="px-3 sm:px-5 pb-3 sm:pb-4">
          <div className="border border-[#c4c4c4] rounded-lg focus-within:border-[#868686] focus-within:shadow-[0_0_0_1px_#868686] transition-all">
            <div className="flex items-center px-3 py-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Message #general"
                className="flex-1 bg-transparent text-[15px] text-[#1d1c1d] placeholder:text-[#868686] focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between px-2 py-1.5 border-t border-[#e8e8e8]">
              <div className="flex items-center gap-0.5">
                <button className="hidden sm:inline-flex p-1.5 rounded hover:bg-[#f0f0f0] text-[#616061] transition-colors">
                  <Bold size={15} />
                </button>
                <button className="hidden sm:inline-flex p-1.5 rounded hover:bg-[#f0f0f0] text-[#616061] transition-colors">
                  <Italic size={15} />
                </button>
                <div className="hidden sm:block w-px h-4 bg-[#e8e8e8] mx-1" />
                <button className="p-1.5 rounded hover:bg-[#f0f0f0] text-[#616061] transition-colors">
                  <Paperclip size={15} />
                </button>
                <button className="hidden sm:inline-flex p-1.5 rounded hover:bg-[#f0f0f0] text-[#616061] transition-colors">
                  <AtSign size={15} />
                </button>
                <button className="p-1.5 rounded hover:bg-[#f0f0f0] text-[#616061] transition-colors">
                  <Smile size={15} />
                </button>
              </div>
              <Button
                onClick={handleSend}
                disabled={!input.trim()}
                size="icon"
                className={`h-7 w-7 rounded ${
                  input.trim() ? 'bg-[#007a5a] text-white hover:bg-[#148567]' : 'bg-[#dddddd] text-white'
                }`}
              >
                <Send size={15} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function generateBotReply(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('summarize') || lower.includes('summary')) {
    return 'Quick summary of recent discussion:\n\n• **Product**: Mobile app April launch, on track\n• **Engineering**: New CI/CD pipeline deployed, 40% faster builds\n• **Design**: Brand v2 approved, rollout next week\n\nWant me to expand on anything?';
  }
  if (lower.includes('help') || lower.includes('draft') || lower.includes('write') || lower.includes('report')) {
    return 'Sure! Here\'s a draft based on context:\n\n---\n**Weekly Report — Week 9**\n\nLaunched new onboarding flow this week, completion rate up 23%. Next week: focus on channel integration layer.\n\n---\n\nNeed tone or content changes?';
  }
  if (lower.includes('code') || lower.includes('bug') || lower.includes('error')) {
    return 'Sure! Share the code or error and I\'ll take a look.\n\nI can help with:\n• Code review and optimization\n• Bug diagnosis and fixes\n• Writing tests\n• Architecture advice';
  }
  return 'Got it! I need a bit more context to help 😄\n\nTry something like:\n• "Summarize the recent discussion"\n• "Draft a weekly report"\n• "Help me debug this error"\n\nThe more specific, the better I can help!';
}

/* ------------------------------------------------------------------ */
/*  Step 2: Claim Page                                                 */
/* ------------------------------------------------------------------ */

function ClaimPageStep({
  onAuthorize,
}: {
  onAuthorize: () => void;
}) {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [loading, setLoading] = useState<'google' | 'email' | 'slack' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [hovering, setHovering] = useState(false);

  const handleSlackAuth = () => {
    setLoading('slack');
    setTimeout(() => {
      setLoading(null);
      onAuthorize();
    }, 800);
  };

  const handleGoogleAuth = () => {
    setLoading('google');
    setTimeout(() => {
      setLoading(null);
      onAuthorize();
    }, 1200);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    if (!email.trim()) { setEmailError('Enter your email'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError('Enter a valid email'); return; }
    if (!password.trim() || password.length < 6) { setEmailError('Password must be at least 6 characters'); return; }
    setLoading('email');
    setTimeout(() => {
      setLoading(null);
      onAuthorize();
    }, 1200);
  };

  return (
    <div className="h-full bg-surface-0 flex flex-col relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--color-accent-rgb,99,102,241),0.06)_0%,transparent_50%)] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 sm:px-10 h-14 shrink-0">
        <div className="flex items-center gap-2.5">
          <img src="/brand/nexu logo-black4.svg" alt="nexu" className="h-6 w-auto object-contain" />
        </div>
      </nav>

      {/* Main */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-[440px]">

          {/* Headline */}
          <div className="text-center mb-10">
            <h1 className="text-[30px] sm:text-[38px] font-bold text-text-primary leading-[1.12] tracking-tight mb-4">
              Your AI coworker
              <br />
              <span className="text-accent">in IM, 24/7</span>
            </h1>
            <p className="text-[14px] text-text-tertiary leading-relaxed max-w-[340px] mx-auto">
              One click to connect Slack. nexu auto-configures everything — tools, skills, and personal memory.
            </p>
          </div>

          {/* Slack — first option */}
          <button
            onClick={handleSlackAuth}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            disabled={loading !== null}
            className="group relative w-full flex items-center justify-center gap-3 py-4 rounded-lg text-[16px] font-semibold bg-[#4A154B] text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-[#E01E5A]/20 via-[#36C5F0]/20 to-[#2EB67D]/20 transition-opacity duration-500 ${hovering ? 'opacity-100' : 'opacity-0'}`} />
            <div className="relative flex items-center gap-3">
              {loading === 'slack' ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <SlackIcon size={22} />
                  Continue with Slack
                  <ArrowRight size={16} className={`transition-transform duration-200 ${hovering ? 'translate-x-0.5' : ''}`} />
                </>
              )}
            </div>
          </button>

          {/* Google */}
          <Button
            onClick={handleGoogleAuth}
            disabled={loading !== null}
            variant="outline"
            className="mt-4 w-full py-3.5 text-[15px] font-medium"
          >
            {loading === 'google' ? (
              <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 border-t border-border" />
            <span className="text-[12px] text-text-muted">or</span>
            <div className="flex-1 border-t border-border" />
          </div>

          {/* Email */}
          {showEmailForm ? (
            <>
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <div>
                  <Label className="text-[13px] text-text-secondary">Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                    placeholder="you@example.com"
                    className="h-10 px-3.5 text-[14px]"
                  />
                </div>
                <div>
                  <Label className="text-[13px] text-text-secondary">Password</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setEmailError(''); }}
                    placeholder={mode === 'register' ? 'At least 6 characters' : 'Enter your password'}
                    className="h-10 px-3.5 text-[14px]"
                  />
                </div>
                {emailError && <p className="text-[12px] text-[var(--color-danger)]">{emailError}</p>}
                <Button
                  type="submit"
                  disabled={loading !== null}
                  variant="outline"
                  className="w-full py-3 text-[14px] font-medium"
                >
                  {loading === 'email' ? (
                    <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Mail size={16} />
                      {mode === 'register' ? 'Sign up with email' : 'Log in with email'}
                    </>
                  )}
                </Button>
              </form>
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="text-[13px] text-text-muted">
                  {mode === 'register' ? 'Already have an account?' : "Don't have an account?"}
                </span>
                <button
                  onClick={() => setMode(mode === 'register' ? 'login' : 'register')}
                  className="text-[13px] text-accent font-medium hover:underline underline-offset-2"
                >
                  {mode === 'register' ? 'Log in' : 'Sign up'}
                </button>
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowEmailForm(false)}
                className="w-full mt-3 text-[12px] text-text-muted hover:text-text-secondary"
              >
                ← Back to other options
              </Button>
            </>
          ) : (
            <div>
              <Button
                onClick={() => setShowEmailForm(true)}
                variant="outline"
                className="w-full py-3 text-[14px] font-medium"
              >
                <Mail size={16} />
                {mode === 'register' ? 'Sign up with email' : 'Log in with email'}
              </Button>
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="text-[13px] text-text-muted">
                  {mode === 'register' ? 'Already have an account?' : "Don't have an account?"}
                </span>
                <button
                  onClick={() => setMode(mode === 'register' ? 'login' : 'register')}
                  className="text-[13px] text-accent font-medium hover:underline underline-offset-2"
                >
                  {mode === 'register' ? 'Log in' : 'Sign up'}
                </button>
              </div>
            </div>
          )}

          {/* Social proof */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="flex -space-x-2">
              {[
                'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=b6e3f4',
                'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka&backgroundColor=ffd5dc',
                'https://api.dicebear.com/7.x/adventurer/svg?seed=Leo&backgroundColor=d1f4d9',
                'https://api.dicebear.com/7.x/adventurer/svg?seed=Mia&backgroundColor=ffe8b6',
                'https://api.dicebear.com/7.x/adventurer/svg?seed=Sam&backgroundColor=e0d4fc',
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="w-7 h-7 rounded-full border-2 border-surface-0 bg-surface-2"
                />
              ))}
            </div>
            <span className="text-[12px] text-text-muted">200+ teams in beta</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-center gap-4 pb-5 text-[11px] text-text-muted">
        <span>Terms</span>
        <span>Privacy</span>
        <span>© 2026 Powerformer, Inc.</span>
      </div>
    </div>
  );
}

/* removed ScenarioGuideStep — replaced by WorkspaceStep + SlackIntroStep */

/* ------------------------------------------------------------------ */
/*  Step 3: Invite Code                                                */
/* ------------------------------------------------------------------ */

const INVITE_CELL_COUNT = 8; // 4 + dash + 4

function InviteCodeStep({ onComplete }: { onComplete: () => void }) {
  const [cells, setCells] = useState<string[]>(Array(INVITE_CELL_COUNT).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleCellChange = (index: number, value: string) => {
    const char = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(-1);
    const newCells = [...cells];
    newCells[index] = char;
    setCells(newCells);
    setError('');
    if (char && index < INVITE_CELL_COUNT - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (!cells[index] && index > 0) {
        const newCells = [...cells];
        newCells[index - 1] = '';
        setCells(newCells);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newCells = [...cells];
        newCells[index] = '';
        setCells(newCells);
      }
      setError('');
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < INVITE_CELL_COUNT - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const newCells = Array(INVITE_CELL_COUNT).fill('');
    for (let i = 0; i < Math.min(pasted.length, INVITE_CELL_COUNT); i++) {
      newCells[i] = pasted[i];
    }
    setCells(newCells);
    setError('');
    const nextEmpty = newCells.findIndex((c: string) => !c);
    inputRefs.current[nextEmpty >= 0 ? nextEmpty : INVITE_CELL_COUNT - 1]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = cells.join('');
    if (raw.length < INVITE_CELL_COUNT) {
      setError('Please enter the complete invite code');
      return;
    }
    setLoading(true);
    setError('');
    // Simulate verification, then advance
    setTimeout(() => {
      onComplete();
    }, 1200);
  };

  const isFilled = cells.every((c: string) => c !== '');

  const cellInput = (index: number, cell: string) => (
    <input
      key={index}
      ref={el => { inputRefs.current[index] = el; }}
      type="text"
      inputMode="text"
      maxLength={1}
      value={cell}
      onChange={e => handleCellChange(index, e.target.value)}
      onKeyDown={e => handleKeyDown(index, e)}
      onPaste={handlePaste}
      onFocus={e => e.target.select()}
      className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-[18px] sm:text-[20px] font-mono font-bold rounded-lg border-2 bg-surface-1 text-text-primary focus:outline-none transition-all ${
        cell
          ? 'border-accent/40 bg-accent/[0.04]'
          : error
            ? 'border-red-500/40'
            : 'border-border hover:border-border-hover'
      } focus:border-[var(--color-brand-primary)]/30 focus:ring-2 focus:ring-[var(--color-brand-primary)]/20`}
    />
  );

  return (
    <div className="h-full bg-surface-0 flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--color-accent-rgb,99,102,241),0.06)_0%,transparent_50%)] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 sm:px-10 h-14 shrink-0">
        <div className="flex items-center gap-2.5">
          <img src="/brand/nexu logo-black4.svg" alt="nexu" className="h-6 w-auto object-contain" />
        </div>
      </nav>

      {/* Main */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-[440px]">
          {/* Headline */}
          <div className="text-center mb-10">
            <h1 className="text-[30px] sm:text-[38px] font-bold text-text-primary leading-[1.12] tracking-tight mb-4">
              Your AI coworker
              <br />
              <span className="text-accent">in IM, 24/7</span>
            </h1>
            <p className="text-[14px] text-text-tertiary leading-relaxed max-w-[340px] mx-auto">
              Enter your invite code to activate nexu — your always-on AI coworker with memory, tools, and skills.
            </p>
          </div>

          {/* Cell-based invite code input */}
          <form onSubmit={handleSubmit}>
            <Label className="text-[13px] text-text-secondary mb-3 text-center">
              Invite code
            </Label>

            <div className="flex items-center justify-center gap-1.5 sm:gap-2">
              {cells.slice(0, 4).map((cell, i) => cellInput(i, cell))}
              <span className="text-[24px] font-bold text-text-muted mx-0.5 select-none">-</span>
              {cells.slice(4).map((cell, i) => cellInput(i + 4, cell))}
            </div>

            {error && (
              <div className="flex items-center justify-center gap-1.5 mt-3 text-[12px] text-[var(--color-danger)]">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !isFilled}
              className={`mt-6 w-full py-3.5 rounded-xl text-[15px] font-semibold ${
                isFilled && !loading
                  ? 'bg-[#111111] hover:bg-[#222222] text-white'
                  : 'bg-surface-2 text-text-muted'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 animate-spin border-white/30 border-t-white" />
              ) : (
                <>
                  Continue
                  <ArrowRight size={16} />
                </>
              )}
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 border-t border-border" />
            <span className="text-[12px] text-text-muted">or</span>
            <div className="flex-1 border-t border-border" />
          </div>

          {/* Slack CTA */}
          <Button
            variant="outline"
            className="w-full py-3.5 rounded-[12px] text-[15px] font-medium"
          >
            <SlackIcon size={20} />
            Join Slack to get an invite code
          </Button>

          {/* Already activated */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-[13px] text-text-muted">Already activated?</span>
            <button className="text-[13px] text-accent font-medium hover:underline underline-offset-2">
              Sign in
            </button>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="flex -space-x-2">
              {[
                'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=b6e3f4',
                'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka&backgroundColor=ffd5dc',
                'https://api.dicebear.com/7.x/adventurer/svg?seed=Leo&backgroundColor=d1f4d9',
                'https://api.dicebear.com/7.x/adventurer/svg?seed=Mia&backgroundColor=ffe8b6',
                'https://api.dicebear.com/7.x/adventurer/svg?seed=Sam&backgroundColor=e0d4fc',
              ].map((src, i) => (
                <img key={i} src={src} alt="" className="w-7 h-7 rounded-full border-2 border-surface-0 bg-surface-2" />
              ))}
            </div>
            <span className="text-[12px] text-text-muted">200+ teams in beta</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-center gap-4 pb-5 text-[11px] text-text-muted">
        <span>Terms</span>
        <span>Privacy</span>
        <span>© 2026 Powerformer, Inc.</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Setup Step (Add Slack to workspace)                                */
/* ------------------------------------------------------------------ */

interface SetupStepDef {
  id: string;
  label: string;
  detail: string;
  duration: number;
  icon: React.ComponentType<{ size?: number }>;
}

const SETUP_STEPS: SetupStepDef[] = [
  { id: 'install', label: 'Installing nexu Bot', detail: 'Adding bot to your Slack workspace', duration: 1200, icon: SlackIcon },
  { id: 'tools', label: 'Authorizing tools', detail: 'Gmail, Calendar, Drive, Docs, Sheets', duration: 1500, icon: Settings },
  { id: 'skills', label: 'Activating skills', detail: 'Enabling AI capabilities for your team', duration: 1000, icon: Sparkles },
  { id: 'memory', label: 'Initializing memory', detail: 'Creating your personal memory space', duration: 800, icon: Brain },
];

type SetupPhase = 'connect' | 'installing' | 'done';
type SetupStepStatus = 'pending' | 'running' | 'done';

function SetupStep({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<SetupPhase>('connect');
  const [hovering, setHovering] = useState(false);
  const [stepStatuses, setStepStatuses] = useState<Record<string, SetupStepStatus>>(
    () => Object.fromEntries(SETUP_STEPS.map(s => [s.id, 'pending']))
  );

  const runSteps = useCallback(async () => {
    for (const s of SETUP_STEPS) {
      setStepStatuses(prev => ({ ...prev, [s.id]: 'running' }));
      await new Promise(resolve => setTimeout(resolve, s.duration));
      setStepStatuses(prev => ({ ...prev, [s.id]: 'done' }));
    }
    setPhase('done');
  }, []);

  const handleAddToSlack = () => {
    setPhase('installing');
    setTimeout(runSteps, 400);
  };

  useEffect(() => {
    if (phase === 'done') {
      const timer = setTimeout(onComplete, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  const doneCount = SETUP_STEPS.filter(s => stepStatuses[s.id] === 'done').length;
  const progress = (doneCount / SETUP_STEPS.length) * 100;

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--color-accent-rgb,99,102,241),0.06)_0%,transparent_50%)] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      {/* Main */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">

        {phase === 'connect' && (
          <div className="w-full max-w-[480px]">
            <div className="flex-1 min-w-0 text-center">
              {/* Connection graphic */}
              <div className="flex items-center gap-3 mb-6 justify-center">
                <div className="w-12 h-12 rounded-[6px] bg-surface-1 border border-border-subtle flex items-center justify-center">
                  <SlackIcon size={26} />
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-5 h-px bg-border" />
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <div className="w-5 h-px bg-border" />
                </div>
                <div className="w-12 h-12 rounded-[6px] bg-surface-1 border border-border-subtle flex items-center justify-center p-1.5">
                  <img src="/brand/nexu logo-black1.svg" alt="nexu" className="h-full w-auto object-contain" />
                </div>
              </div>

              <h1 className="text-[26px] sm:text-[32px] font-bold text-text-primary leading-[1.15] tracking-tight mb-3">
                Add nexu to your Slack
              </h1>
              <p className="text-[14px] text-text-tertiary leading-relaxed max-w-[420px] mx-auto mb-8">
                Your AI coworker joins right where your team works. @ it in any channel — 1,000+ tools built-in, persistent memory, always learning.
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8 justify-center">
                {['Deploy in 1 min', '1,000+ tools', 'Zero data loss', '24/7 always on'].map(tag => (
                  <Badge key={tag} variant="outline" className="px-3 py-1.5 text-[12px]">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={handleAddToSlack}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-lg text-[15px] font-semibold bg-[#4A154B] text-white transition-all overflow-hidden shadow-md shadow-[#4A154B]/15 hover:shadow-lg hover:shadow-[#4A154B]/25"
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-[#E01E5A]/20 via-[#36C5F0]/20 to-[#2EB67D]/20 transition-opacity duration-500 ${hovering ? 'opacity-100' : 'opacity-0'}`} />
                <div className="relative flex items-center gap-3">
                  <SlackIcon size={20} />
                  Add to Slack
                  <ArrowRight size={15} className={`transition-transform duration-200 ${hovering ? 'translate-x-0.5' : ''}`} />
                </div>
              </button>

              <p className="text-[11px] text-text-muted mt-4 max-w-[380px] mx-auto leading-relaxed">
                Free during beta. Only accesses channels it's invited to.
              </p>
            </div>
          </div>
        )}

        {(phase === 'installing' || phase === 'done') && (
          <div className="w-full max-w-[520px]">
            {/* Animated connection graphic */}
            <div className="flex justify-center mb-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative flex items-center gap-4"
              >
                <div className="w-14 h-14 rounded-[6px] bg-surface-1 border border-border-subtle flex items-center justify-center">
                  <SlackIcon size={28} />
                </div>
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-8 h-0.5 bg-gradient-to-r from-border to-accent/50"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <motion.div
                    className="w-3 h-3 rounded-full bg-accent"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                  <motion.div
                    className="w-8 h-0.5 bg-gradient-to-r from-accent/50 to-border"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                  />
                </div>
                <div className="w-14 h-14 rounded-[6px] bg-surface-1 border border-border-subtle flex items-center justify-center p-2">
                  <img src="/brand/nexu logo-black1.svg" alt="nexu" className="h-full w-auto object-contain" />
                </div>
              </motion.div>
            </div>

            <div className="text-center">
              <h1 className="text-[28px] sm:text-[34px] font-bold text-text-primary leading-[1.15] tracking-tight mb-3">
                {phase === 'done' ? (
                  <>nexu is in your Slack. <span className="text-accent">Let&apos;s go.</span></>
                ) : (
                  'Deploying your AI coworker...'
                )}
              </h1>
              <p className="text-[14px] text-text-tertiary leading-relaxed max-w-[420px] mx-auto mb-8">
                {phase === 'done'
                  ? '1,000+ tools activated, memory initialized. @ nexu in any channel — or explore your workspace first.'
                  : 'Connecting Slack, activating 1,000+ tools, and initializing persistent memory. This only takes a few seconds.'}
              </p>

              {/* Progress bar */}
              <div className="max-w-[420px] mx-auto mb-10">
                <div className="h-2 rounded-full bg-surface-1 border border-border overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-accent/80"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
                <div className="flex justify-between mt-2.5">
                  <span className="text-[12px] font-medium text-text-secondary">{doneCount}/{SETUP_STEPS.length} steps</span>
                  <span className="text-[12px] font-medium text-accent">{Math.round(progress)}%</span>
                </div>
              </div>
            </div>

            {/* Steps list */}
            <div className="space-y-2 max-w-[420px] mx-auto mb-10">
              <AnimatePresence>
                {SETUP_STEPS.map((s, idx) => {
                  const status = stepStatuses[s.id];
                  const Icon = s.icon;
                  return (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all text-left ${
                        status === 'running'
                          ? 'bg-accent/8 border border-accent/12 shadow-sm shadow-accent/5'
                          : status === 'done'
                            ? 'bg-[var(--color-success-subtle)] border border-[rgba(52,110,88,0.15)]'
                            : 'border border-border/50 bg-surface-1/50 opacity-60'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-surface-0 border border-border">
                        {status === 'done' ? (
                          <div className="w-6 h-6 rounded-full bg-[rgba(52,110,88,0.20)] flex items-center justify-center">
                            <Check size={14} className="text-[var(--color-success)]" />
                          </div>
                        ) : status === 'running' ? (
                          <Loader2 size={18} className="text-accent animate-spin" />
                        ) : (
                          <span className="text-text-muted"><Icon size={18} /></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-[14px] font-semibold ${
                          status === 'done' ? 'text-[var(--color-success)]' : status === 'running' ? 'text-text-primary' : 'text-text-muted'
                        }`}>
                          {s.label}
                        </div>
                        <div className="text-[12px] text-text-muted mt-0.5">{s.detail}</div>
                      </div>
                      {status === 'done' && (
                        <Badge variant="success" className="shrink-0">Done</Badge>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 4: Workspace                                                  */
/* ------------------------------------------------------------------ */

function WorkspaceStep({ onChatInSlack }: { onChatInSlack: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoHover, setVideoHover] = useState(false);
  const [typingIdx, setTypingIdx] = useState(0);
  const welcomeMessage = "Welcome! \u{1F389} We're so glad you're here. Your setup is complete \u2014 click \"Chat in Slack\" on the right to start chatting with nexu. We're here whenever you need us.";

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.loop = false;
    v.play().catch(() => {});
    const onEnded = () => { v.pause(); };
    v.addEventListener('ended', onEnded);
    return () => v.removeEventListener('ended', onEnded);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (videoHover) { v.loop = true; v.play().catch(() => {}); }
    else { v.loop = false; v.pause(); }
  }, [videoHover]);

  useEffect(() => {
    if (typingIdx >= welcomeMessage.length) return;
    const timer = setTimeout(() => setTypingIdx(i => i + 1), 35);
    return () => clearTimeout(timer);
  }, [typingIdx, welcomeMessage.length]);

  const typingDone = typingIdx >= welcomeMessage.length;

  const stats = [
    { label: 'Active channels', value: '3', icon: MessageSquare },
    { label: 'Total messages', value: '156', icon: Activity },
    { label: 'Deployments', value: '2', icon: Rocket },
    { label: 'Skills enabled', value: '42', icon: Sparkles },
  ];

  return (
    <div className="relative flex h-full">
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col w-48 shrink-0 border-r border-border bg-surface-1">
        <div className="flex items-center px-3 py-3 gap-2.5 border-b border-border">
          <img src="/brand/nexu logo-black4.svg" alt="nexu" className="h-6 w-auto max-w-[8rem] shrink-0 object-contain" />
        </div>
        <div className="flex-1 overflow-y-auto px-2 pt-3 space-y-0.5">
          {([
            { label: 'Home', icon: Home, active: true },
            { label: 'Conversations', icon: MessageSquare, count: '3' },
            { label: 'Deployments', icon: Rocket },
            { label: 'Skills', icon: Sparkles, count: '42' },
            { label: 'Settings', icon: Settings },
          ] as const).map(item => (
            <div
              key={item.label}
              className={`flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                'active' in item && item.active ? 'bg-accent/10 text-accent' : 'text-text-muted'
              }`}
            >
              <item.icon size={16} />
              {item.label}
              {'count' in item && <span className="ml-auto text-[10px] text-text-muted font-normal">{item.count}</span>}
            </div>
          ))}
        </div>
        <div className="border-t border-border px-2 py-2">
          <div className="flex gap-2.5 items-center px-2 py-2 rounded-lg">
            <img src="/default-avatar.png" alt="" className="w-7 h-7 rounded-md object-cover ring-1 ring-accent/10 shrink-0" />
            <div className="text-[12px] text-text-primary truncate font-medium">s@nexu.dev</div>
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 overflow-y-auto min-h-0 bg-surface-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* nexu intro card */}
          <div className="mb-8 rounded-lg overflow-hidden bg-surface-1 shadow-[var(--shadow-rest)]">
            <div className="relative">
              <div
                className="aspect-[16/9] max-h-48 bg-surface-2 cursor-default"
                onMouseEnter={() => setVideoHover(true)}
                onMouseLeave={() => setVideoHover(false)}
              >
                <video
                  ref={videoRef}
                  src="/nexu-alpha.mp4"
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
              <h2
                className="absolute right-40 sm:right-56 top-[55%] -translate-y-1/2 text-[40px] sm:text-[52px] font-normal tracking-tight text-text-primary"
                style={{ fontFamily: 'var(--font-script)' }}
              >
                nexu Alpha
              </h2>
            </div>
            <div className="px-6 py-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-text-secondary font-medium leading-relaxed">
                    {typingDone ? welcomeMessage : (
                      <>
                        {welcomeMessage.slice(0, typingIdx)}
                        <span className="inline-block w-0.5 h-3.5 ml-0.5 bg-accent animate-pulse align-middle" />
                      </>
                    )}
                  </p>
                  {typingDone && (
                    <div className="flex items-center gap-3 mt-4 text-[11px] text-text-muted">
                      <span>Created 2026-02-18</span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]/90" />
                        Running
                      </span>
                      <span>Last active 2 min ago</span>
                      <span>12 messages today</span>
                    </div>
                  )}
                </div>
                <Button
                  onClick={onChatInSlack}
                  className="shrink-0"
                >
                  <SlackIcon size={14} />
                  Chat in Slack
                  <ArrowUpRight size={12} className="opacity-70" />
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {stats.map(s => (
              <div
                key={s.label}
                className="card p-4 text-left"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <s.icon size={16} className="text-accent" strokeWidth={2} />
                  </div>
                </div>
                <div className="text-[24px] font-bold text-text-primary tracking-tight">{s.value}</div>
                <div className="text-[11px] text-text-muted mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 5: Slack Intro (nexu self-introduction DM)                    */
/* ------------------------------------------------------------------ */

const NEXU_INTRO_MESSAGE = '👋 Hi! I\'m nexu — your AI coworker.\n\nI\'ve joined your Slack workspace. Here\'s what I can help with:\n\n• 💬 **Communication** — Channel summaries, emails, meetings, translation\n• 📋 **Collaboration** — Meeting notes, weekly reports, todo creation\n• 📊 **Analysis** — Competitor analysis, metrics tracking, research synthesis\n• 🎨 **Creation** — Image generation, doc handling, slide decks\n• 🔍 **Search** — Web search, content summaries, knowledge organization\n• 🧠 **Memory** — Remembers your preferences, gets smarter over time\n\nJust @mention nexu and tell me what you need — no commands to memorize.\n\nTry: "Summarize the recent discussion" or "Draft a weekly report"';

const SUGGESTION_BUBBLES = [
  {
    label: 'Summarize #general discussion',
    reply: 'Sure! Here\'s what\'s been discussed in #general…\n\n📋 **#general Summary (past 24h)**\n\n1. @Alex proposed a new product roadmap, team feedback was positive\n2. @Jordan shared competitor analysis, focusing on pricing strategy\n3. @Sam confirmed the all-hands meeting for next Wednesday\n\nWant me to expand on any topic?',
  },
  {
    label: 'Draft this week\'s report',
    reply: 'Done! Based on your Slack activity this week, here\'s a draft 👇\n\n📝 **Weekly Report**\n\n**Done**\n• Q1 product roadmap review complete\n• Launched user feedback collection\n• Fixed 3 customer-reported bugs\n\n**In progress**\n• New feature prototype (ETA next week)\n\n**Next week**\n• Kick off v2.0 requirements review\n• Prep investor monthly update\n\nNeed format or content changes?',
  },
  {
    label: 'Search latest AI Agent trends',
    reply: 'Searching for the latest… 🔍\n\n**AI Agent Trends (March 2026)**\n\n1. **Multi-Agent collaboration** — Multi-agent workflows for complex tasks becoming mainstream\n2. **Enterprise AI coworkers** — Evolving from personal assistants to team-level roles in Slack and beyond\n3. **Tool-use explosion** — Single agents calling 1,000+ external tools for search, docs, analytics\n\nSources: TechCrunch, The Verge, a16z\n\nWant a full analysis report?',
  },
];

function SlackIntroStep({ onNeedAuth }: { onNeedAuth: () => void }) {
  const [phase, setPhase] = useState<'typing' | 'sent'>('typing');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [replyPhase, setReplyPhase] = useState<'idle' | 'typing' | 'sent'>('idle');
  // OAuth follow-up state
  const [oauthPhase, setOauthPhase] = useState<'idle' | 'show-suggestion' | 'user-sent' | 'bot-typing' | 'bot-sent'>('idle');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setPhase('sent'), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [phase, selectedIdx, replyPhase]);

  const handleSuggestion = (idx: number) => {
    setSelectedIdx(idx);
    setReplyPhase('typing');
    setTimeout(() => setReplyPhase('sent'), 2000);
  };

  // Show OAuth suggestion after first reply is sent
  useEffect(() => {
    if (replyPhase !== 'sent') return;
    const timer = setTimeout(() => setOauthPhase('show-suggestion'), 1500);
    return () => clearTimeout(timer);
  }, [replyPhase]);

  const handleOauthSuggestion = () => {
    setOauthPhase('user-sent');
    setTimeout(() => setOauthPhase('bot-typing'), 400);
    setTimeout(() => setOauthPhase('bot-sent'), 2400);
  };

  return (
    <div className="flex h-full" style={{ backgroundColor: SLACK_BG }}>
      <SlackSidebar mode="dm" />

      <div className="flex flex-col flex-1 min-w-0 bg-white">
        {/* DM header */}
        <div className="flex items-center gap-2 px-3 sm:px-5 h-[49px] border-b border-[#e8e8e8] shrink-0">
          <SlackAvatar name="nexu" size={24} isBot />
          <span className="font-[900] text-[15px] text-[#1d1c1d]">nexu</span>
          <span className="text-[10px] px-1 py-0.5 rounded bg-[#ecdeec] text-[#4a154b] font-bold leading-none">APP</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-3 space-y-4">
          {phase === 'typing' && (
            <div className="flex gap-2 mt-2">
              <div className="w-9 shrink-0">
                <SlackAvatar name="nexu" size={36} isBot />
              </div>
              <div>
                <span className="text-[15px] font-[900] text-[#1264a3]">nexu</span>
                <div className="mt-1 flex gap-1.5 items-center h-5">
                  <span className="w-[6px] h-[6px] rounded-full bg-[#868686] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-[6px] h-[6px] rounded-full bg-[#868686] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-[6px] h-[6px] rounded-full bg-[#868686] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {phase === 'sent' && (
            <>
              {/* nexu intro message */}
              <div className="flex gap-2 mt-2">
                <div className="w-9 shrink-0">
                  <SlackAvatar name="nexu" size={36} isBot />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-[15px] font-[900] text-[#1264a3] cursor-pointer hover:underline">nexu</span>
                    <span className="text-[10px] px-1 py-0.5 rounded bg-[#ecdeec] text-[#4a154b] font-bold leading-none">APP</span>
                    <span className="text-[12px] text-[#616061]">Just now</span>
                  </div>
                  <div className="text-[15px] text-[#1d1c1d] leading-[1.46] whitespace-pre-line [&_strong]:font-[700]">
                    {NEXU_INTRO_MESSAGE}
                  </div>
                </div>
              </div>

              {/* Suggestion bubbles */}
              {selectedIdx === null && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  className="flex flex-col gap-2 pl-11"
                >
                  <span className="text-[13px] text-[#616061] mb-0.5">Try these prompts:</span>
                  {SUGGESTION_BUBBLES.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestion(i)}
                      className="self-start px-3.5 py-2 rounded-lg border border-[#d1d1d1] text-[13px] text-[#1d1c1d] hover:bg-[#f8f8f8] hover:border-[#1264a3] hover:text-[#1264a3] transition-all cursor-pointer text-left"
                    >
                      {s.label}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* User message */}
              {selectedIdx !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2"
                >
                  <div className="w-9 shrink-0">
                    <div className="w-9 h-9 rounded-md bg-[#4a154b] flex items-center justify-center text-white text-[14px] font-bold">Y</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className="text-[15px] font-[900] text-[#1d1c1d]">You</span>
                      <span className="text-[12px] text-[#616061]">Just now</span>
                    </div>
                    <div className="text-[15px] text-[#1d1c1d] leading-[1.46]">
                      {SUGGESTION_BUBBLES[selectedIdx].label}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* nexu reply — typing */}
              {replyPhase === 'typing' && (
                <div className="flex gap-2">
                  <div className="w-9 shrink-0">
                    <SlackAvatar name="nexu" size={36} isBot />
                  </div>
                  <div>
                    <span className="text-[15px] font-[900] text-[#1264a3]">nexu</span>
                    <div className="mt-1 flex gap-1.5 items-center h-5">
                      <span className="w-[6px] h-[6px] rounded-full bg-[#868686] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-[6px] h-[6px] rounded-full bg-[#868686] animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-[6px] h-[6px] rounded-full bg-[#868686] animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              {/* nexu reply — sent */}
              {replyPhase === 'sent' && selectedIdx !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2"
                >
                  <div className="w-9 shrink-0">
                    <SlackAvatar name="nexu" size={36} isBot />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className="text-[15px] font-[900] text-[#1264a3] cursor-pointer hover:underline">nexu</span>
                      <span className="text-[10px] px-1 py-0.5 rounded bg-[#ecdeec] text-[#4a154b] font-bold leading-none">APP</span>
                      <span className="text-[12px] text-[#616061]">Just now</span>
                    </div>
                    <div className="text-[15px] text-[#1d1c1d] leading-[1.46] whitespace-pre-line [&_strong]:font-[700]">
                      {SUGGESTION_BUBBLES[selectedIdx].reply}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* OAuth follow-up: suggestion bubble */}
              {oauthPhase === 'show-suggestion' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pl-11"
                >
                  <span className="text-[13px] text-[#616061] mb-1.5 block">Keep trying:</span>
                  <button
                    onClick={handleOauthSuggestion}
                    className="self-start px-3.5 py-2 rounded-lg border border-[#d1d1d1] text-[13px] text-[#1d1c1d] hover:bg-[#f8f8f8] hover:border-[#1264a3] hover:text-[#1264a3] transition-all cursor-pointer text-left flex items-center gap-2"
                  >
                    <Calendar size={14} className="text-[#1264a3] shrink-0" />
                    Check tomorrow's calendar and email the team a reminder
                  </button>
                </motion.div>
              )}

              {/* OAuth follow-up: user message */}
              {(oauthPhase === 'user-sent' || oauthPhase === 'bot-typing' || oauthPhase === 'bot-sent') && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2"
                >
                  <div className="w-9 shrink-0">
                    <div className="w-9 h-9 rounded-md bg-[#4a154b] flex items-center justify-center text-white text-[14px] font-bold">Y</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className="text-[15px] font-[900] text-[#1d1c1d]">You</span>
                      <span className="text-[12px] text-[#616061]">Just now</span>
                    </div>
                    <div className="text-[15px] text-[#1d1c1d] leading-[1.46]">
                      Check tomorrow's calendar and email the team a reminder
                    </div>
                  </div>
                </motion.div>
              )}

              {/* OAuth follow-up: bot typing */}
              {oauthPhase === 'bot-typing' && (
                <div className="flex gap-2">
                  <div className="w-9 shrink-0">
                    <SlackAvatar name="nexu" size={36} isBot />
                  </div>
                  <div>
                    <span className="text-[15px] font-[900] text-[#1264a3]">nexu</span>
                    <div className="mt-1 flex gap-1.5 items-center h-5">
                      <span className="w-[6px] h-[6px] rounded-full bg-[#868686] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-[6px] h-[6px] rounded-full bg-[#868686] animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-[6px] h-[6px] rounded-full bg-[#868686] animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              {/* OAuth follow-up: bot reply with auth card */}
              {oauthPhase === 'bot-sent' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2"
                >
                  <div className="w-9 shrink-0">
                    <SlackAvatar name="nexu" size={36} isBot />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className="text-[15px] font-[900] text-[#1264a3] cursor-pointer hover:underline">nexu</span>
                      <span className="text-[10px] px-1 py-0.5 rounded bg-[#ecdeec] text-[#4a154b] font-bold leading-none">APP</span>
                      <span className="text-[12px] text-[#616061]">Just now</span>
                    </div>
                    <div className="text-[15px] text-[#1d1c1d] leading-[1.46] whitespace-pre-line">
                      To complete this, I need access to your Google Calendar and Gmail. Please authorize first 🔐
                    </div>
                    {/* OAuth authorization card */}
                    <div className="mt-3 rounded-lg border border-[#d1d1d1] bg-white overflow-hidden max-w-[360px]">
                      <div className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-[#4285F4]/10 flex items-center justify-center shrink-0">
                            <svg width="20" height="20" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-[14px] font-[700] text-[#1d1c1d]">Google Calendar & Gmail</div>
                            <div className="text-[12px] text-[#616061]">Google · OAuth 2.0</div>
                          </div>
                        </div>
                        <div className="space-y-1.5 mb-3">
                          {['Read calendar events', 'Send email notifications', 'Scope limited to nexu tasks'].map((p, i) => (
                            <div key={i} className="flex items-center gap-2 text-[12px] text-[#616061]">
                              <Shield size={11} className="text-[#1264a3] shrink-0" />
                              {p}
                            </div>
                          ))}
                        </div>
                        <Button
                          onClick={onNeedAuth}
                          className="w-full bg-[#007a5a] hover:bg-[#148567] text-white text-[13px] font-[700] rounded-md"
                        >
                          <ExternalLink size={13} />
                          Connect Google Account
                        </Button>
                      </div>
                      <div className="px-4 py-2 bg-[#f8f8f8] border-t border-[#e8e8e8]">
                        <p className="text-[11px] text-[#616061]">nexu uses OAuth 2.0 — your password is never stored.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Input */}
        <div className="px-3 sm:px-5 pb-3 sm:pb-4">
          <div className="border border-[#c4c4c4] rounded-lg">
            <div className="flex items-center px-3 py-2">
              <input
                type="text"
                placeholder="Message nexu"
                className="flex-1 bg-transparent text-[15px] text-[#1d1c1d] placeholder:text-[#868686] focus:outline-none"
                readOnly
              />
            </div>
            <div className="flex items-center justify-between px-2 py-1.5 border-t border-[#e8e8e8]">
              <div className="flex items-center gap-0.5">
                <button className="hidden sm:inline-flex p-1.5 rounded hover:bg-[#f0f0f0] text-[#616061] transition-colors">
                  <Bold size={15} />
                </button>
                <button className="hidden sm:inline-flex p-1.5 rounded hover:bg-[#f0f0f0] text-[#616061] transition-colors">
                  <Italic size={15} />
                </button>
                <div className="hidden sm:block w-px h-4 bg-[#e8e8e8] mx-1" />
                <button className="p-1.5 rounded hover:bg-[#f0f0f0] text-[#616061] transition-colors">
                  <Paperclip size={15} />
                </button>
                <button className="hidden sm:inline-flex p-1.5 rounded hover:bg-[#f0f0f0] text-[#616061] transition-colors">
                  <AtSign size={15} />
                </button>
                <button className="p-1.5 rounded hover:bg-[#f0f0f0] text-[#616061] transition-colors">
                  <Smile size={15} />
                </button>
              </div>
              <Button size="icon" disabled className="h-7 w-7 rounded bg-[#dddddd] text-white">
                <Send size={15} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 6: OAuth Authorization                                        */
/* ------------------------------------------------------------------ */

type OAuthPhase = 'connecting' | 'authorizing' | 'success';

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function OAuthDemoStep({ onReturnToSlack }: { onReturnToSlack: () => void }) {
  const [phase, setPhase] = useState<OAuthPhase>('connecting');
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('authorizing'), 1200);
    const t2 = setTimeout(() => setPhase('success'), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="h-full bg-surface-0 flex flex-col relative overflow-hidden">
      {/* Background — same as ClaimPage / InviteCode */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--color-accent-rgb,99,102,241),0.06)_0%,transparent_50%)] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 sm:px-10 h-14 shrink-0">
        <div className="flex items-center gap-2.5">
          <img src="/brand/nexu logo-black4.svg" alt="nexu" className="h-6 w-auto object-contain" />
        </div>
      </nav>

      {/* Main */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-[440px]">

          {phase !== 'success' ? (
            <>
              {/* Connection graphic */}
              <div className="flex items-center gap-3 mb-6 justify-center">
                <div className="w-12 h-12 rounded-[6px] bg-surface-1 border border-border-subtle flex items-center justify-center">
                  <GoogleIcon />
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-5 h-px bg-border" />
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <div className="w-5 h-px bg-border" />
                </div>
                <div className="w-12 h-12 rounded-[6px] bg-surface-1 border border-border-subtle flex items-center justify-center p-1.5">
                  <img src="/brand/nexu logo-black1.svg" alt="nexu" className="h-full w-auto object-contain" />
                </div>
              </div>

              {/* Headline */}
              <div className="text-center mb-8">
                <h1 className="text-[26px] sm:text-[32px] font-bold text-text-primary leading-[1.15] tracking-tight mb-3">
                  Connect Google account
                </h1>
                <p className="text-[14px] text-text-tertiary leading-relaxed max-w-[340px] mx-auto">
                  nexu is requesting access to your Google Calendar and Gmail to complete calendar queries and email tasks.
                </p>
              </div>

              {/* Permissions card */}
              <div className="rounded-[12px] border border-border-subtle bg-surface-1 p-5 mb-6">
                <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-3">Requested permissions</div>
                <div className="space-y-3">
                  {[
                    { icon: Calendar, label: 'Read your Google Calendar' },
                    { icon: Mail, label: 'Send emails via Gmail' },
                    { icon: Shield, label: 'Scope limited to nexu tasks' },
                  ].map((perm, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/8 flex items-center justify-center shrink-0">
                        <perm.icon size={14} className="text-accent" />
                      </div>
                      <span className="text-[13px] text-text-secondary leading-relaxed">{perm.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress indicator */}
              <div className="flex items-center justify-center gap-3 py-3 mb-4">
                <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                <span className="text-[14px] text-text-muted font-medium">
                  {phase === 'connecting' ? 'Connecting to Google...' : 'Waiting for authorization...'}
                </span>
              </div>

              <p className="text-[12px] text-text-muted text-center leading-relaxed max-w-[340px] mx-auto">
                nexu uses OAuth 2.0. Your password is never stored. You can revoke access anytime.
              </p>
            </>
          ) : (
            <>
              {/* Success graphic */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[var(--color-success-subtle)] flex items-center justify-center">
                  <Check size={32} className="text-[var(--color-success)]" />
                </div>
              </div>

              {/* Headline */}
              <div className="text-center mb-8">
                <h1 className="text-[26px] sm:text-[32px] font-bold text-text-primary leading-[1.15] tracking-tight mb-3">
                  Authorization successful
                </h1>
                <p className="text-[14px] text-text-tertiary leading-relaxed max-w-[360px] mx-auto">
                  Google Calendar and Gmail are now connected to nexu. I can help with calendar and email tasks.
                </p>
              </div>

              {/* Connected services */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <Badge variant="success" className="px-3 py-1.5 text-[12px] gap-1.5">
                  <Check size={12} /> Google Calendar
                </Badge>
                <Badge variant="success" className="px-3 py-1.5 text-[12px] gap-1.5">
                  <Check size={12} /> Gmail
                </Badge>
              </div>

              {/* Return to Slack button */}
              <button
                onClick={onReturnToSlack}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                className="group relative w-full inline-flex items-center justify-center gap-3 py-4 rounded-xl text-[16px] font-semibold bg-[#4A154B] text-white transition-all overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-[#E01E5A]/20 via-[#36C5F0]/20 to-[#2EB67D]/20 transition-opacity duration-500 ${hovering ? 'opacity-100' : 'opacity-0'}`} />
                <div className="relative flex items-center gap-3">
                  <SlackIcon size={20} />
                  Back to Slack
                  <ArrowRight size={16} className={`transition-transform duration-200 ${hovering ? 'translate-x-0.5' : ''}`} />
                </div>
              </button>

              <p className="text-[12px] text-text-muted text-center mt-4">
                Manage connected services in workspace settings anytime
              </p>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-center gap-4 pb-5 text-[11px] text-text-muted">
        <span>Terms</span>
        <span>Privacy</span>
        <span>© 2026 Powerformer, Inc.</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Demo Page                                                     */
/* ------------------------------------------------------------------ */

export default function GroupGrowthDemo() {
  usePageTitle('IM Journey');
  const navigate = useNavigate();
  const [step, setStep] = useState<DemoStep>('group-chat');

  const STEP_LABELS: { id: DemoStep; label: string; num: number }[] = [
    { id: 'group-chat', label: 'Group chat', num: 1 },
    { id: 'claim-page', label: 'Sign up / Login', num: 2 },
    { id: 'invite-code', label: 'Invite code', num: 3 },
    { id: 'setup', label: 'Add to Slack', num: 4 },
    { id: 'workspace', label: 'Workspace', num: 5 },
    { id: 'slack-intro', label: 'Get started', num: 6 },
    { id: 'oauth-auth', label: 'Authorize tools', num: 7 },
  ];

  const currentIdx = STEP_LABELS.findIndex((s) => s.id === step);

  return (
    <div className="flex flex-col h-screen bg-surface-0">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 px-3 sm:px-5 py-2.5 sm:py-3 border-b border-border bg-surface-0 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/openclaw')}
          className="text-[12px] sm:text-[13px] text-text-muted hover:text-text-primary"
        >
          <ArrowLeft size={14} />
          Back to MVP
        </Button>

        <div className="hidden sm:block h-4 w-px bg-border" />

        <div className="flex items-center gap-1 text-[12px] sm:text-[13px] font-medium text-text-primary">
          <Bot size={16} className="text-accent" />
          IM Journey
        </div>

        {/* Step indicator */}
        <div className="w-full sm:w-auto sm:ml-auto flex items-center gap-1 overflow-x-auto no-scrollbar pt-1 sm:pt-0">
          {STEP_LABELS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => {
                if (i <= currentIdx) setStep(s.id);
              }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] sm:text-[12px] transition-colors shrink-0 ${
                s.id === step
                  ? 'bg-accent/10 text-accent font-medium'
                  : i < currentIdx
                    ? 'text-success cursor-pointer hover:bg-surface-2'
                    : 'text-text-muted'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                i < currentIdx
                  ? 'bg-success/10 text-success'
                  : s.id === step
                    ? 'bg-accent/10 text-accent'
                    : 'bg-surface-2 text-text-muted'
              }`}>
                {i < currentIdx ? <Check size={10} /> : s.num}
              </span>
              <span className="inline">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {step === 'group-chat' && (
          <GroupChatStep onClaim={() => setStep('claim-page')} />
        )}
        {step === 'claim-page' && (
          <ClaimPageStep
            onAuthorize={() => setStep('invite-code')}
          />
        )}
        {step === 'invite-code' && (
          <InviteCodeStep onComplete={() => setStep('setup')} />
        )}
        {step === 'setup' && (
          <SetupStep onComplete={() => setStep('workspace')} />
        )}
        {step === 'workspace' && (
          <WorkspaceStep onChatInSlack={() => setStep('slack-intro')} />
        )}
        {step === 'slack-intro' && (
          <SlackIntroStep onNeedAuth={() => setStep('oauth-auth')} />
        )}
        {step === 'oauth-auth' && (
          <OAuthDemoStep onReturnToSlack={() => setStep('slack-intro')} />
        )}
      </div>
    </div>
  );
}
