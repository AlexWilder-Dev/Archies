// Single source of truth for opening hours and service times.
// Times are minutes after midnight, London time.

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = Sunday

export interface DayHours {
  open: number
  close: number
  late: boolean // open into the evening
}

const t = (h: number, m = 0) => h * 60 + m

const EARLY: DayHours = { open: t(9), close: t(17), late: false }
const LATE: DayHours = { open: t(9), close: t(23), late: true }

export const HOURS: Record<Weekday, DayHours> = {
  0: EARLY, // Sun
  1: EARLY, // Mon
  2: EARLY, // Tue
  3: LATE, // Wed
  4: LATE, // Thu
  5: LATE, // Fri
  6: LATE, // Sat
}

export const SERVICE = {
  brunchFrom: t(9),
  lunchFrom: t(12),
  dinnerFrom: t(17, 30),
  // the room switches to its evening state when dinner starts on late nights
  eveningFrom: t(17, 30),
} as const

// Booking slots: every 30 minutes, last table 90 minutes before close.
export const BOOKING = {
  step: 30,
  lastSeatingBeforeClose: 90,
  maxOnlineParty: 8,
} as const

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const
export const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

// Display rows, in the order people read them
export const HOURS_ROWS = [
  { days: 'Wednesday – Saturday', short: 'Wed–Sat', hours: '9am – 11pm', late: true },
  { days: 'Sunday, Monday & Tuesday', short: 'Sun–Tue', hours: '9am – 5pm', late: false },
] as const

export const SERVICE_ROWS = [
  { label: 'Brunch', from: 'from 9am' },
  { label: 'Lunch', from: 'from 12pm' },
  { label: 'Dinner', from: 'from 5:30pm, Wed–Sat' },
] as const

export function fmtTime(mins: number): string {
  const h = Math.floor(mins / 60) % 24
  const m = mins % 60
  const suffix = h >= 12 ? 'pm' : 'am'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return m === 0 ? `${h12}${suffix}` : `${h12}:${String(m).padStart(2, '0')}${suffix}`
}
