import { useState, useRef, useEffect } from 'react';
import { Send, Hash, ChevronDown, Search, Bookmark } from 'lucide-react';
import { Badge, Button } from '@nexu-design/ui-web';

const SLACK_BG = '#1a1d21';
const SLACK_SIDEBAR = '#19171D';
const SLACK_ACTIVE = 'rgba(255,255,255,0.12)';

const AVATAR_COLORS: Record<string, string> = {
  'nexu': '#E01E5A',
  'You': '#ECB22E',
};

function SlackAvatar({ name, size = 36, isBot }: { name: string; size?: number; isBot?: boolean }) {
  const color = AVATAR_COLORS[name] || '#7C3AED';
  if (isBot) {
    return (
      <div
        className="rounded-lg flex items-center justify-center shrink-0"
        style={{ width: size, height: size, background: `${color}18` }}
      >
        <span style={{ fontSize: size * 0.5 }}>🦞</span>
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

function SlackIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="currentColor" />
    </svg>
  );
}

interface ToolOAuthInfo {
  tool: string;
  provider: string;
  permissions: string;
  icon: 'google' | 'notion' | 'figma' | 'github' | 'x' | 'slack' | 'other';
}

const detectRequiredTool = (text: string): ToolOAuthInfo | null => {
  const lower = text.toLowerCase();
  if (lower.includes('email') || lower.includes('gmail'))
    return { tool: 'Gmail', provider: 'Google', permissions: 'Read/write Gmail', icon: 'google' };
  if (lower.includes('calendar') || lower.includes('meeting'))
    return { tool: 'Google Calendar', provider: 'Google', permissions: 'Read/write Calendar', icon: 'google' };
  if (lower.includes('notion'))
    return { tool: 'Notion', provider: 'Notion', permissions: 'Read/write pages', icon: 'notion' };
  if (lower.includes('figma'))
    return { tool: 'Figma', provider: 'Figma', permissions: 'Read design files', icon: 'figma' };
  if (lower.includes('pr') || lower.includes('github') || lower.includes('issue'))
    return { tool: 'GitHub', provider: 'GitHub', permissions: 'Read/write repo', icon: 'github' };
  if (lower.includes('tweet') || lower.includes('twitter'))
    return { tool: 'X (Twitter)', provider: 'X', permissions: 'Post/read tweets', icon: 'x' };
  if (lower.includes('slack') || lower.includes('channel'))
    return { tool: 'Slack', provider: 'Slack', permissions: 'Read/write messages', icon: 'slack' };
  if (lower.includes('spreadsheet') || lower.includes('sheet'))
    return { tool: 'Google Sheets', provider: 'Google', permissions: 'Read/write sheets', icon: 'google' };
  if (lower.includes('docs'))
    return { tool: 'Google Docs', provider: 'Google', permissions: 'Read/write docs', icon: 'google' };
  if (lower.includes('drive') || lower.includes('file'))
    return { tool: 'Google Drive', provider: 'Google', permissions: 'Read/write files', icon: 'google' };
  if (lower.includes('outlook'))
    return { tool: 'Outlook', provider: 'Microsoft', permissions: 'Read/write email', icon: 'other' };
  if (lower.includes('teams'))
    return { tool: 'Microsoft Teams', provider: 'Microsoft', permissions: 'Read/write messages', icon: 'other' };
  if (lower.includes('trello'))
    return { tool: 'Trello', provider: 'Trello', permissions: 'Read/write boards', icon: 'other' };
  if (lower.includes('asana'))
    return { tool: 'Asana', provider: 'Asana', permissions: 'Read/write projects', icon: 'other' };
  if (lower.includes('zoom'))
    return { tool: 'Zoom', provider: 'Zoom', permissions: 'Manage meetings', icon: 'other' };
  return null;
};

interface ChatMessage {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  type: 'text' | 'oauth-prompt' | 'oauth-success';
  tool?: ToolOAuthInfo;
}

const SUGGESTIONS = [
  'Check today\'s emails',
  'Organize this week\'s meetings',
  'Create a new page in Notion',
  'Check for new PRs on GitHub',
  'Post a tweet',
  'Upload this file to Google Drive',
];

export default function IMOAuthDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [authorizedTools, setAuthorizedTools] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  let nextId = useRef(0);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const addMessage = (msg: Omit<ChatMessage, 'id'>) => {
    const id = nextId.current++;
    setMessages(prev => [...prev, { ...msg, id }]);
    return id;
  };

  const handleSend = (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || typing) return;
    setInput('');

    addMessage({ sender: 'user', text: msg, type: 'text' });
    setTyping(true);

    const tool = detectRequiredTool(msg);

    if (tool && !authorizedTools.has(tool.tool)) {
      setTimeout(() => {
        setTyping(false);
        addMessage({
          sender: 'bot',
          text: `This action requires **${tool.tool}**, which you haven't authorized yet. Authorize and I can do it for you.`,
          type: 'oauth-prompt',
          tool,
        });
      }, 1200);
    } else if (tool && authorizedTools.has(tool.tool)) {
      setTimeout(() => {
        setTyping(false);
        addMessage({
          sender: 'bot',
          text: `Processing your request via ${tool.tool}…`,
          type: 'text',
        });
      }, 1500);
    } else {
      setTimeout(() => {
        setTyping(false);
        addMessage({
          sender: 'bot',
          text: `I'll help with that.`,
          type: 'text',
        });
      }, 1500);
    }
  };

  const handleOAuthConnect = (tool: ToolOAuthInfo, msgId: number) => {
    setAuthorizedTools(prev => new Set([...prev, tool.tool]));
    setMessages(prev => prev.map(m =>
      m.id === msgId ? { ...m, type: 'oauth-success' as const } : m
    ));
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      addMessage({
        sender: 'bot',
        text: `✅ ${tool.tool} authorized! Processing…`,
        type: 'text',
      });
    }, 1500);
  };

  const GoogleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );

  return (
    <div className="flex h-screen" style={{ backgroundColor: SLACK_BG }}>
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col w-[220px] text-white shrink-0" style={{ backgroundColor: SLACK_SIDEBAR }}>
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-[26px] h-[26px] rounded-md bg-white/10 flex items-center justify-center">
              <SlackIcon size={15} />
            </div>
            <div className="text-[14px] font-bold leading-tight">nexu Community</div>
          </div>
          <ChevronDown size={14} className="text-white/40" />
        </div>
        <div className="px-2 space-y-0.5">
          <div className="flex items-center gap-2 px-2 py-[5px] rounded-md text-[13px] text-white/70 hover:bg-white/[0.06] cursor-pointer">
            <Search size={15} className="text-white/50" /> Search
          </div>
          <div className="flex items-center gap-2 px-2 py-[5px] rounded-md text-[13px] text-white/70 hover:bg-white/[0.06] cursor-pointer">
            <Bookmark size={15} className="text-white/50" /> Later
          </div>
        </div>
        <div className="mt-3 px-2 flex-1 overflow-y-auto space-y-3">
          <div>
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-[12px] font-medium text-white/50">Channels</span>
            </div>
            {['General', 'Product Roadmap', 'Engineering'].map((ch) => (
              <div key={ch} className="flex items-center gap-1.5 px-2 py-[5px] rounded-md text-[13px] text-white/65 cursor-pointer hover:bg-white/[0.06]">
                <Hash size={14} className="opacity-40" />
                <span>{ch}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-[12px] font-medium text-white/50">DMs</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-[5px] rounded-md text-[13px] cursor-pointer" style={{ backgroundColor: SLACK_ACTIVE, color: '#fff' }}>
              <SlackAvatar name="nexu" size={20} isBot />
              <span>nexu</span>
              <span className="text-[9px] px-1 py-0.5 rounded bg-[#ecdeec] text-[#4a154b] font-bold leading-none ml-auto">APP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex flex-col flex-1 min-w-0 bg-white">
        {/* Header */}
        <div className="flex items-center gap-2 px-5 h-[49px] border-b border-[#e8e8e8] shrink-0">
          <SlackAvatar name="nexu" size={24} isBot />
          <span className="font-[900] text-[15px] text-[#1d1c1d]">nexu</span>
          <span className="text-[10px] px-1 py-0.5 rounded bg-[#ecdeec] text-[#4a154b] font-bold leading-none">APP</span>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Welcome */}
          <div className="flex gap-2">
            <div className="w-9 shrink-0"><SlackAvatar name="nexu" size={36} isBot /></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-0.5">
                <span className="text-[15px] font-[900] text-[#1264a3]">nexu</span>
                <span className="text-[10px] px-1 py-0.5 rounded bg-[#ecdeec] text-[#4a154b] font-bold leading-none">APP</span>
              </div>
              <div className="text-[15px] text-[#1d1c1d] leading-[1.46]">
                👋 Hi! I'm nexu, your AI work assistant. Tell me what you need and I'll help.
              </div>
              <div className="mt-3 text-[13px] text-[#616061] leading-relaxed">
                💡 Try these (external tools will trigger authorization):
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <Button
                    key={s}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSend(s)}
                    className="h-auto px-2.5 py-1.5 text-[12px] text-[#1d1c1d] border-[#d0d0d0] hover:bg-[#f8f8f8] hover:border-[#868686] rounded-md"
                  >
                    {s}
                  </Button>
                ))}
              </div>
              {authorizedTools.size > 0 && (
                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-[#616061]">Authorized:</span>
                  {[...authorizedTools].map(t => (
                    <Badge key={t} variant="success" className="text-[11px]">{t}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat messages */}
          {messages.map((msg) => (
            <div key={msg.id} className="flex gap-2">
              <div className="w-9 shrink-0">
                <SlackAvatar name={msg.sender === 'user' ? 'You' : 'nexu'} size={36} isBot={msg.sender === 'bot'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className={`text-[15px] font-[900] ${msg.sender === 'bot' ? 'text-[#1264a3]' : 'text-[#1d1c1d]'}`}>
                    {msg.sender === 'user' ? 'You' : 'nexu'}
                  </span>
                  {msg.sender === 'bot' && (
                    <span className="text-[10px] px-1 py-0.5 rounded bg-[#ecdeec] text-[#4a154b] font-bold leading-none">APP</span>
                  )}
                  <span className="text-[12px] text-[#616061]">Just now</span>
                </div>

                {msg.type === 'text' && (
                  <div className="text-[15px] text-[#1d1c1d] leading-[1.46]">{msg.text}</div>
                )}

                {msg.type === 'oauth-prompt' && msg.tool && (
                  <>
                    <div className="text-[15px] text-[#1d1c1d] leading-[1.46]">
                      This requires <strong>{msg.tool.tool}</strong>, which you haven't authorized. Authorize and I can help.
                    </div>
                    <div className="mt-3 p-3 rounded-lg border border-[#1264a3]/20 bg-[#1264a3]/[0.03] max-w-md">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-[#e8e8e8] flex items-center justify-center">
                          {msg.tool.icon === 'google' ? <GoogleIcon /> : (
                            <span className="text-[14px] font-bold text-[#1d1c1d]">{msg.tool.provider.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <div className="text-[13px] font-[700] text-[#1d1c1d]">Connect {msg.tool.tool}</div>
                          <div className="text-[11px] text-[#616061]">{msg.tool.permissions}</div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleOAuthConnect(msg.tool!, msg.id)}
                        className="w-full bg-[#007a5a] hover:bg-[#148567] text-white font-[700] rounded-md text-[13px]"
                      >
                        Authorize
                      </Button>
                      <div className="mt-2.5 space-y-1">
                        <div className="text-[11px] text-[#868686] leading-relaxed">
                          🔒 Only for your requested actions; no unrelated data is read.
                        </div>
                        <div className="text-[11px] text-[#1264a3] leading-relaxed">
                          💡 You can also authorize or disconnect anytime in <strong>Web → Skills</strong>.
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {msg.type === 'oauth-success' && msg.tool && (
                  <>
                    <div className="text-[15px] text-[#1d1c1d] leading-[1.46]">
                      This requires <strong>{msg.tool.tool}</strong>, which you haven't authorized.
                    </div>
                    <div className="mt-3 p-3 rounded-lg border border-[#2e7d32]/20 bg-[#e8f5e9]/50 max-w-md">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-[#e8e8e8] flex items-center justify-center">
                          {msg.tool.icon === 'google' ? <GoogleIcon /> : (
                            <span className="text-[14px] font-bold text-[#1d1c1d]">{msg.tool.provider.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <div className="text-[13px] font-[700] text-[#2e7d32]">✓ {msg.tool.tool} connected</div>
                          <div className="text-[11px] text-[#616061]">{msg.tool.permissions}</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div className="flex gap-2">
              <div className="w-9 shrink-0"><SlackAvatar name="nexu" size={36} isBot /></div>
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
        </div>

        {/* Input area */}
        <div className="px-5 pb-4 pt-1">
          <div className="border border-[#868686]/40 rounded-lg focus-within:border-[#868686] transition-colors">
            <div className="flex items-center px-3 py-2.5">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message to trigger tool authorization..."
                className="flex-1 text-[14px] text-[#1d1c1d] placeholder:text-[#868686] outline-none bg-transparent"
                disabled={typing}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSend()}
                disabled={!input.trim() || typing}
                className="h-7 w-7 rounded-md hover:bg-[#f0f0f0]"
              >
                <Send size={16} className="text-[#1264a3]" />
              </Button>
            </div>
          </div>
          <div className="mt-1.5 text-[11px] text-[#868686] text-center">
            Messages with keywords like "email", "calendar", "Notion", "GitHub", "tweet" will trigger OAuth
          </div>
        </div>
      </div>
    </div>
  );
}
