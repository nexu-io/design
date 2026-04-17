import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check, X, Loader2, Search, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRuntimesStore } from '@/stores/runtimes'
import type { Runtime } from '@/types'

const INSTALL_GUIDES: { type: string; name: string; desc: string; install: string; docsUrl: string; docsLabel: string }[] = [
  { type: 'claude-code', name: 'Claude Code', desc: "Anthropic's coding agent", install: 'npm install -g @anthropic-ai/claude-code', docsUrl: 'https://docs.claude.com/en/docs/claude-code/overview', docsLabel: 'docs.claude.com' },
  { type: 'cursor', name: 'Cursor', desc: 'AI-first code editor', install: 'Download the desktop app', docsUrl: 'https://docs.cursor.com/get-started/installation', docsLabel: 'docs.cursor.com' },
  { type: 'opencode', name: 'OpenCode', desc: 'Open-source coding agent', install: 'npm install -g opencode-ai', docsUrl: 'https://opencode.ai/docs', docsLabel: 'opencode.ai/docs' },
  { type: 'codex', name: 'Codex', desc: 'OpenAI coding agent', install: 'npm install -g @openai/codex', docsUrl: 'https://github.com/openai/codex#installation', docsLabel: 'github.com/openai/codex' },
  { type: 'gemini-cli', name: 'Gemini CLI', desc: "Google's AI coding agent", install: 'npm install -g @google/gemini-cli', docsUrl: 'https://github.com/google-gemini/gemini-cli#quickstart', docsLabel: 'github.com/google-gemini/gemini-cli' },
  { type: 'hermes', name: 'Hermes', desc: 'Nous Research agent', install: 'See repo for install steps', docsUrl: 'https://github.com/nousresearch/hermes-agent', docsLabel: 'github.com/nousresearch/hermes-agent' },
  { type: 'openclaw', name: 'OpenClaw', desc: 'Multi-agent orchestrator', install: 'npm install -g openclaw', docsUrl: 'https://github.com/openclaw/openclaw#install', docsLabel: 'github.com/openclaw' },
  { type: 'pi', name: 'Pi', desc: 'Conversational AI assistant', install: 'brew install pi-cli', docsUrl: 'https://pi.ai/docs/cli', docsLabel: 'pi.ai/docs' }
]

interface DetectedRuntime {
  type: string
  name: string
  desc: string
  detected: boolean
  version?: string
  path?: string
  error?: string
}

const RUNTIME_BRANDS: Record<string, { label: string; color: string }> = {
  'claude-code': { label: '>_', color: '#B45309' },
  cursor: { label: '▸', color: '#171717' },
  opencode: { label: '</>', color: '#059669' },
  codex: { label: '◎', color: '#0369A1' },
  'gemini-cli': { label: '✦', color: '#4285F4' },
  hermes: { label: 'H', color: '#EA580C' },
  openclaw: { label: '⊞', color: '#7C3AED' },
  pi: { label: 'π', color: '#DB2777' }
}

const SCAN_DURATION = 3500
const STAGGER_DELAY = 400

