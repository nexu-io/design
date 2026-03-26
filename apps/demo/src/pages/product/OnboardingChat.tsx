import { useState } from 'react'
import {
  X, Send, Check, ChevronRight,
  MessageSquare, Shield, Globe, Database,
  Sparkles, Wrench, Brain, ArrowRight,
  Link2, Upload, CheckCircle,
  RefreshCw, Users, UserPlus,
} from 'lucide-react'

interface OnboardingStep {
  id: string
  label: string
  icon: React.ElementType
  status: 'done' | 'active' | 'pending'
}

const STEPS: OnboardingStep[] = [
  { id: 'persona', label: '基础人设', icon: Shield, status: 'done' },
  { id: 'worldview', label: '世界观', icon: Globe, status: 'done' },
  { id: 'memory', label: '记忆导入', icon: Database, status: 'active' },
  { id: 'integrations', label: '渠道授权', icon: Link2, status: 'pending' },
  { id: 'skills', label: '能力配置', icon: Sparkles, status: 'pending' },
  { id: 'knowledge', label: '知识库', icon: Brain, status: 'pending' },
  { id: 'team', label: '团队协作', icon: Users, status: 'pending' },
]

interface ChatMsg {
  from: 'clone' | 'user' | 'system'
  content: string
  widget?: 'integrations' | 'skills' | 'upload' | 'progress' | 'team'
}

const INITIAL_MESSAGES: ChatMsg[] = [
  {
    from: 'system',
    content: '🎉 分身初始化 · 持续对话',
  },
  {
    from: 'clone',
    content: '你好！我是你的数字分身 😊\n\n让我先了解你，这样我才能更好地帮你。我们可以随时聊，不用一次搞定 — 你说到哪儿算哪儿，之后随时回来补充。',
  },
  {
    from: 'clone',
    content: '先来最基础的：\n\n1. 你希望我叫你什么？\n2. 你主要做什么工作？（角色/领域）\n3. 你希望我用什么风格跟你沟通？（正式/轻松/技术范/随意聊）',
  },
  {
    from: 'user',
    content: '叫我 Tom，我是产品经理 + 技术合伙人，做 AI SaaS 方向。沟通风格要简洁直接，技术术语可以直接用英文。',
  },
  {
    from: 'clone',
    content: '明白了 Tom 👋\n\n已记录：\n✅ 称呼：Tom\n✅ 角色：产品经理 + 技术合伙人\n✅ 领域：AI SaaS\n✅ 沟通风格：简洁直接 · 技术术语用英文\n\n接下来我想了解你的价值观和做事原则 — 这样我做决策时才不会跑偏。',
  },
  {
    from: 'clone',
    content: '你做产品和技术决策时，有没有几条核心原则？\n比如"用户体验优先"、"先跑起来再说"、"不过度工程化"之类的。',
  },
  {
    from: 'user',
    content: '有的：\n1. 用户体验 > 功能数量\n2. 实用主义，先跑起来再优化\n3. 判断标准是"这让分身更懂用户了吗？"\n4. 直说结论不说废话',
  },
  {
    from: 'clone',
    content: '非常清晰 ✅ 已存入世界观：\n\n🎯 产品哲学：用户体验 > 功能数量\n⚡ 技术观：实用主义，先跑起来再优化\n🧭 决策标准："这让分身更懂用户了吗？"\n💬 沟通准则：直说结论不说废话\n\n现在最关键的一步 — 让我获取你已有的记忆和内容。有几个方式可以快速导入：',
  },
  {
    from: 'clone',
    content: '你可以：\n\n📎 **直接上传文件**  — 简历、笔记、文档、项目资料等，我会自动提取关键信息\n\n🔗 **授权已有工具** — 连接你日常用的工具，我会从中学习你的习惯和偏好\n\n💬 **继续跟我聊** — 聊你最近在做的事、你的想法和计划，我边聊边记\n\n想先从哪个开始？',
    widget: 'integrations',
  },
]

interface IntegrationItem {
  name: string
  icon: string
  desc: string
  status: 'connected' | 'available' | 'coming'
  importable: string
}

