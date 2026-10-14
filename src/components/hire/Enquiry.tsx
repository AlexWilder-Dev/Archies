import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { MENU_INTEREST, OCCASIONS, SPACES, type SpaceId, type Sitting } from '../../data/hire'
import { site } from '../../data/site'
import { addDays, formatKey, parseKey } from '../../lib/london'
import { useMode } from '../../lib/mode'
import { Calendar } from '../Calendar'
import { Photo } from '../Photo'

type Step = 'space' | 'date' | 'guests' | 'occasion' | 'menu' | 'contact' | 'summary'
const STEPS: { id: Step; label: string }[] = [
  { id: 'space', label: 'Space' },
  { id: 'date', label: 'Date' },
  { id: 'guests', label: 'Guests' },
  { id: 'occasion', label: 'Occasion' },
  { id: 'menu', label: 'Menu' },
  { id: 'contact', label: 'Contact' },
  { id: 'summary', label: 'Check' },
]

interface State {
  space?: SpaceId
  sitting?: Sitting
  date?: string
  guests: number
  format: 'seated' | 'standing'
  occasion?: string
  occasionOther: string
  menu?: string
  name: string
  email: string
  phone: string
  notes: string
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function Enquiry({ preset }: { preset?: { id: SpaceId; n: number } | null }) {
  const { now } = useMode()
  const [step, setStep] = useState<Step>('space')
  const [dir, setDir] = useState(1)
  const [done, setDone] = useState(false)
  const [touched, setTouched] = useState(false)
  const [s, setS] = useState<State>({ guests: 12, format: 'seated', occasionOther: '', name: '', email: '', phone: '', notes: '' })
  const top = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (preset) {
      const sp = SPACES.find((x) => x.id === preset.id)!
      setS((x) => ({ ...x, space: preset.id, sitting: undefined, date: undefined, menu: undefined, guests: Math.min(x.guests, sp.limits.seated), format: 'seated' }))
      setDir(1)
      setStep('date')
    }
  }, [preset])

  const space = SPACES.find((x) => x.id === s.space)
  const sitting = space?.sittings.find((x) => x.id === s.sitting)
  const maxGuests = space ? (s.format === 'standing' && space.limits.standing ? space.limits.standing : space.limits.seated) : 20
  const menuOptions = useMemo(
    () =>
      MENU_INTEREST.filter((m) => {
        if (m.id === 'drinks') return s.space === 'exclusive'
        if (m.id === 'brunch') return s.sitting === 'brunch' || s.sitting === 'day' || s.sitting === 'lunch'
        return true
      }),
    [s.space, s.sitting],
  )
  const menu = MENU_INTEREST.find((m) => m.id === s.menu)

  const valid: Record<Step, boolean> = {
    space: !!s.space,
    date: !!s.sitting && !!s.date,
    guests: s.guests >= 1 && s.guests <= maxGuests,
    occasion: !!s.occasion && (s.occasion !== 'Something else' || s.occasionOther.trim().length > 1),
    menu: !!s.menu,
    contact: s.name.trim().length > 1 && EMAIL.test(s.email.trim()),
    summary: true,
  }
  const idx = STEPS.findIndex((x) => x.id === step)

  const go = (to: Step) => {
    const t = STEPS.findIndex((x) => x.id === to)
    setDir(t > idx ? 1 : -1)
    setStep(to)
    setTouched(false)
    top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const next = () => {
    if (!valid[step]) {
      setTouched(true)
      return
    }
    if (step === 'summary') {
      setDone(true)
      top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    go(STEPS[idx + 1].id)
  }
  const back = () => idx > 0 && go(STEPS[idx - 1].id)

  const set = <K extends keyof State>(k: K, v: State[K]) => setS((x) => ({ ...x, [k]: v }))

  const minKey = addDays(now.key, 1)
  const maxKey = addDays(now.key, 365)

  const estimate = menu && menu.pp > 0 ? menu.pp * s.guests : 0

  const summaryRows: [string, string, Step][] = [
    ['Space', space?.name ?? '', 'space'],
    ['When', s.date ? `${formatKey(s.date)} · ${sitting?.label ?? ''}` : '', 'date'],
    ['Guests', `${s.guests} ${s.space === 'exclusive' ? s.format : 'seated'}`, 'guests'],
    ['Occasion', s.occasion === 'Something else' ? s.occasionOther : s.occasion ?? '', 'occasion'],
    ['Menu', menu ? `${menu.label}${menu.pp ? ` (${menu.detail.split(' ·')[0]})` : ''}` : '', 'menu'],
    ['Contact', [s.name, s.email, s.phone].filter(Boolean).join(' · '), 'contact'],
  ]

  const mailBody = encodeURIComponent(
    `Hello Emma,\n\nI'd like to enquire about private hire at Archie's Herne Hill.\n\n` +
      summaryRows.map(([k, v]) => `${k}: ${v}`).join('\n') +
      (s.notes ? `\nNotes: ${s.notes}` : '') +
      `\n\nThanks,\n${s.name}`,
  )

  if (done) {
    return (
      <div ref={top} className="enq enq--done">
        <Success name={s.name.split(' ')[0]} space={space?.name ?? ''} date={s.date ? formatKey(s.date) : ''} mailHref={`mailto:${site.hireEmail}?subject=${encodeURIComponent('Private hire enquiry')}&body=${mailBody}`} onReset={() => { setDone(false); setStep('space'); setS({ guests: 12, format: 'seated', occasionOther: '', name: '', email: '', phone: '', notes: '' }) }} />
      </div>
    )
  }

  return (
    <div ref={top} className="enq">
      <ol className="enq__progress" aria-label="Enquiry steps">
        {STEPS.map((x, i) => (
          <li key={x.id} className={`${i < idx ? 'is-done' : ''} ${i === idx ? 'is-current' : ''}`} aria-current={i === idx ? 'step' : undefined}>
            <button type="button" disabled={i > idx} onClick={() => go(x.id)}>
              <span className="enq__progress-arch" aria-hidden="true" />
              <span className="enq__progress-label">{x.label}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="enq__body">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -30 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="enq__step"
          >
            {step === 'space' && (
              <StepWrap n={1} title="Which space?" hint="Both come with our feasting menus.">
                <div className="enq__spaces" role="radiogroup" aria-label="Space">
                  {SPACES.map((x) => (
                    <button
                      key={x.id}
                      type="button"
                      role="radio"
                      aria-checked={s.space === x.id}
                      className={`opt-card ${s.space === x.id ? 'is-on' : ''}`}
                      onClick={() => setS((st) => ({ ...st, space: x.id, sitting: undefined, date: undefined, guests: Math.min(st.guests, x.limits.standing ?? x.limits.seated), menu: undefined }))}
                    >
                      <Photo name={x.photo} shape="none" sizes="160px" />
                      <span className="opt-card__text">
                        <span className="opt-card__eyebrow">{x.where}</span>
                        <span className="opt-card__title">{x.name}</span>
                        <span className="opt-card__meta">{x.capacity}</span>
                        <span className="opt-card__meta">{x.availability}</span>
                      </span>
                      <span className="opt-card__tick" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </StepWrap>
            )}

            {step === 'date' && space && (
              <StepWrap n={2} title="When are you thinking?" hint={space.availability}>
                <div className="chips" role="radiogroup" aria-label="Sitting">
                  {space.sittings.map((x) => (
                    <button
                      key={x.id}
                      type="button"
                      role="radio"
                      aria-checked={s.sitting === x.id}
                      className="chip"
                      onClick={() => setS((st) => ({ ...st, sitting: x.id, date: st.date && x.days.includes(parseKey(st.date).weekday) ? st.date : undefined }))}
                    >
                      {x.label} <span className="chip__sub">{x.daysLabel}</span>
                    </button>
                  ))}
                </div>
                {s.sitting && sitting ? (
                  <Calendar
                    label="Choose a date"
                    value={s.date}
                    minKey={minKey}
                    maxKey={maxKey}
                    allowed={(w) => sitting.days.includes(w)}
                    onChange={(k) => set('date', k)}
                  />
                ) : (
                  <p className="enq__nudge">Pick a sitting to see available dates.</p>
                )}
                {s.date && <p className="enq__chosen">{formatKey(s.date)}</p>}
              </StepWrap>
            )}

            {step === 'guests' && space && (
              <StepWrap n={3} title="How many guests?" hint={space.id === 'pdr' ? 'The private dining room seats up to 20.' : 'Up to 35 seated, or 100 standing.'}>
                {space.limits.standing && (
                  <div className="chips" role="radiogroup" aria-label="Format">
                    {(['seated', 'standing'] as const).map((f) => (
                      <button
                        key={f}
                        type="button"
                        role="radio"
                        aria-checked={s.format === f}
                        className="chip"
                        onClick={() => setS((st) => ({ ...st, format: f, guests: Math.min(st.guests, f === 'standing' ? space.limits.standing! : space.limits.seated) }))}
                      >
                        {f === 'seated' ? `Seated · up to ${space.limits.seated}` : `Standing · up to ${space.limits.standing}`}
                      </button>
                    ))}
                  </div>
                )}
                <div className="stepper">
                  <button type="button" className="stepper__btn" onClick={() => set('guests', Math.max(1, s.guests - 1))} aria-label="One fewer guest" disabled={s.guests <= 1}>
                    −
                  </button>
                  <div className="stepper__value" aria-live="polite">
                    <motion.span key={s.guests} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                      {s.guests}
                    </motion.span>
                    <small>guests</small>
                  </div>
                  <button type="button" className="stepper__btn" onClick={() => set('guests', Math.min(maxGuests, s.guests + 1))} aria-label="One more guest" disabled={s.guests >= maxGuests}>
                    +
                  </button>
                </div>
                <input
                  type="range"
                  min={1}
                  max={maxGuests}
                  value={s.guests}
                  onChange={(e) => set('guests', Number(e.target.value))}
                  className="range"
                  aria-label="Number of guests"
                  style={{ '--pct': `${((s.guests - 1) / (maxGuests - 1)) * 100}%` } as CSSProperties}
                />
                {space.id === 'pdr' && s.guests >= 18 && (
                  <p className="enq__nudge">
                    Bigger crowd?{' '}
                    <button type="button" className="linkish" onClick={() => setS((st) => ({ ...st, space: 'exclusive', sitting: undefined, date: undefined }))}>
                      Switch to exclusive hire
                    </button>{' '}
                    for up to 35 seated or 100 standing.
                  </p>
                )}
              </StepWrap>
            )}

            {step === 'occasion' && (
              <StepWrap n={4} title="What’s the occasion?">
                <div className="chips" role="radiogroup" aria-label="Occasion">
                  {OCCASIONS.map((o) => (
                    <button key={o} type="button" role="radio" aria-checked={s.occasion === o} className="chip chip--lg" onClick={() => set('occasion', o)}>
                      {o}
                    </button>
                  ))}
                </div>
                {s.occasion === 'Something else' && (
                  <label className="field enq__other">
                    <span className="field__label">Tell us a little</span>
                    <input className="field__input" value={s.occasionOther} onChange={(e) => set('occasionOther', e.target.value)} aria-invalid={touched && s.occasionOther.trim().length < 2} placeholder="e.g. a book launch" />
                  </label>
                )}
              </StepWrap>
            )}

            {step === 'menu' && (
              <StepWrap n={5} title="What would you like to eat?" hint="Our feasting menus are made for groups. You can change your mind later.">
                <div className="enq__menus" role="radiogroup" aria-label="Menu">
                  {menuOptions.map((m) => (
                    <button key={m.id} type="button" role="radio" aria-checked={s.menu === m.id} className={`menu-opt ${s.menu === m.id ? 'is-on' : ''} ${m.pp ? 'menu-opt--feast' : ''}`} onClick={() => set('menu', m.id)}>
                      <span className="menu-opt__title">{m.label}</span>
                      <span className="menu-opt__detail">{m.detail}</span>
                    </button>
                  ))}
                </div>
                {estimate > 0 && (
                  <motion.p className="enq__estimate" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} key={estimate}>
                    {s.guests} × {menu?.detail.split(' ·')[0]} = <strong>£{estimate.toLocaleString('en-GB')}</strong> for food, before drinks and the discretionary 12.5% service charge. A guide only: Emma will confirm.
                  </motion.p>
                )}
                <p className="small muted">
                  <Link to="/menu?tab=feasting" className="text-link">
                    See both feasting menus
                  </Link>
                </p>
              </StepWrap>
            )}

            {step === 'contact' && (
              <StepWrap n={6} title="Where can we reach you?">
                <div className="form-grid">
                  <label className="field">
                    <span className="field__label">Your name</span>
                    <input className="field__input" autoComplete="name" value={s.name} onChange={(e) => set('name', e.target.value)} aria-invalid={touched && s.name.trim().length < 2} />
                    {touched && s.name.trim().length < 2 && <span className="field__error">Please add your name.</span>}
                  </label>
                  <label className="field">
                    <span className="field__label">Email</span>
                    <input className="field__input" type="email" inputMode="email" autoComplete="email" value={s.email} onChange={(e) => set('email', e.target.value)} aria-invalid={touched && !EMAIL.test(s.email.trim())} />
                    {touched && !EMAIL.test(s.email.trim()) && <span className="field__error">We need an email to reply to.</span>}
                  </label>
                  <label className="field">
                    <span className="field__label">
                      Phone <span className="field__hint">optional</span>
                    </span>
                    <input className="field__input" type="tel" inputMode="tel" autoComplete="tel" value={s.phone} onChange={(e) => set('phone', e.target.value)} />
                  </label>
                  <label className="field form-grid__wide">
                    <span className="field__label">
                      Anything else? <span className="field__hint">dietary needs, timings, music, cake…</span>
                    </span>
                    <textarea className="field__input" value={s.notes} onChange={(e) => set('notes', e.target.value)} />
                  </label>
                </div>
              </StepWrap>
            )}

            {step === 'summary' && (
              <StepWrap n={7} title="Does this look right?">
                <dl className="summary">
                  {summaryRows.map(([k, v, st]) => (
                    <div key={k} className="summary__row">
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                      <button type="button" className="linkish" onClick={() => go(st)}>
                        Edit<span className="sr-only"> {k}</span>
                      </button>
                    </div>
                  ))}
                  {s.notes && (
                    <div className="summary__row">
                      <dt>Notes</dt>
                      <dd>{s.notes}</dd>
                      <button type="button" className="linkish" onClick={() => go('contact')}>
                        Edit<span className="sr-only"> notes</span>
                      </button>
                    </div>
                  )}
                </dl>
                {estimate > 0 && <p className="small muted">Indicative food spend: £{estimate.toLocaleString('en-GB')}.</p>}
                <p className="small muted">Your enquiry goes to {site.hireEmail}. Nothing is booked until we confirm.</p>
              </StepWrap>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="enq__nav">
        <button type="button" className="linkish enq__back" onClick={back} disabled={idx === 0}>
          Back
        </button>
        {touched && !valid[step] && (
          <p className="field__error enq__err" role="alert">
            {step === 'date' ? 'Choose a sitting and a date.' : step === 'contact' ? 'Add your name and a valid email.' : 'Pick one to continue.'}
          </p>
        )}
        <button type="button" className={`btn ${valid[step] ? '' : 'is-soft'}`} onClick={next}>
          {step === 'summary' ? 'Send enquiry' : 'Continue'}
        </button>
      </div>
    </div>
  )
}

function StepWrap({ n, title, hint, children }: { n: number; title: string; hint?: string; children: ReactNode }) {
  return (
    <fieldset className="enq__fieldset">
      <legend className="enq__legend">
        <span className="enq__n">{String(n).padStart(2, '0')}</span>
        <span className="t-m">{title}</span>
      </legend>
      {hint && <p className="enq__hint">{hint}</p>}
      <div className="enq__content">{children}</div>
    </fieldset>
  )
}

function Success({ name, space, date, mailHref, onReset }: { name: string; space: string; date: string; mailHref: string; onReset: () => void }) {
  return (
    <motion.div className="success" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <p className="label">Enquiry sent</p>
      <h3 className="t-l">Thank you{name ? `, ${name}` : ''}</h3>
      <p>
        Your enquiry for <strong>{space}</strong>
        {date ? ` on ${date}` : ''} is with Emma at {site.hireEmail}, who will be in touch about menus, timings and the details.
      </p>
      <p className="small muted">This is a demo: nothing has been sent yet.</p>
      <div className="success__actions">
        <a className="btn" href={mailHref}>
          Email it to Emma now
        </a>
        <button type="button" className="linkish" onClick={onReset}>
          Start another enquiry
        </button>
      </div>
    </motion.div>
  )
}
