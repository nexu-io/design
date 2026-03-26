/**
 * Invite code pool — pure localStorage-based simulation.
 * Shared across InvitePage (validation) and Workspace (display).
 */

export interface InviteCode {
  code: string
  used: boolean
  usedBy: string | null
}

const INVITE_POOL_KEY = 'nexu_invite_pool'
const ACTIVE_USER_KEY = 'nexu_active_invite'
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no ambiguous I/O/0/1
const CODES_PER_USER = 5

/* ── Pool read / write ── */

function loadPool(): Record<string, InviteCode[]> {
  try {
    const raw = localStorage.getItem(INVITE_POOL_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* corrupt */ }
  return {}
}

function savePool(pool: Record<string, InviteCode[]>) {
  localStorage.setItem(INVITE_POOL_KEY, JSON.stringify(pool))
}

function allExistingCodes(pool: Record<string, InviteCode[]>): Set<string> {
  const set = new Set<string>()
  for (const codes of Object.values(pool)) {
    for (const c of codes) set.add(c.code)
  }
  return set
}

/* ── Code generation ── */

function generateSingleCode(existing: Set<string>): string {
  const buf = new Uint8Array(4)
  for (let i = 0; i < 100; i++) {
    crypto.getRandomValues(buf)
    const code = 'NEXU-' + Array.from(buf).map(b => CODE_CHARS[b % CODE_CHARS.length]).join('')
    if (!existing.has(code)) return code
  }
  return 'NEXU-' + Date.now().toString(36).slice(-4).toUpperCase()
}

/**
 * Generate 5 personal invite codes for a user (idempotent).
 * Returns the user's codes from the pool.
 */
export function generateCodesForUser(userCode: string): InviteCode[] {
  const pool = loadPool()
  if (pool[userCode]) return pool[userCode]

  const existing = allExistingCodes(pool)
  const codes: InviteCode[] = []
  for (let i = 0; i < CODES_PER_USER; i++) {
    const code = generateSingleCode(existing)
    existing.add(code)
    codes.push({ code, used: false, usedBy: null })
  }
  pool[userCode] = codes
  savePool(pool)
  return codes
}

/**
 * Check whether a code exists in the generated pool and is unused.
 */
export function isGeneratedCodeValid(code: string): boolean {
  const pool = loadPool()
  for (const codes of Object.values(pool)) {
    if (codes.some(c => c.code === code && !c.used)) return true
  }
  return false
}

/**
 * Mark a generated code as used.
 */
export function markCodeUsed(code: string, timestamp?: string) {
  const pool = loadPool()
  for (const codes of Object.values(pool)) {
    const match = codes.find(c => c.code === code && !c.used)
    if (match) {
      match.used = true
      match.usedBy = timestamp ?? new Date().toISOString()
      savePool(pool)
      return
    }
  }
}

/**
 * Get the current user's invite codes (re-reads pool for fresh state).
 */
export function getUserInviteCodes(userCode: string): InviteCode[] {
  const pool = loadPool()
  return pool[userCode] || []
}

/* ── Active user tracking (which invite code the current user logged in with) ── */

export function setActiveUserCode(code: string) {
  localStorage.setItem(ACTIVE_USER_KEY, code)
}

export function getActiveUserCode(): string | null {
  return localStorage.getItem(ACTIVE_USER_KEY)
}

export function clearActiveUserCode() {
  localStorage.removeItem(ACTIVE_USER_KEY)
}
