import { useMemo, useState } from 'react'
import { DAY_SHORT, type Weekday } from '../data/hours'
import { addDays, dateKey, monthTitle, parseKey } from '../lib/london'

interface Props {
  value?: string
  onChange: (key: string) => void
  minKey: string
  maxKey: string
  allowed: (weekday: Weekday) => boolean
  label: string
}

const ORDER: Weekday[] = [1, 2, 3, 4, 5, 6, 0] // weeks start on Monday

export function Calendar({ value, onChange, minKey, maxKey, allowed, label }: Props) {
  const start = parseKey(value ?? minKey)
  const [view, setView] = useState({ y: start.y, m: start.m })
  const min = parseKey(minKey)
  const max = parseKey(maxKey)

  const cells = useMemo(() => {
    const first = dateKey(view.y, view.m, 1)
    const firstW = parseKey(first).weekday
    const lead = ORDER.indexOf(firstW)
    const days = new Date(Date.UTC(view.y, view.m, 0)).getUTCDate()
    const out: (string | null)[] = Array(lead).fill(null)
    for (let d = 1; d <= days; d++) out.push(dateKey(view.y, view.m, d))
    return out
  }, [view])

  const canPrev = view.y > min.y || (view.y === min.y && view.m > min.m)
  const canNext = view.y < max.y || (view.y === max.y && view.m < max.m)
  const shift = (n: number) => {
    const dt = new Date(Date.UTC(view.y, view.m - 1 + n, 1))
    setView({ y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1 })
  }

  return (
    <div className="cal" role="group" aria-label={label}>
      <div className="cal__head">
        <button type="button" className="cal__nav" onClick={() => shift(-1)} disabled={!canPrev} aria-label="Previous month">
          ←
        </button>
        <p className="cal__title" aria-live="polite">
          {monthTitle(view.y, view.m)}
        </p>
        <button type="button" className="cal__nav" onClick={() => shift(1)} disabled={!canNext} aria-label="Next month">
          →
        </button>
      </div>
      <div className="cal__grid">
        {ORDER.map((w) => (
          <span key={w} className="cal__dow" aria-hidden="true">
            {DAY_SHORT[w].slice(0, 2)}
          </span>
        ))}
        {cells.map((key, i) => {
          if (!key) return <span key={`x${i}`} />
          const { d, weekday } = parseKey(key)
          const out = key < minKey || key > maxKey
          const ok = !out && allowed(weekday)
          const selected = key === value
          return (
            <button
              key={key}
              type="button"
              className={`cal__day ${selected ? 'is-selected' : ''} ${ok ? '' : 'is-off'}`}
              disabled={!ok}
              aria-pressed={selected}
              aria-label={new Date(Date.UTC(view.y, view.m - 1, d)).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }) + (ok ? '' : ', unavailable')}
              onClick={() => onChange(key)}
            >
              {d}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function tomorrow(todayKey: string) {
  return addDays(todayKey, 1)
}
