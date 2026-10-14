import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AMono, Pinned } from '../components/Marks'
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

const SERVED: Record<Menu['id'], string> = {
  brunch: 'Served from 9am, every day',
  'lunch-dinner': 'Served from 12pm & 5:30pm',
  feasting: 'Two sharing menus · £45pp and £55pp',
  drinks: 'Cocktails, wine, beer and coffee, all day',
}

/* prints pinned either side of the menu on wide screens */
const PINS: Record<Menu['id'], [{ name: PhotoName; caption: string }, { name: PhotoName; caption: string }]> = {
  brunch: [
    { name: 'eggs-green-red-salsa', caption: 'Eggs, green and red salsa' },
    { name: 'brunch-eggs-bloody-mary', caption: 'Eggs in the pan, and a Bloody Mary' },
  ],
  'lunch-dinner': [
    { name: 'choclitos-corn-ribs', caption: 'Choclitos 5' },
    { name: 'tacos-pickled-onion', caption: 'Tacos, with pickled onion' },
  ],
  feasting: [
    { name: 'sharing-plates-spread', caption: 'For the middle of the table' },
    { name: 'party-table-dahlias', caption: 'Set for a party' },
  ],
  drinks: [
    { name: 'cocktail-tajin-pineapple', caption: 'From the bar' },
    { name: 'banquette-candlelight', caption: 'After dark' },
  ],
}

function matches(item: MenuItem, filters: Filter[]) {
  if (!filters.length) return true
  return filters.every((f) => item.diet?.some((d) => MATCH[f].includes(d)))
}