const INTEGRATIONS: IntegrationItem[] = [
  { name: '飞书', icon: '🐦', desc: '消息、文档、日历、审批', status: 'connected', importable: '1,247 条消息 · 89 文档' },
  { name: 'Slack', icon: '💬', desc: '频道消息、DM、Threads', status: 'connected', importable: '523 条消息 · 34 文档' },
  { name: 'Notion', icon: '📝', desc: '页面、数据库、知识库', status: 'available', importable: '导入 Notion 工作空间' },
  { name: 'Gmail', icon: '📧', desc: '邮件内容、联系人', status: 'available', importable: '扫描重要邮件和联系人' },
  { name: 'GitHub', icon: '🐙', desc: '代码仓库、Issues、PR', status: 'available', importable: '导入项目上下文' },
  { name: 'Linear', icon: '🔵', desc: 'Issues、Sprint、Roadmap', status: 'available', importable: '同步项目进度' },
  { name: 'n8n', icon: '⚡', desc: '自动化工作流', status: 'available', importable: '导入现有工作流' },
  { name: 'Google Calendar', icon: '📅', desc: '日程、会议', status: 'available', importable: '同步日历和会议' },
  { name: 'Figma', icon: '🎨', desc: '设计稿、评论', status: 'coming', importable: '即将支持' },
  { name: 'WeChat', icon: '💚', desc: '微信对话', status: 'coming', importable: '即将支持' },
]

interface SkillOption {
  name: string
  desc: string
  icon: string
  recommended: boolean
  selected: boolean
}

const SKILL_OPTIONS: SkillOption[] = [
  { name: '记忆管理', desc: '自动记忆、知识沉淀', icon: '🧠', recommended: true, selected: true },
  { name: '任务管理', desc: '待办创建、追踪、提醒', icon: '✅', recommended: true, selected: true },
  { name: '每日汇报', desc: '晨间日报 + 日程提醒', icon: '📋', recommended: true, selected: true },
  { name: '联网搜索', desc: '实时搜索 + 信息整理', icon: '🔍', recommended: true, selected: true },
  { name: '代码助手', desc: '代码生成、PR、审查', icon: '💻', recommended: false, selected: false },
  { name: '文档写作', desc: 'PRD、方案、报告生成', icon: '📄', recommended: false, selected: true },
  { name: '竞品监控', desc: '定期扫描竞品动态', icon: '📊', recommended: false, selected: false },
  { name: '会议纪要', desc: '录音转写 + Action Items', icon: '🎙️', recommended: false, selected: false },
  { name: '邮件管理', desc: '邮件分类 + 摘要', icon: '📬', recommended: false, selected: false },
  { name: '社交媒体', desc: '内容发布 + 互动', icon: '📱', recommended: false, selected: false },
]