export function ConnectRuntimeStep(): React.ReactElement {
  const navigate = useNavigate()
  const setGlobalRuntimes = useRuntimesStore((s) => s.setRuntimes)
  const devSimulateNone = useRuntimesStore((s) => s.devSimulateNone)
  const [phase, setPhase] = useState<'scanning' | 'done'>('scanning')
  const [scanProgress, setScanProgress] = useState(0)
  const [runtimes, setRuntimes] = useState<DetectedRuntime[]>([
    { type: 'claude-code', name: 'Claude Code', desc: "Anthropic's coding agent", detected: false },
    { type: 'cursor', name: 'Cursor', desc: 'AI-first code editor', detected: false },
    { type: 'opencode', name: 'OpenCode', desc: 'Open-source coding agent', detected: false },
    { type: 'codex', name: 'Codex', desc: 'OpenAI coding agent', detected: false },
    { type: 'gemini-cli', name: 'Gemini CLI', desc: "Google's AI coding agent", detected: false },
    { type: 'hermes', name: 'Hermes', desc: 'Local LLM runtime', detected: false },
    { type: 'openclaw', name: 'OpenClaw', desc: 'Multi-agent orchestrator', detected: false },
    { type: 'pi', name: 'Pi', desc: 'Conversational AI assistant', detected: false }
  ])
  const [selected, setSelected] = useState<Set<string>>(new Set())

  useEffect(() => {
    const start = Date.now()
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - start
      setScanProgress(Math.min(elapsed / SCAN_DURATION, 1))
    }, 50)

    const mockResults: { index: number; version: string; path: string; error?: string }[] = devSimulateNone
      ? []
      : [
          { index: 0, version: '1.0.12', path: '/usr/local/bin/claude' },
          { index: 2, version: '0.5.3', path: '/usr/local/bin/opencode' },
          { index: 4, version: '0.1.0', path: '/usr/local/bin/gemini' },
          { index: 6, version: '0.2.1', path: '/usr/local/bin/openclaw', error: 'Requires update (min v0.3.0)' },
          { index: 7, version: '1.3.0', path: '/usr/local/bin/pi', error: 'Auth token expired' }
        ]

    let revealedCount = 0
    let finished = false
    const finishScan = (): void => {
      if (finished) return
      finished = true
      setPhase('done')
      clearInterval(progressInterval)
      setScanProgress(1)
    }

    const timers = mockResults.map(({ index, version, path, error }, i) =>
      setTimeout(() => {
        setRuntimes((prev) =>
          prev.map((rt, j) =>
            j === index ? { ...rt, detected: true, version, path, error } : rt
          )
        )
        revealedCount++
        if (revealedCount === mockResults.length) {
          setTimeout(finishScan, 400)
        }
      }, STAGGER_DELAY * (i + 2))
    )

    const doneTimer = setTimeout(finishScan, SCAN_DURATION)

    return () => {
      clearInterval(progressInterval)
      timers.forEach(clearTimeout)
      clearTimeout(doneTimer)
    }
  }, [])

  useEffect(() => {
    if (phase === 'done') {
      const workingTypes = runtimes.filter((r) => r.detected && !r.error).map((r) => r.type)
      setSelected(new Set(workingTypes))
    }
  }, [phase, runtimes])

  const toggleSelect = (type: string): void => {
    const rt = runtimes.find((r) => r.type === type)
    if (!rt?.detected || rt.error) return
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return next
    })
  }

  const errorCount = runtimes.filter((r) => r.detected && r.error).length
  const detectedCount = runtimes.filter((r) => r.detected).length
  const showTutorial = phase === 'done' && detectedCount === 0

  return (
    <div className={cn('flex flex-col items-center pt-6', showTutorial ? 'gap-4' : 'gap-6 pt-8')}>
      <div className="text-center max-w-lg">
        <h2 className="text-2xl font-semibold">
          {phase === 'scanning'
            ? 'Detecting Runtimes...'
            : showTutorial
              ? 'No Runtimes Found'
              : 'Runtimes Detected'}
        </h2>
        <p className="text-muted-foreground mt-2">
          {phase === 'scanning'
            ? 'Scanning your system for installed AI runtimes'
            : showTutorial
              ? 'Install a runtime below, then rescan.'
              : `Found ${detectedCount} runtime${detectedCount !== 1 ? 's' : ''} on your system${errorCount > 0 ? ` · ${errorCount} need attention` : ''}`}
        </p>
        {!showTutorial && (
          <p className="text-xs text-muted-foreground/70 mt-3 leading-relaxed">
            Runtimes power your Agents — each agent connects to a runtime to execute tasks.
            <br />
            Once set up, you can @mention agents in chat to assign work, just like messaging a teammate.
          </p>
        )}
      </div>

      {!showTutorial && (
        <div className="w-full max-w-2xl h-10">
          {phase === 'scanning' && (
            <>
              <div className="flex items-center gap-2 mb-3">
                <Search className="h-4 w-4 text-muted-foreground animate-pulse" />
                <span className="text-sm text-muted-foreground">
                  Checking PATH and common install locations...
                </span>
              </div>
              <div className="h-1 w-full rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-foreground/60 rounded-full transition-all duration-100"
                  style={{ width: `${scanProgress * 100}%` }}
                />
              </div>
            </>
          )}
        </div>
      )}

      {showTutorial && (
        <div className="grid grid-cols-4 gap-2.5 w-full max-w-2xl">
          {INSTALL_GUIDES.map((g) => {
            const brand = RUNTIME_BRANDS[g.type]
            return (
              <a
                key={g.type}
                href={g.docsUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col gap-1.5 p-3 rounded-xl border border-border hover:border-muted-foreground/50 hover:bg-accent/40 transition-all text-left"
              >
                <div className="flex items-center justify-between w-full">
                  <div
                    className="h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{ backgroundColor: brand?.color ?? '#666' }}
                  >
                    {brand?.label ?? '?'}
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="font-medium text-sm leading-tight">{g.name}</div>
                <div className="text-[11px] text-muted-foreground truncate group-hover:text-foreground/80 transition-colors">
                  {g.docsLabel}
                </div>
              </a>
            )
          })}
        </div>
      )}

      {!showTutorial && (
      <div className="grid grid-cols-4 gap-3 w-full max-w-2xl">
        {runtimes.map(({ type, name, desc, detected, version, path, error }) => {
          const isSelected = selected.has(type)
          const isScanning = phase === 'scanning' && !detected
          const isError = detected && !!error
          const isWorking = detected && !error
          const brand = RUNTIME_BRANDS[type]
          return (
            <button
              key={type}
              onClick={() => phase === 'done' && toggleSelect(type)}
              disabled={phase === 'scanning' || !isWorking}
              className={cn(
                'flex flex-col items-start gap-2 p-4 rounded-xl border transition-all text-left relative min-h-[120px]',
                isWorking && isSelected
                  ? 'border-foreground bg-accent'
                  : isWorking && !isSelected
                    ? 'border-border hover:border-muted-foreground/50'
                    : isError
                      ? 'border-amber-500/40 bg-amber-500/5 opacity-80'
                      : 'border-border/50 opacity-50'
              )}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className="h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                  style={{ backgroundColor: brand?.color ?? '#666' }}
                >
                  {brand?.label ?? '?'}
                </div>
                {isWorking && (
                  <Check className="h-3 w-3 text-nexu-online" />
                )}
                {isError && (
                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                )}
                {phase === 'done' && !detected && (
                  <X className="h-3 w-3 text-muted-foreground" />
                )}
                {isScanning && (
                  <Loader2 className="h-3 w-3 text-muted-foreground animate-spin" />
                )}
              </div>
              <div>
                <div className="font-medium text-sm">{name}</div>
                <div className="text-xs text-muted-foreground">{desc}</div>
              </div>
              {isWorking && (
                <div className="text-[11px] text-muted-foreground truncate w-full">
                  v{version} · {path}
                </div>
              )}
              {isError && (
                <div className="text-[11px] text-amber-500 w-full leading-tight">
                  v{version} · {error}
                </div>
              )}
              {phase === 'done' && !detected && (
                <div className="text-[11px] text-muted-foreground">Not found</div>
              )}
            </button>
          )
        })}
      </div>
      )}

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={() => navigate('/onboarding/agent')}
          className="h-10 px-5 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip for now
        </button>
        {showTutorial ? (
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 h-10 px-5 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Rescan
          </button>
        ) : (
        <button
          onClick={() => {
            const selectedRuntimes: Runtime[] = runtimes
              .filter((r) => r.detected && !r.error && selected.has(r.type))
              .map((r) => ({
                id: `rt-${r.type}`,
                name: r.name,
                type: r.type as Runtime['type'],
                status: 'connected' as const,
                version: r.version,
                config: r.path ? { path: r.path } : {},
                ownerId: 'u-1'
              }))
            setGlobalRuntimes(selectedRuntimes)
            navigate('/onboarding/agent')
          }}
          disabled={phase === 'scanning' || selected.size === 0}
          className="flex items-center gap-2 h-10 px-5 rounded-lg bg-foreground text-background text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-foreground/90 transition-colors"
        >
          Continue with {selected.size} runtime{selected.size !== 1 ? 's' : ''}
          <ArrowRight className="h-4 w-4" />
        </button>
        )}
      </div>
    </div>
  )
}
