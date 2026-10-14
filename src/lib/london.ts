import { HOURS, SERVICE, type Weekday, fmtTime, DAY_NAMES } from '../data/hours'

export interface LondonNow {
  y: number
  m: number // 1-12
  d: number
  weekday: Weekday
  mins: number
  key: string // YYYY-MM-DD
}

const fmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/London',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

export function londonNow(date = new Date()): LondonNow {
  const parts = Object.fromEntries(fmt.formatToParts(date).map((p) => [p.type, p.value]))
  const y = Number(parts.year)
  const m = Number(parts.month)
  const d = Number(parts.day)
  const mins = Number(parts.hour) * 60 + Number(parts.minute)
  return { y, m, d, mins, weekday: weekdayOf(y, m, d), key: dateKey(y, m, d) }
}

export function weekdayOf(y: number, m: number, d: number): Weekday {
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay() as Weekday
}

export function dateKey(y: number, m: number, d: number) {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export function parseKey(key: string) {
  const [y, m, d] = key.split('-').map(Number)
  return { y, m, d, weekday: weekdayOf(y, m, d) }
}

export function addDays(key: string, n: number) {
  const { y, m, d } = parseKey(key)
  const dt = new Date(Date.UTC(y, m - 1, d + n))
  return dateKey(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate())
}

const longDate = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
const shortMonth = new Intl.DateTimeFormat('en-GB', { month: 'short', timeZone: 'UTC' })
const monthYear = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' })

export function formatKey(key: string) {
  const { y, m, d } = parseKey(key)
  return longDate.format(new Date(Date.UTC(y, m - 1, d)))
}
export function monthShort(key: string) {
  const { y, m, d } = parseKey(key)
  return shortMonth.format(new Date(Date.UTC(y, m - 1, d)))
}
export function monthTitle(y: number, m: number) {
  return monthYear.format(new Date(Date.UTC(y, m - 1, 1)))
}

/** Evening state: late nights from 5:30pm. */
export function isEvening(now: LondonNow) {
  return HOURS[now.weekday].late && now.mins >= SERVICE.eveningFrom
}

export interface OpenStatus {
  open: boolean
  label: string
  detail: string
}

export function openStatus(now: LondonNow): OpenStatus {
  const h = HOURS[now.weekday]
  if (now.mins >= h.open && now.mins < h.close) {
    const left = h.close - now.mins
    let detail = `until ${fmtTime(h.close)}`
    if (h.late && now.mins < SERVICE.dinnerFrom && now.mins >= SERVICE.lunchFrom) detail = `dinner from ${fmtTime(SERVICE.dinnerFrom)}`
    if (now.mins < SERVICE.lunchFrom) detail = `lunch from ${fmtTime(SERVICE.lunchFrom)}`
    if (left <= 45) detail = `closes at ${fmtTime(h.close)}`
    return { open: true, label: 'Open now', detail }
  }
  if (now.mins < h.open) {
    return { open: false, label: 'Opens today', detail: `at ${fmtTime(h.open)}` }
  }
  const next = ((now.weekday + 1) % 7) as Weekday
  return { open: false, label: 'Closed now', detail: `opens tomorrow ${fmtTime(HOURS[next].open)}` }
}

export function dayName(w: Weekday) {
  return DAY_NAMES[w]
}