function StepIndicator({ steps }: { steps: OnboardingStep[] }) {
  return (
    <div className='flex items-center gap-1 overflow-x-auto'>
      {steps.map((step, i) => (
        <div key={step.id} className='flex items-center gap-1 shrink-0'>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] transition-colors ${
            step.status === 'done'
              ? 'bg-success-subtle text-success'
              : step.status === 'active'
                ? 'bg-accent text-accent-fg font-medium'
                : 'bg-surface-3 text-text-muted'
          }`}>
            {step.status === 'done' ? (
              <Check size={10} />
            ) : (
              <step.icon size={10} />
            )}
            {step.label}
          </div>
          {i < steps.length - 1 && (
            <ChevronRight size={10} className='text-text-muted shrink-0' />
          )}
        </div>
      ))}
    </div>
  )
}

function IntegrationsWidget() {
  const [expanded, setExpanded] = useState(false)
  const shown = expanded ? INTEGRATIONS : INTEGRATIONS.slice(0, 4)

  return (
    <div className='space-y-2 mt-2'>
      <div className='grid grid-cols-2 gap-2'>
        {shown.map(item => (
          <div
            key={item.name}
            className={`p-2.5 border rounded-xl transition-colors ${
              item.status === 'connected'
                ? 'bg-success-subtle/30 border-success/20'
                : item.status === 'coming'
                  ? 'bg-surface-2 border-border opacity-50'
                  : 'bg-surface-1 border-border hover:border-border-hover cursor-pointer'
            }`}
          >
            <div className='flex items-center gap-2 mb-1'>
              <span className='text-base'>{item.icon}</span>
              <span className='text-[12px] font-medium text-text-primary'>{item.name}</span>
              {item.status === 'connected' && (
                <CheckCircle size={11} className='text-success ml-auto' />
              )}
              {item.status === 'coming' && (
                <span className='text-[9px] text-text-muted ml-auto'>即将</span>
              )}
            </div>
            <div className='text-[10px] text-text-muted'>{item.desc}</div>
            {item.status === 'connected' && (
              <div className='text-[10px] text-success mt-1 flex items-center gap-1'>
                <RefreshCw size={9} />
                {item.importable}
              </div>
            )}
            {item.status === 'available' && (
              <button className='mt-1.5 w-full flex items-center justify-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-md text-[10px] font-medium hover:bg-accent/15 transition-colors'>
                <Link2 size={9} />
                授权连接
              </button>
            )}
          </div>
        ))}
      </div>
      {!expanded && INTEGRATIONS.length > 4 && (
        <button
          onClick={() => setExpanded(true)}
          className='w-full text-[11px] text-text-secondary hover:text-text-primary transition-colors py-1'
        >
          查看全部 {INTEGRATIONS.length} 个可连接工具 →
        </button>
      )}
    </div>
  )
}

function SkillsWidget() {
  const [skills, setSkills] = useState(SKILL_OPTIONS)

  const toggleSkill = (name: string) => {
    setSkills(prev =>
      prev.map(s => s.name === name ? { ...s, selected: !s.selected } : s)
    )
  }

  return (
    <div className='space-y-2 mt-2'>
      <div className='flex flex-wrap gap-1.5'>
        {skills.map(s => (
          <button
            key={s.name}
            onClick={() => toggleSkill(s.name)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] border transition-colors ${
              s.selected
                ? 'bg-accent/10 border-accent/30 text-accent font-medium'
                : 'bg-surface-2 border-border text-text-secondary hover:border-border-hover'
            }`}
          >
            <span>{s.icon}</span>
            {s.name}
            {s.recommended && !s.selected && (
              <span className='text-[9px] text-clone'>推荐</span>
            )}
            {s.selected && <Check size={10} />}
          </button>
        ))}
      </div>
      <div className='text-[10px] text-text-muted'>
        已选 {skills.filter(s => s.selected).length} 个能力 · 之后随时可在 Skills 页面调整
      </div>
    </div>
  )
}

