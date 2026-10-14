import { BOOKING, HOURS, SERVICE, fmtTime } from '../data/hours'
import { parseKey, type LondonNow } from './london'

export type Service = 'brunch' | 'lunch' | 'dinner'

export interface Slot {
  mins: number
  label: string
  service: Service
  past: boolean
}

export const SERVICE_LABEL: Record<Service, string> = {
  brunch: 'Brunch',
  lunch: 'Lunch',
  dinner: 'Dinner',
}

/** Table times for a date, built from the opening hours. */
export function slotsFor(key: string, now: LondonNow): Slot[] {
  const { weekday } = parseKey(key)
  const h = HOURS[weekday]
  const last = h.close - BOOKING.lastSeatingBeforeClose
  const out: Slot[] = []
  for (let mins = h.open; mins <= last; mins += BOOKING.step) {
    // the kitchen turns over between lunch and dinner on late nights
    if (h.late && mins > SERVICE.dinnerFrom - 60 && mins < SERVICE.dinnerFrom) continue
    const service: Service = mins >= SERVICE.dinnerFrom && h.late ? 'dinner' : mins >= SERVICE.lunchFrom ? 'lunch' : 'brunch'
    const past = key === now.key && mins <= now.mins + 15
    out.push({ mins, label: fmtTime(mins), service, past })
  }
  return out
}

export function groupSlots(slots: Slot[]) {
  const groups: { service: Service; slots: Slot[] }[] = []
  for (const s of slots) {
    const g = groups.find((x) => x.service === s.service)
    if (g) g.slots.push(s)
    else groups.push({ service: s.service, slots: [s] })
  }
  return groups
}
