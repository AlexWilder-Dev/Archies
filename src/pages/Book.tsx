import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AMono } from '../components/Marks'
import { BOOKING, DAY_SHORT, HOURS, fmtTime } from '../data/hours'
import { site } from '../data/site'
import { addDays, formatKey, monthShort, parseKey } from '../lib/london'
import { useMode } from '../lib/mode'
import { SERVICE_LABEL, groupSlots, slotsFor, type Service } from '../lib/slots'

const DAYS_AHEAD = 28
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface Details {
  name: string
  email: string
  phone: string
  notes: string
}

export function Book() {
  const { now } = useMode()
  const [params] = useSearchParams()
  const want = params.get('service') as Service | null

  const days = useMemo(() => Array.from({ length: DAYS_AHEAD }, (_, i) => addDays(now.key, i)), [now.key])
  const firstDateFor = (svc: Service | null) =>
    days.find((k) => slotsFor(k, now).some((s) => !s.past && (!svc || s.service === svc))) ?? days[1]

  const [size, setSize] = useState<number | 'big'>(2)
  const [date, setDate] = useState(() => firstDateFor(want))
  const [time, setTime] = useState<number | null>(null)
  const [stage, setStage] = useState<'pick' | 'details' | 'done'>('pick')
  const [d, setD] = useState<Details>({ name: '', email: '', phone: '', notes: '' })
  const [touched, setTouched] = useState(false)
  const top = useRef<HTMLDivElement>(null)
  const strip = useRef<HTMLDivElement>(null)

  const slots = useMemo(() => slotsFor(date, now), [date, now])
  const groups = groupSlots(slots)
  const available = slots.some((s) => !s.past)

  // keep the selected day in view on the strip
  useEffect(() => {
    strip.current?.querySelector('[aria-pressed="true"]')?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [date])

  useEffect(() => {
    if (time !== null && !slots.some((s) => s.mins === time && !s.past)) setTime(null)
  }, [slots, time])

  const ready = typeof size === 'number' && time !== null
  const detailsOk = d.name.trim().length > 1 && EMAIL.test(d.email.trim())

  const toStage = (st: typeof stage) => {
    setStage(st)
    window.setTimeout(() => top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!detailsOk) {
      setTouched(true)
      return
    }
    toStage('done')
  }

  const service = time !== null ? slots.find((s) => s.mins === time)?.service : undefined
  const ref = useMemo(() => 'AHH-' + Math.random().toString(36).slice(2, 7).toUpperCase(), [stage === 'done'])

  return (
    <div className="book page g-board" ref={top}>
      <section className="book-hero">
        <div className="wrap book-hero__inner">
          <div>
            <p className="label">Archie’s Herne Hill</p>
            <h1 className="display d-xl">Book a table</h1>
            <p className="lede">Brunch, lunch or dinner, in a few taps. Booking is recommended at weekends.</p>
          </div>
          <aside className="walkin" aria-label="Walk-ins">
            <p className="label">Walk-ins welcome</p>
            <p>No booking needed for the lounge and the outside tables: first come, first served. Dogs and families welcome.</p>
          </aside>
        </div>
      </section>

      <div className="wrap book__grid">
        <div className="book__main">
          <AnimatePresence mode="wait">
            {stage === 'pick' && (
              <motion.div key="pick" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
                <fieldset className="book-step">
                  <legend className="book-step__legend">
                    <span className="enq__n">01</span> How many of you?
                  </legend>
                  <div className="sizes" role="radiogroup" aria-label="Party size">
                    {Array.from({ length: BOOKING.maxOnlineParty }, (_, i) => i + 1).map((n) => (
                      <button key={n} type="button" role="radio" aria-checked={size === n} className="size" onClick={() => setSize(n)}>
                        {n}
                      </button>
                    ))}
                    <button type="button" role="radio" aria-checked={size === 'big'} className="size size--big" onClick={() => setSize('big')}>
                      {BOOKING.maxOnlineParty + 1}+
                    </button>
                  </div>
                  <AnimatePresence>
                    {size === 'big' && (
                      <motion.div className="bigparty" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <p>
                          For {BOOKING.maxOnlineParty + 1} or more, let us look after you properly. Our private dining room seats up to 20, and the feasting menus are made for groups.
                        </p>
                        <div className="bigparty__ctas">
                          <Link to="/private-hire" state={{ scrollTo: 'enquire' }} className="btn btn--sm">
                            Group &amp; private hire enquiry
                          </Link>
                          <a href={`mailto:${site.hireEmail}`} className="text-link">
                            {site.hireEmail}
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </fieldset>

                <fieldset className="book-step" disabled={size === 'big'}>
                  <legend className="book-step__legend">
                    <span className="enq__n">02</span> Which day?
                  </legend>
                  <div className="days" ref={strip} role="radiogroup" aria-label="Date">
                    {days.map((k, i) => {
                      const p = parseKey(k)
                      const h = HOURS[p.weekday]
                      const none = !slotsFor(k, now).some((s) => !s.past)
                      return (
                        <button key={k} type="button" role="radio" aria-checked={k === date} aria-pressed={k === date} className={`day ${h.late ? 'day--late' : ''}`} disabled={none} onClick={() => setDate(k)} aria-label={`${formatKey(k)}, open until ${fmtTime(h.close)}${none ? ', fully past' : ''}`}>
                          <span className="day__dow">{i === 0 ? 'Today' : i === 1 ? 'Tmrw' : DAY_SHORT[p.weekday]}</span>
                          <span className="day__num">{p.d}</span>
                          <span className="day__mon">{monthShort(k)}</span>
                          <span className="day__till">{h.late ? 'till 11' : 'till 5'}</span>
                        </button>
                      )
                    })}
                  </div>
                  <p className="small muted days__legend">
                    <span className="days__swatch" /> Late nights: open till 11pm, Wednesday to Saturday
                  </p>
                </fieldset>

                <fieldset className="book-step" disabled={size === 'big'}>
                  <legend className="book-step__legend">
                    <span className="enq__n">03</span> What time?
                  </legend>
                  <p className="book-step__date">{formatKey(date)}</p>
                  {available ? (
                    <div className="slot-groups">
                      {groups.map((g) => (
                        <div key={g.service} className={`slot-group slot-group--${g.service}`}>
                          <p className="slot-group__label sign">{SERVICE_LABEL[g.service]}</p>
                          <div className="slots" role="radiogroup" aria-label={`${SERVICE_LABEL[g.service]} times`}>
                            {g.slots.map((s) => (
                              <button key={s.mins} type="button" role="radio" aria-checked={time === s.mins} className="slot" disabled={s.past} onClick={() => setTime(s.mins)}>
                                {s.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="enq__nudge">No more tables today. Pick another day, or just walk in.</p>
                  )}
                </fieldset>

                <div className="book__go">
                  <button type="button" className="btn btn--block" disabled={!ready} onClick={() => toStage('details')}>
                    {ready ? `Continue · ${size} · ${DAY_SHORT[parseKey(date).weekday]} ${parseKey(date).d} ${monthShort(date)} · ${fmtTime(time!)}` : 'Choose a time'}
                  </button>
                </div>
              </motion.div>
            )}

            {stage === 'details' && (
              <motion.form key="details" onSubmit={submit} noValidate initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }} className="book-step book-details">
                <button type="button" className="linkish book-back" onClick={() => toStage('pick')}>
                  ← Change table
                </button>
                <h2 className="display d-m">
                  {size} {size === 1 ? 'person' : 'people'} · {formatKey(date)} · {time !== null && fmtTime(time)}
                </h2>
                <div className="form-grid">
                  <label className="field">
                    <span className="field__label">Name</span>
                    <input className="field__input" autoComplete="name" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} aria-invalid={touched && d.name.trim().length < 2} />
                    {touched && d.name.trim().length < 2 && <span className="field__error">Please add your name.</span>}
                  </label>
                  <label className="field">
                    <span className="field__label">Email</span>
                    <input className="field__input" type="email" inputMode="email" autoComplete="email" value={d.email} onChange={(e) => setD({ ...d, email: e.target.value })} aria-invalid={touched && !EMAIL.test(d.email.trim())} />
                    {touched && !EMAIL.test(d.email.trim()) && <span className="field__error">We’ll send your confirmation here.</span>}
                  </label>
                  <label className="field">
                    <span className="field__label">
                      Mobile <span className="field__hint">optional, in case we need to reach you</span>
                    </span>
                    <input className="field__input" type="tel" inputMode="tel" autoComplete="tel" value={d.phone} onChange={(e) => setD({ ...d, phone: e.target.value })} />
                  </label>
                  <label className="field">
                    <span className="field__label">
                      Anything we should know? <span className="field__hint">allergies, a birthday, a dog</span>
                    </span>
                    <input className="field__input" value={d.notes} onChange={(e) => setD({ ...d, notes: e.target.value })} />
                  </label>
                </div>
                <p className="small muted">A discretionary 12.5% service charge is added to the bill.</p>
                <button type="submit" className="btn btn--block">
                  Confirm booking
                </button>
              </motion.form>
            )}

            {stage === 'done' && time !== null && typeof size === 'number' && (
              <Confirmation key="done" size={size} date={date} time={time} service={service} name={d.name} email={d.email} bookingRef={ref} onAgain={() => { setTime(null); toStage('pick') }} />
            )}
          </AnimatePresence>
        </div>

        <aside className="book__aside" aria-label="Your table">
          <div className="ticket arch g-paper">
            <AMono />
            <p className="label ticket__title">Your table</p>
            <dl className="ticket__rows">
              <div>
                <dt>Guests</dt>
                <dd>{size === 'big' ? `${BOOKING.maxOnlineParty + 1}+` : size}</dd>
              </div>
              <div>
                <dt>Day</dt>
                <dd>{formatKey(date)}</dd>
              </div>
              <div>
                <dt>Time</dt>
                <dd>{time !== null ? `${fmtTime(time)}${service ? ` · ${SERVICE_LABEL[service]}` : ''}` : '—'}</dd>
              </div>
            </dl>
            <p className="ticket__where">
              {site.address.oneLine}
              <br />A minute from Herne Hill station
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

function icsDate(key: string, mins: number) {
  const { y, m, d } = parseKey(key)
  const hh = String(Math.floor(mins / 60)).padStart(2, '0')
  const mm = String(mins % 60).padStart(2, '0')
  return `${y}${String(m).padStart(2, '0')}${String(d).padStart(2, '0')}T${hh}${mm}00`
}

function Confirmation({ size, date, time, service, name, email, bookingRef, onAgain }: { size: number; date: string; time: number; service?: Service; name: string; email: string; bookingRef: string; onAgain: () => void }) {
  const ics = useMemo(() => {
    const body = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Archies Herne Hill//Booking//EN',
      'BEGIN:VEVENT',
      `UID:${bookingRef}@archieshernehill`,
      `DTSTART;TZID=Europe/London:${icsDate(date, time)}`,
      `DTEND;TZID=Europe/London:${icsDate(date, time + 90)}`,
      `SUMMARY:Archie's Herne Hill · table for ${size}`,
      `LOCATION:${site.address.oneLine.replace(/,/g, '\\,')}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')
    return URL.createObjectURL(new Blob([body], { type: 'text/calendar' }))
  }, [bookingRef, date, time, size])
  useEffect(() => () => URL.revokeObjectURL(ics), [ics])

  return (
    <motion.div className="confirm" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45 }}>
      <div className="confirm__card arch g-paper">
        <AMono />
        <p className="label">See you soon{name ? `, ${name.split(' ')[0]}` : ''}</p>
        <h2 className="print confirm__title">
          Table for {size}, {formatKey(date)} at {fmtTime(time)}.
        </h2>
        <p className="muted">
          {service ? `${SERVICE_LABEL[service]} at Archie’s. ` : ''}Your confirmation goes to {email}. Reference <strong>{bookingRef}</strong>.
        </p>
        <p className="small muted">This is a demo: no booking has been made and nothing has been sent.</p>
        <div className="confirm__ctas">
          <a className="btn btn--ink" href={ics} download="archies-herne-hill.ics">
            Add to calendar
          </a>
          <a className="link" href={site.maps} target="_blank" rel="noreferrer">
            Directions
          </a>
          <Link className="link" to={service === 'brunch' ? '/menu?tab=brunch' : '/menu?tab=lunch-dinner'}>
            Look at the menu
          </Link>
        </div>
        <button type="button" className="linkish" onClick={onAgain}>
          Make another booking
        </button>
      </div>
    </motion.div>
  )
}