function UploadWidget() {
  return (
    <div className='mt-2 p-4 border-2 border-dashed border-border rounded-xl bg-surface-1 text-center hover:border-accent/40 transition-colors cursor-pointer'>
      <Upload size={20} className='text-text-muted mx-auto mb-2' />
      <div className='text-[12px] text-text-primary font-medium'>拖拽文件到这里，或点击上传</div>
      <div className='text-[10px] text-text-muted mt-1'>支持 PDF、Word、Excel、Markdown、代码、图片、音视频等</div>
      <div className='flex items-center justify-center gap-2 mt-3'>
        {['简历', '笔记', '项目文档', '会议录音'].map(tag => (
          <span key={tag} className='text-[10px] px-2 py-0.5 bg-surface-3 rounded-md text-text-muted'>
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

interface TeamInviteMember {
  name: string
  channel: string
  icon: string
  status: 'invited' | 'joined' | 'pending'
}

const INVITE_LIST: TeamInviteMember[] = [
  { name: '张三', channel: '飞书', icon: '👨‍💻', status: 'joined' },
  { name: '李四', channel: '飞书', icon: '🧑‍💻', status: 'joined' },
  { name: '王五', channel: 'Slack', icon: '👩‍🎨', status: 'invited' },
  { name: '赵六', channel: '飞书', icon: '👩‍💼', status: 'pending' },
]

function TeamSetupWidget() {
  const joined = INVITE_LIST.filter(m => m.status === 'joined').length

  return (
    <div className='mt-2 space-y-3'>
      <div className='p-3 bg-surface-1 border border-border rounded-xl'>
        <div className='flex items-center justify-between mb-3'>
          <span className='text-[12px] font-medium text-text-primary'>团队成员</span>
          <span className='text-[11px] text-clone font-medium'>{joined}/{INVITE_LIST.length} 已加入</span>
        </div>
        <div className='space-y-2'>
          {INVITE_LIST.map(m => (
            <div key={m.name} className='flex items-center gap-2.5 p-2 bg-surface-2 rounded-lg'>
              <span className='text-sm'>{m.icon}</span>
              <span className='text-[12px] font-medium text-text-primary flex-1'>{m.name}</span>
              <span className='text-[10px] text-text-muted'>{m.channel}</span>
              {m.status === 'joined' ? (
                <CheckCircle size={12} className='text-success' />
              ) : m.status === 'invited' ? (
                <span className='text-[9px] px-1.5 py-0.5 bg-info-subtle text-info rounded-full'>已邀请</span>
              ) : (
                <span className='text-[9px] px-1.5 py-0.5 bg-surface-3 text-text-muted rounded-full'>待邀请</span>
              )}
            </div>
          ))}
        </div>
        <button className='mt-2.5 w-full flex items-center justify-center gap-1.5 py-2 bg-accent/10 text-accent rounded-lg text-[11px] font-medium hover:bg-accent/15 transition-colors'>
          <UserPlus size={12} />
          通过飞书/Slack 邀请更多成员
        </button>
      </div>
      <div className='p-3 bg-clone/5 border border-clone/10 rounded-xl'>
        <div className='text-[12px] font-medium text-text-primary mb-1.5'>🤖 团队分身网络</div>
        <div className='text-[11px] text-text-secondary leading-relaxed'>
          当团队成员加入后，你的分身可以：
        </div>
        <div className='mt-2 space-y-1'>
          {[
            '📋 自动生成每日站会汇总',
            '🔍 代你查询其他成员任务进度',
            '⚠️ 检测依赖风险并主动发起对齐',
            '📊 生成团队 Sprint 报告',
          ].map(item => (
            <div key={item} className='text-[11px] text-text-secondary flex items-start gap-1'>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProgressWidget() {
  const items = [
    { label: '基础人设', done: true, detail: '称呼、角色、沟通风格' },
    { label: '世界观', done: true, detail: '4 条核心原则' },
    { label: '记忆导入', done: false, detail: '0 条记忆 · 0 文件' },
    { label: '渠道授权', done: false, detail: '2 已连接 · 8 可连接' },
    { label: '能力配置', done: false, detail: '4 个推荐能力' },
    { label: '知识库', done: false, detail: '等待导入' },
    { label: '团队协作', done: false, detail: '2/4 成员已加入' },
  ]

  const doneCount = items.filter(i => i.done).length
  const pct = Math.round((doneCount / items.length) * 100)

  return (
    <div className='mt-2 p-3 bg-surface-1 border border-border rounded-xl'>
      <div className='flex items-center justify-between mb-2'>
        <span className='text-[12px] font-medium text-text-primary'>初始化进度</span>
        <span className='text-[11px] text-clone font-medium tabular-nums'>{pct}%</span>
      </div>
      <div className='h-1.5 bg-surface-3 rounded-full overflow-hidden mb-3'>
        <div className='h-full bg-clone rounded-full transition-all' style={{ width: `${pct}%` }} />
      </div>
      <div className='space-y-1.5'>
        {items.map(item => (
          <div key={item.label} className='flex items-center gap-2 text-[11px]'>
            {item.done ? (
              <CheckCircle size={12} className='text-success shrink-0' />
            ) : (
              <div className='w-3 h-3 rounded-full border border-border shrink-0' />
            )}
            <span className={item.done ? 'text-text-muted line-through' : 'text-text-primary'}>{item.label}</span>
            <span className='text-text-muted ml-auto text-[10px]'>{item.detail}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function OnboardingChat({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState('')
  const [messages] = useState<ChatMsg[]>(INITIAL_MESSAGES)

  const handleSend = () => {
    if (!input.trim()) return
    setInput('')
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div className='absolute inset-0 bg-black/30 backdrop-blur-sm' onClick={onClose} />

      <div className='relative w-[680px] h-[85vh] max-h-[720px] bg-surface-0 border border-border/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden'>
        {/* Header */}
        <div className='px-5 py-3 border-b border-border flex items-center gap-3 shrink-0'>
          <div className='w-8 h-8 rounded-full bg-clone/15 flex items-center justify-center text-lg'>
            😊
          </div>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2'>
              <span className='text-[13px] font-semibold text-text-primary'>分身初始化</span>
              <span className='text-[10px] px-1.5 py-0.5 bg-clone/10 text-clone rounded-full font-medium'>常驻对话</span>
            </div>
            <div className='text-[11px] text-text-muted'>随时回来继续聊 · 越聊越懂你</div>
          </div>
          <button
            onClick={onClose}
            className='p-1.5 rounded-lg hover:bg-surface-3 text-text-muted transition-colors'
          >
            <X size={16} />
          </button>
        </div>

        {/* Step indicator */}
        <div className='px-5 py-2 border-b border-border/50 bg-surface-1/50 shrink-0'>
          <StepIndicator steps={STEPS} />
        </div>

        {/* Chat messages */}
        <div className='flex-1 overflow-y-auto p-4 space-y-3 min-h-0'>
          {messages.map((msg, i) => (
            <div key={i}>
              {msg.from === 'system' ? (
                <div className='flex items-center gap-2 py-2'>
                  <div className='h-px flex-1 bg-border' />
                  <span className='text-[10px] text-text-muted shrink-0'>{msg.content}</span>
                  <div className='h-px flex-1 bg-border' />
                </div>
              ) : msg.from === 'user' ? (
                <div className='flex justify-end'>
                  <div className='max-w-[80%] bg-accent text-accent-fg rounded-xl rounded-br-sm px-3.5 py-2.5 text-[12px] leading-relaxed whitespace-pre-line'>
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div className='flex gap-2.5'>
                  <div className='w-6 h-6 rounded-full bg-clone/15 flex items-center justify-center text-[11px] shrink-0 mt-0.5'>
                    😊
                  </div>
                  <div className='max-w-[85%]'>
                    <div className='bg-surface-1 border border-border rounded-xl rounded-bl-sm px-3.5 py-2.5 text-[12px] text-text-primary leading-relaxed whitespace-pre-line'>
                      {msg.content}
                    </div>
                    {msg.widget === 'integrations' && <IntegrationsWidget />}
                    {msg.widget === 'skills' && <SkillsWidget />}
                    {msg.widget === 'upload' && <UploadWidget />}
                    {msg.widget === 'progress' && <ProgressWidget />}
                    {msg.widget === 'team' && <TeamSetupWidget />}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Inline quick actions */}
          <div className='flex items-center gap-2 pt-2'>
            <span className='text-[10px] text-text-muted'>快捷操作：</span>
            {[
              { label: '授权工具', icon: Link2 },
              { label: '上传文件', icon: Upload },
              { label: '选择能力', icon: Sparkles },
              { label: '邀请团队', icon: Users },
              { label: '查看进度', icon: Wrench },
            ].map(action => (
              <button
                key={action.label}
                className='flex items-center gap-1 px-2 py-1 rounded-md bg-surface-2 border border-border text-[10px] text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors'
              >
                <action.icon size={10} />
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input area */}
        <div className='border-t border-border p-3 shrink-0'>
          <div className='flex items-end gap-2 bg-surface-1 border border-border rounded-xl px-3.5 py-2.5'>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              placeholder='跟分身聊聊你是谁、你做什么、你的工作习惯...'
              rows={2}
              className='flex-1 bg-transparent text-[13px] text-text-primary placeholder:text-text-muted resize-none focus:outline-none leading-relaxed'
            />
            <div className='flex items-center gap-1.5 shrink-0'>
              <button className='p-1.5 rounded-lg hover:bg-surface-3 text-text-muted transition-colors' title='上传文件'>
                <Upload size={14} />
              </button>
              <button
                onClick={handleSend}
                className='p-2 bg-accent text-accent-fg rounded-lg hover:bg-accent-hover transition-colors'
              >
                <Send size={14} />
              </button>
            </div>
          </div>
          <div className='flex items-center justify-between mt-2 px-1'>
            <div className='flex items-center gap-2 text-[10px] text-text-muted'>
              <MessageSquare size={10} />
              这是一个持续对话 — 随时回来继续补充信息
            </div>
            <button className='text-[10px] text-text-muted hover:text-accent transition-colors flex items-center gap-1'>
              跳过初始化，直接使用
              <ArrowRight size={9} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
