import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { DietTags } from '../components/DietTags'
import { ArchA, Vine } from '../components/Decor'
import { Photo } from '../components/Photo'
import { DIET_KEY, FEASTS, MENUS, SERVICE_NOTE, type Diet, type FeastMenu, type Menu, type MenuItem, type MenuSection } from '../data/menu'
import type { PhotoName } from '../data/media'
import { useMode } from '../lib/mode'

type Filter = 'v' | 'vg' | 'gf'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'v', label: 'Vegetarian' },
  { id: 'vg', label: 'Vegan' },
  { id: 'gf', label: 'Gluten free' },
]

const MATCH: Record<Filter, Diet[]> = {
  v: ['v', 'vg', 'v*'],
  vg: ['vg'],
  gf: ['gf', 'gf*'],
}

const HEADER_PHOTO: Record<Menu['id'], PhotoName> = {
  brunch: 'eggs-green-red-salsa',
  'lunch-dinner': 'choclitos-corn-ribs',
  feasting: 'sharing-plates-spread',
  drinks: 'cocktail-tajin-pineapple',
}

const NOTES: Partial<Record<Menu['id'], string>> = {
  'lunch-dinner': 'Lunch every day from 12pm · dinner Wednesday to Saturday from 5:30pm',
}

function matches(item: MenuItem, filters: Filter[]) {
  if (!filters.length) return true
  return filters.every((f) => item.diet?.some((d) => MATCH[f].includes(d)))
}

