import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { HOURS_ROWS } from '../data/hours'
import { site } from '../data/site'
import { openStatus } from '../lib/london'
import { useMode, type Mode } from '../lib/mode'
import { Logo } from './Logo'
import { ModeToggle } from './ModeToggle'

const NAV = [
  { to: '/menu', label: 'Menus', hint: 'Brunch · lunch & dinner · feasting · drinks' },
  { to: '/private-hire', label: 'Private hire', hint: 'Up to 20 upstairs · 100 in the building' },
  { to: '/', label: 'Find us', hint: 'A minute from Herne Hill station', scrollTo: 'find-us' },
]

/* The bar takes the colour of whatever the page opens on. */
function groundFor(path: string, mode: Mode, overHero: boolean) {
  if (path === '/') return overHero ? 'photo' : mode === 'evening' ? 'night' : 'cream'
  if (path.startsWith('/menu')) return mode === 'evening' ? 'night' : 'feast'
  if (path.startsWith('/private-hire')) return 'wall'
  if (path.startsWith('/book')) return 'board'
  return 'cream'
}

export function Header() {
  const { scrollY } = useScroll()
  const [y, setY] = useState(0)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  const { mode, now } = useMode()
  const status = openStatus(now)

  useMotionValueEvent(scrollY, 'change', (v) => {
    const prev = scrollY.getPrevious() ?? 0
    setY(v)
    if (v < 160) setHidden(false)
    else if (v > prev + 6) setHidden(true)
    else if (v < prev - 10) setHidden(false)
  })
  useEffect(() => {
    document.documentElement.dataset.topHidden = String(hidden && !open)
  }, [hidden, open])
  useEffect(() => setOpen(false), [loc.pathname, loc.key])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  const home = loc.pathname === '/'
  const overHero = home && y < (typeof window === 'undefined' ? 800 : window.innerHeight * 0.86)
  const ground = open ? 'board' : groundFor(loc.pathname, mode, overHero)

  return (
    <header className={`top g-${ground} ${ground === 'photo' ? '' : 'is-solid'} ${hidden && !open ? 'is-hidden' : ''} ${home && overHero && !open ? 'is-over-hero' : ''}`}>
      <a
        href="#main"
        className="skip"
        onClick={(e) => {
          e.preventDefault()
          document.getElementById('main')?.focus()
        }}
      >
        Skip to content
      </a>
      <div className="top__inner">
        <Link to="/" className="top__brand" aria-label="Archie's Herne Hill, home">
          <Logo className="top__logo" />
        </Link>
        <nav className="top__nav" aria-label="Main">
          {NAV.map((n) => (
            <NavLink
              key={n.label}
              to={n.to}
              state={n.scrollTo ? { scrollTo: n.scrollTo } : undefined}
              end={n.to === '/'}
              className={({ isActive }) => `top__link sign ${isActive && !n.scrollTo ? 'is-active' : ''}`}
            >
              {n.label}
            </NavLink>
          ))}
          <a className="top__link sign" href={site.giftCards} target="_blank" rel="noreferrer">
            Gift cards
          </a>
        </nav>
        <div className="top__right">
          <ModeToggle className="top__mode" />
          <Link to="/book" className="btn btn--sm top__book">
            Book a table
          </Link>
          <button type="button" className={`burger ${open ? 'is-open' : ''}`} aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen((o) => !o)}>
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div id="site-menu" className="sheet g-board" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <p className="sheet__status">
              <span className={`dot ${status.open ? 'is-open' : ''}`} aria-hidden="true" /> {status.label}
              {/^(until|at) /.test(status.detail) ? ' ' : ' · '}
              {status.detail}
            </p>
            <nav className="sheet__nav" aria-label="Mobile">
              {[{ to: '/', label: 'Home', hint: '' }, ...NAV, { to: '/book', label: 'Book a table', hint: 'Brunch, lunch or dinner' }].map((n, i) => (
                <motion.div key={n.label} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 + i * 0.04, duration: 0.4 }}>
                  <Link to={n.to} state={'scrollTo' in n && n.scrollTo ? { scrollTo: n.scrollTo } : undefined} className="sheet__link" onClick={() => setOpen(false)}>
                    <span className="display">{n.label}</span>
                    {n.hint && <span className="sheet__hint">{n.hint}</span>}
                  </Link>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.26, duration: 0.4 }}>
                <a className="sheet__link" href={site.giftCards} target="_blank" rel="noreferrer">
                  <span className="display">Gift cards</span>
                  <span className="sheet__hint">Bought online</span>
                </a>
              </motion.div>
            </nav>
            <div className="sheet__info">
              {HOURS_ROWS.map((r) => (
                <p key={r.short}>
                  <span>{r.days}</span>
                  <span>{r.hours}</span>
                </p>
              ))}
              <p className="sheet__addr">{site.address.oneLine}</p>
              <ModeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
