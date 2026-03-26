import { useState } from 'react'
import {
  Search, Plus, Send, Paperclip, Mic,
  FileText, Sparkles,
  Eye, MoreHorizontal, ChevronRight,
  FolderOpen, X,
  Bookmark, Clock, Wrench, BarChart3, Users, Terminal,
} from 'lucide-react'
import ChatCardGroup from '../product/ChatCards'
import type { ChatCard } from '../product/sessionsData'

const SESSIONS = [
  { id: 1, emoji: '📊', title: '竞品分析 · AI 赛道', time: '10 min', channel: '🌐', ops: 8 },
  { id: 2, emoji: '📝', title: '注册流程优化 PRD', time: '2h', channel: '🐦', ops: 12 },
  { id: 3, emoji: '🧠', title: '记忆整理 · 周复盘', time: '昨天', channel: '🌐', ops: 5, badge: '主动' },
  { id: 4, emoji: '💻', title: 'OAuth 技术方案', time: '昨天', channel: '🐦', ops: 15 },
  { id: 5, emoji: '🔍', title: 'Deep Research: Agent', time: '2天前', channel: '🌐', ops: 3 },
]

const QUICK_ACTIONS = [
  { label: '帮我写一份 PRD', icon: FileText, color: 'text-emerald-400' },
  { label: '随手记一下...', icon: Bookmark, color: 'text-violet-400' },
  { label: '帮我问李四进度', icon: Users, color: 'text-cyan-400' },
  { label: '创建一个 automation', icon: Clock, color: 'text-blue-400' },
  { label: '安装一个新 skill', icon: Wrench, color: 'text-amber-400' },
  { label: '分析竞品', icon: BarChart3, color: 'text-clone' },
]

const CAPABILITY_DOMAINS = [
  { domain: '📄 文件系统', accent: 'border-l-emerald-500/40' },
  { domain: '🧠 记忆', accent: 'border-l-violet-500/40' },
  { domain: '🔧 技能', accent: 'border-l-amber-500/40' },
  { domain: '⏰ 自动化', accent: 'border-l-blue-500/40' },
  { domain: '👥 团队协作', accent: 'border-l-cyan-500/40' },
  { domain: '💰 升级', accent: 'border-l-orange-500/40' },
]

const STEP_SESSION_CARDS: { research: ChatCard[]; output: ChatCard[] } = {
  research: [
    {
      type: 'skill',
      title: '深度调研 · Web Research',
      status: 'success',
      body: '检索 23 篇文章 + 5 个竞品，生成 8,200 字报告',
      meta: '耗时 45s · 引用 23 篇',
    },
    {
      type: 'file',
      title: 'AI Agent 赛道竞品分析',
      status: 'success',
      body: '3 个关键发现：记忆壁垒、IM 入口、团队协作',
      path: 'artifacts/research/ai-agent-market-2026.md',
      diff: { added: 389, removed: 0 },
    },
  ],
  output: [
    {
      type: 'file',
      title: 'AI Agent 产品方案',
      status: 'success',
      body: '基于竞品分析 + 偏好生成完整 PRD',
      path: 'artifacts/prds/ai-agent-product-plan.md',
      diff: { added: 156, removed: 0 },
      actions: [{ label: '打开文件', primary: true }],
    },
    {
      type: 'memory',
      title: 'Agent 定位决策',
      status: 'success',
      body: '已记录：Agent Computer 定位 > 对话框',
      path: 'memory/decisions/agent-positioning.md',
    },
  ],
}

const MESSAGES: {
  from: 'user' | 'clone'
  content: string | null
  tool?: { name: string; icon: typeof Search }
  cards?: ChatCard[]
}[] = [
  { from: 'user', content: '帮我做一份 AI Agent 赛道的竞品分析' },
  { from: 'clone', content: '收到，我来帮你搞 📂', tool: { name: '深度调研', icon: Search } },
  { from: 'clone', content: null, cards: STEP_SESSION_CARDS.research },
  {
    from: 'clone',
    content: '报告完成 ✅ 8,200 字，3 个关键发现：\n\n1. 记忆能力是核心壁垒\n2. IM 入口比独立 App 更好\n3. 团队协作是付费转化关键',
  },
  { from: 'user', content: '不错，基于这个写一份产品方案' },
  { from: 'clone', content: null, cards: STEP_SESSION_CARDS.output },
  {
    from: 'clone',
    content: '已基于竞品分析 + 你之前的偏好生成产品方案 📄\n方案已保存到文档区，决策记录已更新。',
  },
]

