import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Check, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useT } from '@/i18n'
import { useAgentsStore } from '@/stores/agents'
import { useChatStore } from '@/stores/chat'
import { mockSkills } from '@/mock/data'
import { RuntimePicker } from './RuntimePicker'
import type { Agent, AgentTemplate, Channel } from '@/types'

interface CreateAgentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateAgentDialog({ open, onOpenChange }: CreateAgentDialogProps): React.ReactElement {
  const t = useT()
  const navigate = useNavigate()
  const templates = useAgentsStore((s) => s.templates)
  const addAgent = useAgentsStore((s) => s.addAgent)
  const selectAgent = useAgentsStore((s) => s.selectAgent)
  const addChannel = useChatStore((s) => s.addChannel)
  const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [runtimeId, setRuntimeId] = useState<string | null>(null)

  const reset = (): void => {
    setSelectedTemplate(null)
    setName('')
    setDescription('')
    setRuntimeId(null)
  }

  const handleSelectTemplate = (tpl: AgentTemplate): void => {
    setSelectedTemplate(tpl)
    setName(tpl.name)
    setDescription(tpl.description)
  }

  const handleCreate = (): void => {
    const trimmedName = name.trim()
    if (!trimmedName) return

    const agentId = `a-${Date.now()}`
    const agent: Agent = {
      id: agentId,
      name: trimmedName,
      avatar: selectedTemplate?.avatar ?? `https://api.dicebear.com/9.x/bottts/svg?seed=${trimmedName.toLowerCase()}&backgroundColor=6366f1`,
      description: description.trim(),
      systemPrompt: selectedTemplate?.defaultPrompt ?? `You are ${trimmedName}, a helpful AI assistant.`,
      status: 'online',
      skills: (selectedTemplate?.defaultSkills ?? [])
        .map((sid) => mockSkills.find((s) => s.id === sid))
        .filter((s): s is NonNullable<typeof s> => s != null),
      runtimeId,
      templateId: selectedTemplate?.id ?? null,
      createdBy: 'u-1',
      createdAt: Date.now()
    }

    addAgent(agent)

    const dmChannel: Channel = {
      id: `dm-${agentId}`,
      name: trimmedName,
      type: 'dm',
      members: [{ kind: 'user', id: 'u-1' }, { kind: 'agent', id: agentId }],
      lastMessageAt: Date.now(),
      unreadCount: 0,
      createdAt: Date.now()
    }
    addChannel(dmChannel)

    selectAgent(agentId)
    navigate(`/agents/${agentId}`)
    onOpenChange(false)
    reset()
  }

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey && name.trim()) {
      e.preventDefault()
      handleCreate()
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset() }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 animate-in fade-in-0 duration-150" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] max-h-[85vh] overflow-y-auto rounded-xl border border-border bg-background text-foreground p-0 shadow-xl animate-in fade-in-0 zoom-in-95 duration-150 focus:outline-none">
          <div className="flex items-center justify-between px-5 pt-5 pb-1">
            <Dialog.Title className="text-base font-semibold text-foreground">{t('createAgent.title')}</Dialog.Title>
            <Dialog.Close className="flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <div className="px-5 py-4 space-y-4">
            {templates.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium">{t('createAgent.template')}</label>
                <div className="grid grid-cols-2 gap-2">
                  {templates.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => handleSelectTemplate(tpl)}
                      className={cn(
                        'flex items-center gap-2.5 p-2.5 rounded-lg border text-left transition-colors',
                        selectedTemplate?.id === tpl.id
                          ? 'border-ring bg-accent/50'
                          : 'border-border hover:bg-accent/30'
                      )}
                    >
                      <img src={tpl.avatar} alt="" className="h-8 w-8 rounded-lg shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">{tpl.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{tpl.category}</div>
                      </div>
                      {selectedTemplate?.id === tpl.id && (
                        <Check className="h-4 w-4 text-foreground shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium">{t('agent.name')}</label>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('createAgent.namePlaceholder')}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">{t('agent.description')}</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('createAgent.descPlaceholder')}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" />
                {t('agent.runtime')}
              </label>
              <RuntimePicker value={runtimeId} onChange={setRuntimeId} />
            </div>
          </div>

          <div className="flex justify-end gap-2 px-5 pb-5">
            <Dialog.Close className="h-8 px-3 rounded-md text-sm border border-border hover:bg-accent transition-colors">
              {t('common.cancel')}
            </Dialog.Close>
            <button
              onClick={handleCreate}
              disabled={!name.trim()}
              className="h-8 px-4 rounded-md text-sm font-medium bg-foreground text-background hover:bg-foreground/90 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              {t('common.create')}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