export function MenuPage() {
  const { mode } = useMode()
  const [params, setParams] = useSearchParams()
  const fallback: Menu['id'] = mode === 'evening' ? 'lunch-dinner' : 'brunch'
  const tabParam = params.get('tab') as Menu['id'] | null
  const active = MENUS.find((m) => m.id === tabParam) ?? MENUS.find((m) => m.id === fallback)!
  const [filters, setFilters] = useState<Filter[]>([])

  const setTab = (id: Menu['id']) => {
    const next = new URLSearchParams(params)
    next.set('tab', id)
    setParams(next, { replace: true })
  }
  const toggleFilter = (f: Filter) => setFilters((fs) => (fs.includes(f) ? fs.filter((x) => x !== f) : [...fs, f]))

  const visible = useMemo(() => {
    if (active.id === 'feasting') return null
    const sections = active.sections
      .map((s) => ({ ...s, items: active.food ? s.items.filter((i) => matches(i, filters)) : s.items }))
      .filter((s) => s.items.length)
    const total = active.sections.reduce((n, s) => n + s.items.length, 0)
    const shown = sections.reduce((n, s) => n + s.items.length, 0)
    return { sections, total, shown }
  }, [active, filters])

  return (
    <div className="menu-page">
      <header className="menu-hero">
        <div className="wrap menu-hero__inner">
          <div>
            <p className="eyebrow">Menus</p>
            <h1 className="display menu-hero__title">Eat, drink, stay a while.</h1>
            <p className="lede">Brunch from 9am, lunch from 12pm, and dinner from 5:30pm Wednesday to Saturday. Everything below, nothing to download.</p>
          </div>
          <div className="menu-hero__photo">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div key={active.id} initial={{ opacity: 0, rotate: -4, scale: 0.94 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                <Photo name={HEADER_PHOTO[active.id]} shape="arch" eager sizes="(max-width: 900px) 40vw, 260px" />
              </motion.div>
            </AnimatePresence>
            <Vine className="menu-hero__vine" length={0.6} />
          </div>
        </div>
      </header>

      <div className="menu-bar">
        <div className="wrap">
          <LayoutGroup id="menu-tabs">
            <div className="menu-tabs" role="tablist" aria-label="Menus">
              {MENUS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="tab"
                  id={`tab-${m.id}`}
                  aria-selected={m.id === active.id}
                  aria-controls="menu-panel"
                  className={`menu-tab ${m.id === active.id ? 'is-active' : ''}`}
                  onClick={() => setTab(m.id)}
                >
                  {m.id === active.id && <motion.span layoutId="menu-tab-bg" className="menu-tab__bg" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                  <span className="menu-tab__label">{m.tab}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        </div>
      </div>

      <section id="menu-panel" role="tabpanel" aria-labelledby={`tab-${active.id}`} className="wrap menu-panel">
        <div className="menu-meta">
          <div>
            <h2 className="h2 neonable">{active.title}</h2>
            <p className="menu-meta__served">
              <ClockIcon /> {active.served}
            </p>
            {NOTES[active.id] && <p className="small muted">{NOTES[active.id]}</p>}
            {active.intro && <p className="muted">{active.intro}</p>}
          </div>

          {active.food ? (
            <div className="filters" role="group" aria-label="Dietary filters">
              <span className="filters__label small">Show only</span>
              {FILTERS.map((f) => (
                <button key={f.id} type="button" className="chip" aria-pressed={filters.includes(f.id)} onClick={() => toggleFilter(f.id)}>
                  <span className={`tag tag--${f.id}`}>{f.id}</span>
                  {f.label}
                </button>
              ))}
              {filters.length > 0 && (
                <button type="button" className="filters__clear" onClick={() => setFilters([])}>
                  Clear
                </button>
              )}
              {visible && filters.length > 0 && (
                <p className="filters__count small muted" role="status">
                  Showing {visible.shown} of {visible.total} items
                  {filters.includes('gf') && ' · gf includes gluten-free options (gf*)'}
                </p>
              )}
              {active.id === 'feasting' && filters.length > 0 && (
                <p className="filters__count small muted" role="status">
                  Dishes that don’t match are faded. Ask the team about swaps when you book.
                </p>
              )}
            </div>
          ) : (
            <p className="small muted filters__none">Cocktails, wine, beer, soft drinks and coffee. Ask the team about anything you’d like to know.</p>
          )}
        </div>

        {!active.food && (
          <nav className="menu-jump" aria-label="Drinks sections">
            {active.sections
              .filter((s) => s.title)
              .map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                >
                  {s.title}
                </a>
              ))}
          </nav>
        )}

        <AnimatePresence mode="wait">
          <motion.div key={active.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.32 }}>
            {active.id === 'feasting' ? (
              <FeastingPanel filters={filters} />
            ) : visible && visible.sections.length ? (
              <div className={`menu-sections ${active.food ? '' : 'menu-sections--drinks'}`}>
                {visible.sections.map((s) => (
                  <Section key={s.id} s={s.title === active.title ? { ...s, title: undefined, note: s.note } : s} />
                ))}
              </div>
            ) : (
              <div className="menu-empty">
                <p>Nothing on this menu matches every filter you’ve picked.</p>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => setFilters([])}>
                  Clear filters
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <footer className="menu-foot">
          <ArchA className="menu-foot__mark" size={30} />
          <p>
            <strong>{SERVICE_NOTE}</strong>
          </p>
          <p className="small muted">
            {(['v', 'vg', 'gf', 'gf*', 'v*'] as Diet[]).map((d, i) => (
              <span key={d}>
                {i > 0 && ' · '}
                <span className={`tag tag--${d.replace('*', '')}`}>{d}</span> {DIET_KEY[d]}
              </span>
            ))}
          </p>
          <div className="menu-foot__ctas">
            <Link to={active.id === 'brunch' ? '/book?service=brunch' : active.id === 'lunch-dinner' ? '/book?service=dinner' : '/book'} className="btn btn--primary">
              Book a table <span className="btn__arrow">→</span>
            </Link>
            <Link to="/private-hire" className="btn btn--ghost">
              Private hire &amp; feasting
            </Link>
          </div>
        </footer>
      </section>
    </div>
  )
}

function Section({ s }: { s: MenuSection }) {
  const cols = s.columns
  return (
    <motion.section layout className="menu-section" id={s.id} aria-labelledby={s.title || s.note ? `${s.id}-h` : undefined}>
      <div className="menu-section__head">
        {s.title && (
          <h3 id={`${s.id}-h`} className="menu-section__title">
            {s.title}
          </h3>
        )}
        {s.note && (
          <p id={s.title ? undefined : `${s.id}-h`} className="menu-section__note sign">
            {s.note}
          </p>
        )}
        {cols && (
          <div className="menu-section__cols" aria-hidden="true">
            {cols.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
        )}
      </div>
      <ul className="menu-items">
        <AnimatePresence initial={false}>
          {s.items.map((i) => (
            <motion.li
              key={i.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="menu-item"
            >
              <Item item={i} cols={cols} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {s.footer && (
        <div className="menu-section__footer">
          {s.footer.map((f) => (
            <p key={f}>{f}</p>
          ))}
        </div>
      )}
    </motion.section>
  )
}

function Item({ item, cols }: { item: MenuItem; cols?: string[] }) {
  const columnar = cols && item.prices && !item.prices.some((p) => p.label && !cols.includes(p.label))
  return (
    <div className={`item ${columnar ? 'item--cols' : ''}`}>
      <div className="item__main">
        <p className="item__name">
          {item.name} <DietTags diet={item.diet} />
        </p>
        {item.desc && <p className={`item__desc ${item.descItalic ? 'is-italic' : ''}`}>{item.desc}</p>}
        {item.extras && <p className="item__extras">{item.extras.join(' | ')}</p>}
      </div>
      {columnar && cols ? (
        <div className="item__cols">
          {item.prices!.map((p, idx) => (
            <span key={idx} className="item__price">
              {p.price ? (
                <>
                  <span className="item__price-label">{cols[idx]}</span>
                  {p.price}
                </>
              ) : (
                <span aria-hidden="true">·</span>
              )}
            </span>
          ))}
        </div>
      ) : item.prices ? (
        <div className="item__multi">
          {item.prices.map((p) => (
            <span key={p.label} className="item__price">
              <span className="item__price-label item__price-label--show">{p.label}</span>
              {p.price}
            </span>
          ))}
        </div>
      ) : item.price ? (
        <span className="item__price item__price--single">{item.price}</span>
      ) : null}
    </div>
  )
}

function FeastingPanel({ filters }: { filters: Filter[] }) {
  return (
    <div className="feasts">
      {FEASTS.map((f) => (
        <FeastCard key={f.id} f={f} filters={filters} />
      ))}
      <div className="feasts__aside">
        <Photo name="party-table-dahlias" shape="arch" sizes="(max-width: 900px) 70vw, 300px" />
        <h3 className="h3">Planning a party?</h3>
        <p className="muted">Both feasting menus are available for the private dining room and exclusive hire of the whole building.</p>
        <Link to="/private-hire" state={{ scrollTo: 'enquire' }} className="btn btn--primary">
          Start an enquiry
        </Link>
      </div>
    </div>
  )
}

export function FeastCard({ f, filters = [], compact = false }: { f: FeastMenu; filters?: Filter[]; compact?: boolean }) {
  const groups: [string, MenuItem[]][] = [
    ['To start', f.starters],
    ['To follow', f.mains],
  ]
  return (
    <article className={`feast-card ${compact ? 'feast-card--compact' : ''}`} aria-labelledby={`${f.id}-title`}>
      <div className="feast-card__arch">
        <ArchA className="feast-card__mark" size={34} />
        <h3 id={`${f.id}-title`} className="feast-card__title">
          {f.title}
          <span className="feast-card__price">{f.price}</span>
        </h3>
        {groups.map(([label, items]) => (
          <div key={label} className="feast-card__group">
            <p className="feast-card__label sign">{label}</p>
            <ul>
              {items.map((i) => (
                <li key={i.id} className={matches(i, filters) ? '' : 'is-faded'}>
                  <strong>{i.name}</strong>
                  <span>
                    {i.desc} <DietTags diet={i.diet} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="feast-card__sides">
          <em>{f.sidesLead}</em>
          <span>{f.id === 'feast-1' ? f.sides.join(' · ') : f.sides.join(' | ')}</span>
        </div>
        {f.dessert && (
          <div className="feast-card__group">
            <p className="feast-card__label sign">To finish</p>
            <ul>
              {f.dessert.map((i) => (
                <li key={i.id} className={matches(i, filters) ? '' : 'is-faded'}>
                  <strong>{i.name}</strong>
                  <span>
                    {i.desc} <DietTags diet={i.diet} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  )
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}