const FILE_OPS = [
  { action: 'CREATE', path: 'artifacts/prds/ai-agent-product-plan.md', time: '刚刚', size: '3.2 KB', added: 156 },
  { action: 'WRITE', path: 'memory/decisions/agent-positioning.md', time: '1 分钟前', size: '1.1 KB', added: 42, removed: 5 },
  { action: 'CREATE', path: 'artifacts/research/ai-agent-market-2026.md', time: '3 分钟前', size: '12.8 KB', added: 389 },
  { action: 'READ', path: 'growth space/competitive/competitive-analysis.md', time: '5 分钟前' },
  { action: 'READ', path: 'memory/facts/market.md', time: '5 分钟前' },
]

const ACTION_STYLES: Record<string, { color: string }> = {
  CREATE: { color: 'text-success bg-success-subtle' },
  WRITE: { color: 'text-clone bg-clone/10' },
  READ: { color: 'text-info bg-info-subtle' },
  EXEC: { color: 'text-warning bg-warning-subtle' },
}

function NewSessionViewCondensed({ onStartChat }: { onStartChat: (msg: string) => void }) {
  return (
    <div className='flex-1 flex flex-col items-center px-6 overflow-y-auto'>
      <div className='w-full max-w-lg flex flex-col items-center py-6'>
        {/* Avatar + Greeting */}
        <div className='w-12 h-12 rounded-full bg-surface-3 flex items-center justify-center text-2xl mb-3'>
          😊
        </div>
        <h2 className='text-base font-semibold text-text-primary mb-0.5'>
          Good evening, Tom
        </h2>
        <p className='text-xs text-text-secondary mb-4'>
          你的主线入口 — <span className='text-accent font-medium'>对话即操控一切</span>
        </p>

        {/* Quick action pills */}
        <div className='flex flex-wrap gap-1.5 justify-center mb-4'>
          {QUICK_ACTIONS.map((t) => (
            <button
              key={t.label}
              onClick={() => onStartChat(t.label)}
              className='flex items-center gap-1 px-2.5 py-1 bg-surface-2 border border-border rounded-full text-[11px] text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors'
            >
              <t.icon size={10} className={t.color} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Condensed 3x2 capability grid */}
        <div className='w-full mb-4'>
          <div className='flex items-center gap-2 mb-2'>
            <span className='text-[9px] font-bold text-text-muted uppercase tracking-widest'>
              从这里可以操控的一切
            </span>
            <div className='flex-1 h-px bg-border' />
          </div>
          <div className='grid grid-cols-3 gap-1.5'>
            {CAPABILITY_DOMAINS.map((d) => (
              <button
                key={d.domain}
                onClick={() => onStartChat(d.domain)}
                className={`p-2 bg-surface-2 border border-border ${d.accent} border-l-2 rounded-lg hover:border-border-hover transition-colors text-left text-[11px] font-medium text-text-primary`}
              >
                {d.domain}
              </button>
            ))}
          </div>
        </div>

        {/* Scoped session hint */}
        <div className='w-full p-2.5 rounded-lg bg-surface-2/60 border border-border/50 mb-3'>
          <div className='flex items-center gap-2 mb-1.5'>
            <span className='text-[9px] font-bold text-text-muted uppercase tracking-widest'>
              专属会话
            </span>
            <div className='flex-1 h-px bg-border' />
          </div>
          <p className='text-[9px] text-text-muted mb-1.5'>
            在其他页面你会看到 scoped sessions — 它们和这里一样是 Chat，但限定了特定的 Skills 和上下文：
          </p>
          <div className='flex flex-wrap gap-1'>
            {[
              { label: 'Team Insights', desc: '团队数据分析', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
              { label: 'Sprint 分析', desc: '冲刺进度', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
              { label: 'OKR 对齐', desc: '目标跟踪', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
            ].map((s) => (
              <span key={s.label} className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border text-[9px] ${s.color}`}>
                {s.label}
                <span className='text-text-muted'>· {s.desc}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Footer hint */}
        <div className='flex items-center gap-1.5 text-[9px] text-text-muted'>
          <Terminal size={9} />
          <span>
            所有操作产出 6 种标准卡片：文件 · 记忆 · 技能 · 自动化 · 协作 · 升级 — 卡片可交互
          </span>
        </div>
      </div>
    </div>
  )
}

export default function StepSession() {
  const [activeSession, setActiveSession] = useState<number | null>(null)
  const [previewOpen, setPreviewOpen] = useState(true)
  const [input, setInput] = useState('')

  const handleStartChat = (_msg: string) => {
    setActiveSession(1)
  }

  return (
    <div className='h-full flex'>
      {/* Session list */}
      <div className='w-52 shrink-0 border-r border-border flex flex-col bg-surface-0'>
        <div className='p-2 border-b border-border'>
          <div className='flex items-center gap-1'>
            <div className='flex-1 relative'>
              <Search size={12} className='absolute left-2 top-1/2 -translate-y-1/2 text-text-muted' />
              <input placeholder='搜索对话...' className='w-full pl-7 pr-2 py-1.5 bg-surface-2 border border-border-subtle rounded-md text-[10px] text-text-primary placeholder:text-text-muted focus:outline-none' />
            </div>
            <button onClick={() => setActiveSession(null)} className='p-1 rounded-md hover:bg-surface-3 text-text-secondary' title='新建对话'>
              <Plus size={13} />
            </button>
          </div>
        </div>
        <div className='flex-1 overflow-y-auto p-1 space-y-0.5'>
          {SESSIONS.map((s) => {
            const isActive = activeSession === s.id
            return (
              <button
                key={s.id}
                onClick={() => setActiveSession(s.id)}
                className={`w-full text-left px-2 py-1.5 rounded-lg transition-colors ${isActive ? 'bg-accent text-accent-fg' : 'hover:bg-surface-3'}`}
              >
                <div className='flex items-start gap-1.5'>
                  <span className='text-[10px] mt-0.5'>{s.emoji}</span>
                  <div className='flex-1 min-w-0'>
                    <div className={`text-[11px] font-medium truncate ${isActive ? '' : 'text-text-primary'}`}>{s.title}</div>
                    <div className='flex items-center gap-1 mt-0.5'>
                      <span className={`text-[9px] ${isActive ? 'text-accent-fg/70' : 'text-text-muted'}`}>{s.time}</span>
                      <span className='text-[9px]'>{s.channel}</span>
                      {s.ops > 0 && <span className={`text-[8px] font-mono ${isActive ? 'text-accent-fg/70' : 'text-text-muted'}`}>{s.ops} ops</span>}
                    </div>
                  </div>
                  {s.badge && !isActive && <span className='text-[7px] px-1 py-0.5 bg-clone/10 text-clone rounded shrink-0 mt-0.5'>{s.badge}</span>}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main content: NewSessionView when no session, Chat when session active */}
      {activeSession === null ? (
        <NewSessionViewCondensed onStartChat={handleStartChat} />
      ) : (
        <div className='flex-1 flex min-w-0'>
      <div className='flex-1 flex flex-col min-w-0'>
        <div className='h-10 border-b border-border flex items-center justify-between px-3'>
          <div className='flex items-center gap-1.5'>
            <span className='text-xs'>📊</span>
            <span className='text-[12px] font-medium text-text-primary'>竞品分析 · AI 赛道</span>
            <span className='text-[9px] bg-surface-3 px-1 py-0.5 rounded flex items-center gap-0.5'>🌐 web</span>
            <span className='text-[9px] text-text-muted bg-surface-3 px-1 py-0.5 rounded font-mono'>8 file ops</span>
          </div>
          <div className='flex items-center gap-1'>
            <button onClick={() => setPreviewOpen(!previewOpen)} className={`p-1 rounded transition-colors ${previewOpen ? 'text-text-primary bg-surface-3' : 'text-text-muted'}`}>
              <Eye size={13} />
            </button>
            <button className='p-1 rounded hover:bg-surface-3 text-text-muted'><MoreHorizontal size={13} /></button>
          </div>
        </div>

        <div className='flex-1 overflow-y-auto p-3 space-y-2.5'>
          {MESSAGES.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'gap-2'}`}>
              {msg.from === 'clone' && (
                <div className='w-5 h-5 rounded-full bg-clone/15 flex items-center justify-center text-[10px] shrink-0 mt-0.5'>😊</div>
              )}
              <div className='max-w-[80%] space-y-1'>
                {msg.cards && msg.cards.length > 0 && (
                  <ChatCardGroup cards={msg.cards} />
                )}
                {msg.tool && (
                  <div className='flex items-center gap-1.5 px-2.5 py-1.5 bg-surface-2 border border-border rounded-lg text-[11px]'>
                    <msg.tool.icon size={12} className='text-clone' />
                    <span className='text-text-secondary'>{msg.tool.name}</span>
                    <span className='text-[9px] text-success ml-auto'>✓</span>
                  </div>
                )}
                {msg.content && (
                  <div className={`rounded-xl px-3 py-2 text-[11px] leading-relaxed whitespace-pre-line ${
                    msg.from === 'user'
                      ? 'bg-accent text-accent-fg rounded-br-sm'
                      : 'bg-surface-2 border border-border text-text-primary rounded-bl-sm'
                  }`}>
                    {msg.content}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className='border-t border-border p-2'>
          <div className='flex items-center gap-1.5 bg-surface-2 border border-border rounded-xl px-3 py-1.5'>
            <button className='p-1 text-text-muted hover:text-text-secondary'><Paperclip size={13} /></button>
            <button className='p-1 text-text-muted hover:text-text-secondary'><Sparkles size={13} /></button>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder='跟分身说点什么...'
              className='flex-1 bg-transparent text-[12px] text-text-primary placeholder:text-text-muted focus:outline-none'
            />
            <button className='p-1 text-text-muted hover:text-text-secondary'><Mic size={13} /></button>
            <button className='p-1 bg-accent text-accent-fg rounded-lg'><Send size={12} /></button>
          </div>
        </div>
      </div>

      {/* Preview panel */}
      {previewOpen && (
        <div className='w-72 shrink-0 border-l border-border flex flex-col bg-surface-0'>
          <div className='h-10 border-b border-border flex items-center justify-between px-3'>
            <div className='flex items-center gap-1.5'>
              <FileText size={12} className='text-text-muted' />
              <span className='text-[11px] font-medium text-text-primary truncate'>ai-agent-product-plan.md</span>
              <span className='text-[8px] text-success bg-success-subtle px-1 py-0.5 rounded'>新建</span>
            </div>
            <button onClick={() => setPreviewOpen(false)} className='p-1 rounded hover:bg-surface-3 text-text-muted'>
              <X size={12} />
            </button>
          </div>

          <div className='px-3 py-1 border-b border-border flex items-center gap-0.5 text-[9px] text-text-muted'>
            <FolderOpen size={9} />
            <span>~/clone</span>
            <ChevronRight size={7} />
            <span>artifacts</span>
            <ChevronRight size={7} />
            <span>prds</span>
          </div>

          <div className='flex-1 overflow-y-auto p-3'>
            <div className='text-[11px] leading-relaxed text-text-secondary font-mono whitespace-pre-line'>
{`# AI Agent 赛道产品方案

## 市场定位
Agent Computer — 不是另一个对话框

## 核心差异化
1. 文件系统 = 持久记忆
2. Skills = 可组合能力
3. IM 入口 = 自然分发

## 目标用户
- 知识工作者 (PM/开发/运营)
- 5-50 人团队
- 已用过 ChatGPT 但不满足

## 关键指标
- D7 留存 > 40%
- 月均 Sessions > 30
- 团队裂变系数 > 1.5

## 路线图
Phase 1: 个人版 MVP
Phase 2: 团队版 + IM 深度整合
Phase 3: Skills 生态`}
            </div>
            <div className='mt-3 pt-2 border-t border-border flex items-center gap-2 text-[9px]'>
              <span className='text-success font-mono'>+156 lines</span>
              <span className='text-text-muted ml-auto'>3.2 KB</span>
            </div>
          </div>

          {/* File ops list */}
          <div className='border-t border-border max-h-[35%] flex flex-col'>
            <div className='px-3 pt-2 pb-1 text-[9px] text-text-muted font-medium uppercase tracking-wider shrink-0'>
              本次文件变更
            </div>
            <div className='flex-1 overflow-y-auto px-2 pb-2 space-y-0.5'>
              {FILE_OPS.map((op, i) => {
                const style = ACTION_STYLES[op.action]
                const name = op.path.split('/').pop()
                return (
                  <div key={i} className='p-1.5 rounded-md hover:bg-surface-3 transition-colors cursor-pointer'>
                    <div className='flex items-center gap-1.5'>
                      <span className={`px-0.5 py-0.5 rounded text-[7px] font-bold ${style.color}`}>{op.action}</span>
                      <span className='text-[10px] font-medium text-text-secondary truncate'>{name}</span>
                    </div>
                    <div className='flex items-center gap-1.5 mt-0.5 pl-5'>
                      <span className='text-[8px] text-text-muted font-mono truncate'>{op.path}</span>
                      <span className='text-[8px] text-text-muted ml-auto shrink-0'>{op.time}</span>
                    </div>
                    {op.added && (
                      <div className='flex items-center gap-1.5 mt-0.5 pl-5 text-[8px]'>
                        <span className='text-success font-mono'>+{op.added}</span>
                        {op.removed && <span className='text-danger font-mono'>-{op.removed}</span>}
                        {op.size && <span className='text-text-muted ml-auto'>{op.size}</span>}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
        </div>
      )}
    </div>
  )
}
