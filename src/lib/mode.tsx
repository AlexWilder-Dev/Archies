import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { isEvening, londonNow, type LondonNow } from './london'

export type Mode = 'day' | 'evening'

interface ModeCtx {
  mode: Mode
  auto: Mode
  manual: boolean
  now: LondonNow
  toggle: () => void
  reset: () => void
}

const Ctx = createContext<ModeCtx | null>(null)
const KEY = 'archies-mode'

function readStored(): Mode | null {
  try {
    const v = sessionStorage.getItem(KEY)
    return v === 'day' || v === 'evening' ? v : null
  } catch {
    return null
  }
}

export function ModeProvider({ children }: { children: ReactNode }) {
  const [now, setNow] = useState(() => londonNow())
  const [override, setOverride] = useState<Mode | null>(readStored)

  useEffect(() => {
    const id = window.setInterval(() => setNow(londonNow()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  const auto: Mode = isEvening(now) ? 'evening' : 'day'
  const mode = override ?? auto

  useEffect(() => {
    const root = document.documentElement
    root.dataset.mode = mode
    const meta = document.querySelector('meta[name="theme-color"]')
    meta?.setAttribute('content', mode === 'evening' ? '#1b130b' : '#3b4229')
  }, [mode])

  const toggle = useCallback(() => {
    const next: Mode = mode === 'day' ? 'evening' : 'day'
    const value = next === auto ? null : next
    setOverride(value)
    try {
      if (value) sessionStorage.setItem(KEY, value)
      else sessionStorage.removeItem(KEY)
    } catch {
      /* storage unavailable */
    }
  }, [mode, auto])

  const reset = useCallback(() => {
    setOverride(null)
    try {
      sessionStorage.removeItem(KEY)
    } catch {
      /* storage unavailable */
    }
  }, [])

  const value = useMemo(() => ({ mode, auto, manual: override !== null, now, toggle, reset }), [mode, auto, override, now, toggle, reset])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useMode() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useMode outside provider')
  return v
}