function Diet({ diet }: { diet?: Diet[] }) {
  if (!diet?.length) return null
  return (
    <span className="diet">
      {' ('}
      {diet.map((d, i) => (
        <span key={d}>
          {i > 0 && ', '}
          <abbr title={DIET_KEY[d]}>{d}</abbr>
        </span>
      ))}
      {')'}
    </span>
  )
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

  const pins = PINS[active.id]
  const book = active.id === 'brunch' ? '/book?service=brunch' : active.id === 'lunch-dinner' ? '/book?service=dinner&time=1140' : '/book'

  return (
    <div className={`menu-page page ${mode === 'evening' ? 'g-night' : 'g-feast'}`}>
      <h1 className="sr-only">Menus at Archie’s Herne Hill</h1>

      <div className="menu-bar">
        <div className="wrap menu-bar__inner">
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
                  className={`menu-tab sign ${m.id === active.id ? 'is-active' : ''}`}
                  onClick={() => setTab(m.id)}
                >
                  {m.tab}
                  {m.id === active.id && <motion.span layoutId="menu-tab-line" className="menu-tab__line" transition={{ type: 'spring', stiffness: 420, damping: 38 }} />}
                </button>
              ))}
            </div>
          </LayoutGroup>
          {active.food && (
            <div className="filters" role="group" aria-label="Dietary filters">
              {FILTERS.map((f) => (
                <button key={f.id} type="button" className="filter" aria-pressed={filters.includes(f.id)} onClick={() => toggleFilter(f.id)}>
                  <span className="filter__box" aria-hidden="true" />
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="menu-stage">
        <AnimatePresence mode="wait" initial={false}>
          <motion.aside key={`l-${active.id}`} className="menu-pins menu-pins--l" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Pinned name={pins[0].name} caption={pins[0].caption} r={-5} sizes="220px" />
          </motion.aside>
        </AnimatePresence>

        <section id="menu-panel" role="tabpanel" aria-labelledby={`tab-${active.id}`} className="menu-main">
          <AnimatePresence mode="wait">
            <motion.div key={active.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
              {active.id === 'feasting' ? (
                <div className="feasts">
                  <div className="feasts__head">
                    <h2 className="print feasts__title">Feasting</h2>
                    <p>{SERVED.feasting}</p>
                    {filters.length > 0 && (
                      <p className="menu-count" role="status">
                        Dishes that don’t match are faded.{' '}
                        <button type="button" className="linkish" onClick={() => setFilters([])}>
                          Clear
                        </button>
                      </p>
                    )}
                  </div>
                  <div className="feasts__cards">
                    {FEASTS.map((f) => (
                      <FeastCard key={f.id} f={f} filters={filters} />
                    ))}
                  </div>
                  <div className="feasts__foot">
                    <p>Both feasting menus are served in the private dining room upstairs and for hire of the whole building.</p>
                    <div className="actions">
                      <Link to="/private-hire" state={{ scrollTo: 'enquire' }} className="btn btn--ink">
                        Plan a party
                      </Link>
                      <Link to="/book" className="link">
                        Book a table
                      </Link>
                    </div>
                    <p className="small feasts__note">{SERVICE_NOTE}</p>
                  </div>
                </div>
              ) : (
                <article className={`arch menu-arch g-paper ${active.food ? '' : 'menu-arch--drinks'}`}>
                  <AMono />
                  <h2 className="print menu-arch__title">{active.title}</h2>
                  <p className="menu-arch__served">{SERVED[active.id]}</p>
                  {visible && filters.length > 0 && (
                    <p className="menu-count" role="status">
                      Showing {visible.shown} of {visible.total} · {filters.map((f) => FILTERS.find((x) => x.id === f)!.label.toLowerCase()).join(', ')}
                      {filters.includes('gf') ? ', including gluten-free options (gf*)' : ''}{' '}
                      <button type="button" className="linkish" onClick={() => setFilters([])}>
                        Clear
                      </button>
                    </p>
                  )}
                  <span className="menu-arch__rule" aria-hidden="true" />

                  {!active.food && (
                    <nav className="menu-jump" aria-label="Drinks sections">
                      {active.sections
                        .filter((s) => s.title)
                        .map((s) => (
                          <a
                            key={s.id}
                            href={`#${s.id}`}
                            className="sign"
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

                  {visible && visible.sections.length ? (
                    active.food ? (
                      <div className="msecs">
                        {visible.sections.map((s) => (
                          <Section key={s.id} s={s.title === active.title ? { ...s, title: undefined } : s} />
                        ))}
                      </div>
                    ) : (
                      <div className="menu-cols">
                        {balance(visible.sections).map((col, ci) => (
                          <div key={ci} className="menu-col">
                            {col.map(({ s, i }) => (
                              <Section key={s.id} order={i} s={s} />
                            ))}
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    <div className="menu-empty">
                      <p>Nothing on this menu matches every filter you’ve chosen.</p>
                      <button type="button" className="linkish" onClick={() => setFilters([])}>
                        Clear the filters
                      </button>
                    </div>
                  )}

                  <footer className="menu-arch__foot">
                    <p>{SERVICE_NOTE}</p>
                    <p className="menu-arch__key">v = vegetarian, vg = vegan, gf = gluten free, gf* = gluten free option available</p>
                    <div className="actions">
                      <Link to={book} className="btn btn--ink">
                        Book a table
                      </Link>
                      <Link to="/private-hire" className="link">
                        Private hire
                      </Link>
                    </div>
                  </footer>
                </article>
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        <AnimatePresence mode="wait" initial={false}>
          <motion.aside key={`r-${active.id}`} className="menu-pins menu-pins--r" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Pinned name={pins[1].name} caption={pins[1].caption} r={4} sizes="220px" />
          </motion.aside>
        </AnimatePresence>
      </div>
    </div>
  )
}

function price(i: MenuItem) {
  if (i.price) return i.price
  return (i.prices ?? []).filter((p) => p.price).map((p) => (p.label ? `${p.label} – ${p.price}` : p.price)).join(' | ')
}

/* Whole sections go to whichever column is shorter, so no section splits. */
function balance(sections: MenuSection[]) {
  const cols: { s: MenuSection; i: number }[][] = [[], []]
  const h = [0, 0]
  sections.forEach((s, i) => {
    const w = 3 + s.items.reduce((n, it) => n + (it.desc ? 2 : 1) + (it.extras ? 0.6 : 0), 0)
    const c = h[0] <= h[1] ? 0 : 1
    cols[c].push({ s, i })
    h[c] += w
  })
  return cols
}

function Section({ s, order }: { s: MenuSection; order?: number }) {
  const cols = s.columns
  return (
    <section className="msec" id={s.id} style={order !== undefined ? { order } : undefined} aria-labelledby={s.title || s.note ? `${s.id}-h` : undefined}>
      {(s.title || s.note || cols) && (
        <div className="msec__head">
          {s.title && (
            <h3 id={`${s.id}-h`} className="msec__title">
              {s.title}
            </h3>
          )}
          {s.note && (
            <p id={s.title ? undefined : `${s.id}-h`} className="msec__note">
              {s.note}
            </p>
          )}
          {cols && (
            <p className="msec__cols" aria-hidden="true">
              {cols.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </p>
          )}
        </div>
      )}
      <ul className="mitems">
        <AnimatePresence initial={false}>
          {s.items.map((i) => (
            <motion.li key={i.id} layout="position" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="mitem">
              {cols && i.prices ? (
                <div className="mitem__row">
                  <div className="mitem__main">
                    <p className="mitem__name">{i.name}</p>
                    {i.desc && <p className={`mitem__desc ${i.descItalic ? 'is-italic' : ''}`}>{i.desc}</p>}
                  </div>
                  <p className="mitem__cols">
                    {i.prices.map((p, k) => (
                      <span key={k} aria-label={p.price ? `${cols[k]} ${p.price}` : undefined}>
                        {p.price || ''}
                      </span>
                    ))}
                  </p>
                </div>
              ) : (
                <>
                  <p className="mitem__name">
                    <strong>{i.name}</strong> <span className="mitem__price">{price(i)}</span>
                  </p>
                  {(i.desc || i.diet) && (
                    <p className={`mitem__desc ${i.descItalic ? 'is-italic' : ''}`}>
                      {i.desc}
                      <Diet diet={i.diet} />
                    </p>
                  )}
                  {i.extras && <p className="mitem__extras">{i.extras.join(' | ')}</p>}
                </>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {s.footer && (
        <div className="msec__footer">
          {s.footer.map((f) => (
            <p key={f}>{f}</p>
          ))}
        </div>
      )}
    </section>
  )
}

/* Their feasting menus are printed in an arch on a yellow ground. */
export function FeastCard({ f, filters = [] }: { f: FeastMenu; filters?: Filter[] }) {
  const groups: [string, MenuItem[]][] = [
    ['To start', f.starters],
    ['To follow', f.mains],
    ...(f.dessert ? ([['To finish', f.dessert]] as [string, MenuItem[]][]) : []),
  ]
  return (
    <article className="feast arch g-paper" aria-labelledby={`${f.id}-title`}>
      <AMono />
      <h3 id={`${f.id}-title`} className="feast__title print">
        {f.title}
        <span className="feast__price">{f.price}</span>
      </h3>
      {groups.map(([label, items], gi) => (
        <div key={label} className="feast__group">
          <p className="sr-only">{label}</p>
          <ul>
            {items.map((i) => (
              <li key={i.id} className={matches(i, filters) ? '' : 'is-faded'}>
                <strong>{i.name}</strong>
                <span>
                  {i.desc}
                  <Diet diet={i.diet} />
                </span>
              </li>
            ))}
          </ul>
          {gi === 1 && (
            <p className="feast__sides">
              <em>{f.sidesLead}</em>
              <span>{f.id === 'feast-1' ? f.sides.join(' · ') : f.sides.join(' | ')}</span>
            </p>
          )}
        </div>
      ))}
    </article>
  )
}
